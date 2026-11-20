(function () {
  document.body.classList.remove('no-js');

  var name = document.getElementById('name');
  var headline = document.getElementById('headline');
  var nav = document.querySelector('.nav');
  var navRow = document.getElementById('nav-row');
  var screen2 = document.getElementById('screen-2');
  var goBtn = document.getElementById('go-btn');
  var screen3 = document.getElementById('screen-3');

  var startY, endY, startSize, endSize, distance;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function measure() {
    startSize = Math.min(128, window.innerWidth * 0.06667);
    endSize = startSize / 2;
    startY = window.innerHeight / 2;
    var r = navRow.getBoundingClientRect();          // nav is fixed: viewport coords
    endY = r.top + r.height / 2;
    distance = Math.max(1, screen2.offsetTop);
  }

  function update() {
    var p = clamp(window.scrollY / distance, 0, 1);
    var e = ease(p);

    name.style.top = lerp(startY, endY, e) + 'px';
    name.style.fontSize = lerp(startSize, endSize, e) + 'px';

    // nav gets a backdrop as it becomes the persistent header
    nav.style.background = 'rgba(7, 11, 24, ' + (0.88 * e) + ')';
    var blur = 'blur(' + (8 * e) + 'px)';
    nav.style.backdropFilter = blur;
    nav.style.webkitBackdropFilter = blur;

    // second text fades/rises in during the last part of the scroll
    var t = clamp((p - 0.55) / 0.45, 0, 1);
    headline.style.opacity = t;
    headline.style.transform =
        'translate(-50%, calc(-50% + ' + (1 - t) * 24 + 'px))';

    // the button fades/rises in together with the headline
    goBtn.style.opacity = t;
    goBtn.style.transform =
        'translate(-50%, calc(-50% + ' + (1 - t) * 24 + 'px))';
    goBtn.style.pointerEvents = t > 0.9 ? 'auto' : 'none';
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }

  function onResize() { measure(); update(); }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);
  onResize();

  // Frame 2 button: reveal Frame 3, then scroll down to it.
  goBtn.addEventListener('click', function () {
    startIdle();
    screen3.classList.remove('is-hidden');
    screen3.classList.add('reveal');
    var reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    screen3.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  // Idle blackout: starts after the Go button; the title acts as the campfire bar.
  var IDLE_GRACE = 5000, IDLE_FADE = 60000;   // 5s untouched, then 60s to full black
  var blackout = document.getElementById('blackout');
  var deer = new Audio('/sounds/deer.mp3');
  // 99s: plays when arriving from another page (skips reloads/redirects of this page)
  var intro = new Audio('/sounds/99s.mp3');
  if (document.body.dataset.intro === 'true') {
    var kick = function () {
      intro.play().then(function () {
        ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) {
          window.removeEventListener(t, kick);
        });
      }).catch(function () {});
    };
    kick();   // try on load
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) {
      window.addEventListener(t, kick);   // fallback if the browser blocks autoplay
    });
  }
  var idleOn = false, lastAct = 0, idleRaf = 0, deerPlayed = false;

  function setIdle(p) {
    blackout.style.opacity = p;
    var c = [255, 107, 53], mix = [];
    for (var i = 0; i < 3; i++) mix.push(Math.round(c[i] + (255 - c[i]) * p));
    name.style.color = 'rgb(' + mix.join(',') + ')';
    name.style.textShadow = '0 15px 35px rgba(255,107,53,' + (0.35 * (1 - p)) + ')';
  }
  function idleTick() {
    var p = clamp((performance.now() - lastAct - IDLE_GRACE) / IDLE_FADE, 0, 1);
    setIdle(p);
    if (p >= 0.5 && !deerPlayed) { deerPlayed = true; deer.currentTime = 0; deer.play().catch(function () {}); }
    idleRaf = p < 1 ? requestAnimationFrame(idleTick) : 0;
  }
  function wakeIdle() {
    if (!idleOn) return;
    lastAct = performance.now();
    deerPlayed = false;
    setIdle(0);
    if (!idleRaf) idleRaf = requestAnimationFrame(idleTick);
  }
  function startIdle() {
    if (idleOn) return;
    idleOn = true;
    try { sessionStorage.setItem('olivennIdle', '1'); } catch (e) {}
    ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(function (t) {
      window.addEventListener(t, wakeIdle, { passive: true });
    });
    wakeIdle();
  }

