let currentGrid = [];

function renderGrid(grid) {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';

  const table = document.createElement('table');
  grid.forEach((row, rIdx) => {
    const tr = document.createElement('tr');
    row.forEach((cell, cIdx) => {
      const td = document.createElement('td');
      if (cell === 1) td.classList.add('alive');
      td.addEventListener('click', () => {
        currentGrid[rIdx][cIdx] = currentGrid[rIdx][cIdx] ? 0 : 1;
        renderGrid(currentGrid);
      });
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  container.appendChild(table);
}

async function showAllGames() {
  const response = await fetch('/games');
  const games = await response.json();

  const container = document.getElementById('grid-container');
  container.innerHTML = '<h2>Alle gespeicherten Spielfelder:</h2>';

  const gameList = document.createElement('ul');
  games.forEach(game => {
    const li = document.createElement('li');
    li.textContent = `ID: ${game._id}, Erstellt: ${game.createdAt}`;
    li.addEventListener('click', () => showGameDetails(game._id));
    gameList.appendChild(li);
  });

  container.appendChild(gameList);
}

async function showGameDetails(id) {
  const response = await fetch(`/games/${id}`);
  const game = await response.json();

  const container = document.getElementById('grid-container');
  container.innerHTML = '<h2>Details des Spielfelds</h2>';

  const details = document.createElement('div');
  details.innerHTML = `
    <p><b>ID:</b> ${game._id}</p>
    <p><b>Erstellt:</b> ${game.createdAt}</p>
    <p><b>Aktualisiert:</b> ${game.updatedAt || 'Noch nie'}</p>
  `;
  container.appendChild(details);

  renderGrid(game.grid);

  const editButton = document.createElement('button');
  editButton.textContent = 'Bearbeiten';
  editButton.addEventListener('click', () => editGame(id, game.grid));
  container.appendChild(editButton);
}

async function editGame(id, grid) {
  const newGrid = grid.map(row => row.map(cell => (cell === 1 ? 0 : 1)));
  await fetch(`/games/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grid: newGrid })
  });
  alert(`Spielfeld mit ID ${id} wurde bearbeitet.`);
  showGameDetails(id);
}

async function addNewGame() {
  const id = prompt('Gebe eine ID für das neue Spielfeld an:');
  if (!id) return;

  const grid = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => Math.round(Math.random())));
  await fetch('/games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, grid })
  });
  alert(`Neuer Datensatz mit ID ${id} wurde hinzugefügt.`);
  showAllGames();
}

document.getElementById('show-all-games').addEventListener('click', showAllGames);
document.getElementById('add-new-game').addEventListener('click', addNewGame);
async function start() {
  const response = await fetch('/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows: 10, cols: 10 })
  });
  const data = await response.json();
  renderGrid(data.grid);
}

async function next() {
  const response = await fetch('/next');
  const data = await response.json();
  renderGrid(data.grid);
}

async function save() {
  await fetch('/save', { method: 'POST' });
  alert('Spiel gespeichert!');
}

async function load() {
  const response = await fetch('/load');
  const data = await response.json();
  renderGrid(data.grid);
}

let interval = null;

function toggleRun() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  } else {
    interval = setInterval(next, 300);
  }
}

function renderGrid(grid) {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';

  const table = document.createElement('table');
  grid.forEach((row, rIdx) => {
    const tr = document.createElement('tr');
    row.forEach((cell, cIdx) => {
      const td = document.createElement('td');
      if (cell === 1) td.classList.add('alive');
      td.addEventListener('click', () => {
        currentGrid[rIdx][cIdx] = currentGrid[rIdx][cIdx] ? 0 : 1;
        renderGrid(currentGrid);
      });
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  container.appendChild(table);
}