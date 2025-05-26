let currentGrid = [];
let interval = null;
let previousGrids = [];

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
  currentGrid = grid;
}

async function initializeGrid() {
  const response = await fetch('/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows: 20, cols: 20 })
  });
  const data = await response.json();
  renderGrid(data.grid);
}

async function generateNextState() {
  previousGrids.push(currentGrid.map(row => [...row]));
  const response = await fetch('/next', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grid: currentGrid })
  });
  const data = await response.json();
  renderGrid(data.grid);
}

function toggleSimulation() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  } else {
    interval = setInterval(generateNextState, 300);
  }
}

async function saveGame() {
  await fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grid: currentGrid })
  });
  alert('Spiel gespeichert!');
}

async function loadGame() {
  const response = await fetch('/load');
  const data = await response.json();
  renderGrid(data.grid);
}

function revertToPreviousState() {
  if (previousGrids.length > 0) {
    const lastGrid = previousGrids.pop().map(row => [...row]);
    renderGrid(lastGrid);
  } else {
    alert("Kein vorheriger Zustand verfügbar!");
  }
}