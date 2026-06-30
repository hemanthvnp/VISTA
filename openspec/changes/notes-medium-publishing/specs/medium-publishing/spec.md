## ADDED Requirements

### Requirement: Medium connection uses a student-provided Integration Token
The system SHALL connect a Medium account by accepting an Integration Token pasted by the student (Medium does not support OAuth registration for new applications). The system SHALL validate the token by calling Medium's `GET /v1/me` endpoint before storing the connection.

#### Scenario: Valid token provided
- **WHEN** a student submits a token that successfully resolves via `GET /v1/me`
- **THEN** the system stores the connection (author ID, username) and confirms the connection succeeded

#### Scenario: Invalid or expired token
- **WHEN** a student submits a token that Medium rejects
- **THEN** the system returns a specific error and does not store a connection

---

### Requirement: Medium tokens are encrypted at rest and never re-exposed
The system SHALL encrypt the Integration Token before storing it and SHALL NOT include the token in any API response after the initial connect call.

#### Scenario: Token stored
- **WHEN** a connection is successfully created
- **THEN** the token is stored in encrypted form in the database

#### Scenario: Connection status requested
- **WHEN** a student requests their Medium connection status
- **THEN** the system returns the connected username and connection date, but never the token itself

---

### Requirement: Publishing is only allowed for eligible, connected notes
The system SHALL require both a Medium connection and a current quality score meeting the publish-eligibility threshold (per `note-quality-scoring`) before allowing a publish request to proceed, enforced server-side.

#### Scenario: Not connected to Medium
- **WHEN** a student requests to publish a note without a Medium connection
- **THEN** the system returns an error indicating Medium must be connected first

#### Scenario: Connected but score below threshold
- **WHEN** a student requests to publish a note whose current score is below the threshold
- **THEN** the system rejects the request server-side, regardless of UI state

#### Scenario: Connected and eligible
- **WHEN** a student requests to publish a note that is connected to Medium and meets the score threshold
- **THEN** the system proceeds to publish

---

### Requirement: Publishing creates a Medium post and stores the result
The system SHALL call Medium's `POST /v1/users/{authorId}/posts` with the note's content as markdown, and SHALL store the returned post URL and publish timestamp on the note.

#### Scenario: Publish succeeds
- **WHEN** Medium's API returns a successful post creation response
- **THEN** the system stores the post URL and publish timestamp on the note and returns them to the client

#### Scenario: Publish fails on Medium's end
- **WHEN** Medium's API returns an error
- **THEN** the system returns that error to the student without marking the note as published

---

### Requirement: Disconnecting Medium does not unpublish existing posts
The system SHALL allow a student to disconnect their Medium account at any time. Disconnecting SHALL NOT delete, modify, or affect any previously published Medium post, and previously published notes SHALL retain their stored post URL.

#### Scenario: Student disconnects Medium
- **WHEN** a student disconnects their Medium account
- **THEN** the stored connection (including the encrypted token) is removed, and any previously published note's stored post URL remains unchanged

#### Scenario: Publish attempted after disconnect
- **WHEN** a student attempts to publish a note after disconnecting
- **THEN** the system returns the "Medium must be connected" error
