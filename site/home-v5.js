(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
  const lerp = (start, end, amount) => start + (end - start) * amount;

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.main-nav');

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

    const heroArt = document.querySelector('.hero-art');
    if (heroArt) {
      heroArt.addEventListener('pointermove', event => {
        const rect = heroArt.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        heroArt.querySelectorAll('[data-depth]').forEach(layer => {
          const depth = Number(layer.dataset.depth || 1);
          layer.style.translate = `${x * depth * 18}px ${y * depth * 14}px`;
        });
      });
      heroArt.addEventListener('pointerleave', () => {
        heroArt.querySelectorAll('[data-depth]').forEach(layer => { layer.style.translate = ''; });
      });
    }
  }

  const capabilityStage = document.querySelector('[data-capability-stage]');
  if (capabilityStage) {
    const nodes = [...capabilityStage.querySelectorAll('.capability-node')];
    const indexNode = document.querySelector('[data-capability-index]');
    const titleNode = document.querySelector('[data-capability-title]');
    const copyNode = document.querySelector('[data-capability-copy]');
    const linkNode = document.querySelector('[data-capability-link]');
    const coreTitle = capabilityStage.querySelector('[data-core-title]');
    const coreCopy = capabilityStage.querySelector('[data-core-copy]');

    const activate = node => {
      nodes.forEach(item => item.classList.toggle('active', item === node));
      const index = node.dataset.index || '01';
      const title = node.dataset.title || '';
      const copy = node.dataset.copy || '';
      const href = node.dataset.href || '/servizi';
      if (indexNode) indexNode.textContent = index;
      if (titleNode) titleNode.textContent = title;
      if (copyNode) copyNode.textContent = copy;
      if (linkNode) linkNode.href = href;
      if (coreTitle) coreTitle.textContent = title;
      if (coreCopy) coreCopy.textContent = node.dataset.short || copy;
    };

    nodes.forEach(node => {
      node.addEventListener('pointerenter', () => activate(node));
      node.addEventListener('focus', () => activate(node));
      node.addEventListener('click', event => {
        if (!node.classList.contains('active')) {
          event.preventDefault();
          activate(node);
        }
      });
    });
    if (nodes[0]) activate(nodes[0]);
  }

  const horizontalSections = [...document.querySelectorAll('[data-horizontal]')];
  const horizontalData = new Map();

  const measureHorizontal = () => {
    horizontalSections.forEach(section => {
      const track = section.querySelector('.project-track');
      if (!track || window.innerWidth <= 1080 || reduceMotion) {
        section.style.height = '';
        if (track) track.style.transform = '';
        horizontalData.delete(section);
        return;
      }
      const maxX = Math.max(track.scrollWidth - window.innerWidth, 0);
      const extra = Math.max(maxX, window.innerHeight * 1.2);
      section.style.height = `${window.innerHeight + extra}px`;
      horizontalData.set(section, { track, maxX });
    });
  };

  const updateHorizontal = () => {
    horizontalData.forEach(({ track, maxX }, section) => {
      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      const localProgress = clamp(-rect.top / scrollable);
      track.style.transform = `translate3d(${-maxX * localProgress}px,0,0)`;
      const counter = section.querySelector('[data-reel-counter]');
      if (counter) {
        const total = track.children.length;
        const active = Math.min(Math.floor(localProgress * total) + 1, total);
        counter.textContent = `${String(active).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
      }
    });
  };

  measureHorizontal();
  updateHorizontal();
  window.addEventListener('resize', () => {
    measureHorizontal();
    updateHorizontal();
  });
  window.addEventListener('scroll', updateHorizontal, { passive: true });

  const process = document.querySelector('.process-line');
  if (process && !reduceMotion) {
    const updateProcess = () => {
      const rect = process.getBoundingClientRect();
      const ratio = clamp((window.innerHeight * .78 - rect.top) / Math.max(rect.height, 1));
      process.style.setProperty('--process', ratio.toFixed(3));
    };
    updateProcess();
    window.addEventListener('scroll', updateProcess, { passive: true });
  }

  const canvas = document.querySelector('.ambient-canvas');
  if (canvas && !reduceMotion) {
    const context = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = 1;
    let mouseX = -1000;
    let mouseY = -1000;
    let particles = [];

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = coarsePointer ? 26 : Math.min(62, Math.floor(width / 24));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .18,
        vy: (Math.random() - .5) * .18,
        radius: Math.random() * 1.3 + .35
      }));
    };

    window.addEventListener('pointermove', event => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }, { passive: true });
    window.addEventListener('pointerleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.hypot(dx, dy);
        if (distance < 150 && distance > 0) {
          particle.x += (dx / distance) * (150 - distance) * .018;
          particle.y += (dy / distance) * (150 - distance) * .018;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = index % 3 === 0 ? 'rgba(255,90,174,.42)' : 'rgba(255,255,255,.25)';
        context.fill();

        for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
          const other = particles[otherIndex];
          const linkDistance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (linkDistance > 115) continue;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(255,255,255,${(1 - linkDistance / 115) * .07})`;
          context.stroke();
        }
      });
      requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    draw();
  }

  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', event => {
      if (reduceMotion || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
      const target = new URL(link.href, window.location.href);
      if (target.origin !== window.location.origin) return;
      if (target.pathname === window.location.pathname && target.hash) return;
      event.preventDefault();
      document.body.classList.add('is-leaving');
      window.setTimeout(() => { window.location.href = target.href; }, 430);
    });
  });
})();
