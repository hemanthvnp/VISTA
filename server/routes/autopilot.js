const router = require('express').Router();
const auth = require('../middleware/auth');
const UserModelService = require('../services/UserModelService');
const UserModel = require('../models/UserModel');
const AdaptiveEngineService = require('../services/AdaptiveEngineService');
const ContentGenerationService = require('../services/ContentGenerationService');
const CoachingService = require('../services/CoachingService');
const { v4: uuidv4 } = require('uuid');

// ── User Model ───────────────────────────────────────────────────────────────

router.get('/user-model', auth, async (req, res) => {
  try {
    const model = await UserModelService.getOrCreate(req.user.userId);
    res.json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── AutoPilot Toggle ─────────────────────────────────────────────────────────

router.patch('/toggle', auth, async (req, res) => {
  try {
    const model = await UserModelService.getOrCreate(req.user.userId);
    const enabled = !model.autopilotEnabled;
    await UserModel.updateOne({ userId: req.user.userId }, { $set: { autopilotEnabled: enabled, updatedAt: new Date() } });
    res.json({ autopilotEnabled: enabled });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Adaptive Engine ──────────────────────────────────────────────────────────

router.get('/next-action', auth, async (req, res) => {
  try {
    const model = await UserModelService.getOrCreate(req.user.userId);
    const queue = AdaptiveEngineService.getNextActionQueue(model);
    res.json({ actions: queue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/next-action/:actionType/dismiss', auth, async (req, res) => {
  try {
    const { actionType } = req.params;
    const suppressedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const model = await UserModelService.getOrCreate(req.user.userId);
    const dismissals = model.actionDismissals || [];
    const existing = dismissals.find(d => d.actionType === actionType);
    if (existing) {
      existing.suppressedUntil = suppressedUntil;
    } else {
      dismissals.push({ actionType, suppressedUntil });
    }
    await UserModel.updateOne({ userId: req.user.userId }, { $set: { actionDismissals: dismissals, updatedAt: new Date() } });

    const updatedModel = await UserModelService.getOrCreate(req.user.userId);
    const queue = AdaptiveEngineService.getNextActionQueue(updatedModel);
    res.json({ actions: queue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Content Generation ───────────────────────────────────────────────────────

router.post('/content/flashcards', auth, async (req, res) => {
  try {
    const { topicId } = req.body;
    if (!topicId) return res.status(400).json({ message: 'topicId is required' });
    const cards = await ContentGenerationService.getFlashcards(topicId, req.user.userId);
    res.json({ flashcards: cards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/content/lesson-summary/:topicId', auth, async (req, res) => {
  try {
    const summary = await ContentGenerationService.getLessonSummary(req.params.topicId);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Coaching ─────────────────────────────────────────────────────────────────

router.get('/coaching/messages', auth, async (req, res) => {
  try {
    const model = await UserModelService.getOrCreate(req.user.userId);
    const messages = (model.coachingState?.activeMessages || [])
      .sort((a, b) => b.priority - a.priority);
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/coaching/messages/:id/ack', auth, async (req, res) => {
  try {
    await UserModel.updateOne(
      { userId: req.user.userId, 'coachingState.activeMessages.id': req.params.id },
      { $set: { 'coachingState.activeMessages.$.read': true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/coaching/messages/:id/dismiss', auth, async (req, res) => {
  try {
    const model = await UserModelService.getOrCreate(req.user.userId);
    const msg = (model.coachingState?.activeMessages || []).find(m => m.id === req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });

    const type = msg.type;
    const dismissed = model.coachingState?.dismissed || [];
    const entry = dismissed.find(d => d.type === type);
    const now = new Date();

    let suppressedUntil;
    if (entry) {
      const withinWeek = entry.lastDismissedAt && (now - entry.lastDismissedAt) < 7 * 24 * 60 * 60 * 1000;
      entry.count = withinWeek ? entry.count + 1 : 1;
      entry.lastDismissedAt = now;
      suppressedUntil = entry.count >= 3
        ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() + 24 * 60 * 60 * 1000);
      entry.suppressedUntil = suppressedUntil;
    } else {
      suppressedUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      dismissed.push({ type, count: 1, lastDismissedAt: now, suppressedUntil });
    }

    const activeMessages = (model.coachingState?.activeMessages || []).filter(m => m.id !== req.params.id);
    await UserModel.updateOne({ userId: req.user.userId }, {
      $set: {
        'coachingState.activeMessages': activeMessages,
        'coachingState.dismissed': dismissed,
        updatedAt: new Date(),
      },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
