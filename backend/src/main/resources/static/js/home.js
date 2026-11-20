/* ROLBOX discovery interactions: all game content and routing still come from Spring Boot. */
(function () {
  'use strict';

  function safeStorage(area) {
    try {
      const candidate = window[area];
      const probe = '__rolbox_probe__';
      candidate.setItem(probe, '1');
      candidate.removeItem(probe);
      return candidate;
    } catch (_) {
      return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    }
  }

  const session = safeStorage('sessionStorage');
  const local = safeStorage('localStorage');
  const FAVORITES_KEY = 'rolboxSavedWorlds';

  let activeCategory = 'All';
  let onlySaved = false;
  let toastTimer = null;

  let storedFavorites;
  try {
    const parsed = JSON.parse(local.getItem(FAVORITES_KEY) || '[]');
    storedFavorites = Array.isArray(parsed) ? parsed.filter(v => typeof v === 'string') : [];
  } catch (_) {
    storedFavorites = [];
  }
  const favorites = new Set(storedFavorites);

  function showToast(text) {
    const toast = document.getElementById('lobby-toast');
    if (!toast || !text) return;
    toast.textContent = text;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
  }

  function updateFavoriteButtons() {
    document.querySelectorAll('[data-favorite]').forEach(button => {
      const slug = button.getAttribute('data-favorite');
      const selected = favorites.has(slug);
      const title = button.closest('.searchable-member')?.querySelector('h3')?.textContent || 'world';
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-label', `${selected ? 'Remove' : 'Save'} ${title} ${selected ? 'from' : 'to'} saved worlds`);
      button.textContent = selected ? '♥' : '♡';
    });

    const favoritesOnly = document.getElementById('favorites-only');
    if (favoritesOnly) {
      favoritesOnly.setAttribute('aria-pressed', String(onlySaved));
      favoritesOnly.classList.toggle('is-active', onlySaved);
      favoritesOnly.innerHTML = `${onlySaved ? '♥' : '♡'} Saved worlds (<span id="saved-count">${favorites.size}</span>)`;
    }
  }

  function updateChipStates() {
    document.querySelectorAll('[data-filter]').forEach(chip => {
      const chipCat = (chip.getAttribute('data-filter') || 'All').trim();
      const isMatch = chipCat.toLowerCase() === activeCategory.toLowerCase();
      chip.classList.toggle('is-active', isMatch);
      chip.setAttribute('aria-pressed', String(isMatch));
    });
  }

  function applyFilters() {
    const searchInput = document.getElementById('portfolio-search');
    const clearBtn = document.getElementById('clear-search');
    const cards = Array.from(document.querySelectorAll('.searchable-member'));
    const countEl = document.getElementById('world-count');
    const summaryEl = document.getElementById('filter-summary');
    const emptyEl = document.getElementById('search-empty');

    const rawQuery = searchInput ? searchInput.value : '';
    const query = rawQuery.trim().toLowerCase();
    const targetCat = activeCategory.trim().toLowerCase();

    if (clearBtn) clearBtn.hidden = rawQuery.length === 0;

    let visible = 0;
    cards.forEach(card => {
      const haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
      const cardCat = (card.getAttribute('data-category') || '').trim().toLowerCase();
      const slug = card.getAttribute('data-slug') || '';

      const matchesQuery = !query || haystack.includes(query);
      const matchesCategory = targetCat === 'all' || cardCat === targetCat;
      const matchesSaved = !onlySaved || favorites.has(slug);

      const show = matchesQuery && matchesCategory && matchesSaved;
      card.classList.toggle('search-hidden', !show);
      if (show) visible++;
    });

    if (countEl) countEl.textContent = String(visible);
    if (summaryEl) {
      const parts = [];
      if (targetCat !== 'all') parts.push(`in ${activeCategory}`);
      if (onlySaved) parts.push('saved');
      if (query) parts.push(`matching "${rawQuery.trim()}"`);
      summaryEl.textContent = parts.length
          ? `${visible === 1 ? 'experience' : 'experiences'} (${parts.join(', ')})`
          : `${visible === 1 ? 'experience' : 'experiences'} • open a preview to learn more`;
    }
    if (emptyEl) emptyEl.hidden = visible > 0;
  }

  function resetAllFilters() {
    const searchInput = document.getElementById('portfolio-search');
    if (searchInput) searchInput.value = '';
    activeCategory = 'All';
    onlySaved = false;
    updateChipStates();
    updateFavoriteButtons();
    applyFilters();
  }

  document.addEventListener('click', (event) => {
    const filterChip = event.target.closest('[data-filter]');
    if (filterChip) {
      activeCategory = (filterChip.getAttribute('data-filter') || 'All').trim();
      updateChipStates();
      applyFilters();
      return;
    }

    if (event.target.closest('#clear-search')) {
      const searchInput = document.getElementById('portfolio-search');
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      applyFilters();
      return;
    }

    if (event.target.closest('#reset-filters')) {
      resetAllFilters();
      return;
    }

    if (event.target.closest('#favorites-only')) {
      onlySaved = !onlySaved;
      updateFavoriteButtons();
      applyFilters();
      return;
    }

    const favBtn = event.target.closest('[data-favorite]');
    if (favBtn) {
      event.preventDefault();
      event.stopPropagation();
      const slug = favBtn.getAttribute('data-favorite');
      if (!slug) return;
      if (favorites.has(slug)) {
        favorites.delete(slug);
        showToast('Removed from saved worlds.');
      } else {
        favorites.add(slug);
        showToast('Added to saved worlds!');
      }
      local.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
      updateFavoriteButtons();
      applyFilters();
      return;
    }

    if (event.target.closest('#close-banner')) {
      const banner = document.getElementById('welcome-banner');
      if (banner) banner.hidden = true;
      session.setItem('rolboxBannerDismissed', '1');
      return;
    }

    if (event.target.closest('#random-world')) {
      const allCards = Array.from(document.querySelectorAll('.searchable-member'));
      const visibleCards = allCards.filter(card => !card.classList.contains('search-hidden'));
      const pool = visibleCards.length ? visibleCards : allCards;
      if (!pool.length) return;
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      const link = chosen.querySelector('a[href]');
      if (link) window.location.assign(link.href);
      return;
    }

    const sfxBtn = event.target.closest('[data-sfx]');
    if (sfxBtn) {
      if (typeof window.playFahh === 'function') window.playFahh();
      showToast(sfxBtn.getAttribute('data-sfx'));
    }
  });

  function handleSearchEvent(event) {
    if (event.target && event.target.id === 'portfolio-search') {
      applyFilters();
      const section = document.getElementById('recommended');
      if (section && event.target.value.trim().length > 0) {
        const rect = section.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.65) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }
  document.addEventListener('input', handleSearchEvent);
  document.addEventListener('search', handleSearchEvent);

  document.addEventListener('keydown', (event) => {
    if (event.target && event.target.id === 'portfolio-search') {
      if (event.key === 'Escape') {
        event.target.value = '';
        applyFilters();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        applyFilters();
        document.getElementById('recommended')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  function initHome() {
    // Always display and animate the loading screen when Home loads
    session.removeItem('rolboxHomeLoaded');
    const loader = document.getElementById('home-loader');
    if (loader) {
      let progress = 0;
      const bar = document.getElementById('home-load-bar');
      const label = document.getElementById('home-load-label');
      const timer = setInterval(() => {
        progress = Math.min(100, progress + 8);
        if (bar) bar.style.width = `${progress}%`;
        if (label) label.textContent = `${progress}%`;
        if (progress === 100) {
          clearInterval(timer);
          loader.classList.add('is-closing');
          setTimeout(() => loader.remove(), 300);
        }
      }, 45);
    }

    const banner = document.getElementById('welcome-banner');
    if (session.getItem('rolboxBannerDismissed') && banner) banner.hidden = true;

    updateChipStates();
    updateFavoriteButtons();
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
  } else {
    initHome();
  }
})();