# Blueprint: K-pop Forever Young Quiz

## Overview
This project is an interactive web-based quiz application. It tests users' knowledge of K-pop artists' ages based on their Instagram posts. The app features a dynamic UI, fetches quiz data from a JSON file, and provides real-time feedback on user answers.

## Project Outline

### Core Features
- **Purpose:** A quiz game to guess the age of K-pop artists.
- **Technologies:** HTML, CSS, JavaScript (ES Modules, Async/Await, Fetch API).
- **Data:** Artist information (name, Instagram URL, birth date) is loaded from `artists.json`.
- **UI:**
    - Displays artist's Instagram post as a visual clue.
    - Dynamically generates multiple-choice buttons for age selection.
    - Shows real-time score and progress.
    - Provides visual feedback for correct/incorrect answers.
    - Includes a "Game Over" screen with a final score and a "Play Again" option.
- **Styling:**
    - Modern, dark, neon-themed aesthetic.
    - Responsive design for mobile and desktop.
    - Uses CSS variables for consistent theming.
    - Enhanced readability for score/progress chips.
    - Card-style layout for the Instagram embed container.
- **Instagram Integration:**
    - Dynamically embeds Instagram posts using the official embed script.
    - Captions are hidden to focus on the visual clue.

### Current Version (Disqus Comment Integration)
- **Purpose:** Adds a comment section to each quiz question, allowing users to discuss each artist.
- **Features:**
    - A Disqus comment thread is displayed below the answer choices.
    - Each artist/question has a separate, unique comment thread.
- **Integration:**
    - A `<div id="disqus_thread">` was added to `index.html` to host the comments.
    - The standard Disqus embed script was added to `index.html`, using a placeholder `YOUR_DISQUS_SHORTNAME` which needs to be replaced by the site owner.
    - A new `updateDisqus` function was added to `main.js`.
- **Logic:**
    - The `updateDisqus` function is called every time a new question is loaded (`loadQuestion`).
    - It configures Disqus with a unique URL and identifier for the current artist, ensuring comment threads are distinct for each question.
    - It uses `DISQUS.reset()` to reload the comment thread for the new artist.