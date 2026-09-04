## Purpose

Lets each team member record whether they will attend a shared event, and gives
everyone a single overview of who has answered, so the team can plan without asking
around.

## ADDED Requirements

### Requirement: Four-state presence response
The system SHALL represent each user's relationship to an event as exactly one of
four states: `oui` (yes), `non` (no), `indécis` (maybe), or no response yet — and
SHALL default every user to no response until they act.

#### Scenario: Event has no response yet
- **WHEN** a user views an event they have not responded to
- **THEN** the system shows their status as "no response", distinct from "no" — it
  never conflates "hasn't answered" with a negative answer

### Requirement: User sets their own presence response
The system SHALL let any authenticated user set or change their own presence
response on any event, at any time.

#### Scenario: First response
- **WHEN** a user selects "oui", "non", or "indécis" on an event they have not
  responded to
- **THEN** the system records that status for that user and that event

#### Scenario: Changing a response
- **WHEN** a user who already responded selects a different status on the same
  event
- **THEN** the system replaces the prior status with the new one

### Requirement: Optimistic response updates
The system SHALL reflect a presence response change in the interface immediately,
before server confirmation, and SHALL revert the displayed state if the save fails.

#### Scenario: Save succeeds
- **WHEN** a user selects a new presence status
- **THEN** the interface shows the new status immediately, and the server
  confirmation does not visibly change it again

#### Scenario: Save fails
- **WHEN** a user selects a new presence status and the server rejects or fails to
  persist it
- **THEN** the interface reverts to the previous status and indicates the change did
  not save

### Requirement: Attendance overview
The system SHALL provide a users-by-events overview showing every user's presence
response for every event, available to every authenticated user in read-only form.

#### Scenario: Standard user views the overview
- **WHEN** an authenticated `standard`-role user opens the attendance overview
- **THEN** they see every user's status for every event, but cannot change any
  response other than their own from this view

### Requirement: Admin can correct any response
The system SHALL let an admin edit any user's presence response on any event from
the attendance overview, for cases where a manual correction is needed.

#### Scenario: Admin corrects another user's response
- **WHEN** an admin changes the recorded status for a different user on a given
  event from the attendance overview
- **THEN** the system saves the correction and that user sees the updated status the
  next time they view the event

### Requirement: Accessible status color coding
The system SHALL represent the four presence states with a consistent color per
state across the app, and each color/text combination used for a status SHALL meet
a minimum accessible contrast ratio.

#### Scenario: Status badge contrast
- **WHEN** a presence status badge is rendered in either the calendar or the
  overview
- **THEN** its text-to-background contrast ratio meets or exceeds the WCAG AA
  threshold for the text size used
