require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
const CoachingService = require('./services/CoachingService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/typing', require('./routes/typing'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/learning', require('./routes/learning'));
app.use('/api/tutor', require('./routes/tutor'));
app.use('/api/snippets', require('./routes/snippets'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/python', require('./routes/python'));
app.use('/api/autopilot', require('./routes/autopilot'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/code', require('./routes/codeRunner'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`V server running on port ${PORT}`);
  });

  // Daily coaching check at 08:00 server time
  cron.schedule('0 8 * * *', () => {
    CoachingService.evaluateAll().catch(err =>
      console.error('[Cron] Daily coaching job failed:', err.message)
    );
  });
});
