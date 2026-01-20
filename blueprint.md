# K-Pop Age Master: Guess the Age

## Overview

A web-based quiz game that challenges users to guess the age of K-Pop idols based on their Instagram posts.

## Features

### Core Gameplay
- **Guess the Age:** Users are presented with an idol's Instagram post and must guess their age from a set of multiple-choice options.
- **Scoring:** Users earn points for each correct answer.
- **Progression:** The quiz progresses through a list of idols, and the user's progress is tracked.
- **Game Over & Replay:** At the end of the quiz, a final score is displayed. A "Play Again" button allows users to restart the quiz seamlessly without a full page reload.

### UI/UX
- **Instagram Integration:** Displays Instagram posts directly in the quiz.
- **Improved Feedback:** Provides immediate and clear feedback by highlighting the correct answer in green and the user's incorrect choice in red. This ensures the user always knows what the right answer was.
- **Social Sharing:** A "Share on X" button on the game-over screen allows users to share their scores on X (formerly Twitter).
- **Copy Link:** A "Copy Link" button on the game-over screen allows users to copy the quiz link to their clipboard.
- **Sound Effects:** Sound effects are played for both correct and incorrect answers, providing additional auditory feedback.
- **Loading State:** Shows a loading indicator while the quiz is being prepared.
- **Responsive Design:** The layout adapts to different screen sizes.
- **Cohesive Hover Effects:** The hover effects for the buttons on the game-over screen match their respective background colors, creating a more cohesive user interface.

### Technical
- **Data-Driven:** The quiz content is loaded from a JSON file (`artists.json`), making it easy to update and expand.
- **Dynamic Age Calculation:** Ages are calculated dynamically based on the current date, ensuring the quiz is always up-to-date.
- **Modern JavaScript:** The quiz is built using modern JavaScript features and a class-based architecture.
- **Streamlined Disqus Integration:** The Disqus integration is handled dynamically in the JavaScript, keeping the HTML clean and maintainable.
- **Clean Code:** The final code has been cleaned of any leftover console logs from debugging, ensuring a polished and professional result.
- **Curated Data:** The artist data has been cleaned to remove any entries with placeholder content, ensuring a high-quality user experience.
