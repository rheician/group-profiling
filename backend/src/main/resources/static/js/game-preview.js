/* Browser-only enhancements for a Thymeleaf game details page. */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const KEY = 'rolboxSavedWorlds';
  const save = document.getElementById('preview-favorite');
  const share = document.getElementById('preview-share');
  const feedback = document.getElementById('preview-feedback');

  function readFavorites() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved.filter(x => typeof x === 'string') : []);
    } catch (_) { return new Set(); }
  }

  let favorites = readFavorites();
  function refreshSaveButton() {
    if (!save) return;
    const selected = favorites.has(save.dataset.slug);
    save.setAttribute('aria-pressed', String(selected));
    save.textContent = selected ? '♥ Saved' : '♡ Save';
    save.classList.toggle('text-red-600', selected);
  }
  save?.addEventListener('click', () => {
    const slug = save.dataset.slug;
    if (favorites.has(slug)) favorites.delete(slug);
    else favorites.add(slug);
    try { localStorage.setItem(KEY, JSON.stringify([...favorites])); } catch (_) { /* optional */ }
    refreshSaveButton();
    if (feedback) feedback.textContent = favorites.has(slug) ? 'Added to your saved worlds.' : 'Removed from saved worlds.';
  });

  share?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (feedback) feedback.textContent = 'Preview link copied!';
    } catch (_) {
      // Clipboard permission can be unavailable; keep a useful fallback.
      if (feedback) feedback.textContent = 'Copy this page URL from your address bar to share.';
    }
  });
  refreshSaveButton();
});
