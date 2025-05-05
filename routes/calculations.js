const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Neue Berechnung speichern
router.post('/new', async (req, res) => {
    const { formula, parameters, result, unit } = req.body;
    const doc = { formula, parameters, result, unit, created_at: new Date() };

    try {
        const response = await db.insert(doc);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Alle Berechnungen abrufen
router.get('/all', async (req, res) => {
    try {
        const { rows } = await db.list({ include_docs: true });
        res.json(rows.map(row => row.doc));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
