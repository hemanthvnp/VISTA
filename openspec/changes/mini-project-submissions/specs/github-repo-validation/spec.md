## ADDED Requirements

### Requirement: Repo URL must be a well-formed GitHub repository reference
The system SHALL reject submissions where the provided URL does not match a `github.com/{owner}/{repo}` pattern, before making any external API calls.

#### Scenario: Malformed URL
- **WHEN** a student submits a URL that is not a valid `github.com/{owner}/{repo}` link
- **THEN** the system returns a validation error identifying the URL as malformed and makes no GitHub API calls

#### Scenario: Well-formed URL
- **WHEN** a student submits a URL matching `github.com/{owner}/{repo}` (with or without trailing slash, `.git` suffix, or protocol prefix)
- **THEN** the system proceeds to the next validation check

---

### Requirement: Repo must exist and be publicly accessible
The system SHALL call the GitHub API to confirm the repository exists and is public before proceeding.

#### Scenario: Repo not found or private
- **WHEN** `GET /repos/{owner}/{repo}` returns 404 or indicates a private repository
- **THEN** the system returns a validation error stating the repo could not be found or is not public, and stores nothing

#### Scenario: Repo found and public
- **WHEN** `GET /repos/{owner}/{repo}` returns 200 with `private: false`
- **THEN** the system proceeds to the next validation check

---

### Requirement: Repo owner must match the student's claimed GitHub username
The system SHALL compare the repo owner's login (case-insensitive) against the GitHub username the student has provided.

#### Scenario: Owner mismatch
- **WHEN** the repo owner login does not match the student's claimed GitHub username
- **THEN** the system returns a validation error stating the repo does not belong to the claimed account, and stores nothing

#### Scenario: Owner match
- **WHEN** the repo owner login matches the student's claimed GitHub username (case-insensitive)
- **THEN** the system proceeds to the next validation check

---

### Requirement: Repo must show a minimum level of genuine activity
The system SHALL require at least 3 commits in the repository before accepting it.

#### Scenario: Too few commits
- **WHEN** the repository has fewer than 3 commits
- **THEN** the system returns a validation error stating more development activity is required, and stores nothing

#### Scenario: Sufficient commits
- **WHEN** the repository has 3 or more commits
- **THEN** the system proceeds to the next validation check

---

### Requirement: Repo must contain a README and more than a trivial amount of content
The system SHALL require a README file at the repository root and at least one additional file beyond the README.

#### Scenario: Missing README
- **WHEN** no README file is found at the repository root
- **THEN** the system returns a validation error stating a README is required, and stores nothing

#### Scenario: Empty or trivial repo
- **WHEN** the repository contains only a README and no other files
- **THEN** the system returns a validation error stating the project appears empty, and stores nothing

#### Scenario: All checks pass
- **WHEN** the repo is well-formed, exists, is public, owner matches, has ≥3 commits, has a README, and has additional content
- **THEN** the system marks the submission as validated and proceeds to code review

---

### Requirement: GitHub API failures are surfaced distinctly from validation failures
The system SHALL distinguish between "validation failed" (student-actionable) and "GitHub API unavailable" (transient, not the student's fault) in the response.

#### Scenario: GitHub API error or rate limit
- **WHEN** the GitHub API returns a 5xx error or a rate-limit response during validation
- **THEN** the system returns a distinct "try again later" error rather than a validation failure, and stores nothing
