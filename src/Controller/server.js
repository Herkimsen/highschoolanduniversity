import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

// Kütüphaneler
import express from 'express';
import sqlite3 from 'sqlite3';
import { fetchAll } from './sql.js'; // sql.js de ESM uyumlu olmalı (export kullanıyorsan)

// ESM uyumlu __dirname, __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5003;


app.listen(PORT, () => {
	console.log(`Server has started on port: ${PORT}`);
});

let clientSchoolSelection;

app.use(express.json());

// 1. Statik dosyalar
app.use(express.static(path.join(__dirname, '..', 'Model')));
app.use(express.static(path.join(__dirname, '..', 'View')));

// 2. Ana sayfa
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'View', 'SandBox.html'));
});

// 3. Favicon çözümü (isteğe bağlı)
app.get('/favicon.ico', (req, res) => res.status(204));



app.get('/api/highschools', async (req, res) => {
	const db = new sqlite3.Database("chinook.db");
	try {
		const result = await fetchAll(db,"SELECT DISTINCT school_name FROM highschools");
		res.json(result); // rows olacak mı?
	} catch (err) {
		console.error('Query error:', err);
		res.status(500).json({ error: 'Database query failed' });
	}finally {
			db.close();
		}
});



app.post('/api/sendHighSchool', async (req, res) => {
  console.log('We got your message:' + JSON.stringify(req.body, null, 2));
  const clientSchoolSelection = req.body.selectedSchoolName;
  console.log(`this is client selection: ${clientSchoolSelection}`);

  let db;

  try {
    db = new sqlite3.Database("chinook.db");

    const sql = `
      SELECT * FROM highschools
      WHERE school_name = ?
      ORDER BY university_name, name_of_field
    `;

    const products = await fetchAll(db, sql, [clientSchoolSelection]);

    res.send(products);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Database query failed' });
  } finally {
    if (db) db.close();
  }
});





