## ADDED Requirements

### Requirement: Submissions are stored only after validation and review succeed
The system SHALL NOT persist any submission data unless `github-repo-validation` has passed. Review failure (per `project-code-review`'s retry/fallback rules) does not block storage of an otherwise-validated submission.

#### Scenario: Validation fails
- **WHEN** a submission fails any github-repo-validation check
- **THEN** the system stores nothing and returns the validation error to the client

#### Scenario: Validation passes, review succeeds
- **WHEN** a submission passes validation and review completes successfully
- **THEN** the system persists the submission with score, description, strengths, mistakes, and professionalism feedback

---

### Requirement: One current submission per student per project slot
The system SHALL key submissions by `(userId, projectSlotId)`. Resubmitting for the same slot SHALL overwrite the stored submission and increment an attempt counter.

#### Scenario: First submission for a slot
- **WHEN** a student submits for a project slot with no prior submission
- **THEN** the system creates a new submission record with `attemptCount = 1`

#### Scenario: Resubmission for the same slot
- **WHEN** a student submits again for a project slot with an existing submission
- **THEN** the system overwrites the stored review data and increments `attemptCount`

---

### Requirement: XP is awarded by score tier, only on improvement
The system SHALL award XP according to the score tier (85-100: 750, 70-84: 500, 50-69: 250, 0-49: 100), tracking the best XP tier already awarded per slot. Resubmission SHALL only award the difference if the new score reaches a higher tier than previously achieved.

#### Scenario: First successful submission
- **WHEN** a student's first submission for a slot completes review with a score
- **THEN** the system awards XP matching that score's tier and records it as the best tier awarded

#### Scenario: Resubmission with improved score reaching a higher tier
- **WHEN** a resubmission's score falls into a higher tier than the previously recorded best
- **THEN** the system awards the difference in XP between the new tier and the previous tier

#### Scenario: Resubmission with equal or lower tier
- **WHEN** a resubmission's score falls into the same or a lower tier than the previously recorded best
- **THEN** the system awards no additional XP

---

### Requirement: Students can retrieve their submission history and current state
The system SHALL expose an endpoint returning all of a student's project submissions, including score, description, feedback, and attempt count, for display in the Mini Projects UI.

#### Scenario: Student has submissions
- **WHEN** a student requests their project submissions
- **THEN** the system returns all submissions keyed by project slot with full review data

#### Scenario: Student has no submissions for a slot
- **WHEN** a student requests submissions and a given slot has none
- **THEN** that slot is omitted from the response (treated as not yet attempted)
