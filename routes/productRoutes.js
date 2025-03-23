const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    const { name, description, price, image_url } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)',
            [name, description, price, image_url]
        );
        res.status(201).json({ id: result.insertId, name, description, price, image_url });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;