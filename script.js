

'use strict';

// ─────────────────────────────────────────────
// 1. LOADER
// ─────────────────────────────────────────────
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.cursor = 'none';
    initAll();
  }, 1600);
});

function initAll() {
  initCustomCursor();
  initNavbar();
  initMobileMenu();
  initParticles();
  initGSAP();
  initCounters();
  initReveal();
  initProductCards();
  initContactForm();
  initToast();
}

// ─────────────────────────────────────────────
// 2. CUSTOM CURSOR
// ─────────────────────────────────────────────
function initCustomCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  // Sections à fond orange/clair → curseur blanc
  const lightBgSections = [
    document.getElementById('hero'),
    document.querySelector('.banner-section'),
  ].filter(Boolean);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';

    // Détecte si le curseur est sur une section à fond orange
    let isOnLightBg = false;
    lightBgSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top  &&
        e.clientY <= rect.bottom
      ) {
        isOnLightBg = true;
      }
    });

    if (isOnLightBg) {
      document.body.classList.add('cursor-light');
    } else {
      document.body.classList.remove('cursor-light');
    }
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverEls = document.querySelectorAll('a, button, .product-card, input, textarea');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide cursor on mobile
  document.addEventListener('touchstart', () => {
    cursor.style.display   = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
  }, { once: true });
}

// ─────────────────────────────────────────────
// 3. NAVBAR
// ─────────────────────────────────────────────
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll: add scrolled class + active link
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link detection
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// ─────────────────────────────────────────────
// 4. MOBILE MENU
// ─────────────────────────────────────────────
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

