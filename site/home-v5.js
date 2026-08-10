(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
  const lerp = (start, end, amount) => start + (end - start) * amount;

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const menuButton = document.querySelector('.menu-toggle, .menu-button');
  const nav = document.querySelector('.nav, .main-nav');

  const updateScrollUI = () => {
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const ratio = clamp(window.scrollY / max);
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    header?.classList.toggle('scrolled', window.scrollY > 22);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Apri il menu');
  };

  menuButton?.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    nav?.classList.toggle('open', opening);
    document.body.classList.toggle('menu-open', opening);
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Chiudi il menu' : 'Apri il menu');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', event => event.key === 'Escape' && closeMenu());

  const revealItems = document.querySelectorAll('.reveal, .clip-reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -50px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
      revealObserver.observe(item);
    });
  }

  document.querySelectorAll('[data-year]').forEach(node => {
    node.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll('.button, .header-cta, .spotlight').forEach(element => {
    element.addEventListener('pointermove', event => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      element.style.setProperty('--my', `${event.clientY - rect.top}px`);
      element.style.setProperty('--x', `${event.clientX - rect.left}px`);
      element.style.setProperty('--y', `${event.clientY - rect.top}px`);
    });
  });

  if (!reduceMotion && !coarsePointer) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;

    window.addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (dot) dot.style.transform = `translate3d(${pointerX - 3}px,${pointerY - 3}px,0)`;
    }, { passive: true });

    const cursorLoop = () => {
      ringX = lerp(ringX, pointerX, .16);
      ringY = lerp(ringY, pointerY, .16);
      if (ring) ring.style.transform = `translate3d(${ringX - ring.offsetWidth / 2}px,${ringY - ring.offsetHeight / 2}px,0)`;
      requestAnimationFrame(cursorLoop);
    };
    cursorLoop();

    document.querySelectorAll('a,button,.reel-card,.project-frame').forEach(element => {
      element.addEventListener('pointerenter', () => ring?.classList.add('active'));
      element.addEventListener('pointerleave', () => ring?.classList.remove('active'));
    });

    document.querySelectorAll('[data-magnetic], .button, .header-cta').forEach(element => {
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate3d(${x * .12}px,${y * .14}px,0)`;
      });
      element.addEventListener('pointerleave', () => {
        element.style.transform = '';
      });
    });

    document.querySelectorAll('[data-tilt]').forEach(element => {
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - .5;
        const py = (event.clientY - rect.top) / rect.height - .5;
        element.style.transform = `perspective(1100px) rotateX(${-py * 7}deg) rotateY(${px * 8}deg) translateZ(8px)`;
      });
      element.addEventListener('pointerleave', () => {
        element.style.transform = '';
      });
    });

    document.querySelectorAll('[data-depth]').forEach(element => {
      const depth = Number(element.dataset.depth || 1);
      window.addEventListener('pointermove', event => {
        const x = (event.clientX / window.innerWidth - .5) * depth * 10;
        const y = (event.clientY / window.innerHeight - .5) * depth * 8;
        element.style.translate = `${x}px ${y}px`;
      }, { passive: true });
    });
  }

  const stage = document.querySelector('[data-capability-stage]');
  if (stage) {
    const nodes = [...stage.querySelectorAll('.capability-node')];
    const title = document.querySelector('[data-capability-title]');
    const copy = document.querySelector('[data-capability-copy]');
    const link = document.querySelector('[data-capability-link]');
    const index = document.querySelector('[data-capability-index]');
    const coreTitle = document.querySelector('[data-core-title]');
    const coreCopy = document.querySelector('[data-core-copy]');

    const setActive = node => {
      nodes.forEach(item => item.classList.toggle('active', item === node));
      if (title) title.textContent = node.dataset.title || '';
      if (copy) copy.textContent = node.dataset.copy || '';
      if (link) link.href = node.dataset.href || '#';
      if (index) index.textContent = node.dataset.index || '';
      if (coreTitle) coreTitle.textContent = node.dataset.title || '';
      if (coreCopy) coreCopy.textContent = node.dataset.short || '';
    };

    nodes.forEach(node => {
      node.addEventListener('pointerenter', () => setActive(node));
      node.addEventListener('focus', () => setActive(node));
      node.addEventListener('click', event => {
        if (coarsePointer && !node.classList.contains('active')) {
          event.preventDefault();
          setActive(node);
        }
      });
    });
  }

  const horizontal = document.querySelector('[data-horizontal]');
  if (horizontal && !reduceMotion && window.matchMedia('(min-width: 861px)').matches) {
    const sticky = horizontal.querySelector('.sticky-projects');
    const track = horizontal.querySelector('.project-track');
    const cards = [...horizontal.querySelectorAll('.reel-card')];
    const counter = horizontal.querySelector('[data-reel-counter]');
    let raf = 0;
    const updateReel = () => {
      raf = 0;
      const rect = horizontal.getBoundingClientRect();
      const progressValue = clamp(-rect.top / Math.max(horizontal.offsetHeight - window.innerHeight, 1));
      const maxShift = Math.max(track.scrollWidth - window.innerWidth + 140, 0);
      track.style.transform = `translate3d(${-progressValue * maxShift}px,0,0)`;
      const activeIndex = Math.min(cards.length - 1, Math.floor(progressValue * cards.length));
      cards.forEach((card, i) => card.classList.toggle('active', i === activeIndex));
      if (counter) counter.textContent = `${String(activeIndex + 1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
    };
    window.addEventListener('scroll', () => {
      if (!raf) raf = requestAnimationFrame(updateReel);
    }, { passive: true });
    window.addEventListener('resize', updateReel, { passive: true });
    updateReel();
    if (sticky) sticky.style.willChange = 'transform';
  }

  document.querySelectorAll('[data-mobile-depth]').forEach((card, index) => {
    if (!coarsePointer || reduceMotion) return;
    card.style.setProperty('--mobile-depth', String(index));
  });

  const pageTransition = document.querySelector('.page-transition');
  if (pageTransition && !reduceMotion) {
    document.querySelectorAll('a[href]').forEach(link => {
      const url = link.getAttribute('href') || '';
      if (!url.startsWith('/') || url.startsWith('//')) return;
      link.addEventListener('click', event => {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const target = new URL(link.href, location.href);
        if (target.pathname === location.pathname && target.hash) return;
        event.preventDefault();
        pageTransition.classList.add('active');
        window.setTimeout(() => { location.href = link.href; }, 280);
      });
    });
  }
})();