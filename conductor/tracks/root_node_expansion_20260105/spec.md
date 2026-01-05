# Specification: Root Node Expansion (Scenario Extension)

## Overview
This track introduces the ability for users to expand an existing scenario by adding more vocabulary. A "+" button on the scenario root node will trigger the AI to generate two additional unique words related to the current scenario, along with their definitions, phonetic symbols, and two example sentences each.

## Functional Requirements
- **Root Node UI Enhancement**: Add a small "+" icon button at the bottom-right corner of the scenario root node.
- **Expansion Trigger**: Clicking the "+" button initiates a generation request.
- **Loading State**: The root node must display a visual loading indicator while waiting for the AI response.
- **AI Word Generation**:
    - Generate exactly **2 new words** related to the scenario.
    - Each word must include: phonetic symbol, Chinese definition, and **2 example sentences**.
    - **Duplicate Prevention**: The AI prompt must include a list of already generated words for this scenario to ensure uniqueness.
- **Data Persistence**: New words and sentences must be saved to the MongoDB database associated with the current scenario ID.
- **Real-time UI Update**: Newly generated nodes should be added to the mind map dynamically without requiring a page refresh.

## Non-Functional Requirements
- **Visual Feedback**: New nodes should smoothly animate as they "grow" out from the root node.
- **Performance**: The generation process should be optimized to minimize user wait time, while maintaining a clear loading state.

## Acceptance Criteria
- [ ] The "+" button is visible and correctly positioned on the root node.
- [ ] Clicking the "+" button triggers a loading state.
- [ ] Two new, unique words are added to the mind map upon completion.
- [ ] The new words are saved to the database and persist after a page refresh.
- [ ] No duplicate words (from the existing set) are generated.
- [ ] Each new word has exactly 2 example sentences.
- [ ] The transition of new nodes appearing is smoothly animated.

## Out of Scope
- Manual editing of generated words (to be handled in a separate track).
- Deleting individual nodes (to be handled in a separate track).
- Re-ordering nodes manually.
