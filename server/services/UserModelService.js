const UserModel = require('../models/UserModel');

const MAX_WPM_HISTORY = 50;

async function getOrCreate(userId) {
  let model = await UserModel.findOne({ userId });
  if (!model) {
    model = await UserModel.create({ userId });
  }
  return model;
}

async function updateTypingProfile(userId, sessionData) {
  const { wpm, accuracy, keypresses = [], date } = sessionData;
  const model = await getOrCreate(userId);

  // Append WPM entry, keep last 50
  const entry = { wpm: wpm || 0, date: date || new Date().toISOString().split('T')[0] };
  const wpmHistory = [...(model.typingProfile.wpmHistory || []), entry].slice(-MAX_WPM_HISTORY);

  const avgWpm = wpmHistory.length > 0
    ? Math.round(wpmHistory.reduce((s, e) => s + e.wpm, 0) / wpmHistory.length)
    : 0;

  // Compute weak keys from keypresses
  const keyStats = {};
  for (const kp of keypresses) {
    if (!kp.expectedKey) continue;
    const k = kp.expectedKey;
    if (!keyStats[k]) keyStats[k] = { correct: 0, total: 0 };
    keyStats[k].total++;
    if (!kp.isCorrect) keyStats[k].correct--;
    else keyStats[k].correct++;
  }

  const newWeakKeys = Object.entries(keyStats)
    .map(([key, s]) => ({ key, errorRate: s.total > 0 ? (s.total - s.correct) / s.total : 0 }))
    .filter(e => e.errorRate > 0.1);

  // Merge with existing weak keys
  const existingMap = new Map((model.typingProfile.weakKeys || []).map(k => [k.key, k]));
  for (const wk of newWeakKeys) existingMap.set(wk.key, { ...wk, updatedAt: new Date() });
  const weakKeys = Array.from(existingMap.values());

  await UserModel.updateOne({ userId }, {
    $set: {
      'typingProfile.wpmHistory': wpmHistory,
      'typingProfile.avgWpm': avgWpm,
      'typingProfile.weakKeys': weakKeys,
      'typingProfile.lastSession': new Date(),
      updatedAt: new Date(),
    },
  });
}

async function updateLearningProfile(userId, topicId, score) {
  const model = await getOrCreate(userId);

  const completed = model.learningProfile.completedTopics || [];
  if (!completed.includes(topicId)) completed.push(topicId);

  const scoresUpdate = { [`learningProfile.lessonScores.${topicId}`]: score };

  await UserModel.updateOne({ userId }, {
    $set: {
      'learningProfile.completedTopics': completed,
      'learningProfile.currentTopic': topicId,
      'learningProfile.lastActivity': new Date(),
      ...scoresUpdate,
      updatedAt: new Date(),
    },
  });
}

async function updateFlashcardProfile(userId, reviewData) {
  const { correct = 0, total = 0, cardsDue = 0 } = reviewData;
  const retentionRate = total > 0 ? Math.round((correct / total) * 100) : 0;

  await UserModel.updateOne({ userId }, {
    $set: {
      'flashcardProfile.cardsDue': cardsDue,
      'flashcardProfile.retentionRate': retentionRate,
      'flashcardProfile.lastReview': new Date(),
      updatedAt: new Date(),
    },
  });
}

module.exports = { getOrCreate, updateTypingProfile, updateLearningProfile, updateFlashcardProfile };
