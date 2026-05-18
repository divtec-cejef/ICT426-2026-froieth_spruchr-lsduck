const PRODUITS_JSON = "../res/data/produits.json";

let cart = [];
let products = {};

function getCartFromLS() {
    try {
        const raw = localStorage.getItem('productId');
        if (raw) return JSON.parse(raw);
    } catch(e){}
    return null;
}

function saveCart() {
    try { localStorage.setItem('productId', JSON.stringify(cart)); } catch(e){}
}

function fmt(v) { return v.toFixed(2) + ' CHF'; }

function renderCart() {
    const container = document.getElementById('cart-items');
    const badge = document.getElementById('count-badge');
    const total = cart.reduce((s,i)=>s+i.qty,0);
    badge.textContent = total > 0 ? `(${total} article${total>1?'s':''})` : '';

    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-state"><span class="duck">🦆</span><p>Votre panier est vide…</p><a class="empty-btn" href="index.html">Chercher un canard</a></div>`;
        document.getElementById('subtotal').textContent = '0.00 CHF';
        document.getElementById('shipping').textContent = 'Gratuite';
        document.getElementById('total').textContent = '0.00 CHF';
        return;
    }

    container.innerHTML = cart.map((item, idx) => {
        const p = products[item.id] || {};
        const name = p.nom || `Produit #${item.id}`;
        const desc = p.description || '';
        const prix = (p.prix || 0) * item.qty;
        const d = p.details || {};
        const badges = [d.theme, d.taille, d.matiere].filter(Boolean);
        const imgHTML = p.image
            ? `<img src="${p.image}" alt="${name}" onerror="this.style.display='none';this.nextSibling.style.display='block'">`
            : '';
        return `
    <div class="cart-item">
        <div class="item-img">${imgHTML}<span class="placeholder" style="${p.image?'display:none':''}">🦆</span></div>
        <div class="item-info">
            <div class="item-name">${name}</div>
            ${desc ? `<div class="item-desc">${desc}</div>` : ''}
            ${badges.length ? `<div class="item-badges">${badges.map(b=>`<span class="badge">${b}</span>`).join('')}</div>` : ''}
        </div>
        <div class="item-controls">
          <div class="item-price">${fmt(prix)}</div>
          <div class="qty-row">
            <button class="qty-btn" onclick="changeQty(${idx},-1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${idx},1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${idx})">Retirer🗑️</button>
          </div>
    </div>`;
    }).join('');

    updateSummary();
}

function updateSummary() {
    const sub = cart.reduce((s,i)=>{
        const p = products[i.id];
        return s + (p ? p.prix * i.qty : 0);
    }, 0);

    const shipping = sub >= 30 ? 0 : 5.90;
    const tot = sub + shipping;

    document.getElementById('subtotal').textContent = fmt(sub);
    document.getElementById('shipping').textContent = shipping === 0 ? 'Gratuite 🎉' : fmt(shipping);
    document.getElementById('total').textContent = fmt(tot);
}


function changeQty(idx, delta) {
    cart[idx].qty = Math.max(1, cart[idx].qty + delta);
    saveCart();
    renderCart();
}

function removeItem(idx) {
    cart.splice(idx, 1);
    saveCart();
    renderCart();
}

async function loadProductData(ids) {
    try {
        const res = await fetch(PRODUITS_JSON);
        if (!res.ok) throw new Error();
        const data = await res.json();

        // Gérer { "produits": [...] } ou directement un tableau
        const arr = Array.isArray(data) ? data : (data.produits || Object.values(data).flat());

        arr.forEach(p => { if (p.id !== undefined) products[p.id] = p; });
    } catch(e) {
        console.log(e)
    }
}

async function init() {
    const saved = getCartFromLS();
    cart = (saved && saved.length > 0) ? saved : [];
    const ids = [...new Set(cart.map(i => i.id))];
    await loadProductData(ids);
    renderCart();
}

init();