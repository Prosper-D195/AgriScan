const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: String(process.env.DB_USER || 'postgres'),
    host: String(process.env.DB_HOST || 'localhost'),
    database: String(process.env.DB_NAME || 'agriscan_db'), 
    password: String(process.env.DB_PASSWORD || 'ProsperDosu70113'), 
    port: parseInt(process.env.DB_PORT || 5432, 10),
});

// Test de connexion immédiat au démarrage
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Erreur de connexion à PostgreSQL :', err.message);
    } else {
        console.log('🐘 Connexion à la base de données PostgreSQL réussie (L\'AIGLE ROYAL) !');
    }
});

module.exports = pool;