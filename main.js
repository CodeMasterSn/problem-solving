/**
 * Solvix Website — main.js
 *
 * Structure des fonctions à venir :
 * - initBurgerMenu()         — menu mobile (étape 1) ✓
 * - initNavActiveState()     — lien actif au scroll (étape 7)
 * - initScrollAnimations()   — animations d'entrée au scroll (étape 7) ✓
 */

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function initBurgerMenu() {
  const navbar = document.getElementById('navbar');
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (!navbar || !burgerBtn || !navMenu) return;

  function closeMenu() {
    navbar.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Ouvrir le menu');
  }

  function openMenu() {
    navbar.classList.add('is-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', 'Fermer le menu');
  }

  burgerBtn.addEventListener('click', () => {
    const isOpen = navbar.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initScrollReveal();
});
