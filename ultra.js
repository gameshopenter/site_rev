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
});