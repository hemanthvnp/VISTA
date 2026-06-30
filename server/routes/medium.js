const router = require('express').Router();
const auth = require('../middleware/auth');
const MediumConnection = require('../models/MediumConnection');
const MediumService = require('../services/MediumService');
const { encrypt } = require('../utils/encryption');

router.post('/connect', auth, async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(422).json({ type: 'validation', field: 'token', message: 'A Medium Integration Token is required.' });
    }

    const validation = await MediumService.validateToken(token);
    if (!validation.ok) {
      return res.status(422).json({ type: 'medium_api', message: validation.message });
    }

    const encryptedToken = encrypt(token);
    await MediumConnection.findOneAndUpdate(
      { userId: req.user.userId },
      {
        userId: req.user.userId,
        encryptedToken,
        authorId: validation.authorId,
        username: validation.username,
        connectedAt: new Date(),
      },
      { upsert: true }
    );

    res.json({ connected: true, username: validation.username, connectedAt: new Date() });
  } catch (error) {
    console.error('Medium connect error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/status', auth, async (req, res) => {
  try {
    const connection = await MediumConnection.findOne({ userId: req.user.userId });
    if (!connection) return res.json({ connected: false });
    res.json({ connected: true, username: connection.username, connectedAt: connection.connectedAt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/disconnect', auth, async (req, res) => {
  try {
    await MediumConnection.findOneAndDelete({ userId: req.user.userId });
    res.json({ connected: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
