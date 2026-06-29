const router = require('express').Router();
const CodeSnippet = require('../models/CodeSnippet');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const snippets = await CodeSnippet.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const snippet = await CodeSnippet.create({
      userId: req.user.userId,
      ...req.body,
    });
    res.status(201).json(snippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!snippet) return res.status(404).json({ message: 'Snippet not found' });
    res.json({ message: 'Snippet deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
