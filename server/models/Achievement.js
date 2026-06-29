const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  badgeId: String,
  unlockedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Achievement', achievementSchema);
