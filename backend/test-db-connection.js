// Quick script to test database connection
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'civic-events-db',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

console.log('Testing database connection...');
console.log('User:', process.env.DB_USER || 'postgres');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('Database:', process.env.DB_NAME || 'civic-events-db');
console.log('Port:', process.env.DB_PORT || 5432);
console.log('Password:', process.env.DB_PASS ? '***set***' : 'NOT SET');

pool.connect()
    .then(client => {
        console.log('\n✅ SUCCESS: Connected to PostgreSQL!');
        client.release();
        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ ERROR: Failed to connect to PostgreSQL');
        console.error('Error:', err.message);
        console.error('\nTo fix this:');
        console.error('1. Open backend/.env file');
        console.error('2. Update DB_PASS with your PostgreSQL password');
        console.error('3. Make sure the database "civic-events-db" exists');
        console.error('4. Run this script again: node test-db-connection.js');
        process.exit(1);
    });

