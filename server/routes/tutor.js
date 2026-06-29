const router = require('express').Router();
const ChatHistory = require('../models/ChatHistory');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { chatWithTutor } = require('../services/gemini');

router.get('/history', auth, async (req, res) => {
  try {
    let history = await ChatHistory.findOne({ userId: req.user.userId });
    if (!history) {
      history = await ChatHistory.create({ userId: req.user.userId, messages: [] });
    }
    res.json(history.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const user = await User.findById(req.user.userId);

    let history = await ChatHistory.findOne({ userId: req.user.userId });
    if (!history) {
      history = await ChatHistory.create({ userId: req.user.userId, messages: [] });
    }

    history.messages.push({ role: 'user', content: message });

    const userState = {
      activeTech: user.activeTechId || 'python',
      totalHours: Math.round((user.totalStudySeconds || 0) / 3600),
      level: user.level || 1,
      rank: user.rank || 'Dormant NPC',
    };

    // Call Gemini — let real errors surface so we can debug them
    let response;
    try {
      response = await chatWithTutor(
        history.messages.map(m => ({ role: m.role, content: m.content })),
        userState
      );
    } catch (aiError) {
      console.error('[Gemini tutor error]', aiError?.message || aiError);
      return res.status(502).json({
        message: 'Gemini API error: ' + (aiError?.message || String(aiError)),
      });
    }

    history.messages.push({ role: 'model', content: response });

    // Keep only last 50 messages
    if (history.messages.length > 50) {
      history.messages = history.messages.slice(-50);
    }

    await history.save();

    // Return both field names so client works regardless of which it reads
    res.json({ response, reply: response, messages: history.messages });
  } catch (error) {
    console.error('[Tutor route error]', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

