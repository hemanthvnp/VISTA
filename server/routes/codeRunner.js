const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Point to self-hosted Piston. Override via PISTON_URL in server/.env.
const PISTON_URL = process.env.PISTON_URL || 'http://localhost:2000/api/v2';

router.post('/run', auth, async (req, res) => {
  const { language, filename, code, stdin = '', version = '*' } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'language and code are required.' });
  }

  try {
    const response = await fetch(`${PISTON_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        version,
        files: [{ name: filename || 'main', content: code }],
        stdin,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return res.status(502).json({ error: `Piston returned ${response.status}.`, detail: text });
    }

    const data = await response.json();
    return res.json({
      stdout:       data?.run?.stdout       ?? '',
      stderr:       data?.run?.stderr       ?? '',
      compileError: data?.compile?.stderr   ?? '',
      exitCode:     data?.run?.code         ?? 0,
    });
  } catch (err) {
    console.error('[CodeRunner]', err.message);
    return res.status(500).json({ error: 'Piston is unreachable. Is Docker running? Run: docker compose up -d' });
  }
});

module.exports = router;
