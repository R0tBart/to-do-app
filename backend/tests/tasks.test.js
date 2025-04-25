const request = require('supertest');
const app = require('../server'); // Express-App exportieren
const { Pool } = require('pg');
require('dotenv').config();

// Neue Pool-Verbindung für Testzwecke
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

beforeAll(async () => {
  // Tabelle aufräumen
  await pool.query('DELETE FROM tasks');
});

afterAll(async () => {
  await pool.end();
});

describe('Tasks API', () => {
  let taskId;

  test('POST /add – Task hinzufügen', async () => {
    const res = await request(app)
      .post('/add')
      .send({ title: 'Test Task' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test Task');
    taskId = res.body.id;
  });

  test('GET /liste_abrufen – Tasks abrufen', async () => {
    const res = await request(app).get('/liste_abrufen');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(task => task.id === taskId)).toBe(true);
  });

  test('PUT /update/:id – Task aktualisieren', async () => {
    const res = await request(app)
      .put(`/update/${taskId}`)
      .send({ title: 'Geänderter Task' });

    expect(res.statusCode).toBe(200);
  });

  test('DELETE /delete/:id – Task löschen', async () => {
    const res = await request(app).delete(`/delete/${taskId}`);
    expect(res.statusCode).toBe(200);
  });
});
