const mongoose = require('mongoose');

const weakKeySchema = new mongoose.Schema({
  key: String,
  errorRate: Number,
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

const coachingMessageSchema = new mongoose.Schema({
  id: String,
  type: String,
  message: String,
  priority: { type: Number, default: 1 },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const dismissedEntrySchema = new mongoose.Schema({
  type: String,
  count: { type: Number, default: 1 },
  lastDismissedAt: Date,
  suppressedUntil: Date,
}, { _id: false });

const actionDismissalSchema = new mongoose.Schema({
  actionType: String,
  suppressedUntil: Date,
}, { _id: false });

const userModelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  typingProfile: {
    wpmHistory: [{ wpm: Number, date: String }],
    avgWpm: { type: Number, default: 0 },
    weakKeys: [weakKeySchema],
    lastSession: Date,
    streakDays: { type: Number, default: 0 },
  },
  learningProfile: {
    completedTopics: [String],
    currentTopic: String,
    lessonScores: { type: Map, of: Number },
    recommendedNext: [String],
    lastActivity: Date,
  },
  flashcardProfile: {
    cardsDue: { type: Number, default: 0 },
    retentionRate: { type: Number, default: 0 },
    lastReview: Date,
  },
  coachingState: {
    activeMessages: [coachingMessageSchema],
    dismissed: [dismissedEntrySchema],
    lastNudge: Date,
  },
  actionDismissals: [actionDismissalSchema],
  autopilotEnabled: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserModel', userModelSchema);
