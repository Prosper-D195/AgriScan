const { Pool } = require('pg');
require('dotenv').config();

// Configuration du pool de connexion en utilisant les variables d'environnement
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Test de connexion immédiat au démarrage
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Erreur de connexion à PostgreSQL :', err.stack);
    } else {
        console.log('🐘 Connexion à la base de données PostgreSQL réussie (L\'AIGLE ROYAL) !');
    }
});

module.exports = pool;