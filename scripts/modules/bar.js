const HOOKAH_DATA = {
    light: [
        {
            name: 'Клубничный фраг',
            ingredients: ['Клубника', 'Брусничное пюре', 'Ягодный сорбет'],
        },
        {
            name: 'Кислый коммит',
            ingredients: ['Лимон 2.0', 'Малина', 'Сктиллз'],
        },
        {
            name: 'Тропический патч',
            ingredients: ['Кубики манго', 'Ананас', 'Пюре из маракуйя'],
        },
        {
            name: 'Обновление фокуса',
            ingredients: ['Гуарана', 'Черника', 'Клубничный мохито'],
        },
        {
            name: 'Мятный кэш',
            ingredients: ['Азиатская дыня', 'Желтый арбуз', 'Мятная пастилка'],
        },
    ],
    medium: [
        {
            name: 'Ягодное наступление',
            ingredients: ['Клубника', 'Крыжовник', 'Виноград'],
        },
        {
            name: 'Темный фрагмент',
            ingredients: ['Черника', 'Ежевичная маргарита', 'Черная смородина'],
        },
        {
            name: 'Призыв пустыни',
            ingredients: ['Манго-Маракуйя', 'Яркая папайя'],
        },
        {
            name: 'Сайленс Нейна',
            ingredients: ['Киви', 'Кислое яблоко', 'Виноград'],
        },
        {
            name: 'Радиационный Чилл',
            ingredients: ['Огуречный лимонад', 'Киви', 'Виноград'],
        },
        {
            name: 'Дроп с мяты',
            ingredients: ['Арбуз-Дыня', 'Тростниковая мята'],
        },
        {
            name: 'Сладость Дендро',
            ingredients: ['Кокосовый шейк', 'Малина', 'Шоколадное печенье'],
        },
    ],
    strong: [
        {
            name: 'Алая свежесть',
            ingredients: ['Базилик лимонад', 'Клубника', 'Клубничный мохито'],
        },
        {
            name: 'Точка Б',
            ingredients: ['Ананас с манго', 'Маракуйя'],
        },
        {
            name: 'Отвар Ведьмака',
            ingredients: ['Кислые ягоды', 'Малина', 'Вишневое желе'],
        },
        {
            name: 'Рейд Палача',
            ingredients: ['Клубника', 'Дикая земляника', 'Крыжовник'],
        },
        {
            name: 'Письмо Мэри',
            ingredients: ['Цветочно-пудровый парфюм', 'Парфюмная мята', 'Фиалковый зефир'],
        },
    ],
    author: [
        {
            name: 'Сливочное пиво',
            ingredients: ['Сливочная карамель', 'Сливочное масло', 'Темное пиво'],
        },
    ],
};

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
}

function renderCards(category) {
    const items = HOOKAH_DATA[category] || [];
    return items.map((item, i) => `
    <article class="hookah__card">
      <div class="hookah__card-head">
        <span class="hookah__card-num">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="hookah__card-title">${escapeHtml(item.name)}</h3>
      </div>
      <p class="hookah__card-ingredients">${item.ingredients.map(escapeHtml).join(' · ')}</p>
    </article>
  `).join('');
}

export function initBar() {
    const content = document.getElementById('hookahContent');
    const tabs = document.querySelectorAll('.hookah__tab');
    if (!content || !tabs.length) return;

    let active = 'light';

    function switchCategory(key) {
        if (key === active) return;
        active = key;

        tabs.forEach((tab) => {
            tab.classList.toggle('is-active', tab.dataset.category === key);
        });

        if (!window.gsap) {
            content.innerHTML = renderCards(key);
            return;
        }

        gsap.to(content, {
            opacity: 0,
            duration: 0.18,
            ease: 'power2.in',
            onComplete: () => {
                content.innerHTML = renderCards(key);
                gsap.fromTo(content.querySelectorAll('.hookah__card'),
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.35,
                        stagger: 0.03,
                        ease: 'power2.out',
                        onStart: () => gsap.set(content, { opacity: 1 }),
                    }
                );
            },
        });
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => switchCategory(tab.dataset.category));
    });

    content.innerHTML = renderCards(active);
}