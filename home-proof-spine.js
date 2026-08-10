(() => {
  'use strict';
  const root = document.querySelector('[data-proof-spine]');
  if (!root) return;

  const mqDesktop = window.matchMedia('(min-width: 681px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs = Array.from(root.querySelectorAll('[data-proof-tab]'));
  const panels = Array.from(root.querySelectorAll('[data-proof-panel]'));
  if (!tabs.length || tabs.length !== panels.length) return;

  let active = 0;

  const activate = (index, moveFocus = false) => {
    active = Math.max(0, Math.min(index, tabs.length - 1));
    tabs.forEach((tab, i) => {
      const on = i === active;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].classList.toggle('is-active', on);
      panels[i].setAttribute('aria-hidden', mqDesktop.matches ? String(!on) : 'false');
    });
    if (moveFocus) tabs[active].focus({ preventScroll: true });
  };

  const syncMode = () => {
    if (mqDesktop.matches) {
      root.classList.add('is-enhanced');
      activate(active);
    } else {
      root.classList.remove('is-enhanced');
      panels.forEach(panel => panel.setAttribute('aria-hidden', 'false'));
      tabs.forEach(tab => { tab.tabIndex = 0; });
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', event => {
      if (!mqDesktop.matches) return;
      let next = null;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== null) {
        event.preventDefault();
        activate(next, true);
      }
    });
  });

  if (reduced) root.classList.add('is-reduced-motion');
  syncMode();
  mqDesktop.addEventListener?.('change', syncMode);
})();
