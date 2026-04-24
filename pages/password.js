// pages/password.js
import { navigate } from '../utils/router.js';
import { renderGreeting } from './greeting.js';

const CORRECT = '31012025';

export function renderPassword(app) {
  app.innerHTML = `
    <div class="card">
      <span class="lock-icon">🔐</span>
      <h2 class="display">ใส่รหัสลับ</h2>
      <p class="body-text" style="font-size:0.88rem; margin-top:8px;">
        🐧✨
      </p>
      <div class="divider"></div>

      <div class="pin-input" id="pin-input">
        ${Array.from({ length: 8 }).map((_, i) =>
    `<input class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" data-index="${i}">`
  ).join('')}
      </div>

      <p class="error-msg" id="err-msg"></p>

      <button class="btn btn-primary mt-sm" id="confirm-btn">ยืนยัน ✓</button>
    </div>
  `;

  const inputs = [...app.querySelectorAll('.pin-digit')];
  const errEl = app.querySelector('#err-msg');

  // Auto-focus first digit
  inputs[0].focus();

  // Auto-advance / backspace
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      const val = inp.value.replace(/\D/g, '');
      inp.value = val.slice(-1);
      if (val && i < inputs.length - 1) {
        inputs[i + 1].focus();
      } else if (val && i === inputs.length - 1) {
        // Auto-submit when last digit filled
        confirm();
      }
    });

    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value && i > 0) {
        inputs[i - 1].focus();
        inputs[i - 1].value = '';
      }
    });
  });

  function confirm() {
    const entered = inputs.map(i => i.value).join('');
    if (entered.length < 8) return;
    if (entered === CORRECT) {
      navigate(renderGreeting);
    } else {
      errEl.textContent = '❌ รหัสไม่ถูกต้อง ลองใหม่นะคะ~';
      inputs.forEach(i => {
        i.style.borderColor = '#e74c3c';
        i.value = '';
      });
      inputs[0].focus();
      setTimeout(() => {
        errEl.textContent = '';
        inputs.forEach(i => i.style.borderColor = '');
      }, 2000);
    }
  }

  app.querySelector('#confirm-btn').addEventListener('click', confirm);

  // Submit on Enter key
  inputs[inputs.length - 1].addEventListener('keydown', e => {
    if (e.key === 'Enter') confirm();
  });
}
