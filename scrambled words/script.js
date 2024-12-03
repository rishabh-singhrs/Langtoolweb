let score = 0;
let currentWord = '';
let currentSynonym = '';
let hintUsed = false;
let incorrectAttempts = 0;
const MAX_INCORRECT_ATTEMPTS = 3;

document.addEventListener('DOMContentLoaded', () => {
  // Fetch synonyms when the user submits the word
  document.getElementById('fetch-synonyms-btn').addEventListener('click', fetchSynonyms);

  // Check the guess when the user submits it
  document.getElementById('submit-btn').addEventListener('click', checkGuess);

  // Restart the game
  document.getElementById('restart-btn').addEventListener('click', restartGame);
});

// Function to fetch synonyms from the Datamuse API
function fetchSynonyms() {
  const word = document.getElementById('input-word').value.trim().toLowerCase();
  
  if (word === '') {
    alert('Please enter a word');
    return;
  }

  const url = `https://api.datamuse.com/words?rel_syn=${word}&max=10`; // Fetch synonyms
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        alert('No synonyms found for this word.');
        return;
      }

      // Pick a random synonym
      const synonym = data[Math.floor(Math.random() * data.length)].word;
      currentSynonym = synonym;

      // Scramble the synonym
      currentWord = scrambleWord(synonym);

      // Display the scrambled word
      document.getElementById('scrambled-word').textContent = `Scrambled word: ${currentWord}`;
      document.getElementById('message').textContent = '';
      document.getElementById('hint').textContent = '';
      hintUsed = false;
    })
    .catch(err => console.log('Error fetching synonyms:', err));
}

// Function to scramble the letters of a word
function scrambleWord(word) {
  const wordArray = word.split('');
  for (let i = wordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]]; // Swap elements
  }
  return wordArray.join('');
}

// Function to check the player's guess
function checkGuess() {
  const guess = document.getElementById('guess').value.trim().toLowerCase();
  const message = document.getElementById('message');
  const scoreElement = document.getElementById('score');

  if (guess === currentSynonym) {
    score++;  // Increment score for correct guess
    message.textContent = 'Correct! Well done.';
    message.classList.add('correct');
    message.classList.remove('incorrect');
    incorrectAttempts = 0; // Reset incorrect attempts on success

    fetchSynonyms();  // Fetch a new synonym and scramble it
  } else {
    incorrectAttempts++;
    message.textContent = `Incorrect, try again! Attempts left: ${MAX_INCORRECT_ATTEMPTS - incorrectAttempts}`;
    message.classList.add('incorrect');
    message.classList.remove('correct');
    
    if (incorrectAttempts >= MAX_INCORRECT_ATTEMPTS) {
      endGame();
    }
  }

  // Update the score display
  scoreElement.textContent = score;
  document.getElementById('guess').value = '';  // Clear the input field
}

// Show hint if user is stuck
function showHint() {
  if (hintUsed) return;

  const hint = `The first letter is "${currentSynonym[0]}"`;
  document.getElementById('hint').textContent = hint;
  hintUsed = true;
}

// End the game when the player exceeds incorrect attempts
function endGame() {
  document.getElementById('message').textContent = 'Game Over! You made too many incorrect attempts.';
  document.getElementById('message').classList.add('incorrect');
  document.getElementById('restart-btn').classList.remove('hidden');
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('fetch-synonyms-btn').disabled = true;
}

// Restart the game
function restartGame() {
  score = 0;
  incorrectAttempts = 0;
  document.getElementById('score').textContent = score;
  document.getElementById('message').textContent = '';
  document.getElementById('hint').textContent = '';
  document.getElementById('restart-btn').classList.add('hidden');
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('fetch-synonyms-btn').disabled = false;
  document.getElementById('input-word').value = '';
  document.getElementById('guess').value = '';
}
function goHome() {
  window.history.back();
}
