# Plan: Recursive Word Node Expansion

## Phase 1: Backend - Expansion API [checkpoint: 794b78d]

- [~] Task: Create Expansion Endpoint Spec
    - Define `POST /api/scenario/[id]/expand` or similar.
    - Input: `targetWord`, `rootContext`, `existingWords[]`.
    - Output: `Word[]` (2 items).

- [x] Task: Update AI Service for Sub-Expansion (80c3e21)
    - [ ] Sub-task: Create a new prompt template in `src/lib/server/ai.ts` that handles:
        - "Context: {rootContext}"
        - "Topic: {targetWord}"
        - "Constraint: Simple, daily life words."
        - "Exclude: {existingWords list}"
    - [ ] Sub-task: Write unit tests for the prompt generation logic (ensure exclusion list is formatted correctly).

- [x] Task: Implement API Endpoint (4786b2c)
    - [ ] Sub-task: Create `src/routes/api/scenario/expand/+server.ts`.
    - [ ] Sub-task: Validate input (ensure `targetWord` and `rootContext` are present).
    - [ ] Sub-task: Call the AI service.
    - [ ] Sub-task: Return standardized JSON.

- [ ] Task: Conductor - User Manual Verification 'Backend - Expansion API' (Protocol in workflow.md)

## Phase 2: Frontend - UI Components (`WordNode`)

- [ ] Task: Update `WordNode` Layout
    - [ ] Sub-task: Open `src/lib/components/WordNode.svelte`.
    - [ ] Sub-task: Add the `+` button element.
    - [ ] Sub-task: Position it absolute or flex between the Audio and Example buttons.
    - [ ] Sub-task: Style with Tailwind (cursor-pointer, hover effects).
    - [ ] Sub-task: Add `onclick` handler stub.

- [ ] Task: Implement "Loading" State
    - [ ] Sub-task: Add internal state `isExpanding`.
    - [ ] Sub-task: Show a spinner or disable the button when `isExpanding` is true.

- [ ] Task: Conductor - User Manual Verification 'Frontend - UI Components' (Protocol in workflow.md)

## Phase 3: Frontend - Logic & State Management

- [ ] Task: Handle Expansion Event
    - [ ] Sub-task: In `MindMap.svelte` (or a store), create a function `expandNode(nodeId, wordText)`.
    - [ ] Sub-task: This function must:
        1. Collect all current words from the graph (for uniqueness).
        2. Call the new API endpoint.
        3. On success, add the new nodes and edges to the graph data.

- [ ] Task: Connect Component to Logic
    - [ ] Sub-task: Pass the expansion handler down to `WordNode` (or dispatch an event).
    - [ ] Sub-task: Ensure the `+` button triggers the API call.

- [ ] Task: Update Graph Layout
    - [ ] Sub-task: Ensure the visualization library (Svelte Flow / custom) re-renders and auto-layouts the new branches correctly so they don't overlap.

- [ ] Task: Conductor - User Manual Verification 'Frontend - Logic & State Management' (Protocol in workflow.md)
