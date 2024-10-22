const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
require('dotenv').config(); // Load environment variables from .env file

const app = express();
// Use the database path from the .env file
const dbPath = path.join(__dirname, process.env.DATABASE_PATH);

let db = null;

// Middleware to parse JSON request bodies
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    
    // Import routes after initializing the DB
    app.use("/api/expenses", require("./routes/routes.js"));

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server Running at http://localhost:${process.env.PORT || 3000}/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
