const express = require('express');
const router = express.Router();
const pool = require('../db');

// Eintrag hinzufügen
router.post('/todos', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [text]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Einzelnen Eintrag löschen
router.delete('/todos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
    res.status(200).json({ message: 'Eintrag gelöscht' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alle Einträge löschen
router.delete('/todos', async (req, res) => {
  try {
    await pool.query('DELETE FROM todos');
    res.status(200).json({ message: 'Alle Einträge gelöscht' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
