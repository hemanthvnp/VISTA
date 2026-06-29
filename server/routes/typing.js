const router = require('express').Router();
const TypingSession = require('../models/TypingSession');
const auth = require('../middleware/auth');

router.post('/session', auth, async (req, res) => {
  try {
    const session = await TypingSession.create({
      userId: req.user.userId,
      ...req.body,
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/sessions', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const sessions = await TypingSession.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-keypresses -backspaces');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const sessions = await TypingSession.find({
      userId: req.user.userId,
      wasSkipped: { $ne: true },
    });
    const today = new Date().toISOString().split('T')[0];
    const sessionsToday = sessions.filter(s => s.date === today).length;
    const totalSessions = sessions.length;
    const avgWpm = totalSessions > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.wpm || 0), 0) / totalSessions)
      : 0;
    const avgAccuracy = totalSessions > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / totalSessions)
      : 0;
    const bestWpm = totalSessions > 0
      ? Math.max(...sessions.map(s => s.wpm || 0))
      : 0;
    const totalPracticeSeconds = sessions.reduce((sum, s) => sum + (s.durationSecs || 0), 0);
    const gateCount = sessions.filter(s => s.isGate).length;
    const gateNoSkip = sessions.filter(s => s.isGate && !s.wasSkipped).length;

    res.json({
      totalSessions,
      sessionsToday,
      avgWpm,
      avgAccuracy,
      bestWpm,
      totalPracticeSeconds,
      gateCount,
      gateNoSkip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
