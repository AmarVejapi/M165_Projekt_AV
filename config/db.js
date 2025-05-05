const Nano = require('nano');
require('dotenv').config();

const couch = Nano(process.env.COUCHDB_URL);
const db = couch.db.use('calculations'); // Datenbankname

module.exports = db;
