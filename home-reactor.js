(() => {
  const root = document.querySelector('[data-reactor]');
  if (!root) return;

  const tabs = [...root.querySelectorAll('[data-reactor-tab]')];
  const scenes = [...root.querySelectorAll('[data-reactor-scene]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let locked = false;

  const setActive = (next) => {
    if (next === active || next < 0 || next >= scenes.length) return;
    const outgoing = scenes[active];
    const incoming = scenes[next];
    tabs[active]?.setAttribute('aria-selected', 'false');
    tabs[active]?.setAttribute('tabindex', '-1');
    tabs[next]?.setAttribute('aria-selected', 'true');
    tabs[next]?.setAttribute('tabindex', '0');

    if (reduced) {
      outgoing.classList.remove('is-active', 'is-exiting');
      incoming.classList.add('is-active');
      active = next;
      return;
    }

    locked = true;
    outgoing.classList.add('is-exiting');
    incoming.classList.add('is-active');
    window.setTimeout(() => {
      outgoing.classList.remove('is-active', 'is-exiting');
      active = next;
      locked = false;
    }, 560);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setActive(index));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      tabs[next].focus();
      setActive(next);
    });
  });

  if (matchMedia('(pointer:fine)').matches && !reduced) {
    const shell = root.querySelector('.reactor-shell');
    root.addEventListener('pointermove', (event) => {
      if (!shell || locked) return;
      const rect = shell.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      shell.style.transform = `rotateX(${(-y * 1.8).toFixed(2)}deg) rotateY(${(x * 2.4).toFixed(2)}deg)`;
    });
    root.addEventListener('pointerleave', () => {
      if (shell) shell.style.transform = '';
    });
  }
})();