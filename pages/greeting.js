// pages/greeting.js
import { navigate } from '../utils/router.js';
import { renderMemory } from './memory.js';

// ✏️ REPLACE with your message
const MESSAGE = `🌸 สุขสันต์วันเกิดนะค้าบ อ้วน 🌸
ขอให้อ้วนมีความสุขในทุกๆ วัน และอยู่กับเค้าไปนานๆ   💌

#ILYSB 🤍`;

const COLORS = ['#e8a0b0', '#c9a96e', '#f9d6df', '#ffeef4', '#fff5e0', '#c2637a', '#42a5f5'];

function spawnConfetti() {
  const wrap = document.createElement('div');
  wrap.className = 'confetti-wrap';
  document.body.appendChild(wrap);

  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const left = Math.random() * 100;
    const dur = 1.8 + Math.random() * 2;
    const delay = Math.random() * 1.5;
    p.style.cssText = `
      left:${left}%;
      background:${color};
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      transform:rotate(${Math.random() * 360}deg);
    `;
    wrap.appendChild(p);
  }

  setTimeout(() => wrap.remove(), 5000);
}

export function renderGreeting(app) {
  app.innerHTML = `
    <div class="card">
      <span style="font-size:2.8rem; display:block; margin-bottom:4px;">🎂</span>
      <h2 class="display">Happy Babe day!</h2>
      <div class="divider"></div>

      <p class="greeting-body" id="greeting-text" style="opacity:0; transform:translateY(20px); transition: opacity 0.8s 0.3s ease, transform 0.8s 0.3s ease;">
${MESSAGE}
      </p>

      <div id="img-wrap" style="
        width:100%;
        border-radius:14px;
        margin:28px 0;
        border:1px solid var(--rose);
        box-shadow: 0 10px 30px var(--shadow);
        opacity:0; transform:translateY(20px);
        transition: opacity 0.8s 0.6s ease, transform 0.8s 0.6s ease;
      ">
        <img src="happy-bday-main/photo/3333.jpg" style="width:100%; height:auto; display:block;">
      </div>

      <button class="btn btn-primary mt-md" id="next-btn" style="opacity:0; transition:opacity 0.6s 1s ease;">
        ต่อไป →
      </button>
    </div>
  `;

  spawnConfetti();

  // Staggered reveal
  requestAnimationFrame(() => {
    setTimeout(() => {
      const txt = app.querySelector('#greeting-text');
      if (txt) { txt.style.opacity = '1'; txt.style.transform = 'translateY(0)'; }
    }, 100);
    setTimeout(() => {
      const img = app.querySelector('#img-wrap');
      if (img) { img.style.opacity = '1'; img.style.transform = 'translateY(0)'; }
    }, 400);
    setTimeout(() => {
      const btn = app.querySelector('#next-btn');
      if (btn) { btn.style.opacity = '1'; }
    }, 900);
  });

  app.querySelector('#next-btn').addEventListener('click', () => navigate(renderMemory));
}
