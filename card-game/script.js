/* const symbols = ["🍎", "🍌", "🍓", "🍇", "🍉", "🍋", "🍒", "🍊"];

let cardSymbols = shuffle([...symbols, ...symbols]);
let moves = 0;
let matches = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

const gameContainer = document.getElementById("game");
const movesCount = document.getElementById("moves-count");
const matchCount = document.getElementById("match-count");
const restartButton = document.getElementById("restart-btn");

createCards();
restartButton.addEventListener("click", restartGame);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]];
  }
  return array;
}

function createCards() {
  gameContainer.innerHTML = "";
  cardSymbols.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-face", "card-front");
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-face", "card-back");
    cardBack.textContent = symbol;
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    card.addEventListener("click", () => flipCard(card));
    gameContainer.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard) return;
  if (card === firstCard) return;
  card.classList.add("flipped");
  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    moves++;
    movesCount.textContent = moves;
    const firstSymbol = firstCard.querySelector(".card-back").textContent;
    const secondSymbol = secondCard.querySelector(".card-back").textContent;
    if (firstSymbol === secondSymbol) {
      matches++;
      matchCount.textContent = matches;
      resetCards();
      if (matches === symbols.length) {
        setTimeout(() => {
          alert("Congratulations! You matched all the cards!");
        }, 300);
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetCards();
      }, 1000);
    }
  }
}

function resetCards() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restartGame() {
  moves = 0;
  matches = 0;
  movesCount.textContent = moves;
  matchCount.textContent = matches;
  cardSymbols = shuffle([...symbols, ...symbols]);
  createCards();
  resetCards();
}
 */
// Step 1: Define the symbols to be used on cards

const symbols = ["🍎", "🍌", "🍓", "🍇", "🍉", "🍋", "🍒", "🍊"];
let cardSymbols = shuffle([...symbols, ...symbols]);
// ================ GAME MECHANICS TRACKING ================
/**
 * 📊 #1: GAME SETUP
 * Now we're diving into the game mechanics!
 * 🎮 This code is setting up the variables that will track what's happening during gameplay.
 * Let's imagine you and I are building this memory game together.
 * What do you think we need to keep track of while people play our game? 🤔
 */

/**
 * 🔢 #2: MOVE COUNTER
 * This is our move counter! Every time a player flips two cards (making a complete move),
 * this number will increase. It's like the scoreboard at a basketball game, but instead
 * of points, we're counting attempts.
 *
 * Why do you think we might want to count moves? (Maybe to calculate a final score
 * or give players stars based on efficiency!)
 *
 * ✅let moves = 0;✅
 */

/**
 * 🎯 #3: MATCH TRACKER
 * This is our success tracker! Each time a player finds a matching pair, this number goes up.
 * When would our game be complete? Think about it... if we have 8 pairs of fruits,
 * then the game is over when matches reaches...? That's right, 8! 🎯
 *
 * ✅let matches = 0;✅
 */

/**
 * 🃏 #4: CARD SELECTION
 * Ooh, this is interesting! In a memory game, players flip two cards at a time. These variables
 * are like our hands - they hold onto the cards we've just flipped. When we start, our hands
 * are empty, that is why they are null.
 *
 * When a player clicks the first card, what do you think happens? We store that card in firstCard.
 * Then when they click another, we store it in secondCard. Now we can compare them to see if
 * they match! Can you visualize how this might work in your mind?
 *
 * ✅ let firstCard = null;✅
 * ✅let secondCard = null;✅
 */

/**
 * 🚦 #5: GAME FLOW CONTROL
 * Ah, this is the clever part! What would happen if a player got excited and clicked
 * on three cards really fast? It could break our game logic since we're only set up
 * to handle two cards at a time!
 *
 * The lockBoard variable acts like a traffic light 🚦:
 * - When lockBoard is false (green light): Players can flip cards
 * - When lockBoard is true (red light): Players must wait!
 *
 * Imagine you flip two non-matching cards. We need a moment to show both cards before
 * flipping them back over. During that moment, we set lockBoard = true to prevent
 * impatient players from clicking more cards!
 *
 * Wait, here's a challenge for you: When do you think we would set lockBoard back to false?
 * Can you picture the sequence of events? 🤔
 *
 * - Player flips first card → store in firstCard
 * - Player flips second card → store in secondCard and set lockBoard = true
 * - Check if cards match...
 *   - If they match, keep them face up and reset firstCard and secondCard to null
 *   - If they don't match, wait a second (to let player see both cards), flip them back,
 *     and reset everything
 * - Finally, set lockBoard = false again so the player can continue!
 *
 * Isn't it amazing how these few lines of code create the entire flow of the game?
 * Each variable has a crucial role in creating a smooth, enjoyable experience.
 * What part do you find most interesting? 🎲
 *
 * ✅let lockBorad = false; //to prevent flipping too many cards at once✅
 */
