const board = document.getElementById('board');
const status = document.getElementById('status');
const rows = 15;
const cols = 15;
let currentPlayer = 'X';
let gameBoard = Array(rows).fill(null).map(() => Array(cols).fill(''));

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
let currentPlayer = 'green';

const grid = document.createElement('div');
grid.style.display = 'grid';
grid.style.gridTemplateColumns = 'repeat(19, 1fr)';
grid.style.gridTemplateRows = 'repeat(19, 1fr)';
grid.style.gap = '1px';
grid.style.width = '500px';
grid.style.height = '500px';
grid.style.margin = 'auto';

document.body.appendChild(grid);

const board = Array(19).fill(null).map(() => Array(19).fill(null));

function checkWin(row, col, player) {
    const directions = [
        { dr: 0, dc: 1 }, 
        { dr: 1, dc: 0 },  
        { dr: 1, dc: 1 },  
        { dr: 1, dc: -1 }  
    ];

    for (let { dr, dc } of directions) {
        let count = 1;

        for (let step = 1; step < 5; step++) {
            const r = row + dr * step;
            const c = col + dc * step;
            if (r >= 0 && r < 19 && c >= 0 && c < 19 && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }

        for (let step = 1; step < 5; step++) {
            const r = row - dr * step;
            const c = col - dc * step;
            if (r >= 0 && r < 19 && c >= 0 && c < 19 && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) {
            return true;
        }
    }
    return false;
}

for (let i = 0; i < 19 * 19; i++) {
    const row = Math.floor(i / 19);
    const col = i % 19;

    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = i;
    cell.dataset.col = j;
    board.appendChild(cell);
  }
}

board.addEventListener('click', (e) => {
  const cell = e.target;
  const row = cell.dataset.row;
  const col = cell.dataset.col;

  if (!cell.classList.contains('cell') || cell.classList.contains('taken')) return;

  cell.textContent = currentPlayer;
  cell.classList.add('taken');
  gameBoard[row][col] = currentPlayer;

  if (checkWin(row, col, currentPlayer)) {
    status.textContent = `Player ${currentPlayer === 'X' ? 1 : 2} wins!`;
    board.style.pointerEvents = 'none';
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Player ${currentPlayer === 'X' ? 1 : 2}'s turn (${currentPlayer})`;
});

function checkWin(row, col, player) {
  row = parseInt(row);
  col = parseInt(col);

  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 }, 
    { dr: 1, dc: 1 }, 
    { dr: 1, dc: -1 } 
  ];

  for (const { dr, dc } of directions) {
    let count = 1;

    for (let step = 1; step < 5; step++) {
      const r = row + dr * step;
      const c = col + dc * step;
      if (r < 0 || r >= rows || c < 0 || c >= cols || gameBoard[r][c] !== player) break;
      count++;
    }

    for (let step = 1; step < 5; step++) {
      const r = row - dr * step;
      const c = col - dc * step;
      if (r < 0 || r >= rows || c < 0 || c >= cols || gameBoard[r][c] !== player) break;
      count++;
    }

    if (count >= 5) return true;
  }

  return false;
}

    cell.style.backgroundColor = '#f0f0f0';
    cell.style.border = '1px solid #ccc';

    cell.addEventListener('click', () => {
        if (!board[row][col]) {
            cell.style.backgroundColor = currentPlayer;
            board[row][col] = currentPlayer;

            if (checkWin(row, col, currentPlayer)) {
                alert(`${currentPlayer} wins!`);
                grid.style.pointerEvents = 'none';
            } else {
                currentPlayer = currentPlayer === 'green' ? 'red' : 'green';
            }
        }
    });

    grid.appendChild(cell);
}
