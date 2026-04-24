// pages/final.js
import { navigate } from '../utils/router.js';
import { renderCountdown } from './countdown.js';

export function renderFinal(app) {
  app.innerHTML = `
    <div class="card">
      <span style="font-size:2.8rem; display:block; margin-bottom:4px;">🎬</span>
      <h2 class="display">สุขสันต์วันเกิดน้า 🎂</h2>
      <div class="divider"></div>

      <div id="video-wrap" style="
        width:100%;
        border-radius:14px;
        overflow:hidden;
        margin:24px 0;
        border:1px solid var(--rose);
        box-shadow: 0 10px 30px var(--shadow);
        opacity:0; transform:translateY(20px);
        transition: opacity 0.8s 0.3s ease, transform 0.8s 0.3s ease;
      ">
        <video
          id="bday-video"
          controls
          playsinline
          style="width:100%; height:auto; display:block; background:#000;"
        >
          <source src="happy-bday-main/2026.MOV" type="video/mp4">
          เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
        </video>
      </div>

      <button class="btn btn-secondary mt-lg" id="restart-btn" style="font-size:0.8rem; opacity:0; transition:opacity 0.6s 0.8s ease;">
        ⟳ กลับไปเริ่มใหม่
      </button>
    </div>
  `;

  // Staggered reveal
  requestAnimationFrame(() => {
    setTimeout(() => {
      const vw = app.querySelector('#video-wrap');
      if (vw) { vw.style.opacity = '1'; vw.style.transform = 'translateY(0)'; }
    }, 100);
    setTimeout(() => {
      const btn = app.querySelector('#restart-btn');
      if (btn) btn.style.opacity = '1';
    }, 600);
  });

  app.querySelector('#restart-btn').addEventListener('click', () => navigate(renderCountdown));
}
