document.addEventListener('DOMContentLoaded', () => {
  const secret = document.getElementById('secret-button');
  const escape = () => {
    const dx = (Math.random() - .5) * Math.min(350, window.innerWidth * .55);
    const dy = (Math.random() - .5) * 250;
    secret.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  secret?.addEventListener('mouseenter', escape);
  secret?.addEventListener('click', escape);

  const popup = document.getElementById('meme-popup');
  const title = document.getElementById('meme-popup-title');
  const close = () => { popup.hidden = true; document.body.style.overflow = ''; };
  document.querySelectorAll('[data-meme]').forEach(button => button.addEventListener('click', () => {
    title.textContent = button.dataset.meme;
    popup.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('meme-close').focus();
  }));
  document.getElementById('meme-close')?.addEventListener('click', close);
  popup?.addEventListener('click', e => { if (e.target === popup) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && popup && !popup.hidden) close(); });
  window.triggerInulti = () => {
    playFahh();
    document.body.classList.remove('ulti-hit');
    void document.body.offsetWidth;
    document.body.classList.add('ulti-hit');
    setTimeout(() => document.getElementById('inultiForm').submit(), 650);
  };
  if (new URLSearchParams(location.search).get('triggered') === 'true') {
    document.getElementById('ulti-zone')?.classList.add('ulti-hit');
  }
});
