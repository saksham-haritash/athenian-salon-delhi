/* ============================================
   ATHENIAN SALON — Interactions & Animations
   ============================================ */

(function () {
  'use strict';

  // Elements
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = navMenu.querySelectorAll('a');
  const reviewsTrack = document.querySelector('.reviews-track');
  const reviewsDots = document.querySelectorAll('.reviews-dot');
  const contactForm = document.getElementById('contactForm');

  // ==========================================
  // NAV SCROLL EFFECT
  // ==========================================
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ==========================================
  // MOBILE NAV TOGGLE
  // ==========================================
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('open');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ==========================================
  // SCROLL REVEAL (IntersectionObserver)
  // ==========================================
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });
  revealEls.forEach(el => revealObserver.observe(el));

  // ==========================================
  // TESTIMONIAL SLIDER
  // ==========================================
  let currentSlide = 0;
  const totalSlides = reviewsDots.length;

  function goToSlide(index) {
    currentSlide = index;
    const slideWidth = reviewsTrack.children[0].offsetWidth + 20; // gap
    reviewsTrack.style.transform = `translateX(-${index * slideWidth}px)`;
    reviewsDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  reviewsDots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
    });
  });

  // Auto-advance every 5s
  setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 5000);

  // Handle resize
  window.addEventListener('resize', () => {
    goToSlide(currentSlide);
  });

  // Touch swipe support
  let startX = 0;
  let isDragging = false;
  reviewsTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });
  reviewsTrack.addEventListener('touchmove', () => {
    isDragging = false; // only trigger on swipe, not scroll
  }, { passive: true });
  reviewsTrack.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
  });

  // ==========================================
  // CONTACT FORM
  // ==========================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !phone) {
        alert('Please fill in your name and phone number.');
        return;
      }

      // Build WhatsApp message
      const text = `Hi Athenian Salon, I'm ${name}. I'm interested in ${service || 'your services'}. ${message ? 'Message: ' + message : ''} Please call me back at ${phone}.`;
      const waUrl = `https://wa.me/918011110064?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }

  // ==========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
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

})();
