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

initPetals();

// Kick off the app on the countdown page
navigate(renderCountdown);
