let currentGrid = [];
let interval = null;
let previousGrids = [];

let isDragging = false;
let dragValue = null;

function renderGrid(grid) {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';

    const table = document.createElement('table');
    grid.forEach((row, rIdx) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cIdx) => {
            const td = document.createElement('td');
            if (cell === 1) td.classList.add('alive');

            td.addEventListener('mousedown', (event) => {
                isDragging = true;
                dragValue = !currentGrid[rIdx][cIdx];
                currentGrid[rIdx][cIdx] = dragValue ? 1 : 0;
                renderGrid(currentGrid);
            });

            td.addEventListener('mouseover', () => {
                if (isDragging) {
                    currentGrid[rIdx][cIdx] = dragValue ? 1 : 0;
                    renderGrid(currentGrid);
                }
            });

            td.addEventListener('mouseup', () => {
                isDragging = false;
            });

            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    container.appendChild(table);
    currentGrid = grid;

    document.addEventListener('mouseup', () => {
    isDragging = false;
    });
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

function clearGrid() {
    const rows = currentGrid.length;
    const cols = currentGrid[0].length;

    currentGrid = Array.from({ length: rows }, () => Array(cols).fill(0));

    renderGrid(currentGrid);
}

function saveGridAsJson() {
    const id = prompt("Geben Sie eine ID für die Konfiguration ein (z.B. 'glider'):");
    if (!id) {
        alert("Eine ID ist erforderlich, um das JSON zu speichern.");
        return;
    }

    const type = prompt("Geben Sie den Typ ein ('form' oder 'game'):", "form");
    if (!type || (type !== "form" && type !== "game")) {
        alert("Der Typ muss entweder 'form' oder 'game' sein.");
        return;
    }

    const jsonData = {
        _id: id,
        type: type,
        grid: currentGrid
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${id}.json`;
    link.click();

    URL.revokeObjectURL(link.href);
    alert("Das JSON wurde erfolgreich erstellt und heruntergeladen.");
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
});