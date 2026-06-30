## Context

Notes (`server/models/Note.js`, `client/src/pages/Notes.jsx`) are currently a single freeform markdown text field per `(userId, techId)`, autosaved 1.5s after the student stops typing. There's no quality signal and no destination beyond the app. This design adds an on-demand AI quality check and a path to publish a qualifying note to Medium.

The platform already has an LLM provider abstraction (`server/services/llmProvider.js`) used for scored, structured feedback in the recent `mini-project-submissions` change (`ProjectReviewService`). This design follows that same pattern for note quality scoring rather than introducing a separate ML pipeline.

**Medium API constraint**: Medium froze new OAuth application registrations on its public API around 2023 — a new app cannot register an OAuth client today. The API still accepts requests authenticated with a per-user **Integration Token** (a personal access token a Medium user generates themselves at `medium.com/me/settings`). "Connecting Medium" in this design therefore means the student pastes their own Integration Token, not an OAuth login redirect. This is a real external constraint, not a design preference — it must be communicated clearly in the UI so students aren't expecting a "Sign in with Medium" button.

## Goals / Non-Goals

**Goals:**
- On-demand (not autosave-triggered) quality scoring of a note: 0–100 score plus feedback on clarity, depth, structure, completeness
- Let a student connect a Medium account via Integration Token, stored encrypted, never echoed back to the client
- Let a student publish a note to Medium only when its score meets a threshold, and only via explicit action
- Show publish state (Medium post URL, published date) on a published note
- Let a student disconnect Medium at any time, which does not retroactively unpublish anything

**Non-Goals:**
- No Medium OAuth — not possible for new apps; token-based connection only
- No automatic publishing — publishing is always a deliberate, explicit student action
- No multi-platform publishing (Medium only) in this iteration
- No editing or deleting a post on Medium from within the app after publish (Medium's API does not support post deletion; out of scope)
- No training of a custom ML classifier — quality scoring is LLM-based, consistent with the rest of the platform

## Decisions

### 1. Quality scoring is LLM-based, with a cheap heuristic pre-filter

**Decision**: Before calling the LLM, run a fast heuristic check (minimum word count ~150, presence of more than one paragraph/section). Notes that fail the heuristic return a low score immediately with feedback like "add more content before requesting a review" — no LLM call needed. Notes that pass the heuristic go to `NoteQualityService`, which prompts the LLM (via the `noteQuality` feature key in `llmProvider.js`) for a 0–100 score and structured feedback across clarity, depth, structure, and completeness.

**Alternatives considered**:
- *Pure LLM, no heuristic*: Wastes LLM calls on obviously-too-short notes
- *Train a custom classifier*: Disproportionate — the platform just removed its one bespoke ML pipeline (typing analysis) in favor of LLM-based scoring elsewhere; consistency favors the same approach here

### 2. Medium connection via Integration Token, encrypted at rest

**Decision**: A new `MediumConnection` model stores `userId`, an encrypted `token`, the Medium `authorId` (fetched once via `GET /v1/me` at connect time and cached), `username`, and `connectedAt`. Encryption uses Node's `crypto` module (AES-256-GCM) with a server-side `ENCRYPTION_KEY` env var. The token is never included in any API response after the initial connect call succeeds.

**Alternatives considered**:
- *Store token in plaintext*: Unacceptable — it's a credential with publish-on-behalf-of-user power
- *OAuth*: Not available for new Medium API applications (see Context)

### 3. Quality check is explicit and on-demand, not tied to autosave

**Decision**: A "Check Quality" button in the Notes editor triggers the score request. Scoring is not run automatically on the existing 1.5s autosave debounce — that would mean an LLM call on every pause while typing, which is both costly and not useful mid-draft.

**Alternatives considered**:
- *Auto-score on every save*: Rejected for cost and noise — most autosaves happen mid-thought, not at a meaningful checkpoint

### 4. Publish is synchronous, single LLM-adjacent external call, threshold-gated

**Decision**: `POST /api/notes/:techId/publish` is only callable when the note's last quality score is ≥ 70 (the threshold from `note-quality-scoring`). The route calls Medium's `POST /v1/users/{authorId}/posts` with the note's content (converted from the app's markdown), and stores the returned post URL on the `Note` document. The threshold is enforced server-side, not just hidden in the UI, since a student could otherwise call the API directly.

**Alternatives considered**:
- *Client-side-only gating*: Insecure — server must be the source of truth for the threshold check

### 5. Score is tied to a content snapshot — stale after edits

**Decision**: `Note.qualityScore` and `qualityFeedback` are cleared (or marked stale) whenever `content` changes after a score was computed, requiring a fresh "Check Quality" call before publishing again. This prevents publishing content that was never actually scored.

**Alternatives considered**:
- *Let score persist indefinitely regardless of edits*: Risks publishing low-quality content under a stale high score

```
Student writes note (autosave as today, no scoring)
        │
        ▼ (explicit "Check Quality" click)
┌─────────────────────────┐
│  Heuristic pre-filter    │ ── fails (too short) ──▶ Low score + "write more" feedback, no LLM call
└───────────┬─────────────┘
            │ passes
            ▼
┌─────────────────────────┐
│  NoteQualityService (LLM) │  → score 0-100 + feedback (clarity, depth, structure, completeness)
└───────────┬─────────────┘
            ▼
      Score stored on Note
            │
   score ≥ 70?  ──No──▶ "Publish to Medium" stays disabled, feedback shown
            │
           Yes
            ▼
┌─────────────────────────┐
│   "Publish to Medium"    │  (only enabled here, explicit click required)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│      MediumService        │  POST /v1/users/{authorId}/posts
└───────────┬─────────────┘
            ▼
   Note.mediumPostUrl + publishedAt stored
```

## Risks / Trade-offs

- **Medium Integration Tokens may be unavailable to newer Medium accounts** → Document this clearly in the Connect Medium UI; if a student's token request fails validation, show Medium's own guidance link rather than a generic error
- **LLM scoring inconsistency between runs** → Treat the score as advisory; the threshold (70) is a deliberately moderate bar, not a precision instrument
- **Token encryption key management** → `ENCRYPTION_KEY` must be set and stable across deploys (rotating it invalidates all stored tokens); document as a required env var for this feature specifically (unlike `GITHUB_TOKEN`, which was optional)
- **Stale score after edit** → Mitigated by Decision 5 (score invalidated on content change)
- **Markdown-to-Medium content conversion fidelity** → Medium's API accepts `contentFormat: "markdown"` directly, so no custom conversion is needed; reduces risk significantly

## Migration Plan

1. Add `MediumConnection` model and new fields on `Note` (`qualityScore`, `qualityFeedback`, `qualityCheckedAt`, `mediumPostUrl`, `publishedAt`) — additive, no backfill needed since existing notes simply start with no score
2. Require `ENCRYPTION_KEY` in `server/.env` before this feature's routes are exercised; document it as required (not optional, unlike `GITHUB_TOKEN`)
3. Ship behind the existing Notes page — no flag needed, the new UI elements (Check Quality, Connect Medium, Publish) are purely additive to the editor
4. Rollback: revert routes and UI additions; stored quality scores and Medium connections remain in the DB but become inert

## Open Questions

- Should disconnecting Medium also revoke/forget the `authorId` cache, requiring a fresh `GET /v1/me` on reconnect? Leaning yes, for correctness if a student reconnects a different Medium account.
- Should published notes be locked from further edits, or just show a "this was published on {date}, content may have changed since" notice? Leaning toward the notice — simpler, doesn't restrict the student's own notes.
