const DICE_IMAGES = [
  "", // index 0 unused
  "assets/dice/dice1.png",
  "assets/dice/dice2.png",
  "assets/dice/dice3.png",
  "assets/dice/dice4.png",
  "assets/dice/dice5.png",
  "assets/dice/dice6.png",
];

// Game constants
const WIN_SCORE = 50;
const LOSE_SCORE = -50;
const MAX_DICE_VALUE = 6;

// UI & Animation Timing constants
const MESSAGE_FADE_DELAY_MS = 100;
const POINTS_ANIMATION_DURATION_MS = 400;
const FEEDBACK_DISPLAY_DURATION_MS = 1000;

// Pseudo-random roll generation constants
const BLOCK_SIZES_SEQUENCE = [5, 7, 9, 11, 13]; // Sequence of block sizes for rolls

// Game state variables
let rolled = 0;
let point = 0;
let rollmessage = "ROLL!";
let level = "medium";
let consecutiveWrongGuesses = 0;
let activeSoundsCount = 0; // Counter for active sounds
let currentBlockSizeIndex = 0;
let currentBlockRolls = [];
let currentRollInBlockIndex = 0;

// Sound effect variables
let correctSound;
let wrongSound;
let rollSound;
let gameWinSound;
let gameLoseSound;
let consecutiveWrongSound;

// Points config per level
const LEVELS = {
  easy: { correct: 5, wrong: -1 },
  medium: { correct: 10, wrong: -2 },
  hard: { correct: 15, wrong: -5 },
};

// Cached DOM elements
let msgElem;
let pointsElem;
let guessResElem;
let rollResElem;
let guessImgElem;
let rollImgElem;
let pointFeedbackContainerElem;
let guessButtonsContainerElem;
let levelSelectElem;
let resetBtnElem;

function updateMessage(msg) {
  if (!msgElem) return;
  msgElem.style.opacity = 0;
  setTimeout(() => {
    msgElem.innerText = msg;
    msgElem.style.opacity = 1;
  }, MESSAGE_FADE_DELAY_MS);
}

function updatePoints() {
  if (!pointsElem) return;
  pointsElem.innerText = point;
  pointsElem.classList.remove("points-animate");
  void pointsElem.offsetWidth;
  pointsElem.classList.add("points-animate");
  setTimeout(
    () => pointsElem.classList.remove("points-animate"),
    POINTS_ANIMATION_DURATION_MS
  );
}

// Show feedback overlay on points
function showPointsFeedback(type, msg) {
  if (!pointFeedbackContainerElem) return;
  let feedback = document.createElement("div");
  feedback.className = `points-feedback ${type}`;
  feedback.innerText = msg;
  pointFeedbackContainerElem.appendChild(feedback);
  setTimeout(() => {
    feedback.remove();
  }, FEEDBACK_DISPLAY_DURATION_MS);
}

function updateDiceImage(imageElement, num) {
  if (!imageElement) return;
  imageElement.src = DICE_IMAGES[num] || "";
  imageElement.alt = num ? `Dice ${num}` : "";
  imageElement.classList.remove("dice-animate");
  void imageElement.offsetWidth; // Force reflow to restart animation
  imageElement.classList.add("dice-animate");
}

// Helper function to play sounds and manage button states
function playSound(audioObject) {
  if (!audioObject || !guessButtonsContainerElem) {
    // Don't try to play a null sound or if button container isn't ready
    return;
  }

  const buttons = guessButtonsContainerElem.querySelectorAll('button');

  if (activeSoundsCount === 0) {
    // Disable buttons only if this is the first sound in a potential sequence
    buttons.forEach(button => button.disabled = true);
  }
  activeSoundsCount++;

  const commonSoundEndLogic = () => {
    activeSoundsCount--;
    if (activeSoundsCount < 0) activeSoundsCount = 0; // Safety net
    if (activeSoundsCount === 0) {
      // Re-enable buttons only if all sounds have finished
      buttons.forEach(button => button.disabled = false);
    }
  };

  audioObject.currentTime = 0;
  audioObject.addEventListener('ended', commonSoundEndLogic, { once: true });

  audioObject.play().catch(error => {
    console.error("Error playing sound:", error, audioObject.src);
    commonSoundEndLogic(); // Ensure count is decremented and buttons potentially re-enabled
  });
}

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

