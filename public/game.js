const database = firebase.database(); // Initialize Firebase database

let score=0;
let timer;
let timeLeft;
const clickButton = document.getElementById("clickButton");
const scoreDisplay = document.getElementById("score");
const leaderboard = document.getElementById("leaderboard");
const scoreList = document.getElementById("scoreList");
const nameInput = document.getElementById("nameInput");
const playerNameInput = document.getElementById("playerName");
const gameTimeInput = document.getElementById("gameTime");
const startGameButton = document.getElementById("startGame");
const timeLeftDisplay = document.getElementById("timeLeft");
const playAgainButton = document.getElementById("playAgainButton");
const deductButton = document.getElementById("deductButton");
const volumeControl = document.getElementById("volumeControl");

let highScore = [];
let currentPointImage = "";

// Array of usable images for game buttons
const images = [
    "imgs/burger.png",
    "imgs/dinosaur.png",
    "imgs/cat.png",
    "imgs/lizard.png",
    "imgs/clover.png",
    "imgs/purple_eye.png",
    "imgs/man.png",
    "imgs/woman.png",
    "imgs/dog.png",
    "imgs/rat.png"
];

document.getElementById("game").style.display = "none";

const pointSound = new Audio("audio/point.mp3");
const deductSound = new Audio("audio/deduct.mp3");

// Volume control
volumeControl.addEventListener("input", () => {
    const volume = volumeControl.value;
    pointSound.volume = volume; 
    deductSound.volume = volume;
});

pointSound.volume = volumeControl.value;
deductSound.volume = volumeControl.value;

const timeIntervalSelect = document.getElementById("timeIntervalSelect");
if (timeIntervalSelect) {
    const gameTimeOptions = document.getElementById("gameTime").options;
    for (let i = 0; i < gameTimeOptions.length; i++) {
        const option = new Option(gameTimeOptions[i].text, gameTimeOptions[i].value);
        timeIntervalSelect.add(option);
    }
    
    timeIntervalSelect.value = gameTimeInput.value;
    
    timeIntervalSelect.addEventListener('change', function() {
        displayScoresForInterval(parseInt(this.value, 10));
    });
    
    displayScoresForInterval(parseInt(gameTimeInput.value, 10));
}

function createButton(isDeductButton = false) {
    const buttonContainer = document.getElementById("buttonContainer");
    const button = document.createElement("button");
    button.className = isDeductButton ? "play deduct" : "play";
    button.style.position = "absolute";

    // Randomly position the button
    const maxX = buttonContainer.offsetWidth - button.offsetWidth;
    const maxY = buttonContainer.offsetHeight - button.offsetHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;

    // Add an image to the button
    const img = document.createElement("img");
    if (isDeductButton) {
        // Exclude currentPointImage from the random selection
        const filteredImages = images.filter((img) => img !== currentPointImage);
        img.src = filteredImages[Math.floor(Math.random() * filteredImages.length)];
    } else {
        img.src = currentPointImage;
    }

    img.style.width = "50px";
    img.style.height = "50px";
    img.style.pointerEvents = "none";
    button.appendChild(img);

    buttonContainer.appendChild(button);

    button.addEventListener("click", () => {
        if (isDeductButton) {
            score--;
            deductSound.currentTime = 0;
            deductSound.play();
        } else {
            score++;
            pointSound.currentTime = 0;
            pointSound.play();
        }
        scoreDisplay.textContent = score;
        buttonContainer.removeChild(button);
    });

    // Randomly set the button's duration on the screen
    const duration = Math.random() * 2000 + 1000; // Between 1 and 3 seconds
    setTimeout(() => {
        if (buttonContainer.contains(button)) {
            buttonContainer.removeChild(button);
        }
    }, duration);
}

function generateButtons() {
    // Increase the number of buttons generated
    const buttonCount = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < buttonCount; i++) {
        // Randomly decide whether to create a deduct button or a point button
        // 60% chance for point button, 40% for deduct button
        const isDeductButton = Math.random() < 0.6;
        createButton(isDeductButton);
    }
}

