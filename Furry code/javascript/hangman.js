const words = ["apple", "banana", "grape", "orange", "kiwi", "mango", "blackberries", "pears", "cherry", "peach", "watermelon"];
let currentWord = "";
function showNewWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    
}
function startGame() {
    startButton.disabled = true;
    wordInput.disabled = false;
    wordInput.focus();
    showNewWord()
    wordInput.value = "";

}