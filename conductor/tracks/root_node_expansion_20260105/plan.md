# Plan: Root Node Expansion (Scenario Extension)

## Phase 1: Backend Support & AI Logic [checkpoint: 7052041]
- [x] Task: Update `ai.ts` to support expansion generation. 066e2df
    - [x] Sub-task: Add `existingWords` parameter to generation prompt logic.
    - [x] Sub-task: Implement logic to request exactly 2 words with 2 example sentences each.
- [x] Task: Update `scenario.ts` service to handle adding new words to an existing scenario. 6c29538
    - [x] Sub-task: Write unit tests for `addWordsToScenario` in `scenario.server.spec.ts`.
    - [x] Sub-task: Implement `addWordsToScenario` logic to update the database.
- [x] Task: Create or update API route `POST /api/scenario/[id]/expand`. c3081fb
    - [x] Sub-task: Write integration tests in `server.spec.ts` for the expansion endpoint.
    - [x] Sub-task: Implement the endpoint handler calling the AI and Service layers.
- [ ] Task: Conductor - User Manual Verification 'Backend Support & AI Logic' (Protocol in workflow.md)

## Phase 2: Frontend UI & Interaction
- [x] Task: Enhance `ScenarioNode.svelte` with expansion UI. 31f73cf
    - [x] Sub-task: Add the "+" button at the bottom-right.
    - [x] Sub-task: Implement internal loading state visual for the node.
    - [x] Sub-task: Write component tests in `ScenarioNode.svelte.spec.ts` for UI states.
- [x] Task: Implement expansion logic in `MindMap.svelte`. 1236bc3
    - [x] Sub-task: Create a function to call the expansion API.
    - [x] Sub-task: Update the mind map state dynamically when new words arrive.
    - [x] Sub-task: Write interaction tests in `MindMap.interaction.spec.ts`.
- [ ] Task: Conductor - User Manual Verification 'Frontend UI & Interaction' (Protocol in workflow.md)

## Phase 3: Animation & Polishing
- [ ] Task: Implement "growth" animation for new nodes.
    - [ ] Sub-task: Use Svelte transitions or Svelte Flow specific animation properties for new nodes.
- [ ] Task: Final end-to-end verification.
    - [ ] Sub-task: Write E2E test in `tests/e2e/scenario.spec.ts` covering the full expansion flow.
- [ ] Task: Conductor - User Manual Verification 'Animation & Polishing' (Protocol in workflow.md)