// ─────────────────────────────────────────────
// 5. CANVAS PARTICLES
// ─────────────────────────────────────────────
function initParticles() {
  const canvas  = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let animId;

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Particle class
  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = Math.random() * canvas.height;
      this.size = Math.random() * 4 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = -(Math.random() * 0.8 + 0.2);
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeDir = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
      this.x       += this.speedX;
      this.y       += this.speedY;
      this.opacity += this.fadeDir * 0.003;
      if (this.opacity <= 0.05 || this.opacity >= 0.6) this.fadeDir *= -1;
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle   = `rgba(255, 200, 100, 1)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Init particles
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 10000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  };

  animate();

  // Pause when section not visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate();
      } else {
        cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0 });

  observer.observe(document.getElementById('hero'));
}

// ─────────────────────────────────────────────
// 6. GSAP ANIMATIONS
// ─────────────────────────────────────────────
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .from('.hero-badge',   { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' })
    .from('.title-line',   { opacity: 0, y: 60, duration: 0.9, ease: 'power4.out' }, '-=0.4')
    .from('.title-sub',    { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.6')
    .from('.hero-desc',    { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .from('.hero-actions', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .from('.hero-stats',   { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .from('#hero-bottle',  { opacity: 0, scale: 0.7, rotation: -20, duration: 1.2, ease: 'elastic.out(1, 0.5)' }, '-=1.2')
    .from(['#hero-orange-big', '#hero-orange-cut', '#hero-leaf1', '#hero-leaf2', '#hero-leaf3'],
      { opacity: 0, scale: 0.5, stagger: 0.12, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.8')
    .from('.scroll-indicator', { opacity: 0, y: 20, duration: 0.8 }, '-=0.2');

  // Parallax: hero images on scroll
  const heroParallaxTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  heroParallaxTl
    .to('#hero-bottle',     { y: -100, rotation: 8, ease: 'none' }, 0)
    .to('#hero-orange-big', { y: -60,  rotation: 20, ease: 'none' }, 0)
    .to('#hero-orange-cut', { y: -80,  rotation: -15, ease: 'none' }, 0)
    .to('#hero-leaf1',      { y: -40,  rotation: 80, ease: 'none' }, 0)
    .to('#hero-leaf2',      { y: -50,  rotation: -110, ease: 'none' }, 0)
    .to('#hero-leaf3',      { y: -30,  ease: 'none' }, 0)
    .to('.hero-content',    { y: 80,   opacity: 0.5, ease: 'none' }, 0);

  // About section
  gsap.timeline({
    scrollTrigger: {
      trigger: '.about-section',
      start: '10% 85%',
      end: '60% 50%',
      scrub: 1,
    }
  })
  .to('.about-shape-ring', { rotation: 180, ease: 'none' }, 0)
  .from('.about-bottle-img', { y: 60, opacity: 0, duration: 1, ease: 'power2.out' }, 0);

  // Product cards staggered entrance
  gsap.from('.product-card', {
    scrollTrigger: {
      trigger: '.products-grid',
      start: '5% 85%',
    },
    opacity: 0,
    y: 80,
    scale: 0.9,
    stagger: 0.2,
    duration: 1,
    ease: 'power4.out',
  });

  // Banner parallax
  gsap.from('.banner-content', {
    scrollTrigger: {
      trigger: '.banner-section',
      start: '5% 85%',
    },
    opacity: 0,
    y: 60,
    duration: 1,
    ease: 'power3.out',
  });

  // Contact section
  gsap.from('.contact-info', {
    scrollTrigger: {
      trigger: '.contact-section',
      start: '5% 85%',
    },
    opacity: 0,
    x: -60,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.from('.contact-form', {
    scrollTrigger: {
      trigger: '.contact-section',
      start: '5% 85%',
    },
    opacity: 0,
    x: 60,
    duration: 1,
    ease: 'power3.out',
  });
}

// ─────────────────────────────────────────────
// 7. INTERSECTION OBSERVER REVEALS
// ─────────────────────────────────────────────
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────
// 8. ANIMATED COUNTERS
// ─────────────────────────────────────────────
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000; // ms
      const step   = Math.ceil(duration / target);
      let current  = 0;

      const timer = setInterval(() => {
        current += Math.ceil(target / 80);
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────
// 9. PRODUCT CARD 3D TILT
// ─────────────────────────────────────────────
function initProductCards() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateY  = ((e.clientX - centerX) / (rect.width  / 2)) * 6;
      const rotateX  = -((e.clientY - centerY) / (rect.height / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
    });

    card.addEventListener('mouseleave', () => {
      // Reset (featured card stays scaled)
      if (card.classList.contains('featured-card')) {
        card.style.transform = 'scale(1.05)';
      } else {
        card.style.transform = '';
      }
    });

    // "Add to cart" button
    const btn = card.querySelector('.card-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const title = card.querySelector('.card-title')?.textContent || 'Produit';
        showToast(`🛒 ${title} ajouté au panier !`);
        btn.innerHTML = '<i class="ri-check-line"></i><span>Ajouté !</span>';
        btn.style.background = 'rgba(74, 222, 128, 0.15)';
        btn.style.borderColor = 'rgba(74, 222, 128, 0.4)';
        btn.style.color = '#4ADE80';

        setTimeout(() => {
          btn.innerHTML = '<i class="ri-shopping-cart-2-line"></i><span>Ajouter au panier</span>';
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2500);
      });
    }
  });
}

// ─────────────────────────────────────────────
// 10. CONTACT FORM
// ─────────────────────────────────────────────
function initContactForm() {
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';

    // Basic validation
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let valid = true;

    fields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#F87171';
      }
    });

    const emailField = form.querySelector('input[type="email"]');
    if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      valid = false;
      emailField.style.borderColor = '#F87171';
    }

    if (!valid) {
      feedback.textContent = '⚠️ Veuillez remplir correctement tous les champs.';
      feedback.className = 'form-feedback error';
      return;
    }

    // Simulate sending
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ri-loader-4-line"></i><span>Envoi en cours...</span>';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    await new Promise(r => setTimeout(r, 1500));

    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';

    feedback.textContent = '✅ Message envoyé avec succès ! Nous vous répondrons bientôt.';
    feedback.className = 'form-feedback success';
    form.reset();
    showToast('✉️ Message envoyé !');
  });
}

// ─────────────────────────────────────────────
// 11. TOAST NOTIFICATIONS
// ─────────────────────────────────────────────
let toastTimer;

function initToast() { /* Toast system is ready */ }

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ─────────────────────────────────────────────
// 12. SMOOTH SCROLL (polyfill fallback)
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─────────────────────────────────────────────
// 13. PERFORMANCE: Reduce motion preference
// ─────────────────────────────────────────────
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('*').forEach(el => {
    el.style.animationDuration     = '0.01ms';
    el.style.animationIterationCount = '1';
    el.style.transitionDuration    = '0.01ms';
  });
}
