# Specification: User Scenario Ownership and Privacy

## Overview
This track introduces user-specific scenario ownership. Logged-in users should have a private space to manage their scenarios, which are not visible to the general public by default. Users will be redirected to their personal dashboard after login. They also have the ability to explicitly publish scenarios to the public home page or share them via direct links.

## Functional Requirements

### 1. Data Ownership & Visibility
- **Legacy Scenarios:** All scenarios created before this feature (without an owner field) will be treated as "Public" and visible on the public home page.
- **User Scenarios:** Scenarios created by a logged-in user are automatically assigned to that user and are "Private" by default.
- **Public Visibility:** The home page (`/`) will only display scenarios marked as "Public" (legacy or user-published).
- **Personal Visibility:** A logged-in user can see all their personal scenarios (both private and published).

### 2. Navigation & UI
- **Dashboard Route:** Create a new dashboard route (e.g., `/dashboard`) that displays the current user's scenarios.
- **Login Redirect:** Upon successful login or registration, users are automatically redirected to the `/dashboard`.
- **Public Page:** The root page (`/`) continues to show public scenarios. Logged-in users can still access this page via a "Public Gallery" or "Home" link.
- **Scenario Detail (MindMap):** While viewing a personal scenario, a user can access "Share" and "Publish" actions.

### 3. Sharing & Publishing
- **Publish to Public:** Users can toggle a "Public" status for their scenarios. Once published, the scenario appears in the public gallery for all users.
- **Direct Link Sharing:** Every scenario (even if private) can be accessed via its unique URL if the user has the link, allowing for "unlisted" sharing.

### 4. API & Security
- **Access Control:** Update GET scenario endpoints to ensure privacy is respected, but allow access via direct ID (unlisted sharing).
- **Ownership Filter:** Update scenario listing APIs to support filtering by owner ID or public status.

## Acceptance Criteria
- [ ] Logged-in users see their scenarios on a new `/dashboard` page.
- [ ] Logged-out users only see public/legacy scenarios on the home page.
- [ ] Users are redirected to `/dashboard` after login.
- [ ] A "Publish" button exists in the MindMap view for user-owned scenarios.
- [ ] Legacy scenarios remain visible to everyone on the root page.

## Out of Scope
- Granular permissions (e.g., sharing with specific user emails).
- Collaborative editing.
