/**
 * Granit Trolli — Portfolio Scripts
 */

'use strict';

// Utility: querySelector shorthand
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Theme Toggle (Light / Dark)
(function initTheme() {
  const STORAGE_KEY = 'portfolio-theme';
  const toggleBtn = qs('#themeToggle');
  const html = document.documentElement;

  // Read saved preference or default to 'light'
  const savedTheme = localStorage.getItem(STORAGE_KEY) || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateToggleLabel(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    updateToggleLabel(next);
  });

  function updateToggleLabel(theme) {
    const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    toggleBtn.setAttribute('aria-label', label);
    toggleBtn.setAttribute('title', label);
  }
})();

// Navbar: scroll shadow + active link highlighting
(function initNavbar() {
  const navbar = qs('.navbar');
  const navLinks = qsa('.nav-link');
  const sections = qsa('main section[id]');

  // Shadow on scroll
  window.addEventListener('scroll', onScroll, { passive: true });
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    highlightActiveLink();
  }

  // Highlight the nav link whose section is in view
  function highlightActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight * 0.4;

    sections.forEach(section => {
      const { offsetTop, offsetHeight, id } = section;
      const inView = scrollMid >= offsetTop && scrollMid < offsetTop + offsetHeight;
      const link = qs(`.nav-link[href="#${id}"]`);
      if (link) link.classList.toggle('active', inView);
    });
  }

  // Run once on load
  highlightActiveLink();
})();

// Mobile Hamburger Menu
(function initHamburger() {
  const burger = qs('#hamburger');
  const menu = qs('#mobileMenu');
  const mobileLinks = qsa('.mobile-link');

  function openMenu() {
    burger.classList.add('open');
    menu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    burger.classList.remove('open');
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close when a link is clicked
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close when clicking outside the nav
  document.addEventListener('click', e => {
    if (!qs('.navbar').contains(e.target)) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

// Smooth Scroll
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const target = document.getElementById(anchor.getAttribute('href').slice(1));
    if (!target) return;

    e.preventDefault();
    const navbarHeight = qs('.navbar').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

// Scroll-Reveal (Intersection Observer)
(function initReveal() {
  const elements = qsa('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
})();

// Typing Effect (Hero Tagline)
(function initTypingEffect() {
  const target = qs('#typingText');
  if (!target) return;

  const phrases = [
    'Self-Taught Developer',
    'Vue.js Enthusiast',
    'Frontend Developer',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  const TYPE_SPEED = 80;   // ms per character typed
  const DELETE_SPEED = 45;   // ms per character deleted
  const PAUSE_AFTER = 1800; // ms pause after full phrase
  const PAUSE_BEFORE = 350;  // ms pause before re-typing

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove a character
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add a character
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    // Finished typing the phrase
    if (!isDeleting && charIndex === currentPhrase.length) {
      if (isPaused) return;
      isPaused = true;
      setTimeout(() => {
        isDeleting = true;
        isPaused = false;
        type();
      }, PAUSE_AFTER);
      return;
    }

    // Finished deleting
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, PAUSE_BEFORE);
      return;
    }

    const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
    setTimeout(type, delay);
  }

  // Kick off after a short delay so the hero reveal finishes first
  setTimeout(type, 900);
})();

// Footer: auto-update copyright year
(function initYear() {
  const el = qs('#currentYear');
  if (el) el.textContent = new Date().getFullYear();
})();

// Contact Form Demo
(function initContactForm() {
  const form = qs('#contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = qs('#fname', form).value.trim();
    const email = qs('#femail', form).value.trim();
    const message = qs('#fmessage', form).value.trim();

    // Demo: show success message
    const submitBtn = qs('button[type="submit"]', form);
    const originalBtnText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    // FormSubmit AJAX endpoint: https://formsubmit.co/ajax/your@email.com
    const ajaxUrl = `https://formsubmit.co/ajax/${form.action.split('/').pop()}`;

    fetch(ajaxUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success === "true" || data.success === true) {
          alert(`Thanks, ${name}! Your message has been sent successfully.`);
          form.reset();
        } else {
          alert(`Oops! There was a problem: ${data.message || 'Please try again later.'}`);
        }
      })
      .catch(error => {
        alert('Oops! There was a problem submitting your form. Please check your connection and try again.');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
  });
})();

// Reduced-motion: disable animations for users who prefer it
(function respectMotionPreference() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Immediately show all reveal elements without animation
    qsa('.reveal').forEach(el => el.classList.add('visible'));

    // Freeze typing cursor only
    const cursor = qs('.cursor');
    if (cursor) cursor.style.animation = 'none';
  }
})();
