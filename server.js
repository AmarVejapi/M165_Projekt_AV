const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const Game = require('./game');
const db = require('./couchdb');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let game = new Game(10, 10);

app.post('/start', (req, res) => {
  const { rows, cols } = req.body;
  game = new Game(rows, cols);
  res.json({ grid: game.grid });
});

app.get('/next', (req, res) => {
  game.nextGeneration();
  res.json({ grid: game.grid });
});

app.post('/save', async (req, res) => {
  try {
    const result = await db.saveGame(game.grid);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/load', async (req, res) => {
  try {
    const grid = await db.loadGame();
    game.grid = grid;
    res.json({ grid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Game of Life Server läuft auf http://localhost:${port}`);
});
