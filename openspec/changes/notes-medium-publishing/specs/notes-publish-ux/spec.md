## ADDED Requirements

### Requirement: Notes editor shows a Check Quality action
The system SHALL display a "Check Quality" button in the Notes editor. The button SHALL show a loading state while a check is in progress.

#### Scenario: Student clicks Check Quality
- **WHEN** a student clicks "Check Quality" on a saved note
- **THEN** the button shows a loading state until the score and feedback are returned

#### Scenario: Note has unsaved changes
- **WHEN** a student clicks "Check Quality" while the note has unsaved edits
- **THEN** the system saves the note first, then runs the quality check on the saved content

---

### Requirement: Score and feedback are displayed clearly
The system SHALL display the 0-100 score with a visual indicator, plus the four feedback dimensions (clarity, depth, structure, completeness) in clearly labeled sections.

#### Scenario: Score returned
- **WHEN** a quality check completes
- **THEN** the UI shows the score prominently and the feedback dimensions below it

#### Scenario: Score is stale
- **WHEN** a note has a previously computed score that is now stale due to edits
- **THEN** the UI indicates the score is outdated and prompts a fresh check before publishing

---

### Requirement: Medium connection is managed from a dedicated panel
The system SHALL provide a Medium connection panel (token input, connect button, connected-status display with a disconnect option) accessible from the Notes page or Settings.

#### Scenario: Not connected
- **WHEN** a student has not connected Medium
- **THEN** the panel shows a token input field, a brief explanation of where to find the Medium Integration Token, and a Connect button

#### Scenario: Connected
- **WHEN** a student has connected Medium
- **THEN** the panel shows their connected Medium username and a Disconnect button, with no token field visible

---

### Requirement: Publish to Medium action is gated by eligibility
The system SHALL show a "Publish to Medium" action that is disabled (with an explanatory tooltip or message) unless the note is both connected to Medium and has a current score meeting the threshold.

#### Scenario: Not eligible
- **WHEN** a note's score is below the threshold or Medium is not connected
- **THEN** the Publish button is disabled and a message explains what's missing

#### Scenario: Eligible
- **WHEN** a note's score meets the threshold and Medium is connected
- **THEN** the Publish button is enabled

#### Scenario: Publish in progress
- **WHEN** a student clicks Publish
- **THEN** the button shows a loading state until the publish request resolves

---

### Requirement: Published notes show their Medium link
The system SHALL display the Medium post URL and publish date on a published note, with a link to view it on Medium.

#### Scenario: Note has been published
- **WHEN** a note has a stored Medium post URL
- **THEN** the UI shows a "Published on Medium" indicator with the date and a link to the post