// New session (Try Again) turns it off until Go is clicked again.
  var resetForm = document.querySelector('form[action$="/reset"]');
  if (resetForm) resetForm.addEventListener('submit', function () {
    try { sessionStorage.removeItem('olivennIdle'); } catch (e) {}
  });
  try { if (sessionStorage.getItem('olivennIdle')) startIdle(); } catch (e) {}

  // Frame 3.1 / 3.2: first #Hanapin click of the session unlocks the map.
  // The popup disappears after ~2s and leaves the map icon (in every section).
  var hanapin = document.getElementById('hanapin');
  var unlockEl = document.getElementById('unlock');
  var mapBtn = document.getElementById('map-btn');
  var mapEl = document.getElementById('map');
  var confirmEl = document.getElementById('confirm');
  var confirmText = document.getElementById('confirm-text');
  var pending = null;
  var unlocking = false;
  var unlockedNow = mapEl.getAttribute('data-unlocked') === 'true';   // server tells us after a reload
  if (unlockedNow) document.body.classList.add('unlocked');

  function isUnlocked() { return unlockedNow; }
  function markUnlocked() { unlockedNow = true; }

  // Frames 3.2.1 / 3.2.2: open / close the map
  function openMap() {
    mapEl.classList.add('show');
    mapEl.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeConfirm() {
    confirmEl.classList.remove('show');
    pending = null;
  }
  function closeMap() {
    closeConfirm();
    mapEl.classList.remove('show');
    mapEl.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  if (hanapin) hanapin.addEventListener('click', function () {
    if (unlocking) return;
    if (isUnlocked()) { openMap(); return; }       // 3.2.1: clicked again
    markUnlocked();
    unlocking = true;
    unlockEl.classList.add('show');
    setTimeout(function () {
      unlockEl.classList.remove('show');
      document.body.classList.add('unlocked');
      unlocking = false;
    }, 2000);
  });

  mapBtn.addEventListener('click', function () {
    if (mapEl.classList.contains('show')) closeMap(); else openMap();   // 3.2.2 / close
  });

  // Frame 3.3: clicking a coordinate asks first, then jumps to that section
  var coords = mapEl.querySelectorAll('.coord');
  for (var i = 0; i < coords.length; i++) {
    coords[i].addEventListener('click', function (ev) {
      pending = ev.currentTarget;
      // place the box next to the clicked dot (offsets taken from Figma 3.3)
      var field = mapEl.querySelector('.mapfield');
      var k = Math.max(0.6, field.getBoundingClientRect().width / 1035);
      var r = pending.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var w = 322 * k, h = 118 * k;
      confirmEl.style.setProperty('--k', k);
      confirmEl.style.left = Math.min(Math.max(8, cx + 39 * k), window.innerWidth - w - 8) + 'px';
      confirmEl.style.top = Math.min(Math.max(8, cy - 133 * k), window.innerHeight - h - 8) + 'px';
      confirmEl.classList.add('show');
    });
  }

  document.getElementById('confirm-no').addEventListener('click', closeConfirm);
  document.getElementById('confirm-yes').addEventListener('click', function () {
    var target = pending && document.getElementById(pending.getAttribute('data-target'));
    closeMap();
    if (!target) return;
    target.classList.remove('is-hidden');
    var reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    if (confirmEl.classList.contains('show')) closeConfirm();
    else if (mapEl.classList.contains('show')) closeMap();
  });

  // After submitting the form the page reloads at the top; jump back to it.
  var leave = document.getElementById('leave-message');
  if (leave && leave.getAttribute('data-sent') === 'true') {
    leave.scrollIntoView();
  }
})();