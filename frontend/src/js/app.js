// Sélection des éléments du DOM
const imageWrapper = document.getElementById('imageWrapper');
const targetImage = document.getElementById('targetImage');
const targetBox = document.getElementById('targetBox');
const selectionMenu = document.getElementById('selectionMenu');
const btnValider = document.getElementById('btnValider');

// Variables globales pour stocker l'image active et les coordonnées du clic
let currentImageId = null;
let lastClickXPercent = 0;
let lastClickYPercent = 0;

// 🚀 ÉTAPE 1 : Charger l'image depuis la base de données PostgreSQL du Backend
async function loadDynamicImage() {
    try {
        const response = await fetch('http://localhost:5000/api/random-orchard');
        const data = await response.json();
        
        if (data.url && targetImage) {
            // On ajoute l'adresse du serveur devant le chemin stocké en base de données
            targetImage.src = `http://localhost:5000/${data.url}`;
            
            // 💡 On mémorise l'ID unique de la ligne SQL (ex: 1)
            currentImageId = data.id;
            
            console.log(`[L'AIGLE ROYAL] Image chargée avec succès. ID Base de données : ${currentImageId}`);
        } else {
            console.error("Données incomplètes reçues du serveur.");
        }
    } catch (error) {
        console.error("Erreur lors du chargement initial de l'image agricole :", error);
    }
}

// Lancement au chargement complet du script
loadDynamicImage();

// 🚀 ÉTAPE 2 : Gérer le clic sur l'image et calculer les %
imageWrapper.addEventListener('click', (e) => {
    // Si on clique sur le bouton de validation lui-même, on ne déplace pas la cible
    if (e.target.id === 'btnValider') return;

    const rect = imageWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Normalisation en % de la largeur et hauteur de l'image
    if (targetImage && targetImage.clientWidth > 0) {
        lastClickXPercent = (clickX / targetImage.clientWidth) * 100;
        lastClickYPercent = (clickY / targetImage.clientHeight) * 100;
    }

    console.log(`Clic Normalisé -> X: ${lastClickXPercent.toFixed(2)}%, Y: ${lastClickYPercent.toFixed(2)}%`);

    // Positionnement visuel de la boîte et du menu de validation
    targetBox.style.left = `${clickX}px`;
    targetBox.style.top = `${clickY}px`;
    targetBox.style.display = 'block';

    selectionMenu.style.left = `${clickX + 35}px`; 
    selectionMenu.style.top = `${clickY - 30}px`;
    selectionMenu.style.display = 'block';
});

// Fermer le menu si l'utilisateur clique en dehors de la zone d'analyse
document.addEventListener('click', (e) => {
    if (!imageWrapper.contains(e.target)) {
        targetBox.style.display = 'none';
        selectionMenu.style.display = 'none';
    }
});

// 🚀 ÉTAPE 3 : Envoyer les coordonnées au backend pour vérification SQL
btnValider.addEventListener('click', async () => {
    // Masquage visuel direct après soumission
    targetBox.style.display = 'none';
    selectionMenu.style.display = 'none';

    try {
        const response = await fetch('http://localhost:5000/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                anomalieId: currentImageId, // 🔥 On transmet l'ID numérique (ex: 1)
                x: lastClickXPercent,
                y: lastClickYPercent
            })
        });

        const data = await response.json();

        // Affichage du diagnostic dynamique géré par la base de données
        if (data.success) {
            alert(`✅ ${data.message}`);
            // Optionnel : Recharger une nouvelle image aléatoire après un succès !
            loadDynamicImage();
        } else {
            alert(`❌ ${data.message}`);
        }

    } catch (error) {
        console.error("Erreur de liaison API :", error);
        alert("Impossible de joindre le serveur de diagnostic.");
    }
});