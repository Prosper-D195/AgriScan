const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 

// ==========================================
// 1. ROUTE : Récupérer une image aléatoire
// ==========================================
router.get('/random-orchard', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, image_url, nom_culture FROM diagnostics ORDER BY RANDOM() LIMIT 1');
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Aucune image de diagnostic disponible en base de données." });
        }

        const selectedData = result.rows[0];

        res.json({ 
            id: selectedData.id,
            url: selectedData.image_url,
            culture: selectedData.nom_culture
        });
    } catch (error) {
        console.error("Erreur base de données :", error);
        res.status(500).json({ error: "Impossible de charger l'image depuis la base de données." });
    }
});

// ==========================================
// 2. ROUTE : Valider le diagnostic de l'utilisateur
// ==========================================
router.post('/validate', async (req, res) => {
    const { anomalieId, x, y } = req.body;

    // 🛡️ Sécurité : Vérifier que toutes les données requises sont reçues
    if (anomalieId === undefined || x === undefined || y === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: "Données de diagnostic incomplètes (ID ou coordonnées manquantes)." 
        });
    }
    
    try {
        // Recherche du diagnostic cible par son ID unique
        const result = await pool.query(
            'SELECT * FROM diagnostics WHERE id = $1 LIMIT 1', 
            [anomalieId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Diagnostic introuvable en base de données." });
        }

        const diagnostic = result.rows[0];

        // 💡 Sécurisation des calculs : Conversion explicite en nombres décimaux
        const userX = parseFloat(x);
        const userY = parseFloat(y);
        const minX = parseFloat(diagnostic.x_min);
        const maxX = parseFloat(diagnostic.x_max);
        const minY = parseFloat(diagnostic.y_min);
        const maxY = parseFloat(diagnostic.y_max);

        // Vérification stricte : le clic est-il dans la bounding box ?
        const xValide = (userX >= minX && userX <= maxX);
        const yValide = (userY >= minY && userY <= maxY);

        if (xValide && yValide) {
            res.json({ 
                success: true, 
                message: `Excellent diagnostic ! Il s'agit bien de : ${diagnostic.nom_culture}.` 
            });
        } else {
            res.json({ 
                success: false, 
                message: "Zone incorrecte. Regardez plus attentivement les symptômes sur la culture." 
            });
        }

    } catch (error) {
        console.error("Erreur lors de la validation SQL :", error);
        res.status(500).json({ error: "Erreur serveur lors de la vérification." });
    }
});

module.exports = router;