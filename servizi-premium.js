(() => {
  'use strict';
  const root = document.querySelector('[data-service-proof]');
  if (!root) return;

  const tabs = [...root.querySelectorAll('[data-proof-tab]')];
  const panels = [...root.querySelectorAll('[data-proof-panel]')];
  const desktop = window.matchMedia('(min-width: 701px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let token = 0;

  const cancelAnimations = panel => {
    panel.getAnimations?.({ subtree: true }).forEach(animation => {
      try { animation.cancel(); } catch {}
    });
  };

  const cancelAll = () => panels.forEach(cancelAnimations);

  const commitDesktopState = index => {
    cancelAll();
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.setAttribute('tabindex', on ? '0' : '-1');
    });
    panels.forEach((panel, i) => {
      const on = i === index;
      panel.classList.toggle('is-active', on);
      panel.toggleAttribute('hidden', !on);
      panel.setAttribute('aria-hidden', String(!on));
      panel.style.opacity = '';
      panel.style.transform = '';
    });
    active = index;
  };

  const exposeMobileState = () => {
    cancelAll();
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === active));
      tab.setAttribute('tabindex', '-1');
    });
    panels.forEach(panel => {
      panel.hidden = false;
      panel.classList.add('is-active');
      panel.setAttribute('aria-hidden', 'false');
      panel.style.opacity = '';
      panel.style.transform = '';
    });
  };

  const activate = async (index, focus = false) => {
    if (!desktop.matches || index < 0 || index >= panels.length) return;

    const run = ++token;
    const committed = active;

    // Reconcile any interrupted transition back to the last committed state first.
    // This guarantees stale animation callbacks cannot leave ghost panels/classes behind.
    commitDesktopState(committed);

    if (index === committed) {
      if (focus) tabs[index]?.focus();
      return;
    }

    const from = panels[committed];
    const to = panels[index];

    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.setAttribute('tabindex', i === index ? '0' : '-1');
    });

    to.hidden = false;
    to.setAttribute('aria-hidden', 'false');
    to.classList.add('is-active');

    if (reduce.matches || !to.animate) {
      if (run === token) commitDesktopState(index);
      if (focus) tabs[index]?.focus();
      return;
    }

    const fromVisual = from.querySelector('.proof-visual');
    const toVisual = to.querySelector('.proof-visual');
    const fromCopy = from.querySelector('.proof-copy');
    const toCopy = to.querySelector('.proof-copy');
    const animations = [
      from.animate(
        [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(-28px)' }],
        { duration: 320, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
      ),
      to.animate(
        [{ opacity: 0, transform: 'translateX(34px)' }, { opacity: 1, transform: 'translateX(0)' }],
        { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }
      ),
      toVisual?.animate(
        [{ clipPath: 'inset(14% 18% 14% 18% round 28px)', transform: 'scale(.96)' }, { clipPath: 'inset(0 0 0 0 round 0)', transform: 'scale(1)' }],
        { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
      ),
      toCopy?.animate(
        [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 460, delay: 70, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
      ),
      fromVisual?.animate(
        [{ clipPath: 'inset(0 0 0 0 round 0)', transform: 'scale(1)' }, { clipPath: 'inset(9% 13% 9% 13% round 24px)', transform: 'scale(.97)' }],
        { duration: 350, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
      ),
      fromCopy?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' })
    ].filter(Boolean);

    await Promise.all(animations.map(animation => animation.finished.catch(() => null)));
    if (run !== token) return;

    commitDesktopState(index);
    if (focus) tabs[index]?.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', event => {
      if (!desktop.matches || !['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else next = (index - 1 + tabs.length) % tabs.length;
      activate(next, true);
    });
  });

  const sync = () => {
    token++;
    if (desktop.matches) commitDesktopState(Math.min(active, tabs.length - 1));
    else exposeMobileState();
  };

  desktop.addEventListener?.('change', sync);
  reduce.addEventListener?.('change', sync);
  commitDesktopState(0);
  sync();
})();