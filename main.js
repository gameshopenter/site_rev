/*
 * Hoofd JavaScript-bestand voor de Gameshop Enter webwinkel.
 * Dit script bevat gedeelde functionaliteit voor productlijsten,
 * productdetails, winkelwagenbeheer en de checkout-flow.
 */

// Pad naar het inventarisbestand. Wordt op alle pagina's gebruikt.
const INVENTORY_URL = 'inventory_local.json';

// SVG-tekst als placeholder wanneer een productafbeelding ontbreekt
const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">\n` +
  `<rect width="100%" height="100%" fill="#0b1220"/>\n` +
  `<text x="50%" y="50%" fill="#94a3b8" font-size="16" text-anchor="middle" dominant-baseline="middle">\n` +
  `Geen afbeelding\n` +
  `</text>\n` +
  `</svg>`
);

// Helpers om prijzen te parsen en weer te geven
function parsePrice(s) {
  if (!s) return 0;
  const d = (s.toString().replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.') || '0');
  const v = parseFloat(d);
  return Math.round((isFinite(v) ? v : 0) * 100);
}
function formatCents(c) {
  return (c / 100).toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' });
}

// Zorgt ervoor dat een afbeelding altijd naar de juiste map verwijst
function fixImage(p) {
  if (!p) return placeholder;
  let t = String(p).trim();
  if (/^(https?:)?\/\//i.test(t) || t.startsWith('data:')) return t;
  t = t.replace(/^\.\/+/, '');
  if (t.startsWith('/')) return encodeURI(t);
  if (/^images\//i.test(t)) return encodeURI(t);
  return encodeURI('images/' + t);
}

// Maak van een titel een URL-vriendelijke slug (bijv. "Super Mario" -> "super-mario")
function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Winkelwagenfunctie: sleutel voor localStorage (versie 2 zodat hij los staat van oudere sites)
const CART_KEY = 'gse_cart_v2';

function loadCart() {
  try {
    const c = JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] };
    // Controleer en migreer afbeeldingspaden
    if (c.items && c.items.length) {
      let changed = false;
      for (const it of c.items) {
        const fixed = fixImage(it.image || '');
        if (fixed !== it.image) { it.image = fixed; changed = true; }
      }
      if (changed) localStorage.setItem(CART_KEY, JSON.stringify(c));
    }
    return c;
  } catch {
    return { items: [] };
  }
}

let cart = loadCart();

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = String(cart.items.reduce((n, i) => n + i.qty, 0));
}

function cartTotalCents() {
  return cart.items.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
}

function addToCart(item) {
  const normalized = { ...item, image: fixImage(item.image) };
  const key = `${slugify(normalized.title)}|${normalized.priceCents}|${normalized.image}`;
  const existing = cart.items.find(x => x.key === key);
  if (existing) existing.qty += 1; else cart.items.push({ ...normalized, key, qty: 1 });
  saveCart();
}

function changeQty(key, delta) {
  const it = cart.items.find(x => x.key === key);
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) cart.items = cart.items.filter(x => x.key !== key);
  saveCart();
}

function removeItem(key) {
  cart.items = cart.items.filter(x => x.key !== key);
  saveCart();
}

// Laad en toon een lijst met producten. Optioneel met zoek- en filterfunctionaliteit.
async function loadProducts() {
  updateCartCount();
  const res = await fetch(INVENTORY_URL, { cache: 'no-store' });
  const items = await res.json();
  const grid = document.getElementById('product-grid');
  const searchInput = document.getElementById('search');
  const categorySelect = document.getElementById('category');
  const chipsContainer = document.getElementById('chips');

  // Genereer unieke categorieën
  const cats = [...new Set(items.map(p => p.category || 'Overig'))].sort();
  if (categorySelect) {
    categorySelect.innerHTML = '<option value="">Alle categorieën</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
  }
  if (chipsContainer) {
    chipsContainer.innerHTML = '';
    const mkChip = (label, val = '') => {
      const b = document.createElement('button');
      b.className = 'chip' + (val === '' ? ' chip--all' : '');
      b.textContent = label;
      b.addEventListener('click', () => { if (categorySelect) categorySelect.value = val; render(); });
      return b;
    };
    chipsContainer.appendChild(mkChip('Alle', ''));
    cats.forEach(c => chipsContainer.appendChild(mkChip(c, c)));
  }
  function matches(p) {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const c = categorySelect?.value;
    const okQ = !q || (p.title || '').toLowerCase().includes(q);
    const okC = !c || (p.category === c);
    return okQ && okC;
  }
  function render() {
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = items.filter(matches);
    if (!filtered.length) {
      grid.innerHTML = '<p class="empty">Geen resultaten…</p>';
      return;
    }
    for (const p of filtered) {
      const card = document.createElement('article');
      card.className = 'card';
      const img = fixImage(p.image);
      const cents = parsePrice(p.price);
      const slug = slugify(p.title || 'product');
      card.innerHTML = `
        <a href="product.html?slug=${slug}" class="thumb-link">
          <img class="thumb" src="${img}" alt="${p.title}" loading="lazy" onerror="this.src='${placeholder}'">
        </a>
        <div class="card-body">
          <h4>${p.title || 'Product'}</h4>
          <div class="meta">
            <span class="price">${cents ? formatCents(cents) : (p.price || 'Prijs op aanvraag')}</span>
            <span class="badge">${p.category || 'Overig'}</span>
            <span class="used">Gebruikt</span>
          </div>
          <p class="photo-note">Voorbeeldfoto — het uiteindelijke product kan afwijken</p>
          <button class="btn-small" data-slug="${slug}">In winkelwagen</button>
        </div>`;
      card.querySelector('.btn-small')?.addEventListener('click', () => addToCart({
        title: p.title || 'Product',
        priceCents: cents || 0,
        image: img,
        category: p.category || 'Overig'
      }));
      grid.appendChild(card);
    }
  }
  searchInput?.addEventListener('input', render);
  categorySelect?.addEventListener('change', render);
  render();
}

