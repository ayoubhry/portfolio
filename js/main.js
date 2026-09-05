/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO – HOURAOUI Ayoub
   main.js · Version 1.1
   Vanilla JS — Aucune dépendance externe
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CANVAS BACKGROUND (Hero — Particules connectées)
───────────────────────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const ACCENT = '0, 200, 255';
  let width, height, particles;

  const CONFIG = {
    particleCount: 60,
    maxDist:       140,
    speed:         0.35,
    radius:        1.5,
  };

  function resize() {
    width  = canvas.width  = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x:  Math.random() * width,
      y:  Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.particleCount }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width)  p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

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
  window.addEventListener('resize', resize);
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
  let paused    = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; requestAnimationFrame(tick); }, 2200);
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
    if (!paused) type();
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

  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    burgerBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  burgerBtn.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burgerBtn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) closeMenu();
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

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0, 10);
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

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
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
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
  document.querySelectorAll('.skill-card[data-animate]').forEach((card, i) => {
    if (!card.dataset.delay) card.dataset.delay = i * 80;
  });
})();


/* ─────────────────────────────────────────────────────────────
   8. PROJECT CARDS — Staggered entry delay
───────────────────────────────────────────────────────────── */
(function initProjectStagger() {
  document.querySelectorAll('.project-card[data-animate]').forEach((card, i) => {
    if (!card.dataset.delay) card.dataset.delay = i * 80;
  });
})();


/* ─────────────────────────────────────────────────────────────
   9. THEME TOGGLE (Clair / Sombre)
───────────────────────────────────────────────────────────── */
(function initThemeToggle() {
  const html    = document.documentElement;
  const toggles = [
    document.getElementById('themeToggle'),
    document.getElementById('themeToggleMobile'),
  ].filter(Boolean);

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

  const toggleBtn = document.getElementById('socialSidebarToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const collapsed = sidebar.classList.toggle('is-collapsed');
      toggleBtn.setAttribute('aria-expanded', String(!collapsed));
      toggleBtn.setAttribute('aria-label', collapsed ? 'Afficher les raccourcis' : 'Réduire les raccourcis');
    });
  }
})();


