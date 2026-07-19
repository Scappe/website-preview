(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

  const resetTransition = () => {
    document.body.classList.remove('is-leaving');
  };

  resetTransition();
  window.addEventListener('pageshow', resetTransition);
  window.addEventListener('pagehide', () => window.setTimeout(resetTransition, 900));
  window.setTimeout(resetTransition, 1800);

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;

    let target;
    try {
      target = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    if (target.origin !== window.location.origin) return;
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    const targetPath = target.pathname.replace(/\/+$/, '') || '/';
    const samePage = currentPath === targetPath && !target.hash;

    if (samePage) {
      event.preventDefault();
      event.stopImmediatePropagation();
      resetTransition();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }

    window.setTimeout(resetTransition, 1600);
  }, true);

  const forceReveals = () => {
    document.querySelectorAll('.reveal,.clip-reveal').forEach(element => element.classList.add('visible'));
  };
  window.setTimeout(forceReveals, 1100);
  window.addEventListener('load', () => window.setTimeout(forceReveals, 250));
  window.addEventListener('pageshow', forceReveals);

  const handleBrokenImage = image => {
    if (image.dataset.failureHandled === 'true') return;
    image.dataset.failureHandled = 'true';
    const holder = image.closest('.case-media,.project-frame,.reel-card,.node-media');
    if (holder) {
      holder.classList.add('image-failed');
      if (!holder.dataset.project) holder.dataset.project = image.alt || 'Progetto Axante';
    }
    image.hidden = true;
  };

  const inspectImage = image => {
    if (image.complete && image.naturalWidth === 0) handleBrokenImage(image);
    image.addEventListener('error', () => handleBrokenImage(image), { once: true });
  };
  document.querySelectorAll('img').forEach(inspectImage);

  if (!reduceMotion) {
    const observed = document.querySelectorAll('.case-study,.reel-card,[data-mobile-depth]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
      }, { threshold: .2, rootMargin: '-6% 0px -8%' });
      observed.forEach(element => observer.observe(element));
    } else {
      observed.forEach(element => element.classList.add('in-view'));
    }

    if (coarsePointer || window.innerWidth <= 680) {
      let ticking = false;
      const updateMobileDepth = () => {
        ticking = false;
        const viewportCenter = window.innerHeight / 2;
        document.querySelectorAll('[data-mobile-depth],.case-study,.reel-card').forEach(element => {
          const rect = element.getBoundingClientRect();
          if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;
          const center = rect.top + rect.height / 2;
          const normalized = clamp((center - viewportCenter) / Math.max(window.innerHeight, 1), -1, 1);
          const distance = Math.abs(normalized);
          element.style.setProperty('--mobile-y', `${normalized * -10}px`);
          element.style.setProperty('--mobile-rotate', `${normalized * 0.7}deg`);
          element.style.setProperty('--mobile-scale', `${1 - distance * 0.018}`);
        });
      };

      const requestDepthUpdate = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateMobileDepth);
      };
      updateMobileDepth();
      window.addEventListener('scroll', requestDepthUpdate, { passive: true });
      window.addEventListener('resize', requestDepthUpdate);

      document.addEventListener('pointerdown', event => {
        const spark = document.createElement('span');
        spark.className = 'tap-spark';
        spark.style.left = `${event.clientX}px`;
        spark.style.top = `${event.clientY}px`;
        document.body.appendChild(spark);
        window.setTimeout(() => spark.remove(), 700);
      }, { passive: true });
    }
  }

  const enforceViewportWidth = () => {
    document.documentElement.style.maxWidth = '100%';
    document.documentElement.style.overflowX = 'clip';
    document.body.style.maxWidth = '100%';
  };
  enforceViewportWidth();
  window.addEventListener('resize', enforceViewportWidth);
})();
