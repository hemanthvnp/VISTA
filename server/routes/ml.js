const router = require('express').Router();
const TypingSession = require('../models/TypingSession');
const MlAnalysis = require('../models/MlAnalysis');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { runMlAnalysis } = require('../services/mlBridge');
const { getTypingAdvice } = require('../services/gemini');

router.post('/analyze', auth, async (req, res) => {
  try {
    const sessions = await TypingSession.find({
      userId: req.user.userId,
      wasSkipped: { $ne: true },
    }).sort({ createdAt: -1 }).limit(100);

    if (sessions.length < 3) {
      return res.status(400).json({
        message: 'Need at least 3 typing sessions for ML analysis',
      });
    }

    const sessionData = sessions.map(s => ({
      date: s.date,
      mode: s.mode,
      durationSecs: s.durationSecs,
      wpm: s.wpm,
      accuracy: s.accuracy,
      keypresses: s.keypresses,
      backspaces: s.backspaces,
    }));

    let report;
    try {
      report = await runMlAnalysis(sessionData);
    } catch (mlError) {
      return res.status(500).json({ message: 'ML analysis failed: ' + mlError.message });
    }

    const analysis = await MlAnalysis.create({
      userId: req.user.userId,
      sessionsTrained: sessions.length,
      report,
    });

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/report', auth, async (req, res) => {
  try {
    const analysis = await MlAnalysis.findOne({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    if (!analysis) {
      return res.json(null);
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/gemini-overview', auth, async (req, res) => {
  try {
    const analysis = await MlAnalysis.findOne({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    if (!analysis) {
      return res.status(404).json({ message: 'No ML analysis found' });
    }

    const user = await User.findById(req.user.userId);
    const userState = {
      wpm: analysis.report?.currentWpm || 0,
      level: user.level,
      rank: user.rank,
    };

    const advice = await getTypingAdvice(analysis.report, userState);
    analysis.geminiAdvice = advice;
    await analysis.save();

    res.json(advice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
