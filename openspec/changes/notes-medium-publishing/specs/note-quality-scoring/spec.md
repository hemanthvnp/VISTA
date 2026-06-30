## ADDED Requirements

### Requirement: Quality check is triggered explicitly, not on autosave
The system SHALL only compute a quality score when the student explicitly requests it (e.g., clicking "Check Quality"). The existing autosave behavior SHALL NOT trigger scoring.

#### Scenario: Student types and autosave fires
- **WHEN** the note autosaves after the student stops typing
- **THEN** no quality scoring is triggered

#### Scenario: Student requests a quality check
- **WHEN** the student explicitly requests a quality check for a saved note
- **THEN** the system begins the scoring process

---

### Requirement: A cheap heuristic pre-filter runs before any LLM call
The system SHALL check the note against minimum heuristics (at least ~150 words, more than one paragraph) before invoking the LLM. Notes failing the heuristic SHALL receive a low score and actionable feedback without an LLM call.

#### Scenario: Note is too short
- **WHEN** a quality check is requested on a note under the minimum word count
- **THEN** the system returns a low score and feedback instructing the student to add more content, without calling the LLM

#### Scenario: Note passes the heuristic
- **WHEN** a quality check is requested on a note meeting the minimum word count and paragraph structure
- **THEN** the system proceeds to LLM-based scoring

---

### Requirement: LLM scoring produces a 0-100 score and structured feedback
The system SHALL request and parse a numeric score (0-100) and feedback across four dimensions: clarity, depth, structure, and completeness.

#### Scenario: Valid score and feedback returned
- **WHEN** the LLM response includes a parseable score and all four feedback dimensions
- **THEN** the system stores the score and feedback on the note

#### Scenario: LLM response unparseable
- **WHEN** the LLM response cannot be parsed
- **THEN** the system retries once; if it still fails, the check returns an error to the student without modifying the note's stored score

---

### Requirement: Score becomes stale when note content changes
The system SHALL clear (or mark stale) a note's stored quality score whenever its content is edited after the score was computed.

#### Scenario: Note edited after scoring
- **WHEN** a student edits note content after a quality score was stored
- **THEN** the stored score is invalidated and a fresh quality check is required before the note can be published

#### Scenario: Note unchanged since last score
- **WHEN** a student requests a quality check and the content matches what was last scored
- **THEN** the system may return the existing score without a new LLM call

---

### Requirement: Publish eligibility requires a current score at or above the threshold
The system SHALL define a publish-eligibility threshold (score ≥ 70) and SHALL NOT consider a note eligible for Medium publishing unless its current (non-stale) score meets this threshold.

#### Scenario: Score meets threshold
- **WHEN** a note's current score is 70 or higher
- **THEN** the note is eligible for publishing

#### Scenario: Score below threshold
- **WHEN** a note's current score is below 70
- **THEN** the note is not eligible for publishing, and feedback explains what to improve
