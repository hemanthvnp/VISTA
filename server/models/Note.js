const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  techId: String,
  content: { type: String, default: '' },
  wordCount: { type: Number, default: 0 },
  lastEdited: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', noteSchema);
