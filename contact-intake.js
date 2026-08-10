(() => {
  'use strict';

  const intake = document.querySelector('[data-project-intake]');
  if (!intake) return;

  const steps = [...intake.querySelectorAll('[data-intake-step]')];
  const progress = [...intake.querySelectorAll('[data-progress-segment]')];
  const nextButtons = intake.querySelectorAll('[data-next-step]');
  const backButtons = intake.querySelectorAll('[data-prev-step]');
  const form = intake.querySelector('form');
  const status = intake.querySelector('.intake-status');
  let current = 0;

  const showStep = index => {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => {
      step.classList.toggle('is-active', i === current);
      step.hidden = i !== current;
    });
    progress.forEach((segment, i) => {
      segment.classList.toggle('is-done', i < current);
      segment.classList.toggle('is-current', i === current);
    });
    const label = intake.querySelector('[data-step-count]');
    if (label) label.textContent = `Step ${current + 1} di ${steps.length}`;
    const heading = steps[current]?.querySelector('h2');
    if (heading && current > 0) heading.focus({ preventScroll: true });
    updateSummary();
  };

  const value = name => String(new FormData(form).get(name) || '').trim();
  const errorFor = name => form.querySelector(`[data-error-for="${name}"]`);
  const setError = (name, message) => {
    const field = form.elements.namedItem(name);
    if (field && 'setAttribute' in field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
    const error = errorFor(name);
    if (error) error.textContent = message;
  };

  const validateStep = index => {
    let valid = true;
    if (index === 0) {
      const problem = value('problem');
      if (!problem) {
        const error = errorFor('problem');
        if (error) error.textContent = 'Scegli il problema che descrive meglio la situazione.';
        valid = false;
      } else {
        const error = errorFor('problem');
        if (error) error.textContent = '';
      }
    }
    if (index === 1) {
      const message = value('message');
      setError('message', message ? '' : 'Raccontaci in poche righe cosa vuoi cambiare.');
      valid = Boolean(message);
    }
    if (index === 2) {
      const name = value('name');
      const phone = value('phone');
      const email = value('email');
      const preference = value('preference');
      setError('name', name ? '' : 'Inserisci il tuo nome.');
      setError('phone', phone ? '' : 'Inserisci un numero di telefono.');
      setError('email', email && !/^\S+@\S+\.\S+$/.test(email) ? 'Controlla l’indirizzo email.' : '');
      setError('preference', preference ? '' : 'Scegli come preferisci essere ricontattato.');
      valid = Boolean(name && phone && preference && (!email || /^\S+@\S+\.\S+$/.test(email)));
    }
    return valid;
  };

  const updateSummary = () => {
    const summary = intake.querySelector('[data-intake-summary]');
    if (!summary) return;
    const problem = value('problem') || '—';
    const company = value('company') || '—';
    const timing = value('timing') || 'Da definire insieme';
    summary.innerHTML = `<div><span>Priorità</span><strong>${escapeHtml(problem)}</strong></div><div><span>Progetto</span><strong>${escapeHtml(company)}</strong></div><div><span>Timing</span><strong>${escapeHtml(timing)}</strong></div>`;
  };

  const escapeHtml = text => String(text).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char]));

  nextButtons.forEach(button => button.addEventListener('click', () => {
    if (!validateStep(current)) return;
    showStep(current + 1);
  }));
  backButtons.forEach(button => button.addEventListener('click', () => showStep(current - 1)));
  form.addEventListener('change', updateSummary);
  form.addEventListener('input', event => {
    const name = event.target?.name;
    if (name) setError(name, '');
    updateSummary();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateStep(2)) return;
    const data = new FormData(form);
    const lines = [
      'Ciao Axante, vorrei richiedere un primo audit del mio progetto.',
      '',
      `Priorità: ${value('problem')}`,
      value('company') ? `Azienda/progetto: ${value('company')}` : '',
      value('website') ? `Sito attuale: ${value('website')}` : '',
      `Problema/obiettivo: ${value('message')}`,
      value('timing') ? `Timing indicativo: ${value('timing')}` : '',
      '',
      `Nome: ${value('name')}`,
      `Telefono: ${value('phone')}`,
      value('email') ? `Email: ${value('email')}` : '',
      `Preferenza di contatto: ${value('preference')}`
    ].filter(Boolean);
    if (status) status.textContent = 'Apro WhatsApp con il brief già ordinato…';
    window.open(`https://wa.me/393271706981?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
  });

  showStep(0);
})();