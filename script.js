/* ===== Wordle Clone – Final Version with Retry Button ===== */

/* ---- Local word list ---- */
const WORDS = [
  "plant", "grape", "shine", "crane", "globe",
  "flame", "crown", "track", "spine", "brick"
];

/* ---- DOM Elements ---- */
const board     = document.getElementById("game-board");
const message   = document.getElementById("message");
const retryBtn  = document.getElementById("retry-btn");

/* ---- Game State Variables ---- */
let WORD, currentRow, currentGuess, isGameOver;

/* ---- Pick a random word ---- */
function newSecretWord() {
  WORD = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
  console.log("Secret word:", WORD); // Optional: helpful during testing
}

/* ---- Start or Restart the Game ---- */
function resetGame() {
  board.innerHTML = "";
  message.textContent = "";
  retryBtn.style.display = "none";

  currentRow = 0;
  currentGuess = "";
  isGameOver = false;

  newSecretWord();
  createBoard();
}

/* ---- Create 6x5 Tile Grid ---- */
function createBoard() {
  for (let r = 0; r < 6; r++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

/* ---- Show Message ---- */
function show(msg) {
  message.textContent = msg;
}

/* ---- Update Tile Letters ---- */
function updateTiles() {
  const tiles = board.children[currentRow].children;
  [...tiles].forEach((tile, i) => {
    tile.textContent = currentGuess[i] ?? "";
  });
}

/* ---- Apply Color to Tiles ---- */
function colorTile(tile, state) {
  tile.classList.add(state); // "correct", "present", "absent"
  tile.style.borderColor = "transparent";
}

/* ---- Check User's Guess ---- */
function checkGuess() {
  const tiles = board.children[currentRow].children;

  [...currentGuess].forEach((ch, i) => {
    if (ch === WORD[i]) {
      colorTile(tiles[i], "correct");
    } else if (WORD.includes(ch)) {
      colorTile(tiles[i], "present");
    } else {
      colorTile(tiles[i], "absent");
    }
  });

  if (currentGuess === WORD) {
    endGame("🎉 You guessed it!");
  } else if (++currentRow === 6) {
    endGame(`❌ Word was: ${WORD}`);
  } else {
    currentGuess = "";
  }
}

/* ---- End the Game ---- */
function endGame(msg) {
  isGameOver = true;
  show(msg);
  retryBtn.style.display = "inline-block";
}

/* ---- Handle Key Presses ---- */
document.addEventListener("keydown", (e) => {
  if (isGameOver) return;

  const key = e.key.toUpperCase();

  if (key === "ENTER") {
    if (currentGuess.length !== 5) return show("Not enough letters");
    checkGuess();
  } else if (key === "BACKSPACE") {
    currentGuess = currentGuess.slice(0, -1);
    updateTiles();
  } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
    currentGuess += key;
    updateTiles();
  }
});

/* ---- Retry Button ---- */
retryBtn.addEventListener("click", resetGame);

/* ---- Start the Game on Load ---- */
resetGame();



