## ADDED Requirements

### Requirement: Mini Projects page presents a submission form per project slot
The system SHALL replace the local-only subtask checklist with a form collecting a GitHub repo URL, the student's GitHub username (pre-filled if previously provided), and optional live demo link and notes.

#### Scenario: First visit to a project slot
- **WHEN** a student opens a project slot with no prior submission
- **THEN** the system shows an empty submission form with the GitHub repo URL field required

#### Scenario: Returning to a previously submitted slot
- **WHEN** a student opens a project slot with an existing submission
- **THEN** the system pre-fills the form with the previously submitted values and shows the prior review results

---

### Requirement: Validation errors are shown inline and specifically
The system SHALL display the specific validation error returned by the backend (e.g., "repo not found", "owner mismatch", "too few commits") rather than a generic failure message.

#### Scenario: Submission fails validation
- **WHEN** the backend returns a validation error
- **THEN** the UI displays that specific error message next to the relevant form field or as a submission-level alert, and the form remains editable

---

### Requirement: Review results are displayed with score, description, and feedback breakdown
The system SHALL render the score (0-100, with a visual indicator), the auto-generated description, and three labeled sections: strengths, key mistakes, and professionalism feedback.

#### Scenario: Review completes successfully
- **WHEN** a submission's review data is available
- **THEN** the UI shows the score prominently, followed by the description, then strengths, key mistakes, and professionalism feedback in clearly separated sections

#### Scenario: Review failed but submission was stored
- **WHEN** a submission has `reviewFailed: true`
- **THEN** the UI shows the validated/stored state with a notice that review could not be completed, and offers a retry action

---

### Requirement: Submission is in-progress state is visibly indicated
The system SHALL show a loading state while a submission is being validated and reviewed, since this is a synchronous multi-second operation.

#### Scenario: Submission in flight
- **WHEN** a student submits the form and the request is pending
- **THEN** the UI disables the submit button and shows a loading indicator until a response (success or error) is received

---

### Requirement: XP earned is shown per submission outcome
The system SHALL display the XP awarded (if any) immediately after a successful submission, including the case where a resubmission earned no additional XP.

#### Scenario: XP awarded
- **WHEN** a submission results in new XP being awarded
- **THEN** the UI shows the XP amount earned alongside the score

#### Scenario: No additional XP on resubmission
- **WHEN** a resubmission's score does not reach a higher tier
- **THEN** the UI shows the updated review feedback without implying additional XP was earned
