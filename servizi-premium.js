(() => {
  'use strict';
  const root = document.querySelector('[data-service-proof]');
  if (!root) return;

  const tabs = [...root.querySelectorAll('[data-proof-tab]')];
  const panels = [...root.querySelectorAll('[data-proof-panel]')];
  const wide = window.matchMedia('(min-width: 701px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let token = 0;

  const cancelAnimations = panel => {
    panel.getAnimations?.({ subtree: true }).forEach(animation => {
      try { animation.cancel(); } catch {}
    });
  };

  const cancelAll = () => panels.forEach(cancelAnimations);

  const commitState = index => {
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
      panel.style.display = on ? '' : 'none';
      panel.style.opacity = '';
      panel.style.transform = '';
    });
    active = index;
  };

  const activate = async (index, focus = false) => {
    if (index < 0 || index >= panels.length) return;

    const run = ++token;
    const committed = active;
    commitState(committed);

    if (index === committed) {
      if (focus) tabs[index]?.focus();
      return;
    }

    if (!wide.matches || reduce.matches || !panels[index]?.animate) {
      commitState(index);
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
    to.style.display = '';
    to.setAttribute('aria-hidden', 'false');
    to.classList.add('is-active');

    const fromMedia = from.querySelector('.proof-media');
    const toMedia = to.querySelector('.proof-media');
    const fromCopy = from.querySelector('.proof-copy');
    const toCopy = to.querySelector('.proof-copy');

    const animations = [
      from.animate(
        [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(-24px)' }],
        { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
      ),
      to.animate(
        [{ opacity: 0, transform: 'translateX(30px)' }, { opacity: 1, transform: 'translateX(0)' }],
        { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }
      ),
      toMedia?.animate(
        [{ clipPath: 'inset(8% 9% 8% 9%)', transform: 'scale(.975)' }, { clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' }],
        { duration: 560, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
      ),
      toCopy?.animate(
        [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 430, delay: 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
      ),
      fromMedia?.animate(
        [{ clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' }, { clipPath: 'inset(6% 7% 6% 7%)', transform: 'scale(.985)' }],
        { duration: 300, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
      ),
      fromCopy?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 210, fill: 'forwards' })
    ].filter(Boolean);

    await Promise.all(animations.map(animation => animation.finished.catch(() => null)));
    if (run !== token) return;

    commitState(index);
    if (focus) tabs[index]?.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
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
    commitState(Math.min(active, tabs.length - 1));
  };

  wide.addEventListener?.('change', sync);
  reduce.addEventListener?.('change', sync);
  commitState(0);
})();
