const API_BASE_URL = "http://localhost:3001/api"; // Update with your server URL

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

document.getElementById("game").style.display = "none";

const pointSound = new Audio("audio/point.mp3");
const deductSound = new Audio("audio/deduct.mp3");

// Volume control
volumeControl.addEventListener("input", () => {
    const volume = volumeControl.value;
    pointSound.volume = volume; 
    deductSound.volume = volume;
});

// Set initial volume
pointSound.volume = volumeControl.value;
deductSound.volume = volumeControl.value;

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

    // Add the button to the container
    buttonContainer.appendChild(button);

    // Add click event listener
    button.addEventListener("click", () => {
        if (isDeductButton) {
            score--;
            deductSound.currentTime = 0; // Reset playback position
            deductSound.play(); // Play "bzzt" sound
        } else {
            score++;
            pointSound.currentTime = 0; // Reset playback position
            pointSound.play(); // Play "ding" sound
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
    // Randomly generate the number of buttons
    const buttonCount = Math.floor(Math.random() * 3) + 1; // Between 1 and 3 buttons
    for (let i = 0; i < buttonCount; i++) {
        const isDeductButton = Math.random() < 0.5; // 50% chance to be a deduct button
        createButton(isDeductButton);
    }
}

/*
function updateLeaderboard() {
    // Sort the scores in descending order
    highScore.sort((a, b) => b.score - a.score);

    // Group scores by game time intervals
    const groupedScores = {};
    highScore.forEach((entry) => {
        const timeInterval = `${entry.time} seconds`; // Use the game time as the grouping key
        if (!groupedScores[timeInterval]) {
            groupedScores[timeInterval] = [];
        }
        groupedScores[timeInterval].push(entry);
    });

    // Populate the dropdown with time intervals
    const timeIntervalSelect = document.getElementById("timeIntervalSelect");
    timeIntervalSelect.innerHTML = ""; // Clear existing options
    for (const timeInterval in groupedScores) {
        const option = document.createElement("option");
        option.value = timeInterval;
        option.textContent = timeInterval;
        timeIntervalSelect.appendChild(option);
    }

    // Display scores for the selected time interval
    timeIntervalSelect.addEventListener("change", () => {
        displayScoresForInterval(groupedScores, timeIntervalSelect.value);
    });

    // Automatically display scores for the first time interval
    if (timeIntervalSelect.options.length > 0) {
        timeIntervalSelect.value = timeIntervalSelect.options[0].value;
        displayScoresForInterval(groupedScores, timeIntervalSelect.value);
    }
}
*/

async function updateLeaderboard() {
    try {
        const gameTime = parseInt(gameTimeInput.value, 10);
        const response = await fetch(`${API_BASE_URL}/scores/${gameTime}`);
        const scores = await response.json();

        const scoreList = document.getElementById("scoreList");
        scoreList.innerHTML = ""; // Clear existing scores

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

        const timeIntervalSelect = document.getElementById("timeIntervalSelect");
        timeIntervalSelect.innerHTML = ""; // Clear existing options

        const option = document.createElement("option");
        option.value = `${gameTime} seconds`;
        option.textContent = `${gameTime} seconds`;
        timeIntervalSelect.appendChild(option);
    } catch (error) {
        console.error("Error fetching scores:", error);
        
        highScore.sort((a, b) => b.score - a.score);
        const scoreList = document.getElementById("scoreList");
        scoreList.innerHTML = ""; // Clear existing scores

        highScore.forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.className = "score-item";
            listItem.onclick = function() {toggleScore(this); };

            listItem.innerHTML = `
                <div class="score-content">${index + 1}. ${entry.name} - ${entry.score}</div>
                ${entry.message ? `<div class="score-message">"${entry.message}"</div>` : '<div class="score-message">No message</div>'}
            `;
            scoreList.appendChild(listItem);
        });
    }
}

function displayScoresForInterval(groupedScores, timeInterval) {
    const scoreList = document.getElementById("scoreList");
    scoreList.innerHTML = ""; // Clear existing scores

    if (groupedScores[timeInterval]) {
        groupedScores[timeInterval].forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.className = "score-item";
            listItem.onclick = function() {toggleScore(this); };

            listItem.innerHTML = `
                <div class="score-content">${index + 1}. ${entry.name} - ${entry.score}</div>
                ${entry.message ? `<div class="score-message">"${entry.message}"</div>` : '<div class="score-message">No message</div>'}
            `;
            scoreList.appendChild(listItem);
        });
    }
}

