# Speed Game

Reaction based game that scores the 10 highest players of each time interval. When a user is qualified to be placed on the leaderboard they are prompted with a message prompt to be displayed with their score. Made with HTML, CSS, and JS. Uses a firebase realtime database and hosting.

## Features
- How to play page.
- Randomly appearing buttons to click for points.
- Leaderboard to track high scores.
- Players with higscores are able to enter a message.
- Different game time intervals seperate scores into different scoreboards.
- Volume controller


```
Project
├─ .firebaserc
├─ firebase.json
├─ package-lock.json
├─ package.json
├─ public
│  ├─ 404.html
│  ├─ audio                 # Sound effects
│  │  ├─ deduct.mp3
│  │  └─ point.mp3
│  ├─ game.js               # Game logic
│  ├─ howTo.html            # How to play page
│  ├─ imgs                  # Game assest
│  │  ├─ burger.png
│  │  ├─ cat.png
│  │  ├─ clover.png
│  │  ├─ dinosaur.png
│  │  ├─ dog.png
│  │  ├─ lizard.png
│  │  ├─ man.png
│  │  ├─ purple_eye.png
│  │  ├─ rat.png
│  │  └─ woman.png
│  ├─ index.html            # Main entry point
│  ├─ style.css             # Styling
│  └─ website_info          # Miscellaneous assests for website
│     ├─ example.png
│     ├─ icons8-cursor-material-rounded-16.png
│     └─ websiteTutorial.mp4
└─ README.md

```

## Firebase Setup
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Realtime Database** and **Hosting**
3. Create a `config.js` file inside the `public` folder
4. Copy your firebase database config to `public/config.js`

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/aesco56/CSCProject.git

2. Install firebase tools
    ```bash
    npm install -g firebase-tools

3. Run Locally
    ```bash
    firebase serve