let moves = 0;
let matches = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
//----------------------------------------------------------------------------------------------
// References to DOM elements
const gameContainer = document.getElementById("game");
const movesCount = document.getElementById("moves-count");
const matchCount = document.getElementById("match-count");
const restartButton = document.getElementById("restart-btn");

// Step 3: Create the cards dynamically and display them

createCards();
//----------------------------------------------------------------------------------------------

// Step 4: Add event listener for the restart button

restartButton.addEventListener("click", restartGame);

//----------------------------------------------------------------------------------------------
/**
 * 🎲 #1: THE MAGICAL SHUFFLING ALGORITHM
 *
 ** Let me try a completely different approach to explain this! Let's walk through it like we're actually doing the shuffling together.
 *
 * Imagine we have 5 cards laid out in front of us labeled A, B, C, D, E.
 * ```
 * A B C D E
 * ```
 *
 * Step 1: What's happening in the Fisher-Yates shuffle?
 *
 * Think of it like this - we're going to work from right to left, and for each position, we're going to pick ONE card that could go there, from all the cards that haven't been placed yet.
 *
 * Let's try it together:
 *
 * Starting with position 5 (where E is):
 * * We can put ANY of our 5 cards here
 * * Let's roll a 5-sided die... we got 3!
 * * So we take the 3rd card (C) and swap it with the card in position 5 (E)
 *
 * ```
 * A B E D C
 * ```
 *
 * Now position 5 is LOCKED - we've decided C belongs there! 🔒
 *
 * For position 4 (where D is):
 * * We can use ANY card from positions 1-4 (since position 5 is locked)
 * * Let's roll a 4-sided die... we got 1!
 * * So we take the 1st card (A) and swap it with the card in position 4 (D)
 *
 * ```
 * D B E A C
 * ```
 *
 * Now positions 4 AND 5 are LOCKED! 🔒🔒
 *
 * For position 3 (where E is):
 * * We can use ANY card from positions 1-3
 * * Let's roll a 3-sided die... we got 2!
 * * So we take the 2nd card (B) and swap it with the card in position 3 (E)
 *
 * ```
 * D E B A C
 * ```
 *
 * Positions 3, 4, and 5 are now LOCKED! 🔒🔒🔒
 *
 * For position 2 (where B is):
 * * We can use ANY card from positions 1-2
 * * Let's roll a 2-sided die... we got 1!
 * * So we take the 1st card (D) and swap it with the card in position 2 (B)
 *
 * ```
 * B E D A C
 * ```
 *
 * And that's our final shuffle!
 *
 * Here's the key insight: In each step, we ONLY considered the cards that hadn't been placed yet.
 *
 * Let's connect this directly to the code:
 * ```javascript
 * for (let i = array.length - 1; i > 0; i--) {
 *   const randomIndex = Math.floor(Math.random() * (i + 1));
 *   [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
 * }
 * ```
 *
 * When the loop starts, `i` equals 4 (for a 5-card array). We pick a random index between 0 and 4, and swap that card with the one at position 4.
 *
 * After that swap, we NEVER touch position 4 again! The loop moves to `i = 3`, and we're only considering positions 0-3.
 *
 * This guarantees:
 * 1. Every card has an equal chance of ending up in the last position
 * 2. After that card is placed, every remaining card has an equal chance of ending up in the second-last position
 * 3. And so on...
 *
 * Think of it as building a house from back to front:
 * 1. First, we decide what goes in the back room (randomly from all furniture)
 * 2. Next, we decide what goes in the middle room (randomly from remaining furniture)
 * 3. Finally, we decide what goes in the front room (whatever's left)
 *
 *
 * Ah, we've reached the magical shuffling function! 🎩✨ This is where our
 * memory game gets its unpredictability and challenge. Let's dive in together
 * and unravel this clever algorithm!
 *
 * Think about it: How would you mix up a deck of cards in real life?
 * You might pick random cards and swap their positions, right? That's exactly
 * what we're going to do with our virtual cards!
 *
 * Let's embark on this shuffling journey together. Can you predict how we'll
 * create randomness in our game? 🤔
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]];
  }
  return array;
}

//------------------------------------------------------------------------------------------------------------
/**
 * 🎨 #1: BUILDING OUR GAME BOARD
 *
 * * 🔄 #1: ELEMENT CREATION & RELATIONSHIP JOURNEY
 *
 * Let's explore the magical journey of how DOM elements come together!
 * When we create elements in JavaScript, each one starts as a lonely object
 * floating in memory - like separate LEGO pieces scattered on a table. 🧩
 *
 * Think about this: When you create a box and then create a smaller box,
 * do they automatically nest inside each other? Of course not! You have to
 * physically put the smaller one inside the larger one.
 *
 * Let's follow this journey together step by step:
 *
 * 1️⃣ First, we create each piece separately in memory:
 *    - The card (our outer container)
 *    - The card-inner (our flipping mechanism)
 *    - The front face (what players see first)
 *    - The back face (where our fruit symbol lives)
 *
 * 2️⃣ Then, we carefully assemble these pieces using appendChild():
 *    - We place both faces inside the card-inner
 *    - We place the card-inner inside the card
 *    - Finally, we place the complete card into our game board
 *
 * What do you think would happen if we skipped one of these appendChild() steps?
 * That's right - our card structure would be incomplete! Some pieces would
 * remain disconnected, like LEGO pieces that never got attached. 🧱
 *
 * Can you visualize how these elements start separate in memory and then
 * gradually form relationships? It's like building a family tree, where
 * each appendChild() creates a parent-child relationship!
 *
 * Now, let's watch this relationship-building unfold in our code...
 *
 *
 *
 * Now we're building the visual part of our memory game! Let's imagine
 * we're constructing a magical card table together. 🃏✨
 *
 * Think about your favorite card games - how are the cards arranged? In rows?
 * In a circle? For our memory game, we'll create a neat grid of face-down cards.
 *
 * As we build this function together, try to visualize each step:
 * - First, we'll clear the table (like sweeping off any old cards)
 * - Then, for each of our fruit symbols, we'll craft a beautiful card
 * - Each card needs both a front (the mystery side) and a back (the fruit side)
 * - Finally, we'll set up the magic that lets players flip cards with a click!
 *
 * Ready to bring our game to life? Let's start building! 👷‍♀️
 */
