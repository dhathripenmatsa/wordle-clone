const WORDS = [
  "plant", "grape", "shine", "crane", "globe",
  "flame", "crown", "track", "spine", "brick"
];

/* ---- 2. DOM Elements ---- */
const board    = document.getElementById("game-board");
const message  = document.getElementById("message");
const retryBtn = document.getElementById("retry-btn");
const kbArea   = document.getElementById("keyboard");   // on‑screen keyboard container

/* ---- 3. Game‑state Variables ---- */
let WORD, currentRow, currentGuess, isGameOver;

/* -------------------------------------------------------- */
/*                 GAME INITIALISATION                      */
/* -------------------------------------------------------- */
function newSecretWord() {
  WORD = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
  console.log("Secret word:", WORD);              // dev helper
}

function resetGame() {
  /* clear UI */
  board.innerHTML  = "";
  kbArea.innerHTML = "";
  message.textContent = "";
  retryBtn.style.display = "none";

  /* reset state */
  currentRow   = 0;
  currentGuess = "";
  isGameOver   = false;

  newSecretWord();
  createBoard();
  createKeyboard();
}

/* -------------------------------------------------------- */
/*                   UI BUILD HELPERS                       */
/* -------------------------------------------------------- */
function createBoard() {
  for (let r = 0; r < 6; r++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function createKeyboard() {
  const rows = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM←↵"
  ];

  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";

    row.split("").forEach(key => {
      const btn = document.createElement("button");
      btn.textContent = key;
      btn.className = "key";
      btn.addEventListener("click", () => handleKey(key));
      rowDiv.appendChild(btn);
    });

    keyboard.appendChild(rowDiv);
  });
}


function show(msg) { message.textContent = msg; }

function updateTiles() {
  const tiles = board.children[currentRow].children;
  [...tiles].forEach((t, i) => { t.textContent = currentGuess[i] ?? ""; });
}

function colorTile(tile, state) {
  tile.classList.add(state);           // correct | present | absent
  tile.style.borderColor = "transparent";
}

/* -------------------------------------------------------- */
/*                    CORE GAME LOGIC                       */
/* -------------------------------------------------------- */
function handleKey(key) {
  if (isGameOver) return;

  if (key === "ENTER" || key === "↵") {
    if (currentGuess.length !== 5) return show("Not enough letters");
    checkGuess();
  } else if (key === "BACKSPACE" || key === "←") {
    currentGuess = currentGuess.slice(0, -1);
    updateTiles();
  } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
    currentGuess += key;
    updateTiles();
  }
}

function checkGuess() {
  const tiles = board.children[currentRow].children;

  [...currentGuess].forEach((ch, i) => {
    if (ch === WORD[i])         colorTile(tiles[i], "correct");
    else if (WORD.includes(ch)) colorTile(tiles[i], "present");
    else                        colorTile(tiles[i], "absent");
  });

  if (currentGuess === WORD)       endGame("🎉 You guessed it!");
  else if (++currentRow === 6)     endGame(`❌ Word was: ${WORD}`);
  else currentGuess = "";
}

function endGame(msg) {
  isGameOver = true;
  show(msg);
  retryBtn.style.display = "inline-block";
}

/* -------------------------------------------------------- */
/*                   EVENT LISTENERS                        */
/* -------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  if (isGameOver) return;
  handleKey(e.key.toUpperCase());
});

retryBtn.addEventListener("click", resetGame);

/* -------------------------------------------------------- */
/*                        BOOT UP                           */
/* -------------------------------------------------------- */
resetGame();





