(() => {
  const root = document.querySelector('[data-reactor]');
  if (!root) return;

  const tabs = [...root.querySelectorAll('[data-reactor-tab]')];
  const scenes = [...root.querySelectorAll('[data-reactor-scene]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 600px)');
  const shell = root.querySelector('.reactor-shell');

  let active = Math.max(0, scenes.findIndex(scene => scene.classList.contains('is-active')));
  let requested = active;
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

  const finalize = (index, token) => {
    if (token !== transitionId) return;
    scenes.forEach((scene, i) => {
      scene.getAnimations().forEach(animation => animation.cancel());
      scene.querySelectorAll('[data-reactor-primary],[data-reactor-detail]').forEach(node => {
        node.getAnimations().forEach(animation => animation.cancel());
        node.style.removeProperty('opacity');
        node.style.removeProperty('transform');
        node.style.removeProperty('clip-path');
      });
      scene.style.removeProperty('opacity');
      scene.style.removeProperty('transform');
      scene.style.removeProperty('clip-path');
      scene.classList.toggle('is-active', i === index);
      scene.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    active = index;
    requested = index;
    running = [];
  };

  const immediate = (index) => {
    transitionId += 1;
    cancelRunning();
    setTabs(index);
    finalize(index, transitionId);
  };

  const currentFrame = (node, fallback) => {
    const style = getComputedStyle(node);
    return {
      opacity: style.opacity || fallback.opacity,
      transform: style.transform === 'none' ? fallback.transform : style.transform,
      clipPath: style.clipPath === 'none' ? fallback.clipPath : style.clipPath
    };
  };

  const transitionTo = (next) => {
    if (next < 0 || next >= scenes.length) return;
    requested = next;
    setTabs(next);
    if (reduced) return immediate(next);
    if (next === active && !running.length) return;

    const token = ++transitionId;
    const outgoing = scenes[active];
    const incoming = scenes[next];

    cancelRunning();

    const outgoingStart = currentFrame(outgoing, {
      opacity: '1',
      transform: 'matrix(1, 0, 0, 1, 0, 0)',
      clipPath: 'inset(0% 0% 0% 0% round 0px)'
    });
    const incomingStart = currentFrame(incoming, {
      opacity: '0',
      transform: mobile.matches ? 'matrix(1, 0, 0, 1, 0, 14)' : 'matrix(0.965, 0, 0, 0.965, 0, 0)',
      clipPath: mobile.matches ? 'inset(7% 4% 7% 4% round 18px)' : 'inset(10% 8% 10% 8% round 28px)'
    });

    scenes.forEach((scene, i) => {
      if (i !== active && i !== next) {
        scene.classList.remove('is-active');
        scene.setAttribute('aria-hidden', 'true');
        scene.style.opacity = '0';
      }
    });

    outgoing.classList.add('is-active');
    incoming.classList.add('is-active');
    outgoing.setAttribute('aria-hidden', 'true');
    incoming.setAttribute('aria-hidden', 'false');

    const duration = mobile.matches ? 440 : 560;
    const easing = 'cubic-bezier(.2,.78,.2,1)';

    const outgoingAnimation = outgoing.animate([
      outgoingStart,
      {
        opacity: 0,
        transform: mobile.matches ? 'translate3d(-10px,0,0) scale(.985)' : 'translate3d(-18px,0,0) scale(1.018) rotateY(-1.5deg)',
        clipPath: mobile.matches ? 'inset(4% 10% 4% 0% round 20px)' : 'inset(12% 4% 10% 20% round 38px)'
      }
    ], { duration, easing, fill: 'forwards' });

    const incomingAnimation = incoming.animate([
      incomingStart,
      {
        opacity: 1,
        transform: 'translate3d(0,0,0) scale(1) rotateY(0deg)',
        clipPath: 'inset(0% 0% 0% 0% round 0px)'
      }
    ], { duration, easing, fill: 'forwards' });

    const outgoingDetail = outgoing.querySelector('[data-reactor-detail]');
    const incomingDetail = incoming.querySelector('[data-reactor-detail]');
    const outgoingPrimary = outgoing.querySelector('[data-reactor-primary]');
    const incomingPrimary = incoming.querySelector('[data-reactor-primary]');

    const childAnimations = [];
    if (outgoingDetail) childAnimations.push(outgoingDetail.animate([
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', clipPath: 'inset(0% 0% 0% 0% round 18px)' },
      { opacity: .1, transform: mobile.matches ? 'translate3d(0,12px,0) scale(.96)' : 'translate3d(-42px,-18px,0) scale(1.18)', clipPath: 'inset(10% 10% 10% 10% round 26px)' }
    ], { duration: duration * .78, easing, fill: 'forwards' }));
    if (incomingDetail) childAnimations.push(incomingDetail.animate([
      { opacity: 0, transform: mobile.matches ? 'translate3d(0,14px,0) scale(.96)' : 'translate3d(38px,22px,0) scale(.72)', clipPath: 'inset(22% 12% 22% 12% round 28px)' },
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', clipPath: 'inset(0% 0% 0% 0% round 18px)' }
    ], { duration, delay: duration * .08, easing, fill: 'forwards' }));
    if (outgoingPrimary) childAnimations.push(outgoingPrimary.animate([
      { transform: 'scale(1)' },
      { transform: mobile.matches ? 'scale(1.025)' : 'scale(1.05) translateX(-1.5%)' }
    ], { duration, easing, fill: 'forwards' }));
    if (incomingPrimary) childAnimations.push(incomingPrimary.animate([
      { transform: mobile.matches ? 'scale(1.035)' : 'scale(1.07) translateX(1.5%)' },
      { transform: 'scale(1)' }
    ], { duration, easing, fill: 'forwards' }));

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

  if (matchMedia('(pointer:fine)').matches && !reduced) {
    root.addEventListener('pointermove', (event) => {
      if (!shell || running.length) return;
      const rect = shell.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      shell.style.transform = `rotateX(${(-y * 1.4).toFixed(2)}deg) rotateY(${(x * 1.9).toFixed(2)}deg)`;
    });
    root.addEventListener('pointerleave', () => {
      if (shell) shell.style.transform = '';
    });
  }

  setTabs(active);
  scenes.forEach((scene, index) => scene.setAttribute('aria-hidden', index === active ? 'false' : 'true'));
})();