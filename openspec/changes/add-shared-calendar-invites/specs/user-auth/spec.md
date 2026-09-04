## Purpose

Lets a small team sign in to a private instance of 2LDC Calendar and restricts
administrative actions to the members explicitly granted the admin role.

## ADDED Requirements

### Requirement: Email/password login
The system SHALL authenticate a user by email and password and, on success,
establish a cookie-based session.

#### Scenario: Successful login
- **WHEN** a user submits the login form with an email and password matching an
  existing account
- **THEN** the system creates a session, sets the session cookie, and redirects the
  user to their default area (standard area for `standard` role, admin area for
  `admin` role)

#### Scenario: Wrong password
- **WHEN** a user submits the login form with an email that exists but an incorrect
  password
- **THEN** the system rejects the login, does not create a session, and shows a
  generic invalid-credentials error that does not reveal whether the email exists

### Requirement: Session persistence and logout
The system SHALL keep a user signed in across page loads via the session cookie
until they log out or the session expires, and SHALL immediately invalidate the
session on logout.

#### Scenario: Session survives reload
- **WHEN** a logged-in user reloads any page or opens a new tab on the same site
- **THEN** they remain authenticated without re-entering credentials

#### Scenario: Logout ends the session
- **WHEN** a logged-in user triggers logout
- **THEN** the system invalidates the session server-side, clears the session
  cookie, and subsequent requests to protected routes are treated as unauthenticated

### Requirement: Server-side role-gated routing
The system SHALL enforce access to role-restricted areas on the server for every
request, independent of any client-side UI hiding.

#### Scenario: Unauthenticated user requests a protected route
- **WHEN** a request with no valid session hits any route other than login/public
  routes
- **THEN** the system redirects to the login page without executing the route's
  data loading or actions

#### Scenario: Standard user requests an admin-only route
- **WHEN** an authenticated user with the `standard` role requests a route under the
  admin area
- **THEN** the system denies the request server-side (redirect or error), regardless
  of whether the admin UI would have been reachable through the interface

#### Scenario: Admin user requests an admin-only route
- **WHEN** an authenticated user with the `admin` role requests a route under the
  admin area
- **THEN** the system serves the route normally

### Requirement: First admin account bootstrap
The system SHALL provide a one-shot mechanism to create the first admin account
before any account-management interface exists, without the operator choosing a
real user's password on their behalf.

#### Scenario: Bootstrapping the first admin
- **WHEN** the project owner runs the bootstrap script against an environment with
  no existing admin account, providing the intended admin's email
- **THEN** the system creates an account with the `admin` role and produces a way
  for that specific person to set their own password (not a password chosen by the
  operator or the assistant)

### Requirement: Two-role account model
Every account SHALL have exactly one role, either `standard` or `admin`, and that
role SHALL determine which areas of the application the account can reach.

#### Scenario: New account defaults to standard
- **WHEN** an admin creates an account without explicitly granting the admin role
- **THEN** the account is assigned the `standard` role

### Requirement: Admin creates team member accounts
The system SHALL let an admin create an account for a new team member by email,
without the admin choosing that person's password.

#### Scenario: Admin adds a team member
- **WHEN** an admin submits a new team member's email (and role) through the admin
  area
- **THEN** the system creates the account and produces a way for that specific
  person to set their own password, the same pattern used for the admin bootstrap
  account

#### Scenario: Duplicate email
- **WHEN** an admin tries to create an account with an email that already has an
  account
- **THEN** the system rejects the creation and reports that the email is already in
  use
