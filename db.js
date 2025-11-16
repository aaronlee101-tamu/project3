const dotenv = require('dotenv').config();
const { Pool } =  require('pg');

const pool = new Pool({
    user: "team_42",
    host: "csce-315-db.engr.tamu.edu",
    database: "team_42_db",
    password: "admin:password123",
    port: 5432,
    ssl: {rejectUnauthorized: false },
});

pool.connect()
    .then(client =>{
        console.log('Connected to PostgreSQL database');
        client.release();
    })
    .catch(err => console.error('Connection error', err.stack));


process.on('SIGINT', async () => {
    await pool.end();
    console.log('Database connection closed');
    process.exit(0);
});
module.exports = pool;