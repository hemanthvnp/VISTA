## Why

Mini Projects today is a self-reported checklist — students tick boxes claiming they built something and instantly collect XP, with no proof, no real feedback, and no signal of actual code quality. For a college learning platform, this teaches nothing about what professional code looks like. Replacing it with a real GitHub submission that gets validated and AI-reviewed turns "I built it" into "here's the proof, and here's what to improve."

## What Changes

- **BREAKING**: Mini Projects no longer awards XP for checking off subtasks — XP is now earned by submitting a real, validated GitHub repository
- New **submission flow**: student submits a GitHub repo URL (+ optional live demo link and notes) for a given mini-project slot
- New **validation pipeline**: before anything is stored, the repo is checked — exists and is public, has a minimum commit count, isn't an empty/unmodified fork, has a README, repo owner matches the student's claimed GitHub username
- New **AI code review**: on a validated submission, the system fetches the repo's file tree and key file contents (README, manifest, entry points) and runs an LLM review that produces a 0–100 quality score, an auto-generated project description, a list of strengths, a list of key mistakes, and professionalism feedback (naming, structure, error handling, documentation)
- Submissions are **stored only after both validation and review succeed** — failed validation returns actionable errors without persisting anything
- XP is now **tiered by review score** instead of a flat reward
- Redesigned **Mini Projects UI**: submission form with live validation feedback, and a review results view showing score, description, strengths, and mistakes per submission

## Capabilities

### New Capabilities

- `github-repo-validation`: Validates a submitted GitHub repository against a set of acceptance checks (existence, visibility, ownership match, minimum activity, required files) before it can proceed to review
- `project-code-review`: LLM-powered analysis of a validated repo's contents — produces a quality score, auto-generated description, strengths, key mistakes, and professionalism feedback
- `project-submissions`: Persistence and retrieval of validated, reviewed project submissions, tied to a student and a mini-project slot, replacing the local-only checklist state
- `mini-projects-ux`: Redesigned Mini Projects page — submission form, validation error display, and review results presentation

### Modified Capabilities

<!-- No existing main specs to modify; this supersedes the prior local-only checklist behavior in MiniProjects.jsx, which has no formal spec -->

## Impact

- **Backend**: New `GithubValidationService` (GitHub REST API client, read-only), new `ProjectReviewService` (LLM-powered, extends the existing `codeReview` feature key in `llmProvider.js`), new `ProjectSubmission` Mongoose model, new routes under `/api/projects`
- **Frontend**: Redesigned `MiniProjects.jsx`, new submission form and review-results components, removal of the local-only checklist state
- **External dependency**: GitHub REST API (public, read-only; optional `GITHUB_TOKEN` env var for higher rate limits) — no code execution, no cloning, file contents fetched via the Contents API only
- **XP**: `complete_mini_project` flat-XP action replaced by a score-tiered XP action
- **No new LLM provider dependency** — reuses the existing Gemini + OpenAI-compatible abstraction
