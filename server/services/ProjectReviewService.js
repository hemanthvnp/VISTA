const { generate, stripJsonFences } = require('./llmProvider');
const { githubFetch } = require('./GithubValidationService');

const MAX_FILES = 5;
const PER_FILE_CHAR_CAP = 3000;
const COMBINED_CHAR_CAP = 12000;

const ENTRY_POINT_NAMES = ['index.js', 'index.ts', 'main.py', 'app.py', 'main.js', 'app.js', 'main.cpp', 'main.c', 'Program.cs', 'main.go', 'main.rs'];
const MANIFEST_NAMES = ['package.json', 'requirements.txt', 'pom.xml', 'Cargo.toml', 'go.mod', 'build.gradle', 'CMakeLists.txt'];
const TEST_PATTERN = /(^|\/)(test|tests|__tests__|spec)(\/|_|\.)/i;
const SKIP_DIR_PATTERN = /(^|\/)(node_modules|\.git|dist|build|venv|\.venv|__pycache__|target)(\/|$)/i;

async function fetchFileTree(owner, repo, branch) {
  const res = await githubFetch(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data.tree)) return [];
  return data.tree.filter((item) => item.type === 'blob' && !SKIP_DIR_PATTERN.test(item.path));
}

async function fetchFileContent(owner, repo, path) {
  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.encoding === 'base64' && data.content) {
    try {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    } catch (err) {
      return null;
    }
  }
  return null;
}

function selectFilesForReview(tree) {
  const readme = tree.find((f) => /^readme(\.[a-z0-9]+)?$/i.test(f.path));
  const manifest = tree.find((f) => MANIFEST_NAMES.includes(f.path.split('/').pop()));
  const entryPoints = tree.filter((f) => ENTRY_POINT_NAMES.includes(f.path.split('/').pop()) && !TEST_PATTERN.test(f.path));

  const nonTestSource = tree
    .filter((f) => !TEST_PATTERN.test(f.path) && f.path !== readme?.path && f.path !== manifest?.path)
    .sort((a, b) => (b.size || 0) - (a.size || 0));

  const selected = [];
  if (readme) selected.push(readme);
  if (manifest) selected.push(manifest);

  const candidates = [...entryPoints, ...nonTestSource].filter(
    (f, i, arr) => arr.findIndex((x) => x.path === f.path) === i && !selected.some((s) => s.path === f.path)
  );

  for (const f of candidates) {
    if (selected.length >= 2 + MAX_FILES) break;
    selected.push(f);
  }

  return { selected, readmePath: readme?.path, manifestPath: manifest?.path };
}

async function buildReviewInput(owner, repo, defaultBranch) {
  const tree = await fetchFileTree(owner, repo, defaultBranch);
  const { selected, readmePath, manifestPath } = selectFilesForReview(tree);

  // README and manifest are prioritized — fetched first so they survive the combined cap intact
  const ordered = [...selected].sort((a, b) => {
    const aPriority = a.path === readmePath || a.path === manifestPath ? 0 : 1;
    const bPriority = b.path === readmePath || b.path === manifestPath ? 0 : 1;
    return aPriority - bPriority;
  });

  const fileContents = [];
  let totalChars = 0;

  for (const file of ordered) {
    if (totalChars >= COMBINED_CHAR_CAP) break;
    const content = await fetchFileContent(owner, repo, file.path);
    if (!content) continue;
    const cap = Math.min(PER_FILE_CHAR_CAP, COMBINED_CHAR_CAP - totalChars);
    const truncated = content.slice(0, cap);
    fileContents.push({ path: file.path, content: truncated });
    totalChars += truncated.length;
  }

  const fileTreeText = tree.map((f) => f.path).slice(0, 200).join('\n');

  return { fileContents, fileTreeText };
}

function buildPrompt({ fileContents, fileTreeText }) {
  const filesBlock = fileContents.map((f) => `--- ${f.path} ---\n${f.content}`).join('\n\n');

  return `You are reviewing a student's project repository for a college coding course. Base your review STRICTLY on the file contents and file tree provided below — do not speculate about files you have not seen.

FILE TREE:
${fileTreeText}

FILE CONTENTS:
${filesBlock}

Respond with ONLY valid JSON (no markdown fences) in this exact structure:
{
  "score": <integer 0-100>,
  "description": "<2-4 sentence plain-English description of what this project does>",
  "strengths": "<what was done well, referencing specific files where relevant>",
  "keyMistakes": "<concrete issues found, referencing specific files; if there are no significant issues, state that explicitly>",
  "professionalismFeedback": "<feedback on naming conventions, code structure, error handling, and documentation quality>"
}`;
}

const FAILED_REVIEW = {
  reviewFailed: true,
  score: 0,
  description: '',
  strengths: '',
  keyMistakes: '',
  professionalismFeedback: '',
};

async function review(owner, repo, defaultBranch) {
  const input = await buildReviewInput(owner, repo, defaultBranch);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const prompt = buildPrompt(input);
      const { text } = await generate({ feature: 'codeReview', prompt, temperature: 0.4, maxTokens: 1024 });
      const parsed = JSON.parse(stripJsonFences(text));

      const score = Number(parsed.score);
      if (!Number.isFinite(score) || score < 0 || score > 100) {
        throw new Error('Invalid score in LLM response');
      }

      return {
        reviewFailed: false,
        score: Math.round(score),
        description: String(parsed.description || '').trim(),
        strengths: String(parsed.strengths || '').trim(),
        keyMistakes: String(parsed.keyMistakes || '').trim(),
        professionalismFeedback: String(parsed.professionalismFeedback || '').trim(),
      };
    } catch (err) {
      console.error(`[ProjectReviewService] review attempt ${attempt + 1} failed:`, err.message);
    }
  }

  return FAILED_REVIEW;
}

module.exports = { review };
