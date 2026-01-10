# Plan: User Scenario Ownership and Privacy

## Phase 1: Database & Model Foundation [checkpoint: d41dcca]
- [x] Task: Update `Scenario` type and database schema to include `ownerId` (string, optional) and `isPublic` (boolean). [908a059]
- [x] Task: Create a migration script or utility to mark all existing (legacy) scenarios as `isPublic: true`. [2ecd423]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database & Model Foundation' (Protocol in workflow.md)

## Phase 2: API & Backend Logic [checkpoint: f8ba72b]
- [x] Task: Update scenario creation logic (e.g., in `src/lib/server/scenario.ts`) to automatically set `ownerId` from the session and default `isPublic` to `false`. [356bc8a]
- [x] Task: Enhance `listScenarios` in `src/lib/server/db.ts` to support filtering by `ownerId` and/or `isPublic` status. [ec146e6]
- [x] Task: Update `GET /api/scenario` (public listing) to only return scenarios where `isPublic: true`. [6f1303c]
- [x] Task: Implement `PATCH /api/scenario/[id]` endpoint to allow owners to toggle the `isPublic` status. [f09fe67]
- [x] Task: Conductor - User Manual Verification 'Phase 2: API & Backend Logic' (Protocol in workflow.md)

## Phase 3: Dashboard & Navigation
- [x] Task: Create the `/dashboard` route (`src/routes/dashboard/+page.svelte` and `+page.server.ts`) to display the user's personal scenarios. [6b9a685]
- [x] Task: Implement redirection logic in `login` and `register` actions to send users to `/dashboard` upon success. [4a724ae]
- [ ] Task: Update `NavBar.svelte` to show "Dashboard" for logged-in users and ensure "Home" points to the public gallery.
- [ ] Task: Update the root page (`src/routes/+page.server.ts`) to only fetch public scenarios.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Dashboard & Navigation' (Protocol in workflow.md)

## Phase 4: Sharing & Publishing UI
- [ ] Task: In the scenario detail page (`src/routes/scenario/[id]`), add a "Publish to Gallery" toggle for scenarios owned by the current user.
- [ ] Task: Implement the frontend logic to call the `PATCH` API when the "Publish" toggle is flipped.
- [ ] Task: Ensure the "Share" link functionality is clearly visible (copying the current URL).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Sharing & Publishing UI' (Protocol in workflow.md)
