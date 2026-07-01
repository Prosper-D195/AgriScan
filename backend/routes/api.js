const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 

// 1. Route pour récupérer une image aléatoire depuis PostgreSQL
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

// 2. Route POST pour valider les coordonnées du clic de l'utilisateur via l'ID
router.post('/validate', async (req, res) => {
    const { anomalieId, x, y } = req.body; // anomalieId doit être l'ID de la ligne (ex: 1)
    
    try {
        // 🔥 Correction : On cherche par ID unique plutôt que par le texte de l'anomalie
        const result = await pool.query(
            'SELECT * FROM diagnostics WHERE id = $1 LIMIT 1', 
            [anomalieId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Diagnostic introuvable en base de données." });
        }

        const diagnostic = result.rows[0];

        // Vérification : le clic est-il dans les bornes Min et Max ?
        const xValide = (x >= parseFloat(diagnostic.x_min) && x <= parseFloat(diagnostic.x_max));
        const yValide = (y >= parseFloat(diagnostic.y_min) && y <= parseFloat(diagnostic.y_max));

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