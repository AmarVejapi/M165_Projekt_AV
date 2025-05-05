const express = require('express');
const path = require('path');
const calculationsRoute = require('./routes/calculations');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/calculations', calculationsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
