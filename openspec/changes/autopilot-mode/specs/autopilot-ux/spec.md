## ADDED Requirements

### Requirement: AutoPilot toggle is available in Dashboard and Settings
The system SHALL display an AutoPilot toggle control in the Dashboard top bar and in the Settings page. Toggling on SHALL persist the preference to `UserModel.autopilotEnabled` and to local Zustand store.

#### Scenario: User enables AutoPilot from Dashboard
- **WHEN** a user clicks the AutoPilot toggle in the Dashboard
- **THEN** AutoPilot is enabled, the toggle shows an "on" state, and the Dashboard view shifts to AutoPilot layout within the same render cycle

#### Scenario: AutoPilot state persists across sessions
- **WHEN** a user enables AutoPilot and later logs out and back in
- **THEN** AutoPilot remains enabled (loaded from `UserModel.autopilotEnabled`)

---

### Requirement: AutoPilot Dashboard view shows the next-action queue
The system SHALL render a dedicated AutoPilot layout on the Dashboard when AutoPilot is enabled. This layout SHALL display the prioritized next-action queue from the Adaptive Engine, replacing the default "recent sessions" widget.

#### Scenario: Queue has items
- **WHEN** AutoPilot is enabled and the next-action queue is non-empty
- **THEN** up to 5 action cards are displayed in priority order, each showing type, reason, and a primary CTA button

#### Scenario: Queue is empty
- **WHEN** AutoPilot is enabled and the queue returns empty
- **THEN** the Dashboard shows a "You're all caught up" message with an option to start a free typing session

#### Scenario: User acts on a queue item
- **WHEN** a user clicks the CTA on an action card
- **THEN** the app navigates to the relevant page (typing practice, lesson, flashcard review) with AutoPilot context pre-loaded

---

### Requirement: AutoPilot-suggested content is visually distinct
The system SHALL mark any content generated or suggested by AutoPilot (typing exercises, flashcard decks, lesson queues) with a visible "AutoPilot" badge or indicator, so users can distinguish AI-driven from manually chosen content.

#### Scenario: AI-generated typing exercise displayed
- **WHEN** AutoPilot is enabled and the Typing page loads
- **THEN** the exercise text area shows an "AutoPilot" badge and the exercise is pre-filled with the generated content

#### Scenario: User overrides AutoPilot content
- **WHEN** a user manually selects a different typing mode or exercise while AutoPilot is enabled
- **THEN** the manual choice takes effect immediately and the AutoPilot badge is hidden for that session

---

### Requirement: Coaching messages surface as non-blocking in-app notifications
The system SHALL display coaching messages from the Proactive Coach as dismissible banner notifications in the app header, using the existing `useNotifications` hook. Notifications SHALL not block navigation.

#### Scenario: Coaching message arrives on app load
- **WHEN** AutoPilot is enabled and `GET /api/autopilot/coaching/messages` returns non-empty
- **THEN** the first unread message is displayed as a banner notification at the top of the page

#### Scenario: Multiple coaching messages
- **WHEN** multiple coaching messages are active
- **THEN** only one is shown at a time; the user can cycle through or dismiss individually

---

### Requirement: AutoPilot can be disabled at any time without data loss
The system SHALL allow users to disable AutoPilot at any time. Disabling SHALL revert all pages to their standard manual layout. The User Model data SHALL be preserved and AutoPilot re-enabling SHALL restore the previous state.

#### Scenario: User disables AutoPilot
- **WHEN** a user toggles AutoPilot off
- **THEN** the Dashboard returns to manual layout, AI-generated content suggestions stop, and coaching notifications are suppressed
