/**
 * Solvix Website — main.js
 *
 * Structure des fonctions à venir :
 * - initBurgerMenu()         — menu mobile (étape 1) ✓
 * - initNavActiveState()     — lien actif au scroll (étape 7)
 * - initScrollAnimations()   — animations d'entrée au scroll (étape 7) ✓
 */

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function initStudioMotion() {
  const targets = document.querySelectorAll('.studio-reveal');
  if (!targets.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('studio-motion-ready');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  targets.forEach((target) => observer.observe(target));
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

function initSolReveal() {
  const targets = document.querySelectorAll('.sol-reveal');
  if (!targets.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('solx-motion-ready');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  targets.forEach((target) => observer.observe(target));
}

function initSolFilter() {
  const chips = document.querySelectorAll('.sol-filterchip');
  const cards = document.querySelectorAll('#portfolio [data-type]');
  const title = document.getElementById('portfolio-title');
  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const scrollY = window.scrollY;
      const filter = chip.dataset.filter || 'all';
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('sol-filterchip--on', active);
        c.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      let visibleCount = 0;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.type === filter;
        card.classList.toggle('sol-is-hidden', !match);
        if (match) visibleCount += 1;
      });
      if (title) {
        if (filter === 'all') {
          title.textContent = '5 autres réalisations sur-mesure.';
        } else {
          const label = chip.dataset.label || '';
          const noun = visibleCount > 1 ? 'réalisations sur-mesure' : 'réalisation sur-mesure';
          title.textContent = visibleCount + ' ' + noun + (label ? ' \u00b7 ' + label : '') + '.';
        }
      }
      window.scrollTo(0, scrollY);
    });
  });
}

function initContactForm() {
  const form = document.querySelector('.sol-form');
  if (!form) return;

  const submitBtn = form.querySelector('#contact-submit');
  const errorBox = form.querySelector('#contact-error');
  const renderedAt = form.querySelector('#rendered-at');
  const required = ['name', 'email', 'project_type', 'need'];
  const submitLabel = 'Envoyer ma demande';
  const loadingLabel = 'Envoi en cours…';
  let sending = false;

  if (renderedAt) renderedAt.value = String(Date.now());

  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function clearError() {
    if (!errorBox) return;
    errorBox.textContent = '';
    errorBox.hidden = true;
  }

  function setSending(state) {
    sending = state;
    if (!submitBtn) return;
    submitBtn.disabled = state;
    submitBtn.setAttribute('aria-busy', state ? 'true' : 'false');
    submitBtn.firstChild.textContent = state ? ` ${loadingLabel} ` : ` ${submitLabel} `;
  }

  function firstMissingField() {
    for (const fieldName of required) {
      const el = form.elements[fieldName];
      if (!el) continue;
      const value = form.elements[fieldName].value || '';
      if (!String(value).trim()) return el;
    }
    return null;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;

    clearError();

    const missing = firstMissingField();
    if (missing) {
      showError('Veuillez compléter les champs obligatoires avant d’envoyer votre demande.');
      missing.focus();
      return;
    }

    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      company: form.elements.company.value.trim(),
      project_type: form.elements.project_type.value,
      need: form.elements.need.value.trim(),
      budget: form.elements.budget.value,
      'bot-field': form.elements['bot-field'].value,
      rendered_at: form.elements.rendered_at.value,
    };

    setSending(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error('send_failed');
      }

      window.location.assign('/merci.html');
    } catch (error) {
      setSending(false);
      showError(
        'Une erreur est survenue lors de l’envoi. Vérifiez vos informations et réessayez.'
      );
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initScrollReveal();
  initStudioMotion();
  initSolReveal();
  initSolFilter();
  initContactForm();
});
