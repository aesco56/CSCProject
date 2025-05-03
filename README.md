# Speed Game

Reaction based game that scores the 10 highest players of each time interval. When a user is qualified to be placed on the leaderboard they are prompted with a message prompt to be displayed with their score. Made with HTML, CSS, and JS. uses a firebase realtime database and hosting.

## Features
- How to play page.
- Randomly appearing buttons to click for points.
- Leaderboard to track high scores.
- Players with higscores are able to enter a message.
- Different game time intervals seperate scores into different      scoreboards.
- Volume controller


public/
├── index.html          # Main entry point
├── game.js             # Core game logic
├── config.js           # Firebase configuration
├── style.css           # Styling
├── website_info        # Miscellaneous assests for website
│   ├── example.png
│   ├── websiteTutorial.mp4
│   └── icons8-cursor...
├── imgs/               # Game assets
│   ├── burger.png
│   ├── cat.png
│   ├── clover.png
│   ├── dinosour.png
│   ├── dog.png
│   ├── lizard.png
│   ├── man.png
│   ├── purple_eye.png
│   ├── rat.png
│   └── woman.png
└── audio/              # Sound effects
    ├── point.mp3
    └── deduct.mp3

## Setup
1. Clone the repository:
   ```bash
   git clone <https://github.com/aesco56/CSCProject.git>

2. npm install -g firebase-tools

3. firebase serve


## Firebase Setup
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Realtime Database** and **Hosting**
3. Copy your config to `public/config.js`