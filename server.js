import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// TODO 1
app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// TODO 2
app.get('/api/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM guestbook ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// TODO 3
app.post('/api/messages', async (req, res) => {
    try {
        const { name, message } = req.body;
        const result = await pool.query(
            'INSERT INTO guestbook (name, message) VALUES ($1, $2) RETURNING *',
            [name, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});