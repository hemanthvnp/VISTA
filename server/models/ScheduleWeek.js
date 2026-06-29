const mongoose = require('mongoose');

const scheduleWeekSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  weekNumber: Number,
  techId: String,
  topic: String,
  task: String,
  targetHours: { type: Number, default: 3 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScheduleWeek', scheduleWeekSchema);
