const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();


const app = express();
const PORT = 3050;
const HOST = 'localhost';


const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res) => {
    res.send('Request received');
});

app.get('/liste_abrufen', async (req, res) => {  
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
});


app.post('/add', async (req, res) => {
    console.log('POST kommt an!');
    const result = await pool.query('INSERT INTO tasks (title) VALUES ($1)', [req.body.title]);
    console.log(result.rows)
    res.json(result.rows);
});

app.put('/update/:id', async (req, res) => {
    console.log('PUT kommt an!');
    const result = await pool.query('UPDATE tasks SET title = $1 WHERE id = $2', [req.body.title, req.params.id]);
    res.json(result.rows);
});
app.delete('/delete/:id', (req, res) => {
    console.log('DELETE kommt an!');
    const { id } = req.params;
    const result = pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json(result.rows);
});

app.listen(PORT, HOST, () => {
    console.log(`Server läuft auf http://${HOST}:${PORT}`);
});