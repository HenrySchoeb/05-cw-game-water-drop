// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timeLeft = 30; // Game timer in seconds
let timerInterval; // Interval for countdown
const winningMessages = [
  "Amazing! You’re a water drop champion!",
  "Fantastic job! You saved the drops!",
  "Winner! You caught so many drops!",
  "You did it! Water hero!",
  "Outstanding! You mastered the rain!"
];

const losingMessages = [
  "Try again! You can catch more drops!",
  "Keep going! Practice makes perfect!",
  "Almost there! Give it another shot!",
  "Don’t give up! You’ll get it next time!",
  "So close! Try again for a higher score!"
];
let score = 0; // Track the player's score

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", function() {
  if (gameRunning) {
    gameRunning = false;
    clearInterval(dropMaker);
    clearInterval(timerInterval);
    // Remove all drops from the screen
    const drops = document.querySelectorAll('.water-drop');
    drops.forEach(drop => drop.remove());
  }
  // Reset score and timer display
  score = 0;
  updateScore();
  timeLeft = 30;
  updateTime();
});

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  score = 0;
  updateScore();

  timeLeft = 30;
  updateTime();

  // Start the countdown timer
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTime();
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  // Create new drops every 0.5 seconds (500 milliseconds)
  dropMaker = setInterval(createDrop, 500);
}

function createDrop() {
  // Randomly decide drop type: 40% chance dirty, else blue
  const rand = Math.random();
  let dropType = "water-drop";
  if (rand < 0.4) {
    dropType = "water-drop dirty-drop";
  }

  // Create a new div element for the drop
  const drop = document.createElement("div");
  drop.className = dropType;

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });

  // Add click event for drops
  drop.addEventListener("click", function() {
    if (drop.classList.contains("dirty-drop")) {
      score = Math.max(0, score - 1);
      updateScore();
      drop.remove();
    } else {
      score++;
      updateScore();
      drop.remove();
    }
  });
}

// Update score display
function updateScore() {
  document.getElementById("score").textContent = score;
}

// Update timer display
function updateTime() {
  document.getElementById("time").textContent = timeLeft;
}

// End the game when timer reaches 0
function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  // Remove remaining drops
  const drops = document.querySelectorAll('.water-drop');
  drops.forEach(drop => drop.remove());

  // Pick and display a message
  let message;
  if (score >= 20) {
    // Win
    message = winningMessages[Math.floor(Math.random() * winningMessages.length)];
  } else {
    // Lose
    message = losingMessages[Math.floor(Math.random() * losingMessages.length)];
  }

  // Display the message in a modal-like div
  showEndMessage(message, score);
}