// Generates a list of rolls for a block of a given size
function generateRollsForBlock(blockSize) {
  const rolls = [];
  const baseValues = [];
  for (let i = 1; i <= MAX_DICE_VALUE; i++) {
    baseValues.push(i);
  }

  const numFullSets = Math.floor(blockSize / MAX_DICE_VALUE);
  for (let i = 0; i < numFullSets; i++) {
    rolls.push(...baseValues); // Add all dice values for each full set
  }

  const remainingRollsCount = blockSize % MAX_DICE_VALUE;
  if (remainingRollsCount > 0) {
    const shuffledBaseValues = [...baseValues]; // Create a mutable copy
    shuffleArray(shuffledBaseValues); // Shuffle to pick distinct remaining values
    rolls.push(...shuffledBaseValues.slice(0, remainingRollsCount));
  }

  shuffleArray(rolls); // Shuffle the final list of rolls for this block
  return rolls;
}

function handleGuess(guessed) {
  // Pre-guess game over check (prevents playing if already won/lost)
  if (point <= LOSE_SCORE) {
    rollmessage = "YOU LOST THE GAME!";
    updateMessage(rollmessage);
    // Optionally play gameLoseSound again here if desired, or rely on it playing when loss occurred.
    return;
  }
  if (point >= WIN_SCORE) {
    rollmessage = "YOU WON THE GAME!";
    updateMessage(rollmessage);
    // Optionally play gameWinSound again here if desired.
    return;
  }

  if (guessResElem) guessResElem.innerText = guessed;
  updateDiceImage(guessImgElem, guessed);

  // Roll the dice using the Shuffled Block Sequence method
  if (currentRollInBlockIndex >= currentBlockRolls.length) {
    // Current block is exhausted, move to the next one
    currentBlockSizeIndex = (currentBlockSizeIndex + 1) % BLOCK_SIZES_SEQUENCE.length;
    const nextBlockSize = BLOCK_SIZES_SEQUENCE[currentBlockSizeIndex];
    currentBlockRolls = generateRollsForBlock(nextBlockSize);
    currentRollInBlockIndex = 0;
  }
  rolled = currentBlockRolls[currentRollInBlockIndex];
  currentRollInBlockIndex++;

  if (rollResElem) rollResElem.innerText = rolled;
  updateDiceImage(rollImgElem, rolled);

  // Play roll sound after dice are visually updated
  playSound(rollSound);

  let playWinSoundFlag = false;
  let playLoseSoundFlag = false;
  let playCorrectSoundFlag = false;
  let playWrongSoundFlag = false;
  let playConsecutiveWrongSoundFlag = false;

  // Evaluate guess and update points
  if (guessed === rolled) {
    // Correct guess
    point += LEVELS[level].correct;
    rollmessage = "🎉 Correct! +" + LEVELS[level].correct;
    showPointsFeedback("success", `+${LEVELS[level].correct}`);
    consecutiveWrongGuesses = 0;

    if (point >= WIN_SCORE) {
      playWinSoundFlag = true;
      rollmessage = "YOU WON THE GAME!"; // Override message
    } else {
      playCorrectSoundFlag = true;
    }
  } else {
    // Wrong guess
    point += LEVELS[level].wrong;
    rollmessage =
      Math.abs(guessed - rolled) === 1
        ? "So close! " + LEVELS[level].wrong
        : "Wrong! " + LEVELS[level].wrong;
    showPointsFeedback("fail", `${LEVELS[level].wrong}`);
    consecutiveWrongGuesses++;

    if (point <= LOSE_SCORE) {
      playLoseSoundFlag = true;
      rollmessage = "YOU LOST THE GAME!"; // Override message
    } else if (consecutiveWrongGuesses >= 3) {
      playConsecutiveWrongSoundFlag = true;
      consecutiveWrongGuesses = 0; // Reset after deciding to play this special sound
    } else {
      playWrongSoundFlag = true;
    }
  }

  updatePoints(); // Update points display

  // Play sounds based on flags (prioritize win/loss)
  if (playWinSoundFlag) {
    playSound(gameWinSound);
  } else if (playLoseSoundFlag) {
    playSound(gameLoseSound);
  } else if (playCorrectSoundFlag) {
    playSound(correctSound);
  } else if (playConsecutiveWrongSoundFlag) {
    playSound(consecutiveWrongSound);
  } else if (playWrongSoundFlag) {
    playSound(wrongSound);
  }

  updateMessage(rollmessage);
}

