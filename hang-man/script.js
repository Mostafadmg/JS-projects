const words = [
  "javascript",
  "developer",
  "hangman",
  "gradient",
  "function",
  "keyboard",
  "project",
  "amazing",
  "challenge",
  "neon",
];

const hangmanParts = document.querySelectorAll(
  ".hangman-part:not(.stand):not(.top-bar):not(.rope)"
);
const wordDisplay = document.getElementById("word-display");
const livesEl = document.getElementById("lives");
const wrongLettersEl = document.getElementById("wrong-letters");
const keyboard = document.getElementById("keyboard");
const restartBtn = document.getElementById("restart-btn");

let chosenWord = "";
let correctLetters = [];
let wrongLetters = [];
let lives = 6;

init();
createKeyboard();
restartBtn.addEventListener("click", init);

function init() {
  chosenWord = words[Math.floor(Math.random() * words.length)];
  correctLetters = [];
  wrongLetters = [];
  lives = 6;
  livesEl.textContent = lives;
  wrongLettersEl.textContent = "";
  hangmanParts.forEach((part) => part.classList.add("hidden"));
  displayWord();
  enableAllButtons();
}

function displayWord() {
  const displayed = chosenWord
    .split("")
    .map((letter) => (correctLetters.includes(letter) ? letter : "_"))
    .join(" ");
  wordDisplay.textContent = displayed;
  if (!displayed.includes("_")) endGame(true);
}

function createKeyboard() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  letters.forEach((letter) => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => handleGuess(letter, btn));
    keyboard.appendChild(btn);
  });
}

function handleGuess(letter, btn) {
  if (chosenWord.includes(letter)) {
    correctLetters.push(letter);
    displayWord();
  } else {
    if (!wrongLetters.includes(letter)) {
      wrongLetters.push(letter);
      wrongLettersEl.textContent = wrongLetters.join(" ");
      lives--;
      livesEl.textContent = lives;
      showHangmanPart();
      if (lives === 0) endGame(false);
    }
  }
  btn.disabled = true;
}

function showHangmanPart() {
  const errors = 6 - lives;
  if (hangmanParts[errors - 1]) {
    hangmanParts[errors - 1].classList.remove("hidden");
  }
}

function endGame(win) {
  disableAllButtons();
  if (win) {
    wordDisplay.textContent = chosenWord.toUpperCase() + " - You Win!";
  } else {
    wordDisplay.textContent = chosenWord.toUpperCase() + " - Game Over!";
  }
}

function enableAllButtons() {
  keyboard.querySelectorAll("button").forEach((btn) => {
    btn.disabled = false;
  });
}

function disableAllButtons() {
  keyboard.querySelectorAll("button").forEach((btn) => {
    btn.disabled = true;
  });
}
