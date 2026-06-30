// Sélection des éléments du DOM
const imageWrapper = document.getElementById('imageWrapper');
const targetImage = document.getElementById('targetImage');
const targetBox = document.getElementById('targetBox');
const selectionMenu = document.getElementById('selectionMenu');

// Écouteur d'événement sur le conteneur de l'image
imageWrapper.addEventListener('click', (e) => {
    // Si l'utilisateur clique sur un bouton du menu, on ne déplace pas la box
    if (e.target.classList.contains('menu-btn')) return;

    // 1. Récupération des coordonnées du clic relatives à l'image wrapper
    const rect = imageWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 2. Positionnement de la boîte de ciblage (déjà centrée via le CSS transform)
    targetBox.style.left = `${clickX}px`;
    targetBox.style.top = `${clickY}px`;
    targetBox.style.display = 'block';

    // 3. Positionnement du menu contextuel (légèrement décalé sur le côté de la box)
    selectionMenu.style.left = `${clickX + 35}px`; 
    selectionMenu.style.top = `${clickY - 30}px`;
    selectionMenu.style.display = 'block';
});

// Écouteur d'événement global pour fermer le menu si on clique ailleurs
document.addEventListener('click', (e) => {
    // Si le clic n'est pas à l'intérieur de l'image wrapper, on cache les éléments
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
        console.log(`Anomalie sélectionnée : ${selectedAnomalie}`);
        
        // Pour l'instant, on cache juste la box et le menu après la sélection
        targetBox.style.display = 'none';
        selectionMenu.style.display = 'none';
    });
});