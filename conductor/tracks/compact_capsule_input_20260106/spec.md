# Specification: Compact Capsule Scenario Input

## 1. Overview
Refactor the "Create New Scenario" input on the homepage to be significantly more space-efficient. The current large input section will be replaced by a compact, capsule-styled (pill-shaped) input field located in the navigation or sticky header area. This input will dynamically expand when focused to provide better typing experience and will support submission via both the "Enter" key and a dedicated icon button.

## 2. Functional Requirements

### 2.1. UI/UX Design
*   **Location:** Move the scenario creation input to the top navigation bar or a sticky header row (User Selection: A).
*   **Shape:** Apply a "capsule" or pill-shaped design with fully rounded corners (User Selection: A).
*   **Initial State:** Render as a compact input field to save space.
*   **Focus State:** When the user clicks or focuses the input, it must smoothly expand its width to occupy a larger portion of the available header space (User Selection: B).
*   **Icon:** Include a submission icon (e.g., a "Plus" `+` or "Arrow" `->` icon) visually integrated within or immediately adjacent to the capsule.

### 2.2. Interaction
*   **Submission:**
    *   **Enter Key:** Pressing the `Enter` key while the input is focused must submit the form and create the new scenario.
    *   **Icon Click:** Clicking the submission icon must also submit the form (User Selection: A & B).
*   **Expansion/Collapse:**
    *   On Focus: Animate width expansion.
    *   On Blur: If the input is empty, animate back to the compact width.

### 2.3. Cleanup
*   Remove the previous large "Create New Scenario" section from the main content area of the homepage to reclaim screen real estate.

## 3. Non-Functional Requirements
*   **Responsiveness:** Ensure the input functions correctly on both desktop and mobile viewports. On smaller screens, the expansion logic should respect screen boundaries.
*   **Performance:** Animations for width expansion should be smooth (CSS transitions).
*   **Consistency:** Use existing Tailwind CSS color palette and typography to match the application's theme.

## 4. Acceptance Criteria
*   [ ] The large "Create New Scenario" section is removed from the main homepage body.
*   [ ] A new capsule-shaped input appears in the header/nav area.
*   [ ] Clicking the input smoothly expands its width.
*   [ ] Typing a title and pressing `Enter` successfully creates a new scenario and redirects/updates UI accordingly.
*   [ ] Typing a title and clicking the submission icon successfully creates a new scenario.
*   [ ] The UI is responsive and usable on mobile devices.
