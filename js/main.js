/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO – HOURAOUI Ayoub
   main.js · Version 1.0
   Vanilla JS — Aucune dépendance externe
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CANVAS BACKGROUND (Hero — Particules connectées)
───────────────────────────────────────────────────────────── */
(function initCanvas() {
  const canvas  = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const ACCENT  = '0, 200, 255';
  let   width, height, particles;

  const CONFIG = {
    particleCount : 60,
    maxDist       : 140,
    speed         : 0.35,
    radius        : 1.5,
  };

  function resize() {
    width  = canvas.width  = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x  : Math.random() * width,
      y  : Math.random() * height,
      vx : (Math.random() - 0.5) * CONFIG.speed,
      vy : (Math.random() - 0.5) * CONFIG.speed,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.particleCount }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Update positions
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width)  p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxDist) {
          const alpha = 1 - dist / CONFIG.maxDist;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${ACCENT}, ${alpha * 0.35})`;
          ctx.lineWidth   = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, CONFIG.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT}, 0.6)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
})();


/* ─────────────────────────────────────────────────────────────
   2. TYPEWRITER EFFECT (Hero subtitle)
───────────────────────────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'BTS SIO · Option SISR',
    'Infrastructure & Réseaux',
    'Cybersécurité',
    'Windows Server & Linux',
    'Recherche de stage',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pause     = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; requestAnimationFrame(tick); }, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    setTimeout(tick, deleting ? 45 : 85);
  }

  function tick() {
    if (!pause) type();
  }

  setTimeout(tick, 800);
})();


/* ─────────────────────────────────────────────────────────────
   3. NAVBAR — Scroll + Active link + Mobile menu
───────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav__link');
  const burgerBtn = document.getElementById('burgerBtn');
  const navMenu   = document.getElementById('navLinks');
  const sections  = document.querySelectorAll('main section[id]');

  // ── Scroll style
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  }

  // ── Active link on scroll
  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  // ── Mobile burger toggle
  burgerBtn.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burgerBtn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // ── Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burgerBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Close menu on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      burgerBtn.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─────────────────────────────────────────────────────────────
   4. SCROLL ANIMATIONS (Intersection Observer)
───────────────────────────────────────────────────────────── */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0, 10);
          setTimeout(() => entry.target.classList.add('in-view'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────────────────────
   5. SMOOTH SCROLL (Fallback pour ancres)
───────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70; // hauteur navbar
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────────────────────────
   6. FOOTER — Année dynamique
───────────────────────────────────────────────────────────── */
(function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ─────────────────────────────────────────────────────────────
   7. SKILL CARDS — Staggered entry delay
───────────────────────────────────────────────────────────── */
(function initSkillStagger() {
  const cards = document.querySelectorAll('.skill-card[data-animate]');
  cards.forEach((card, i) => {
    if (!card.dataset.delay) {
      card.dataset.delay = i * 80;
    }
  });
})();



/* ─────────────────────────────────────────────────────────────
   8. PROJECT CARDS — Staggered entry delay
───────────────────────────────────────────────────────────── */
(function initProjectStagger() {
  const cards = document.querySelectorAll('.project-card[data-animate]');
  cards.forEach((card, i) => {
    if (!card.dataset.delay) {
      card.dataset.delay = i * 80;
    }
  });
})();

/* ─────────────────────────────────────────────────────────────
   9. THEME TOGGLE (Clair / Sombre)
───────────────────────────────────────────────────────────── */
(function initThemeToggle() {
  const html      = document.documentElement;
  const toggles   = [
    document.getElementById('themeToggle'),
    document.getElementById('themeToggleMobile'),
  ].filter(Boolean);

  // Restore saved preference
  const saved = localStorage.getItem('theme');
  if (saved) html.setAttribute('data-theme', saved);

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'light';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  });
})();


/* ─────────────────────────────────────────────────────────────
   10. SOCIAL SIDEBAR — Apparition au scroll
───────────────────────────────────────────────────────────── */
(function initSocialSidebar() {
  const sidebar = document.getElementById('socialSidebar');
  if (!sidebar) return;

  function onScroll() {
    sidebar.classList.toggle('visible', window.scrollY > 200);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

