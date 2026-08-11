(() => {
  const root = document.querySelector('[data-reactor]');
  if (!root) return;

  const tabs = [...root.querySelectorAll('[data-reactor-tab]')];
  const scenes = [...root.querySelectorAll('[data-reactor-scene]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 600px)');

  let active = Math.max(0, scenes.findIndex(scene => scene.classList.contains('is-active')));
  let transitionId = 0;
  let running = [];

  const cancelRunning = () => {
    for (const animation of running) {
      try {
        if (animation.playState !== 'finished' && typeof animation.commitStyles === 'function') animation.commitStyles();
      } catch {}
      try { animation.cancel(); } catch {}
    }
    running = [];
  };

  const setTabs = (index) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.setAttribute('tabindex', selected ? '0' : '-1');
    });
  };

  const cleanupScene = (scene) => {
    scene.getAnimations().forEach(animation => animation.cancel());
    scene.querySelectorAll('[data-reactor-primary],[data-reactor-detail],.reactor-caption').forEach(node => {
      node.getAnimations().forEach(animation => animation.cancel());
      node.style.removeProperty('opacity');
      node.style.removeProperty('transform');
    });
    scene.style.removeProperty('opacity');
    scene.style.removeProperty('transform');
  };

  const finalize = (index, token) => {
    if (token !== transitionId) return;
    scenes.forEach((scene, i) => {
      cleanupScene(scene);
      scene.classList.toggle('is-active', i === index);
      scene.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    active = index;
    running = [];
  };

  const immediate = (index) => {
    const token = ++transitionId;
    cancelRunning();
    setTabs(index);
    finalize(index, token);
  };

  const transitionTo = (next) => {
    if (next < 0 || next >= scenes.length) return;
    setTabs(next);
    if (reduced) return immediate(next);
    if (next === active) {
      if (running.length) immediate(next);
      return;
    }

    const token = ++transitionId;
    const outgoing = scenes[active];
    const incoming = scenes[next];
    cancelRunning();

    scenes.forEach((scene, i) => {
      if (i !== active && i !== next) {
        cleanupScene(scene);
        scene.classList.remove('is-active');
        scene.setAttribute('aria-hidden', 'true');
      }
    });

    outgoing.classList.add('is-active');
    incoming.classList.add('is-active');
    outgoing.setAttribute('aria-hidden', 'true');
    incoming.setAttribute('aria-hidden', 'false');

    const duration = mobile.matches ? 380 : 520;
    const easing = 'cubic-bezier(.22,.8,.2,1)';
    const direction = next > active ? 1 : -1;

    const outgoingAnimation = outgoing.animate([
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
      { opacity: 0, transform: `translate3d(${direction * -10}px,0,0) scale(1.025)` }
    ], { duration, easing, fill: 'forwards' });

    const incomingAnimation = incoming.animate([
      { opacity: 0, transform: `translate3d(${direction * 14}px,0,0) scale(1.045)` },
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
    ], { duration, easing, fill: 'forwards' });

    const outgoingPrimary = outgoing.querySelector('[data-reactor-primary]');
    const incomingPrimary = incoming.querySelector('[data-reactor-primary]');
    const outgoingDetail = outgoing.querySelector('[data-reactor-detail]');
    const incomingDetail = incoming.querySelector('[data-reactor-detail]');
    const outgoingCaption = outgoing.querySelector('.reactor-caption');
    const incomingCaption = incoming.querySelector('.reactor-caption');
    const childAnimations = [];

    if (outgoingPrimary) childAnimations.push(outgoingPrimary.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.035)' }
    ], { duration, easing, fill: 'forwards' }));
    if (incomingPrimary) childAnimations.push(incomingPrimary.animate([
      { transform: 'scale(1.055)' },
      { transform: 'scale(1)' }
    ], { duration, easing, fill: 'forwards' }));
    if (outgoingDetail) childAnimations.push(outgoingDetail.animate([
      { opacity: 1, transform: 'translate3d(0,0,0)' },
      { opacity: 0, transform: `translate3d(${direction * -12}px,8px,0)` }
    ], { duration: duration * .76, easing, fill: 'forwards' }));
    if (incomingDetail) childAnimations.push(incomingDetail.animate([
      { opacity: 0, transform: `translate3d(${direction * 16}px,10px,0)` },
      { opacity: 1, transform: 'translate3d(0,0,0)' }
    ], { duration, delay: duration * .08, easing, fill: 'forwards' }));
    if (outgoingCaption) childAnimations.push(outgoingCaption.animate([
      { opacity: 1, transform: 'translate3d(0,0,0)' },
      { opacity: 0, transform: 'translate3d(0,10px,0)' }
    ], { duration: duration * .68, easing, fill: 'forwards' }));
    if (incomingCaption) childAnimations.push(incomingCaption.animate([
      { opacity: 0, transform: 'translate3d(0,14px,0)' },
      { opacity: 1, transform: 'translate3d(0,0,0)' }
    ], { duration, delay: duration * .1, easing, fill: 'forwards' }));

    running = [outgoingAnimation, incomingAnimation, ...childAnimations];
    active = next;
    Promise.allSettled([outgoingAnimation.finished, incomingAnimation.finished]).then(() => finalize(next, token));
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => transitionTo(index));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      tabs[next].focus();
      transitionTo(next);
    });
  });

  setTabs(active);
  scenes.forEach((scene, index) => scene.setAttribute('aria-hidden', index === active ? 'false' : 'true'));
})();
