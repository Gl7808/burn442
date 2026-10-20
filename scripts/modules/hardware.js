// Данные зон
const ZONES = {
    long: {
        name: 'Long',
        specs: [
            { icon: 'screen', label: 'Монитор', value: 'Xiaomi Redmi Display X27G 165 Гц' },
            { icon: 'keyboard', label: 'Клавиатура', value: 'Thunderobot K87R' },
            { icon: 'mouse', label: 'Мышка', value: 'Razer DeathAdder Essential Black' },
            { icon: 'headphone', label: 'Наушники', value: 'A4Tech Fstyler FH200U' },
            { icon: 'chair', label: 'Кресло', value: 'Zombie' },
            { icon: 'cpu', label: 'Процессор', value: 'Ryzen 5 5600' },
            { icon: 'ram', label: 'Видеокарта', value: 'RTX 3060 Ti' },
            { icon: 'ram', label: 'Оперативка', value: 'DDR4 16GB' },
        ],
    },
    duo: {
        name: 'Duo',
        specs: [
            { icon: 'screen', label: 'Монитор', value: 'Xiaomi Redmi Display X27G 165 Гц' },
            { icon: 'keyboard', label: 'Клавиатура', value: 'Thunderobot K87R' },
            { icon: 'mouse', label: 'Мышка', value: 'Razer DeathAdder Essential Black' },
            { icon: 'headphone', label: 'Наушники', value: 'Fifine H6' },
            { icon: 'chair', label: 'Кресло', value: 'Zombie' },
            { icon: 'cpu', label: 'Процессор', value: 'Ryzen 5 5600' },
            { icon: 'ram', label: 'Видеокарта', value: 'RTX 4060' },
            { icon: 'ram', label: 'Оперативка', value: 'DDR4 16GB' },
        ],
    },
    trio: {
        name: 'Trio',
        specs: [
            { icon: 'screen', label: 'Монитор', value: 'Xiaomi Redmi Display X27G 165 Гц' },
            { icon: 'keyboard', label: 'Клавиатура', value: 'Thunderobot K87R' },
            { icon: 'mouse', label: 'Мышка', value: 'Razer DeathAdder Essential Black' },
            { icon: 'headphone', label: 'Наушники', value: 'Fifine H6' },
            { icon: 'chair', label: 'Кресло', value: 'Zombie' },
            { icon: 'cpu', label: 'Процессор', value: 'Ryzen 5 5600' },
            { icon: 'ram', label: 'Видеокарта', value: 'RTX 4060' },
            { icon: 'ram', label: 'Оперативка', value: 'DDR4 16GB' },
        ],
    },
    seven: {
        name: 'Seven',
        specs: [
            { icon: 'screen', label: 'Монитор', value: 'Xiaomi Redmi Display X27G 165 Гц' },
            { icon: 'keyboard', label: 'Клавиатура', value: 'Thunderobot K87R' },
            { icon: 'mouse', label: 'Мышка', value: 'Razer DeathAdder Essential Black' },
            { icon: 'headphone', label: 'Наушники', value: 'Fifine H6' },
            { icon: 'chair', label: 'Кресло', value: 'Zombie' },
            { icon: 'cpu', label: 'Процессор', value: 'Ryzen 5 5600' },
            { icon: 'ram', label: 'Видеокарта', value: 'RTX 4060' },
            { icon: 'ram', label: 'Оперативка', value: 'DDR4 16GB' },
        ],
    },
};

export function initHardware() {
    const section = document.querySelector('.hardware-zones');
    if (!section) return;

    const tabs = [...section.querySelectorAll('.hardware-zones__tab')];
    const content = document.getElementById('hardwareContent');
    const indicatorLine = section.querySelector('.hardware-zones__indicator-line');

    let activeZone = 'long';

    // Загрузка SVG иконки
    async function loadIcon(name) {
        try {
            const response = await fetch(`icons/hardware/${name}.svg`);
            const text = await response.text();
            return text;
        } catch (e) {
            console.warn(`Не удалось загрузить иконку: ${name}`);
            return '';
        }
    }

    // Генерация HTML карточки
    async function renderSpec(spec) {
        let iconSvg = await loadIcon(spec.icon);

        // Если SVG загрузился, оборачиваем его в контейнер
        if (iconSvg) {
            iconSvg = `<div class="hardware-zones__spec-icon">${iconSvg}</div>`;
        } else {
            iconSvg = `<div class="hardware-zones__spec-icon"></div>`;
        }

        return `
      <div class="hardware-zones__spec">
        ${iconSvg}
        <span class="hardware-zones__spec-label">${spec.label}</span>
        <span class="hardware-zones__spec-value">${spec.value}</span>
      </div>
    `;
    }

    // Рендер зоны
    async function renderZone(zoneKey) {
        const zone = ZONES[zoneKey];
        if (!zone) return;

        const specsHtml = await Promise.all(zone.specs.map(renderSpec));

        content.innerHTML = `
      <div class="hardware-zones__grid">
        ${specsHtml.join('')}
      </div>
    `;

        // Анимация появления карточек
        if (window.gsap) {
            gsap.fromTo(
                content.querySelectorAll('.hardware-zones__spec'),
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power3.out',
                }
            );
        }
    }

    // Обновление индикатора
    function updateIndicator(index) {
        if (!indicatorLine) return;
        const offset = index * 25;
        indicatorLine.style.transform = `translateX(${offset}%)`;
    }

    // Переключение зоны
    async function switchZone(zoneKey) {
        if (zoneKey === activeZone) return;

        activeZone = zoneKey;

        // Обновляем табы
        tabs.forEach((tab, i) => {
            const isActive = tab.dataset.zone === zoneKey;
            tab.classList.toggle('is-active', isActive);
            if (isActive) updateIndicator(i);
        });

        // Рендерим новую зону
        await renderZone(zoneKey);
    }

    // Обработчики табов
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            switchZone(tab.dataset.zone);
        });
    });

    // Инициализация
    renderZone(activeZone);
    updateIndicator(0);
}