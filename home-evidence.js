(() => {
  const root = document.querySelector('[data-evidence-hero]');
  if (!root) return;

  const states = [...root.querySelectorAll('[data-evidence-state]')];
  const detail = root.querySelector('[data-evidence-detail]');
  const detailLabel = root.querySelector('[data-evidence-detail-label]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 981px)').matches;
  let index = 0;
  let timer = null;
  let userInteracted = false;

  const select = (next, focus = false) => {
    index = Math.max(0, Math.min(states.length - 1, next));
    states.forEach((state, i) => {
      const active = i === index;
      state.setAttribute('aria-selected', String(active));
      state.tabIndex = active ? 0 : -1;
    });
    const current = states[index];
    if (detail) detail.textContent = current.dataset.detail || '';
    if (detailLabel) detailLabel.textContent = current.dataset.label || '';
    if (focus) current.focus();
  };

  const stop = () => {
    userInteracted = true;
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  states.forEach((state, i) => {
    state.addEventListener('click', () => { stop(); select(i); });
    state.addEventListener('focus', () => { if (document.activeElement === state) select(i); });
    state.addEventListener('keydown', event => {
      if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
      event.preventDefault();
      stop();
      if (event.key === 'Home') return select(0, true);
      if (event.key === 'End') return select(states.length - 1, true);
      const delta = ['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1;
      select((i + delta + states.length) % states.length, true);
    });
  });

  root.addEventListener('pointerdown', stop, { passive: true });
  root.addEventListener('mouseenter', stop, { once: true });
  root.addEventListener('focusin', () => { if (!userInteracted) stop(); }, { once: true });

  select(0);
  if (desktop && !reduced) {
    timer = window.setInterval(() => {
      if (userInteracted) return;
      select((index + 1) % states.length);
    }, 2100);
    window.setTimeout(() => {
      if (timer) window.clearInterval(timer);
      timer = null;
    }, 8400);
  }
})();
