const pool = require('./db');

async function testConnection() {
    try {
        // Test basic connection
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Database connection successful:', rows);

        // Check if users table exists and has data
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        console.log('Number of users in database:', users[0].count);

        // Show table structure
        const [tableInfo] = await pool.query('DESCRIBE users');
        console.log('Users table structure:', tableInfo);

    } catch (err) {
        console.error('Connection or query failed:', err);
    } finally {
        // Close the pool
        await pool.end();
    }
}

testConnection();