// Show end game message
function showEndMessage(message, score) {
  // Water splash effect for victory
  if (score >= 20) {
    showSplashEffect();
  }
// Show water splash effect (animation)
function showSplashEffect() {
  // Remove any existing splash
  const oldSplash = document.getElementById('splash-effect');
  if (oldSplash) oldSplash.remove();

  const splash = document.createElement('div');
  splash.id = 'splash-effect';
  splash.style.position = 'fixed';
  splash.style.top = '0';
  splash.style.left = '0';
  splash.style.width = '100vw';
  splash.style.height = '100vh';
  splash.style.pointerEvents = 'none';
  splash.style.zIndex = '2000';
  splash.style.display = 'flex';
  splash.style.justifyContent = 'center';
  splash.style.alignItems = 'center';
  splash.style.background = 'rgba(46,157,247,0.25)';

  // Large SVG splash animation
  splash.innerHTML = `
    <svg width="100vw" height="100vh" viewBox="0 0 1920 1080" style="position:absolute;top:0;left:0;width:100vw;height:100vh;z-index:2100;" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="960" cy="900" rx="900" ry="180" fill="#2E9DF7" opacity="0.85">
        <animate attributeName="rx" from="0" to="900" dur="0.5s" fill="freeze" />
        <animate attributeName="opacity" from="0.95" to="0" begin="0.7s" dur="0.5s" fill="freeze" />
      </ellipse>
      <ellipse cx="480" cy="700" rx="300" ry="80" fill="#8BD1CB" opacity="0.7">
        <animate attributeName="rx" from="0" to="300" dur="0.4s" fill="freeze" />
        <animate attributeName="opacity" from="0.8" to="0" begin="0.7s" dur="0.5s" fill="freeze" />
      </ellipse>
      <ellipse cx="1440" cy="700" rx="300" ry="80" fill="#8BD1CB" opacity="0.7">
        <animate attributeName="rx" from="0" to="300" dur="0.4s" fill="freeze" />
        <animate attributeName="opacity" from="0.8" to="0" begin="0.7s" dur="0.5s" fill="freeze" />
      </ellipse>
      <ellipse cx="960" cy="400" rx="500" ry="120" fill="#2E9DF7" opacity="0.6">
        <animate attributeName="rx" from="0" to="500" dur="0.5s" fill="freeze" />
        <animate attributeName="opacity" from="0.7" to="0" begin="0.7s" dur="0.5s" fill="freeze" />
      </ellipse>
    </svg>
  `;

  document.body.appendChild(splash);
  // Remove splash after animation
  setTimeout(() => {
    splash.remove();
  }, 1200);
}
  const donateBtn = document.createElement('a');
  donateBtn.href = 'https://www.charitywater.org/?utm_source=adwords&utm_medium=paid-ppc&utm_campaign=spring-acq-usrow&utm_term=cBC_CW_G_PAID_SEARCH_BRAND_ALL_US+ROW_OBSV_ALL_PHRASE_ALL&utm_content=branded&gad_source=1&gad_campaignid=22148602074&gclid=Cj0KCQjwgKjHBhChARIsAPJR3xf5wwR1NfAr0HuuPl-3zQ316bMqzqNaKpq_W0kF6VrS6lEjC52P76MaAp42EALw_wcB';
  donateBtn.target = '_blank';
  donateBtn.rel = 'noopener noreferrer';
  donateBtn.textContent = 'Donate to Charity: Water';
  donateBtn.style.display = 'inline-block';
  donateBtn.style.marginTop = '12px';
  donateBtn.style.marginBottom = '16px';
  donateBtn.style.padding = '10px 24px';
  donateBtn.style.fontSize = '18px';
  donateBtn.style.background = '#003366';
  donateBtn.style.color = '#FFC907';
  donateBtn.style.border = 'none';
  donateBtn.style.borderRadius = '6px';
  donateBtn.style.cursor = 'pointer';
  donateBtn.style.textDecoration = 'none';
  donateBtn.style.fontWeight = 'bold';
  // Remove any existing end message
  const oldMsg = document.getElementById('end-message');
  if (oldMsg) oldMsg.remove();

  const msgDiv = document.createElement('div');
  msgDiv.id = 'end-message';
  msgDiv.style.position = 'fixed';
  msgDiv.style.top = '0';
  msgDiv.style.left = '0';
  msgDiv.style.width = '100vw';
  msgDiv.style.height = '100vh';
  msgDiv.style.background = 'rgba(0,0,0,0.6)';
  msgDiv.style.display = 'flex';
  msgDiv.style.flexDirection = 'column';
  msgDiv.style.justifyContent = 'center';
  msgDiv.style.alignItems = 'center';
  msgDiv.style.zIndex = '1000';

  const box = document.createElement('div');
  box.style.background = score >= 20 ? '#FFC907' : '#F5402C'; // yellow for win, red for loss
  box.style.padding = '32px 40px';
  box.style.borderRadius = '12px';
  box.style.textAlign = 'center';
  box.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';

  // Add logo
  const logo = document.createElement('img');
  logo.src = 'img/water-can.png';
  logo.alt = 'Charity: Water Jerry Can Logo';
  logo.style.width = '60px';
  logo.style.height = '60px';
  logo.style.marginBottom = '18px';
  box.appendChild(logo);

  const msgText = document.createElement('h2');
  msgText.textContent = message;
  msgText.style.marginBottom = '16px';
  msgText.style.color = score >= 20 ? '#003366' : '#fff';
  msgText.style.fontFamily = "'Avenir', 'Proxima Nova', Arial, sans-serif";

  const scoreText = document.createElement('p');
  scoreText.textContent = 'Final Score: ' + score;
  scoreText.style.fontSize = '20px';
  scoreText.style.marginBottom = '24px';
  scoreText.style.color = score >= 20 ? '#003366' : '#fff';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.padding = '10px 24px';
  closeBtn.style.fontSize = '18px';
  closeBtn.style.background = '#2E9DF7';
  closeBtn.style.color = '#fff';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '6px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = function() {
    msgDiv.remove();
  };

  box.appendChild(msgText);
  box.appendChild(scoreText);
  box.appendChild(donateBtn);
  box.appendChild(closeBtn);
  closeBtn.style.marginTop = '8px';
  msgDiv.appendChild(box);
  document.body.appendChild(msgDiv);
}
