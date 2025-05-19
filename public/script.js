let currentGrid = [];

function renderGrid(grid) {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';

  const table = document.createElement('table');
  grid.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      if (cell === 1) td.classList.add('alive');
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  container.appendChild(table);
  currentGrid = grid;
}

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
