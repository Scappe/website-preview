(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-problem-tab]')];
  const panels = [...document.querySelectorAll('[data-problem-panel]')];
  if (!tabs.length || !panels.length) return;

  const desktop = window.matchMedia('(min-width: 701px)');
  const activate = (index, focus = false) => {
    if (!desktop.matches) return;
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.setAttribute('tabindex', active ? '0' : '-1');
      panels[i]?.classList.toggle('is-active', active);
      panels[i]?.toggleAttribute('hidden', !active);
    });
    if (focus) tabs[index]?.focus();
  };

  const syncLayout = () => {
    if (desktop.matches) {
      const current = Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));
      activate(current);
    } else {
      tabs.forEach(tab => tab.setAttribute('tabindex', '-1'));
      panels.forEach(panel => {
        panel.hidden = false;
        panel.classList.add('is-active');
      });
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', event => {
      if (!desktop.matches) return;
      if (!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else next = (index - 1 + tabs.length) % tabs.length;
      activate(next, true);
    });
  });

  desktop.addEventListener?.('change', syncLayout);
  syncLayout();
})();