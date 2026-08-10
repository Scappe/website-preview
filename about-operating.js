(() => {
  const room = document.querySelector('[data-operating-room]');
  if (!room) return;

  const tabs = Array.from(room.querySelectorAll('[role="tab"]'));
  const panels = Array.from(room.querySelectorAll('[role="tabpanel"]'));
  if (!tabs.length || tabs.length !== panels.length) return;

  const activate = (next, focus = false) => {
    tabs.forEach((tab, index) => {
      const active = tab === next;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
      panels[index].hidden = !active;
    });
    if (focus) next.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      let target = null;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') target = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === 'Home') target = tabs[0];
      if (event.key === 'End') target = tabs[tabs.length - 1];
      if (!target) return;
      event.preventDefault();
      activate(target, true);
    });
  });

  activate(tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0]);
  room.classList.add('is-ready');
})();