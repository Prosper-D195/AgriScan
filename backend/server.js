const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Permet de lire le format JSON envoyé par le frontend

// 💡  On indique à Express d'aller chercher le dossier public qui est dans le frontend
app.use('/', express.static(path.join(__dirname, '../')));

// 🚀 Importation et liaison des routes de l'API
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); // Toutes les routes de api.js seront préfixées par /api

// Route de test de base
app.get('/', (req, res) => {
    res.send('Serveur AgriScan - L\'AIGLE ROYAL opérationnel !');
});

const cheminImages = path.join(__dirname, '../frontend/public');
console.log("📂 L'AIGLE ROYAL cherche le dossier public ici :", cheminImages);

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port http://localhost:${PORT}`);
});