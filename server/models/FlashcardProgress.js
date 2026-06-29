const mongoose = require('mongoose');

const flashcardProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cardId: String,
  timesReviewed: { type: Number, default: 0 },
  timesCorrect: { type: Number, default: 0 },
  difficulty: { type: String, default: 'medium' },
});

module.exports = mongoose.model('FlashcardProgress', flashcardProgressSchema);
