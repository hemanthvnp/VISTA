## ADDED Requirements

### Requirement: Coaching checks run on a daily schedule
The system SHALL run a coaching evaluation for all AutoPilot-enabled users once per day (default: 08:00 server time). Evaluations SHALL detect stagnation, missed sessions, and skill regressions and store coaching messages in `UserModel.coachingState.activeMessages`.

#### Scenario: User has not logged in for 2+ days
- **WHEN** the daily check runs and `UserModel.typingProfile.lastSession` is more than 48 hours ago
- **THEN** a "come back" coaching message is added to `activeMessages` with type `re-engagement`

#### Scenario: WPM has not improved in 7 days
- **WHEN** the last 7 WPM entries in `wpmHistory` show less than 2 WPM improvement
- **THEN** a stagnation coaching message is added with suggested drill actions

#### Scenario: New weak key detected
- **WHEN** a key appears in `weakKeys` with error rate > 20% that was not in the previous check
- **THEN** a coaching message targeting that key is added with type `skill-gap`

---

### Requirement: Coaching messages are fetched on app load
The system SHALL expose `GET /api/autopilot/coaching/messages` returning the array of `activeMessages` for the authenticated user. The client SHALL call this endpoint on AutoPilot-enabled app load.

#### Scenario: Active messages exist
- **WHEN** `coachingState.activeMessages` is non-empty
- **THEN** the endpoint returns the full array, ordered by priority

#### Scenario: No active messages
- **WHEN** `activeMessages` is empty
- **THEN** the endpoint returns an empty array (HTTP 200)

---

### Requirement: Users can acknowledge or dismiss coaching messages
The system SHALL expose `POST /api/autopilot/coaching/messages/:id/ack` (acknowledge — mark read, keep) and `POST /api/autopilot/coaching/messages/:id/dismiss` (remove, suppress type for 24h).

#### Scenario: Message acknowledged
- **WHEN** a user acknowledges a coaching message
- **THEN** the message is marked `read: true` but remains in `activeMessages`

#### Scenario: Message dismissed
- **WHEN** a user dismisses a coaching message
- **THEN** the message is removed from `activeMessages` and that message type is suppressed for 24 hours

#### Scenario: Coaching fatigue protection
- **WHEN** a user has dismissed 3+ messages of the same type within 7 days
- **THEN** that message type is suppressed for 7 days (not just 24 hours)

---

### Requirement: Coaching triggers also fire after session events
The system SHALL run a lightweight coaching evaluation (not the full daily check) immediately after a typing session ends or a lesson is completed. Only time-sensitive coaching messages (e.g., immediate skill-gap detection) are generated in this path.

#### Scenario: Session-end coaching
- **WHEN** a typing session saves and a new weak key is detected
- **THEN** a coaching message for that key is immediately added to `activeMessages`
