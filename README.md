# Speed Game

Reaction based game that scores the 10 highest players of each time interval. When a user is qualified to be placed on the leaderboard they are prompted with a message prompt to be displayed with their score. Made with HTML, CSS, and JS. uses a firebase realtime database and hosting.

## Features
- How to play page.
- Randomly appearing buttons to click for points.
- Leaderboard to track high scores.
- Players with higscores are able to enter a message.
- Different game time intervals seperate scores into different      scoreboards.
- Volume controller

```
Project
├─ .firebaserc
├─ firebase.json
├─ package-lock.json
├─ package.json
├─ public
│  ├─ 404.html
│  ├─ audio
│  │  ├─ deduct.mp3
│  │  └─ point.mp3
│  ├─ game.js
│  ├─ howTo.html
│  ├─ imgs
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
│  ├─ index.html
│  ├─ style.css
│  └─ website_info
│     ├─ example.png
│     ├─ icons8-cursor-material-rounded-16.png
│     └─ websiteTutorial.mp4
└─ README.md

```
## Firebase Setup
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Realtime Database** and **Hosting**
3. Copy your config to `public/config.js`

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/aesco56/CSCProject.git

2. npm install -g firebase-tools

3. firebase serve



