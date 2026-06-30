const UserModelService = require('../services/UserModelService');

async function trackActivity(type, payload, userId) {
  try {
    if (type === 'typing_session') {
      await UserModelService.updateTypingProfile(userId, payload);
    } else if (type === 'lesson_complete') {
      await UserModelService.updateLearningProfile(userId, payload.topicId, payload.score || 100);
    } else if (type === 'flashcard_review') {
      await UserModelService.updateFlashcardProfile(userId, payload);
    }
  } catch (err) {
    console.error(`[activityTracker] Failed to track ${type}:`, err.message);
  }
}

module.exports = { trackActivity };
