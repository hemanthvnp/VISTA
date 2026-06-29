const router = require('express').Router();
const auth = require('../middleware/auth');
const { reviewPythonCode } = require('../services/gemini');

/** POST /api/python/review — AI review of a student's Python challenge solution */
router.post('/review', auth, async (req, res) => {
    try {
        const { code, challengeTitle, instructions } = req.body;
        if (!code || !code.trim()) {
            return res.status(400).json({ message: 'No code provided' });
        }
        const review = await reviewPythonCode(
            code,
            challengeTitle || 'Python Challenge',
            instructions || ''
        );
        res.json({ review });
    } catch (error) {
        console.error('Python review error:', error);
        res.status(500).json({ message: 'AI review failed. Please try again.' });
    }
});

module.exports = router;
