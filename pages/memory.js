// pages/memory.js
import { navigate } from '../utils/router.js';
import { shuffle } from '../utils/shuffle.js';
import { renderBalloons } from './balloons.js';

// ✏️ 5 pairs — replace emoji/images as desired
// ✏️ 5 pairs — replace emoji/images as desired
const PAIRS = [
  'happy-bday-main/photo/20250126_095152239_iOS.jpg',
  'happy-bday-main/photo/20250615_035825805_iOS.jpg',
  'happy-bday-main/photo/20250803_082309000_iOS.jpg',
  'happy-bday-main/photo/20251023_093217494_iOS.jpg',
  'happy-bday-main/photo/20260131_122718351_iOS.jpg',
  'happy-bday-main/photo/01.jpg'
];

export function renderMemory(app) {
  const cards = shuffle([...PAIRS, ...PAIRS].map((sym, id) => ({ sym, id })));

  let flipped = [];     // currently face-up (unmatched) card indices
  let matched = new Set();
  let locked = false;
  let moves = 0;

  app.innerHTML = `
    <div class="card">
      <span style="font-size:2rem; display:block; margin-bottom:4px;">🃏</span>
      <h2 class="display">Memory Game</h2>
      <p class="caption">เกมจับคู่ !!🌸</p>
      <div class="divider"></div>

      <p class="game-status" id="game-status">Moves: 0</p>

      <div class="memory-grid" id="mem-grid"></div>

      <button class="btn btn-primary mt-md hidden" id="mem-next">ต่อไป →</button>
    </div>
  `;

  const grid = app.querySelector('#mem-grid');
  const statusEl = app.querySelector('#game-status');
  const nextBtn = app.querySelector('#mem-next');

  cards.forEach((card, idx) => {
    const el = document.createElement('div');
    el.className = 'mem-card';
    el.dataset.idx = idx;
    const isImage = card.sym.includes('/');
    el.innerHTML = `
      <div class="mem-card-inner">
        <div class="mem-card-front">✿</div>
        <div class="mem-card-back">
          ${isImage ? `<img src="${card.sym}" alt="photo">` : card.sym}
        </div>
      </div>
    `;
    el.addEventListener('click', () => onCardClick(idx, el));
    grid.appendChild(el);
  });

  function onCardClick(idx, el) {
    if (locked) return;
    if (matched.has(idx)) return;
    if (flipped.includes(idx)) return;
    if (flipped.length >= 2) return;

    el.classList.add('flipped');
    flipped.push(idx);

    if (flipped.length === 2) {
      moves++;
      statusEl.textContent = `Moves: ${moves}`;
      locked = true;

      const [a, b] = flipped;
      if (cards[a].sym === cards[b].sym) {
        // Match
        matched.add(a);
        matched.add(b);
        grid.querySelector(`[data-idx="${a}"]`).classList.add('matched');
        grid.querySelector(`[data-idx="${b}"]`).classList.add('matched');
        flipped = [];
        locked = false;

        if (matched.size === cards.length) {
          statusEl.textContent = `🎉 เก่งมาก! ทำได้ใน ${moves} ครั้ง`;
          nextBtn.classList.remove('hidden');
        }
      } else {
        // No match — flip back after delay
        setTimeout(() => {
          grid.querySelector(`[data-idx="${a}"]`).classList.remove('flipped');
          grid.querySelector(`[data-idx="${b}"]`).classList.remove('flipped');
          flipped = [];
          locked = false;
        }, 900);
      }
    }
  }

  nextBtn.addEventListener('click', () => navigate(renderBalloons));
}
