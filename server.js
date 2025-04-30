const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const { error } = require('console');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'game_user',
    password: '(Chickenrun45)',
    database: 'game_scores',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
    connection.release(); // Release the connection back to the pool
});

// Connect to MySQL
/* 
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});
*/

// Create table if not exists
db.query(`
    CREATE TABLE IF NOT EXISTS scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        score INT NOT NULL,
        time INT NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) throw err;
    console.log('Scores table is ready');
});

// API endpoints
app.post('/api/scores', (req, res) => {
    const { name, score, time, message } = req.body;
    const query = 'INSERT INTO scores (name, score, time, message) VALUES (?, ?, ?, ?)';
    db.query(query, [name, score, time, message || null], (err, result) => {
        if (err) return res.status(500).json({ error: err.message});
        res.status(201).json({ id: result.insertId });
    });
});

app.get('/api/scores/:time', (req, res) => {
    const time = req.params.time;
    const query = 'SELECT name, score, message FROM scores WHERE time = ? ORDER BY score DESC LIMIT 10';
    db.query(query, [time], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/howTo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'howTo.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});