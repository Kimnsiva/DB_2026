// app.js — entry point
import { navigate }        from './utils/router.js';
import { renderCountdown } from './pages/countdown.js';

// Floating petals background
function initPetals() {
  const container = document.createElement('div');
  container.className = 'petals-container';
  document.body.appendChild(container);

  const PETALS = ['🌸','🌺','✿','·','❀'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = PETALS[i % PETALS.length];
    const left  = Math.random() * 100;
    const dur   = 8 + Math.random() * 10;
    const delay = Math.random() * 12;
    p.style.cssText = `
      left:${left}%;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      font-size:${0.6 + Math.random() * 0.8}rem;
      opacity:0;
    `;
    container.appendChild(p);
  }
}

// ===== FIREWORKS =====
function initFireworks() {
  const canvas = document.createElement('canvas');
  canvas.id = 'fw-canvas';
  canvas.style.cssText = `
    position:fixed; inset:0; width:100%; height:100%;
    pointer-events:none; z-index:2;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle class
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
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
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

  // Rocket class
  class Rocket {
    constructor() {
      this.x  = 0.15 * W + Math.random() * 0.7 * W;
      this.y  = H;
      this.vy = -(8 + Math.random() * 6);
      this.vx = (Math.random() - 0.5) * 2;
      this.targetY = 0.1 * H + Math.random() * 0.45 * H;
      this.trail  = [];
      this.color  = `hsl(${Math.random()*360|0},90%,60%)`;
      this.done   = false;
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 8) this.trail.shift();
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.2; // gravity
      if (this.y <= this.targetY || this.vy >= 0) {
        this.done = true;
      }
    }
    draw() {
      for (let i = 0; i < this.trail.length; i++) {
        const a = (i / this.trail.length) * 0.7;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.trail[i].x, this.trail[i].y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  const PALETTE = [
    '#ff6b9d','#ffd93d','#6bcb77','#4d96ff','#ff922b',
    '#e040fb','#00bcd4','#ffb300','#f06292','#aed581',
  ];

  let particles = [];
  let rockets   = [];
  let lastLaunch = 0;
  const LAUNCH_INTERVAL = 900; // ms between rockets

  function explode(x, y) {
    const base = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const count = 80 + Math.floor(Math.random() * 60);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, base));
    }
  }

  function loop(ts) {
    requestAnimationFrame(loop);

    // Fade trail
    ctx.fillStyle = 'rgba(253,246,240,0.18)';
    ctx.fillRect(0, 0, W, H);

    // Launch rockets
    if (ts - lastLaunch > LAUNCH_INTERVAL) {
      rockets.push(new Rocket());
      lastLaunch = ts;
    }

    // Rockets
    rockets = rockets.filter(r => {
      r.update();
      r.draw();
      if (r.done) { explode(r.x, r.y); return false; }
      return true;
    });

    // Particles
    particles = particles.filter(p => {
      p.update();
      p.draw();
      return p.alpha > 0;
    });
  }

  requestAnimationFrame(loop);
}

initPetals();
initFireworks();

// Kick off the app on the countdown page
navigate(renderCountdown);
