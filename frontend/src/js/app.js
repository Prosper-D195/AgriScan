// Sélection des éléments du DOM
const imageWrapper = document.getElementById('imageWrapper');
const targetImage = document.getElementById('targetImage');
const targetBox = document.getElementById('targetBox');
const selectionMenu = document.getElementById('selectionMenu');

// Variables pour stocker les coordonnées normalisées du dernier clic
let lastClickXPercent = 0;
let lastClickYPercent = 0;

// Écouteur d'événement sur le conteneur de l'image
imageWrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-btn')) return;

    // 1. Position absolue du clic par rapport à l'image wrapper
    const rect = imageWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 2. NORMALISATION : Calcul des coordonnées en pourcentage
    // On utilise targetImage.clientWidth et clientHeight (taille affichée réelle à l'écran)
    lastClickXPercent = (clickX / targetImage.clientWidth) * 100;
    lastClickYPercent = (clickY / targetImage.clientHeight) * 100;

    // Log de contrôle pour le développement (à retirer en production)
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

// Écouteur pour la sélection d'une anomalie dans le menu
const menuButtons = document.querySelectorAll('.menu-btn');
menuButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedAnomalie = e.target.getAttribute('data-id');
        
        // Ici, nous avons toutes les données prêtes à être envoyées au serveur plus tard !
        console.log(`Envoi au Backend : Anomalie: ${selectedAnomalie}, X: ${lastClickXPercent.toFixed(2)}%, Y: ${lastClickYPercent.toFixed(2)}%`);
        
        // Masquage des éléments
        targetBox.style.display = 'none';
        selectionMenu.style.display = 'none';
    });
});