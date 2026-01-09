# Implementation Plan - User Authentication with CAPTCHA

## Phase 1: Backend Foundations & Database Schema [checkpoint: 714b822]
- [x] Task: Install Dependencies 9d6d7a3
    - [x] Sub-task: Install `svg-captcha`, `bcryptjs` (or equivalent), and types.
- [x] Task: Define Mongoose Schemas f63f005
    - [x] Sub-task: Create `User` schema (username, email, mobile, passwordHash, createdAt, updatedAt).
    - [x] Sub-task: Create `Captcha` schema (token, answer, createdAt) with TTL index for expiration.
- [x] Task: Implement Database Helpers f63f005
    - [x] Sub-task: Create functions for finding users (by email/username), creating users, and verifying passwords.
    - [x] Sub-task: Create functions for storing and retrieving CAPTCHA data.
- [ ] Task: Conductor - User Manual Verification 'Backend Foundations & Database Schema' (Protocol in workflow.md)

## Phase 2: CAPTCHA API & Logic [checkpoint: 59f5a29]
- [x] Task: Create CAPTCHA Generation Endpoint 09a6bb0
    - [x] Sub-task: Implement `GET /api/auth/captcha`: Generates SVG, stores answer in DB, returns SVG + Token (e.g. in cookie or response body).
- [x] Task: Create CAPTCHA Verification Logic 09a6bb0
    - [x] Sub-task: Implement helper to verify user-submitted code against DB record.
- [x] Task: Unit Tests for CAPTCHA Logic 09a6bb0
    - [x] Sub-task: Verify generation creates DB entry.
    - [x] Sub-task: Verify correct code validation returns true.
    - [x] Sub-task: Verify incorrect/expired code validation returns false.

## Phase 3: Registration Implementation [checkpoint: 82c15c5]
- [x] Task: Implement Registration API e6edf09
    - [x] Sub-task: Create `POST /api/auth/register` (or SvelteKit form action).
    - [x] Sub-task: Validate inputs (email format, uniqueness, etc.).
    - [x] Sub-task: Verify CAPTCHA first.
    - [x] Sub-task: Hash password and save user.
- [x] Task: Implement Registration UI e6edf09
    - [x] Sub-task: Create `/register` page with form fields (Username, Email, Mobile, Password, CAPTCHA).
    - [x] Sub-task: Fetch and display CAPTCHA SVG.
    - [x] Sub-task: Handle form submission and error display.
- [x] Task: E2E Tests for Registration e6edf09
    - [x] Sub-task: Test successful registration flow.
    - [x] Sub-task: Test validation errors (existing user, wrong CAPTCHA).
- [x] Task: Conductor - User Manual Verification 'Registration Implementation' (Protocol in workflow.md) e6edf09

## Phase 4: Login Implementation [checkpoint: 82c15c5]
- [x] Task: Implement Login API e6edf09
    - [x] Sub-task: Create `POST /api/auth/login` (or SvelteKit form action).
    - [x] Sub-task: Verify CAPTCHA first.
    - [x] Sub-task: Find user by email, verify password.
    - [x] Sub-task: Create session (cookie/token) on success.
- [x] Task: Implement Login UI e6edf09
    - [x] Sub-task: Create `/login` page with form fields (Email, Password, CAPTCHA).
    - [x] Sub-task: Fetch and display CAPTCHA SVG.
    - [x] Sub-task: Handle form submission and error display.
- [x] Task: E2E Tests for Login e6edf09
    - [x] Sub-task: Test successful login flow.
    - [x] Sub-task: Test login failure (wrong credentials, wrong CAPTCHA).
- [x] Task: Conductor - User Manual Verification 'Login Implementation' (Protocol in workflow.md) e6edf09
