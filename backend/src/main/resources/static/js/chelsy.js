const byId = id => document.getElementById(id);
const root = byId('chelsy-game');
const canvas = byId('arena');
const ctx = canvas.getContext('2d');
const dialog = byId('game-dialog');
const action = byId('arena-action');
const asset = path => (root.dataset.context ?? '') + path;

const locations = [[411, 248], [730, 224], [1060, 274], [1390, 236], [1750, 269], [2130, 245], [539, 294]];
const zones = [...root.querySelectorAll('[data-zone]')].map((row, index) => {
  const [x, y] = locations[index];
  return {row, ...row.dataset, x, y, index};
});
const trail = zones.filter(zone => zone.zone !== 'cameo');
const cameo = zones.find(zone => zone.zone === 'cameo');

const keys = new Set();
const journal = new Map();
const player = {x: 96, y: 252, stamina: 100, facing: 1, stride: 0};
let run, token, carrying, reserve;
let running = false;
let busy = false;
let sound = true;
let audio;
let camera = -40;
let lastFrame = 0;
let notice = '';
let noticeUntil = 0;

const atBase = () => player.x <= 187;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const nearby = () => zones.find(zone => distance(zone, player) < 45);
const clamp = (n, min, max) => Math.min(max, Math.max(n, min));
const paused = () => busy || dialog.open || document.hidden;

async function api(path, fields) {
  const response = await fetch(asset('/portfolio/chelsy/' + path), {
    method: fields ? 'POST' : 'GET',
    body: fields ? new URLSearchParams(fields) : undefined,
    headers: {Accept: 'application/json'},
    cache: 'no-store'
  });
  if (!response.ok) throw new Error(String(response.status));
  return path === 'drop' ? null : response.json();
}

function enableSound() {
  if (!sound || !window.AudioContext) return;
  audio ??= new AudioContext();
  audio.resume().catch(() => {});
}

function chime(notes) {
  if (!sound || audio?.state !== 'running') return;
  notes.forEach((frequency, index) => {
    const start = audio.currentTime + index * 0.07;
    const wave = audio.createOscillator();
    const volume = audio.createGain();

    wave.frequency.value = frequency;
    wave.connect(volume).connect(audio.destination);
    volume.gain.setValueAtTime(0.09, start);
    volume.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
    wave.start(start);
    wave.stop(start + 0.21);
  });
}

function clearKeys() {
  keys.clear();
  for (const button of root.querySelectorAll('[data-pressed]')) {
    delete button.dataset.pressed;
  }
}

function message(text) {
  notice = text;
  noticeUntil = performance.now() + 2800;
}

function resetRun() {
  clearKeys();
  Object.assign(player, {x: 96, y: 252, stamina: 100, facing: 1, stride: 0});
  run = crypto.randomUUID();
  token = carrying = reserve = null;
  camera = -40;
}

function dropBundle() {
  if (token) api('drop', {token}).catch(() => {});
}

function update(dt, width) {
  const dx = Number(keys.has('d')) - Number(keys.has('a'));
  const dy = Number(keys.has('s')) - Number(keys.has('w'));
  const motion = Math.hypot(dx, dy);
  const sprinting = keys.has('shift') && motion > 0 && player.stamina > 0;
  const speed = sprinting ? 302 : carrying ? 177 : 222;

  player.stamina = clamp(player.stamina + dt * (sprinting ? -26 : 20), 0, 100);
  if (motion) {
    player.x = clamp(player.x + dx / motion * speed * dt, 35, 2280);
    player.y = clamp(player.y + dy / motion * speed * dt * 0.69, 198, 306);
    player.stride += dt * 15;
    if (dx) player.facing = Math.sign(dx);
  } else {
    player.stride = 0;
  }

  const lead = width * (player.facing > 0 ? 0.34 : 0.62);
  const target = clamp(player.x - lead, -45, Math.max(-45, 2320 - width));
  camera += (target - camera) * Math.min(1, dt * 6);

  if (atBase()) reserve = null;
  if (!reserve) return;

  const gap = distance(player, reserve);
  if (gap < 26) {
    dropBundle();
    resetRun();
    chime([261, 196, 131]);
    message('The Reserve caught you. The bundle dropped!');
    return;
  }

  const chaseSpeed = 161 + Math.min(carrying.index, 5) * 7;
  reserve.x += (player.x - reserve.x) / gap * chaseSpeed * dt;
  reserve.y += (player.y - reserve.y) / gap * chaseSpeed * dt;
}

