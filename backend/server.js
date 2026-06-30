const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Permet de lire le format JSON envoyé par le frontend

// Route de test de base
app.get('/', (req, res) => {
    res.send('Serveur AgriScan - L\'AIGLE ROYAL opérationnel !');
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port http://localhost:${PORT}`);
});