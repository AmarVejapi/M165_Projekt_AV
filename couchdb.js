const axios = require('axios');

// Konfiguration für CouchDB
const COUCHDB_URL = 'http://127.0.0.1:5984';
const DB_NAME = 'gameoflife';
const DOC_ID = 'latest_game';

async function saveGame(grid) {
  // Vorheriges Dokument holen (falls vorhanden), um _rev zu bekommen
  let existing = {};
  try {
    const res = await axios.get(`${COUCHDB_URL}/${DB_NAME}/${DOC_ID}`);
    existing = res.data;
  } catch (err) {
    if (err.response && err.response.status !== 404) {
      throw err;
    }
  }

  const newDoc = {
    _id: DOC_ID,
    _rev: existing._rev,
    grid,
    updatedAt: new Date().toISOString()
  };

  const response = await axios.put(`${COUCHDB_URL}/${DB_NAME}/${DOC_ID}`, newDoc);
  return response.data;
}

async function loadGame() {
  const response = await axios.get(`${COUCHDB_URL}/${DB_NAME}/${DOC_ID}`);
  return response.data.grid;
}

module.exports = {
  saveGame,
  loadGame
};
