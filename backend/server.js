const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3050;
const HOST = 'localhost';

const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        return console.error('Fehler bei der Datenbankverbindung:', err);
    }
    console.log('Datenbank erfolgreich verbunden');

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT, 
        completed BOOLEAN DEFAULT 0
    )`, (err) => {
        if (err) {
            return console.error('Fehler beim Erstellen:', err.message);
        }
        console.log('Datenbanktabelle erfolgreich erstellt');
    });
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Request received');
});

app.post('/add', (req, res) => {
    const { title } = req.body;
    db.run('INSERT INTO tasks (title) VALUES (?)', [title], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, title, completed: 0 });
    });
});

app.get('/liste_abrufen', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Task gelöscht' });
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server läuft auf http://${HOST}:${PORT}`);
});