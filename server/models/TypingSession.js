const mongoose = require('mongoose');

const typingSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: String,
  mode: String,
  durationSecs: Number,
  wpm: Number,
  accuracy: Number,
  lessonId: String,
  isGate: { type: Boolean, default: false },
  wasSkipped: { type: Boolean, default: false },
  keypresses: [{
    key: String,
    expectedKey: String,
    isCorrect: Boolean,
    timestampMs: Number,
    prevKey: String,
    holdMs: Number,
    interKeyMs: Number,
  }],
  backspaces: [{
    errorKey: String,
    correctionMs: Number,
    timestampMs: Number,
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TypingSession', typingSessionSchema);
