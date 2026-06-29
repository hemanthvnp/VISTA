const mongoose = require('mongoose');

const codeSnippetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  language: String,
  code: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CodeSnippet', codeSnippetSchema);
