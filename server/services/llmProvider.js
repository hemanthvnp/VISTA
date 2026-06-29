/**
 * LLM Provider Abstraction
 * ------------------------
 * Routes each feature's LLM calls to a configured backend:
 *   - "gemini"   -> Google Gemini API (cloud)
 *   - "lmstudio" -> LM Studio local server (OpenAI-compatible, GBNF capable)
 *
 * Per-feature routing is controlled via env vars so you can mix & match:
 *   LLM_PROVIDER_TUTOR=gemini
 *   LLM_PROVIDER_TYPING_ADVICE=lmstudio
 *   LLM_PROVIDER_FLASHCARDS=lmstudio
 *   LLM_PROVIDER_CODE_REVIEW=gemini      (default; overridden by client toggle)
 *
 * Fallback: if a per-feature var is unset, LLM_PROVIDER_DEFAULT is used.
 * Final fallback if nothing is set: "gemini" (preserves current behavior).
 *
 * LM Studio config:
 *   LMSTUDIO_BASE_URL   (default http://localhost:1234/v1)
 *   LMSTUDIO_MODEL      (default qwen2.5-7b-instruct)
 *   LMSTUDIO_CODER_MODEL (default qwen2.5-coder-7b-instruct)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ---------- Provider resolution ----------

const FEATURE_ENV_KEYS = {
  tutor: 'LLM_PROVIDER_TUTOR',
  typingAdvice: 'LLM_PROVIDER_TYPING_ADVICE',
  flashcards: 'LLM_PROVIDER_FLASHCARDS',
  codeReview: 'LLM_PROVIDER_CODE_REVIEW',
};

function resolveProvider(feature) {
  const featureKey = FEATURE_ENV_KEYS[feature];
  const explicit = featureKey ? process.env[featureKey] : undefined;
  return (explicit || process.env.LLM_PROVIDER_DEFAULT || 'gemini').toLowerCase();
}

// ---------- Gemini client ----------

function geminiModel(modelName = 'gemini-2.5-flash') {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: modelName });
}

// ---------- LM Studio client (OpenAI-compatible) ----------

// The "lmstudio" provider is the OpenAI-compatible path. It works for:
//   - LM Studio local server (no API key)
//   - Groq    (set LMSTUDIO_BASE_URL=https://api.groq.com/openai/v1, LMSTUDIO_API_KEY=gsk_...)
//   - Together / OpenRouter / any other OpenAI-compatible endpoint
const LMSTUDIO_BASE_URL = process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1';
const LMSTUDIO_API_KEY = process.env.LMSTUDIO_API_KEY || '';
const LMSTUDIO_MODEL = process.env.LMSTUDIO_MODEL || 'qwen2.5-7b-instruct';
const LMSTUDIO_CODER_MODEL = process.env.LMSTUDIO_CODER_MODEL || 'qwen2.5-coder-7b-instruct';

/**
 * Call any OpenAI-compatible /chat/completions endpoint (LM Studio, Groq, etc).
 *
 * @param {Object}   opts
 * @param {Array}    opts.messages   OpenAI-style [{role, content}, ...]
 * @param {string}   [opts.model]    Override model name
 * @param {string}   [opts.grammar]  GBNF grammar string (llama.cpp only — ignored by hosted APIs)
 * @param {Object}   [opts.responseFormat] OpenAI-style response_format (json_object / json_schema)
 * @param {number}   [opts.temperature]
 * @param {number}   [opts.maxTokens]
 * @returns {Promise<string>} assistant message content
 */
async function lmstudioChat({
  messages,
  model = LMSTUDIO_MODEL,
  grammar,
  responseFormat,
  temperature = 0.7,
  maxTokens = 1024,
}) {
  const body = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: false,
  };

  // Forwarded only when set. llama.cpp / LM Studio honor `grammar`; Groq ignores it.
  if (grammar) body.grammar = grammar;
  if (responseFormat) body.response_format = responseFormat;

  const headers = { 'Content-Type': 'application/json' };
  if (LMSTUDIO_API_KEY) headers.Authorization = `Bearer ${LMSTUDIO_API_KEY}`;

  const res = await fetch(`${LMSTUDIO_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`LM Studio HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('LM Studio returned no content');
  }
  return content;
}

