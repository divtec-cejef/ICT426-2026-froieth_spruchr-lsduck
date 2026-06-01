// tests/tests-unitaires.test.js

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Données de test (Mock Data)
const mockProduits = [
    {
        id: 1, nom: "Produit A", prix: 10.00, image: "a.jpg",
        description: "Une description",
        details: { couleur: "Rouge", taille: "M" },
        avis: [{ note: 4 }, { note: 5 }]
    },
    {
        id: 2, nom: "Produit B", prix: 20.00, image: "b.jpg",
        description: "Une autre description",
        details: { theme: "Nature" },
        avis: []
    }
];

// Mock fetch
global.fetch = jest.fn((url) => {
    if (url.includes('.html')) {
        return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(`
                <div class="product-card">
                    <div class="product-image"><img class="img" src="" alt=""></div>
                    <div class="product-info">
                        <h2 class="product-name"></h2>
                        <p class="product-description"></p>
                        <div class="product-details"></div>
                        <div class="product-footer">
                            <div class="product-price"></div>
                            <div class="product-rating">
                                <span class="stars"></span>
                                <span class="rating-count"></span>
                            </div>
                        </div>
                        <button class="add-to-cart">Ajouter au panier</button>
                    </div>
                </div>
            `)
        });
    }
    if (url.includes('.json')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ produits: mockProduits })
        });
    }
});

// ⚠️ TRÈS IMPORTANT : Créer le bon conteneur (#results) AVANT le require
document.body.innerHTML = '<div id="results"></div>';

// Import des fonctions de main.js
const { renderResults } = require('../src/js/main.js'); // Ajuste le chemin si nécessaire

beforeEach(() => {
    // On recrée la structure HTML propre à chaque test avec le bon ID "results"
    document.body.innerHTML = '<div id="results"></div>';
    jest.clearAllMocks();
});

// --- Tests ---

test('renderResults ajoute les cartes dans le DOM', async () => {
    // On appelle directement renderResults avec nos données de test
    await renderResults(mockProduits);

    const zone = document.getElementById('results');
    expect(zone.children.length).toBe(2);
});

test('les cartes contiennent le bon nom de produit', async () => {
    await renderResults(mockProduits);

    const noms = document.querySelectorAll('.product-name');
    expect(noms[0].textContent).toBe('Produit A');
    expect(noms[1].textContent).toBe('Produit B');
});

test('les cartes affichent le bon prix', async () => {
    await renderResults(mockProduits);

    const prix = document.querySelectorAll('.product-price');
    expect(prix[0].textContent).toBe('10.00 CHF');
});

test('Affiche zéro avis si la liste d\'avis est vide', async () => {
    await renderResults(mockProduits);

    const ratings = document.querySelectorAll('.rating-count');
    // Le deuxième produit n'a pas d'avis, donc on attend "(0)"
    expect(ratings[1].textContent).toBe('(0)');
});