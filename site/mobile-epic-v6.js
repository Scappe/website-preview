(() => {
  'use strict';

  if (!window.matchMedia('(max-width: 680px)').matches) return;

  const isPortfolio = document.body.querySelector('.portfolio-page');
  const scenes = isPortfolio
    ? [...document.querySelectorAll('.case-study')].map((element, index) => ({
        element,
        label: element.querySelector('h2')?.textContent?.trim() || `Case study ${index + 1}`
      }))
    : [
        ['.hero', 'Visione'],
        ['.capabilities', 'Sistema'],
        ['.project-reel', 'Selected work'],
        ['.process-section', 'Metodo'],
        ['.cta-section', 'Contatto']
      ].map(([selector, label]) => ({ element: document.querySelector(selector), label })).filter(scene => scene.element);

  if (scenes.length < 2) return;

  const meter = document.createElement('button');
  meter.type = 'button';
  meter.className = 'mobile-scene-meter';
  meter.setAttribute('aria-label', 'Vai alla sezione successiva');
  meter.innerHTML = '<span class="mobile-scene-meter__count"></span><span class="mobile-scene-meter__body"><b class="mobile-scene-meter__label"></b><span class="mobile-scene-meter__track"><i></i></span></span><span class="mobile-scene-meter__arrow">↓</span>';
  document.body.appendChild(meter);

  const count = meter.querySelector('.mobile-scene-meter__count');
  const label = meter.querySelector('.mobile-scene-meter__label');
  let activeIndex = 0;

  const render = index => {
    activeIndex = Math.max(0, Math.min(index, scenes.length - 1));
    const progress = (activeIndex + 1) / scenes.length;
    count.textContent = `${String(activeIndex + 1).padStart(2, '0')}/${String(scenes.length).padStart(2, '0')}`;
    label.textContent = scenes[activeIndex].label;
    meter.style.setProperty('--scene-progress', progress.toFixed(3));
    meter.classList.remove('pulse');
    requestAnimationFrame(() => meter.classList.add('pulse'));
  };

  const chooseActive = () => {
    const targetLine = window.innerHeight * .46;
    let bestIndex = activeIndex;
    let bestDistance = Infinity;
    scenes.forEach((scene, index) => {
      const rect = scene.element.getBoundingClientRect();
      const point = Math.max(rect.top, Math.min(targetLine, rect.bottom));
      const distance = Math.abs(point - targetLine);
      if (rect.top <= targetLine && rect.bottom >= targetLine) {
        bestIndex = index;
        bestDistance = -1;
      } else if (bestDistance !== -1 && distance < bestDistance) {
        bestIndex = index;
        bestDistance = distance;
      }
    });
    if (bestIndex !== activeIndex) render(bestIndex);
  };

  let ticking = false;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      chooseActive();
    });
  };

  meter.addEventListener('click', () => {
    const nextIndex = activeIndex >= scenes.length - 1 ? 0 : activeIndex + 1;
    scenes[nextIndex].element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    navigator.vibrate?.(8);
    render(nextIndex);
  });

  render(0);
  chooseActive();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
})();
