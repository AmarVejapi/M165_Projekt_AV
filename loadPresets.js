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

        doc.type = "form";

        try {
            const existingDoc = await axios.get(`${COUCHDB_URL}/${DB_NAME}/${doc._id}`);
            doc._rev = existingDoc.data._rev;
            await axios.put(`${COUCHDB_URL}/${DB_NAME}/${doc._id}`, doc);
            console.log(`Preset "${doc._id}" aktualisiert.`);
        } catch (err) {
            if (err.response?.status === 404) {
                await axios.put(`${COUCHDB_URL}/${DB_NAME}/${doc._id}`, doc);
                console.log(`Preset "${doc._id}" erstellt.`);
            } else {
                console.error(`Fehler bei "${doc._id}":`, err.response?.data || err.message);
            }
        }
    }
}

module.exports = { loadPresets };