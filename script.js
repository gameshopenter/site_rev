/*
  script.js – Client-side interactions for GameShop Enter

  This script handles toggling between light and dark themes and includes
  placeholder functions for future enhancements (e.g. filtering products on
  the products page). It reads the user's stored preference from
  localStorage and applies it on page load.
*/

// Toggle theme between light and dark
function toggleTheme() {
  const current = document.body.getAttribute('data-theme');
  const nextTheme = current === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', nextTheme);
  localStorage.setItem('theme', nextTheme);
}

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved theme on each page
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.body.setAttribute('data-theme', saved);
  }
  // Hook up the dark mode toggle
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }

  // If we are on the products page, load and display the inventory
  const inventoryList = document.getElementById('inventoryList');
  if (inventoryList) {
    fetch('inventory.json')
      .then(resp => resp.json())
      .then(data => {
        // Store all products globally to allow filtering without refetching
        window.allProducts = data;
        renderProducts(data);
      })
      .catch(err => {
        console.error('Kan inventaris niet laden:', err);
      });
  }
});

/**
 * Genereer producttegels vanuit een array met productobjecten.
 * @param {Array<Object>} items De lijst met producten uit inventory.json
 */
function renderProducts(items) {
  const container = document.getElementById('inventoryList');
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-item';
    // Bepaal welk pictogram gebruikt moet worden aan de hand van de categorie
    const icon = getCategoryIcon(item.category);
    const priceText = formatPrice(item.price);
    // Bepaal welke afbeelding(en) getoond worden. Gebruik standaardcategorie icoon tenzij er een echte afbeelding is opgegeven
    const frontImg = (item.image && item.image.startsWith('assets/')) ? item.image : getCategoryIcon(item.category);
    const backImg = item.backImage;
    // Stel de binnenkant van de kaart samen. Wanneer een achterkant beschikbaar is, toon zowel voorzijde als achterzijde naast elkaar
    card.innerHTML = `
      <div class="product-images">
        <img src="${frontImg}" alt="Voorzijde van ${item.title}" class="front-image">
        ${backImg ? `<img src="${backImg}" alt="Achterzijde van ${item.title}" class="back-image">` : ''}
      </div>
      <h3 style="margin-top:0.5rem;font-size:1rem;">${item.title}</h3>
      <p class="price" style="margin:0.25rem 0;font-weight:bold;">${priceText}</p>
      <button class="btn add-to-cart" style="display:block;width:100%;padding:0.5rem;margin-top:0.25rem;">Toevoegen aan winkelwagen</button>
    `;
    container.appendChild(card);
  });
}

/**
 * Formatteer een prijs naar euro's. Als de prijs ontbreekt of nul is, geef 'n.b.' (niet beschikbaar) terug.
 * @param {number} price Het prijsveld uit de JSON
 */
function formatPrice(price) {
  if (!price || price === 0) return 'n.b.';
  // Zorg dat altijd twee decimalen worden weergegeven en gebruik een komma als decimaalteken
  return '€' + price.toFixed(2).replace('.', ',');
}

/**
 * Koppel categorieën aan bijbehorende pictogrammen. Niet-herkende categorieën krijgen een standaardafbeelding.
 * @param {string} cat Categorie uit inventory.json
 */
function getCategoryIcon(cat) {
  const map = {
    'Nintendo 3DS': 'assets/images/3ds_new.png',
    'Nintendo DS': 'assets/images/ds_new.png',
    'Nintendo GameCube': 'assets/images/gamecube_new.png',
    'Nintendo Game Boy': 'assets/images/gb_new.png',
    'Nintendo Game Boy Advance': 'assets/images/gba_new.png',
    'Nintendo Game Boy Color': 'assets/images/gbc_new.png',
    'Nintendo 64': 'assets/images/n64_new.png',
    'Nintendo NES': 'assets/images/nes_new.png',
    'Nintendo SNES': 'assets/images/snes_new.png',
    'Nintendo Switch': 'assets/images/switch_new.png',
    'Nintendo Wii': 'assets/images/wii_new.png'
  };
  return map[cat] || 'assets/images/cards_new.png';
}

// Product search placeholder (to be implemented for products page)
function filterProducts(term) {
  term = (term || '').toLowerCase();
  // Als er een globale lijst allProducts is, gebruik deze om opnieuw te renderen
  if (window.allProducts && Array.isArray(window.allProducts)) {
    const filtered = window.allProducts.filter(item => {
      return item.title.toLowerCase().includes(term) || item.category.toLowerCase().includes(term);
    });
    renderProducts(filtered);
    return;
  }
  // Fallback: verberg bestaande tegels als allProducts niet beschikbaar is
  const items = document.querySelectorAll('.product-item');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(term) ? '' : 'none';
  });
}