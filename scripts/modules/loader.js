export function initLoader() {
    const loader = document.getElementById('loader');
    const scope = document.getElementById('loaderScope');
    const percent = document.getElementById('loaderPercent');
    const title = document.getElementById('loaderTitle');
    const ticksBox = document.getElementById('loaderTicks');

    if (!loader || !window.gsap) return;

    // ==== Конфиг ====
    const TICKS_TOTAL = 60;        // сколько рисок в круге
    const MAJOR_EVERY = 5;         // каждая 5-я — длинная
    const DURATION = 0.2;          // время набора 0–100%

    // ==== Генерация рисок ====
    const ticks = [];

    for (let i = 0; i < TICKS_TOTAL; i++) {
        const tick = document.createElement('span');
        tick.className = 'loader__tick';

        if (i % MAJOR_EVERY === 0) {
            tick.classList.add('loader__tick--major');
        }

        const angle = (360 / TICKS_TOTAL) * i;
        tick.style.setProperty('--tick-angle', `${angle}deg`);

        ticksBox.appendChild(tick);
        ticks.push(tick);
    }

    // ==== Обновление активных рисок ====
    function renderProgress(value) {
        const activeCount = Math.floor((value / 100) * TICKS_TOTAL);

        ticks.forEach((tick, index) => {
            tick.classList.toggle('is-active', index < activeCount);
        });

        percent.textContent = Math.round(value);
    }

    // ==== Таймлайн ====
    const state = { value: 0 };

    const tl = gsap.timeline({
        onComplete() {
            loader.classList.add('loader--hidden');
            // разрешаем скролл после лоадера
            window.dispatchEvent(new CustomEvent('loader:complete'));
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        },
    });

    // Фаза 1: прогресс 0 → 100
    tl.to(state, {
        value: 100,
        duration: DURATION,
        ease: 'power2.inOut',
        onUpdate: () => renderProgress(state.value),
    });

    // Фаза 2: круг растворяется
    tl.to(scope, {
        opacity: 0,
        scale: 0.86,
        duration: 0.35,
        ease: 'power2.in',
    }, '+=0.05');

    // Фаза 3: появляется BURN 44
    tl.set(title, { visibility: 'visible' });
    tl.fromTo(
        title,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.4)' }
    );

    // Фаза 4: задержка и скрытие лоадера
    tl.to(title, {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
        delay: 0.2,
    });
}