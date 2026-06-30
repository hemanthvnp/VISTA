const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  techId: String,
  content: { type: String, default: '' },
  wordCount: { type: Number, default: 0 },
  lastEdited: { type: Date, default: Date.now },
  qualityScore: { type: Number, default: null },
  qualityFeedback: {
    clarity: String,
    depth: String,
    structure: String,
    completeness: String,
  },
  qualityCheckedAt: Date,
  scoredContentHash: String,
  mediumPostUrl: String,
  publishedAt: Date,
});

module.exports = mongoose.model('Note', noteSchema);
