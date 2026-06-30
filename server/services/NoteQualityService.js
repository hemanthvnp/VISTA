const crypto = require('crypto');
const { generate, stripJsonFences } = require('./llmProvider');

const MIN_WORDS = 150;
const MIN_PARAGRAPHS = 2;

function hashContent(content) {
  return crypto.createHash('sha256').update(content || '').digest('hex');
}

function countParagraphs(content) {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean).length;
}

function countWords(content) {
  return content.trim() ? content.trim().split(/\s+/).length : 0;
}

function passesHeuristic(content) {
  return countWords(content) >= MIN_WORDS && countParagraphs(content) >= MIN_PARAGRAPHS;
}

function heuristicFailureResult() {
  const message = `Add more content before requesting a review — notes need at least ${MIN_WORDS} words across a couple of paragraphs to be assessed.`;
  return {
    error: false,
    score: 0,
    feedback: {
      clarity: message,
      depth: message,
      structure: message,
      completeness: message,
    },
  };
}

function buildPrompt(content) {
  return `You are assessing a student's study notes for publish-readiness as a blog post. Base your assessment STRICTLY on the text provided below.

NOTE CONTENT:
${content}

Respond with ONLY valid JSON (no markdown fences) in this exact structure:
{
  "score": <integer 0-100>,
  "clarity": "<feedback on how clear and easy to follow the writing is>",
  "depth": "<feedback on how thoroughly the topic is explained>",
  "structure": "<feedback on organization, headings, and flow>",
  "completeness": "<feedback on whether the topic feels fully covered or leaves gaps>"
}`;
}

async function checkQuality(content) {
  if (!passesHeuristic(content)) {
    return heuristicFailureResult();
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const prompt = buildPrompt(content);
      const { text } = await generate({ feature: 'noteQuality', prompt, temperature: 0.4, maxTokens: 768 });
      const parsed = JSON.parse(stripJsonFences(text));

      const score = Number(parsed.score);
      if (!Number.isFinite(score) || score < 0 || score > 100) {
        throw new Error('Invalid score in LLM response');
      }

      return {
        error: false,
        score: Math.round(score),
        feedback: {
          clarity: String(parsed.clarity || '').trim(),
          depth: String(parsed.depth || '').trim(),
          structure: String(parsed.structure || '').trim(),
          completeness: String(parsed.completeness || '').trim(),
        },
      };
    } catch (err) {
      console.error(`[NoteQualityService] checkQuality attempt ${attempt + 1} failed:`, err.message);
    }
  }

  return { error: true };
}

module.exports = { checkQuality, hashContent, passesHeuristic };
