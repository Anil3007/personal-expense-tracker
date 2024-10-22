const express = require("express");
const router = express.Router();
const db = require("../db"); // Import the database connection

// Mock authentication middleware (replace with real authentication)
const authenticateUser = (req, res, next) => {

    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).send("Unauthorized: User not authenticated");
    }
    req.userId = userId; // Store user ID for later use
    next();
};

// Middleware to validate transaction inputs
const validateTransactionInput = (req, res, next) => {
    const { type, category, amount } = req.body;
    if (!type || !['income', 'expense'].includes(type)) {
        return res.status(400).send("Invalid transaction type");
    }
    if (!category || typeof category !== 'number') {
        return res.status(400).send("Invalid category ID");
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).send("Invalid amount");
    }
    next();
};

// POST /transactions: Adds a new transaction
router.post("/transactions", authenticateUser, validateTransactionInput, async (req, res) => {
    const { type, category, amount, description } = req.body;
    try {
        const result = await db.run(
            `INSERT INTO transactions (type, category, amount, description) VALUES (?, ?, ?, ?)`,
            [type, category, amount, description]
        );
        console.log(result,"..............jjj......")
        res.status(201).json({ id: result.lastID, type, category, amount, description });
    } catch (error) {
        res.status(500).send("Error adding transaction");
    }
});

// GET /transactions: Retrieves all transactions
router.get("/get/transactions", authenticateUser, async (req, res) => {
    try {
        const transactions = await db.all("SELECT * FROM transactions;");
        res.json(transactions);
    } catch (error) {
        res.status(500).send("Error retrieving transactions");
    }
});

// GET /transactions/:id: Retrieves a transaction by ID
router.get("/transactions/:id", authenticateUser, async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await db.get("SELECT * FROM transactions WHERE id = ?", [id]);
        if (transaction) {
            res.json(transaction);
        } else {
            res.status(404).send("Transaction not found");
        }
    } catch (error) {
        res.status(500).send("Error retrieving transaction");
    }
});

// PUT /transactions/:id: Updates a transaction by ID
router.put("/transactions/:id", authenticateUser, validateTransactionInput, async (req, res) => {
    const { id } = req.params;
    const { type, category, amount, description } = req.body;
    try {
        const result = await db.run(
            `UPDATE transactions SET type = ?, category = ?, amount = ?, description = ? WHERE id = ?`,
            [type, category, amount, description, id]
        );
        if (result.changes === 0) {
            return res.status(404).send(`Transaction with ID ${id} not found`);
        }
        res.json({ id, type, category, amount, description });
    } catch (error) {
        res.status(400).send("Error updating transaction");
    }
});

// DELETE /transactions/:id: Deletes a transaction by ID
router.delete("/transactions/:id", authenticateUser, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.run(`DELETE FROM transactions WHERE id = ?`, [id]);
        if (result.changes === 0) {
            return res.status(404).send(`Transaction with ID ${id} not found`);
        }
        res.status(204).send(`Transaction id:${id} is successfully deleted`);
    } catch (error) {
        res.status(500).send("Error deleting transaction");
    }
});

// GET /summary: Retrieves a summary of transactions
router.get("/summary", authenticateUser, async (req, res) => {
    try {
        const summary = await db.get(`
            SELECT
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpenses,
                SUM(amount) AS balance
            FROM transactions
        `);
        res.json(summary);
    } catch (error) {
        res.status(500).send("Error retrieving summary");
    }
});

module.exports = router;
