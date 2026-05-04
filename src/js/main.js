// Fonction pour calculer la moyenne des notes
function calculerMoyenneNotes(avis) {
    if (!avis || avis.length === 0) return 0;
    const somme = avis.reduce((acc, a) => acc + a.note, 0);
    return (somme / avis.length).toFixed(1);
}

// Fonction pour générer les étoiles
function genererEtoiles(note) {
    const noteEntiere = Math.floor(note);
    let etoiles = '';
    for (let i = 0; i < 5; i++) {
        etoiles += i < noteEntiere ? '⭐' : '☆';
    }
    return etoiles;
}

// Création de la carte produit
async function creerCarteProduit(produit) {
    const template = await fetch("./components/product-card.html").then(res => res.text());

    const wrapper = document.createElement("div");
    wrapper.innerHTML = template.trim();
    const card = wrapper.firstElementChild;

    const moyenneNotes = calculerMoyenneNotes(produit.avis);

    // Image
    const img = card.querySelector(".img");
    img.src = produit.image;
    img.alt = produit.nom;
    img.onerror = () => img.parentElement.innerHTML = "🦆";

    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.add-to-cart')) {
            window.location.href = `produit.html?id=${produit.id}`;
        }
    });

    card.querySelector(".add-to-cart").addEventListener('click', (e) => {
        e.stopPropagation();
        ajouterAuPanier(produit.id);
    });

    //objet va dans panier
    function ajouterAuPanier(id) {
        // Panier
        card.querySelector(".add-to-cart").addEventListener('click', (e) => {
            e.stopPropagation();
            ajouterAuPanier(produit.id);
        });

        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = ``;
        });
    }

    // Texte
    card.querySelector(".product-name").textContent = produit.nom;
    card.querySelector(".product-description").textContent = produit.description;

    // Détails
    const d = produit.details;
    card.querySelector(".product-details").innerHTML = `
        ${d.couleur ? `<span class="detail-badge">🎨 ${d.couleur}</span>` : ""}
        ${d.taille ? `<span class="detail-badge">📏 ${d.taille}</span>` : ""}
        ${d.theme ? `<span class="detail-badge">✨ ${d.theme}</span>` : ""}
        ${d.matiere ? `<span class="detail-badge">🧱 ${d.matiere}</span>` : ""}
        ${d.poids ? `<span class="detail-badge">⚖️ ${d.poids}</span>` : ""}
        ${d.age_recommande ? `<span class="detail-badge">👶 ${d.age_recommande}</span>` : ""}
    `;

    // Prix
    card.querySelector(".product-price").textContent = produit.prix.toFixed(2) + " CHF";

    // Avis
    card.querySelector(".stars").innerHTML = genererEtoiles(moyenneNotes);
    card.querySelector(".rating-count").textContent = `(${produit.avis.length})`;

    // Panier
    card.querySelector(".add-to-cart").onclick = () => ajouterAuPanier(produit.id);

    return card;
}

// --- Affichage des produits ---
async function afficherProduits() {
    const data = await fetch("../res/data/produits.json").then(r => r.json());
    const produits = data.produits;

    const zone = document.getElementById("produits");

    for (const produit of produits) {
        const carte = await creerCarteProduit(produit);
        zone.appendChild(carte);
    }
}

// --- Lancement ---
afficherProduits();