// pages/balloons.js
import { navigate } from '../utils/router.js';
import { renderPuzzle } from './puzzle.js';

const WISHES = [
  'ขอให้ที่รักเป็นคน สวย รวยเก่ง 💄✨',
  'ยอดขายปังเดือนละ 100 คัน! 🚗',
  'Good health, inside and out 💪',
  'ร่ำรวยเงินทอง 💰',
  'ขอให้เค้าได้มีโอกาสอวยพรแบบนี้ทุกปีเลย 🤍🥰',
  'โชคดีตลอดปีถูกหวยรวยเบอร์ ☘️',
  'Energy to do what you want 🤍',
  'May things keep getting better this year 🍡',
  'ขอให้มีคู่ครองที่ดี ไม่งี่เง่า\nโตเป็นผู้ใหญ่ กำนัน นายอำเภอ เอ้ย++ 5555\nพี่จูขอให้น้องฟ้าพบเจอแต่เรื่องราวดีๆ\nคนที่อยู่ในชีวิตก็ให้รักและเอ็นดูนานๆ\nเพี้ยงๆ สุขสันต์วันเกิดงับ 🎊\n— พี่จูม่า คอง 🌈',
  'สุขสันต์วันเกิดนะจ๊ะ 🎂\nไม่รู้จะอวยพรอะไรดี\nเพราะชีวิตฟ้าก็ดีครบหมดแล้วอะ\nงั้นก็ขอให้มันดีขึ้นอีกเรื่อยๆ\nแบบหยุดไม่อยู่เลยละกัน 🚀\nแล้วก็แอบขอให้แฟนฟ้า\nทำตัวน่ารักขึ้นกับฟ้าอีกหน่อยนะ\nจะได้เพอร์เฟคไปเลยยยย เพี๊ยงงงงง !!!\n— จากคุณแม่สองก้า 💕',
];

const BALLOON_EMOJIS = ['🎈', '🎀', '💗', '🌸', '🎊', '💕', '🌷', '✨', '🎁', '🌟', '🎁', '🌟'];

export function renderBalloons(app) {
  const total = WISHES.length;
  let current = 0; // index of the wish to show next

  app.innerHTML = `
    <div class="card">
      <span style="font-size:2rem; display:block; margin-bottom:4px;">🎈</span>
      <h2 class="display">Pop the Balloons!</h2>
      <p class="caption">กดบอลลูนเพื่อเปิดคำอวยพร ✨</p>
      <div class="divider"></div>

      <p class="balloon-count" id="bal-count">ลูกที่ 1 จาก ${total}</p>

      <div class="balloon-stage" id="stage"></div>

      <button class="btn btn-primary mt-md hidden" id="bal-next">ต่อไป →</button>
    </div>
  `;

  const stage = app.querySelector('#stage');
  const countEl = app.querySelector('#bal-count');
  const nextBtn = app.querySelector('#bal-next');

  // Spawn one balloon at a time
  spawnNext();

  function spawnNext() {
    if (current >= total) return;

    const i = current;
    const el = document.createElement('div');
    el.className = 'balloon';
    el.textContent = BALLOON_EMOJIS[i % BALLOON_EMOJIS.length];

    const left = 15 + Math.random() * 60; // keep away from edges
    const dur  = 6 + Math.random() * 4;  // 6-10s per loop (เร็วขึ้น)

    el.style.cssText = `
      left:${left}%;
      animation-name:floatUp;
      animation-duration:${dur}s;
      animation-delay:0s;
      animation-timing-function:ease-in-out;
      animation-iteration-count:infinite;
      animation-fill-mode:both;
    `;

    el.addEventListener('click', () => onPop(el, i));
    stage.appendChild(el);
  }

  function onPop(el, i) {
    if (el.classList.contains('popped')) return;
    el.classList.add('popped');
    current++;

    // Remove balloon after pop animation
    setTimeout(() => el.remove(), 400);

    const wish = WISHES[i];

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'wish-backdrop';

    // Centered wish card
    const bubble = document.createElement('div');
    bubble.className = 'wish-bubble';
    bubble.innerHTML = `
      <p style="font-size:0.75rem; color:var(--text-light); margin-bottom:10px; letter-spacing:0.06em;">
        🎈 คำอวยพร ${i + 1} / ${total}
      </p>
      <p class="wish-text">${wish.replace(/\n/g, '<br>')}</p>
      <button class="wish-close-btn">${current < total ? 'ลูกถัดไป →' : '🎉 ครบแล้ว!'}</button>
    `;

    const close = () => {
      backdrop.remove();
      bubble.remove();

      if (current < total) {
        // Small delay before next balloon appears
        countEl.textContent = `ลูกที่ ${current + 1} จาก ${total}`;
        setTimeout(spawnNext, 400);
      } else {
        countEl.textContent = '🎉 ครบทุกคำอวยพรแล้ว!';
        setTimeout(() => nextBtn.classList.remove('hidden'), 300);
      }
    };

    backdrop.addEventListener('click', close);
    bubble.querySelector('.wish-close-btn').addEventListener('click', close);

    // Auto-close: proportional to text length, min 4s, max 15s
    const readTime = Math.min(15000, Math.max(4000, wish.length * 70));
    const timer = setTimeout(close, readTime);

    // Cancel auto-close if user clicks manually
    bubble.querySelector('.wish-close-btn').addEventListener('click', () => clearTimeout(timer), { once: true });
    backdrop.addEventListener('click', () => clearTimeout(timer), { once: true });

    app.appendChild(backdrop);
    app.appendChild(bubble);
  }

  nextBtn.addEventListener('click', () => navigate(renderPuzzle));
}
