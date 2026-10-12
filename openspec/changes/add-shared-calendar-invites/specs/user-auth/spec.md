## Purpose

Lets a small team sign in to a private instance of 2LDC Calendar and restricts
administrative actions to the members explicitly granted the admin role.

## ADDED Requirements

### Requirement: Prénom/password login
The system SHALL authenticate a user by prénom (first name) and password and, on
success, establish a cookie-based session. Each account still has an email, kept as
better-auth's internal identity, but members never type it.

#### Scenario: Successful login
- **WHEN** a user submits the login form with a prénom and password matching an
  existing account
- **THEN** the system creates a session, sets the session cookie, and redirects the
  user to their default area (standard area for `standard` role, admin area for
  `admin` role)

#### Scenario: Wrong password or unknown prénom
- **WHEN** a user submits the login form with a prénom that does not exist, or with
  an existing prénom and an incorrect password
- **THEN** the system rejects the login, does not create a session, and shows the
  same generic invalid-credentials error in both cases, so it never reveals whether
  the prénom exists

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
The system SHALL provide a one-shot script to create the first admin account before
any account-management interface exists. Public self-signup stays disabled.

#### Scenario: Bootstrapping the first admin
- **WHEN** the project owner runs the bootstrap script with an email, a prénom and a
  password, against an environment with no existing admin account
- **THEN** the system creates an account with the `admin` role, and the owner passes
  the password on to that person; there is no email-based password flow

#### Scenario: An admin already exists
- **WHEN** the bootstrap script runs against an environment that already has an
  admin account
- **THEN** the system refuses to create the account; later accounts are created from
  the admin area

#### Scenario: Prénom already taken at bootstrap
- **WHEN** the bootstrap script is given a prénom that another account already uses
- **THEN** the system refuses to create the account

### Requirement: Two-role account model
Every account SHALL have exactly one role, either `standard` or `admin`, and that
role SHALL determine which areas of the application the account can reach.

#### Scenario: New account defaults to standard
- **WHEN** an admin creates an account without explicitly granting the admin role
- **THEN** the account is assigned the `standard` role

### Requirement: Admin creates team member accounts
The system SHALL let an admin create an account for a new team member with a
prénom, an email, a password chosen by the admin, a role and an instrument. The admin
passes the password on to the member; there is no email-based password or reset
flow.

#### Scenario: Admin adds a team member
- **WHEN** an admin submits a new member's prénom, email, password (at least 8
  characters), role and instrument through the admin area
- **THEN** the system creates the account, and the member can log in with that
  prénom and password

#### Scenario: Duplicate prénom
- **WHEN** an admin tries to create an account with a prénom another account already
  uses
- **THEN** the system rejects the creation and reports that the prénom is taken,
  because login by prénom needs each one to be unique

#### Scenario: Duplicate email
- **WHEN** an admin tries to create an account with an email that already has an
  account
- **THEN** the system rejects the creation and reports that the email is already in
  use
