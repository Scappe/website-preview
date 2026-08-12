(() => {
  'use strict';
  const root = document.querySelector('[data-decision-room]');
  if (!root) return;

  const mqDesktop = window.matchMedia('(min-width: 681px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs = Array.from(root.querySelectorAll('[data-decision-tab]'));
  const panels = Array.from(root.querySelectorAll('[data-decision-panel]'));
  const objections = Array.from(root.querySelectorAll('[data-objection-trigger]'));
  let active = 0;

  const activate = (index, moveFocus = false) => {
    active = Math.max(0, Math.min(index, tabs.length - 1));
    tabs.forEach((tab, i) => {
      const on = i === active;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      const panel = panels[i];
      if (panel) {
        panel.classList.toggle('is-active', on);
        panel.hidden = mqDesktop.matches && !on;
        panel.setAttribute('aria-hidden', mqDesktop.matches ? String(!on) : 'false');
      }
    });
    if (moveFocus) tabs[active]?.focus({ preventScroll: true });
  };

  const syncMode = () => {
    if (mqDesktop.matches) {
      root.classList.add('is-enhanced');
      activate(active);
    } else {
      root.classList.remove('is-enhanced');
      tabs.forEach(tab => { tab.tabIndex = 0; });
      panels.forEach(panel => {
        panel.hidden = false;
        panel.setAttribute('aria-hidden', 'false');
      });
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', event => {
      if (!mqDesktop.matches) return;
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== null) {
        event.preventDefault();
        activate(next, true);
      }
    });
  });

  objections.forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
    });
  });

  if (reduced) root.classList.add('is-reduced-motion');
  syncMode();
  mqDesktop.addEventListener?.('change', syncMode);
})();