function createCards() {
  gameContainer.innerHTML = "";
  cardSymbols.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-face", "card-front");
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-face", "card-back");
    cardBack.textContent = symbol;
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    card.addEventListener("click", () => flipCard(card));
    gameContainer.appendChild(card);
  });
}

//--------------------------------------------------------------------------------------------------------------
/**
 * 🎮 #1: THE HEARTBEAT OF OUR MEMORY GAME
 *
 * Alright, let's bring this `flipCard` function to life! 🎮 This is where all the magic
 * happens in our memory game. Ready to dive in and see how it works from the inside? Let's go!
 *
 * Imagine we're game designers crafting the most exciting moment for players -
 * the card flip! Every time a player clicks a card, this function springs into action!
 * What do you think happens when a card gets flipped? Let's uncover the mysteries together!
 */
function flipCard(card) {
  if (lockBoard || card === firstCard) return; // <-- Fixed 'lockBorad' to 'lockBoard'
  card.classList.add("flipped");
  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    moves++;
    document.getElementById("moves-count").textContent = moves; // <-- Fixed ID "moves" -> "moves-count"

    const firstSymbol = firstCard.querySelector(".card-back").textContent;
    const secondSymbol = secondCard.querySelector(".card-back").textContent;
    if (firstSymbol === secondSymbol) {
      matches++;
      document.getElementById("match-count").textContent = matches; // <-- Fixed ID "matches" -> "match-count"
      resetCards();
      if (matches === symbols.length) {
        setTimeout(() => {
          alert("Congratulations! You matched all the cards!");
        }, 300);
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetCards();
      }, 1000);
    }
  }
}
function resetCards() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restartGame() {
  moves = 0;
  matches = 0;
  movesCount.textContent = moves;
  matchCount.textContent = matches;
  cardSymbols = shuffle([...symbols, ...symbols]);
  createCards();
  resetCards();
}
