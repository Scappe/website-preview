(() => {
  'use strict';

  const form = document.querySelector('[data-project-intake]');
  if (!form) return;

  const status = form.querySelector('.intake-status');
  const submit = form.querySelector('[type="submit"]');
  const initialSubmitLabel = submit?.textContent || 'Prepara il messaggio ↗';
  let submitting = false;

  const value = name => String(new FormData(form).get(name) || '').trim();
  const errorFor = name => form.querySelector(`[data-error-for="${name}"]`);
  const fieldsFor = name => [...form.querySelectorAll(`[name="${name}"]`)];

  const setError = (name, message) => {
    fieldsFor(name).forEach(field => field.setAttribute('aria-invalid', message ? 'true' : 'false'));
    const error = errorFor(name);
    if (error) error.textContent = message;
  };

  const setState = (state, message = '') => {
    form.dataset.state = state;
    if (status) status.textContent = message;
    if (submit) {
      submit.disabled = state === 'submitting';
      submit.setAttribute('aria-busy', state === 'submitting' ? 'true' : 'false');
      submit.textContent = state === 'submitting' ? 'Preparo il messaggio…' : initialSubmitLabel;
    }
  };

  const validate = () => {
    const problem = value('problem');
    const message = value('message');
    const name = value('name');
    const email = value('email');
    const website = value('website');
    const emailValid = !email || /^\S+@\S+\.\S+$/.test(email);
    let websiteValid = true;
    if (website) {
      try { new URL(website); } catch { websiteValid = false; }
    }

    setError('problem', problem ? '' : 'Scegli la priorità che si avvicina di più.');
    setError('message', message ? '' : 'Raccontaci in poche righe cosa vuoi cambiare.');
    setError('name', name ? '' : 'Inserisci il tuo nome.');
    setError('email', emailValid ? '' : 'Controlla l’indirizzo email.');
    setError('website', websiteValid ? '' : 'Inserisci un indirizzo completo, per esempio https://example.it.');

    const valid = Boolean(problem && message && name && emailValid && websiteValid);
    if (!valid) {
      setState('error', 'Controlla i campi evidenziati: ciò che hai già scritto resta qui.');
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus({ preventScroll: false });
    }
    return valid;
  };

  form.addEventListener('input', event => {
    const name = event.target?.name;
    if (name) setError(name, '');
    if (form.dataset.state === 'error') setState('idle', '');
  });
  form.addEventListener('change', event => {
    const name = event.target?.name;
    if (name) setError(name, '');
    if (form.dataset.state === 'error') setState('idle', '');
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    submitting = true;
    setState('submitting', 'Sto preparando un messaggio ordinato con il contesto che hai scritto…');

    const lines = [
      'Ciao Axante, vorrei parlarvi di un problema del mio progetto.',
      '',
      `Priorità: ${value('problem')}`,
      `Contesto: ${value('message')}`,
      value('company') ? `Azienda/progetto: ${value('company')}` : '',
      value('website') ? `Sito attuale: ${value('website')}` : '',
      '',
      `Nome: ${value('name')}`,
      value('email') ? `Email: ${value('email')}` : ''
    ].filter(Boolean);

    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    try {
      const popup = window.open(`https://wa.me/393271706981?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
      if (!popup) throw new Error('popup-blocked');
      setState('success', 'Messaggio pronto in WhatsApp. Puoi rileggerlo e modificarlo prima di inviarlo.');
    } catch {
      setState('error', 'Non siamo riusciti ad aprire WhatsApp. Usa il link diretto qui sotto o scrivici a hello@axante.it.');
    } finally {
      submitting = false;
      if (submit) {
        submit.disabled = false;
        submit.setAttribute('aria-busy', 'false');
      }
    }
  });

  setState('idle', '');
})();