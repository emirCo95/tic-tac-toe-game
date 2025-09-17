const gameData = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let editedPlayer = 0;
let activePlayer = 0;
let currentRound = 1;
let gameIsOver = false;

const players = [
  {
    name: '',
    symbol: 'X',
  },
  {
    name: '',
    symbol: 'O',
  },
];

const playerConfigOverlayEl = document.getElementById('config-overlay');
const backdropEl = document.getElementById('backdrop');

const formElement = document.querySelector('form');

const editPlayer1BtnEl = document.getElementById('edit-player-1-btn');
const editPlayer2BtnEl = document.getElementById('edit-player-2-btn');

const cancelConfigBtnEl = document.getElementById('cancel-config-button');

const errorsOutputEl = document.getElementById('config-errors');

const startNewGameBtnEl = document.getElementById('start-game-btn');
const gameAreaEl = document.getElementById('active-game');

const gameFieldElements = document.querySelectorAll('#game-board li');
const activePlayerNameEl = document.getElementById('active-player-name');

const gameOverEl = document.getElementById('game-over');

function openPlayerConfig(event) {
  editedPlayer = +event.target.dataset.playerid;
  playerConfigOverlayEl.style.display = 'block';
  backdropEl.style.display = 'block';
}

function closePlayerConfig() {
  playerConfigOverlayEl.style.display = 'none';
  backdropEl.style.display = 'none';
  formElement.firstElementChild.classList.remove('error');
  errorsOutputEl.textContent = '';
  formElement.firstElementChild.lastElementChild.value = '';
}

function savePlayerConfig(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const enteredPlayerName = formData.get('name').trim();

  if (!enteredPlayerName) {
    event.target.firstElementChild.classList.add('error');
    errorsOutputEl.textContent = 'Please enter a valid name!';
    return;
  }

  const updatedPlayerDataEl = document.getElementById(
    `player-${editedPlayer}-id`
  );
  updatedPlayerDataEl.children[1].textContent = enteredPlayerName;

  players[editedPlayer - 1].name = enteredPlayerName;

  closePlayerConfig();
}

function resetGameStatus() {
  activePlayer = 0;
  currentRound = 1;
  gameIsOver = false;
  gameOverEl.firstElementChild.innerHTML =
    'You Won, <span id="winner-name">PLAYER NAME</span>';
  gameOverEl.style.display = 'none';

  let gameBoardIndex = 0;

  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      gameData[i][k] = 0;
      const gameBoardItemElement = gameBoardEl.children[gameBoardIndex];
      gameBoardEl.children[gameBoardIndex].textContent = '';
      gameBoardItemElement.classList.remove('disabled');
      gameBoardIndex++;
    }
  }
}

function startNewGame() {
  if (players[0].name === '' || players[1].name === '') {
    alert('Set names for both players!!');
    return;
  }

  resetGameStatus();

  activePlayerNameEl.textContent = players[activePlayer].name;
  gameAreaEl.style.display = 'block';
}

function switchPlayer() {
  if (activePlayer === 0) {
    activePlayer = 1;
  } else {
    activePlayer = 0;
  }
  activePlayerNameEl.textContent = players[activePlayer].name;
  gameAreaEl.style.display = 'block';
}

function selectGameField(event) {
  if (event.target.tagName !== 'LI' || gameIsOver) {
    return;
  }

  const selectedField = event.target;
  const selectedColumn = selectedField.dataset.col - 1;
  const selectedRow = selectedField.dataset.row - 1;

  if (gameData[selectedRow][selectedColumn] > 0) {
    alert('Please selected an empty field!!');
    return;
  }

  selectedField.textContent = players[activePlayer].symbol;
  selectedField.classList.add('disabled');

  gameData[selectedRow][selectedColumn] = activePlayer + 1;

  const winnerId = checkForGameOver();

  if (winnerId !== 0) {
    endGame(winnerId);
  }

  currentRound++;

  switchPlayer();
}

function checkForGameOver() {
  for (let i = 0; i < 3; i++) {
    if (
      gameData[i][0] > 0 &&
      gameData[i][0] === gameData[i][1] &&
      gameData[i][1] === gameData[i][2]
    ) {
      return gameData[i][0];
    }
  }
  for (let i = 0; i < 3; i++) {
    if (
      gameData[0][i] > 0 &&
      gameData[0][i] === gameData[1][i] &&
      gameData[0][i] === gameData[2][i]
    ) {
      return gameData[0][i];
    }
  }

  if (
    gameData[0][0] > 0 &&
    gameData[0][0] === gameData[1][1] &&
    gameData[1][1] === gameData[2][2]
  ) {
    return gameData[0][0];
  }
  if (
    gameData[2][0] > 0 &&
    gameData[2][0] === gameData[1][1] &&
    gameData[1][1] === gameData[0][2]
  ) {
    return gameData[2][0];
  }

  if (currentRound === 9) {
    return -1;
  }

  return 0;
}

function endGame(winnerId) {
  gameIsOver = true;
  gameOverEl.style.display = 'block';
  if (winnerId > 0) {
    const winnerName = players[winnerId - 1].name;
    gameOverEl.firstElementChild.firstElementChild.textContent = winnerName;
  } else {
    gameOverEl.firstElementChild.textContent = "It's a draw!";
  }
}

editPlayer1BtnEl.addEventListener('click', openPlayerConfig);
editPlayer2BtnEl.addEventListener('click', openPlayerConfig);

cancelConfigBtnEl.addEventListener('click', closePlayerConfig);
backdropEl.addEventListener('click', closePlayerConfig);

formElement.addEventListener('submit', savePlayerConfig);

startNewGameBtnEl.addEventListener('click', startNewGame);

for (const gameFieldElement of gameFieldElements) {
  gameFieldElement.addEventListener('click', selectGameField);
}
