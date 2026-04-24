// pages/puzzle.js
import { navigate } from '../utils/router.js';
import { shuffle } from '../utils/shuffle.js';
import { renderFinal } from './final.js';

// Tile content — 8 emoji tiles + 1 empty (index 8)
// Photo for the puzzle
const PUZZLE_IMG = 'happy-bday-main/photo/454.jpg';

function isSolvable(arr) {
  // Count inversions; solvable if even number of inversions
  const nums = arr.filter(n => n !== 8);
  let inv = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) inv++;
    }
  }
  return inv % 2 === 0;
}

function makeShuffled() {
  let arr;
  do {
    arr = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  } while (!isSolvable(arr));
  return arr;
}

const SOLVED = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function renderPuzzle(app) {
  let tiles = makeShuffled();
  let moves = 0;

  app.innerHTML = `
    <div class="card">
      <span style="font-size:2rem; display:block; margin-bottom:4px;">🧩</span>
      <h2 class="display">Sliding Puzzle</h2>
      <p class="caption">เลื่อนกระเบื้องให้ครบเรียงลำดับ ✨</p>
      <div class="divider"></div>

      <div class="puzzle-horizontal-layout" style="display: flex; gap: 48px; align-items: flex-start; justify-content: center; margin-top: 30px; flex-wrap: wrap;">
        <!-- Left: Preview -->
        <div class="puzzle-preview-side" style="flex: 0 1 350px; text-align: center;">
          <p class="caption" style="margin-bottom: 12px; font-size: 0.95rem;">ภาพตัวอย่าง 📸</p>
          <img src="${PUZZLE_IMG}" style="width: 100%; border-radius: 18px; border: 1.5px solid var(--rose); box-shadow: 0 12px 35px var(--shadow);">
        </div>

        <!-- Right: Game -->
        <div class="puzzle-game-side" style="flex: 0 1 450px; display: flex; flex-direction: column; align-items: center;">
          <div class="puzzle-grid" id="puz-grid"></div>
          <button class="btn btn-secondary mt-lg" id="puz-reset" style="font-size:0.85rem; padding:10px 24px;">↺ Shuffle Again</button>
        </div>
      </div>

      <button class="btn btn-primary mt-lg hidden" id="puz-next">ต่อไป →</button>
    </div>
  `;

  const grid = app.querySelector('#puz-grid');
  const nextBtn = app.querySelector('#puz-next');

  // Pre-create tiles for performance (smoothness)
  const tileEls = [];
  for (let i = 0; i < 9; i++) {
    const el = document.createElement('div');
    grid.appendChild(el);
    tileEls.push(el);
  }

  function getBgStyle(val) {
    // Use actual tile size for pixel-accurate slicing
    const tileW = tileEls[0].offsetWidth  || 120;
    const tileH = tileEls[0].offsetHeight || 120;
    const col = val % 3;
    const row = Math.floor(val / 3);
    return {
      backgroundImage:    `url(${PUZZLE_IMG})`,
      backgroundSize:     `${tileW * 3}px ${tileH * 3}px`,
      backgroundPosition: `-${col * tileW}px -${row * tileH}px`,
      backgroundRepeat:   'no-repeat',
    };
  }

  function render() {
    tiles.forEach((val, pos) => {
      const el = tileEls[pos];
      el.onclick = null;
      el.innerHTML = '';
      // Clear inline bg styles
      el.style.backgroundImage    = '';
      el.style.backgroundSize     = '';
      el.style.backgroundPosition = '';
      el.style.backgroundRepeat   = '';

      if (val === 8) {
        el.className = 'tile empty-tile';
      } else {
        el.className = 'tile';
        const bg = getBgStyle(val);
        Object.assign(el.style, bg);

        const numLabel = document.createElement('span');
        numLabel.className = 'tile-num';
        numLabel.textContent = val + 1;
        el.appendChild(numLabel);
        el.onclick = () => tryMove(pos);
      }
    });
  }

  function tryMove(pos) {
    const empty = tiles.indexOf(8);
    const row = r => Math.floor(r / 3);
    const col = c => c % 3;

    const adjacent =
      (row(pos) === row(empty) && Math.abs(col(pos) - col(empty)) === 1) ||
      (col(pos) === col(empty) && Math.abs(row(pos) - row(empty)) === 1);

    if (!adjacent) return;

    [tiles[pos], tiles[empty]] = [tiles[empty], tiles[pos]];
    render();
    checkSolved();
  }

  function checkSolved() {
    if (tiles.every((v, i) => v === SOLVED[i])) {
      nextBtn.classList.remove('hidden');

      // Fill the last tile (val=8, which is now at pos=8) with correct image slice
      const lastEl = tileEls[8];
      lastEl.className = 'tile';
      const bg = getBgStyle(8); // tile 9 = col 2, row 2 → bottom-right
      Object.assign(lastEl.style, bg);
      lastEl.innerHTML = '';
      lastEl.onclick = null;

      // Disable all clicks
      tileEls.forEach(t => t.style.pointerEvents = 'none');
    }
  }

  app.querySelector('#puz-reset').addEventListener('click', () => {
    tiles = makeShuffled();
    nextBtn.classList.add('hidden');
    tileEls.forEach(t => { t.style.pointerEvents = ''; });
    render();
  });

  nextBtn.addEventListener('click', () => navigate(renderFinal));

  // Wait for layout before first render so offsetWidth is accurate
  requestAnimationFrame(() => render());
}
