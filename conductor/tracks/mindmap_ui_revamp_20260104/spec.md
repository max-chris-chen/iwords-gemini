# Specification: Mind Map UI/UX Optimization (Svelte Flow Customization)

## Overview
The current mind map uses default Svelte Flow components with basic styling. This track focuses on customizing Svelte Flow custom nodes and the flow container to create a modern, high-quality "glassmorphism" interface with interactive expansion/collapse functionality.

## Functional Requirements
- **Custom Svelte Flow Theme:**
    - Background: Replace `<Background />` with a custom CSS-styled container featuring a soft, neutral gradient (e.g., light gray to pale blue).
- **Glassmorphism Custom Nodes:**
    - **Shared Style:** All custom nodes (Scenario, Word, Example) will use backdrop-blur, translucency, and subtle borders.
    - **Scenario Node (Root):** 
        - Custom node type: `scenario`.
        - Default shape: Circular.
        - Adaptive behavior: Expand into a rounded pill if text is long.
        - Distinct color: e.g., soft amber or vibrant glass.
    - **Word Node:**
        - Custom node type: `word`.
        - Interaction: Includes a toggle button (e.g., ">>") at the bottom-right. Clicking this button toggles the visibility of connected `example` nodes.
    - **Example Node:**
        - Custom node type: `example`.
        - Visibility: Hidden by default; controlled by parent `word` node.
- **Interactive Logic:**
    - Implement a state management mechanism (within the MindMap component or parent) to toggle node and edge visibility based on user interaction.

## Non-Functional Requirements
- **Maintain TDD:** Ensure unit tests for `MindMap.svelte`, `WordNode.svelte`, and new `ScenarioNode.svelte` are updated/created.
- **Performance:** Optimize backdrop-blur usage to ensure smooth panning/zooming in Svelte Flow.
- **Accessibility:** Ensure buttons (like audio) and interactive text remain accessible.
- **Regression Safety:** CRITICAL. Existing features must remain fully functional:
    - Audio playback for words.
    - Pan and Zoom capabilities of the canvas.
    - Dragging nodes.
    - Correct data binding (Phonetics, Chinese definition, English definition).

## Acceptance Criteria
- [ ] Mind map background has a modern gradient.
- [ ] Nodes have a consistent glassmorphism texture.
- [ ] The Scenario (root) node is circular/pill-shaped.
- [ ] Example nodes are hidden initially.
- [ ] Clicking a Word node successfully reveals/hides its specific Example nodes.
- [ ] Audio playback still functions within the new Word nodes.

## Out of Scope
- Migrating away from Svelte Flow.
- Adding "Dark Mode" support.
