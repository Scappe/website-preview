(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Apri il menu');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Chiudi il menu' : 'Apri il menu');
    nav?.classList.toggle('open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
      observer.observe(item);
    });
    window.setTimeout(() => {
      revealItems.forEach(item => item.classList.add('is-visible'));
      observer.disconnect();
    }, 1800);
  }

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const opening = button.getAttribute('aria-expanded') !== 'true';
      document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(open => {
        if (open !== button) open.setAttribute('aria-expanded', 'false');
      });
      button.setAttribute('aria-expanded', String(opening));
    });
  });

  document.querySelectorAll('[data-year]').forEach(node => {
    node.textContent = String(new Date().getFullYear());
  });

  const form = document.querySelector('[data-whatsapp-form]');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const company = String(data.get('company') || '').trim();
    const service = String(data.get('service') || '').trim();
    const message = String(data.get('message') || '').trim();
    const status = form.querySelector('.form-status');

    if (!name || !phone || !message) {
      if (status) status.textContent = 'Compila nome, telefono e obiettivo principale.';
      return;
    }

    const text = [
      'Ciao Axante, vorrei parlarvi del mio progetto.',
      '',
      `Nome: ${name}`,
      company ? `Azienda/progetto: ${company}` : '',
      `Telefono: ${phone}`,
      service ? `Servizio: ${service}` : '',
      `Obiettivo o problema: ${message}`
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/393271706981?text=${encodeURIComponent(text)}`;
    if (status) status.textContent = 'Apro WhatsApp con il messaggio già compilato…';
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();