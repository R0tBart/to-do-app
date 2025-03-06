const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//TODO: Verbinde eine Datenbank dazu

const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
console.log('Connected to database');
db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN DEFAULT 0)', (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Table created successfully');
            }
        });

        app.use(bodyParser.json());     // Middleware
        app.use(cors());                // Middleware



        //TODO: Schreibe requests/responses

        app.get('/', (req, res) => {
            res.send('request received');
        });

        app.get('/ralf', (req, res) => {
            db.run('INSERT INTO tasks (title) VALUES (?)', [req.body.title], function (err) {
                if (err) {
                    res.status(500).json({error: err.message});
                    return;
                }
                res.json({tag: "Mittwoch", bald_wirds: "Mittagspause"});
            });
        });

        //wenn ein neues item hinzugefügt werden soll, soll nodejs diesen request entgegennehmen
        app.post('/add', (req, res) => {
            db.run('INSERT INTO tasks (title) VALUES (?)', [req.body.title], function () {
                res.json({tag: "Mittwoch", bald_wirds: "Mittagspause"});
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

        app.listen(3050, "localhost", () => {
            console.log("bald wird es Mittagspause geben");
        });
    }
});