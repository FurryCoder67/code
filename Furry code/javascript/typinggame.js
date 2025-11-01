const words = ["apple", "banana", "grape", "orange", "kiwi", "mango", "blackberries", "pears", "cherry", "peach", "watermelon"];
let currentWord = "";
let time = 60;
let score = 0;
let timer;

const startButton = document.getElementById('start-button');
const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', focusInput);
wordInput.addEventListener('input', checkInput);

function setStuff(callback, interval) {
    const repeat = () => {
        callback();
        timer = setTimeout(repeat, interval);
    };
    timer = setTimeout(repeat, interval);
}

function clearStuff() {
    clearTimeout(timer);
}

function startGame() {
    startButton.disabled = true;
    time = 60;
    score = 0;
    wordInput.disabled = false;
    wordInput.focus();
    wordInput.value = "";
    updateScore();
    showNewWord();
    clearStuff();
    setStuff(updateTime, 1000);
}

function focusInput() {
    if (document.activeElement !== wordInput) {
        wordInput.focus();
    }
}

function showNewWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.innerText = currentWord;
    wordInput.value = "";
}

function checkInput() {
    if (wordInput.value.toLowerCase() === currentWord.toLowerCase()) {
        score++;
        showNewWord();
        updateScore();
    }
}

function updateScore() {
    scoreDisplay.innerText = score;
}

function updateTime() {
    time--;
    timeDisplay.innerText = time;
    if (time <= 0) {
        clearStuff();
        alert("Game Over! Your score is " + score);
        wordDisplay.innerText = "Ready?";
        wordInput.value = "";
        wordInput.disabled = true;
        startButton.disabled = false;
        return;
    }
}
