const words = ["plant", "grape", "shine", "crane", "globe", "flame", "crown", "track", "spine", "brick"];
const WORD = words[Math.floor(Math.random() * words.length)].toUpperCase();
let currentRow = 0;
let currentGuess = "";
let isGameOver = false;

const board = document.getElementById("game-board");
const message = document.getElementById("message");

function createBoard() {
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 5; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

document.addEventListener("keydown", (e) => {
  if (isGameOver) return;
  const key = e.key.toUpperCase();

  if (key === "ENTER") {
    if (currentGuess.length < 5) {
      showMessage("Not enough letters");
      return;
    }
    checkGuess();
  } else if (key === "BACKSPACE") {
    currentGuess = currentGuess.slice(0, -1);
    updateTiles();
  } else if (/^[A-Z]$/.test(key)) {
    if (currentGuess.length < 5) {
      currentGuess += key;
      updateTiles();
    }
  }
});

function updateTiles() {
  const rowTiles = board.children[currentRow].children;
  for (let i = 0; i < 5; i++) {
    rowTiles[i].textContent = currentGuess[i] || "";
  }
}

function checkGuess() {
  const rowTiles = board.children[currentRow].children;
  const guess = currentGuess;
  let feedback = "";

  for (let i = 0; i < 5; i++) {
    const tile = rowTiles[i];
    const letter = guess[i];
    if (letter === WORD[i]) {
      tile.classList.add("correct");
      feedback += "🟩";
    } else if (WORD.includes(letter)) {
      tile.classList.add("present");
      feedback += "🟨";
    } else {
      tile.classList.add("absent");
      feedback += "⬛";
    }
  }

  if (guess === WORD) {
    showMessage("🎉 You guessed it!");
    isGameOver = true;
    showShare(feedback);
  } else {
    currentRow++;
    currentGuess = "";
    if (currentRow === 6) {
      showMessage(`❌ Game Over! Word was: ${WORD}`);
      isGameOver = true;
      showShare(feedback);
    }
  }
}

function showMessage(msg) {
  message.textContent = msg;
}

function showShare(feedback) {
  setTimeout(() => {
    const text = `Wordle Clone\n${feedback}`;
    navigator.clipboard.writeText(text);
    showMessage("Result copied to clipboard! 📋");
  }, 1000);
}

createBoard();