function toggleScore(element) {
    // Close all other active items first
    document.querySelectorAll('.score-item.active').forEach(item => {
        if (item !== element) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current item
    element.classList.toggle('active');
}

/*
function endGame(playerName) {
    clickButton.disabled = true;

    // Hide all other sections
    document.getElementById("game").style.display = "none";
    nameInput.style.display = "none";

    // Remove the container element
    const container = document.querySelector(".container");
    if (container) {
        container.style.display = "none"; // Hide the container
    }

    const minScore = highScore.length < 10 ? 0 : highScore[highScore.length - 1].score;
    let message = "";
    if (score > minScore) {
        const maxLength = 100; // Maximum length for the message
        message = prompt(`Congratulations! You made it to the leaderboard. Write a message (max ${maxLength} characters):`);

        while (message && message.length > maxLength) {
            message = prompt(`Message too long! Please limit to ${maxLength} characters:`);
        }

        if (message && message.length > maxLength) {
            message = message.substring(0, maxLength) + "..."; // Truncate the message if it exceeds the limit
        }
    }

    // Add the player's score, message, and game time to the leaderboard
    const gameTime = parseInt(gameTimeInput.value, 10);
    highScore.push({ name: playerName, score, message, time: gameTime });

    // Update the leaderboard
    updateLeaderboard();

    // Automatically display the scoreboard for the current time interval
    const timeIntervalSelect = document.getElementById("timeIntervalSelect");
    const currentInterval = `${gameTime} seconds`;
    if (timeIntervalSelect) {
        timeIntervalSelect.value = currentInterval;
        displayScoresForInterval(
            highScore.reduce((groupedScores, entry) => {
                const timeKey = `${entry.time} seconds`;
                if (!groupedScores[timeKey]) groupedScores[timeKey] = [];
                groupedScores[timeKey].push(entry);
                return groupedScores;
            }, {}),
            currentInterval
        );
    }

    // Show the leaderboard and play again button
    leaderboard.style.display = "block";
    playAgainButton.style.display = "block";
}
*/

async function endGame(playerName) {
    clickButton.disabled = true;

    document.getElementById("game").style.display = "none";
    nameInput.style.display = "none";

    const container = document.querySelector(".container");
    if (container) {
        container.style.display = "none"; // Hide the container
    }

    const gameTime = parseInt(gameTimeInput.value, 10);
    let message = "";
    try{
        const response = await fetch(`${API_BASE_URL}/scores/${gameTime}`);
        const scores = await response.json();

        const minScore = scores.length < 10 ? 0 : scores[scores.length - 1].score;
        if (score > minScore) {
            const maxLength = 100; // Maximum length for the message
            message = prompt(`Congratulations! You made it to the leaderboard. Write a message (max ${maxLength} characters):`);

            while (message && message.length > maxLength) {
                message = prompt(`Message too long! Please limit to ${maxLength} characters:`);
            }

            if (message && message.length > maxLength) {
                message = message.substring(0, maxLength) + "..."; // Truncate the message if it exceeds the limit
            }

            await fetch(`${API_BASE_URL}/scores`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: playerName,
                    score,
                    time: gameTime,
                    message: message || null
                })
            });
        }

        await updateLeaderboard();

        leaderboard.style.display = "block";
        playAgainButton.style.display = "block";
    } catch (error) {
        console.error("Error fetching scores:", error);
        alert("An error occurred while fetching scores. Please try again later.");

        highScore.push({ name: playerName, score, message, time: gameTime });
        updateLeaderboard();
        leaderboard.style.display = "block";
        playAgainButton.style.display = "block";
    }
}

playAgainButton.addEventListener("click", () => {

    // Remove the leaderboard and Play Again Button
    leaderboard.style.display = "none";
    playAgainButton.style.display = "none";

    // Displays name entry container again
    nameInput.style.display = "block";

    const container = document.querySelector(".container");
    if (container) {
        container.style.display = "grid";
    }

    // Reset score and time
    score = 0;
    timeLeft = parseInt(gameTimeInput.value, 10);
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;

    // Enable the button for the next game
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
        document.body.removeChild(startPrompt); // Remove the prompt
        actuallyStartGame(playerName, gameTime); // Start the game
    });

    function getImageName(path) {
        const fileName = path.split("/").pop(); // Extract the image name from the path
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

    // Periodically generate buttons
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

// Array of usable images for game buttons
const images = [
    "imgs/burger.png",
    "imgs/dinosaur.png",
    "imgs/cat.png",
    "imgs/lizard.png",
    "imgs/clover.png",
    "imgs/purple_eye.png"
];

clickButton.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;

    clickButton.style.backgroundImage = `url(${currentPointImage})`; // Set the button background
    clickButton.style.backgroundSize = "cover"; // Ensure the image covers the button
    const pointImage = document.getElementById("pointImage");
    pointImage.src = randomImage; // Set the same image for the child

    // Move the button to a random position within the buttonContainer
    const buttonContainer = document.getElementById("buttonContainer");
    const maxX = buttonContainer.offsetWidth - clickButton.offsetWidth;
    const maxY = buttonContainer.offsetHeight - clickButton.offsetHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    clickButton.style.position = "absolute";
    clickButton.style.left = `${randomX}px`;
    clickButton.style.top = `${randomY}px`;
});

deductButton.addEventListener("click", () => {
    score--;
    scoreDisplay.textContent = score;

    // Move the deduct button to a random position within the buttonContainer
    const buttonContainer = document.getElementById("buttonContainer");
    const maxX = buttonContainer.offsetWidth - deductButton.offsetWidth;
    const maxY = buttonContainer.offsetHeight - deductButton.offsetHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    deductButton.style.position = "absolute";
    deductButton.style.left = `${randomX}px`;
    deductButton.style.top = `${randomY}px`;

    // Update the deduct button image to a random one
    const deductImage = document.getElementById("deductImage");
    deductImage.src = images[Math.floor(Math.random() * images.length)];
});