async function updateLeaderboard() {
    const timeIntervalSelect = document.getElementById("timeIntervalSelect");
    const gameTime = timeIntervalSelect ? parseInt(timeIntervalSelect.value, 10) : parseInt(gameTimeInput.value, 10);

    try{
        const scoresRef = firebase.database().ref('scores').orderByChild('time').equalTo(gameTime).limitToLast(10);
        scoresRef.on('value', (snapshot) => {
            const scores = [];
            snapshot.forEach((child) => {
                scores.push({id: child.key, ...child.val() });
            });

            scores.sort((a, b) => b.score - a.score);
            const scoreList = document.getElementById("scoreList");
            scoreList.innerHTML = "";

            if (scores.length > 0) {
                scores.forEach((entry, index) => {
                    const listItem = document.createElement("li");
                    listItem.className = "score-item";
                    listItem.onclick = function() {toggleScore(this); };

                    listItem.innerHTML = `
                        <div class="score-content">${index + 1}. ${entry.name} - ${entry.score}</div>
                        ${entry.message ? `<div class="score-message">"${entry.message}"</div>` : '<div class="score-message">No message</div>'}
                    `;
                    scoreList.appendChild(listItem);
                });
            } else {
                scoreList.innerHTML = "<li>No scores available for this time interval.</li>";
            }
        });
    } catch (error) {
        console.error("Error fetching scores:", error);
        alert("An error occurred while fetching scores. Please try again later.");

        if (highScore.length > 0) {
            const scoreList = document.getElementById('scoreList');
            scoreList.innerHTML = '';
            highScore.forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'score-item';
                listItem.onclick = function() { toggleScore(this); };
                listItem.innerHTML = `
                    <div class="score-content">${index + 1}. ${entry.name} - ${entry.score}</div>
                    ${entry.message ? `<div class="score-message">"${entry.message}"</div>` : '<div class="score-message">No message</div>'}
                `;
                scoreList.appendChild(listItem);
            });
        }
    }
}

function displayScoresForInterval(gameTime) {
    firebase.database().ref('scores').orderByChild('time').equalTo(gameTime).limitToLast(10).once('value', (snapshot) => {
        const scores = [];
        snapshot.forEach(child => {
            scores.push(child.val());
        });

        scores.sort((a, b) => b.score - a.score);
        const scoreList = document.getElementById("scoreList");
        scoreList.innerHTML = "";

        if (scores.length === 0) {
            scoreList.innerHTML = "<li>No scores available for this time interval.</li>";
            return;
        }

        scores.forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.className = "score-item";
            listItem.onclick = function() {toggleScore(this); };

            listItem.innerHTML = `
                <div class="score-content">${index + 1}. ${entry.name} - ${entry.score}</div>
                ${entry.message ? `<div class="score-message">"${entry.message}"</div>` : '<div class="score-message">No message</div>'}
            `;
            scoreList.appendChild(listItem);


        }); 
    });

}

function toggleScore(element) {
    document.querySelectorAll('.score-item.active').forEach(item => {
        if (item !== element) {
            item.classList.remove('active');
        }
    });
    
    element.classList.toggle('active');
}

