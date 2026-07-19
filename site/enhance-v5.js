(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const clamp = value => Math.min(Math.max(value, 0), 1);
  const progress = document.createElement('div');
  progress.className = 'v5-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const transition = document.createElement('div');
  transition.className = 'v5-page-transition';
  transition.setAttribute('aria-hidden', 'true');
  document.body.append(transition);

  const updateProgress = () => {
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    progress.style.transform = `scaleX(${clamp(window.scrollY / max)})`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  document.querySelectorAll('.btn,.nav-cta,.service-card,.feature,.value-card,.team-card,.career-card,.contact-info,.contact-form,.case-row').forEach(element => {
    element.addEventListener('pointermove', event => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      element.style.setProperty('--mx', `${x}px`);
      element.style.setProperty('--my', `${y}px`);
      element.style.setProperty('--spot-x', `${x}px`);
      element.style.setProperty('--spot-y', `${y}px`);
    });
  });

  if (!reduceMotion && !coarsePointer) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'v5-cursor-dot';
    ring.className = 'v5-cursor-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    window.addEventListener('pointermove', event => {
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x - 3}px,${y - 3}px,0)`;
    }, { passive: true });
    const animate = () => {
      rx += (x - rx) * .16;
      ry += (y - ry) * .16;
      ring.style.transform = `translate3d(${rx - ring.offsetWidth / 2}px,${ry - ring.offsetHeight / 2}px,0)`;
      requestAnimationFrame(animate);
    };
    animate();
    document.querySelectorAll('a,button,.service-card,.case-row').forEach(element => {
      element.addEventListener('pointerenter', () => ring.classList.add('active'));
      element.addEventListener('pointerleave', () => ring.classList.remove('active'));
    });
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
