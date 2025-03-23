/**
 * Modern Snake Game
 * A classic game reimagined with ES6+ features
 * Perfect for intermediate JavaScript developers to learn from
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // ================= GAME CONSTANTS =================

  // Game speed options in milliseconds (lower = faster)
  const GAME_SPEEDS = {
    slow: 150,
    medium: 100,
    fast: 70,
  };

  // Direction constants to avoid string comparison
  const DIRECTIONS = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
  };

  // Special food attributes
  const SPECIAL_FOOD = {
    probabilityPercentage: 15, // 15% chance of spawning special food
    pointValue: 5, // Points for special food
    lifetime: 5000, // Time in ms that special food remains
  };

  // ================= GAME CLASSES =================

  /**
   * Game Configuration class
   * Manages and stores all game settings
   */
  class GameConfig {
    constructor() {
      this.speed = GAME_SPEEDS.medium;
      this.theme = "default";
      this.gridLines = true;
      this.soundEnabled = false;
      this.specialFoodEnabled = true;
      this.gridSize = 20; // Size of each cell in pixels

      this.loadFromLocalStorage();
    }

    /**
     * Load saved configuration from local storage if available
     */
    loadFromLocalStorage() {
      const savedConfig = localStorage.getItem("snakeGameConfig");
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.speed = config.speed || this.speed;
        this.theme = config.theme || this.theme;
        this.gridLines =
          config.gridLines !== undefined ? config.gridLines : this.gridLines;
        this.soundEnabled =
          config.soundEnabled !== undefined ? config.soundEnabled : this.soundEnabled;
        this.specialFoodEnabled =
          config.specialFoodEnabled !== undefined
            ? config.specialFoodEnabled
            : this.specialFoodEnabled;
      }
    }

    /**
     * Save current configuration to local storage
     */
    saveToLocalStorage() {
      const config = {
        speed: this.speed,
        theme: this.theme,
        gridLines: this.gridLines,
        soundEnabled: this.soundEnabled,
        specialFoodEnabled: this.specialFoodEnabled,
      };
      localStorage.setItem("snakeGameConfig", JSON.stringify(config));
    }

    /**
     * Apply theme to document
     */
    applyTheme() {
      document.body.setAttribute("data-theme", this.theme);
    }
  }

  /**
   * Snake class
   * Manages snake's properties and behavior
   */
  class Snake {
    constructor(gameSize) {
      this.gameSize = gameSize;
      this.reset();
    }

    /**
     * Reset snake to initial state
     */
    reset() {
      // Start with a snake of length 3 in the middle of the game
      const midPoint = Math.floor(this.gameSize / 2);

      // Body segments as [x, y] coordinates
      this.body = [
        [midPoint, midPoint], // Head
        [midPoint - 1, midPoint], // Body
        [midPoint - 2, midPoint], // Tail
      ];

      this.direction = DIRECTIONS.RIGHT;
      this.nextDirection = DIRECTIONS.RIGHT;
      this.grew = false;
    }

    /**
     * Update snake position based on current direction
     */
    move() {
      // Update current direction from next direction
      this.direction = this.nextDirection;

      // Get current head position
      const head = this.body[0].slice(); // Create copy of head coordinates

      // Calculate new head position based on direction
      switch (this.direction) {
        case DIRECTIONS.UP:
          head[1] -= 1;
          break;
        case DIRECTIONS.DOWN:
          head[1] += 1;
          break;
        case DIRECTIONS.LEFT:
          head[0] -= 1;
          break;
        case DIRECTIONS.RIGHT:
          head[0] += 1;
          break;
      }

      // Add new head to beginning of body array
      this.body.unshift(head);

      // If snake didn't grow, remove the tail
      if (!this.grew) {
        this.body.pop();
      } else {
        // Reset growth flag
        this.grew = false;
      }
    }

    /**
     * Change the snake's direction
     * @param {string} newDirection - New direction to move
     */
    changeDirection(newDirection) {
      // Prevent 180-degree turns (snake moving back into itself)
      if (
        (this.direction === DIRECTIONS.UP && newDirection === DIRECTIONS.DOWN) ||
        (this.direction === DIRECTIONS.DOWN && newDirection === DIRECTIONS.UP) ||
        (this.direction === DIRECTIONS.LEFT && newDirection === DIRECTIONS.RIGHT) ||
        (this.direction === DIRECTIONS.RIGHT && newDirection === DIRECTIONS.LEFT)
      ) {
        return; // Ignore this direction change
      }

      this.nextDirection = newDirection;
    }

    /**
     * Make the snake grow on next move
     */
    grow() {
      this.grew = true;
    }

    /**
     * Check if snake has collided with itself or walls
     * @returns {boolean} True if collision detected
     */
    checkCollision() {
      const head = this.body[0];
      const [headX, headY] = head;

      // Check wall collision
      if (headX < 0 || headX >= this.gameSize || headY < 0 || headY >= this.gameSize) {
        return true;
      }

      // Check self collision (starting from index 1 to skip the head)
      for (let i = 1; i < this.body.length; i++) {
        const [segmentX, segmentY] = this.body[i];
        if (headX === segmentX && headY === segmentY) {
          return true;
        }
      }

      return false;
    }

    /**
     * Check if snake head is at given position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if snake head is at position
     */
    isHeadAt(x, y) {
      const [headX, headY] = this.body[0];
      return headX === x && headY === y;
    }
  }

  /**
   * Food class
   * Manages regular and special food items
   */
  class Food {
    constructor(gameSize, specialFoodEnabled) {
      this.gameSize = gameSize;
      this.specialFoodEnabled = specialFoodEnabled;
      this.regular = this.generateFood();
      this.special = null;
      this.specialTimer = null;
    }

    /**
     * Generate new food at random position
     * @param {array} snakeBody - Array of snake body segments to avoid
     * @returns {array} [x, y] coordinates
     */
    generateFood(snakeBody = []) {
      let x, y;
      let validPosition = false;

      // Keep generating positions until we find one not occupied by the snake
      while (!validPosition) {
        x = Math.floor(Math.random() * this.gameSize);
        y = Math.floor(Math.random() * this.gameSize);

        validPosition = true;

        // Check if position conflicts with snake body
        for (const segment of snakeBody) {
          if (segment[0] === x && segment[1] === y) {
            validPosition = false;
            break;
          }
        }

        // Check if position conflicts with special food
        if (this.special && this.special[0] === x && this.special[1] === y) {
          validPosition = false;
        }
      }

      return [x, y];
    }

    /**
     * Update food position after being eaten
     * @param {array} snakeBody - Current snake body to avoid
     */
    update(snakeBody) {
      this.regular = this.generateFood(snakeBody);

      // Possibly generate special food
      this.tryGenerateSpecialFood(snakeBody);
    }

    /**
     * Try to generate special food with a certain probability
     * @param {array} snakeBody - Snake body segments to avoid
     */
    tryGenerateSpecialFood(snakeBody) {
      // Only if special food is enabled and not already present
      if (
        this.specialFoodEnabled &&
        !this.special &&
        Math.random() < SPECIAL_FOOD.probabilityPercentage / 100
      ) {
        this.special = this.generateFood([...snakeBody, this.regular]);

        // Set timer to remove special food
        clearTimeout(this.specialTimer);
        this.specialTimer = setTimeout(() => {
          this.special = null;
        }, SPECIAL_FOOD.lifetime);
      }
    }

    /**
     * Remove special food
     */
    clearSpecialFood() {
      this.special = null;
      clearTimeout(this.specialTimer);
    }
  }

  /**
   * Game class
   * Main game controller
   */
  class Game {
    constructor() {
      // Get DOM elements
      this.canvas = document.getElementById("game-canvas");
      this.ctx = this.canvas.getContext("2d");
      this.scoreElement = document.getElementById("score");
      this.highScoreElement = document.getElementById("high-score");
      this.startScreen = document.getElementById("start-screen");
      this.gameOverScreen = document.getElementById("game-over-screen");
      this.finalScoreElement = document.getElementById("final-score");
      this.finalHighScoreElement = document.getElementById("final-high-score");

      // Load configuration
      this.config = new GameConfig();
      this.config.applyTheme();

      // Set up game state
      this.gameActive = false;
      this.score = 0;
      this.highScore = parseInt(localStorage.getItem("snakeHighScore") || "0");
      this.highScoreElement.textContent = this.highScore;

      // Calculate grid dimensions
      this.resizeCanvas();

      // Create snake and food
      this.snake = new Snake(this.gridCount);
      this.food = new Food(this.gridCount, this.config.specialFoodEnabled);

      // Initialize event listeners
      this.setupEventListeners();
    }

    /**
     * Set up all event listeners for the game
     */
    setupEventListeners() {
      // Keyboard controls
      document.addEventListener("keydown", this.handleKeyPress.bind(this));

      // Mobile controls
      document
        .getElementById("up-btn")
        .addEventListener("click", () => this.snake.changeDirection(DIRECTIONS.UP));
      document
        .getElementById("down-btn")
        .addEventListener("click", () => this.snake.changeDirection(DIRECTIONS.DOWN));
      document
        .getElementById("left-btn")
        .addEventListener("click", () => this.snake.changeDirection(DIRECTIONS.LEFT));
      document
        .getElementById("right-btn")
        .addEventListener("click", () => this.snake.changeDirection(DIRECTIONS.RIGHT));

      // Game buttons
      document
        .getElementById("start-button")
        .addEventListener("click", this.startGame.bind(this));
      document
        .getElementById("restart-button")
        .addEventListener("click", this.startGame.bind(this));

      // Settings
      document
        .getElementById("settings-button")
        .addEventListener("click", this.toggleSettingsModal.bind(this));
      document
        .getElementById("close-settings")
        .addEventListener("click", this.toggleSettingsModal.bind(this));
      document
        .getElementById("audio-button")
        .addEventListener("click", this.toggleAudio.bind(this));

      // Settings controls
      document.querySelectorAll(".theme-btn").forEach((btn) => {
        btn.addEventListener("click", () => this.changeTheme(btn.dataset.theme));
      });

      document.getElementById("grid-toggle").addEventListener("change", (e) => {
        this.config.gridLines = e.target.checked;
        this.config.saveToLocalStorage();
        this.draw();
      });

      document.getElementById("speed-slider").addEventListener("input", (e) => {
        const speedSetting = parseInt(e.target.value);
        if (speedSetting === 1) this.config.speed = GAME_SPEEDS.slow;
        else if (speedSetting === 2) this.config.speed = GAME_SPEEDS.medium;
        else if (speedSetting === 3) this.config.speed = GAME_SPEEDS.fast;
        this.config.saveToLocalStorage();
      });

      document.getElementById("special-food-toggle").addEventListener("change", (e) => {
        this.config.specialFoodEnabled = e.target.checked;
        this.food.specialFoodEnabled = e.target.checked;
        if (!e.target.checked) this.food.clearSpecialFood();
        this.config.saveToLocalStorage();
      });

      // Difficulty buttons
      document.querySelectorAll(".difficulty-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          // Remove active class from all buttons
          document
            .querySelectorAll(".difficulty-btn")
            .forEach((b) => b.classList.remove("active"));
          // Add active to clicked button
          e.target.classList.add("active");

          // Set speed based on difficulty
          const speed = e.target.dataset.speed;
          this.config.speed = GAME_SPEEDS[speed];
          this.config.saveToLocalStorage();
        });
      });

      // Handle window resize
      window.addEventListener("resize", () => {
        this.resizeCanvas();
        this.draw();
      });
    }

    /**
     * Resize canvas to fit container
     */
    resizeCanvas() {
      const container = this.canvas.parentElement;
      const size = Math.min(container.clientWidth, container.clientHeight);

      // Set canvas dimensions
      this.canvas.width = size;
      this.canvas.height = size;

      // Calculate grid (number of cells per side)
      this.cellSize = Math.floor(size / this.config.gridSize);
      this.gridCount = this.config.gridSize;

      this.canvasSize = this.cellSize * this.gridCount;
    }

    /**
     * Handle keyboard input
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyPress(event) {
      if (!this.gameActive) return;

      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          this.snake.changeDirection(DIRECTIONS.UP);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          this.snake.changeDirection(DIRECTIONS.DOWN);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          this.snake.changeDirection(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          this.snake.changeDirection(DIRECTIONS.RIGHT);
          break;
        case " ":
        case "Escape":
          this.pauseGame();
          break;
      }
    }

    /**
     * Start a new game
     */
    startGame() {
      // Hide screens
      this.startScreen.classList.add("hidden");
      this.gameOverScreen.classList.add("hidden");

      // Reset game state
      this.gameActive = true;
      this.score = 0;
      this.scoreElement.textContent = "0";

      // Reset snake and food
      this.snake.reset();
      this.food = new Food(this.gridCount, this.config.specialFoodEnabled);

      // Start game loop
      clearInterval(this.gameLoop);
      this.gameLoop = setInterval(this.update.bind(this), this.config.speed);

      // Apply settings
      this.updateSettingsUI();

      // Initial draw
      this.draw();
    }

    /**
     * Game over handler
     */
    gameOver() {
      // Stop game loop
      clearInterval(this.gameLoop);
      this.gameActive = false;

      // Check for high score
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem("snakeHighScore", this.highScore.toString());
        this.highScoreElement.textContent = this.highScore;
      }

      // Update game over screen
      this.finalScoreElement.textContent = this.score;
      this.finalHighScoreElement.textContent = this.highScore;
      this.gameOverScreen.classList.remove("hidden");
    }

    /**
     * Update game state
     */
    update() {
      // Move snake
      this.snake.move();

      // Check for collisions
      if (this.snake.checkCollision()) {
        this.gameOver();
        return;
      }

      // Check if snake eats food
      if (this.snake.isHeadAt(...this.food.regular)) {
        // Grow snake
        this.snake.grow();

        // Update score
        this.score += 1;
        this.scoreElement.textContent = this.score;

        // Generate new food
        this.food.update(this.snake.body);
      }

      // Check if snake eats special food
      if (this.food.special && this.snake.isHeadAt(...this.food.special)) {
        // Grow snake
        this.snake.grow();

        // Update score (special food is worth more)
        this.score += SPECIAL_FOOD.pointValue;
        this.scoreElement.textContent = this.score;

        // Remove special food
        this.food.clearSpecialFood();
      }

      // Draw updated state
      this.draw();
    }

    /**
     * Draw game on canvas
     */
    draw() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw grid if enabled
      if (this.config.gridLines) {
        this.drawGrid();
      }

      // Draw food
      this.drawFood();

      // Draw snake
      this.drawSnake();
    }

    /**
     * Draw grid lines
     */
    drawGrid() {
      this.ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue(
        "--grid-color"
      );
      this.ctx.lineWidth = 1;

      // Draw vertical lines
      for (let x = 0; x <= this.gridCount; x++) {
        this.ctx.beginPath();
        this.ctx.moveTo(x * this.cellSize, 0);
        this.ctx.lineTo(x * this.cellSize, this.canvasSize);
        this.ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y <= this.gridCount; y++) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y * this.cellSize);
        this.ctx.lineTo(this.canvasSize, y * this.cellSize);
        this.ctx.stroke();
      }
    }

    /**
     * Draw snake on canvas
     */
    drawSnake() {
      const snakeColor = getComputedStyle(document.body).getPropertyValue(
        "--snake-color"
      );
      const snakeBorder = getComputedStyle(document.body).getPropertyValue(
        "--snake-border"
      );

      // Draw each segment of the snake
      this.snake.body.forEach((segment, index) => {
        const [x, y] = segment;

        // Calculate padding for segments (to create rounded effect)
        const padding = index === 0 ? 1 : 2;

        // Draw segment
        this.ctx.fillStyle = snakeColor;
        this.ctx.fillRect(
          x * this.cellSize + padding,
          y * this.cellSize + padding,
          this.cellSize - padding * 2,
          this.cellSize - padding * 2
        );

        // Add border to segments
        this.ctx.strokeStyle = snakeBorder;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
          x * this.cellSize + padding,
          y * this.cellSize + padding,
          this.cellSize - padding * 2,
          this.cellSize - padding * 2
        );

        // Draw snake eyes on head
        if (index === 0) {
          this.drawSnakeEyes(x, y);
        }
      });
    }

    /**
     * Draw snake eyes on head segment
     * @param {number} x - X grid position of snake head
     * @param {number} y - Y grid position of snake head
     */
    drawSnakeEyes(x, y) {
      const eyeSize = this.cellSize / 5;
      let leftEyeX, leftEyeY, rightEyeX, rightEyeY;

      // Position eyes based on direction
      switch (this.snake.direction) {
        case DIRECTIONS.UP:
          leftEyeX = x * this.cellSize + this.cellSize / 3 - eyeSize / 2;
          leftEyeY = y * this.cellSize + this.cellSize / 3;
          rightEyeX = x * this.cellSize + (this.cellSize * 2) / 3 - eyeSize / 2;
          rightEyeY = y * this.cellSize + this.cellSize / 3;
          break;
        case DIRECTIONS.DOWN:
          leftEyeX = x * this.cellSize + this.cellSize / 3 - eyeSize / 2;
          leftEyeY = y * this.cellSize + (this.cellSize * 2) / 3 - eyeSize;
          rightEyeX = x * this.cellSize + (this.cellSize * 2) / 3 - eyeSize / 2;
          rightEyeY = y * this.cellSize + (this.cellSize * 2) / 3 - eyeSize;
          break;
        case DIRECTIONS.LEFT:
          leftEyeX = x * this.cellSize + this.cellSize / 3;
          leftEyeY = y * this.cellSize + this.cellSize / 3 - eyeSize / 2;
          rightEyeX = x * this.cellSize + this.cellSize / 3;
          rightEyeY = y * this.cellSize + (this.cellSize * 2) / 3 - eyeSize / 2;
          break;
        case DIRECTIONS.RIGHT:
          leftEyeX = x * this.cellSize + (this.cellSize * 2) / 3 - eyeSize;
          leftEyeY = y * this.cellSize + this.cellSize / 3 - eyeSize / 2;
          rightEyeX = x * this.cellSize + (this.cellSize * 2) / 3 - eyeSize;
          rightEyeY = y * this.cellSize + (this.cellSize * 2) / 3 - eyeSize / 2;
          break;
      }

      // Draw eyes
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
      this.ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
    }

    /**
     * Draw food on canvas
     */
    drawFood() {
      // Draw regular food
      const foodColor = getComputedStyle(document.body).getPropertyValue("--food-color");
      const foodBorder = getComputedStyle(document.body).getPropertyValue(
        "--food-border"
      );

      const [foodX, foodY] = this.food.regular;

      // Draw circular food
      this.ctx.fillStyle = foodColor;
      this.ctx.beginPath();
      this.ctx.arc(
        foodX * this.cellSize + this.cellSize / 2,
        foodY * this.cellSize + this.cellSize / 2,
        this.cellSize / 2 - 2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      // Add border
      this.ctx.strokeStyle = foodBorder;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Draw special food if available
      if (this.food.special) {
        const specialFoodColor = getComputedStyle(document.body).getPropertyValue(
          "--special-food"
        );
        const [specialX, specialY] = this.food.special;

        // Star shape for special food
        this.drawStar(
          specialX * this.cellSize + this.cellSize / 2,
          specialY * this.cellSize + this.cellSize / 2,
          5,
          this.cellSize / 2 - 3,
          this.cellSize / 4,
          specialFoodColor
        );
      }
    }

    /**
     * Draw a star shape for special food
     */
    drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      let step = Math.PI / spikes;

      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy - outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        this.ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        this.ctx.lineTo(x, y);
        rot += step;
      }

      this.ctx.lineTo(cx, cy - outerRadius);
      this.ctx.closePath();
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }

    /**
     * Pause the game
     */
    pauseGame() {
      if (!this.gameActive) return;

      if (this.gameLoop) {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        // Show pause overlay (could add this feature)
        return;
      }

      // Resume game
      this.gameLoop = setInterval(this.update.bind(this), this.config.speed);
    }

    /**
     * Toggle settings modal
     */
    toggleSettingsModal() {
      const modal = document.getElementById("settings-modal");
      modal.classList.toggle("show");
      modal.classList.toggle("hidden");

      if (modal.classList.contains("show")) {
        // Update UI to match current settings
        this.updateSettingsUI();

        // Pause game when settings are open
        if (this.gameActive) this.pauseGame();
      } else if (this.gameActive && !this.gameLoop) {
        // Resume game when settings are closed
        this.gameLoop = setInterval(this.update.bind(this), this.config.speed);
      }
    }

    /**
     * Toggle audio
     */
    toggleAudio() {
      this.config.soundEnabled = !this.config.soundEnabled;
      const audioButton = document.getElementById("audio-button");
      audioButton.innerHTML = this.config.soundEnabled
        ? '<i class="fas fa-volume-up"></i>'
        : '<i class="fas fa-volume-mute"></i>';
      this.config.saveToLocalStorage();
    }

    /**
     * Change theme
     */
    changeTheme(theme) {
      this.config.theme = theme;
      this.config.applyTheme();
      this.config.saveToLocalStorage();
      this.updateSettingsUI();
      this.draw();
    }

    /**
     * Update UI to match current settings
     */
    updateSettingsUI() {
      // Update theme buttons
      document.querySelectorAll(".theme-btn").forEach((btn) => {
        if (btn.dataset.theme === this.config.theme) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      // Update difficulty buttons
      document.querySelectorAll(".difficulty-btn").forEach((btn) => {
        const speed = GAME_SPEEDS[btn.dataset.speed];
        if (speed === this.config.speed) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      // Update toggles
      document.getElementById("grid-toggle").checked = this.config.gridLines;
      document.getElementById("special-food-toggle").checked =
        this.config.specialFoodEnabled;

      // Update speed slider
      let speedValue;
      if (this.config.speed === GAME_SPEEDS.slow) speedValue = 1;
      else if (this.config.speed === GAME_SPEEDS.medium) speedValue = 2;
      else speedValue = 3;
      document.getElementById("speed-slider").value = speedValue;

      // Update audio button
      const audioButton = document.getElementById("audio-button");
      audioButton.innerHTML = this.config.soundEnabled
        ? '<i class="fas fa-volume-up"></i>'
        : '<i class="fas fa-volume-mute"></i>';
    }
  }

  // Initialize game
  const game = new Game();
});
