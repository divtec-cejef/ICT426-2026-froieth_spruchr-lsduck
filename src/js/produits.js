// ─── Helpers ───────────────────────────────────────────────
function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

function etoiles(moyenne) {
    let html = '<div class="stars">';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="${i <= Math.round(moyenne) ? 'star-filled' : 'star-empty'}">★</span>`;
    }
    html += '</div>';
    return html;
}

function moyenneAvis(avis) {
    if (!avis || avis.length === 0) return null;
    const total = avis.reduce((s, a) => s + a.note, 0);
    return (total / avis.length).toFixed(1);
}

function renderProduit(produit) {
    const app = document.getElementById('app');
    const moy = moyenneAvis(produit.avis);

    const detailsHTML = Object.entries(produit.details).map(([cle, val]) => `
      <div class="detail-item">
        <div class="detail-label">${cle.replace(/_/g, ' ')}</div>
        <div class="detail-value">${val}</div>
      </div>
    `).join('');

    const avisHTML = produit.avis.length > 0
        ? produit.avis.map(a => `
          <div class="avis-card">
            <div class="avis-header">
              <div class="avis-avatar">${a.utilisateur[0].toUpperCase()}</div>
              <div>
                <div class="avis-user">${a.utilisateur}</div>
                <div class="stars">${'★'.repeat(a.note)}${'☆'.repeat(5 - a.note)}</div>
              </div>
            </div>
            ${a.commentaire ? `<div class="avis-commentaire">${a.commentaire}</div>` : ''}
          </div>`).join('')
        : '<p class="avis-empty">Aucun avis pour le moment. Soyez le premier ! 🦆</p>';

    app.innerHTML = `
      <div class="product-grid">

        <!-- IMAGE -->
        <div class="image-wrap">
          <img src="${produit.image}" alt="${produit.nom}" onerror="this.src='https://placehold.co/400x400/fff8d6/f5c800?text=🦆'"/>
          ${produit.details.theme ? `<div class="badge-theme">${produit.details.theme}</div>` : ''}
        </div>

        <!-- INFO -->
        <div class="info">
          <h1 class="product-name">${produit.nom}</h1>

          <div class="price-row">
            <div class="price">${produit.prix.toFixed(2)} €</div>
            ${moy ? etoiles(moy) + `<small style="color:var(--gris);font-size:.85rem">${moy}/5 (${produit.avis.length} avis)</small>` : ''}
          </div>

          <p class="product-desc">${produit.description}</p>

          <div>
            <div class="details-title">Caractéristiques</div>
            <div class="details-grid">${detailsHTML}</div>
          </div>

          <button class="btn-panier" onclick="ajouterPanier(${produit.id})">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Ajouter au panier
          </button>
        </div>
      </div>

      <!-- AVIS -->
      <div class="avis-section">
        <h2 class="section-heading">Avis clients</h2>
        <div class="avis-list">${avisHTML}</div>
      </div>
    `;
}

function ajouterPanier(id) {
    alert(`Produit #${id} ajouté au panier ! 🛒`);
    // → Remplace par ta vraie logique panier
}

// ─── Chargement principal ──────────────────────────────────
async function init() {
    const id = getIdFromUrl();
    const app = document.getElementById('app');

    if (!id) {
        app.innerHTML = `<div class="state-msg"><span class="emoji">🤔</span>Aucun ID spécifié dans l'URL.<br><small>Exemple : <code>produit.html?id=1</code></small></div>`;
        return;
    }

    try {
        // Adapte le chemin vers ton fichier JSON
        const res = await fetch('../res/data/produits.json');
        const data = await res.json();
        const produit = data.produits.find(p => p.id === id);

        if (!produit) {
            app.innerHTML = `<div class="state-msg"><span class="emoji">🦆</span>Produit introuvable (id=${id}).</div>`;
            return;
        }

        document.title = produit.nom + ' — LSDuck';
        renderProduit(produit);

    } catch (err) {
        console.error(err);
        app.innerHTML = `<div class="state-msg"><span class="emoji">⚠️</span>Impossible de charger les données.<br><small>${err.message}</small></div>`;
    }
}

init();