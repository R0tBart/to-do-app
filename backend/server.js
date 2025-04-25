// Benötigte Module werden importiert.
// Express wird verwendet, um den Server zu erstellen und zu verwalten.
// Body-Parser wird verwendet, um JSON-Daten zu verarbeiten.
// CORS wird verwendet, um die Verbindung zwischen dem Frontend und dem Backend zu aktivieren.
// Pool wird verwendet, um die Datenbankverbindung zu teilen und zu verwalten.
// Die .env-Datei wird verwendet, um die Datenbankverbindung zu speichern.

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Der Server wird erstellt und auf dem Port 3050 gestartet.
// Der Server wird auf Anfragen warten und die Anfragen verarbeiten.
const app = express();
// const PORT = 3050;
// const HOST = 'localhost';

// Datenbankverbindung, die in .env-Datei definiert ist mit postgresql.
// Die Datenbankverbindung wird in einer Pool-Instanz gespeichert.
// Die Pool-Instanz wird verwendet, um die Datenbankverbindung zu teilen und zu verwalten.

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware, um JSON-Daten zu verarbeiten und CORS zu aktivieren 
app.use(bodyParser.json());
app.use(cors());

// Startseite
app.get('/', async (req, res) => {
    res.send('Request received');
});

// Liste abrufen und senden an den Client sowie in der Konsole anzeigen zu lassen 
app.get('/liste_abrufen', async (req, res) => {  
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
});

// Task hinzufügen und senden an den Client sowie in der Konsole anzeigen zu lassen
app.post('/add', async (req, res) => {
    console.log('POST kommt an!');
    const result = await pool.query('INSERT INTO tasks (title) VALUES ($1) RETURNING *', [req.body.title]);
    res.json(result.rows[0]);
});

// Tasks aktualisieren und senden an den Client sowie in der Konsole anzeigen zu lassen
// PUT-Methode wird verwendet, um eine Ressource zu aktualisieren oder zu ersetzen.
// In diesem Fall wird die Ressource, die aktualisiert wird, durch die ID identifiziert.
app.put('/update/:id', async (req, res) => {
    console.log('PUT kommt an!');
    const result = await pool.query('UPDATE tasks SET title = $1 WHERE id = $2', [req.body.title, req.params.id]);
    res.json(result.rows);
});

// Task löschen und senden an den Client sowie in der Konsole anzeigen zu lassen
// DELETE-Methode wird verwendet, um eine Ressource zu löschen.
app.delete('/delete/:id', async (req, res) => {
    console.log('DELETE kommt an!');
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json(result.rows);
});


// Server starten und auf Anfragen warten 
// Der Server wird auf dem Port 3050 gestartet und auf Anfragen gewartet.
// Wenn der Server gestartet wird, wird eine Nachricht in der Konsole ausgegeben.
app.listen(3050, "0.0.0.0", () => {
    console.log(`Server läuft!`);
});

module.exports = app;
// Exportiert die App, damit sie in den Tests verwendet werden kann.