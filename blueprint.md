# Blueprint: Dinner Menu Recommendation and Affiliate Inquiry

## Overview
This project provides a web-based dinner menu recommendation system and an affiliate inquiry form. It leverages Web Components for modularity and modern CSS for styling, including theme toggling.

## Project Outline

### Initial Version (Dinner Menu Recommendation)
- **Purpose:** Recommends dinner menu items.
- **Technologies:** HTML, CSS (modern features like Container Queries, Cascade Layers, CSS Variables), JavaScript (ES Modules, Async/Await, Fetch API).
- **UI Components:**
    - `<theme-toggle>`: Web Component for switching between light and dark themes.
    - `<dinner-recommender>`: Web Component for displaying dinner recommendations.
- **Styling:** Uses CSS variables for theming, modern color spaces, and responsive design.
- **Structure:** `index.html` for the main structure, `style.css` for styling, `main.js` for JavaScript logic and Web Component definitions.

### Current Version (Affiliate Inquiry Form)
- **Purpose:** Provides a simple form for users to submit affiliate inquiries, integrated with Formspree for backend processing.
- **Features:**
    - A form with input fields for Name, Email, and Message.
    - Uses Formspree (`https://formspree.io/f/mojjjykn`) as the form submission endpoint.
- **Integration:** Added directly to `index.html` as a `<section>` element.
- **Styling:**
    - Integrated with the existing theme using CSS variables (`--surface-color`, `--text-color`, `--accent-color`, etc.).
    - Styled to match the aesthetic of the existing `dinner-recommender` component, including padding, border-radius, and box-shadow.
    - Form elements (labels, inputs, textarea, button) are styled for clarity and user experience, with focus states and hover effects.

## Plan and Steps for Current Change

1.  **Modify `index.html`**:
    - Add a new `<section id="affiliate-inquiry">` after the `<dinner-recommender>` component.
    - Inside this section, include an `<h2>` for the title and a `<form>` element.
    - Set the `action` attribute of the form to `https://formspree.io/f/mojjjykn` and `method` to `POST`.
    - Add `label` and `input` elements for Name (type="text"), Email (type="email"), and a `textarea` for Message. All are `required`.
    - Add a `button` with `type="submit"`.
2.  **Add basic styling to `style.css`**:
    - Extend the styling for `dinner-recommender` to also apply to `#affiliate-inquiry` for consistent card-like appearance.
    - Add specific styles for `h2`, `form`, `label`, `input[type="text"]`, `input[type="email"]`, `textarea`, and `button[type="submit"]` within the `#affiliate-inquiry` section.
    - Ensure styles use existing CSS variables for theme consistency.
    - Add focus and hover effects for interactive elements.
