const DICE_IMAGES = [
  "", // index 0 unused
  "assets/dice/dice1.png",
  "assets/dice/dice2.png",
  "assets/dice/dice3.png",
  "assets/dice/dice4.png",
  "assets/dice/dice5.png",
  "assets/dice/dice6.png",
];

let rolled = 0;
let point = 0;
let rollmessage = "ROLL!";
let level = "medium";

// Points config per level
const LEVELS = {
  easy: { correct: 5, wrong: -1 },
  medium: { correct: 10, wrong: -2 },
  hard: { correct: 15, wrong: -5 },
};

function updateMessage(msg) {
  const msgElem = document.getElementById("rollMsg");
  msgElem.style.opacity = 0;
  setTimeout(() => {
    msgElem.innerText = msg;
    msgElem.style.opacity = 1;
  }, 100);
}

function updatePoints() {
  const pointsElem = document.getElementById("points");
  pointsElem.innerText = point;
  pointsElem.classList.remove("points-animate");
  void pointsElem.offsetWidth;
  pointsElem.classList.add("points-animate");
  setTimeout(() => pointsElem.classList.remove("points-animate"), 400);
}

// Show feedback overlay on points
function showPointsFeedback(type, msg) {
  let pointDiv = document.querySelector(".point");
  let feedback = document.createElement("div");
  feedback.className = `points-feedback ${type}`;
  feedback.innerText = msg;
  pointDiv.appendChild(feedback);
  setTimeout(() => {
    feedback.remove();
  }, 1000);
}

function updateDiceImage(imgID, num) {
  const image = document.getElementById(imgID);
  image.src = DICE_IMAGES[num] || "";
  image.alt = num ? `Dice ${num}` : "";
  image.classList.remove("dice-animate");
  void image.offsetWidth;
  image.classList.add("dice-animate");
}

function handleGuess(guessed) {
  if (point <= -50) {
    rollmessage = "YOU LOST THE GAME!";
    updateMessage(rollmessage);
    return;
  }
  if (point >= 50) {
    rollmessage = "YOU WON THE GAME!";
    updateMessage(rollmessage);
    return;
  }

  document.getElementById("guessRes").innerText = guessed;
  updateDiceImage("guessImg", guessed);

  rolled = Math.floor(Math.random() * 6) + 1;
  document.getElementById("rollRes").innerText = rolled;
  updateDiceImage("rollImg", rolled);

  if (guessed === rolled) {
    point += LEVELS[level].correct;
    rollmessage = "🎉 Correct! +" + LEVELS[level].correct;
    showPointsFeedback("success", `+${LEVELS[level].correct}`);
  } else {
    point += LEVELS[level].wrong;
    rollmessage =
      Math.abs(guessed - rolled) === 1
        ? "So close! " + LEVELS[level].wrong
        : "Wrong! " + LEVELS[level].wrong;
    showPointsFeedback("fail", `${LEVELS[level].wrong}`);
  }

  updatePoints();
  updateMessage(rollmessage);
}

function resetGame() {
  rolled = 0;
  point = 0;
  rollmessage = "ROLL!";
  document.getElementById("guessRes").innerText = 0;
  document.getElementById("rollRes").innerText = 0;
  document.getElementById("points").innerText = 0;
  document.getElementById("rollMsg").innerText = rollmessage;
  document.getElementById("guessImg").src = "";
  document.getElementById("rollImg").src = "";
  updateMessage(rollmessage);
}

function setupButtons() {
  const btnGroup = document.getElementById("guess-buttons");
  btnGroup.innerHTML = "";
  for (let i = 1; i <= 6; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.addEventListener("click", () => handleGuess(i));
    btnGroup.appendChild(btn);
  }
}

// Level selector logic
document.addEventListener("DOMContentLoaded", () => {
  setupButtons();
  resetGame();

  const levelSelect = document.getElementById("level");
  if (levelSelect) {
    levelSelect.value = level;
    levelSelect.addEventListener("change", (e) => {
      level = e.target.value;
      resetGame();
    });
  }

  document.getElementById("resetBtn").addEventListener("click", resetGame);
});
