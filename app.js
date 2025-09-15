let editedPlayer = 0;

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

editPlayer1BtnEl.addEventListener('click', openPlayerConfig);
editPlayer2BtnEl.addEventListener('click', openPlayerConfig);

cancelConfigBtnEl.addEventListener('click', closePlayerConfig);
backdropEl.addEventListener('click', closePlayerConfig);

formElement.addEventListener('submit', savePlayerConfig);
