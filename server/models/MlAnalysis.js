const mongoose = require('mongoose');

const mlAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionsTrained: Number,
  report: mongoose.Schema.Types.Mixed,
  geminiAdvice: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MlAnalysis', mlAnalysisSchema);
