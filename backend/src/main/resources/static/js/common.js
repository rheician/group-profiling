/* Shared, browser-only enhancement. All portfolio data changes still use Spring Boot POST routes. */
(function () {
  'use strict';
  const SOUND_URL = '/sounds/fahh.mp3';
  let sound;
  window.playFahh = function () {
    if (!sound) { sound = new Audio(SOUND_URL); sound.preload = 'auto'; }
    sound.pause();
    sound.currentTime = 0;
    sound.play().catch(function () { /* Offline / blocked audio must never break the UI. */ });
  };
})();
