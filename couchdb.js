const axios = require('axios');

require('dotenv').config();
const COUCHDB_URL = process.env.COUCHDB_URL;
const DB_NAME = 'gameoflife';
const DOC_ID = 'latest_game';

async function saveGame(grid) {
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
