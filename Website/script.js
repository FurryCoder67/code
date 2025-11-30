/* script.js
   Single-file logic for navigation and game implementations:
   - Tic Tac Toe (minimax AI)
   - Connect-4 (random + simple heuristic AI)
   - Rock-Paper-Scissors (fast)
*/

// --- Navigation ---
document.querySelectorAll('.card').forEach(c => c.addEventListener('click', () => {
    const t = c.dataset.target;
    showView(t);
}));
document.getElementById('homeBtn').addEventListener('click', () => showView('gallery'));
document.getElementById('randomMatchBtn').addEventListener('click', () => {
    showView('tic');
    // start a quick AI vs AI Tic-Tac-Toe match
    const modeSelect = document.getElementById('tic-mode');
    modeSelect.value = 'cvc';
    // restart TicTacToe view (tic module handles startup)
    document.getElementById('tic-restart').click();
});

// "Back" links
document.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => showView('gallery')));

function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

/* ---------------------------
   TIC TAC TOE
   --------------------------- */
(function ticTacToe() {
    const boardEl = document.getElementById('tic-board');
    const statusEl = document.getElementById('tic-status');
    const restartBtn = document.getElementById('tic-restart');
    const modeSelect = document.getElementById('tic-mode');

    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let board, currentPlayer, mode;
    restartBtn.addEventListener('click', init);
    modeSelect.addEventListener('change', init);

    function init() {
        mode = modeSelect.value;
        board = Array(9).fill(null);
        currentPlayer = 'X';
        render();
        statusEl.textContent = `Turn: ${currentPlayer}`;
        // if computer vs computer, kick off AI
        if (mode === 'cvc') setTimeout(playComputerTurn, 300);
        // if pvc and AI starts, would be handled by mode selection (we keep X as player)
    }

    function render() {
        boardEl.innerHTML = '';
        board.forEach((cell, i) => {
            const el = document.createElement('div');
            el.className = 'cell' + ((cell || isTerminal(board)) ? ' disabled' : '');
            el.textContent = cell || '';
            el.addEventListener('click', () => onCellClick(i));
            boardEl.appendChild(el);
        });
    }

    function onCellClick(i) {
        if (board[i] || isTerminal(board)) return;
        if (mode === 'pvc' && currentPlayer === 'O') return; // player is X
        makeMove(i);
    }

    function makeMove(i) {
        if (board[i]) return;
        board[i] = currentPlayer;
        render();
        const term = isTerminal(board);
        if (term) {
            statusEl.textContent = term.winner === 'draw' ? 'Draw' : `Winner: ${term.winner}`;
            return;
        }
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        statusEl.textContent = `Turn: ${currentPlayer}`;
        if (mode === 'cvc') {
            setTimeout(playComputerTurn, 300);
        } else if (mode === 'pvc' && currentPlayer === 'O') {
            setTimeout(playComputerTurn, 200);
        }
    }

    function isTerminal(b) {
        for (const line of winningLines) {
            const [a, b1, c] = line;
            if (b[a] && b[a] === b[b1] && b[a] === b[c]) return { winner: b[a], line };
        }
        if (b.every(Boolean)) return { winner: 'draw' };
        return null;
    }

    // MINIMAX AI (unbeatable for small game)
    function playComputerTurn() {
        const best = minimax(board.slice(), currentPlayer);
        // If best.index is undefined, pick first empty
        const idx = (best && best.index !== undefined) ? best.index : board.findIndex(x => !x);
        if (idx === -1) return;
        board[idx] = currentPlayer;
        render();
        const term = isTerminal(board);
        if (term) {
            statusEl.textContent = term.winner === 'draw' ? 'Draw' : `Winner: ${term.winner}`;
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusEl.textContent = `Turn: ${currentPlayer}`;
        if (mode === 'cvc') setTimeout(playComputerTurn, 350);
    }

    function minimax(pos, player) {
        const term = isTerminal(pos);
        if (term) {
            if (term.winner === 'draw') return { score: 0 };
            return { score: term.winner === 'X' ? 10 : -10 };
        }

        const moves = [];
        pos.forEach((p, idx) => { if (!p) moves.push(idx); });

        const isMax = player === 'X';
        let best = isMax ? { score: -Infinity } : { score: Infinity };

        for (const idx of moves) {
            pos[idx] = player;
            const result = minimax(pos, player === 'X' ? 'O' : 'X');
            pos[idx] = null;
            const score = result.score;
            if (isMax) {
                if (score > best.score) best = { score, index: idx };
            } else {
                if (score < best.score) best = { score, index: idx };
            }
        }

        if (best.index === undefined && moves.length) best.index = moves[0];
        return best;
    }

    // initialize tic tac toe on load
    init();
})();

/* ---------------------------
   ROCK PAPER SCISSORS
   --------------------------- */
(function rps() {
    const playBtn = document.getElementById('rps-play');
    const resetBtn = document.getElementById('rps-reset');
    const youEl = document.getElementById('rps-you');
    const aiEl = document.getElementById('rps-ai');
    const resEl = document.getElementById('rps-result');
    const scoreEl = document.getElementById('rps-score');

    let score = { you: 0, ai: 0 };
    const choices = ['✊', '✋', '✌️'];

    function aiPick() { return choices[Math.floor(Math.random() * choices.length)]; }

    function outcome(a, b) { // a = you, b = ai
        if (a === b) return 'draw';
        if (a === '✊' && b === '✌️') return 'win';
        if (a === '✌️' && b === '✋') return 'win';
        if (a === '✋' && b === '✊') return 'win';
        return 'lose';
    }

    playBtn.addEventListener('click', () => {
        // simple quick UI: random choice for user too (replace with choice buttons if you want)
        const you = choices[Math.floor(Math.random() * choices.length)];
        const ai = aiPick();
        youEl.textContent = you;
        aiEl.textContent = ai;
        const o = outcome(you, ai);
        if (o === 'win') { resEl.textContent = 'You win!'; score.you++; }
        else if (o === 'lose') { resEl.textContent = 'You lose'; score.ai++; }
        else { resEl.textContent = 'Draw'; }
        scoreEl.textContent = `You ${score.you} — ${score.ai} AI`;
    });

    resetBtn.addEventListener('click', () => {
        score = { you: 0, ai: 0 };
        youEl.textContent = '—'; aiEl.textContent = '—';
        resEl.textContent = 'Click Play'; scoreEl.textContent = 'You 0 — 0 AI';
    });
})();

/* ---------------------------
   CONNECT 4
   --------------------------- */
(function connect4() {
    const COLS = 7, ROWS = 6;
    const boardEl = document.getElementById('connect-board');
    const statusEl = document.getElementById('connect-status');
    const restartBtn = document.getElementById('connect-restart');
    const levelSelect = document.getElementById('connect-level');

    let board, currentPlayer;

    restartBtn.addEventListener('click', init);
    levelSelect.addEventListener('change', init);

    function init() {
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
        currentPlayer = 'R'; // R = Red (human), Y = Yellow (AI)
        render();
        statusEl.textContent = `Turn: ${currentPlayer === 'R' ? 'Red' : 'Yellow'}`;
    }

    function render() {
        boardEl.innerHTML = '';
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const slot = document.createElement('div');
                slot.className = 'cf-slot';
                const d = document.createElement('div');
                d.className = 'disc ' + (board[r][c] ? board[r][c] : 'empty');
                slot.appendChild(d);
                // clicking any slot drops in that column
                slot.addEventListener('click', () => onColClick(c));
                boardEl.appendChild(slot);
            }
        }
    }

    function onColClick(c) {
        if (isTerminal(board)) return;
        const r = findDropRow(c);
        if (r === -1) return; // full
        board[r][c] = currentPlayer;
        render();
        const term = isTerminal(board);
        if (term) {
            statusEl.textContent = term.winner === 'draw' ? 'Draw' : `Winner: ${term.winner}`;
            return;
        }
        currentPlayer = currentPlayer === 'R' ? 'Y' : 'R';
        statusEl.textContent = `Turn: ${currentPlayer === 'R' ? 'Red' : 'Yellow'}`;
        if (currentPlayer === 'Y') setTimeout(aiMove, 260);
    }

    function aiMove() {
        const level = levelSelect.value;
        if (level === 'random') {
            // choose a random non-full column
            const cols = [];
            for (let c = 0; c < COLS; c++) if (board[0][c] === null) cols.push(c);
            const col = cols[Math.floor(Math.random() * cols.length)];
            if (col === undefined) return;
            const r = findDropRow(col);
            board[r][col] = 'Y';
        } else {
            // EASY heuristic:
            // 1) if AI can win in one, play it
            // 2) if opponent can win in one, block it
            // 3) else prefer center columns
            let played = false;
            // try to win
            for (let c = 0; c < COLS && !played; c++) {
                const r = findDropRow(c);
                if (r === -1) continue;
                board[r][c] = 'Y';
                if (checkWin(board, 'Y')) { played = true; break; }
                board[r][c] = null;
            }
            // try to block
            if (!played) {
                for (let c = 0; c < COLS && !played; c++) {
                    const r = findDropRow(c);
                    if (r === -1) continue;
                    board[r][c] = 'R';
                    if (checkWin(board, 'R')) {
                        board[r][c] = 'Y'; played = true; break;
                    }
                    board[r][c] = null;
                }
            }
            // center preference
            if (!played) {
                const pref = [3, 2, 4, 1, 5, 0, 6];
                for (const c of pref) {
                    const r = findDropRow(c);
                    if (r !== -1) { board[r][c] = 'Y'; played = true; break; }
                }
            }
        }
        render();
        const term = isTerminal(board);
        if (term) {
            statusEl.textContent = term.winner === 'draw' ? 'Draw' : `Winner: ${term.winner}`;
            return;
        }
        currentPlayer = 'R';
        statusEl.textContent = `Turn: Red`;
    }

    function findDropRow(c) {
        for (let r = ROWS - 1; r >= 0; r--) if (!board[r][c]) return r;
        return -1;
    }

    function isTerminal(b) {
        // returns {winner: 'Red'|'Yellow'|'draw'} or null
        const W = 4;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const p = b[r][c];
                if (!p) continue;
                // horiz
                if (c + W - 1 < COLS) {
                    let ok = true;
                    for (let k = 0; k < W; k++) if (b[r][c + k] !== p) { ok = false; break; }
                    if (ok) return { winner: p === 'R' ? 'Red' : 'Yellow' };
                }
                // vert
                if (r + W - 1 < ROWS) {
                    let ok = true;
                    for (let k = 0; k < W; k++) if (b[r + k][c] !== p) { ok = false; break; }
                    if (ok) return { winner: p === 'R' ? 'Red' : 'Yellow' };
                }
                // diag down-right
                if (r + W - 1 < ROWS && c + W - 1 < COLS) {
                    let ok = true;
                    for (let k = 0; k < W; k++) if (b[r + k][c + k] !== p) { ok = false; break; }
                    if (ok) return { winner: p === 'R' ? 'Red' : 'Yellow' };
                }
                // diag up-right
                if (r - (W - 1) >= 0 && c + W - 1 < COLS) {
                    let ok = true;
                    for (let k = 0; k < W; k++) if (b[r - k][c + k] !== p) { ok = false; break; }
                    if (ok) return { winner: p === 'R' ? 'Red' : 'Yellow' };
                }
            }
        }
        // draw?
        if (b[0].every(v => v !== null)) return { winner: 'draw' };
        return null;
    }

    function checkWin(b, playerSymbol) {
        const W = 4;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (b[r][c] !== playerSymbol) continue;
                if (c + 3 < COLS) {
                    let ok = true;
                    for (let k = 1; k <= 3; k++) if (b[r][c + k] !== playerSymbol) { ok = false; break; }
                    if (ok) return true;
                }
                if (r + 3 < ROWS) {
                    let ok = true;
                    for (let k = 1; k <= 3; k++) if (b[r + k][c] !== playerSymbol) { ok = false; break; }
                    if (ok) return true;
                }
                if (r + 3 < ROWS && c + 3 < COLS) {
                    let ok = true;
                    for (let k = 1; k <= 3; k++) if (b[r + k][c + k] !== playerSymbol) { ok = false; break; }
                    if (ok) return true;
                }
                if (r - 3 >= 0 && c + 3 < COLS) {
                    let ok = true;
                    for (let k = 1; k <= 3; k++) if (b[r - k][c + k] !== playerSymbol) { ok = false; break; }
                    if (ok) return true;
                }
            }
        }
        return false;
    }

    // initialize on load
    init();
})();
