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

  // ===== FIREWORKS (countdown page only) =====
  const canvas = document.createElement('canvas');
  canvas.id = 'fw-canvas';
  canvas.style.cssText = `
    position:fixed; inset:0; width:100%; height:100%;
    pointer-events:none; z-index:0;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor(x, y, color) {
      this.x = x; this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = 0.012 + Math.random() * 0.018;
      this.size  = 2 + Math.random() * 2.5;
      this.color = color;
      this.gravity = 0.08;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += this.gravity; this.vx *= 0.98;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Rocket {
    constructor() {
      this.x = 0.15 * W + Math.random() * 0.7 * W;
      this.y = H;
      this.vy = -(8 + Math.random() * 6);
      this.vx = (Math.random() - 0.5) * 2;
      this.targetY = 0.1 * H + Math.random() * 0.45 * H;
      this.trail = [];
      this.color = `hsl(${Math.random()*360|0},90%,60%)`;
      this.done = false;
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 8) this.trail.shift();
      this.x += this.vx; this.y += this.vy;
      this.vy += 0.2;
      if (this.y <= this.targetY || this.vy >= 0) this.done = true;
    }
    draw() {
      for (let i = 0; i < this.trail.length; i++) {
        ctx.save();
        ctx.globalAlpha = (i / this.trail.length) * 0.7;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.trail[i].x, this.trail[i].y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  const PALETTE = ['#ff6b9d','#ffd93d','#6bcb77','#4d96ff','#ff922b','#e040fb','#00bcd4','#ffb300','#f06292','#aed581'];
  let particles = [], rockets = [], lastLaunch = 0;

  function explode(x, y) {
    const base = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    for (let i = 0; i < 100 + Math.floor(Math.random()*60); i++)
      particles.push(new Particle(x, y, base));
  }

  function fwLoop(ts) {
    animId = requestAnimationFrame(fwLoop);
    ctx.clearRect(0, 0, W, H);
    if (ts - lastLaunch > 900) { rockets.push(new Rocket()); lastLaunch = ts; }
    rockets = rockets.filter(r => { r.update(); r.draw(); if (r.done) { explode(r.x, r.y); return false; } return true; });
    particles = particles.filter(p => { p.update(); p.draw(); return p.alpha > 0; });
  }
  animId = requestAnimationFrame(fwLoop);

  function stopFireworks() {
    cancelAnimationFrame(animId);
    canvas.remove();
    window.removeEventListener('resize', resize);
  }
  // ===== END FIREWORKS =====

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
      stopFireworks();
      navigate(renderPassword);
    }
  );
}