// Toon details van één product op basis van slug in de URL
async function loadProductDetail() {
  updateCartCount();
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) return;
  const res = await fetch(INVENTORY_URL, { cache: 'no-store' });
  const items = await res.json();
  const product = items.find(p => slugify(p.title || '') === slug);
  const container = document.getElementById('product-detail');
  if (!container) return;
  if (!product) {
    container.innerHTML = '<p class="empty">Product niet gevonden.</p>';
    return;
  }
  const cents = parsePrice(product.price);
  const img = fixImage(product.image);
  container.innerHTML = `
    <div class="detail-wrapper">
      <img src="${img}" alt="${product.title}" class="detail-img" onerror="this.src='${placeholder}'">
      <div class="detail-info">
        <h2>${product.title}</h2>
        <p class="detail-category"><strong>Categorie:</strong> ${product.category || 'Overig'}</p>
        <p class="detail-price"><strong>Prijs:</strong> ${cents ? formatCents(cents) : (product.price || 'Prijs op aanvraag')}</p>
        <p class="detail-used">Gebruikt product — voorbeeldfoto; het uiteindelijke product kan afwijken.</p>
        ${product.description ? `<p class="detail-desc">${product.description}</p>` : ''}
        <button id="addToCartBtn" class="btn">In winkelwagen</button>
      </div>
    </div>`;
  document.getElementById('addToCartBtn')?.addEventListener('click', () => addToCart({
    title: product.title || 'Product',
    priceCents: cents || 0,
    image: img,
    category: product.category || 'Overig'
  }));
}

// Laad winkelwagenpagina
function loadCartPage() {
  updateCartCount();
  const itemsContainer = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('cart-checkout');
  function render() {
    if (!itemsContainer) return;
    itemsContainer.innerHTML = '';
    if (!cart.items.length) {
      itemsContainer.innerHTML = '<p class="empty">Je winkelwagen is leeg.</p>';
    } else {
      for (const it of cart.items) {
        const row = document.createElement('div');
        row.className = 'cart-row';
        row.innerHTML = `
          <img src="${it.image}" alt="${it.title}" class="cart-thumb" onerror="this.src='${placeholder}'">
          <div class="cart-info">
            <div class="cart-title">${it.title}</div>
            <div class="cart-line">
              <span class="cart-price">${formatCents(it.priceCents)}</span>
              <button class="qty-btn" data-key="${it.key}" data-d="-1">−</button>
              <span>${it.qty}</span>
              <button class="qty-btn" data-key="${it.key}" data-d="1">+</button>
              <button class="rm-btn" data-key="${it.key}">×</button>
            </div>
          </div>`;
        itemsContainer.appendChild(row);
      }
    }
    if (totalEl) totalEl.textContent = formatCents(cartTotalCents());
    // Voeg event listeners toe voor knoppen
    itemsContainer?.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => changeQty(btn.dataset.key, Number(btn.dataset.d)));
    });
    itemsContainer?.querySelectorAll('.rm-btn').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.key));
    });
  }
  render();
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (!cart.items.length) {
        alert('Je winkelwagen is leeg.');
        return;
      }
      // Bevestig betaling via serverloze functie
      checkoutBtn.disabled = true;
      const originalText = checkoutBtn.textContent;
      checkoutBtn.textContent = 'Bezig met betalen…';
      try {
        const res = await fetch('/.netlify/functions/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart.items, customer: {} })
        });
        if (!res.ok) throw new Error('Fout bij starten betaling');
        const data = await res.json();
        if (!data.checkoutUrl) throw new Error('Geen betaal-URL ontvangen');
        window.location.href = data.checkoutUrl;
      } catch (e) {
        console.error('Checkout error:', e);
        alert('Er is iets misgegaan bij het starten van de betaling.');
      } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = originalText;
      }
    });
  }
  // Als de cart verandert via andere pagina's, render opnieuw
  window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) {
      cart = loadCart();
      render();
    }
  });
}

// Exporteer functies voor gebruik in HTML
window.GSE = {
  loadProducts,
  loadProductDetail,
  loadCartPage,
  addToCart,
  updateCartCount
};
