// Sélection des éléments du DOM
const imageWrapper = document.getElementById('imageWrapper');
const targetImage = document.getElementById('targetImage');
const targetBox = document.getElementById('targetBox');
const selectionMenu = document.getElementById('selectionMenu');

// Variables pour stocker les coordonnées normalisées du dernier clic
let lastClickXPercent = 0;
let lastClickYPercent = 0;

// 🚀 AJOUT : Fonction pour charger automatiquement l'image depuis Pixabay via le Backend
async function loadDynamicImage() {
    try {
        const response = await fetch('http://localhost:5000/api/random-orchard');
        const data = await response.json();
        
        if (data.url && targetImage) {
            targetImage.src = data.url;
            console.log("Image Pixabay chargée avec succès :", data.url);
        } else {
            console.error("URL manquante dans la réponse du serveur.");
        }
    } catch (error) {
        console.error("Erreur lors du chargement initial de l'image agricole :", error);
    }
}

// Lancement automatique du chargement d'image
loadDynamicImage();

// Écouteur d'événement sur le conteneur de l'image
imageWrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-btn')) return;

    // 1. Position absolue du clic par rapport à l'image wrapper
    const rect = imageWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 2. NORMALISATION : Calcul des coordonnées en pourcentage
    if (targetImage && targetImage.clientWidth > 0) {
        lastClickXPercent = (clickX / targetImage.clientWidth) * 100;
        lastClickYPercent = (clickY / targetImage.clientHeight) * 100;
    }

    // Log de contrôle pour le développement
    console.log(`Clic Pixel -> X: ${clickX}px, Y: ${clickY}px`);
    console.log(`Clic Normalisé -> X: ${lastClickXPercent.toFixed(2)}%, Y: ${lastClickYPercent.toFixed(2)}%`);

    // 3. Positionnement visuel de la boîte de ciblage et du menu
    targetBox.style.left = `${clickX}px`;
    targetBox.style.top = `${clickY}px`;
    targetBox.style.display = 'block';

    selectionMenu.style.left = `${clickX + 35}px`; 
    selectionMenu.style.top = `${clickY - 30}px`;
    selectionMenu.style.display = 'block';
});

// Écouteur d'événement global pour fermer le menu si on clique ailleurs
document.addEventListener('click', (e) => {
    if (!imageWrapper.contains(e.target)) {
        targetBox.style.display = 'none';
        selectionMenu.style.display = 'none';
    }
});

// Écouteur pour la sélection d'une anomalie dans le menu avec appel API
const menuButtons = document.querySelectorAll('.menu-btn');
menuButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        const selectedAnomalie = e.target.getAttribute('data-id');
        
        // Masquage immédiat des éléments de ciblage après sélection
        targetBox.style.display = 'none';
        selectionMenu.style.display = 'none';

        try {
            // Envoi des coordonnées et de l'id au serveur local Express
            const response = await fetch('http://localhost:5000/api/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    anomalieId: selectedAnomalie,
                    x: lastClickXPercent,
                    y: lastClickYPercent
                })
            });

            const data = await response.json();

            // Gestion de la réponse dynamique du serveur
            if (data.success) {
                alert(`✅ ${data.message}`);
            } else {
                alert(`❌ ${data.message}`);
            }

        } catch (error) {
            console.error("Erreur lors de la communication avec le serveur :", error);
            alert("Impossible de joindre le serveur de diagnostic. Vérifiez qu'il est allumé !");
        }
    });
});