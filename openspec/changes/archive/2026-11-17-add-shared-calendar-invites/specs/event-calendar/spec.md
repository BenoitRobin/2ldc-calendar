## Purpose

Gives the whole team one shared source of truth for upcoming events, managed by
admins and visible to every member — no per-event invite list to maintain.

## ADDED Requirements

### Requirement: Admin creates events
The system SHALL let an admin create an event with a name, date, start and end time,
location, and description.

#### Scenario: Successful creation
- **WHEN** an admin submits the event form with a name and a date
- **THEN** the system saves the event and it becomes visible on the shared calendar
  to every authenticated user

#### Scenario: Missing required fields
- **WHEN** an admin submits the event form without a name or without a date
- **THEN** the system rejects the submission and reports which fields are required

### Requirement: Admin edits events
The system SHALL let an admin update any field of an existing event.

#### Scenario: Successful edit
- **WHEN** an admin changes an event's date, time, location, or description and
  saves
- **THEN** the system persists the change and every user immediately sees the
  updated details when they next view the event

### Requirement: Admin deletes events
The system SHALL let an admin delete an event, and SHALL require explicit
confirmation before deleting.

#### Scenario: Confirmed deletion
- **WHEN** an admin confirms deletion of an event
- **THEN** the system removes the event from the shared calendar and removes the
  presence responses recorded against it

#### Scenario: Deletion without confirmation
- **WHEN** an admin triggers delete but does not confirm
- **THEN** the system takes no action and the event remains unchanged

### Requirement: Shared read access for every user
The system SHALL show every authenticated user, regardless of role, the same set of
events on the calendar — there is no per-user or per-event invitee list.

#### Scenario: Standard user views the calendar
- **WHEN** an authenticated user with the `standard` role opens the calendar
- **THEN** they see every event an admin has created, with the same details an admin
  would see

### Requirement: Write actions restricted to admins
The system SHALL reject event creation, edit, and deletion requests from accounts
without the `admin` role, even if the request is made directly against the
server rather than through the UI.

#### Scenario: Standard user attempts to create an event directly
- **WHEN** an authenticated `standard`-role account submits a create/edit/delete
  request for an event, bypassing the UI
- **THEN** the system rejects the request server-side and makes no change to the
  event data
