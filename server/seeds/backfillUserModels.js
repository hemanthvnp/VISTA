// Load .env from server/ directory (same as index.js does when run from there)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const connectDB = require('../config/db');
const User = require('../models/User');
const UserModel = require('../models/UserModel');
const TypingSession = require('../models/TypingSession');

async function createUserModelForExistingUsers() {
  await connectDB();
  const users = await User.find({}, '_id');
  let created = 0;
  let skipped = 0;

  for (const user of users) {
    const existing = await UserModel.findOne({ userId: user._id });
    if (existing) { skipped++; continue; }

    // Pre-populate WPM history from existing typing sessions
    const sessions = await TypingSession.find({ userId: user._id, wasSkipped: { $ne: true } })
      .sort({ createdAt: 1 }).limit(50).select('wpm date');

    const wpmHistory = sessions.map(s => ({ wpm: s.wpm || 0, date: s.date || '' }));
    const avgWpm = wpmHistory.length > 0
      ? Math.round(wpmHistory.reduce((s, e) => s + e.wpm, 0) / wpmHistory.length)
      : 0;

    await UserModel.create({
      userId: user._id,
      typingProfile: { wpmHistory, avgWpm, weakKeys: [], lastSession: sessions.at(-1)?.createdAt },
    });
    created++;
  }

  console.log(`Backfill complete: ${created} created, ${skipped} already existed`);
  process.exit(0);
}

createUserModelForExistingUsers().catch(err => { console.error(err); process.exit(1); });
