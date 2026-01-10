# Product Guidelines - iWords

## Visual Style & User Experience
- **Modern & Minimalist**: The app will feature a clean, uncluttered layout with ample white space. The focus is on providing a distraction-free environment that prioritizes content clarity and ease of navigation.
- **Responsive Design**: The interface will be fully responsive, ensuring a seamless experience across desktop, tablet, and mobile devices.

## Mind Map Presentation
- **Multi-Level Hierarchies**: Mind maps will support multiple levels of nesting (e.g., Plant -> Vegetable -> Celery) to reflect the logical structure of scenarios and sub-scenarios.
- **Interactive & Expandable**: Users can interact with the nodes of the mind map. Clicking on a node will expand it to show its sub-nodes (words, definitions, example sentences) or collapse it to manage visual complexity.

## AI Content Generation Tone
- **Casual & Conversational**: The AI will generate content using relatable, everyday language. Example sentences should reflect common usage and informal contexts, making the learning experience feel natural and approachable.

## Accessibility & Multi-Modal Support
- **Audio Integration**: High-quality audio playback for words and example sentences must be easily accessible to aid in pronunciation and listening practice.
- **Visual Clarity**: High contrast and clear typography will be used to ensure readability for all users.

## Security & Privacy
- **Comprehensive Security**: Implement a multi-layered security approach including:
    - **XSS Prevention**: Strict sanitization of all user inputs and AI-generated content.
    - **Injection Protection**: Validation to prevent NoSQL injection attacks against MongoDB.
    - **API Security**: Rate limiting to prevent abuse of the AI generation endpoints.
    - **CSRF Protection**: Ensure cross-site request forgery protection is enabled for all state-changing actions.
    - **User Authentication**: Secure registration and login flows with server-side CAPTCHA verification and hashed password storage.
- **Data Protection**: Secure handling of user data and scenario history.