/* ─────────────────────────────────────────────────────────────
   10bis. MODAL DÉTAIL — Expérience professionnelle
───────────────────────────────────────────────────────────── */
(function initExpModal() {
  const openBtn   = document.getElementById('expOpenBtn');
  const modal     = document.getElementById('expModal');
  const closeBtn  = document.getElementById('expModalClose');
  const backdrop  = document.getElementById('expModalBackdrop');
  if (!openBtn || !modal || !closeBtn || !backdrop) return;

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    openBtn.focus();
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();


/* ─────────────────────────────────────────────────────────────
   11. AUDIO BACKGROUND + ASSISTANT GIF
   ─────────────────────────────────────────────────────────────
   Structure assets requise :
     assets/audio/background.mp3     → musique de fond
     assets/audio/sfx/sfx1.mp3       → son 1 au clic (tes propres sons)
     assets/audio/sfx/sfx2.mp3       → son 2
     assets/audio/sfx/sfx3.mp3       → son 3
     assets/img/assistant.gif        → ton GIF animé
───────────────────────────────────────────────────────────── */
(function initAssistant() {

  /* ── Éléments DOM ── */
  const audio     = document.getElementById('bgMusic');
  const audioBtn  = document.getElementById('audioControl');
  const audioIcon = document.getElementById('audioIcon');
  const assistant = document.getElementById('assistant');
  const bubble    = document.getElementById('speechBubble');
  const bubbleText= document.getElementById('speechText');

  if (!assistant || !bubble) return;

  /* ── Sons custom (place tes fichiers dans assets/audio/sfx/) ── */
  const SFX_FILES = [
    'assets/audio/sfx/sfx1.mp3',
    'assets/audio/sfx/sfx2.mp3',
    'assets/audio/sfx/sfx3.mp3',
  ];
  // Pré-charge les objets Audio pour éviter le délai
  const sfxPool = SFX_FILES.map(src => {
    const a = new Audio(src);
    a.volume = 0.7;
    return a;
  });

  function playRandomSfx() {
    const sfx = sfxPool[Math.floor(Math.random() * sfxPool.length)];
    sfx.currentTime = 0;
    sfx.play().catch(() => {}); // silencieux si fichier absent
  }

  /* ── Messages affichés dans la bulle ── */
  const MESSAGES = [
    'Salut ! Bienvenue sur mon portfolio 👋',
    'Besoin d\'infos ? Contacte-moi !',
    'BTS SIO SISR · Lycée Jean Rostand · Caen',
    'Je suis à la recherche d\'un stage ou d\'une alternance !',
    'Passionné par les réseaux et la cybersécurité 🔐',
    'N\'hésite pas à télécharger mon CV ⬇️',
    'Portfolio fait maison en HTML / CSS / JS ✨',
    'Stack : Linux · Docker · Windows Server · Kali 🐧',
  ];

  let lastMsgIdx  = -1;
  let hideTimer   = null;
  let isShowing   = false;

  function getRandomMessage() {
    let idx;
    do { idx = Math.floor(Math.random() * MESSAGES.length); }
    while (idx === lastMsgIdx && MESSAGES.length > 1);
    lastMsgIdx = idx;
    return MESSAGES[idx];
  }

  /* ── Affiche la bulle avec effet de frappe ── */
  function showBubble(message) {
    // Annule le timer de fermeture en cours
    clearTimeout(hideTimer);

    // Affiche d'abord les points de chargement
    bubbleText.innerHTML =
      '<span class="typing-dots">' +
        '<span></span><span></span><span></span>' +
      '</span>';
    bubble.classList.remove('speech-bubble--hidden');
    isShowing = true;

    // Après un court délai : affiche le texte lettre par lettre
    setTimeout(() => {
      bubbleText.textContent = '';
      let i = 0;
      const interval = setInterval(() => {
        bubbleText.textContent += message[i];
        i++;
        if (i >= message.length) {
          clearInterval(interval);
          // Auto-fermeture après lecture
          hideTimer = setTimeout(hideBubble, 3500);
        }
      }, 38);
    }, 600);
  }

  /* ── Cache la bulle ── */
  function hideBubble() {
    bubble.classList.add('speech-bubble--hidden');
    isShowing = false;
  }

  /* ── Clic sur l'assistant ── */
  assistant.addEventListener('click', () => {
    playRandomSfx();

    // Animation de rebond
    assistant.classList.remove('bounce');
    void assistant.offsetWidth; // reset pour re-déclencher l'animation
    assistant.classList.add('bounce');
    assistant.addEventListener('animationend', () => {
      assistant.classList.remove('bounce');
    }, { once: true });

    // Affiche la bulle
    showBubble(getRandomMessage());
  });

  /* ── Clic en dehors → ferme la bulle ── */
  document.addEventListener('click', e => {
    if (isShowing && !assistant.contains(e.target) && !bubble.contains(e.target)) {
      clearTimeout(hideTimer);
      hideBubble();
    }
  });

  /* ────────────────────────────────────────────────────────
     Musique de fond : premier clic sur la page → lecture
  ──────────────────────────────────────────────────────── */
  if (audio) {
    document.addEventListener('click', () => {
      audio.play()
        .then(() => { audioIcon.className = 'fa-solid fa-volume-high'; })
        .catch(() => {});
    }, { once: true });

    audioBtn && audioBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (audio.paused) {
        audio.play();
        audioIcon.className = 'fa-solid fa-volume-high';
      } else {
        audio.pause();
        audioIcon.className = 'fa-solid fa-volume-xmark';
      }
    });
  }

})();


