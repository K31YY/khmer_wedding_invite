/* soft ambient wedding loop — starts from the envelope tap (a real user gesture) */
import { wedding, $ } from './utils.js';

let audio = null, wants = false;

export function initMusic(auto = false, toggle = false) {
  if (!audio) {
    audio = new Audio(wedding.music);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    audio.addEventListener('error', () => {
      $('#music-toggle').dataset.missing = '1';
    });
    audio.addEventListener('canplay', () => {
      if (wants) play();
    });
  }
  if (toggle) {
    if (audio.paused) { play(); return true; }
    pause(); return false;
  }
  if (auto) { wants = true; play(); }
  return !audio.paused;
}

function play() {
  audio.play().then(() => {
    fadeTo(0.5);
    $('#music-toggle').setAttribute('aria-pressed', 'true');
    wants = true;
  }).catch(() => { /* autoplay blocked until next tap */ });
}
function pause() {
  fadeTo(0, () => audio.pause());
  $('#music-toggle').setAttribute('aria-pressed', 'false');
  wants = false;
}
let fadeTimer = null;
function fadeTo(v, done) {
  clearInterval(fadeTimer);
  const step = v > audio.volume ? .04 : -.04;
  fadeTimer = setInterval(() => {
    audio.volume = Math.max(0, Math.min(1, audio.volume + step));
    if (Math.abs(audio.volume - v) < .05) {
      audio.volume = v; clearInterval(fadeTimer);
      if (v === 0) done?.();
    }
  }, 40);
}

export function musicPlaying() { return audio && !audio.paused; }
