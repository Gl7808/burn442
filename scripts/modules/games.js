const CATALOGS = {
    steam: {
        platform: 'PC',
        desc: 'Counter-Strike 2, Dota 2, Cyberpunk 2077 и ещё сотни игр. Всё установлено и обновлено — выбирай дисциплину и садись играть.',
        games: [
            { title: 'Counter-Strike 2',      genre: 'Шутер · FPS',       img: 'steam/1.jpg',  badge: 'Хит' },
            { title: 'Dota 2',                genre: 'MOBA',              img: 'steam/2.jpg',  badge: 'Хит' },
            { title: 'Cyberpunk 2077',        genre: 'RPG · Открытый мир', img: 'steam/3.jpg' },
            { title: 'Valorant',              genre: 'Шутер · FPS',       img: 'steam/4.jpg' },
            { title: 'Apex Legends',          genre: 'Battle Royale',     img: 'steam/5.jpg' },
            { title: 'Rust',                  genre: 'Survival',          img: 'steam/6.jpg' },
            { title: 'Elden Ring',            genre: 'Action RPG',        img: 'steam/7.jpg' },
            { title: "Baldur's Gate 3",       genre: 'RPG',               img: 'steam/8.jpg' },
            { title: 'Hogwarts Legacy',       genre: 'Action · RPG',      img: 'steam/9.jpg' },
            { title: 'Red Dead Redemption 2', genre: 'Action · Вестерн',  img: 'steam/10.jpg' },
            { title: 'PUBG: BATTLEGROUNDS',   genre: 'Battle Royale',     img: 'steam/11.jpg' },
            { title: 'S.T.A.L.K.E.R. 2',      genre: 'Шутер · FPS',       img: 'steam/12.jpg' },
        ],
    },

    ps5: {
        platform: 'PS5',
        desc: 'God of War Ragnarök, Spider-Man 2, EA SPORTS FC и другие хиты на PlayStation 5 Pro. 4K, адаптивные триггеры DualSense и приватные залы для своей компании.',
        games: [
            { title: 'EA SPORTS FC',             genre: 'Спорт · Футбол',   img: 'ps5/1.jpg',  badge: 'Хит' },
            { title: 'God of War Ragnarök',      genre: 'Action · Adventure', img: 'ps5/2.jpg' },
            { title: "Marvel's Spider-Man 2",    genre: 'Action · Открытый мир', img: 'ps5/3.jpg' },
            { title: 'Mortal Kombat 1',          genre: 'Файтинг',          img: 'ps5/4.jpg' },
            { title: 'Tekken 8',                 genre: 'Файтинг',          img: 'ps5/5.jpg' },
            { title: 'Gran Turismo 7',           genre: 'Гонки',            img: 'ps5/6.jpg' },
            { title: 'Returnal',                 genre: 'Roguelike · Шутер', img: 'ps5/7.jpg' },
            { title: "Demon's Souls",            genre: 'Action RPG',       img: 'ps5/8.jpg' },
            { title: 'The Last of Us Part 2',    genre: 'Action · Adventure', img: 'ps5/9.jpg' },
            { title: 'Resident Evil VILLAGE',          genre: 'Horror · Action',  img: 'ps5/10.jpg' },
            { title: 'Ratchet & Clank: Rift Apart', genre: 'Платформер',    img: 'ps5/11.jpg' },
            { title: 'Stellaris',            genre: 'Action · RPG',     img: 'ps5/12.jpg' },
        ],
    },
};

const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
));

