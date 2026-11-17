document.addEventListener('DOMContentLoaded', () => {
  // Gracefully handle browsers where session storage is disabled.
  const storage = (() => {
    try { sessionStorage.getItem('__probe__'); return sessionStorage; }
    catch (_) { return { getItem: () => null, setItem: () => {} }; }
  })();
  const loader = document.getElementById('home-loader');
  if (loader) {
    if (storage.getItem('rolboxHomeLoaded')) { loader.remove(); }
    else {
      let progress = 0;
      const tick = setInterval(() => {
        progress = Math.min(100, progress + 5);
        document.getElementById('home-load-bar').style.width = progress + '%';
        document.getElementById('home-load-label').textContent = progress + '%';
        if (progress === 100) {
          clearInterval(tick);
          storage.setItem('rolboxHomeLoaded', '1');
          loader.classList.add('is-closing');
          setTimeout(() => loader.remove(), 300);
        }
      }, 60);
    }
  }
  const banner = document.getElementById('welcome-banner');
  if (storage.getItem('rolboxBannerDismissed') && banner) banner.hidden = true;
  document.getElementById('close-banner')?.addEventListener('click', () => {
    banner.hidden = true;
    storage.setItem('rolboxBannerDismissed', '1');
  });
  document.getElementById('portfolio-search')?.addEventListener('input', event => {
    const query = event.target.value.trim().toLowerCase();
    let matches = 0;
    document.querySelectorAll('.searchable-member').forEach(card => {
      const show = (card.dataset.search || '').toLowerCase().includes(query);
      card.classList.toggle('search-hidden', !show);
      if (show) matches++;
    });
    document.getElementById('search-empty').hidden = matches > 0;
  });
});
