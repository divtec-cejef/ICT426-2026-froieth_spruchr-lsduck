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
            json: () => Promise.resolve({
                produits: [
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
                ]
            })
        });
    }
});

// ✅ Créer le DOM AVANT le require
document.body.innerHTML = '<div id="produits"></div>';

const { afficherProduits } = require('../src/js/main.js');

beforeEach(() => {
    document.body.innerHTML = '<div id="produits"></div>';
    jest.clearAllMocks();
    // Réinitialiser le mock fetch après clearAllMocks
    global.fetch.mockImplementation((url) => {
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
                json: () => Promise.resolve({
                    produits: [
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
                    ]
                })
            });
        }
    });
});

// --- Tests ---
test('afficherProduits ajoute les cartes dans le DOM', async () => {
    await afficherProduits();
    const zone = document.getElementById('produits');
    expect(zone.children.length).toBe(2);
});

test('les cartes contiennent le bon nom de produit', async () => {
    await afficherProduits();
    const noms = document.querySelectorAll('.product-name');
    expect(noms[0].textContent).toBe('Produit A');
    expect(noms[1].textContent).toBe('Produit B');
});

test('les cartes affichent le bon prix', async () => {
    await afficherProduits();
    const prix = document.querySelectorAll('.product-price');
    expect(prix[0].textContent).toBe('10.00 CHF');
});

test('calculerMoyenneNotes retourne 0 si pas d\'avis', async () => {
    await afficherProduits();
    const ratings = document.querySelectorAll('.rating-count');
    expect(ratings[1].textContent).toBe('(0)');
});