/* ─────────────────────────────────────────────────────────────
   BADGE 3D TROPHY TILT
   Tracks mouse position over each .cert-badge-wrap and applies
   a live rotateX/Y + golden shimmer, mimicking a Smash Bros trophy.
───────────────────────────────────────────────────────────── */
(function initBadgeTilt() {
  const MAX_TILT = 25;
  const MAX_GLOW = 22;

  document.querySelectorAll('.cert-badge-wrap').forEach(wrap => {
    const img = wrap.querySelector('.cert-badge-img');
    if (!img) return;

    // Inject shine overlay (already styled via CSS class)
    const shine = document.createElement('span');
    shine.className = 'cert-badge-shine';
    wrap.appendChild(shine);

    function onMove(e) {
      const rect = wrap.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width  / 2)));
      const dy   = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));

      const rotY  =  dx * MAX_TILT;
      const rotX  = -dy * MAX_TILT;
      const glowX =  dx * 10;
      const glowY =  dy * 10;

      img.style.transform =
        `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.1)`;
      img.style.filter =
        `brightness(1.13) drop-shadow(${glowX}px ${glowY}px ${MAX_GLOW}px rgba(255,200,60,.7))`;
      img.style.boxShadow =
        `${-rotY * .5}px ${rotX * .5}px 30px rgba(0,0,0,.28),
         0 0 0 2px rgba(255,190,50,.35)`;

      // Shimmer highlight follows cursor
      const shineX = 50 + dx * 38;
      const shineY = 50 + dy * 38;
      shine.style.backgroundImage =
        `radial-gradient(circle at ${shineX}% ${shineY}%,
           rgba(255,255,255,.6)  0%,
           rgba(255,255,255,.12) 45%,
           transparent 68%)`;
      shine.style.opacity = '1';
    }

    function onLeave() {
      img.style.transform = '';
      img.style.filter    = '';
      img.style.boxShadow = '';
      shine.style.opacity = '0';
    }

    wrap.addEventListener('mousemove',  onMove);
    wrap.addEventListener('mouseleave', onLeave);

    // Touch: static tilt on tap
    wrap.addEventListener('touchstart', () => {
      img.style.transform =
        `rotateY(-18deg) rotateX(10deg) scale(1.08)`;
      img.style.filter =
        `brightness(1.15) drop-shadow(-5px 8px 18px rgba(255,200,60,.65))`;
      shine.style.backgroundImage =
        `radial-gradient(circle at 35% 35%,
           rgba(255,255,255,.55) 0%, transparent 65%)`;
      shine.style.opacity = '1';
    }, { passive: true });
    wrap.addEventListener('touchend', onLeave);
  });
})();

