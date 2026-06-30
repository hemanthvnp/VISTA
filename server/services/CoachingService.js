const UserModel = require('../models/UserModel');
const { v4: uuidv4 } = require('uuid');

const SUPPRESSION_1 = 24 * 60 * 60 * 1000;
const SUPPRESSION_7 = 7 * 24 * 60 * 60 * 1000;

function isSuppressed(coachingState, type) {
  const dismissed = coachingState?.dismissed || [];
  const entry = dismissed.find(d => d.type === type);
  if (!entry?.suppressedUntil) return false;
  return new Date(entry.suppressedUntil) > new Date();
}

function hasActiveMessage(coachingState, type) {
  return (coachingState?.activeMessages || []).some(m => m.type === type);
}

function buildMessage(type, message, priority = 1) {
  return { id: uuidv4(), type, message, priority, read: false, createdAt: new Date() };
}

function detectReEngagement(model) {
  const timestamps = [
    model.typingProfile?.lastSession,
    model.flashcardProfile?.lastReview,
    model.learningProfile?.lastActivity,
  ].filter(Boolean).map(d => new Date(d).getTime());

  if (timestamps.length === 0) return null;
  const mostRecent = Math.max(...timestamps);
  const hoursSince = (Date.now() - mostRecent) / (1000 * 60 * 60);
  if (hoursSince >= 48) {
    return buildMessage('re-engagement', `You haven't studied in ${Math.floor(hoursSince / 24)} days. Even a quick lesson or flashcard set keeps your streak alive!`, 2);
  }
  return null;
}

function detectRetentionGap(model) {
  const { retentionRate, lastReview } = model.flashcardProfile || {};
  if (!lastReview || retentionRate === undefined) return null;
  if (retentionRate < 50) {
    return buildMessage('skill-gap', `Your flashcard retention is at ${retentionRate}%. A focused review session will help it stick.`, 3);
  }
  return null;
}

const DETECTORS = [detectReEngagement, detectRetentionGap];

async function evaluateUser(userModel) {
  const newMessages = [];
  for (const detect of DETECTORS) {
    const msg = detect(userModel);
    if (!msg) continue;
    if (isSuppressed(userModel.coachingState, msg.type)) continue;
    if (hasActiveMessage(userModel.coachingState, msg.type)) continue;
    newMessages.push(msg);
  }

  if (newMessages.length > 0) {
    const existing = userModel.coachingState?.activeMessages || [];
    await UserModel.updateOne({ userId: userModel.userId }, {
      $set: {
        'coachingState.activeMessages': [...existing, ...newMessages],
        'coachingState.lastNudge': new Date(),
        updatedAt: new Date(),
      },
    });
  }

  return newMessages;
}

async function evaluateAll() {
  const models = await UserModel.find({ autopilotEnabled: true });
  let evaluated = 0;
  for (const model of models) {
    try {
      await evaluateUser(model);
      evaluated++;
    } catch (err) {
      console.error(`[CoachingService] evaluateAll failed for user ${model.userId}:`, err.message);
    }
  }
  console.log(`[CoachingService] Daily coaching run complete: ${evaluated}/${models.length} users evaluated`);
}

module.exports = { evaluateUser, evaluateAll };
