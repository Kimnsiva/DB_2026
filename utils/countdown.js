// utils/countdown.js
// Returns the next occurrence of the given birthday date/time

export function getNextBirthdayDate(month = 4, day = 25, hour = 10, minute = 31) {
  const now = new Date();
  let year = now.getFullYear();

  // month is 1-based here; Date uses 0-based
  let target = new Date(year, month - 1, day, hour, minute, 0, 0);

  if (now >= target) {
    // Already passed this year → use next year
    target = new Date(year + 1, month - 1, day, hour, minute, 0, 0);
  }

  return target;
}

/**
 * Start a live countdown.
 * @param {Date} targetDate
 * @param {Function} onTick  called every second with { days, hours, minutes, seconds }
 * @param {Function} onDone  called when countdown reaches zero
 * @returns {Function} stop — call to cancel the interval
 */
export function startCountdown(targetDate, onTick, onDone) {
  function tick() {
    const now  = Date.now();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      clearInterval(id);
      onDone();
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000)  / 60000);
    const seconds = Math.floor((diff % 60000)    / 1000);

    onTick({ days, hours, minutes, seconds });
  }

  tick();
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}
