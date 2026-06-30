const mongoose = require('mongoose');

const projectSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  repoUrl: { type: String, required: true },
  githubUsername: { type: String, required: true },
  demoUrl: { type: String, default: '' },
  notes: { type: String, default: '' },
  score: { type: Number, default: 0 },
  description: { type: String, default: '' },
  strengths: { type: String, default: '' },
  keyMistakes: { type: String, default: '' },
  professionalismFeedback: { type: String, default: '' },
  reviewFailed: { type: Boolean, default: false },
  attemptCount: { type: Number, default: 1 },
  bestScoreTier: { type: Number, default: 0 },
  xpAwarded: { type: Number, default: 0 },
  validatedAt: Date,
  reviewedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSubmissionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ProjectSubmission', projectSubmissionSchema);
