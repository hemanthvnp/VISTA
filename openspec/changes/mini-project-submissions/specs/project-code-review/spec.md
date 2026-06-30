## ADDED Requirements

### Requirement: Review runs only on a validated submission
The system SHALL only invoke code review after `github-repo-validation` has passed for a submission.

#### Scenario: Review attempted without validation
- **WHEN** the review service is invoked for a submission that has not passed validation
- **THEN** the system rejects the call and does not invoke the LLM

---

### Requirement: Review input is built from a bounded, curated subset of repo content
The system SHALL fetch the README, the manifest file if present, and up to 5 source files selected by heuristic (entry points and largest non-test files), each truncated to ~3000 characters, with combined content capped at ~12000 characters, plus the full file tree (paths only).

#### Scenario: Repo larger than the content cap
- **WHEN** the selected file contents exceed the combined cap
- **THEN** the system truncates lowest-priority files first while preserving README and manifest content in full where possible

#### Scenario: Repo with no detectable entry point
- **WHEN** no recognizable entry-point file (e.g., `index.js`, `main.py`, `app.js`) is found
- **THEN** the system falls back to the largest non-test source files for review input

---

### Requirement: Review produces a quality score from 0 to 100
The system SHALL request and parse a numeric score between 0 and 100 from the LLM response.

#### Scenario: Valid score returned
- **WHEN** the LLM response includes a parseable score between 0 and 100
- **THEN** the system stores that score with the submission

#### Scenario: LLM response unparseable
- **WHEN** the LLM response cannot be parsed into a valid score
- **THEN** the system retries the review once; if it still fails, the submission is stored with a `reviewFailed` flag and a default score of 0, without blocking storage of the validated submission

---

### Requirement: Review produces an auto-generated project description
The system SHALL request a 2-4 sentence plain-English description of what the project does, generated from the repo contents (not from a student-provided description).

#### Scenario: Description generated
- **WHEN** the review completes successfully
- **THEN** the system stores an auto-generated description summarizing the project's purpose and key functionality

---

### Requirement: Review produces strengths, key mistakes, and professionalism feedback
The system SHALL request and store three distinct feedback sections: strengths (what was done well), key mistakes (concrete issues found), and professionalism feedback (naming conventions, code structure, error handling, documentation quality).

#### Scenario: Full feedback returned
- **WHEN** the review completes successfully
- **THEN** the system stores non-empty strengths, key mistakes, and professionalism feedback sections, each referencing specific files where applicable

#### Scenario: High-quality submission with no major mistakes
- **WHEN** the reviewed code has no significant issues
- **THEN** the key mistakes section explicitly states this rather than being left empty or fabricating issues

---

### Requirement: Review feedback is grounded only in provided content
The system SHALL instruct the LLM to base all feedback strictly on the provided file contents and file tree, and not speculate about code it has not seen.

#### Scenario: LLM lacks visibility into a file
- **WHEN** a file referenced in feedback was not part of the review input
- **THEN** the system's prompt design SHALL discourage the LLM from referencing files outside the provided set
