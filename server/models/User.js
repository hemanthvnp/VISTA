const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  activeTechId: { type: String, default: 'python' },
  onboardingComplete: { type: Boolean, default: false },
  weeklyHourTarget: { type: Number, default: 3 },
  reminderEnabled: { type: Boolean, default: false },
  reminderTime: { type: String, default: '09:00' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  rank: { type: String, default: 'Dormant NPC' },
  streak: {
    count: { type: Number, default: 0 },
    lastDate: { type: String, default: '' },
    type: { type: String, default: '' },
    bestEver: { type: Number, default: 0 },
  },
  lastGateDate: { type: String, default: '' },
  gateSkipCount: { type: Number, default: 0 },
  gateDurationMinutes: { type: Number, default: 5 },
  theme: { type: String, default: 'system' },
  totalStudySeconds: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
