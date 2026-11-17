document.addEventListener('DOMContentLoaded', () => {
  // Gracefully handle browsers where session storage is disabled.
  const storage = (() => {
    try { sessionStorage.getItem('__probe__'); return sessionStorage; }
    catch (_) { return { getItem: () => null, setItem: () => {} }; }
  })();
  const main = document.getElementById('rhei-main');
  const loader = document.getElementById('rhei-loader');
  const confirm = document.getElementById('rhei-confirm');
  const pop = document.getElementById('rhei-pop');
  const unlock = () => {
    main.classList.add('is-unlocked');
    storage.setItem('rheiIntroSeen', '1');
  };
  if (storage.getItem('rheiIntroSeen') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    loader.remove(); unlock();
  } else {
    let progress = 0;
    const tick = setInterval(() => {
      progress = Math.min(100, progress + 2);
      document.getElementById('rhei-progress-bar').style.width = progress + '%';
      document.getElementById('rhei-progress-label').textContent = '[' + progress + '%]';
      if (progress >= 100) {
        clearInterval(tick);
        loader.classList.add('rhei-fade-out');
        setTimeout(() => { loader.remove(); confirm.hidden = false; document.getElementById('rhei-confirm-button').focus(); }, 220);
      }
    }, 50);
  }
  document.getElementById('rhei-confirm-button')?.addEventListener('click', () => {
    confirm.hidden = true;
    pop.hidden = false;
    setTimeout(() => { pop.hidden = true; unlock(); }, 800);
  });

  // Instant, original-style hover carousel; persisted on click using an annotated Java POST.
  const archive = document.getElementById('rhei-archive');
  const choices = [...document.querySelectorAll('[data-card-select]')];
  const cards = [...document.querySelectorAll('[data-card-view]')];
  let selected = Number(archive.dataset.activeIndex || 0);
  const setActive = (value) => {
    selected = Number(value);
    document.getElementById('rhei-card-number').textContent = String(selected + 1);
    choices.forEach(button => {
      const active = Number(button.dataset.cardSelect) === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => {
      const index = Number(card.dataset.cardView);
      const offset = index - selected;
      const distance = Math.abs(offset);
      card.style.transform = `translateX(${offset * 40}px) scale(${Math.max(.7, 1 - distance * .08)})`;
      card.style.zIndex = String(cards.length - distance);
      card.style.opacity = distance > 2 ? '0' : String(1 - distance * .4);
      card.classList.toggle('is-active', distance === 0);
      card.style.pointerEvents = distance > 2 ? 'none' : 'auto';
    });
  };
  const saveSelected = async () => {
    try {
      const response = await fetch('/portfolio/rheician/select-card', {
        method: 'POST', headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({ index: String(selected) })
      });
      if (!response.ok) throw new Error('Save failed: ' + response.status);
    } catch (e) { console.warn('Portfolio card was previewed but was not saved to Spring Boot.', e); }
  };
  choices.forEach(button => {
    const index = Number(button.dataset.cardSelect);
    button.addEventListener('mouseenter', () => setActive(index));
    button.addEventListener('focus', () => setActive(index));
    button.addEventListener('click', () => { setActive(index); saveSelected(); });
  });
  cards.forEach(card => card.addEventListener('click', () => { setActive(Number(card.dataset.cardView)); saveSelected(); }));
  setActive(selected);

  window.triggerBreakdown = (event) => {
    event.preventDefault();
    playFahh();
    document.body.classList.remove('breakdown-shake');
    void document.body.offsetWidth;
    document.body.classList.add('breakdown-shake');
    setTimeout(() => document.getElementById('breakdownForm').submit(), 850);
    return false;
  };
  const label = document.getElementById('rhei-submit-label');
  document.getElementById('rhei-submit-button')?.addEventListener('mouseenter', () => { label.textContent = 'Mandamay ng Iba...'; });
  document.getElementById('rhei-submit-button')?.addEventListener('mouseleave', () => { label.textContent = 'Submit to Java Backend'; });
});
