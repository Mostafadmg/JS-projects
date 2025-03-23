const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const currentPlayerEl = document.getElementById("current-player");
const resetBtn = document.getElementById("reset-btn");

let currentPlayer = "X";
let gameActive = true;
let boardState = ["", "", "", "", "", "", "", "", ""];

const winningPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

resetBtn.addEventListener("click", resetGame);

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");
  if (!gameActive || boardState[index] !== "") return;
  boardState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  checkResult();
  switchPlayer();
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  currentPlayerEl.textContent = currentPlayer;
}

function checkResult() {
  for (let pattern of winningPatterns) {
    const [a, b, c] = pattern;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[b] === boardState[c]
    ) {
      highlightWinner(pattern);
      gameActive = false;
      return;
    }
  }
  if (!boardState.includes("")) {
    currentPlayerEl.textContent = "Draw";
    gameActive = false;
  }
}

function highlightWinner(pattern) {
  pattern.forEach((index) => {
    cells[index].classList.add("win");
  });
  currentPlayerEl.textContent = `${currentPlayer} Wins!`;
}

function resetGame() {
  currentPlayer = "X";
  currentPlayerEl.textContent = currentPlayer;
  gameActive = true;
  boardState = ["", "", "", "", "", "", "", "", ""];
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("win");
  });
}
