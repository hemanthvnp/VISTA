const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Get typing coaching advice from Gemini based on ML analysis report
 */
const getTypingAdvice = async (analysisReport, userState) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
};

/**
 * Chat with the AI Tutor using Gemini
 */
const chatWithTutor = async (messages, userState) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const systemPrompt = `You are the AI Tutor inside V — a personal learning app for developers.
Student's active technology: ${userState.activeTech}
Current total study hours: ${userState.totalHours}
XP Level: ${userState.level} (${userState.rank})
Rules: Connect answers to their learning context. Be specific and practical. Use code examples when relevant. Keep responses under 400 words. Format with markdown for readability.`;

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history,
    systemInstruction: { parts: [{ text: systemPrompt }] },
  });
  const result = await chat.sendMessage(messages.at(-1).content);
  return result.response.text();
};

/**
 * Review a student's Python challenge solution using Gemini
 */
const reviewPythonCode = async (code, challengeTitle, instructions) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

/**
 * Generate flashcards for a given technology using Gemini
 */
const generateFlashcards = async (techId) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { getTypingAdvice, chatWithTutor, reviewPythonCode, generateFlashcards };
