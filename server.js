require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

const Game = require('./game');
const db = require('./couchdb');
const { loadPresets } = require('./loadPresets');

const COUCHDB_URL = process.env.COUCHDB_URL || 'http://localhost:5984';
const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let game = new Game(10, 10);

loadPresets();

app.post('/start', (req, res) => {
  const { rows, cols } = req.body;
  game = new Game(rows, cols);
  res.json({ grid: game.grid });
});

app.post('/next', (req, res) => {
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

app.get('/games', async (req, res) => {
  try {
    const response = await axios.get(`${COUCHDB_URL}/${DB_NAME}/_all_docs?include_docs=true`);
    const games = response.data.rows.map(row => ({
      _id: row.id,
      createdAt: row.doc.createdAt,
      grid: row.doc.grid
    }));
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/games/:id', async (req, res) => {
  try {
    const response = await axios.get(`${COUCHDB_URL}/${DB_NAME}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/forms', async (req, res) => {
    try {
        const response = await axios.post(`${COUCHDB_URL}/${DB_NAME}/_find`, {
            selector: {
                type: "form"
            }
        });
        res.json(response.data.docs);
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Formen.' });
    }
});

app.listen(PORT, () => {
  console.log(`Game of Life Server läuft auf http://localhost:${PORT}`);
});
