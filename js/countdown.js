(function () {
  const WEDDING_DATE = new Date('2026-10-30T00:00:00-03:00');

  const els = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
  };

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = WEDDING_DATE.getTime() - now;

    if (diff <= 0) {
      els.days.textContent = '00';
      els.hours.textContent = '00';
      els.minutes.textContent = '00';
      els.seconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const copyBtn = document.getElementById('copy-cbu');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const cbu = '0140000703100063713888';
      try {
        await navigator.clipboard.writeText(cbu);
        copyBtn.textContent = '¡Copiado!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copiar CBU';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch {
        copyBtn.textContent = cbu;
      }
    });
  }
})();