/* ─────────────────────────────────────────────────────────────
   CISCO CERT 3D TILT (documents réels)
───────────────────────────────────────────────────────────── */
(function initCiscoCertTilt() {
  const MAX_TILT = 22;

  document.querySelectorAll('.cisco-cert-wrap').forEach(wrap => {
    const img   = wrap.querySelector('.cisco-cert-img');
    const shine = wrap.querySelector('.cisco-cert-shine');
    if (!img) return;

    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const dx = (e.clientX - rect.left)  / rect.width  - 0.5;
      const dy = (e.clientY - rect.top)   / rect.height - 0.5;
      const rotY =  dx * MAX_TILT;
      const rotX = -dy * MAX_TILT;
      img.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.04)`;
      const sx = 50 + dx * 40;
      const sy = 50 + dy * 40;
      shine.style.backgroundImage = `radial-gradient(circle at ${sx}% ${sy}%,
        rgba(255,255,255,.55) 0%, transparent 65%)`;
      shine.style.opacity = '1';
    });

    wrap.addEventListener('mouseleave', () => {
      img.style.transform   = 'rotateY(0deg) rotateX(0deg) scale(1)';
      shine.style.opacity   = '0';
    });

    // Touch support
    wrap.addEventListener('touchstart', e => {
      const t    = e.touches[0];
      const rect = wrap.getBoundingClientRect();
      const dx   = (t.clientX - rect.left)  / rect.width  - 0.5;
      const dy   = (t.clientY - rect.top)   / rect.height - 0.5;
      img.style.transform = `rotateY(${dx*MAX_TILT}deg) rotateX(${-dy*MAX_TILT}deg) scale(1.04)`;
      shine.style.backgroundImage = `radial-gradient(circle at ${50+dx*40}% ${50+dy*40}%,
        rgba(255,255,255,.55) 0%, transparent 65%)`;
      shine.style.opacity = '1';
    }, { passive: true });
    wrap.addEventListener('touchend', () => {
      img.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
      shine.style.opacity = '0';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   CARROUSEL CERTIFICATIONS CISCO
═══════════════════════════════════════════════════════════ */
function initCiscoCarousel() {
  const track   = document.getElementById('carouselTrack');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');
  const dotsEl  = document.getElementById('carouselDots');
  if (!track) return;

  const slides    = Array.from(track.querySelectorAll('.cisco-carousel__slide'));
  const total     = slides.length;
  let   current   = 0;

  /* Nombre de slides visibles selon la largeur */
  function visibleCount() {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  /* Largeur d'un slide + gap (en px) — recalculé à chaque appel pour éviter offsetWidth=0 */
  function slideWidth() {
    const gap   = 20; // 1.25rem ≈ 20px
    const wrapW = track.parentElement.getBoundingClientRect().width || track.parentElement.offsetWidth;
    const vis   = visibleCount();
    return (wrapW - gap * (vis - 1)) / vis + gap;
  }

  /* Crée les dots */
  function buildDots() {
    dotsEl.innerHTML = '';
    const pages = total - visibleCount() + 1;
    for (let i = 0; i < pages; i++) {
      const btn = document.createElement('button');
      btn.className = 'cisco-carousel__dot' + (i === current ? ' cisco-carousel__dot--active' : '');
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(btn);
    }
  }

  function updateDots() {
    dotsEl.querySelectorAll('.cisco-carousel__dot').forEach((d, i) => {
      d.classList.toggle('cisco-carousel__dot--active', i === current);
    });
  }

  function updateBtns() {
    btnPrev.disabled = current === 0;
    btnNext.disabled = current >= total - visibleCount();
  }

  function goTo(idx) {
    const maxIdx = Math.max(0, total - visibleCount());
    current = Math.min(Math.max(idx, 0), maxIdx);
    track.style.transform = `translateX(-${current * slideWidth()}px)`;
    updateDots();
    updateBtns();
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  /* Swipe tactile */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  });

  /* Recalcul au resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const maxIdx = Math.max(0, total - visibleCount());
      if (current > maxIdx) current = maxIdx;
      buildDots();
      goTo(current);
    }, 120);
  });

  /* Init */
  buildDots();
  updateBtns();
  goTo(0); // force recalcul après layout complet
}

/* ═══════════════════════════════════════════════════════════
   CARROUSEL BADGES
═══════════════════════════════════════════════════════════ */
function initBadgeCarousel() {
  const track   = document.getElementById('badgeCarouselTrack');
  const btnPrev = document.getElementById('badgeCarouselPrev');
  const btnNext = document.getElementById('badgeCarouselNext');
  const dotsEl  = document.getElementById('badgeCarouselDots');
  if (!track) return;

  const slides    = Array.from(track.querySelectorAll('.cisco-carousel__slide'));
  const total     = slides.length;
  let   current   = 0;

  function visibleCount() {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function slideWidth() {
    const gap   = 20;
    const wrapW = track.parentElement.getBoundingClientRect().width || track.parentElement.offsetWidth;
    const vis   = visibleCount();
    return (wrapW - gap * (vis - 1)) / vis + gap;
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    const pages = Math.max(1, total - visibleCount() + 1);
    for (let i = 0; i < pages; i++) {
      const btn = document.createElement('button');
      btn.className = 'cisco-carousel__dot' + (i === current ? ' cisco-carousel__dot--active' : '');
      btn.setAttribute('aria-label', `Badge ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(btn);
    }
  }

  function updateDots() {
    dotsEl.querySelectorAll('.cisco-carousel__dot').forEach((d, i) => {
      d.classList.toggle('cisco-carousel__dot--active', i === current);
    });
  }

  function updateBtns() {
    btnPrev.disabled = current === 0;
    btnNext.disabled = current >= total - visibleCount();
  }

  function goTo(idx) {
    const maxIdx = Math.max(0, total - visibleCount());
    current = Math.min(Math.max(idx, 0), maxIdx);
    track.style.transform = `translateX(-${current * slideWidth()}px)`;
    updateDots();
    updateBtns();
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const maxIdx = Math.max(0, total - visibleCount());
      if (current > maxIdx) current = maxIdx;
      buildDots();
      goTo(current);
    }, 120);
  });

  /* Init */
  buildDots();
  updateBtns();
  goTo(0); // force recalcul après layout complet
}

/* Lance les deux carrousels une fois que tout le layout est prêt */
if (document.readyState === 'complete') {
  initCiscoCarousel();
  initBadgeCarousel();
} else {
  window.addEventListener('load', () => {
    initCiscoCarousel();
    initBadgeCarousel();
  });
}
