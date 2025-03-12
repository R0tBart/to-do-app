const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//TODO: Verbinde eine Datenbank dazu

const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        console.error('Fehler bei der Datenbankverbindung:', err);
    } else {
console.log('Datenbank erfolgreich verbunden');

db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN DEFAULT 0)', (err) => {
            if (err) {
                console.error('Fehler beim erstellen:', err.message);
            } else {
                console.log('Datenbanktabelle erfolgreich erstellt');
            }
        });

        app.use(bodyParser.json());     // Middleware
        app.use(cors());                // Middleware



        //TODO: Schreibe requests/responses

        app.get('/', (req, res) => {
            res.send('request received');
        });


        //wenn ein neues item hinzugefügt werden soll, soll nodejs diesen request entgegennehmen
        app.post('/add', (req, res) => {
            db.run('INSERT INTO tasks (title) VALUES (?)', [req.body.title], function () {
                res.json({ id: this.lastID, title: req.body.title, completed: 0});
            });
        });

        app.get('/liste_abrufen', (req, res) => {
            db.all('SELECT * FROM tasks', function(err, rows){
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(rows);
            });
        });


        app.delete('/delete/:id', (req, res) => {
            db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ message: 'Task gelöscht' });
            });
        }
        );

        app.listen(3050, "localhost", () => {
            console.log("Server läuft auf http://localhost:3050");
        });
    }
});