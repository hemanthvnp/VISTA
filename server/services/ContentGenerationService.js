const { generate, stripJsonFences } = require('./llmProvider');
const mongoose = require('mongoose');

// ── Fallbacks ────────────────────────────────────────────────────────────────

const FALLBACK_SUMMARY = 'This topic covers core programming concepts. Review the lesson materials to build your understanding.';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getSharedCache(topicId) {
  const db = mongoose.connection.db;
  return db.collection('contentCache').findOne({ topicId });
}

async function setSharedCache(topicId, data) {
  const db = mongoose.connection.db;
  await db.collection('contentCache').updateOne(
    { topicId },
    { $set: { topicId, ...data, cachedAt: new Date() } },
    { upsert: true }
  );
}

// ── Flashcards ───────────────────────────────────────────────────────────────

async function getFlashcards(topicId, userId) {
  let cards = [];
  try {
    const prompt = `Generate 7 flashcards for the programming topic: "${topicId}". Return a JSON array of objects with "front" (question, max 80 chars) and "back" (answer, max 150 chars). Return only the JSON array.`;
    const { text } = await generate({ feature: 'flashcards', prompt });
    const parsed = JSON.parse(stripJsonFences(text));
    cards = Array.isArray(parsed) ? parsed.slice(0, 10).map((c, i) => ({
      id: `autopilot-${topicId}-${Date.now()}-${i}`,
      topicId,
      front: c.front || '',
      back: c.back || '',
      generated: true,
      autopilot: true,
    })) : [];
  } catch (err) {
    console.error('[ContentGen] flashcard generation failed:', err.message);
  }
  return cards;
}

// ── Lesson Summary ───────────────────────────────────────────────────────────

async function getLessonSummary(topicId) {
  const cached = await getSharedCache(topicId);
  if (cached?.summary) return cached.summary;

  let summary = FALLBACK_SUMMARY;
  try {
    const prompt = `Write a 2-3 sentence plain-English summary of the programming topic: "${topicId}". Focus on what it is and why it matters. Return only the summary text.`;
    const { text } = await generate({ feature: 'tutor', prompt });
    summary = text.trim().slice(0, 500);
  } catch (err) {
    console.error('[ContentGen] lesson summary generation failed:', err.message);
  }

  await setSharedCache(topicId, { summary });
  return summary;
}

module.exports = { getFlashcards, getLessonSummary };
