/*
 * ====================================================================
 * 🎮 TIC-TAC-TOE GAME BREAKDOWN 🎮
 * ====================================================================
 *
 * 🧩 STEP 1: GRABBING OUR HTML ELEMENTS
 * --------------------------------------------------------------------
 * Think of this like setting up a physical board game - first, we need
 * to grab all the pieces we'll interact with!
 *
 * ✅const board = document.getElementById("board");
 * ↳ This is our main playing surface. What would happen if we didn't
 *   have a reference to it? How would we add new elements to it later?
 *
 * ✅const cells = document.querySelectorAll(".cell");
 * ↳ These are our 9 little squares! When you look at querySelectorAll,
 *   what do you think it returns? That's right - a collection we can loop
 *   through! Can you visualize how we'll add click events to each one?
 *
 * ✅const currentPlayer = document.getElementById("current-player");
 * ↳ This element will display whose turn it is. Why do you think we
 *   need this? It's like having a little sign at a board game!
 *
 * ✅const resetBtn = document.getElementById("reset-btn");
 * ↳ Our reset button - what event will we listen for on this?
 *
 *
 * 🎯 STEP 2: TRACKING GAME STATE
 * --------------------------------------------------------------------
 * In a physical game, the board shows the state - but in code, we need
 * variables to track everything!
 *
 * ✅let currentPlayer = "X";  // 🚨 DUPLICATE NAME ALERT! 🚨
 * ↳ Wait! We already have a constant named currentPlayer above!
 *   This would cause an error. We should rename this to something like:
 *   let activePlayer = "X";
 *
 * ✅let gameActive = true;
 * ↳ Think of this as our game's ON/OFF switch. What would make us
 *   flip this to false? A win or a draw, right?
 *
 * ✅let boardState = ["", "", "", "", "", "", "", "", ""];
 * ↳ Here's where the magic happens! Imagine this mapping to our board:
 *
 *   [0] [1] [2]
 *   [3] [4] [5]
 *   [6] [7] [8]
 *
 *   When a player clicks the middle square, which index changes?
 *   That's right - index 4!
 *
 *   Why use an array instead of nine separate variables?
 *   ↳ With an array, we can use loops and patterns to check for wins!
 *   ↳ We can easily reset the game by filling with empty strings!
 *   ↳ We can map array indexes directly to cell positions!
 *
 *
 * 🧠 STEP 3: THE MISSING GAME LOGIC
 * --------------------------------------------------------------------
 * Our code snippet is just the setup! To complete the game, we'd need:
 *
 * 1️⃣ Event Listeners
 *    cells.forEach((cell, index) => {
 *        cell.addEventListener("click", () => handleCellClick(index));
 *    });
 *
 * 2️⃣ Handle Player Moves
 *    function handleCellClick(index) {
 *        // Is the cell empty? Is the game still active?
 *        if (boardState[index] === "" && gameActive) {
 *            // What should we update here? The boardState and the display!
 *        }
 *    }
 *
 * 3️⃣ Check for Win Conditions
 *    function checkWin() {
 *        // How would you check all possible win patterns?
 *        // Rows, columns, diagonals...
 *    }
 *
 * 4️⃣ Switch Players
 *    function switchPlayer() {
 *        // How do we toggle between "X" and "O"?
 *        // Could we use a ternary operator here?
 *    }
 *
 * 5️⃣ Reset Game
 *    function resetGame() {
 *        // What needs to be reset? Think about ALL our state variables!
 *    }
 *
 *
 * 🎬 DEVELOPMENT THINKING PROCESS
 * --------------------------------------------------------------------
 * 1. Visualize the end result and user interactions
 * 2. Identify HTML elements needed for those interactions
 * 3. Determine what state needs to be tracked
 * 4. Design the program's flow and logic
 * 5. Implement each piece step by step
 * 6. Test and refine
 *
 * Can you see how breaking a complex problem into smaller pieces
 * makes coding more manageable? What part would you build first?
 */
const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const currentPlayerEl = document.getElementById("current-player");
const resetBtn = document.getElementById("reset-btn");

let currentPlayer = "X";
let gameActive = true;

let boardState = ["", "", "", "", "", "", "", "", ""];
/*

[0] [1] [2]
[3] [4] [5]
[6] [7] [8]

creating the winning patterns.
*/
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
