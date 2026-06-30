## Context

`MiniProjects.jsx` currently renders 10 static guided projects (from `MINI_PROJECTS` in `typingGeminiPrompt.js`) with a subtask checklist held entirely in local React state. There is no backend persistence, no proof of work, and no feedback loop — a student can check every box and claim +500 XP without writing a line of code. This change replaces that with a real submission: a GitHub repo URL that gets validated, then reviewed by an LLM for quality, and only stored (with XP awarded) if both steps succeed.

The platform already has an LLM provider abstraction (`server/services/llmProvider.js`) with a `codeReview` feature key currently used for single-snippet Python challenge reviews (`reviewPythonCode` in `services/gemini.js`). This design extends that pattern to multi-file repository review rather than introducing a new LLM integration.

## Goals / Non-Goals

**Goals:**
- Validate that a submitted GitHub repo is real, public, owned by the claimed student, and shows genuine effort (commit count, non-empty, has a README)
- Fetch repo contents safely (read-only, no cloning, no code execution) and feed a bounded, relevant subset to the LLM for review
- Produce a 0–100 score, an auto-generated project description, strengths, key mistakes, and professionalism feedback
- Persist only validated + reviewed submissions; failed validation returns actionable errors and stores nothing
- Award XP based on review score tier, once per project slot (best score counts)
- Let students resubmit to improve their score

**Non-Goals:**
- No code execution or sandboxing of submitted projects — review is static, content-based only
- No plagiarism/duplicate-submission detection across students
- No private repo support in this iteration (GitHub OAuth would be required; out of scope)
- No deep multi-commit history analysis — review looks at the current state of the repo only

## Decisions

### 1. GitHub access is read-only via the REST Contents API — no cloning, no execution

**Decision**: Use GitHub's public REST API (`GET /repos/{owner}/{repo}`, `GET /repos/{owner}/{repo}/contents/{path}`, `GET /repos/{owner}/{repo}/commits`) to fetch metadata, file tree, and selected file contents as text. Optional `GITHUB_TOKEN` env var raises the rate limit from 60/hr to 5000/hr.

**Alternatives considered**:
- *Clone the repo server-side*: Unnecessary disk I/O and risk surface for what is fundamentally a metadata + text-content read
- *Execute submitted code*: Explicitly rejected — arbitrary code execution from student-submitted repos is a security risk this project shouldn't take on

### 2. Validation runs as an ordered pipeline, cheapest checks first

**Decision**: `GithubValidationService.validate(repoUrl, claimedUsername)` runs checks in this order, short-circuiting on first failure:
1. URL format is a valid `github.com/owner/repo` pattern
2. Repo exists and is public (`GET /repos/{owner}/{repo}` returns 200)
3. Repo owner login matches `claimedUsername` (case-insensitive)
4. Repo has ≥ 3 commits (via `GET /repos/{owner}/{repo}/commits?per_page=1` + `Link` header pagination count, or a capped walk)
5. Repo has a `README` file at root
6. Repo has more than just a README (≥ 2 files, or non-trivial size) — filters out empty template forks

Each failure returns a specific, student-facing error message (not a generic "validation failed").

**Alternatives considered**:
- *Run all checks in parallel*: Saves a little latency but produces a worse UX (showing 4 errors when the URL is simply malformed); sequential short-circuit chosen for clarity

### 3. Review input is a bounded, curated subset of repo content — not the whole repo

**Decision**: `ProjectReviewService` builds a review payload from: README content, the manifest file if present (`package.json`, `requirements.txt`, `pom.xml`, etc.), and up to 5 source files selected by heuristic (entry points like `index.js`/`main.py`/`app.js`, plus largest non-test files), each truncated to ~3000 characters, with a combined cap of ~12000 characters before the LLM call. The full file tree (paths only) is included for structural context.

**Alternatives considered**:
- *Send entire repo*: Blows token limits and cost for larger student projects; a curated sample is sufficient for the kind of structural/style/professionalism review this feature targets
- *Let the LLM request files iteratively (agentic)*: Adds latency and complexity disproportionate to a learning-platform code review feature

### 4. Submission is synchronous request/response, not a background job

**Decision**: `POST /api/projects/submit` runs validation → fetch → LLM review → persist in a single request. Expected latency: a few seconds (GitHub API calls + one LLM call). The client shows a loading state during this window.

**Alternatives considered**:
- *Background job + polling*: More resilient to slow LLM responses but adds queue infrastructure disproportionate to an occasional, student-initiated action with no concurrency pressure

### 5. One current submission per (student, project slot); XP awarded on best score only

**Decision**: `ProjectSubmission` is keyed by `(userId, projectSlotId)`. Resubmission overwrites the stored submission and increments `attemptCount`, but XP is only awarded for the delta if the new score reaches a higher tier than previously achieved (`bestScoreXpAwarded` tracked per submission).

**Alternatives considered**:
- *Keep full submission history*: More auditable but unnecessary for a learning tool; current snapshot + attempt count is sufficient

### 6. XP tiers replace the flat 500 XP reward

**Decision**:
| Score range | XP |
|---|---|
| 85–100 | 750 |
| 70–84  | 500 |
| 50–69  | 250 |
| 0–49   | 100 (effort credit, submission still stored with full feedback) |

```
Student submits repo URL
        │
        ▼
┌─────────────────────┐
│ GithubValidationService │  ── fails ──▶  Return specific error, store nothing
└──────────┬───────────┘
           │ passes
           ▼
┌─────────────────────┐
│  Fetch repo content   │  (README, manifest, ~5 source files, file tree)
└──────────┬───────────┘
           ▼
┌─────────────────────┐
│  ProjectReviewService │  LLM call → score, description, strengths, mistakes
└──────────┬───────────┘
           ▼
┌─────────────────────┐
│  Persist Submission   │  upsert by (userId, slotId), award tiered XP if improved
└─────────────────────┘
```

## Risks / Trade-offs

- **GitHub API rate limits** → Use `GITHUB_TOKEN` if configured; without it, 60 req/hr is enough for a low-traffic college tool but should be documented as a deployment requirement
- **LLM review inconsistency / hallucinated feedback** → Prompt explicitly grounds the model in the provided file contents only and asks it to cite specific files/lines where possible; review is advisory, not a grade of record
- **Large repos exceeding content cap** → Heuristic file selection (entry points + largest non-test files) covers the most review-relevant code; full file tree still gives structural context even when content is truncated
- **Submission latency (sync request)** → Acceptable given low expected concurrency; revisit with a job queue only if usage patterns demand it
- **Fork-spam gaming the commit-count check** → ≥3 commits is a light bar, not foolproof; acceptable for a learning tool where the goal is encouraging genuine effort, not airtight anti-cheating

## Migration Plan

1. Add `ProjectSubmission` model; no migration needed for existing data since `MiniProjects.jsx` state was local-only (nothing to backfill)
2. Ship `GithubValidationService` and `ProjectReviewService` behind the new `/api/projects` routes
3. Replace `MiniProjects.jsx` checklist UI with the submission form in the same deploy (no incremental flag needed — old local-state behavior had no server dependency to break)
4. Rollback: revert routes and UI component; no data loss since submissions are additive

## Open Questions

- Should `GITHUB_TOKEN` be required at deploy time, or should the app degrade gracefully (with a warning) on the unauthenticated rate limit? Leaning: degrade gracefully, document the token as recommended.
- Should review feedback be regenerable on demand (separate from resubmission) if a student just wants a fresh AI opinion without changing code? Deferred — not in this iteration.
