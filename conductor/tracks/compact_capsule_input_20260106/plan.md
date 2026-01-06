# Plan: Compact Capsule Scenario Input

## Phase 1: Component Development - Capsule Input [checkpoint: c59df56]

- [x] Task: Create UI Component Structure (TDD) 06e7bc9
    - [ ] Create `src/lib/components/CapsuleInput.svelte` and `src/lib/components/CapsuleInput.svelte.spec.ts`.
    - [ ] Write tests for initial render: check for compact state, placeholder text, and icon presence.
    - [ ] Implement basic structure: HTML input with container, "Plus" icon.
- [x] Task: Implement Expansion Logic (TDD) 57927a5
    - [ ] Write tests for interaction: click/focus expands width, blur collapses width (if empty).
    - [ ] Implement CSS transitions for `width` property.
    - [ ] Implement event handlers for `focus` and `blur`.
- [x] Task: Implement Submission Logic (TDD) fb2c08e
    - [ ] Write tests for submission: `Enter` key triggers event, Icon click triggers event.
    - [ ] Implement `dispatch` event on submission with the input value.
    - [ ] Ensure input clears and collapses after successful submission.
- [x] Task: Styling & Responsiveness e31da96
    - [ ] Apply Tailwind CSS classes for pill shape (`rounded-full`), colors, and shadows.
    - [ ] Ensure responsive widths (e.g., `w-32` expanding to `w-64` or percentage based).
- [x] Task: Conductor - User Manual Verification 'Phase 1: Component Development - Capsule Input' (Protocol in workflow.md)

## Phase 2: Integration & Homepage Refactor

- [x] Task: Integrate into Navigation/Header (TDD) 532e976
    - [ ] Identify the header component (likely `NavBar.svelte` or `+layout.svelte`).
    - [ ] Write tests ensuring `CapsuleInput` is rendered in the header.
    - [ ] Place `CapsuleInput` in the header.
- [x] Task: Connect to Backend Action b0357ef
    - [ ] Wire up the submission event from `CapsuleInput` to the existing scenario creation logic (API call or form action).
    - [ ] Ensure the redirection to the new scenario page works as before.
- [x] Task: Remove Legacy Input 547af44
    - [ ] Locate and remove the old "Create New Scenario" section from the homepage (`+page.svelte`).
    - [ ] Clean up any unused styles or functions related to the old input.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Integration & Homepage Refactor' (Protocol in workflow.md) 56deb1e

## Phase 3: Final Polish & Verification

- [x] Task: End-to-End Testing 72d357c
    - [ ] Update or create an E2E test (`tests/e2e/scenario.spec.ts`) to verify the new flow:
        - [ ] User sees capsule in header.
        - [ ] User clicks -> expands.
        - [ ] User types and submits -> new scenario created.
- [ ] Task: Mobile Responsiveness Check
    - [ ] Verify layout on mobile viewports via tests or manual check guidelines.
    - [ ] Adjust CSS if the expanded input overlaps other header elements on small screens.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Polish & Verification' (Protocol in workflow.md)
