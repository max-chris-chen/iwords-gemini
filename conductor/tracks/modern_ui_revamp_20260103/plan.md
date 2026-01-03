# Plan: modern_ui_revamp_20260103

## Phase 1: Redesign Navigation Bar [checkpoint: 187111c]

- [x] Task: Update NavBar styles to "Playful & Bold" d886a3a
    - [x] Sub-task: Write tests for new NavBar styles and components
    - [x] Sub-task: Update `src/lib/components/NavBar.svelte` with vibrant colors and bold typography
    - [x] Sub-task: Ensure responsiveness and accessibility
- [x] Task: Conductor - User Manual Verification 'Redesign Navigation Bar' (Protocol in workflow.md)

## Phase 2: Scenario Card Component

- [ ] Task: Implement ScenarioCard component
    - [ ] Sub-task: Write unit tests for `ScenarioCard.svelte`
    - [ ] Sub-task: Create `src/lib/components/ScenarioCard.svelte` with card layout, shadows, and hover effects
    - [ ] Sub-task: Implement "Open" and "Delete" actions within the card
    - [ ] Sub-task: Add logic for thematic icon/emoji display
- [ ] Task: Conductor - User Manual Verification 'Scenario Card Component' (Protocol in workflow.md)

## Phase 3: Home Page Layout & Sorting

- [ ] Task: Update Home Page to use ScenarioCard and sort by newest first
    - [ ] Sub-task: Update `src/routes/+page.svelte` to use a grid layout for cards
    - [ ] Sub-task: Ensure scenarios are sorted by `createdAt` in descending order (server-side)
    - [ ] Sub-task: Add "Delete" functionality to the home page (wiring up the card action)
- [ ] Task: Conductor - User Manual Verification 'Home Page Layout & Sorting' (Protocol in workflow.md)

## Phase 4: Pagination (Load More)

- [ ] Task: Implement "Load More" pagination
    - [ ] Sub-task: Update `+page.server.ts` to support limit and offset for scenario fetching
    - [ ] Sub-task: Implement "Load More" button in `+page.svelte`
    - [ ] Sub-task: Update client-side logic to append new scenarios to the list
- [ ] Task: Conductor - User Manual Verification 'Pagination (Load More)' (Protocol in workflow.md)
