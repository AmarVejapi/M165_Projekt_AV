require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const COUCHDB_URL = process.env.COUCHDB_URL || 'http://localhost:5984';
const DB_NAME = process.env.DB_NAME;
const PRESETS_DIR = path.join(__dirname, 'presets');

async function loadPresets() {
  const files = fs.readdirSync(PRESETS_DIR).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(PRESETS_DIR, file), 'utf-8');
    const doc = JSON.parse(content);

    try {
      await axios.put(`${COUCHDB_URL}/${DB_NAME}/${doc._id}`, doc);
      console.log(`Preset "${doc._id}" hochgeladen.`);
    } catch (err) {
      console.error(`Fehler bei "${doc._id}":`, err.response?.data || err.message);
    }
  }
}

module.exports = { loadPresets };