function block(color, x, y, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function tree(x, y, size, color) {
  block(color, x - size * 0.08, y - size * 0.6, size * 0.16, size * 0.61);
  for (let tier = 0; tier < 4; tier++) {
    const width = size * (0.85 - tier * 0.19);
    block(color, x - width / 2, y - size * (0.48 + tier * 0.23), width, size * 0.25);
  }
}

function bundle(x, y, color) {
  ctx.fillStyle = '#101621';
  ctx.strokeStyle = '#65706e';
  ctx.beginPath();
  ctx.moveTo(x - 22, y - 4);
  ctx.lineTo(x - 14, y - 13);
  ctx.lineTo(x + 12, y - 13);
  ctx.lineTo(x + 21, y - 7);
  ctx.lineTo(x + 18, y + 3);
  ctx.lineTo(x - 17, y + 3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  block(color, x - 10, y - 12, 2, 14);
  block(color, x + 9, y - 12, 2, 14);
}

function draw(width, time) {
  const sky = ctx.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, '#101824');
  sky.addColorStop(0.56, '#2c4c50');
  sky.addColorStop(1, '#142321');
  block(sky, 0, 0, width, 400);

  const moonX = width * 0.77 - camera * 0.05;
  ctx.fillStyle = '#9ae4c8';
  ctx.beginPath();
  ctx.arc(moonX, 86, 33, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 72; i++) {
    const x = i * 41 - camera * 0.48;
    const size = 25 + i * 37 % 63;
    if (x > -80 && x < width + 80) {
      tree(x, 192, size, i % 2 ? '#27413f' : '#1b3534');
    }
  }
  block('#263c34', 0, 193, width, 115);
  block('#1b2d28', 0, 308, width, 92);

  ctx.save();
  ctx.translate(-camera, 0);

  for (let i = 0; i < 170; i++) {
    const x = i * 15;
    if (x > camera - 20 && x < camera + width) {
      block(i % 4 ? '#3b5143' : '#526657', x, 199 + i * 53 % 107, 4 + i % 12, 2);
    }
  }

  block('#427e5966', 15, 194, 172, 114);
  ctx.strokeStyle = '#91f0bd';
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(15, 194, 172, 114);
  ctx.setLineDash([]);
  ctx.textAlign = 'center';
  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#91f0bd';
  ctx.fillText('BASE', 100, 221);

  for (const zone of zones) {
    if (carrying === zone) continue;
    bundle(zone.x, zone.y, zone.color);
    ctx.fillStyle = zone.color;
    ctx.font = 'bold 16px monospace';
    ctx.fillText('?', zone.x, zone.y - 23 + Math.sin(time / 300 + zone.index) * 4);
  }

  if (reserve) {
    const {x, y} = reserve;
    ctx.shadowColor = '#bf9afa';
    ctx.shadowBlur = 12;
    block('#251b36', x - 24, y - 46, 48, 42);
    block('#35284c', x - 24, y - 56, 11, 17);
    block('#35284c', x + 13, y - 56, 11, 17);
    block('#dfbcff', x - 14, y - 33, 8, 4);
    block('#dfbcff', x + 6, y - 33, 8, 4);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#e1c9ff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('THE RESERVE', x, y - 65);
  }

  const {x, y, facing, stride} = player;
  const step = Math.sin(stride) * 6;
  block('#45947c', x - 11 + step, y - 11, 9, 12);
  block('#286454', x + 2 - step, y - 11, 9, 12);
  block('#b6446b', x - 12, y - 28, 24, 18);
  block('#7dbe9f', x - 12, y - 16, 24, 4);
  block('#18253a', x - 14, y - 50, 28, 22);
  block('#18253a', x - 13, y - 55, 8, 8);
  block('#18253a', x + 5, y - 55, 8, 8);
  block('#e4ad95', x - 8, y - 43, 19, 13);
  block('#172538', x + facing * 5, y - 40, 3, 4);
  if (carrying) bundle(x - facing * 19, y - 24, carrying.color);

  ctx.restore();
}

function setText(element, text) {
  if (element.textContent !== text) element.textContent = text;
}

function updateHud(time) {
  let inZone = null;
  if (!atBase()) {
    inZone = distance(cameo, player) < 57 ? cameo : trail.find((zone, i) =>
        i === trail.length - 1 || player.x < (zone.x + trail[i + 1].x) / 2);
  }
  for (const zone of zones) {
    zone.row.classList.toggle('active-zone', zone === inZone);
  }

  const canReveal = Boolean(token && atBase());
  const canPick = Boolean(!token && nearby());
  setText(byId('location-label'), inZone?.label ?? 'Base');
  byId('stamina').value = player.stamina;
  action.hidden = !(canReveal || canPick);
  action.disabled = busy;
  byId('return-lobby').disabled = busy;
  setText(action, canReveal ? 'Reveal' : 'Pick up');

  let prompt = 'Head right to find a wrapped body.';
  if (time < noticeUntil) prompt = notice;
  else if (busy) prompt = 'Checking the bundle…';
  else if (canReveal) prompt = 'Safe at base. Open the bundle.';
  else if (token) prompt = 'The Reserve is chasing you. Get back to base!';
  else if (canPick) prompt = 'A mystery body is within reach.';
  setText(byId('game-prompt'), prompt);
}

function frame(time) {
  if (!running) return;

  const width = canvas.clientWidth / canvas.clientHeight * 400;
  const dt = Math.min((time - (lastFrame || time)) / 1000, 0.04);
  lastFrame = time;

  if (width > 0) {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(canvas.clientWidth * ratio);
    const pixelHeight = Math.round(canvas.clientHeight * ratio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx.setTransform(pixelWidth / width, 0, 0, pixelHeight / 400, 0, 0);
    if (!paused()) update(dt, width);
    draw(width, time);
    updateHud(time);
  }
  requestAnimationFrame(frame);
}

function updateCount() {
  byId('collection-count').textContent = journal.size;
  byId('collection-progress').value = journal.size;
}

async function loadJournal() {
  const response = await api('journal');
  for (const item of response.items) journal.set(item.id, item);
  updateCount();
}

async function interact() {
  if (!running || paused()) return;
  const zone = nearby();
  const revealing = token && atBase();
  if (!revealing && (!zone || token)) return;

  enableSound();
  clearKeys();
  busy = true;
  noticeUntil = 0;

  try {
    if (revealing) {
      const item = await api('reveal', {token});
      token = carrying = reserve = null;
      journal.set(item.id, item);
      loadJournal().catch(() => {});
      chime([392, 494, 587, 784]);
      showReveal(item, true);
    } else {
      const result = await api('pickup', {zone: zone.zone, run});
      token = result.token;
      carrying = zone;
      reserve = {x: player.x + 117, y: player.y - 21};
      chime([440, 554, 659]);
    }
  } catch (error) {
    if (error.message === '409') {
      token = carrying = reserve = null;
      run = crypto.randomUUID();
      message('That run expired. Try another bundle.');
    } else {
      message('Couldn’t reach the server. Try again.');
    }
  } finally {
    busy = false;
    if (!dialog.open) canvas.focus({preventScroll: true});
  }
}

function element(tag, text = '', classes = '') {
  const node = document.createElement(tag);
  node.textContent = text;
  if (classes) node.className = classes;
  return node;
}

function showDialog(content) {
  clearKeys();
  byId('dialog-body').replaceChildren(content);
  if (!dialog.open) dialog.showModal();
  byId('dialog-close').focus();
}

function mediaLink(text, url) {
  const link = element('a', text);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function showReveal(item, isNew) {
  const card = element('div');
  card.style.setProperty('--reveal-color', item.color);

  const initials = item.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('');
  const portrait = element('div', initials, 'portrait');
  portrait.setAttribute('aria-hidden', 'true');

  if (item.photo) {
    const image = element('img');
    image.alt = '';
    image.src = asset(item.photo);
    image.addEventListener('error', () => {
      portrait.textContent = initials;
    }, {once: true});
    portrait.replaceChildren(image);
  }

  const title = element('h2', item.name, 'text-3xl font-black mb-2');
  title.id = 'dialog-title';
  card.append(portrait, element('p', item.group, 'mint font-semibold'), title, element('p', item.description));

  const media = element('div', '', 'media');
  if (item.sound) {
    const clip = element('audio');
    clip.src = asset(item.sound);
    clip.controls = true;
    clip.autoplay = sound && isNew;
    media.append(clip);
  }

  if (item.videoId) {
    const video = element('iframe');
    video.title = item.mediaLabel;
    video.allow = 'autoplay; encrypted-media; fullscreen';
    video.allowFullscreen = true;
    const autoplay = sound && isNew ? '?autoplay=1&mute=1' : '';
    video.src = 'https://www.youtube-nocookie.com/embed/' + item.videoId + autoplay;
    media.append(video);
  }

  if (item.mediaLink) media.append(mediaLink(item.mediaLabel, item.mediaLink));

  if (item.playlistId) {
    const spotify = element('iframe', '', 'spotify');
    spotify.title = 'Chelsy’s Spotify playlist';
    spotify.src = 'https://open.spotify.com/embed/playlist/' + item.playlistId;
    spotify.allow = 'autoplay; encrypted-media';
    media.append(spotify, mediaLink('Open playlist in Spotify', 'https://open.spotify.com/playlist/' + item.playlistId));
  }

  const back = element('button', isNew ? 'Back to the run' : 'Back to journal', 'pill primary mt-3');
  back.addEventListener('click', () => {
    if (isNew) dialog.close();
    else showJournal();
  });
  card.append(media, back);
  showDialog(card);
}

function showJournal(status) {
  const content = element('div');
  const title = element('h2', 'Field journal', 'text-3xl font-black mb-2');
  title.id = 'dialog-title';
  content.append(title);

  if (status || journal.size === 0) {
    content.append(element('p', status || 'Your first find will appear here after you unwrap a bundle at base.'));
  } else {
    const list = element('div', '', 'grid grid-cols-2 gap-2 mt-2');
    for (const item of journal.values()) {
      const button = element('button', item.name, 'pill');
      button.addEventListener('click', () => showReveal(item, false));
      list.append(button);
    }
    content.append(list);
  }
  showDialog(content);
}

byId('start').addEventListener('click', () => {
  enableSound();
  resetRun();
  noticeUntil = 0;
  lastFrame = 0;
  running = true;
  byId('cover').hidden = true;
  byId('playfield').hidden = false;
  byId('touch-controls').hidden = false;
  canvas.focus({preventScroll: true});
  requestAnimationFrame(frame);
});

byId('return-lobby').addEventListener('click', () => {
  dropBundle();
  clearKeys();
  running = false;
  byId('playfield').hidden = true;
  byId('touch-controls').hidden = true;
  byId('cover').hidden = false;
  byId('start').focus({preventScroll: true});
});

byId('sound-toggle').addEventListener('click', event => {
  sound = !sound;
  event.currentTarget.textContent = sound ? 'Sound on' : 'Sound off';
  event.currentTarget.setAttribute('aria-pressed', String(sound));
  if (sound) enableSound();
});

action.addEventListener('click', interact);
byId('help-toggle').addEventListener('click', () => {
  showDialog(byId('help-content').content.cloneNode(true));
});

byId('journal-open').addEventListener('click', async () => {
  showJournal('Loading your journal…');
  let status;
  try {
    await loadJournal();
  } catch {
    status = 'Couldn’t load the journal. Try again.';
  }
  if (dialog.open && byId('dialog-title')?.textContent === 'Field journal') {
    showJournal(status);
  }
});

dialog.addEventListener('close', () => {
  byId('dialog-body').replaceChildren();
  if (running) canvas.focus({preventScroll: true});
});

const arrows = {ArrowUp: 'w', ArrowLeft: 'a', ArrowDown: 's', ArrowRight: 'd'};
const keyName = key => arrows[key] ?? key.toLowerCase();

document.addEventListener('keydown', event => {
  if (!running || paused() || event.ctrlKey || event.metaKey || event.altKey ||
      event.target.closest('input, textarea, select, [contenteditable]')) return;

  const key = keyName(event.key);
  if (['w', 'a', 's', 'd', 'shift'].includes(key)) {
    event.preventDefault();
    keys.add(key);
  } else if (key === 'e' && !event.repeat) {
    event.preventDefault();
    interact();
  }
});

document.addEventListener('keyup', event => keys.delete(keyName(event.key)));
window.addEventListener('blur', clearKeys);
document.addEventListener('visibilitychange', clearKeys);

for (const button of root.querySelectorAll('[data-key]')) {
  const key = button.dataset.key;

  button.addEventListener('pointerdown', event => {
    if (paused()) return;
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    button.dataset.pressed = 'true';
    keys.add(key);
  });

  const release = () => {
    keys.delete(key);
    delete button.dataset.pressed;
  };

  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    button.addEventListener(type, release);
  }
}