const trimKey = (obj) => {
    const result = {};
    for (const key in obj) {
        result[key.trim()] = obj[key];
    }
    return result;
};

export async function initCatalog() {
    const grid = document.getElementById('catalogGrid');
    const searchInput = document.getElementById('catalogSearch');
    const tabs = document.querySelectorAll('.catalog__tab');
    const countSteam = document.getElementById('countSteam');
    const countPs5 = document.getElementById('countPs5');
    const statusCount = document.getElementById('catalogCount');
    const emptyBlock = document.getElementById('catalogEmpty');

    if (!grid || !searchInput) return;

    let steamGames = [];
    let ps5Games = [];
    let activePlatform = 'steam';
    let searchQuery = '';

    try {
        const [steamRes, ps5Res] = await Promise.all([
            fetch('games.json').then((r) => r.json()),
            fetch('ps5games.json').then((r) => r.json()),
        ]);
        steamGames = steamRes.map(trimKey).filter((g) => g.name && g.imageUrl);
        ps5Games = ps5Res.map(trimKey).filter((g) => g.name && g.image);
    } catch (e) {
        console.warn('Не удалось загрузить каталог игр', e);
    }

    countSteam.textContent = steamGames.length;
    countPs5.textContent = ps5Games.length;

    const escapeHtml = (str) =>
        String(str).replace(/[&<>"']/g, (ch) => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
        ));

    function getFiltered() {
        const list = activePlatform === 'steam' ? steamGames : ps5Games;
        const q = searchQuery.trim().toLowerCase();
        if (!q) return list;
        return list.filter((g) => g.name.toLowerCase().includes(q));
    }

    function renderCard(game) {
        const isSteam = activePlatform === 'steam';
        const imgUrl = isSteam ? game.imageUrl : game.image;
        const link = isSteam ? (game.storeUrl || '#') : '#';
        const genres = isSteam && Array.isArray(game.genres) ? game.genres.filter(Boolean) : [];
        const desc = isSteam ? game.description || '' : '';

        return `
      <a href="${escapeHtml(link)}" class="catalog__card" target="${isSteam ? '_blank' : '_self'}" rel="${isSteam ? 'noopener' : ''}">
        <div class="catalog__card-media">
          <img class="catalog__card-img" src="${escapeHtml(imgUrl)}" alt="${escapeHtml(game.name)}" loading="lazy" decoding="async">
          <div class="catalog__card-overlay">
            ${genres.length ? `
              <div class="catalog__card-genres">
                ${genres.slice(0, 3).map((g) => `<span class="catalog__card-genre">${escapeHtml(g)}</span>`).join('')}
              </div>
            ` : ''}
            ${desc ? `<p class="catalog__card-desc">${escapeHtml(desc)}</p>` : ''}
          </div>
        </div>
        <div class="catalog__card-info">
          <h3 class="catalog__card-title">${escapeHtml(game.name)}</h3>
          <span class="catalog__card-platform">${isSteam ? 'Steam' : 'PS5'}</span>
        </div>
      </a>
    `;
    }

    function render() {
        const filtered = getFiltered();
        statusCount.textContent = filtered.length;

        if (filtered.length === 0) {
            grid.innerHTML = '';
            grid.style.display = 'none';
            emptyBlock.hidden = false;
            return;
        }

        grid.style.display = '';
        emptyBlock.hidden = true;
        grid.innerHTML = filtered.map(renderCard).join('');

        if (window.gsap) {
            gsap.fromTo(grid.querySelectorAll('.catalog__card'),
                { y: 16, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.008,
                    ease: 'power2.out',
                    clearProps: 'transform',
                }
            );
        }
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            if (tab.dataset.platform === activePlatform) return;
            activePlatform = tab.dataset.platform;
            tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
            render();
        });
    });

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchQuery = e.target.value;
            render();
        }, 150);
    });

    render();
}