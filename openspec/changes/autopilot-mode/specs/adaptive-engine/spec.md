## ADDED Requirements

### Requirement: Adaptive Engine produces a prioritized next-action queue
The system SHALL expose `GET /api/autopilot/next-action` returning an ordered array of up to 5 action items across typing, learning, and flashcard domains. Each item SHALL include a `type`, `reason`, `priority`, and `payload` (content or route).

#### Scenario: User has weak typing keys
- **WHEN** `UserModel.typingProfile.weakKeys` contains at least one key with error rate > 15%
- **THEN** the queue includes a typing drill action targeting those keys as the highest-priority item

#### Scenario: Flashcards are due
- **WHEN** `UserModel.flashcardProfile.cardsDue` > 0
- **THEN** the queue includes a flashcard review action with `cardsDue` count in the payload

#### Scenario: Next lesson available
- **WHEN** `UserModel.learningProfile.currentTopic` is set and the next lesson in that topic is not yet completed
- **THEN** the queue includes a "continue lesson" action pointing to that lesson route

#### Scenario: No activity data yet
- **WHEN** the User Model is blank (new user, no sessions)
- **THEN** the queue returns a default onboarding sequence: [start typing practice, browse learn hub, create first flashcard deck]

---

### Requirement: Action items are deterministic for the same User Model state
The system SHALL produce the same queue for the same `UserModel` snapshot. Priority is computed from a fixed rule set ordered by: (1) due flashcards, (2) weak key drills, (3) lesson continuation, (4) new topic suggestion, (5) typing practice.

#### Scenario: Deterministic ordering
- **WHEN** the same `UserModel` is passed to the engine twice
- **THEN** the returned queue order is identical both times

---

### Requirement: Each action item has a dismissible state
The system SHALL support `POST /api/autopilot/next-action/:id/dismiss` to mark an action item as dismissed. Dismissed items SHALL be excluded from the queue for 24 hours.

#### Scenario: User dismisses an action
- **WHEN** a user dismisses an action item
- **THEN** that action type is excluded from the queue for the next 24 hours

#### Scenario: Dismissal expires
- **WHEN** 24 hours have passed since dismissal
- **THEN** the action is eligible to re-enter the queue if conditions still apply
