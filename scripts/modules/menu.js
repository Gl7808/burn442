export function initMenu() {
    const burger = document.getElementById('burger');
    const slideMenu = document.getElementById('slideMenu');
    const slideMenuClose = document.getElementById('slideMenuClose');
    const overlay = document.getElementById('overlay');

    const cursorScope = document.getElementById('cursorScope');
    const cursorSvg = cursorScope?.querySelector('.cursor-scope__svg');
    const cursorNumber = document.getElementById('cursorNumber');

    const preview = document.getElementById('menuPreview');
    const previewImg = document.getElementById('menuPreviewImg');
    const previewLine = preview?.querySelector('.menu-preview__line');
    const menuList = slideMenu?.querySelector('.slide-menu__list');

    if (!burger || !slideMenu) return;

    // ==== Генерация рисок прицела ====
    if (cursorSvg) {
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
        cursorSvg.innerHTML = markup;
    }

    // ==== Прелоад картинок СРАЗУ при инициализации ====
    // К моменту, когда пользователь откроет меню, картинки уже в кеше
    slideMenu.querySelectorAll('.slide-menu__link').forEach((link) => {
        const src = link.dataset.img;
        if (src) {
            const im = new Image();
            im.src = src;
        }
    });

    // ==== Lerp-позиционирование ====
    const scopePos = { x: -200, y: -200 };
    const previewPos = { x: -300, y: -300 };
    const targetScope = { x: -200, y: -200 };
    const targetPreview = { x: -300, y: -300 };
    let rafId = null;

    const lerp = (a, b, t) => a + (b - a) * t;

    function tick() {
        scopePos.x = lerp(scopePos.x, targetScope.x, 0.15);
        scopePos.y = lerp(scopePos.y, targetScope.y, 0.15);
        previewPos.x = lerp(previewPos.x, targetPreview.x, 0.1);
        previewPos.y = lerp(previewPos.y, targetPreview.y, 0.1);

        if (cursorScope) {
            cursorScope.style.transform = `translate3d(${scopePos.x}px, ${scopePos.y}px, 0) translate(-50%, -50%)`;
        }
        if (preview) {
            preview.style.transform = `translate3d(${previewPos.x}px, ${previewPos.y}px, 0) translate(-50%, -50%)`;
        }
        rafId = requestAnimationFrame(tick);
    }

    // ==== Состояние превью ====
    let activeLink = null;
    let previewTl = null;
    let isPreviewHidden = true;

    // Убиваем ВСЕ анимации превью: и таймлайн, и одиночные твины
    function killPreviewTweens() {
        if (previewTl) {
            previewTl.kill();
            previewTl = null;
        }
        if (window.gsap) {
            gsap.killTweensOf([preview, previewImg, previewLine]);
        }
    }

    // ==== Показ превью ====
    function showPreview(link) {
        if (!window.gsap) return;

        const rect = link.getBoundingClientRect();
        targetPreview.x = rect.left - 120;
        targetPreview.y = rect.top + rect.height / 2;

        const imgSrc = link.dataset.img;

        // Обязательно убиваем все предыдущие анимации
        killPreviewTweens();

        if (isPreviewHidden) {
            // Первый показ: линия в ширину → картинка снизу вверх
            isPreviewHidden = false;
            previewPos.x = targetPreview.x;
            previewPos.y = targetPreview.y;
            if (previewImg && imgSrc) previewImg.src = imgSrc;

            previewTl = gsap.timeline()
                .set(preview, { opacity: 1 })
                .fromTo(previewLine,
                    { scaleX: 0 },
                    { scaleX: 1, duration: 0.28, ease: 'power2.out' })
                .fromTo(previewImg,
                    { clipPath: 'inset(100% 0% 0% 0%)' },
                    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut' },
                    '-=0.08');
        } else {
            // Смена пункта: сворачиваем → меняем картинку (пока невидима) → раскрываем
            previewTl = gsap.timeline()
                .to(previewImg, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.16, ease: 'power2.in' })
                .add(() => { if (previewImg && imgSrc) previewImg.src = imgSrc; })
                .set(previewImg, { clipPath: 'inset(100% 0% 0% 0%)' })
                .to(previewImg, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' });
        }
    }

    // ==== Скрытие превью (тоже через таймлайн, чтобы его можно было убить) ====
    function hidePreview() {
        if (!window.gsap) return;

        killPreviewTweens();
        isPreviewHidden = true;

        previewTl = gsap.timeline()
            .to(previewImg, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.22, ease: 'power2.in' }, 0)
            .to(previewLine, { scaleX: 0, duration: 0.28, ease: 'power2.in' }, 0.05)
            .to(preview, { opacity: 0, duration: 0.25 }, 0.12);
    }

    // ==== Обработчики пунктов (вешаются ОДИН раз) ====
    const links = slideMenu.querySelectorAll('.slide-menu__link');

    links.forEach((link) => {
        link.addEventListener('mouseenter', () => {
            if (activeLink === link) return;
            if (activeLink) activeLink.classList.remove('is-active');

            activeLink = link;
            link.classList.add('is-active');

            const number = link.querySelector('.slide-menu__number')?.textContent || '';
            if (cursorNumber) cursorNumber.textContent = number;

            if (cursorScope) gsap.to(cursorScope, { opacity: 1, duration: 0.3, ease: 'power2.out' });

            showPreview(link);
        });
    });

    // Прицел следует за курсором по всему меню
    slideMenu.addEventListener('mousemove', (e) => {
        targetScope.x = e.clientX;
        targetScope.y = e.clientY;
    });

    // Скрываем только когда курсор покинул ВЕСЬ список,
    // а не отдельный пункт — это убирает гонку между соседними пунктами
    if (menuList) {
        menuList.addEventListener('mouseleave', () => {
            if (activeLink) {
                activeLink.classList.remove('is-active');
                activeLink = null;
            }
            if (cursorScope) gsap.to(cursorScope, { opacity: 0, duration: 0.25, ease: 'power2.in' });
            hidePreview();
        });
    }

    // ==== Открытие / закрытие ====
    function openMenu() {
        burger.classList.add('is-active');
        burger.setAttribute('aria-expanded', 'true');
        slideMenu.classList.add('is-open');
        slideMenu.setAttribute('aria-hidden', 'false');
        overlay.classList.add('is-visible');

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function closeMenu() {
        burger.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
        slideMenu.classList.remove('is-open');
        slideMenu.setAttribute('aria-hidden', 'true');
        overlay.classList.remove('is-visible');

        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        killPreviewTweens();
        isPreviewHidden = true;

        if (window.gsap) {
            gsap.set(cursorScope, { opacity: 0 });
            gsap.set(preview, { opacity: 0 });
            gsap.set(previewImg, { clipPath: 'inset(100% 0% 0% 0%)' });
            gsap.set(previewLine, { scaleX: 0 });
        }

        if (activeLink) {
            activeLink.classList.remove('is-active');
            activeLink = null;
        }

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        scopePos.x = scopePos.y = -200;
        previewPos.x = previewPos.y = -300;
        targetScope.x = targetScope.y = -200;
        targetPreview.x = targetPreview.y = -300;
    }

    // ==== События ====
    burger.addEventListener('click', () => {
        slideMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    slideMenuClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && slideMenu.classList.contains('is-open')) closeMenu();
    });

    slideMenu.addEventListener('mouseleave', () => {
        if (cursorScope && window.gsap) gsap.to(cursorScope, { opacity: 0, duration: 0.2 });
        hidePreview();
        if (activeLink) {
            activeLink.classList.remove('is-active');
            activeLink = null;
        }
    });
}