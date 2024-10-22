const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();


const dbPath = path.join(__dirname, process.env.DATABASE_PATH);

// Create a new database file
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables if they don't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        category INTEGER,
        amount REAL NOT NULL,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        description TEXT,
        FOREIGN KEY (category) REFERENCES categories (id)
    )`);
});

// Export the database connection
module.exports = db;
