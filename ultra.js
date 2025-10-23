/*
 * Ultra‑luxe script for GameShop Enter
 *
 * Dit script verzorgt de automatische hero‑slider met pauze op hover en
 * 3D‑tiltinteracties voor categoriekaarten. Het script wordt geladen na
 * main.js en uploads_inventory.js om bestaande functionaliteit niet te
 * verstoren.
 */

document.addEventListener('DOMContentLoaded', () => {
  // HERO SLIDER IMPLEMENTATIE
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  let current = 0;
  const intervalTime = 6000;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    current = index;
  }

  function nextSlide() {
    const nextIndex = (current + 1) % slides.length;
    showSlide(nextIndex);
  }

  function startAuto() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  function stopAuto() {
    clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    showSlide(0);
    startAuto();
    const hero = document.querySelector('.hero-slider');
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
    // optionele navigatieknoppen
    const prevBtn = hero.querySelector('.hero-prev');
    const nextBtn = hero.querySelector('.hero-next');
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        const prevIndex = (current - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
      });
      nextBtn.addEventListener('click', () => {
        nextSlide();
      });
    }
  }

  // 3D TILT VOOR CATEGORIEKAARTEN
  const cards = document.querySelectorAll('.category-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    });
  });

  /* ------------------------------------------------------------------
     Dynamische homepage secties: Nieuw binnen, Aanbiedingen en Pre‑orders

     Deze secties worden gevuld met producten uit de globale INVENTORY en
     UPLOAD_ITEMS. We selecteren de nieuwste items op basis van hun
     volgorde in de array en markeren aanbiedingen op basis van prijs.
     Pre‑orders zijn handmatig gedefinieerd omdat we hiervoor nog geen
     actuele inventaris hebben.  Alle secties tonen maximaal 8 items.
  ------------------------------------------------------------------ */
  function slugify(str) {
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-+|-+$)/g, '');
  }

  function createProductCard(item, options = {}) {
    // item: {title, image, price, category}
    const card = document.createElement('a');
    card.className = 'product-card';
    card.href = `product.html?title=${encodeURIComponent(item.title)}`;
    // image
    const img = document.createElement('img');
    img.src = item.image || 'images/placeholder_light_gray_block.png';
    img.alt = item.title;
    card.appendChild(img);
    const info = document.createElement('div');
    info.className = 'product-info';
    const h3 = document.createElement('h3');
    h3.innerText = item.title;
    info.appendChild(h3);
    // Price row
    const priceRow = document.createElement('div');
    priceRow.className = 'price-row';
    // Always show the full price (no discounts) for a premium uitstraling
    const price = item.price;
    const priceEl = document.createElement('span');
    priceEl.className = 'price';
    priceEl.innerText = `€${(price || 0).toFixed(2)}`;
    priceRow.appendChild(priceEl);
    info.appendChild(priceRow);
    card.appendChild(info);
    return card;
  }

  function populateSection(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    items.forEach(item => {
      container.appendChild(createProductCard(item));
    });
  }

  function prepareHomeSections() {
    // Combine inventory arrays (INVENTORY from main.js + UPLOAD_ITEMS from uploads)
    let combined = [];
    if (typeof INVENTORY !== 'undefined') combined = combined.concat(INVENTORY);
    if (typeof UPLOAD_ITEMS !== 'undefined') combined = combined.concat(UPLOAD_ITEMS);
    // Filter items that have a valid price > 0 for deals and new arrivals
    const validItems = combined.filter(it => typeof it.price === 'number' && it.price > 0);
    // New arrivals: take the last 8 items (assuming newly added are at the end)
    const newArrivals = validItems.slice(-8).reverse();
    // Premium selectie: selecteer de producten met de hoogste prijzen voor een luxe uitstraling
    const premium = validItems
      .filter(it => typeof it.price === 'number')
      .sort((a, b) => b.price - a.price)
      .slice(0, 8);
    // Populaire games: selecteer de duurste of bestsellers. Sorteer op prijs aflopend en neem top 8
    const popular = validItems
      .filter(it => typeof it.price === 'number')
      .sort((a, b) => b.price - a.price)
      .slice(0, 8);
    // Populate each section (preorders removed; only second-hand items are shown)
    // Home strips (new arrivals, premium selectie en populaire games) zijn verwijderd voor een minimalistischer homepage.
    // Voer geen populateSection calls uit als de strip-elementen niet bestaan.
    if (document.getElementById('newArrivalsStrip')) {
      populateSection('newArrivalsStrip', newArrivals);
    }
    if (document.getElementById('premiumStrip')) {
      populateSection('premiumStrip', premium);
    }
    if (document.getElementById('popularStrip')) {
      populateSection('popularStrip', popular);
    }
  }

  // Initialise sections once DOM is ready
  prepareHomeSections();

  /* ------------------------------------------------------------
     Zoekfunctionaliteit op de homepage
     Deze functie luistert naar het zoekformulier, filtert het gecombineerde
     inventaris van producten en toont de resultaten in een horizontale strip.
  --------------------------------------------------------------*/
  // Combineer alle items (INVENTORY + UPLOAD_ITEMS) in een array voor zoeken
  let searchItems = [];
  try {
    if (typeof INVENTORY !== 'undefined') searchItems = searchItems.concat(INVENTORY);
    if (typeof UPLOAD_ITEMS !== 'undefined') searchItems = searchItems.concat(UPLOAD_ITEMS);
  } catch (e) {}

  // Helperfunctie: normaliseert tekst naar kleine letters en verwijdert accenten
  function normalizeString(str) {
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
  // Event handler voor het zoekformulier
  const searchForm = document.getElementById('homeSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = document.getElementById('homeSearchInput');
      const query = (input.value || '').trim().toLowerCase();
      const resultsSection = document.getElementById('searchResults');
      const resultsContainer = document.getElementById('searchStrip');
      const noResultsMsg = document.getElementById('noResultsMessage');
      if (!query) {
        // Lege zoekopdracht: verberg resultaten
        if (resultsSection) resultsSection.style.display = 'none';
        return;
      }
      // Filter items waarvan de titel de query bevat
      // Normaliseer query en titels om accenten te negeren
      const normalizedQuery = normalizeString(query);
      const matches = searchItems.filter(item => {
        try {
          return normalizeString(item.title).includes(normalizedQuery);
        } catch (e) {
          return false;
        }
      });
      if (matches.length > 0) {
        // Toon maximaal 12 resultaten
        populateSection('searchStrip', matches.slice(0, 12));
        if (noResultsMsg) noResultsMsg.style.display = 'none';
      } else {
        if (resultsContainer) resultsContainer.innerHTML = '';
        if (noResultsMsg) noResultsMsg.style.display = 'block';
      }
      // Toon de resultaten sectie
      if (resultsSection) {
        resultsSection.style.display = 'block';
        // Scroll naar resultaten
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});