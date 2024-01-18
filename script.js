// PREPARATION

// Select the elements that we need to interact with from the HTML file
const grid = document.querySelector('.grid');
const stackBtn = document.querySelector('.stack');
const scoreCounter = document.querySelector('.score-counter');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainBtn = document.querySelector('.play-again');

// Create our game grid matrix
// 0 - empty cell
// 1 - bar-segment
const gridMatrix = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0], // This is our starting currentRowIndex
];

// These are our variables to keep track of the game values as we play
let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let isGameOver = false;
let score = 0;

function draw() {
  // First, make sure we always reset the display when we call this function
  grid.innerHTML = '';

  gridMatrix.forEach(function(rowContent) {
    rowContent.forEach(function(cellContent) {
      // Create a cell
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (cellContent === 1) {
        cell.classList.add('bar');
      }

      grid.appendChild(cell);
    });
  });
}

// Game Logic and Controls
function endGame(isVictory) {
  if (isVictory) {
    endGameText.innerHTML = 'YOU<br>WON!'
    endGameScreen.classList.add('win');
  }

  endGameScreen.classList.remove('hidden');
}

function checkWin() {
  // We win if we get to the top of the grid
  if (currentRowIndex === 0) {
    isGameOver = true;
    clearInterval(gameInterval);
    endGame(true);
  }
}

function checkLost() {
  const currentRow = gridMatrix[currentRowIndex];
  const prevRow = gridMatrix[currentRowIndex + 1];

  if (!prevRow) return;

  // Check whether there is at least one accumulated stack
  // element under each bar
  for (let i = 0; i < currentRow.length; i++) {
    // If there is no accumulated stack below a bar element
    // remove the 1 bar piece for both the current stack
    // and for the new bar in the next loop
    if (currentRow[i] === 1 && prevRow[i] === 0) {
      currentRow[i] = 0;
      barSize--;
    }

    if (barSize === 0) {
      isGameOver = true;
      clearInterval(gameInterval);
      endGame(false);
    }
  }
}

function updateScore() {
  // score = score + barSize
  score += barSize;
  scoreCounter.innerText = score.toString().padStart(5, 0);
}

function onStack() {
  checkWin();
  checkLost();
  updateScore();

  if (isGameOver) return;

  currentRowIndex--;
  barDirection = 'right';

  for (let i = 0; i < barSize; i++) {
    gridMatrix[currentRowIndex][i] = 1;
  }

  draw();
}

function moveRight(currentRow) {
  // [1, 1, 1, 0, 0, 0]
  currentRow.pop(); // [1, 1, 1, 0, 0]
  currentRow.unshift(0); // [0, 1, 1, 1, 0, 0]
}

function moveLeft(currentRow) {
  currentRow.shift(); // [0, 0, 1, 1, 1]
  currentRow.push(0); // [0, 0, 1, 1, 1, 0]
}

function moveBar() {
  const currentRow = gridMatrix[currentRowIndex];

  if (barDirection === 'right') {
    moveRight(currentRow);

    const lastElement = currentRow[currentRow.length - 1];
    if (lastElement === 1) {
      barDirection = 'left';
    }
  }
  else if (barDirection === 'left') {
    moveLeft(currentRow);

    const firstElement = currentRow[0];

    if (firstElement === 1) {
      barDirection = 'right';
    }
  }
}

// Initial draw on first page load.
draw();

// These are our "move bar" function
function main() {
  moveBar();
  draw();
}

function onPlayAgain() {
  location.reload();
}

//Events
stackBtn.addEventListener('click', onStack);
playAgainBtn.addEventListener('click', onPlayAgain);
const gameInterval = setInterval(main, 600);



// equality (1 == 1)
// strict equality - compares the value AND the data type (1 === 1)
// so strict equality (===) only returns true if the 2 sides of the comparator are same value and same data type (both 1 and both int for instance)
