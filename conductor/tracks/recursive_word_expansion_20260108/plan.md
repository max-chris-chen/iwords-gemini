# Plan: Recursive Word Node Expansion

## Phase 1: Backend - Expansion API [checkpoint: 794b78d]

- [x] Task: Create Expansion Endpoint Spec (Done)
    - Define `POST /api/scenario/[id]/expand` or similar.
    - Input: `targetWord`, `rootContext`, `existingWords[]`.
    - Output: `Word[]` (2 items).

- [x] Task: Update AI Service for Sub-Expansion (80c3e21)
    - [x] Sub-task: Create a new prompt template in `src/lib/server/ai.ts` that handles:
        - "Context: {rootContext}"
        - "Topic: {targetWord}"
        - "Constraint: Simple, daily life words."
        - "Exclude: {existingWords list}"
    - [x] Sub-task: Write unit tests for the prompt generation logic (ensure exclusion list is formatted correctly).

- [x] Task: Implement API Endpoint (4786b2c)
    - [x] Sub-task: Create `src/routes/api/scenario/expand/+server.ts`.
    - [x] Sub-task: Validate input (ensure `targetWord` and `rootContext` are present).
    - [x] Sub-task: Call the AI service.
    - [x] Sub-task: Return standardized JSON.

- [x] Task: Conductor - User Manual Verification 'Backend - Expansion API' (Protocol in workflow.md)

## Phase 2: Frontend - UI Components (WordNode) [checkpoint: 1547c26]

- [x] Task: Update WordNode Layout (3c95bd7)
    - [x] Sub-task: Open `src/lib/components/WordNode.svelte`.
    - [x] Sub-task: Add the `+` button element.
    - [x] Sub-task: Position it absolute or flex between the Audio and Example buttons.
    - [x] Sub-task: Style with Tailwind (cursor-pointer, hover effects).
    - [x] Sub-task: Add `onclick` handler stub.

- [x] Task: Implement "Loading" State (3c95bd7)
    - [x] Sub-task: Add internal state `isExpanding`.
    - [x] Sub-task: Show a spinner or disable the button when `isExpanding` is true.

- [x] Task: Conductor - User Manual Verification 'Frontend - UI Components' (Protocol in workflow.md)

## Phase 3: Frontend - Logic & State Management [checkpoint: 0d2e057]

- [x] Task: Handle Expansion Event (Multiple Commits)
    - [x] Sub-task: In `MindMap.svelte` (or a store), create a function `expandNode(nodeId, wordText)`.
    - [x] Sub-task: This function must:
        1. Collect all current words from the graph (for uniqueness).
        2. Call the new API endpoint.
        3. On success, add the new nodes and edges to the graph data.

- [x] Task: Connect Component to Logic (Multiple Commits)
    - [x] Sub-task: Pass the expansion handler down to `WordNode` (or dispatch an event).
    - [x] Sub-task: Ensure the `+` button triggers the API call.

- [x] Task: Update Graph Layout (0d2e057)
    - [x] Sub-task: Ensure the visualization library (Svelte Flow / custom) re-renders and auto-layouts the new branches correctly so they don't overlap.

- [x] Task: Conductor - User Manual Verification 'Frontend - Logic & State Management' (Protocol in workflow.md)
