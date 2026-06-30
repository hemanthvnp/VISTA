## Why

Notes today are private, plain-text scratchpads with no destination beyond the app — a student can write a genuinely good explanation of a concept and it just sits there. Adding an AI quality check and a direct path to publish on Medium turns strong notes into a portfolio piece and gives students a concrete incentive to write clearly, not just take notes.

## What Changes

- New **quality check**: a student can request an AI assessment of their note's publish-readiness — a 0–100 score plus feedback on clarity, depth, structure, and completeness, using the existing LLM abstraction
- New **Medium connection**: a student connects their Medium account via a Medium Integration Token (Medium's self-publish API no longer issues new OAuth app registrations, so token-based connection is the realistic path — see design.md) and can disconnect at any time
- New **publish flow**: once a note's quality score crosses a threshold, a "Publish to Medium" action becomes available; publishing is always an explicit, student-initiated action — never automatic
- Published notes show their Medium post URL and publish date in the app
- Quality check is **on-demand** (a button), not run on every autosave, to avoid unnecessary LLM calls while typing

## Capabilities

### New Capabilities

- `note-quality-scoring`: LLM-powered assessment of a note's publish-readiness — produces a 0–100 score and structured feedback (clarity, depth, structure, completeness)
- `medium-publishing`: Connecting a Medium account via Integration Token (encrypted at rest) and publishing a qualifying note as a Medium post via Medium's REST API
- `notes-publish-ux`: UI for triggering a quality check, viewing the score/feedback, connecting/disconnecting Medium, and publishing — including the published-state indicator

### Modified Capabilities

<!-- No existing main specs to modify; Notes currently has no formal spec -->

## Impact

- **Backend**: New `NoteQualityService` (LLM-powered, extends `llmProvider.js` with a new `noteQuality` feature key), new `MediumService` (Medium REST API client), new fields on `Note` model (score, feedback, published state), new `MediumConnection` model storing an encrypted Integration Token per user, new routes under `/api/notes` (quality check, connect/disconnect Medium, publish)
- **Frontend**: Updated `Notes.jsx` with a "Check Quality" action, score/feedback display, a Medium connection panel (in Settings or inline), and a "Publish to Medium" action gated by score threshold
- **External dependency**: Medium's REST API (`api.medium.com`), authenticated via per-user Integration Token rather than OAuth
- **Security**: Medium tokens are encrypted at rest using a server-side key (new `ENCRYPTION_KEY` env var) and never returned to the client after the initial connect
- **No new LLM provider dependency** — reuses the existing Gemini + OpenAI-compatible abstraction
