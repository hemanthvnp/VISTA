const router = require('express').Router();
const FlashcardProgress = require('../models/FlashcardProgress');
const ScheduleWeek = require('../models/ScheduleWeek');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const { generateFlashcards, generateSchedule } = require('../services/gemini');
const { trackActivity } = require('../utils/activityTracker');
const CoachingService = require('../services/CoachingService');
const UserModelService = require('../services/UserModelService');
const NoteQualityService = require('../services/NoteQualityService');
const MediumConnection = require('../models/MediumConnection');
const MediumService = require('../services/MediumService');
const { decrypt } = require('../utils/encryption');

const PUBLISH_THRESHOLD = 70;

function deriveTitle(content, techId) {
  const firstLine = (content || '').split('\n').find((l) => l.trim());
  if (firstLine) {
    const cleaned = firstLine.replace(/^#+\s*/, '').trim().slice(0, 100);
    if (cleaned) return cleaned;
  }
  return `${techId} Notes`;
}

// Flashcards are served from the seed data stored in MongoDB 'flashcards' collection
const mongoose = require('mongoose');

router.get('/flashcards', auth, async (req, res) => {
  try {
    const { techId } = req.query;
    const db = mongoose.connection.db;
    const query = techId ? { techId } : {};
    const flashcards = await db.collection('flashcards').find(query).toArray();
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/flashcards/generate', auth, async (req, res) => {
  try {
    const { techId } = req.body;
    if (!techId) return res.status(400).json({ message: 'techId is required' });

    const result = await generateFlashcards(techId);
    const cards = (result.flashcards || []).map((card, i) => ({
      id: `gen-${techId}-${Date.now()}-${i}`,
      techId,
      front: card.front,
      back: card.back,
      difficulty: card.difficulty || 'medium',
      generated: true,
    }));

    const db = mongoose.connection.db;
    if (cards.length > 0) {
      await db.collection('flashcards').insertMany(cards);
    }

    res.json({ flashcards: cards });
  } catch (error) {
    console.error('Flashcard generation error:', error);
    res.status(500).json({ message: 'Failed to generate flashcards' });
  }
});

router.put('/flashcards/:cardId/progress', auth, async (req, res) => {
  try {
    const progress = await FlashcardProgress.findOneAndUpdate(
      { userId: req.user.userId, cardId: req.params.cardId },
      { $set: req.body, userId: req.user.userId, cardId: req.params.cardId },
      { new: true, upsert: true }
    );
    res.json(progress);
    // Fire-and-forget: track flashcard review, then run coaching evaluation
    if (req.body.correct !== undefined || req.body.total !== undefined) {
      trackActivity('flashcard_review', {
        correct: req.body.correct || 0,
        total: req.body.total || 1,
        cardsDue: req.body.cardsDue || 0,
      }, req.user.userId).then(async () => {
        try {
          const model = await UserModelService.getOrCreate(req.user.userId);
          if (model.autopilotEnabled) await CoachingService.evaluateUser(model);
        } catch (e) { /* non-fatal */ }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Schedule routes
router.get('/schedule', auth, async (req, res) => {
  try {
    const weeks = await ScheduleWeek.find({ userId: req.user.userId })
      .sort({ weekNumber: 1 });
    res.json(weeks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/schedule', auth, async (req, res) => {
  try {
    const week = await ScheduleWeek.create({
      userId: req.user.userId,
      ...req.body,
    });
    res.status(201).json(week);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// AI-optimized schedule generation from a short intake questionnaire.
// If `replace` is true, the user's existing weeks are cleared first.
router.post('/schedule/generate', auth, async (req, res) => {
  try {
    const {
      techIds = [],
      skillLevel = 'beginner',
      goal = '',
      weeks = 8,
      hoursPerWeek = 5,
      focus = '',
      replace = true,
    } = req.body;

    if (!Array.isArray(techIds) || techIds.length === 0) {
      return res.status(400).json({ message: 'Select at least one technology' });
    }
    const weekCount = Math.min(Math.max(parseInt(weeks, 10) || 8, 1), 26);

    let plan;
    try {
      plan = await generateSchedule({
        techIds,
        skillLevel,
        goal,
        weeks: weekCount,
        hoursPerWeek,
        focus,
      });
    } catch (aiError) {
      console.error('[Schedule generate AI error]', aiError?.message || aiError);
      return res.status(502).json({ message: 'AI schedule generation failed: ' + (aiError?.message || String(aiError)) });
    }

    const rawWeeks = Array.isArray(plan?.weeks) ? plan.weeks : [];
    if (rawWeeks.length === 0) {
      return res.status(502).json({ message: 'AI returned an empty plan; please try again' });
    }

    // Sanitize the model output; only trust known techIds, coerce numbers.
    const cleaned = rawWeeks
      .map((w, i) => ({
        userId: req.user.userId,
        weekNumber: Number.isFinite(w.weekNumber) ? w.weekNumber : i + 1,
        techId: techIds.includes(w.techId) ? w.techId : techIds[0],
        topic: String(w.topic || 'Study topic').slice(0, 120),
        task: String(w.task || '').slice(0, 400),
        targetHours: Math.min(Math.max(parseInt(w.targetHours, 10) || hoursPerWeek, 1), 40),
      }))
      .sort((a, b) => a.weekNumber - b.weekNumber)
      .map((w, i) => ({ ...w, weekNumber: i + 1 }));

    if (replace) {
      await ScheduleWeek.deleteMany({ userId: req.user.userId });
    } else {
      const existing = await ScheduleWeek.countDocuments({ userId: req.user.userId });
      cleaned.forEach((w, i) => { w.weekNumber = existing + i + 1; });
    }

    const created = await ScheduleWeek.insertMany(cleaned);
    res.status(201).json({ weeks: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/schedule/:id', auth, async (req, res) => {
  try {
    const week = await ScheduleWeek.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!week) return res.status(404).json({ message: 'Week not found' });
    res.json(week);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/schedule/:id', auth, async (req, res) => {
  try {
    const week = await ScheduleWeek.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!week) return res.status(404).json({ message: 'Week not found' });
    res.json({ message: 'Week deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Notes routes
router.get('/notes/:techId', auth, async (req, res) => {
  try {
    let note = await Note.findOne({
      userId: req.user.userId,
      techId: req.params.techId,
    });
    if (!note) {
      note = await Note.create({
        userId: req.user.userId,
        techId: req.params.techId,
      });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/notes/:techId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;

    const existing = await Note.findOne({ userId: req.user.userId, techId: req.params.techId });
    const contentChanged = existing ? existing.content !== content : true;

    const update = { content, wordCount, lastEdited: new Date() };
    if (contentChanged) {
      update.qualityScore = null;
      update.qualityFeedback = null;
      update.qualityCheckedAt = null;
      update.scoredContentHash = null;
    }

    const note = await Note.findOneAndUpdate(
      { userId: req.user.userId, techId: req.params.techId },
      update,
      { new: true, upsert: true }
    );
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/notes/:techId/quality-check', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ userId: req.user.userId, techId: req.params.techId });
    if (!note || !note.content?.trim()) {
      return res.status(422).json({ type: 'validation', message: 'Write some notes before requesting a quality check.' });
    }

    const currentHash = NoteQualityService.hashContent(note.content);
    if (note.scoredContentHash === currentHash && note.qualityScore !== null && note.qualityScore !== undefined) {
      return res.json(note);
    }

    const result = await NoteQualityService.checkQuality(note.content);
    if (result.error) {
      return res.status(502).json({ type: 'llm_error', message: 'Could not complete the quality check. Please try again.' });
    }

    note.qualityScore = result.score;
    note.qualityFeedback = result.feedback;
    note.qualityCheckedAt = new Date();
    note.scoredContentHash = currentHash;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Note quality check error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/notes/:techId/publish', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ userId: req.user.userId, techId: req.params.techId });
    if (!note) return res.status(404).json({ message: 'Note not found.' });

    const currentHash = NoteQualityService.hashContent(note.content);
    const scoreIsCurrent = note.scoredContentHash === currentHash;
    if (!scoreIsCurrent || note.qualityScore === null || note.qualityScore === undefined || note.qualityScore < PUBLISH_THRESHOLD) {
      return res.status(422).json({
        type: 'validation',
        message: `This note needs a current quality score of ${PUBLISH_THRESHOLD} or higher before it can be published. Run a Check Quality first.`,
      });
    }

    const connection = await MediumConnection.findOne({ userId: req.user.userId });
    if (!connection) {
      return res.status(422).json({ type: 'validation', message: 'Connect your Medium account before publishing.' });
    }

    const token = decrypt(connection.encryptedToken);
    const title = deriveTitle(note.content, req.params.techId);
    const publishResult = await MediumService.publishPost({
      token,
      authorId: connection.authorId,
      title,
      content: note.content,
    });

    if (!publishResult.ok) {
      return res.status(502).json({ type: 'medium_api', message: publishResult.message });
    }

    note.mediumPostUrl = publishResult.url;
    note.publishedAt = publishResult.publishedAt;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Note publish error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