function resetGame() {
  rolled = 0;
  point = 0;
  consecutiveWrongGuesses = 0;
  activeSoundsCount = 0; // Reset active sound count

  // Reset and prepare the first block for pseudo-random rolling
  currentBlockSizeIndex = 0;
  const firstBlockSize = BLOCK_SIZES_SEQUENCE[currentBlockSizeIndex];
  currentBlockRolls = generateRollsForBlock(firstBlockSize);
  currentRollInBlockIndex = 0;
  rollmessage = "ROLL!";

  if (guessResElem) guessResElem.innerText = "0";
  if (rollResElem) rollResElem.innerText = "0";

  if (guessImgElem) {
    guessImgElem.src = "";
    guessImgElem.alt = "";
  }
  if (rollImgElem) {
    rollImgElem.src = "";
    rollImgElem.alt = "";
  }

  // Ensure buttons are enabled on reset
  if (guessButtonsContainerElem) {
    const buttons = guessButtonsContainerElem.querySelectorAll('button');
    buttons.forEach(button => button.disabled = false);
  }

  updatePoints(); // Resets points display to 0 and applies animation
  updateMessage(rollmessage);
}

function setupButtons() {
  if (!guessButtonsContainerElem) return;
  guessButtonsContainerElem.innerHTML = ""; // Clear existing buttons
  for (let i = 1; i <= MAX_DICE_VALUE; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.addEventListener("click", () => handleGuess(i));
    guessButtonsContainerElem.appendChild(btn);
  }
}

// Level selector logic
document.addEventListener("DOMContentLoaded", () => {
  // Initialize cached DOM elements
  msgElem = document.getElementById("rollMsg");
  pointsElem = document.getElementById("points");
  guessResElem = document.getElementById("guessRes");
  rollResElem = document.getElementById("rollRes");
  guessImgElem = document.getElementById("guessImg");
  rollImgElem = document.getElementById("rollImg");
  pointFeedbackContainerElem = document.querySelector(".point");
  guessButtonsContainerElem = document.getElementById("guess-buttons");
  levelSelectElem = document.getElementById("level");
  resetBtnElem = document.getElementById("resetBtn");

  // Initialize sounds
  correctSound = new Audio("assets/sounds/correct.mp3"); // Replace with your actual sound file path
  wrongSound = new Audio("assets/sounds/wrong.mp3");   // Replace with your actual sound file path
  rollSound = new Audio("assets/sounds/roll.mp3");
  gameWinSound = new Audio("assets/sounds/win.mp3");
  gameLoseSound = new Audio("assets/sounds/lose.mp3");
  consecutiveWrongSound = new Audio("assets/sounds/wrong_special.mp3");

  setupButtons();
  resetGame();

  if (levelSelectElem) {
    levelSelectElem.value = level; // Set initial value
    levelSelectElem.addEventListener("change", (e) => {
      level = e.target.value;
      resetGame();
    });
  }

  if (resetBtnElem) {
    resetBtnElem.addEventListener("click", resetGame);
  }
});
