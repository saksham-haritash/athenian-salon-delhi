/* ============================================
   ATHENIAN SALON — Interactive Script
   ============================================ */

(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const stickyCta = document.getElementById('stickyCta');

  /* ------------------------------------------
     NAV SCROLL EFFECT
     ------------------------------------------ */
  function onScroll() {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle('nav--scrolled', scrolled);

    // Show/hide sticky CTA based on hero visibility
    if (stickyCta) {
      const hero = document.getElementById('hero');
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;
        stickyCta.style.transform = heroBottom > 0 ? 'translateY(100%)' : 'translateY(0)';
        stickyCta.style.opacity = heroBottom > 0 ? '0' : '1';
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------
     MOBILE MENU TOGGLE
     ------------------------------------------ */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('nav-links--open');
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('nav-links--open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ------------------------------------------
     SMOOTH SCROLL FOR ANCHOR LINKS
     ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ------------------------------------------
     BEFORE & AFTER SLIDER
     ------------------------------------------ */
  const baSlider = document.getElementById('baSlider');
  const baBefore = document.getElementById('baBefore');
  const baHandle = document.getElementById('baHandle');

  if (baSlider && baBefore && baHandle) {
    let isDragging = false;

    function updateSlider(clientX) {
      const rect = baSlider.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const pct = (x / rect.width) * 100;
      baBefore.style.width = pct + '%';
      baHandle.style.left = pct + '%';
    }

    baHandle.addEventListener('mousedown', () => { isDragging = true; });
    baHandle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });

    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    // Click to jump
    baSlider.addEventListener('click', (e) => {
      if (e.target === baHandle) return;
      updateSlider(e.clientX);
    });
  }

  /* ------------------------------------------
     SCROLL REVEAL ANIMATION
     ------------------------------------------ */
  const revealEls = document.querySelectorAll(
    '.service-card, .offer-card, .testimonial, .gallery-item, .experience-layout'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(el => { el.style.opacity = '1'; });
  }

  /* ------------------------------------------
     NAV LINK ACTIVE STATE
     ------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    const scrollPos = window.scrollY + nav.offsetHeight + 80;
    let activeId = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) {
        activeId = sec.getAttribute('id');
      }
    });
    navLinkEls.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + activeId;
      link.style.color = isActive ? 'var(--gold-500)' : '';
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

})();