export function initGames() {
    const section = document.querySelector('.games');
    if (!section) return;

    const sliderEl = section.querySelector('#gamesSlider');
    const wrapper = section.querySelector('#gamesWrapper');
    const wipe = section.querySelector('.games__wipe');
    const descEl = section.querySelector('.games__platform-desc');
    const tabList = section.querySelector('.games__tabs');
    const tabs = [...section.querySelectorAll('.games__tab')];

    if (!sliderEl || !wrapper) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let active = 'steam';
    let swiper = null;
    let wipeTl = null;
    let cardsRevealed = false;
    let countersStarted = false;

    // ==== Генерация карточки ====
    function cardHTML(game, platform) {
        const platformLabel = CATALOGS[platform].platform;

        return `
      <div class="swiper-slide games__slide">
        <a href="catalog.html" class="games__card" aria-label="${escapeHtml(game.title)} — ${escapeHtml(game.genre)}">
          <div class="games__card-media">
            <img class="games__card-img"
                 src="images/games/${escapeHtml(game.img)}"
                 alt="${escapeHtml(game.title)}"
                 loading="lazy" decoding="async">
            <span class="games__card-platform">${platformLabel}</span>
            ${game.badge ? `<span class="games__card-badge">${escapeHtml(game.badge)}</span>` : ''}
            <span class="games__card-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M7 17L17 7M17 7H8M17 7V16"/>
              </svg>
            </span>
          </div>
          <div class="games__card-info">
            <h3 class="games__card-title">${escapeHtml(game.title)}</h3>
            <span class="games__card-genre">${escapeHtml(game.genre)}</span>
          </div>
        </a>
      </div>
    `;
    }

    function render() {
        wrapper.innerHTML = CATALOGS[active].games
            .map((game) => cardHTML(game, active))
            .join('');

        // Если постер ещё не добавлен — не показываем битую иконку
        wrapper.querySelectorAll('.games__card-img').forEach((img) => {
            img.addEventListener('error', () => img.classList.add('is-missing'), { once: true });
            if (img.complete && img.naturalWidth === 0) img.classList.add('is-missing');
        });
    }

    function initSwiper() {
        if (typeof Swiper === 'undefined') return;

        swiper = new Swiper(sliderEl, {
            slidesPerView: 5,
            spaceBetween: 18,
            grabCursor: true,
            speed: 650,
            navigation: {
                prevEl: section.querySelector('.games__arrow--prev'),
                nextEl: section.querySelector('.games__arrow--next'),
            },
            a11y: {
                enabled: true,
                prevSlideMessage: 'Предыдущие игры',
                nextSlideMessage: 'Следующие игры',
            },
            // Колесо не перехватываем — страница скроллится через Lenis.
            // Лента двигается драгом, стрелками и свайпом.
            breakpoints: {
                0:    { slidesPerView: 1.35, spaceBetween: 12 },
                640:  { slidesPerView: 2.3,  spaceBetween: 14 },
                1024: { slidesPerView: 3.5,  spaceBetween: 16 },
                1440: { slidesPerView: 5,    spaceBetween: 18 },
            },
        });
    }

    function rebuild() {
        if (window.gsap) gsap.killTweensOf(wrapper.querySelectorAll('.games__slide'));
        if (swiper) {
            swiper.destroy(true, true);
            swiper = null;
        }
        render();
        initSwiper();
    }

    // ==== Смена платформы ====
    function switchTo(key) {
        if (key === active) return;

        // Не даём новым кликам ломать текущую перетяжку
        if (wipeTl && wipeTl.isActive()) return;

        active = key;

        tabs.forEach((tab) => {
            const selected = tab.dataset.platform === key;
            tab.classList.toggle('is-active', selected);
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
        });

        descEl.setAttribute('aria-labelledby', `tab-${key}`);

        if (!window.gsap || reduceMotion) {
            descEl.textContent = CATALOGS[key].desc;
            rebuild();
            return;
        }

        if (wipeTl) wipeTl.kill();
        gsap.killTweensOf(wipe);

        wipeTl = gsap.timeline()
            // Красная заглушка выезжает снизу вверх
            .fromTo(wipe,
                { clipPath: 'inset(100% 0% 0% 0%)' },
                { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'power3.inOut' },
                0)
            .to(descEl, { opacity: 0, y: 6, duration: 0.2, ease: 'power2.in' }, 0)
            // Под заглушкой меняем контент — пользователь не видит скачка
            .add(() => {
                descEl.textContent = CATALOGS[key].desc;
                rebuild();
            })
            // Заглушка уходит вниз, открывая новый каталог
            .to(wipe, {
                clipPath: 'inset(0% 0% 100% 0%)',
                duration: 0.55,
                ease: 'power3.inOut',
            }, '+=0.06')
            .to(descEl, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power3.out',
            }, '-=0.4');
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => switchTo(tab.dataset.platform));
    });

    // Клавиатура для role="tablist"
    tabList.addEventListener('keydown', (e) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault();

        const index = tabs.findIndex((tab) => tab.dataset.platform === active);
        let next = index;

        if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = tabs.length - 1;

        tabs[next].focus();
        switchTo(tabs[next].dataset.platform);
    });

    // ==== Счётчики ====
    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        if (!Number.isFinite(target)) return;

        if (reduceMotion) {
            el.textContent = target;
            return;
        }

        const start = performance.now();
        const duration = 1400;

        function frame(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        section.querySelectorAll('[data-count]').forEach(animateCounter);
    }

    // ==== Появление секции ====
    const revealEls = [...section.querySelectorAll('.games__reveal')];

    function revealCards() {
        if (cardsRevealed || !swiper || !window.gsap || reduceMotion) return;
        cardsRevealed = true;

        gsap.fromTo(
            [...swiper.slides].slice(0, 6),
            { y: 36, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.06,
                ease: 'power3.out',
                // ВАЖНО: не трогаем width — его задаёт Swiper
                clearProps: 'transform,opacity',
            }
        );
    }

    if ('IntersectionObserver' in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('is-visible');

                if (entry.target === sliderEl) revealCards();
                if (entry.target.querySelector('.games__stats')) startCounters();

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15 });

        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
        startCounters();
    }

    // ==== Старт ====
    render();
    initSwiper();
}