async function endGame(playerName) {
    clickButton.disabled = true;

    document.getElementById("game").style.display = "none";
    nameInput.style.display = "none";
    const container = document.querySelector(".container");
    if (container) container.style.display = "none";

    const gameTime = parseInt(gameTimeInput.value, 10);
    let message = "";

    if (score <= 0) {
        alert("You must have a score greater than 0 to be on the leaderboard!");
        leaderboard.style.display = "block";
        playAgainButton.style.display = "block";
        return;
    }

    try {
        const LEADERBOARD_SIZE = 10;
        const scoresRef = firebase.database().ref('scores').orderByChild('time').equalTo(gameTime);

        const scoresSnapshot = await scoresRef.once('value');

        let scores = [];
        scoresSnapshot.forEach(child => {
            scores.push({id: child.key, ...child.val()});
        });

        scores.sort((a, b) => b.score - a.score);

        
        const isQualified = scores.length < LEADERBOARD_SIZE || score > scores[scores.length - 1].score;

        if (isQualified) {
            if (scores.length >= LEADERBOARD_SIZE) {

                scores.sort((a, b) => b.score - a.score);

                const lowestScore = scores[LEADERBOARD_SIZE - 1].score;
                const lowestEntries = scores.filter(entry => entry.score <= lowestScore).sort((a, b) => a.score - b.score || a.timestamp - b.timestamp);
                
                const entryToRemove = lowestEntries.length > (scores.length - LEADERBOARD_SIZE + 1) ? lowestEntries.slice(0,1) : lowestEntries;

                for (const entry of entryToRemove) {
                    await firebase.database().ref('scores').child(entry.id).remove();
                }
            }

            const maxLength = 100;
            message = prompt(`Congratulations! You made it to the leaderboard. Write a message (max ${maxLength} chars):`);
            
            while (message && message.length > maxLength) {
                message = prompt(`Message too long! Please limit to ${maxLength} chars:`);
            }

            
            await firebase.database().ref('scores').push({
                name: playerName,
                score: score,
                time: gameTime,
                message: message || null,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });

        } else {
            alert("Better Luck Next Time!");
        }

        await updateLeaderboard();

    } catch (error) {
        console.error("Failed to save score:", error);
        highScore.push({ 
            name: playerName, 
            score, 
            message, 
            time: gameTime 
        });
    }

    leaderboard.style.display = "block";
    playAgainButton.style.display = "block";
}

playAgainButton.addEventListener("click", () => {

    leaderboard.style.display = "none";
    playAgainButton.style.display = "none";

    nameInput.style.display = "block";

    const container = document.querySelector(".container");
    if (container) {
        container.style.display = "grid";
    }

    score = 0;
    timeLeft = parseInt(gameTimeInput.value, 10);
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;

    clickButton.disabled = false;
});

startGameButton.addEventListener("click", () => {
    const playerName = playerNameInput.value.trim();
    const gameTime = parseInt(gameTimeInput.value, 10);

    if (!playerName) {
        alert("Please enter your username to start!");
        return;
    }

    currentPointImage = images[Math.floor(Math.random() * images.length)];

    const startPrompt = document.createElement('div');
    startPrompt.className = 'start-prompt';
    startPrompt.innerHTML = `
        <div class="prompt-content">
            <h3>Click all the <span style="color: green; font-weight: bold;">${getImageName(currentPointImage)}</span> images!</h3>
            <img src="${currentPointImage}" alt="Target Image" class="prompt-image">
            <p>They'll randomly appear during the game!</p>
            <button id="startGameBtn">Start Game</button>
        </div>
    `;
    document.body.appendChild(startPrompt);

    document.getElementById("startGameBtn").addEventListener("click", () => {
        document.body.removeChild(startPrompt);
        actuallyStartGame(playerName, gameTime);
    });

    function getImageName(path) {
        const fileName = path.split("/").pop();
        return fileName.split('.')[0].replace(/_/g, ' ');
    }
});

function actuallyStartGame(playerName, gameTime) {
    nameInput.style.display = "none";
    leaderboard.style.display = "none";
    document.getElementById("game").style.display = "block";
    timeLeft = gameTime;
    timeLeftDisplay.textContent = timeLeft;
    score = 0;
    scoreDisplay.textContent = score;

    // Set the point button image
    const pointImage = document.getElementById("pointImage");
    pointImage.src = currentPointImage;
    clickButton.style.backgroundImage = `url(${currentPointImage})`;

    // The interval duration for generating buttons
    const buttonInterval = setInterval(generateButtons, 1000);

    timer = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            clearInterval(buttonInterval);
            endGame(playerName);
        }
    }, 1000);
}
