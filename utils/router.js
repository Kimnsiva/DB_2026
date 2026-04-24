// utils/router.js
// Simple SPA router — navigate(renderFn) clears #app and renders new page

export function navigate(renderFn) {
  const app = document.getElementById('app');

  // Fade out
  app.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  app.style.opacity = '0';
  app.style.transform = 'translateY(12px)';

  setTimeout(() => {
    app.innerHTML = '';
    renderFn(app);

    // Force a reflow so the transition fires correctly
    void app.offsetHeight;
    app.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    app.style.opacity = '1';
    app.style.transform = 'translateY(0)';
  }, 300);
}
