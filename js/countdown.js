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

  const searchInput = document.getElementById('mesa-search');
  const searchResult = document.getElementById('mesa-result');
  const tableCards = Array.from(document.querySelectorAll('.table-card'));

  function normalizeName(value) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function filterTables() {
    const query = normalizeName(searchInput.value);
    const matches = [];

    tableCards.forEach((card) => {
      const names = Array.from(card.querySelectorAll('li'));
      let hits = 0;

      names.forEach((name) => {
        const isMatch = query.length > 0 && normalizeName(name.textContent).includes(query);
        name.classList.toggle('is-match', isMatch);
        name.classList.toggle('is-dim', query.length > 0 && !isMatch);
        if (isMatch) {
          hits += 1;
          matches.push({
            name: name.textContent.trim(),
            mesa: card.dataset.mesa,
          });
        }
      });

      card.classList.toggle('is-dim', query.length > 0 && hits === 0);
      card.classList.toggle('is-hit', hits > 0);
    });

    if (!query) {
      searchResult.hidden = true;
      searchResult.textContent = '';
      searchResult.classList.remove('is-empty');
      return;
    }

    searchResult.hidden = false;
    searchResult.classList.toggle('is-empty', matches.length === 0);

    if (matches.length === 0) {
      searchResult.textContent = 'No encontramos ese nombre.';
      return;
    }

    const mesas = [...new Set(matches.map((match) => match.mesa))];
    if (matches.length === 1) {
      searchResult.textContent = matches[0].name + ' · Mesa ' + matches[0].mesa;
      return;
    }

    searchResult.textContent = matches.length + ' personas · ' + mesas.map((mesa) => 'Mesa ' + mesa).join(', ');
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterTables);
  }

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
