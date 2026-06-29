const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  techProgress: {
    type: Map,
    of: new mongoose.Schema({
      status: { type: String, default: 'not-started' },
      progress: { type: Number, default: 0 },
      hoursSpent: { type: Number, default: 0 },
    }, { _id: false }),
    default: {},
  },
  lessonProgress: { type: Map, of: Boolean, default: {} },
  levelProgress: { type: Map, of: Boolean, default: {} },
  personalBests: { type: Map, of: Number, default: {} },
  projectProgress: {
    type: Map,
    of: new mongoose.Schema({
      status: { type: String, default: 'not-started' },
      checklistItems: { type: Map, of: Boolean, default: {} },
    }, { _id: false }),
    default: {},
  },
});

module.exports = mongoose.model('Progress', progressSchema);
