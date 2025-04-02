const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

//login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Username does not exist' });
        }

        const user = users[0];
        const validPassword = (password === user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Password is incorrect' });
        }

        res.json({
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                address: user.address,
            },
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get user profile by ID
router.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const [users] = await pool.query(
            'SELECT full_name, address FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(users[0]);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update fullname and address by user ID
router.put('/profile/:id', async (req, res) => {
    const userId = req.params.id; 
    const { full_name, address } = req.body; 

    try {
        
        if (!full_name || !address) {
            return res.status(400).json({ error: 'Fullname and address are required.' });
        }

        const [result] = await pool.query(
            'UPDATE users SET full_name = ?, address = ? WHERE user_id = ?',
            [full_name, address, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ message: 'Profile updated successfully.' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Register new user and create a cart
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        await pool.query('START TRANSACTION');

        const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (existingUsers.length > 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Username already exists' });
        }

        const [userResult] = await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );

        const userId = userResult.insertId;

        await pool.query(
            'INSERT INTO carts (user_id) VALUES (?)',
            [userId]
        );

        await pool.query('COMMIT');

        res.status(201).json({
            message: 'Tài khoản đã được  tạo thành công!',
            user_id: userId
        });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
