const express = require("express");
const router = express.Router();

// Mock authentication middleware
const authenticateUser = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({
            Status: "Error",
            Msg: "Unauthorized: User not authenticated"
        });
    }
    next();
};

// Middleware to validate transaction inputs
const validateTransactionInput = (req, res, next) => {
    const { type, category, amount } = req.body;
    if (!type || !['income', 'expense'].includes(type)) {
        return res.status(400).json({
            Status: "Error",
            Msg: "Invalid transaction type"
        });
    }
    if (!category || typeof category !== 'number') {
        return res.status(400).json({
            Status: "Error",
            Msg: "Invalid category ID"
        });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
            Status: "Error",
            Msg: "Invalid amount"
        });
    }
    next();
};

const routes = (db) => {

    // Adds a new transaction
    router.post("/transactions", authenticateUser, validateTransactionInput, async (req, res) => {
        const { type, category, amount, description } = req.body;
        try {
            const result = await db.run(
                `INSERT INTO transactions (type, category, amount, description) VALUES (?, ?, ?, ?)`,
                [type, category, amount, description]
            );
            res.status(201).json({
                Status: "Success",
                Msg: "Transaction successfully added",
                Data: { id: result.lastID, type, category, amount, description }
            });
        } catch (error) {
            res.status(500).json({
                Status: "Error",
                Msg: "Error adding transaction"
            });
        }
    });

    // Retrieves all transactions
    router.get("/transactions", async (req, res) => {
        try {
            const transactions = await db.all("SELECT * FROM transactions");
            res.json({
                Status: "Success",
                Msg: "Successfully fetched transactions",
                Data: transactions
            });
        } catch (error) {
            res.status(500).json({
                Status: "Error",
                Msg: "Error retrieving transactions"
            });
        }
    });

    // Retrieves a transaction by ID
    router.get("/transactions/:id", authenticateUser, async (req, res) => {
        const { id } = req.params;
        try {
            const transaction = await db.get("SELECT * FROM transactions WHERE id = ?", [id]);
            if (transaction) {
                res.json({
                    Status: "Success",
                    Msg: "Successfully fetched transaction",
                    Data: transaction
                });
            } else {
                res.status(404).json({
                    Status: "Error",
                    Msg: "Transaction not found"
                });
            }
        } catch (error) {
            res.status(500).json({
                Status: "Error",
                Msg: "Error retrieving transaction"
            });
        }
    });

    // Updates a transaction by ID
    router.put("/transactions/:id", authenticateUser, validateTransactionInput, async (req, res) => {
        const { id } = req.params;
        const { type, category, amount, description } = req.body;
        try {
            const result = await db.run(
                `UPDATE transactions SET type = ?, category = ?, amount = ?, description = ? WHERE id = ?`,
                [type, category, amount, description, id]
            );
            if (result.changes === 0) {
                return res.status(404).json({
                    Status: "Error",
                    Msg: `Transaction with ID ${id} not found`
                });
            }
            res.json({
                Status: "Success",
                Msg: "Transaction successfully updated",
                Data: { id, type, category, amount, description }
            });
        } catch (error) {
            res.status(400).json({
                Status: "Error",
                Msg: "Error updating transaction"
            });
        }
    });

    // Deletes a transaction by ID
    router.delete("/transactions/:id", authenticateUser, async (req, res) => {
        const { id } = req.params;
        try {
            const result = await db.run(`DELETE FROM transactions WHERE id = ?`, [id]);
            if (result.changes === 0) {
                return res.status(404).json({
                    Status: "Error",
                    Msg: `Transaction with ID ${id} not found`
                });
            }
            res.status(204).json({
                Status: "Success",
                Msg: `Transaction id:${id} successfully deleted`
            });
        } catch (error) {
            res.status(500).json({
                Status: "Error",
                Msg: "Error deleting transaction"
            });
        }
    });

    // Retrieves a summary of transactions
    router.get("/summary", authenticateUser, async (req, res) => {
        try {
            const summary = await db.get(`
                SELECT
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpenses,
                    SUM(amount) AS balance
                FROM transactions
            `);
            res.json({
                Status: "Success",
                Msg: "Successfully fetched summary",
                Data: summary
            });
        } catch (error) {
            res.status(500).json({
                Status: "Error",
                Msg: "Error retrieving summary"
            });
        }
    });

    return router;
};

module.exports = routes;
