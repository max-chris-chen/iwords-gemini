# Implementation Plan - Mind Map UI/UX Optimization

This plan outlines the steps to modernize the mind map UI using custom Svelte Flow components, glassmorphism styling, and interactive expansion/collapse logic.

## Phase 1: Foundation & Custom Node Setup
Implement the structural changes for custom nodes and ensure the TDD environment is ready.

- [x] Task: Create `ScenarioNode.svelte` for the root node [547e79f]
    - [ ] Implement circular/pill shape with adaptive sizing
    - [ ] Apply initial glassmorphism styling (backdrop-blur, translucency)
    - [ ] Add unit tests for `ScenarioNode`
- [x] Task: Update `MindMap.svelte` to support the new `scenario` node type [fb44fb4]
    - [ ] Register `ScenarioNode` in `nodeTypes`
- [x] Task: Refactor `WordNode.svelte` and `ExampleNode.svelte` [14dd2f5]
    - [ ] Replace basic Tailwind styles with glassmorphism classes
    - [ ] Ensure click events are correctly handled for the toggle feature
- [ ] Task: Conductor - User Manual Verification 'Foundation & Custom Node Setup' (Protocol in workflow.md)

## Phase 2: Interactive Expand/Collapse Logic
Implement the logic to hide/show example nodes when clicking word nodes.

- [x] Task: Refactor `WordNode.svelte` to add toggle button [068d319]
- [x] Task: Update `MindMap.svelte` to handle custom toggle event [068d319]
- [x] Task: Conductor - User Manual Verification 'Interactive Expand/Collapse Logic' (Protocol in workflow.md) [checkpoint: 068d319]

## Phase 3: Visual Polish & Glassmorphism
Refine the aesthetics and add the custom background.

- [x] Task: Implement custom gradient background [157d1fe]
- [x] Task: Refine Glassmorphism CSS [157d1fe]
- [x] Task: Conductor - User Manual Verification 'Visual Polish & Glassmorphism' (Protocol in workflow.md) [checkpoint: 157d1fe]

## Phase 4: Final Verification & Cleanup
- [x] Task: Verify 80% test coverage for all modified components [pass]
- [x] Task: Perform manual E2E check of the scenario-to-mindmap flow [checkpoint: 157d1fe]
    - [x] **Regression Check:** Verify Audio playback works.
    - [x] **Regression Check:** Verify Pan/Zoom and Dragging work.
    - [x] **Regression Check:** Verify all text data displays correctly.
- [x] Task: Conductor - User Manual Verification 'Final Verification & Cleanup' (Protocol in workflow.md) [checkpoint: 157d1fe]
