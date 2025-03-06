const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();

//TODO: Verbinde eine Datenbank dazu

const db = new sqlite3.Database('./tasks.db');

app.use(bodyParser.json());     // Middleware


db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN DEFAULT 0)');


//TODO: Schreibe requests/responses


app.get('/', (req, res) => {
    res.send('request received');
});

app.get('/ralf', (req, res) => {
    res.send('vielen Dank Ralf');
});


//wenn ein neues item hinzugefügt werden soll, soll nodejs diesen request entgegennehmen
app.post('/add', (req, res) => {
    db.run('INSERT INTO tasks (title) VALUES (?)', [req.body.title], function () {
        res.json({tag: "Mittwoch", bald_wirds: "Mittagspause"});
    });
});


//Liste mir alle existierenden tasks auf
// hier sollte nur alle items als json zurückgegeben werden
app.get('/liste_abrufen', (req, res) => {
    db.all('SELECT * FROM tasks', function(err, rows){
        res.json(rows);
    });
});



app.listen(3050, "localhost", () => {
    console.log("bald wird es Mittagspause")
});