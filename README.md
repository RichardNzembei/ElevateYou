# ElevateYou

**Track. Grow. Repeat.**  
ElevateYou is a vibrant web app to boost your personal growth by tracking coding, screen time, exercise, finances, and reminders. With a colorful dashboard, engaging charts, and a playful interface, it’s your partner in taking small steps to big wins!

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Features

- **Lively Dashboard**: Overview with cards for Developer, Screen Time, Exercise, Finances, Reminders, and Growth Insights, featuring mini-charts and progress rings.
- **Playful Navbar**: Fixed header with a pink-to-lavender gradient, color-coded links (e.g., blue for Overview, green for Developer), a pulsing gem logo, and a bouncy mobile menu.
- **Module Tracking**:
  - **Developer**: Monitors coding hours (4h today) and commits (5), with a bar chart.
  - **Screen Time**: Tracks usage (3h) and top apps (YouTube), with app bars.
  - **Exercise**: Logs workouts (2/week) and goals (80%), with a progress ring.
  - **Finances**: Shows savings ($200) and spending ($50), with a pie chart.
  - **Reminders**: Lists tasks (e.g., “Code 1h”) with checkmarks.
  - **Growth Insights**: Highlights trends (e.g., “+10% coding”) with a sparkline.
- **Responsive Design**: 1-col on mobile, 2-col on tablet, 3-col on desktop, with smooth animations.
- **Motivational Flair**: Spinning icons, confetti on logo hover, and quotes like “Small steps, big wins!”
- **Accessibility**: ARIA labels, high-contrast colors, keyboard navigation.

## Tech Stack

- **Frontend**: Vue.js 3 (`<script setup>`), Tailwind CSS, Lucide Icons
- **Fonts**: Quicksand (headers), Caveat (accents)
- **Build Tool**: Vite
- **Package Manager**: npm
- **Planned APIs**:
  - GitHub API (Developer)
  - Google Fit/Strava (Exercise)
  - Plaid (Finances)
  - Digital Wellbeing export (Screen Time)

## Project Structure

elevateyou/
├── public/
│ ├── index.html # Entry HTML
│ └── favicon.ico # App icon
├── src/
│ ├── assets/ # Images, fonts
│ ├── components/
│ │ ├── Navbar.vue # Animated navbar
│ │ └── Overview.vue # Dashboard grid
│ ├── router/
│ │ └── index.js # Vue Router
│ ├── App.vue # Root component
│ └── main.js # App entry
├── package.json # Dependencies
├── vite.config.js # Vite config
├── tailwind.config.js # Tailwind config
└── README.md # This file

## Installation

1. **Clone the Repo**:

   ```bash
   git clone https://github.com/yourusername/elevateyou.git
   cd elevateyou

   ```

2. **Install Dependencies**:

  ```bash
  npm install

3. **Add Required Packages**:
-Vue.js:
  ``bash
 npm install vue vue-router@4

-Tailwind CSS:
 ``bash
  npm install -D tailwindcss postcss autoprefixer

-Lucide Icons:
 ``bash
 npm install lucide-vue-next Initialize Tailwind:


-initialize tailwind
 ``bash
 npx tailwindcss init -p

-google apis
 ``bash
 <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@700&family=Caveat&display=swap" rel="stylesheet">


-Start Dev Server:
 ``bash
 npm run dev

-Visit:
 http://localhost:5173.

## Usage
**Explore**: Use the navbar to navigate (Overview is active; other links are placeholders).

**Track Progress**: Check the Overview for sample stats (e.g., “4h coding,” “80% exercise goal”) with charts. Click “View Details” for future pages.
Feel the Fun: Hover for spinning icons, tap the logo for confetti, or open the mobile menu for a bubbly experience.

**Extend**: Update src/components/Overview.vue with APIs for real data (see ).
Screenshots

**Navbar**: A pink-to-lavender fixed header with “ElevateYou” in Quicksand, a pulsing gem, and links like Overview (blue star) and Finances (yellow dollar). Mobile has a full-screen menu with colorful bubbles.

**Overview**: White cards in a grid, showing stats (e.g., “2 workouts”), bar charts, and progress rings in green, orange, purple, yellow, blue, and pink, under “Your Growth Journey.”

## UI ScreenShot
![Dashboard](/docs/screenshots/Screenshot%20from%202025-04-14%2022-42-31.png)


## Contributing
Let’s grow together!

Fork and create a branch (git checkout -b feature/new-spark).
Commit (git commit -m "Add new spark").
Push (git push origin feature/new-spark).
Open a Pull Request.
Suggestions:
API connections
UI animations
Accessibility fixes
Roadmap
Immediate:
GitHub API for commits
Dynamic card data
Theme toggle
Next:
Google Fit for workouts
Plaid for finances
Screen Time imports
Future:
Module-specific pages
Gamification (badges)
Offline mode
````
