document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const base = '/portfolio/rheician/game/';
  const $ = (id) => document.getElementById(id);
  const scenes = Array.from(document.querySelectorAll('[data-scene]'));
  const modal = $('game-modal');
  const moveButton = $('move-on');
  const academic = document.querySelector('.academic-world');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const maxEvades = 10;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const folderInfo = {
    yearner: {
      title: 'THE YEARNER',
      image: '/images/rj1.jpg',
      text: '"Miss u lods." A version of Rhei that can finish a web application but cannot finish a conversation. Her hobbies include volleyball, music, and making situations needlessly cinematic.'
    },
    developer: {
      title: 'THE DEVELOPER',
      image: '/images/rj3.jpg',
      text: '"Jo pagod ka na ba?" BS Information Technology student at PLM. Builds web interfaces, works with databases, and somehow discovers new errors every time a feature finally works.'
    },
    overthinker: {
      title: 'THE OVERTHINKER',
      image: '/images/rj2.jpg',
      text: '"Cno ba naman ako para piliin mo?" Enjoys looking at problems from different perspectives. Unfortunately, she sometimes treats one unread message like a full research paper.'
    },
    dramatic: {
      title: 'THE DRAMATIC',
      image: '/images/rj4.jpg',
      text: '"Ako na lang kasi :(" A cinematic archive of Rhei, with advanced expertise in imagining scenarios that have not happened and turning them into a three-season series.'
    },
    survivor: {
      title: 'THE SURVIVOR',
      image: '/images/rj5.jpg',
      text: '"Si ano poh." Former honor student ;p, still learning, still exploring, still showing up after every setback. Skills include teamwork, programming, and surviving deadlines with very little remaining battery.'
    }
  };

  const recordEntries = [
    { title: 'STEM ARCHIVE', text: 'Studied the STEM strand at Manila Cathedral School and graduated with High Honors. Mr. Deadline was there, too.' },
    { title: 'UNIVERSITY ARCHIVE', text: 'Now studying BS Information Technology at Pamantasan ng Lungsod ng Maynila. Many exams survived. More are loading.' },
    { title: 'TECHNOLOGY ARCHIVE', text: 'Experience with Java, Python, PHP, JavaScript, React, MySQL and Tailwind CSS. Debugging counts as an emotional endurance sport.' },
    { title: 'LEADERSHIP ARCHIVE', text: 'Joined academic communities and was selected as a Vice President of Block 3. More responsibility has entered the room.' }
  ];

  const breakdownQuotes = [
    '"Ok lang ako lods, kaya pa naman i-defend \'to..."',
    '"500 Internal Server Error sa utak ko pero smile lang."',
    '"Git commit -m \'iyak muna bago mag-debug\'"',
    '"Hindi na ako mag-ooverthink (nag-overthink ulit)."'
  ];

  let state = null;
  let scene = 0;
  let busy = false;
  let entering = false;
  let evades = 0;
  let seconds = 12;
  let activeCard = 0;
  let vinylPlaying = true;
  let previousFocus = null;

  async function api(action, values = {}) {
    const params = new URLSearchParams(values);
    const response = await fetch(base + action, {
      method: action === 'status' ? 'GET' : 'POST',
      headers: action === 'status' ? {} : { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: action === 'status' ? undefined : params.toString(),
      credentials: 'same-origin'
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return await response.json();
  }

  function setStatus(text, error = false, success = false) {
    const el = $('game-status');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('text-red-300', error);
    el.classList.toggle('text-green-300', !error && success);
    el.classList.toggle('text-gray-400', !error && !success);
  }

  function showScene(next) {
    const target = Number(next);
    if (!Number.isInteger(target) || target < 0 || target > 4) return;
    if (state && target > state.level) return;
    scene = target;
    scenes.forEach((section) => {
      const visible = Number(section.dataset.scene) === target;
      section.hidden = !visible;
      if (visible) section.scrollTop = 0;
    });
    seconds = 12;
    render();
  }

  function renderDeck() {
    const selectors = document.querySelectorAll('[data-card-select]');
    const cards = document.querySelectorAll('[data-card-view]');
    const total = cards.length;
    if (!total) return;

    if ($('rhei-card-number')) $('rhei-card-number').textContent = String(activeCard + 1);

    selectors.forEach((btn) => {
      const idx = Number(btn.dataset.cardSelect);
      btn.classList.toggle('is-active', idx === activeCard);
    });

    cards.forEach((card) => {
      const idx = Number(card.dataset.cardView);
      const offset = (idx - activeCard + total) % total;
      const isTop = offset === 0;
      card.classList.toggle('is-active', isTop);
      card.style.zIndex = String(total - offset);
      if (isTop) {
        card.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
        card.style.opacity = '1';
      } else if (offset === 1) {
        card.style.transform = 'translate(16px, 12px) rotate(3deg) scale(0.96)';
        card.style.opacity = '0.75';
      } else if (offset === 2) {
        card.style.transform = 'translate(-14px, 18px) rotate(-3deg) scale(0.92)';
        card.style.opacity = '0.5';
      } else {
        card.style.transform = 'translate(8px, 24px) rotate(2deg) scale(0.88)';
        card.style.opacity = '0.25';
      }
    });
  }

  function setActiveCard(index) {
    const total = document.querySelectorAll('[data-card-view]').length || 5;
    activeCard = ((index % total) + total) % total;
    renderDeck();
  }

  function render() {
    if (!state) return;

    // Level 01: Folders
    document.querySelectorAll('[data-folder]').forEach((button) => {
      const viewed = state.folders.includes(button.dataset.folder);
      button.classList.toggle('is-viewed', viewed);
      button.querySelector('.folder-status').textContent = viewed ? 'VIEWED' : 'UNREAD';
      button.setAttribute('aria-label', (viewed ? 'Reopen ' : 'Open ') + button.dataset.folder + ' folder');
    });
    $('archive-exit').disabled = state.level < 2;
    $('archive-exit').textContent = state.level >= 2 ? 'EXIT ARCHIVE' : 'EXIT LOCKED';

    // Level 02: Glass panels
    const glints = Array.isArray(state.glintTiles) ? state.glintTiles : [];
    document.querySelectorAll('[data-tile]').forEach((button) => {
      const id = Number(button.dataset.tile);
      const safe = state.tiles.includes(id);
      const wrong = state.wrongTiles.includes(id);
      const hasGlint = glints.includes(id);
      button.classList.toggle('glint', hasGlint && !safe && !wrong);
      button.classList.toggle('is-safe', safe);
      button.classList.toggle('is-wrong', wrong);
      button.disabled = safe || wrong || state.level !== 2;
      button.querySelector('span').textContent = safe ? 'OK' : wrong ? 'ERR' : String(id + 1).padStart(2, '0');
      button.setAttribute('aria-label', 'Panel ' + (id + 1) + (safe ? ': school record found' : wrong ? ': wrong panel' : ': inspect'));
    });
    $('academic-count').textContent = 'RECORDS: ' + state.tiles.length + ' / 4';
    $('caught-count').textContent = 'CAUGHT: ' + state.catches;
    $('academic-exit').disabled = state.level < 3;
    $('academic-exit').textContent = state.level >= 3 ? 'EXIT' : 'EXIT LOCKED';
    $('threat-bar').style.width = (state.threat / 5 * 100) + '%';
    $('deadline-monster').style.setProperty('--monster-scale', String(.62 + state.threat * .3));
    $('deadline-monster').style.setProperty('--monster-opacity', String(.45 + state.threat * .12));

    // Level 03: Java challenge
    $('code-exit').disabled = state.level < 4;
    $('code-exit').textContent = state.level >= 4 ? 'ENTER FINAL ESCAPE' : 'FINAL EXIT LOCKED';
    $('compile-button').disabled = state.level !== 3;

    // Level 04: Breakdown counter & stacked deck
    const breakdowns = Number(state.breakdowns) || 0;
    if ($('breakdown-count')) $('breakdown-count').textContent = String(breakdowns);
    if ($('breakdown-alert-count')) $('breakdown-alert-count').textContent = String(breakdowns);
    if ($('breakdown-alert')) $('breakdown-alert').hidden = breakdowns === 0;
    if ($('breakdown-quote') && breakdowns > 0) {
      $('breakdown-quote').textContent = breakdownQuotes[(breakdowns - 1) % breakdownQuotes.length];
    }
    renderDeck();
  }

  async function act(action, params = {}, after = null) {
    if (busy) return;
    busy = true;
    try {
      const reply = await api(action, params);
      state = reply;
      render();
      setStatus(reply.message, !reply.success, reply.success);
      if (after) await after(reply);
    } catch (error) {
      setStatus('Cannot reach Spring Boot (' + error.message + '). Start BackendApplication and reload.', true);
    } finally {
      busy = false;
    }
  }

  function openModal(title, text, image = null, caption = 'RECOVERED RECORD') {
    previousFocus = document.activeElement;
    $('game-modal-title').textContent = title;
    $('game-modal-body').textContent = text;
    $('game-modal-caption').textContent = caption;
    const photo = $('game-modal-photo');
    photo.hidden = !image;
    if (image) photo.src = image;
    else photo.removeAttribute('src');
    $('game-modal-done').textContent = image ? 'EXIT FOLDER' : 'CONTINUE';
    modal.hidden = false;
    $('game-modal-close').focus();
  }

  function closeModal() {
    modal.hidden = true;
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }
  $('game-modal-close').addEventListener('click', closeModal);
  $('game-modal-done').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Level 00: Evasion button
  const dodgePositions = [
    [22, 24], [75, 74], [34, 72], [76, 29], [47, 25],
    [24, 75], [70, 55], [43, 76], [76, 72], [50, 50]
  ];
  function dodge() {
    if (evades >= maxEvades || scene !== 0 || entering) return;
    evades++;
    const [x, y] = dodgePositions[evades - 1];
    moveButton.style.left = x + '%';
    moveButton.style.top = y + '%';
    $('evasion-message').textContent = evades >= maxEvades
        ? 'You survived the rejection arc. The button will no longer run.'
        : ['Nice try.', 'The past has better reflexes.', 'Not emotionally available.', 'Wrong timing, lods.'][evades % 4];
    if (evades === maxEvades) {
      moveButton.classList.add('is-ready');
      moveButton.textContent = 'NAKAUSAD NA';
    }
  }
  moveButton.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') dodge();
  });
  moveButton.addEventListener('click', () => {
    if (evades < maxEvades) { dodge(); return; }
    enterGame(false);
  });
  $('secret-exit').addEventListener('click', () => enterGame(true));

  async function enterGame(secret) {
    if (busy || entering || (state && state.level !== 0)) return;
    entering = true;
    try {
      const reply = await api('enter');
      state = reply;
      render();
      if (!reply.success) { setStatus(reply.message, true); return; }
      setStatus(secret ? 'Hidden signal accepted. Bypassing the evasions.' : reply.message);
      const fall = $('fall-transition');
      fall.hidden = false;
      if (!reducedMotion) await wait(1500);
      showScene(1);
      fall.hidden = true;
    } catch (error) {
      setStatus('Spring Boot did not respond (' + error.message + ').', true);
    } finally {
      entering = false;
    }
  }

  // Level 01: Folders
  document.querySelectorAll('[data-folder]').forEach((button) => {
    button.addEventListener('click', () => {
      const info = folderInfo[button.dataset.folder];
      act('folder', { id: button.dataset.folder }, (reply) => {
        if (reply.success && info) openModal(info.title, info.text, info.image, 'The Truths of Rhei');
      });
    });
  });
  $('archive-exit').addEventListener('click', () => showScene(2));

  // Level 02: Glass panels
  function caught() {
    academic.classList.remove('is-caught');
    void academic.offsetWidth;
    academic.classList.add('is-caught');
    openModal('Usad na oi?', 'The tiles have reshuffled, but your five memory folders are still saved. Find the four faintly glinting panels again.', null, 'TRY AGAIN');
  }
  document.querySelectorAll('[data-tile]').forEach((button) => {
    button.addEventListener('click', () => {
      const tile = Number(button.dataset.tile);
      act('tile', { tile }, (reply) => {
        seconds = 12;
        if (reply.caught) caught();
        else if (reply.success) {
          const glints = Array.isArray(reply.glintTiles) ? reply.glintTiles : [];
          const recordIdx = Math.max(0, glints.indexOf(tile));
          const info = recordEntries[recordIdx % recordEntries.length];
          openModal(info.title, info.text, null, 'VERIFIED ACADEMIC RECORD');
        }
      });
    });
  });
  $('academic-exit').addEventListener('click', () => showScene(3));

  setInterval(() => {
    const active = scene === 2 && state && state.level === 2 && !document.hidden && modal.hidden && !busy;
    if (!active) {
      seconds = 12;
      $('deadline-countdown').textContent = 'NEXT STEP: PAUSED';
      return;
    }
    seconds = Math.max(0, seconds - 1);
    $('deadline-countdown').textContent = 'NEXT STEP: ' + seconds + 's';
    if (seconds === 0) {
      seconds = 12;
      act('tick', {}, (reply) => { if (reply.caught) caught(); });
    }
  }, 1000);

  // Level 03: Java challenge
  $('java-challenge').addEventListener('submit', (event) => {
    event.preventDefault();
    const outputClass = $('java-class').value;
    const outputMethod = $('java-method').value;
    act('code', { outputClass, outputMethod });
  });
  $('code-exit').addEventListener('click', () => showScene(4));

  // Level 04: Smooth scroll from full-screen hero to archives
  if ($('scroll-to-archives')) {
    $('scroll-to-archives').addEventListener('click', () => {
      const archives = $('archives');
      if (archives) archives.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  // Level 04: Interactive Vinyl Play/Pause Toggle
  if ($('vinyl-toggle')) {
    $('vinyl-toggle').addEventListener('click', () => {
      vinylPlaying = !vinylPlaying;
      $('vinyl-toggle').classList.toggle('is-paused', !vinylPlaying);
      $('vinyl-toggle').setAttribute('aria-pressed', String(vinylPlaying));
      if ($('vinyl-tonearm')) $('vinyl-tonearm').classList.toggle('is-paused', !vinylPlaying);
      if ($('vinyl-eq')) $('vinyl-eq').classList.toggle('eq-paused', !vinylPlaying);
      if ($('vinyl-state-label')) {
        $('vinyl-state-label').textContent = vinylPlaying
            ? 'SPINNING // CLICK DISC TO PAUSE'
            : 'PAUSED // CLICK DISC TO RESUME';
      }
    });
  }

  // Level 04: Interactive Stacked Deck (hover, focus, or click switches images)
  document.querySelectorAll('[data-card-select]').forEach((btn) => {
    const select = () => setActiveCard(Number(btn.dataset.cardSelect));
    btn.addEventListener('pointerenter', select);
    btn.addEventListener('focus', select);
    btn.addEventListener('click', select);
  });

  document.querySelectorAll('[data-card-view]').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = Number(card.dataset.cardView);
      if (idx === activeCard) setActiveCard(activeCard + 1);
      else setActiveCard(idx);
    });
  });

  // Level 04: Emotional Breakdown button (screen shake + Spring Boot log)
  if ($('breakdown-btn')) {
    $('breakdown-btn').addEventListener('click', () => {
      const target = $('undas-level-4') || document.body;
      target.classList.remove('breakdown-shake');
      void target.offsetWidth;
      target.classList.add('breakdown-shake');
      act('breakdown');
    });
  }

  // Reset all levels
  $('game-reset').addEventListener('click', () => {
    if (!window.confirm('Restart all five levels? This clears only your game progress, not the group feedback.')) return;
    act('reset', {}, () => {
      evades = 0;
      activeCard = 0;
      moveButton.style.left = '50%';
      moveButton.style.top = '50%';
      moveButton.classList.remove('is-ready');
      moveButton.textContent = 'MOVE ON';
      $('evasion-message').textContent = 'The past is not ready to let go.';
      $('java-class').value = '';
      $('java-method').value = '';
      showScene(0);
    });
  });

  // Initial load
  (async () => {
    renderDeck();
    const loader = $('initial-loader');
    const loaderBar = $('initial-loader-bar');
    const loaderText = $('initial-loader-text');
    const minLoadTime = reducedMotion ? 0 : 1200;
    const startTime = Date.now();

    if (loaderBar) {
      requestAnimationFrame(() => {
        loaderBar.style.width = '85%';
      });
    }

    try {
      state = await api('status');
      render();
      showScene(state.level);
      setStatus(state.level === 0 ? 'The endless fall has begun.' : 'Saved session restored.');
    } catch (error) {
      setStatus('Unable to reach Spring Boot (' + error.message + '). Run BackendApplication.', true);
      showScene(0);
    } finally {
      if (loaderBar) loaderBar.style.width = '100%';
      if (loaderText) loaderText.textContent = 'Connection established.';
      const remaining = Math.max(0, minLoadTime - (Date.now() - startTime));
      if (remaining > 0) await wait(remaining);
      if (loader) {
        loader.classList.add('is-hidden');
        await wait(reducedMotion ? 0 : 350);
        loader.hidden = true;
      }
    }
  })();
});