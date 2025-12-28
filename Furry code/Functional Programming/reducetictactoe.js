const tictactoe = () => {
    const lines = [
        //Vertical
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        //Horizontal
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 1], [1, 2], [2, 2]],
        //Diagonal
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]]
    ];
};
let board = [
    ['X', 'O', 'X'],
    ['X', 'X', 'O'],
    ['X', 'X', 'O']
];
const win = lines.reduce((acc, curr) => {

}, board);