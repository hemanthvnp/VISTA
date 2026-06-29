/**
 * Feature-level LLM functions used by routes.
 *
 * These keep the original function names ("gemini.js") for backwards
 * compatibility, but each call is now routed through llmProvider, which
 * decides per-feature whether to use Gemini or a local LM Studio model.
 *
 * Provider routing is controlled by env vars — see llmProvider.js.
 */

const { generate, chat, stripJsonFences } = require('./llmProvider');

/**
 * Typing coach advice from an ML report.
 * Feature key: "typingAdvice"
 *
 * When routed to LM Studio, a GBNF grammar will be attached in step 2 to
 * guarantee valid JSON. For now this still works against either provider —
 * Gemini follows the JSON instruction reliably.
 */
const getTypingAdvice = async (analysisReport, userState, opts = {}) => {
  const prompt = `You are a typing coach analyzing an ML report. Return ONLY valid JSON with no extra text or markdown.
Report: ${JSON.stringify(analysisReport)}
User WPM: ${userState.wpm}, Goal: 70+ WPM
Return exactly this JSON structure:
{
  "summary": "2 sentence summary of their typing profile",
  "improvements": [
    {"priority": 1, "action": "specific action", "reason": "why this helps"},
    {"priority": 2, "action": "specific action", "reason": "why this helps"},
    {"priority": 3, "action": "specific action", "reason": "why this helps"}
  ],
  "bonus_drills": [
    {"id": "drill-1", "title": "drill name", "description": "what to practice", "duration_secs": 120, "target": "target keys or pattern"},
    {"id": "drill-2", "title": "drill name", "description": "what to practice", "duration_secs": 120, "target": "target keys or pattern"},
    {"id": "drill-3", "title": "drill name", "description": "what to practice", "duration_secs": 120, "target": "target keys or pattern"}
  ],
  "motivation": "1 sentence motivational message"
}`;

  const { text } = await generate({
    feature: 'typingAdvice',
    prompt,
    providerOverride: opts.providerOverride,
    temperature: 0.6,
    maxTokens: 1024,
  });
  return JSON.parse(stripJsonFences(text));
};

/**
 * Multi-turn AI Tutor chat.
 * Feature key: "tutor"
 */
const chatWithTutor = async (messages, userState, opts = {}) => {
  const systemPrompt = `You are the AI Tutor inside V — a personal learning app for developers.
Student's active technology: ${userState.activeTech}
Current total study hours: ${userState.totalHours}
XP Level: ${userState.level} (${userState.rank})
Rules: Connect answers to their learning context. Be specific and practical. Use code examples when relevant. Keep responses under 400 words. Format with markdown for readability.`;

  const { text } = await chat({
    feature: 'tutor',
    systemPrompt,
    messages,
    providerOverride: opts.providerOverride,
    temperature: 0.7,
    maxTokens: 1024,
  });
  return text;
};

/**
 * Python code review.
 * Feature key: "codeReview"
 *
 * Accepts an optional `providerOverride` so the client can pick
 * "Quick review (local)" vs "Deep review (Gemini)" at request time.
 */
const reviewPythonCode = async (code, challengeTitle, instructions, opts = {}) => {
  const prompt = `You are a friendly Python tutor reviewing a student's challenge solution inside a coding learning app.

Challenge: "${challengeTitle}"
Instructions: ${instructions}

Student's code:
\`\`\`python
${code}
\`\`\`

Give a concise, encouraging review in 3–5 sentences covering:
1. Whether the approach is correct and why
2. One specific thing they did well
3. One concrete improvement or alternative approach (if any)

Keep it conversational, supportive, and practical. Do NOT use markdown headers. Plain text only.`;

  const { text } = await generate({
    feature: 'codeReview',
    prompt,
    providerOverride: opts.providerOverride,
    // For LM Studio path we'll prefer the coder model
    model: opts.model,
    temperature: 0.5,
    maxTokens: 512,
  });
  return text.trim();
};

/**
 * Flashcard generator.
 * Feature key: "flashcards"
 */
const generateFlashcards = async (techId, opts = {}) => {
  const prompt = `You are a flashcard generator for a developer learning app. Generate exactly 10 flashcards for the technology: "${techId}".

Return ONLY valid JSON with no extra text or markdown. Return exactly this JSON structure:
{
  "flashcards": [
    { "front": "question text", "back": "answer text", "difficulty": "easy|medium|hard" },
    ...
  ]
}

Rules:
- Generate exactly 10 flashcards
- Mix difficulties: ~3 easy, ~4 medium, ~3 hard
- Questions should be practical and useful for developers
- Answers should be concise (1-3 sentences)
- Cover different subtopics within the technology
- Do NOT repeat common beginner questions — aim for useful, interview-level content`;

  const { text } = await generate({
    feature: 'flashcards',
    prompt,
    providerOverride: opts.providerOverride,
    temperature: 0.8,
    maxTokens: 2048,
  });
  return JSON.parse(stripJsonFences(text));
};

module.exports = { getTypingAdvice, chatWithTutor, reviewPythonCode, generateFlashcards };
