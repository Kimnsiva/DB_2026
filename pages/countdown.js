// pages/countdown.js
import { getNextBirthdayDate, startCountdown } from '../utils/countdown.js';
import { navigate } from '../utils/router.js';
import { renderPassword } from './password.js';

export function renderCountdown(app) {
  const target = getNextBirthdayDate(4, 25, 10, 31);

  app.innerHTML = `
    <div class="card">
      <span class="penguin-icon">🐧</span>
      <h1 class="display">Birthday is coming…</h1>
      <p class="caption">💖</p>
      <div class="divider"></div>

      <div class="countdown-grid" id="cg">
        <div class="count-box"><span class="count-num" id="cd-d">--</span><span class="count-label">วัน</span></div>
        <div class="count-box"><span class="count-num" id="cd-h">--</span><span class="count-label">ชม.</span></div>
        <div class="count-box"><span class="count-num" id="cd-m">--</span><span class="count-label">นาที</span></div>
        <div class="count-box"><span class="count-num" id="cd-s">--</span><span class="count-label">วิ</span></div>
      </div>

      <p class="caption" style="font-size:0.78rem; color:var(--text-light);">
        📅 25 เมษายน · เวลา 10:31
      </p>
    </div>
  `;

  const pad = n => String(n).padStart(2, '0');
  const dEl = app.querySelector('#cd-d');
  const hEl = app.querySelector('#cd-h');
  const mEl = app.querySelector('#cd-m');
  const sEl = app.querySelector('#cd-s');

  const stop = startCountdown(
    target,
    ({ days, hours, minutes, seconds }) => {
      dEl.textContent = pad(days);
      hEl.textContent = pad(hours);
      mEl.textContent = pad(minutes);
      sEl.textContent = pad(seconds);
    },
    () => {
      stop();
      navigate(renderPassword);
    }
  );
}
