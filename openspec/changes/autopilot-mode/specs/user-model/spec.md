## ADDED Requirements

### Requirement: User Model document exists for every registered user
The system SHALL maintain a `UserModel` MongoDB document for each registered user. The document SHALL be created lazily on first AutoPilot interaction and backfilled for existing users.

#### Scenario: First AutoPilot load for existing user
- **WHEN** a registered user enables AutoPilot for the first time
- **THEN** the system creates a `UserModel` document pre-populated from existing typing session and lesson history

#### Scenario: New user registration
- **WHEN** a new user registers
- **THEN** a blank `UserModel` document is created alongside the user record

---

### Requirement: Typing activity updates the User Model
The system SHALL update `UserModel.typingProfile` at the end of every typing session. Updates SHALL be incremental (append WPM to history, recalculate `avgWpm`, merge `weakKeys` by error rate).

#### Scenario: Session completed with weak keys
- **WHEN** a typing session ends and keystroke analysis identifies keys with error rate > 10%
- **THEN** those keys are merged into `UserModel.typingProfile.weakKeys` with their latest error rates

#### Scenario: WPM history bounded
- **WHEN** `wpmHistory` exceeds 50 entries
- **THEN** the oldest entry is removed to keep the array at 50 items

---

### Requirement: Learning activity updates the User Model
The system SHALL update `UserModel.learningProfile` when a user completes a lesson or topic. Completion SHALL record topic ID, score, and timestamp.

#### Scenario: Lesson completed
- **WHEN** a user marks a lesson as complete via the existing lesson API
- **THEN** the topic ID is added to `learningProfile.completedTopics` and the score recorded

#### Scenario: Current topic tracked
- **WHEN** a user opens a topic lesson
- **THEN** `learningProfile.currentTopic` is updated to that topic ID

---

### Requirement: Flashcard activity updates the User Model
The system SHALL update `UserModel.flashcardProfile` after each flashcard review session. The profile SHALL track cards reviewed, due count, and retention rate.

#### Scenario: Review session complete
- **WHEN** a flashcard review session ends
- **THEN** `flashcardProfile.retentionRate` is recalculated from correct/total answers in the session and `flashcardProfile.lastReview` is set to now

---

### Requirement: User Model is readable via API
The system SHALL expose `GET /api/autopilot/user-model` returning the current user's `UserModel` document. The endpoint SHALL require JWT authentication.

#### Scenario: Authenticated request
- **WHEN** an authenticated user calls `GET /api/autopilot/user-model`
- **THEN** the system returns the full `UserModel` document for that user

#### Scenario: Unauthenticated request
- **WHEN** an unauthenticated request is made to `GET /api/autopilot/user-model`
- **THEN** the system returns HTTP 401
