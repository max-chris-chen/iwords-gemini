# Implementation Plan - User Authentication with CAPTCHA

## Phase 1: Backend Foundations & Database Schema
- [x] Task: Install Dependencies 9d6d7a3
    - [x] Sub-task: Install `svg-captcha`, `bcryptjs` (or equivalent), and types.
- [x] Task: Define Mongoose Schemas f63f005
    - [x] Sub-task: Create `User` schema (username, email, mobile, passwordHash, createdAt, updatedAt).
    - [x] Sub-task: Create `Captcha` schema (token, answer, createdAt) with TTL index for expiration.
- [x] Task: Implement Database Helpers f63f005
    - [x] Sub-task: Create functions for finding users (by email/username), creating users, and verifying passwords.
    - [x] Sub-task: Create functions for storing and retrieving CAPTCHA data.
- [ ] Task: Conductor - User Manual Verification 'Backend Foundations & Database Schema' (Protocol in workflow.md)

## Phase 2: CAPTCHA API & Logic
- [ ] Task: Create CAPTCHA Generation Endpoint
    - [ ] Sub-task: Implement `GET /api/auth/captcha`: Generates SVG, stores answer in DB, returns SVG + Token (e.g. in cookie or response body).
- [ ] Task: Create CAPTCHA Verification Logic
    - [ ] Sub-task: Implement helper to verify user-submitted code against DB record.
- [ ] Task: Unit Tests for CAPTCHA Logic
    - [ ] Sub-task: Verify generation creates DB entry.
    - [ ] Sub-task: Verify correct code validation returns true.
    - [ ] Sub-task: Verify incorrect/expired code validation returns false.
- [ ] Task: Conductor - User Manual Verification 'CAPTCHA API & Logic' (Protocol in workflow.md)

## Phase 3: Registration Implementation
- [ ] Task: Implement Registration API
    - [ ] Sub-task: Create `POST /api/auth/register` (or SvelteKit form action).
    - [ ] Sub-task: Validate inputs (email format, uniqueness, etc.).
    - [ ] Sub-task: Verify CAPTCHA first.
    - [ ] Sub-task: Hash password and save user.
- [ ] Task: Implement Registration UI
    - [ ] Sub-task: Create `/register` page with form fields (Username, Email, Mobile, Password, CAPTCHA).
    - [ ] Sub-task: Fetch and display CAPTCHA SVG.
    - [ ] Sub-task: Handle form submission and error display.
- [ ] Task: E2E Tests for Registration
    - [ ] Sub-task: Test successful registration flow.
    - [ ] Sub-task: Test validation errors (existing user, wrong CAPTCHA).
- [ ] Task: Conductor - User Manual Verification 'Registration Implementation' (Protocol in workflow.md)

## Phase 4: Login Implementation
- [ ] Task: Implement Login API
    - [ ] Sub-task: Create `POST /api/auth/login` (or SvelteKit form action).
    - [ ] Sub-task: Verify CAPTCHA first.
    - [ ] Sub-task: Find user by email, verify password.
    - [ ] Sub-task: Create session (cookie/token) on success.
- [ ] Task: Implement Login UI
    - [ ] Sub-task: Create `/login` page with form fields (Email, Password, CAPTCHA).
    - [ ] Sub-task: Fetch and display CAPTCHA SVG.
    - [ ] Sub-task: Handle form submission and error display.
- [ ] Task: E2E Tests for Login
    - [ ] Sub-task: Test successful login flow.
    - [ ] Sub-task: Test login failure (wrong credentials, wrong CAPTCHA).
- [ ] Task: Conductor - User Manual Verification 'Login Implementation' (Protocol in workflow.md)
