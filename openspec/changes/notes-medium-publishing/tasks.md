## 1. Data Model

- [x] 1.1 Add fields to `server/models/Note.js`: `qualityScore`, `qualityFeedback` ({ clarity, depth, structure, completeness }), `qualityCheckedAt`, `scoredContentHash` (to detect staleness), `mediumPostUrl`, `publishedAt`
- [x] 1.2 Create `server/models/MediumConnection.js` with fields: `userId` (unique), `encryptedToken`, `authorId`, `username`, `connectedAt`

## 2. Encryption Utility

- [x] 2.1 Create `server/utils/encryption.js` with `encrypt(text)` / `decrypt(text)` using AES-256-GCM and `process.env.ENCRYPTION_KEY`
- [x] 2.2 Add a startup check (in `server/index.js` or `config/db.js`) that warns clearly if `ENCRYPTION_KEY` is unset, since Medium connection storage depends on it

## 3. Note Quality Service

- [x] 3.1 Create `server/services/NoteQualityService.js` with a `checkQuality(content)` function
- [x] 3.2 Implement the heuristic pre-filter (≥150 words, >1 paragraph) returning an immediate low score + feedback without an LLM call when failed
- [x] 3.3 Build the LLM prompt requesting a 0-100 score and feedback across clarity, depth, structure, completeness
- [x] 3.4 Call the LLM via `llmProvider.generate()` using a new `noteQuality` feature key
- [x] 3.5 Parse the LLM response into structured fields; implement one retry on parse failure; return an error (not a fabricated score) on persistent failure
- [x] 3.6 Implement content-hash comparison (e.g. simple string hash) to detect when stored score is stale relative to current content

## 4. Medium Service

- [x] 4.1 Create `server/services/MediumService.js` with `validateToken(token)` calling `GET https://api.medium.com/v1/me`
- [x] 4.2 Implement `publishPost({ token, authorId, title, content })` calling `POST https://api.medium.com/v1/users/{authorId}/posts` with `contentFormat: "markdown"`
- [x] 4.3 Map Medium API error responses to clear, student-facing messages (invalid token, rate limit, etc.)

## 5. Notes API

- [x] 5.1 Add `POST /api/notes/:techId/quality-check` to `server/routes/learning.js` (or a new `server/routes/notes.js`) — runs `NoteQualityService.checkQuality` on the saved note content, stores result on the `Note` document
- [x] 5.2 Add `POST /api/medium/connect` — accepts a token, validates via `MediumService.validateToken`, encrypts and stores via `MediumConnection`
- [x] 5.3 Add `GET /api/medium/status` — returns connection status (username, connectedAt) without the token
- [x] 5.4 Add `DELETE /api/medium/disconnect` — removes the `MediumConnection` for the authenticated user
- [x] 5.5 Add `POST /api/notes/:techId/publish` — server-side checks: Medium connected AND current (non-stale) score ≥ 70; on pass, decrypts token, calls `MediumService.publishPost`, stores `mediumPostUrl`/`publishedAt` on the note
- [x] 5.6 Wire score invalidation into the existing note-save route (`PUT /api/learning/notes/:techId` or equivalent): if `content` changes, clear `qualityScore`/`qualityFeedback`/`scoredContentHash`
- [x] 5.7 Mount any new route files in `server/index.js`

## 6. Frontend — API & State

- [x] 6.1 Add `checkNoteQuality(techId)`, `connectMedium(token)`, `getMediumStatus()`, `disconnectMedium()`, `publishNoteToMedium(techId)` to `client/src/api/learning.js` (or a new `client/src/api/notes.js`)

## 7. Frontend — Notes UX

- [x] 7.1 Add a "Check Quality" button to `client/src/pages/Notes.jsx`, saving unsaved edits first, then calling the quality-check API with a loading state
- [x] 7.2 Create `client/src/components/notes/QualityScore.jsx` — score display with visual indicator, four feedback dimensions, stale-score indicator
- [x] 7.3 Create `client/src/components/notes/MediumConnectionPanel.jsx` — token input + connect button (disconnected state), username + disconnect button (connected state)
- [x] 7.4 Add a "Publish to Medium" button to `Notes.jsx`, disabled with explanatory text unless connected and score ≥ 70, enabled otherwise, with loading state while publishing
- [x] 7.5 Show a "Published on Medium" indicator with date and link when `mediumPostUrl` is present

## 8. Polish & Edge Cases

- [x] 8.1 Confirm editing a note after scoring clears/invalidates the score and disables Publish until rechecked
- [x] 8.2 Confirm publish is rejected server-side even if attempted with a stale UI state (e.g. via direct API call)
- [x] 8.3 Confirm disconnecting Medium does not alter previously published notes' stored `mediumPostUrl`
- [x] 8.4 Confirm invalid/expired Medium tokens produce a specific, actionable error during connect
- [x] 8.5 Document `ENCRYPTION_KEY` as a required env var for this feature in a code comment at the top of `server/utils/encryption.js`
