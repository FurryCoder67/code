const boardSize = 10;
const mineCount = 20;

let board = [];
let revealedCount = 0;

function createBoard() {
  const boardElement = document.getElementById("game-board");
  boardElement.innerHTML = "";

  board = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill({ mine: false, revealed: false, flagged: false }));

  placeMines();

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cellElement = document.createElement("div");
      cellElement.className = "cell";
      cellElement.dataset.row = i;
      cellElement.dataset.col = j;

      cellElement.addEventListener("click", handleLeftClick);
      cellElement.addEventListener("contextmenu", handleRightClick);

      boardElement.appendChild(cellElement);
    }
  }
}

function placeMines() {
  let minesPlaced = 0;

  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);

    if (!board[row][col].mine) {
      board[row][col].mine = true;
      minesPlaced++;
    }
  }
}

function handleLeftClick(e) {
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  if (board[row][col].flagged || board[row][col].revealed) return;

  revealCell(row, col);
}

function handleRightClick(e) {
  e.preventDefault();
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  if (board[row][col].revealed) return;

  board[row][col].flagged = !board[row][col].flagged;

  e.target.classList.toggle("flagged", board[row][col].flagged);
}

function revealCell(row, col) {
  if (row < 0 || col < 0 || row >= boardSize || col >= boardSize) return;
  if (board[row][col].revealed || board[row][col].flagged) return;

  board[row][col].revealed = true;
  revealedCount++;

  const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cellElement.classList.add("revealed");

  if (board[row][col].mine) {
    cellElement.classList.add("mine");
    alert("Game over!");
    createBoard();
  } else {
    const adjacentMines = countAdjacentMines(row, col);
    cellElement.textContent = adjacentMines > 0 ? adjacentMines : "";
    if (adjacentMines === 0) {
      revealNeighbors(row, col);
    }
  }

  if (revealedCount === boardSize * boardSize - mineCount) {
    alert("You win!");
    createBoard();
  }
}

function countAdjacentMines(row, col) {
  let count = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;

      if (newRow >= 0 && newCol >= 0 && newRow < boardSize && newCol < boardSize) {
        if (board[newRow][newCol].mine) count++;
      }
    }
  }

  return count;
}

function revealNeighbors(row, col) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      revealCell(row + i, col + j);
    }
  }
}

createBoard();