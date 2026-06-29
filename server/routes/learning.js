const router = require('express').Router();
const FlashcardProgress = require('../models/FlashcardProgress');
const ScheduleWeek = require('../models/ScheduleWeek');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const { generateFlashcards } = require('../services/gemini');

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
    const note = await Note.findOneAndUpdate(
      { userId: req.user.userId, techId: req.params.techId },
      { content, wordCount, lastEdited: new Date() },
      { new: true, upsert: true }
    );
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
