/**
 * Validates submitted GitHub repos via the public REST API (read-only — no
 * cloning, no code execution).
 *
 * GITHUB_TOKEN (optional, recommended): a GitHub personal access token with
 * no special scopes needed (public repo read access only). Without it,
 * GitHub's unauthenticated rate limit is 60 requests/hour per IP, which is
 * fine for low traffic but will degrade under classroom-wide usage spikes.
 * With it, the limit rises to 5000/hour. Set it in server/.env:
 *   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
 */
const GITHUB_API = 'https://api.github.com';
const MIN_COMMITS = 3;

function githubHeaders() {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'V-learning-platform' };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function githubFetch(path) {
  return fetch(`${GITHUB_API}${path}`, { headers: githubHeaders() });
}

function parseRepoUrl(repoUrl) {
  if (!repoUrl) return null;
  const cleaned = repoUrl.trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '');
  const match = cleaned.match(/^github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

function fail(field, message) {
  return { ok: false, type: 'validation', field, message };
}

function apiError(message) {
  return { ok: false, type: 'github_api', message };
}

async function validate(repoUrl, claimedUsername) {
  // 1. URL format
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) {
    return fail('repoUrl', "That doesn't look like a valid GitHub repository URL. Use the format github.com/owner/repo.");
  }
  const { owner, repo } = parsed;

  // 2. Existence + public
  let repoRes;
  try {
    repoRes = await githubFetch(`/repos/${owner}/${repo}`);
  } catch (err) {
    return apiError('Could not reach GitHub right now. Please try again in a moment.');
  }

  if (repoRes.status === 404) {
    return fail('repoUrl', 'That repository could not be found. Double-check the URL and make sure it is public.');
  }
  if (repoRes.status === 403 || repoRes.status === 429) {
    return apiError('GitHub API rate limit reached. Please try again in a few minutes.');
  }
  if (!repoRes.ok) {
    return apiError('GitHub is temporarily unavailable. Please try again later.');
  }

  const repoData = await repoRes.json();
  if (repoData.private) {
    return fail('repoUrl', 'This repository is private. Make it public before submitting.');
  }

  // 3. Owner match (case-insensitive)
  if (!claimedUsername || repoData.owner?.login?.toLowerCase() !== claimedUsername.trim().toLowerCase()) {
    return fail('githubUsername', 'This repository does not belong to the GitHub account you entered.');
  }

  // 4. Minimum commit count
  let commitCount = 0;
  try {
    const commitsRes = await githubFetch(`/repos/${owner}/${repo}/commits?per_page=${MIN_COMMITS}`);
    if (commitsRes.status === 409) {
      commitCount = 0; // empty repo — GitHub returns 409 for repos with no commits
    } else if (!commitsRes.ok) {
      return apiError('Could not verify commit history. Please try again later.');
    } else {
      const commits = await commitsRes.json();
      commitCount = Array.isArray(commits) ? commits.length : 0;
    }
  } catch (err) {
    return apiError('Could not reach GitHub right now. Please try again in a moment.');
  }

  if (commitCount < MIN_COMMITS) {
    return fail('repoUrl', `This repository needs at least ${MIN_COMMITS} commits to show real development effort.`);
  }

  // 5 & 6. README present + non-trivial content
  let contents;
  try {
    const contentsRes = await githubFetch(`/repos/${owner}/${repo}/contents`);
    if (!contentsRes.ok) {
      return apiError('Could not read repository contents. Please try again later.');
    }
    contents = await contentsRes.json();
  } catch (err) {
    return apiError('Could not reach GitHub right now. Please try again in a moment.');
  }

  if (!Array.isArray(contents) || contents.length === 0) {
    return fail('repoUrl', 'This repository appears to be empty.');
  }

  const hasReadme = contents.some((f) => /^readme(\.[a-z0-9]+)?$/i.test(f.name));
  if (!hasReadme) {
    return fail('repoUrl', 'This repository needs a README file describing the project.');
  }

  if (contents.length < 2) {
    return fail('repoUrl', 'This repository only contains a README — add your project code before submitting.');
  }

  return {
    ok: true,
    owner: repoData.owner.login,
    repo: repoData.name,
    defaultBranch: repoData.default_branch || 'main',
  };
}

module.exports = { validate, parseRepoUrl, githubFetch };
