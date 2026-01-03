# Specification: modern_ui_revamp_20260103

## Overview
The goal of this track is to modernize the user interface of the iWords application, specifically focusing on the home page's scenario list and the main navigation bar. The current list-based display will be replaced with a modern card-based layout with "Load More" pagination, and the navigation bar will be redesigned to feel more playful and energetic.

## Functional Requirements

### 1. Navigation Bar Redesign
- **Style**: Adopt a "Playful & Bold" aesthetic.
- **Typography**: Use larger, clear typography.
- **Colors**: Implement a vibrant color palette to make the app feel energetic.
- **Components**: Ensure the navigation remains functional while adopting the new style.

### 2. Scenario Card Layout
- **Structure**: Replace the current list with a responsive grid of cards.
- **Content**:
    - **Title**: Clearly display the scenario name (prompt).
    - **Metadata**: Show the creation date and the number of words generated for that scenario.
    - **Visuals**: Include a thematic icon or emoji based on the scenario's content.
- **Quick Actions**:
    - **Open**: A button or icon to navigate to the scenario detail page.
    - **Delete**: A button or icon to remove the scenario (with confirmation).

### 3. Pagination & Sorting
- **Sorting**: Scenarios must be displayed in descending order of creation time (newest first).
- **Pagination**: Implement a "Load More" button at the bottom of the list to fetch more scenarios.

## Non-Functional Requirements

### 1. Visual Polish & UX
- **Depth**: Use soft box-shadows to give cards an elevated look.
- **Gradients**: Incorporate subtle gradients for backgrounds or card borders.
- **Hover Effects**: Cards should subtly scale or increase shadow depth on hover.
- **Micro-interactions**: Add small animations for actions (e.g., button clicks).

### 2. Responsiveness
- The card grid must adapt to different screen sizes (mobile, tablet, desktop).

## Acceptance Criteria
- [ ] Navigation bar uses bold typography and vibrant colors.
- [ ] Home page displays scenarios as cards in a responsive grid.
- [ ] Cards include title, date, word count, and an emoji/icon.
- [ ] "Open" and "Delete" actions work correctly on each card.
- [ ] Scenarios are sorted by newest first.
- [ ] "Load More" button successfully loads the next set of scenarios.
- [ ] Visual effects (hover, shadows, gradients) are applied as specified.

## Out of Scope
- Modifying the AI generation logic.
- Redesigning the Mind Map visualization (WordNode/ExampleNode) beyond general style consistency.