// ---------- Unified generation primitives ----------

/**
 * One-shot text generation. Used for prompts that don't need chat history.
 *
 * @param {Object} opts
 * @param {string} opts.feature       Feature key (drives provider routing)
 * @param {string} opts.prompt        User prompt
 * @param {string} [opts.systemPrompt]
 * @param {string} [opts.grammar]     GBNF grammar (LM Studio only; ignored by Gemini)
 * @param {Object} [opts.responseFormat] OpenAI-style response format (LM Studio only)
 * @param {string} [opts.providerOverride] Force a specific provider (e.g. from request body)
 * @param {string} [opts.model]       Force a specific model name on the chosen provider
 * @returns {Promise<{ text: string, provider: string }>}
 */
async function generate(opts) {
  const {
    feature,
    prompt,
    systemPrompt,
    grammar,
    responseFormat,
    providerOverride,
    model,
    temperature,
    maxTokens,
  } = opts;

  const provider = (providerOverride || resolveProvider(feature)).toLowerCase();

  if (provider === 'gemini') {
    const m = geminiModel(model);
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    const result = await m.generateContent(fullPrompt);
    return { text: result.response.text(), provider };
  }

  if (provider === 'lmstudio') {
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });
    const text = await lmstudioChat({
      messages,
      model,
      grammar,
      responseFormat,
      temperature,
      maxTokens,
    });
    return { text, provider };
  }

  throw new Error(`Unknown LLM provider: ${provider}`);
}

/**
 * Multi-turn chat. Used for the AI Tutor.
 *
 * @param {Object} opts
 * @param {string} opts.feature
 * @param {string} opts.systemPrompt
 * @param {Array}  opts.messages   [{role: 'user'|'model'|'assistant', content}]
 * @param {string} [opts.providerOverride]
 * @param {string} [opts.model]
 * @returns {Promise<{ text: string, provider: string }>}
 */
async function chat(opts) {
  const {
    feature,
    systemPrompt,
    messages,
    providerOverride,
    model,
    temperature,
    maxTokens,
  } = opts;

  const provider = (providerOverride || resolveProvider(feature)).toLowerCase();

  if (provider === 'gemini') {
    const m = geminiModel(model);
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
    const chatSession = m.startChat({
      history,
      systemInstruction: systemPrompt
        ? { parts: [{ text: systemPrompt }] }
        : undefined,
    });
    const result = await chatSession.sendMessage(messages.at(-1).content);
    return { text: result.response.text(), provider };
  }

  if (provider === 'lmstudio') {
    // Normalize Gemini-style "model" role -> OpenAI "assistant"
    const oaMessages = [];
    if (systemPrompt) oaMessages.push({ role: 'system', content: systemPrompt });
    for (const msg of messages) {
      oaMessages.push({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.content,
      });
    }
    const text = await lmstudioChat({
      messages: oaMessages,
      model,
      temperature,
      maxTokens,
    });
    return { text, provider };
  }

  throw new Error(`Unknown LLM provider: ${provider}`);
}

/**
 * Strip common code-fence wrappers around JSON output. Used for Gemini
 * responses (LM Studio + GBNF doesn't need this — output is already clean).
 */
function stripJsonFences(text) {
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}

module.exports = {
  generate,
  chat,
  resolveProvider,
  stripJsonFences,
  // exposed for tests / direct use
  _lmstudioChat: lmstudioChat,
  _LMSTUDIO_MODEL: LMSTUDIO_MODEL,
  _LMSTUDIO_CODER_MODEL: LMSTUDIO_CODER_MODEL,
};
