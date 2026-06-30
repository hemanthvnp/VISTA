const mongoose = require('mongoose');

const mediumConnectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  encryptedToken: { type: String, required: true },
  authorId: { type: String, required: true },
  username: { type: String, required: true },
  connectedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MediumConnection', mediumConnectionSchema);
