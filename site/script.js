(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 14);
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
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Chiudi il menu' : 'Apri il menu');
    nav?.classList.toggle('open', opening);
    document.body.classList.toggle('menu-open', opening);
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.11, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
      observer.observe(item);
    });
    window.setTimeout(() => {
      revealItems.forEach(item => item.classList.add('visible'));
    }, 1800);
  }

  document.querySelectorAll('.faq-button').forEach(button => {
    button.addEventListener('click', () => {
      const opening = button.getAttribute('aria-expanded') !== 'true';
      document.querySelectorAll('.faq-button[aria-expanded="true"]').forEach(open => {
        if (open !== button) open.setAttribute('aria-expanded', 'false');
      });
      button.setAttribute('aria-expanded', String(opening));
    });
  });

  document.querySelectorAll('[data-year]').forEach(node => {
    node.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll('[data-counter]').forEach(counter => {
    const target = Number(counter.dataset.counter || 0);
    const suffix = counter.dataset.suffix || '';
    if (!Number.isFinite(target) || reduceMotion) {
      counter.textContent = `${target}${suffix}`;
      return;
    }
    const run = () => {
      const start = performance.now();
      const duration = 950;
      const frame = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      }, { threshold: .6 });
      observer.observe(counter);
    } else run();
  });

  const form = document.querySelector('[data-whatsapp-form]');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const company = String(data.get('company') || '').trim();
    const service = String(data.get('service') || '').trim();
    const budget = String(data.get('budget') || '').trim();
    const message = String(data.get('message') || '').trim();
    const status = form.querySelector('.form-status');

    if (!name || !phone || !message) {
      if (status) status.textContent = 'Compila nome, telefono e obiettivo del progetto.';
      return;
    }

    const text = [
      'Ciao Axante, vorrei richiedere un confronto sul mio progetto.',
      '',
      `Nome: ${name}`,
      company ? `Azienda/progetto: ${company}` : '',
      `Telefono: ${phone}`,
      service ? `Servizio: ${service}` : '',
      budget ? `Budget indicativo: ${budget}` : '',
      `Obiettivo o problema: ${message}`
    ].filter(Boolean).join('\n');

    if (status) status.textContent = 'Apro WhatsApp con il messaggio già compilato…';
    window.open(`https://wa.me/393271706981?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  });
})();
