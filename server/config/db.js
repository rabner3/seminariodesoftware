
const mysql = require('mysql2/promise'); // ¡Importante: /promise!
require('dotenv').config(); // Cargar variables de entorno

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'proyecto',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba  de conexión al iniciar
pool.getConnection()
    .then(connection => {
        console.log(' Database connection successful!');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection error:', err.message);
    });

module.exports = pool;