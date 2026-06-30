## ADDED Requirements

### Requirement: Generate personalized typing exercises
The system SHALL expose `GET /api/autopilot/content/typing-exercise` that returns a typing exercise string (50–200 characters) targeting the user's current `weakKeys`. The exercise SHALL be generated via the existing LLM abstraction and cached in the `UserModel` until `weakKeys` changes.

#### Scenario: Weak keys exist
- **WHEN** the endpoint is called and `weakKeys` contains at least one key
- **THEN** the system returns a typing exercise that contains multiple instances of those characters in natural-sounding words or code snippets

#### Scenario: Cache hit
- **WHEN** `weakKeys` has not changed since the last generation
- **THEN** the cached exercise is returned without an LLM call

#### Scenario: Cache cold (first call or model changed)
- **WHEN** no cached exercise exists or `weakKeys` has changed
- **THEN** a new exercise is generated via LLM and cached before responding

---

### Requirement: Generate flashcard decks from lesson content
The system SHALL expose `POST /api/autopilot/content/flashcards` accepting a `topicId` and returning an array of 5–10 flashcard objects (`{ front, back }`) generated from that topic's lesson content via LLM.

#### Scenario: Valid topic requested
- **WHEN** a valid `topicId` is provided
- **THEN** the system returns 5–10 flashcard objects relevant to that topic's key concepts

#### Scenario: Duplicate prevention
- **WHEN** generated flashcard fronts match existing cards for the user in that topic
- **THEN** those cards are excluded from the returned array

---

### Requirement: Generate lesson summaries
The system SHALL expose `GET /api/autopilot/content/lesson-summary/:topicId` returning a 2–4 sentence plain-English summary of the topic, generated via LLM and cached per topic (not per user, as summaries are not personalized).

#### Scenario: Summary requested
- **WHEN** a valid `topicId` is requested
- **THEN** the system returns a concise summary of the topic's core concepts

#### Scenario: Shared cache across users
- **WHEN** two different users request a summary for the same topic
- **THEN** both receive the same cached response (no redundant LLM calls)

---

### Requirement: Generation failures degrade gracefully
The system SHALL return a fallback (static exercise, empty flashcard array, or empty summary) when the LLM call fails, rather than returning an error to the client.

#### Scenario: LLM call fails
- **WHEN** the LLM service returns an error or times out
- **THEN** the endpoint returns HTTP 200 with a predefined fallback value and logs the error server-side
