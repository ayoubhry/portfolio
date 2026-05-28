/**
 * PORTFOLIO - HOURAOUI Ayoub
 * Script JavaScript Principal (Style Épuré Google Store)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* 1. INTERRUPTEUR DE MODE (CLAIR / SOMBRE) */
  const toggleBtn = document.getElementById('themeToggle');
  const toggleBtnMobile = document.getElementById('themeToggleMobile');
  const htmlElement = document.documentElement;

  // Détermine le thème initial : choix sauvé ou préférence système
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  htmlElement.setAttribute('data-theme', initialTheme);

  function switchTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', switchTheme);
  if (toggleBtnMobile) toggleBtnMobile.addEventListener('click', switchTheme);


  /* 2. EFFET SCROLL NAVBAR STICKY & RECONNAISSANCE DES LIENS */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('main section[id]');

  function handleNavbarScroll() {
    // Rend la barre fixe opaque au scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active le lien correspondant à la section affichée
    let currentSectionId = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
    });
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* 3. RESPONSIVE MENU SUR MOBILE (BURGER) */
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinksList = document.getElementById('navLinks');

  if (burgerBtn && navLinksList) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = navLinksList.classList.toggle('open');
      burgerBtn.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fermeture automatique lors d'un clic sur une section
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('open');
        burgerBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  /* 4. ANIMATION DOUCE AU SCROLL (INTERSECTION OBSERVER) */
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if (animatedElements.length > 0) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delayAttr = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, parseInt(delayAttr, 10));
          scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    animatedElements.forEach(el => scrollObserver.observe(el));
  }


  /* 5. HEURE ET ANNÉE DYNAMIQUE DANS LE FOOTER */
  const footerYear = document.getElementById('year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});
