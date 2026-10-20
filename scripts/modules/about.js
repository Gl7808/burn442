export function initAbout() {
    const section = document.querySelector('.about');
    if (!section || typeof Swiper === 'undefined' || !window.gsap) return;

    const wrapper = document.getElementById('aboutWrapper');
    const prevBtn = section.querySelector('.about__arrow--prev');
    const nextBtn = section.querySelector('.about__arrow--next');

    // ==== Данные 18 фото ====
    const photos = [
        { file: '1.jpg',  title: 'Long Zone',     desc: 'Общий зал' },
        { file: '2.jpg',  title: 'DUO Zone',      desc: 'VIP зал' },
        { file: '3.jpg',  title: 'PS5 Zone',      desc: 'Консольный зал' },
        { file: '4.jpg',  title: 'Lounge',        desc: 'Лаунж зона' },
        { file: '5.jpg',  title: 'Bar',           desc: 'Бар' },
        { file: '6.jpg',  title: 'Stream Room',   desc: 'Стрим комната' },
        { file: '7.jpg',  title: 'Tournament',    desc: 'Турнирная зона' },
        { file: '8.jpg',  title: 'VIP Room',      desc: 'Приватная комната' },
        { file: '9.jpg',  title: 'Racing Zone',   desc: 'Гоночная зона' },
        { file: '10.jpg', title: 'VR Zone',       desc: 'VR зона' },
        { file: '11.jpg', title: 'Chill Zone',    desc: 'Зона отдыха' },
        { file: '12.jpg', title: 'Pro Zone',      desc: 'Про-зона' },
        { file: '13.jpg', title: 'Kids Zone',     desc: 'Детская зона' },
        { file: '14.jpg', title: 'Event Hall',    desc: 'Ивент зал' },
        { file: '15.jpg', title: 'Coworking',     desc: 'Коворкинг' },
        { file: '16.jpg', title: 'Night View',    desc: 'Ночной вид' },
        { file: '17.jpg', title: 'Entrance',      desc: 'Вход' },
        { file: '18.jpg', title: 'Exterior',      desc: 'Фасад' },
    ];

    // ==== Генерация слайдов ====
    photos.forEach((photo, i) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide about__slide';
        slide.dataset.index = i;
        slide.innerHTML = `
      <img class="about__img" src="images/photo/${photo.file}" alt="${photo.title}" loading="lazy" decoding="async">
      <div class="about__caption">
        <span class="about__caption-title">${photo.title}</span>
        <span class="about__caption-desc">${photo.desc}</span>
      </div>
      <div class="about__overlay"></div>
    `;
        wrapper.appendChild(slide);
    });

    // ==== Флаг для отслеживания drag ====
    let userInteracting = false;

    // ==== Swiper ====
    const swiper = new Swiper('#aboutSlider', {
        slidesPerView: 3,
        slidesPerGroup: 3, // Прокрутка по 3 слайда за раз
        spaceBetween: 16,
        speed: 700,
        grabCursor: true,
        navigation: {
            prevEl: prevBtn,
            nextEl: nextBtn,
        },
        breakpoints: {
            0:    { slidesPerView: 1.15, slidesPerGroup: 1, spaceBetween: 12 },
            640:  { slidesPerView: 2,    slidesPerGroup: 2, spaceBetween: 14 },
            1024: { slidesPerView: 3,    slidesPerGroup: 3, spaceBetween: 16 },
        },
    });

    // Отслеживаем взаимодействие пользователя (drag)
    swiper.on('touchStart', () => {
        userInteracting = true;
    });

    swiper.on('touchEnd', () => {
        setTimeout(() => {
            userInteracting = false;
        }, 50);
    });

    // ==== Анимация смены слайда ====
    function getVisibleOverlays() {
        return [...swiper.slides]
            .filter((s) => !s.classList.contains('swiper-slide-duplicate'))
            .map((s) => s.querySelector('.about__overlay'))
            .filter(Boolean);
    }

    // В начале перехода — заглушка появляется снизу вверх
    swiper.on('slideChangeTransitionStart', () => {
        if (userInteracting) return;

        const overlays = getVisibleOverlays();
        gsap.killTweensOf(overlays);
        gsap.to(overlays, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.35,
            stagger: 0.06,
            ease: 'power2.inOut',
        });
    });

    // В конце перехода — заглушка исчезает снизу вверх
    swiper.on('slideChangeTransitionEnd', () => {
        if (userInteracting) return;

        const overlays = getVisibleOverlays();
        gsap.killTweensOf(overlays);
        gsap.to(overlays, {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
        });
    });

    // ==== Lightbox ====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = lightbox.querySelector('.lightbox__close');

    function openLightbox(index) {
        const photo = photos[index];
        if (!photo) return;

        lightboxImg.src = `images/photo/${photo.file}`;
        lightboxImg.alt = photo.title;
        lightboxCaption.textContent = `${photo.title} / ${photo.desc}`;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Клик по слайду
    swiper.on('click', (sw, event) => {
        const slide = event.target.closest('.about__slide');
        if (!slide || slide.classList.contains('swiper-slide-duplicate')) return;
        const index = parseInt(slide.dataset.index, 10);
        openLightbox(index);
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });

    // ==== Прицел для фото ====
    const scope = document.getElementById('aboutScope');
    const scopeSvg = scope?.querySelector('.about-scope__svg');

    // Генерация рисок прицела
    if (scopeSvg) {
        const TICKS = 24, CX = 40, CY = 40;
        const R_OUT = 37, R_IN_MAJOR = 27, R_IN_MINOR = 32;
        let markup = '';

        for (let i = 0; i < TICKS; i++) {
            const angle = (360 / TICKS) * i;
            const isMajor = i % 4 === 0;
            const rIn = isMajor ? R_IN_MAJOR : R_IN_MINOR;
            const w = isMajor ? 1.5 : 0.8;
            const color = isMajor ? '#fd4a4f' : '#ffffff';
            const rad = ((angle - 90) * Math.PI) / 180;

            markup += `<line x1="${CX + Math.cos(rad) * rIn}" y1="${CY + Math.sin(rad) * rIn}"
                       x2="${CX + Math.cos(rad) * R_OUT}" y2="${CY + Math.sin(rad) * R_OUT}"
                       stroke="${color}" stroke-width="${w}" stroke-linecap="round" opacity="0.8"/>`;
        }
        scopeSvg.innerHTML = markup;
    }

    // Lerp для плавного следования
    const scopePos = { x: -200, y: -200 };
    const targetScope = { x: -200, y: -200 };
    let rafId = null;

    const lerp = (a, b, t) => a + (b - a) * t;

    function tick() {
        scopePos.x = lerp(scopePos.x, targetScope.x, 0.15);
        scopePos.y = lerp(scopePos.y, targetScope.y, 0.15);

        if (scope) {
            scope.style.transform = `translate3d(${scopePos.x}px, ${scopePos.y}px, 0) translate(-50%, -50%)`;
        }
        rafId = requestAnimationFrame(tick);
    }

    // Обработчики наведения на фото
    const slides = section.querySelectorAll('.about__slide');

    slides.forEach((slide) => {
        slide.addEventListener('mouseenter', () => {
            if (scope && window.gsap) {
                gsap.to(scope, { opacity: 1, duration: 0.3, ease: 'power2.out' });
            }
            if (!rafId) rafId = requestAnimationFrame(tick);
        });

        slide.addEventListener('mousemove', (e) => {
            targetScope.x = e.clientX;
            targetScope.y = e.clientY;
        });

        slide.addEventListener('mouseleave', () => {
            if (scope && window.gsap) {
                gsap.to(scope, { opacity: 0, duration: 0.25, ease: 'power2.in' });
            }
        });
    });

    // Остановка анимации при drag
    swiper.on('touchStart', () => {
        if (scope && window.gsap) {
            gsap.set(scope, { opacity: 0 });
        }
    });
}