# Specification: Recursive Word Node Expansion

## 1. Overview
This feature enables "recursive expansion" for individual words within the Mind Map. Users can generate new, related vocabulary starting from *any* word node, not just the root scenario. This creates a deeper, branching learning path where each word can become a "sub-scenario."

## 2. Functional Requirements

### 2.1 UI Changes (`WordNode.svelte`)
- **Add Expansion Trigger:**
    - A "**+**" button must be added to the `WordNode` component.
    - **Position:** Bottom center of the node card, strictly positioned between the "Play Audio" icon (🔊) and the "Show Examples" toggle (`>>`).
    - **Visibility:** Always visible (not hidden on hover).
    - **Style:** Consistent with the existing UI theme (using Tailwind CSS), ensuring it is clickable but distinct from the audio/example controls.

### 2.2 Interaction Logic
- **Trigger:** Clicking the "**+**" button on a `WordNode`.
- **Action:**
    - The system initiates an AI generation request.
    - **Visual Feedback:** The node (or the button) should show a "loading" state (e.g., spinner or disabled state) to indicate processing.
- **Outcome:**
    - Upon success, **2 new child nodes** (WordNodes) are generated and attached to the clicked node.
    - The layout automatically adjusts to accommodate the new branches.

### 2.3 AI Generation Logic (Backend)
- **Input Context:**
    - **Primary Topic:** The word clicked by the user (e.g., "Apple").
    - **Background Context:** The original Root Scenario (e.g., "Supermarket") to maintain thematic relevance.
    - **Exclusion List:** The system must track all currently displayed words to ensure global uniqueness.
- **Output Constraints:**
    - **Quantity:** Exactly **2** new words.
    - **Criteria:**
        - Must be **related** to the Primary Topic ("Apple").
        - Must fit within the Background Context ("Supermarket").
        - **Priority:** **Simple, daily life, high-frequency** vocabulary.
        - **Uniqueness:** New words **MUST NOT** repeat any word that already exists in the current Mind Map.
    - **Data Structure:** Same standard `Word` object format (Word, Phonetics, Definition, Definition CN, Examples).

### 2.4 Recursive Behavior
- The newly generated "leaf" nodes **must also include** the "**+**" button.
- Users can continue to expand indefinitely (e.g., Root -> Apple -> Juice -> Glass...).

## 3. Non-Functional Requirements
- **Performance:** UI response to the click should be immediate (loading state).
- **Error Handling:** If AI fails, show a toast or error indicator on the node; do not break the graph.
- **Consistency:** The new nodes must look and behave exactly like existing WordNodes.

## 4. Out of Scope
- Infinite scrolling/virtualization for massive trees (assuming reasonable depth for now).
- Deleting individual branches (out of scope for this specific ticket).
