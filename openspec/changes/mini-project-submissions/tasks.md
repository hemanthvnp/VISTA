## 1. Data Model

- [x] 1.1 Create `server/models/ProjectSubmission.js` with fields: `userId`, `projectSlotId`, `repoUrl`, `githubUsername`, `demoUrl`, `notes`, `score`, `description`, `strengths`, `keyMistakes`, `professionalismFeedback`, `reviewFailed`, `attemptCount`, `bestScoreTier`, `xpAwarded`, `validatedAt`, `reviewedAt`
- [x] 1.2 Add a unique compound index on `(userId, projectSlotId)`

## 2. GitHub Validation Service

- [x] 2.1 Create `server/services/GithubValidationService.js` with a `validate(repoUrl, claimedUsername)` function
- [x] 2.2 Implement URL format check (`github.com/{owner}/{repo}` pattern, strip `.git`/trailing slash/protocol)
- [x] 2.3 Implement repo existence + public check via `GET /repos/{owner}/{repo}`
- [x] 2.4 Implement owner-match check (case-insensitive) against claimed GitHub username
- [x] 2.5 Implement commit-count check (≥3) via `GET /repos/{owner}/{repo}/commits`
- [x] 2.6 Implement README-present and non-trivial-content checks via `GET /repos/{owner}/{repo}/contents`
- [x] 2.7 Distinguish GitHub API errors/rate-limits from validation failures in the returned result shape
- [x] 2.8 Add `GITHUB_TOKEN` support (optional env var) to raise rate limits, with graceful degradation if unset

## 3. Project Review Service

- [x] 3.1 Create `server/services/ProjectReviewService.js` with a `review(owner, repo)` function
- [x] 3.2 Implement file tree fetch and heuristic file selection (README, manifest, up to 5 entry-point/largest source files)
- [x] 3.3 Implement content truncation (per-file ~3000 chars, combined ~12000 chars cap, README/manifest prioritized)
- [x] 3.4 Build the LLM review prompt requesting: score (0-100), description, strengths, key mistakes, professionalism feedback — grounded only in provided content
- [x] 3.5 Call the LLM via existing `llmProvider.generate()` using the `codeReview` feature key
- [x] 3.6 Parse the LLM response into structured fields; implement one retry on parse failure
- [x] 3.7 On persistent parse failure, return a `reviewFailed: true` result with score 0 instead of throwing

## 4. Submission API

- [x] 4.1 Create `server/routes/projects.js` with `POST /api/projects/submit` (body: `projectSlotId`, `repoUrl`, `githubUsername`, `demoUrl`, `notes`)
- [x] 4.2 Wire the route to run validation → on pass, run review → on completion (success or reviewFailed), persist via upsert on `(userId, projectSlotId)`, incrementing `attemptCount`
- [x] 4.3 Implement XP tier calculation (85-100:750, 70-84:500, 50-69:250, 0-49:100) and award-on-improvement logic using `bestScoreTier`
- [x] 4.4 Call `addXP`-equivalent logic (reuse `/api/progress/xp` pattern) when new XP is awarded
- [x] 4.5 Add `GET /api/projects/submissions` returning all of the authenticated student's submissions keyed by `projectSlotId`
- [x] 4.6 Mount `/api/projects` in `server/index.js`
- [x] 4.7 Return validation errors as a distinct error shape (`{ type: 'validation', field, message }`) vs review/server errors

## 5. Frontend — API & State

- [x] 5.1 Create `client/src/api/projects.js` with `submitProject(payload)` and `getSubmissions()`
- [x] 5.2 Add submission state handling (loading, validation error, success) to be consumed by the Mini Projects page

## 6. Frontend — Mini Projects UX

- [x] 6.1 Create `client/src/components/projects/SubmissionForm.jsx` — repo URL, GitHub username (pre-filled), demo URL, notes, submit button with loading state
- [x] 6.2 Create `client/src/components/projects/ValidationError.jsx` — displays specific validation error messages inline
- [x] 6.3 Create `client/src/components/projects/ReviewResults.jsx` — score display, auto-generated description, strengths/key mistakes/professionalism sections, XP earned indicator
- [x] 6.4 Rewrite `client/src/pages/MiniProjects.jsx`: remove local checklist state (`subtaskState`, `completedProjects`), fetch submissions on mount, render `SubmissionForm` or `ReviewResults` per slot depending on submission state
- [x] 6.5 Add resubmission flow: allow editing and resubmitting from the `ReviewResults` view, pre-filled with prior values
- [x] 6.6 Add reviewFailed state handling: show stored/validated state with a "review unavailable, retry" notice and retry action

## 7. Polish & Edge Cases

- [x] 7.1 Handle GitHub API rate-limit/5xx responses distinctly in the UI ("try again later" vs validation error)
- [x] 7.2 Confirm resubmission with equal/lower score tier shows updated feedback without implying new XP
- [x] 7.3 Confirm empty-repo and missing-README cases produce the correct specific error messages end-to-end
- [x] 7.4 Document `GITHUB_TOKEN` as a recommended (not required) env var in server `.env` setup
