export function initAdvantages() {
    const section = document.querySelector('.advantages');
    if (!section || !window.gsap) return;

    const preview = document.getElementById('advantagesPreview');
    const previewImg = document.getElementById('advantagesPreviewImg');
    const previewLine = preview?.querySelector('.advantages-preview__line');
    const links = [...section.querySelectorAll('.advantages__link')];
    const list = section.querySelector('.advantages__list');

    if (!preview) return;

    // ==== Размеры превью и отступ от курсора ====
    const PREVIEW_W = 190;
    const PREVIEW_H = 250;
    const CURSOR_GAP = 34;      // расстояние от курсора до края превью
    const EDGE_SAFE = 24;       // отступ от краёв экрана

    // ==== Прелоад картинок ====
    links.forEach((link) => {
        const src = link.dataset.img;
        if (src) new Image().src = src;
    });

    // ==== Позиционирование превью (lerp за мышью) ====
    const previewPos = { x: -500, y: -500 };
    const targetPreview = { x: -500, y: -500 };
    let rafId = null;

    const lerp = (a, b, t) => a + (b - a) * t;

    function tick() {
        previewPos.x = lerp(previewPos.x, targetPreview.x, 0.14);
        previewPos.y = lerp(previewPos.y, targetPreview.y, 0.14);
        preview.style.transform =
            `translate3d(${previewPos.x}px, ${previewPos.y}px, 0) translate(-50%, -50%)`;
        rafId = requestAnimationFrame(tick);
    }

    // Вычисляем позицию: справа от курсора, если нет места — слева
    function setTargetFromEvent(e) {
        const halfW = PREVIEW_W / 2;
        const halfH = PREVIEW_H / 2;

        let x = e.clientX + CURSOR_GAP + halfW;

        // Не влазит справа → показываем слева от курсора
        if (x + halfW > window.innerWidth - EDGE_SAFE) {
            x = e.clientX - CURSOR_GAP - halfW;
        }

        // Вертикально — по курсору, но не выходим за экран
        let y = e.clientY;
        y = Math.min(Math.max(y, halfH + EDGE_SAFE), window.innerHeight - halfH - EDGE_SAFE);

        targetPreview.x = x;
        targetPreview.y = y;
    }

    // ==== Состояние анимации превью ====
    let previewTl = null;
    let previewHidden = true;

    function killPreviewTweens() {
        if (previewTl) { previewTl.kill(); previewTl = null; }
        gsap.killTweensOf([preview, previewImg, previewLine]);
    }

    function showPreview(link, e) {
        const imgSrc = link.dataset.img;
        setTargetFromEvent(e);
        killPreviewTweens();

        if (previewHidden) {
            // Первый показ: сразу ставим в позицию курсора, без «перелёта»
            previewHidden = false;
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
            // Смена пункта: картинка сворачивается вверх → новая вырастает снизу
            previewTl = gsap.timeline()
                .to(previewImg, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.16, ease: 'power2.in' })
                .add(() => { if (previewImg && imgSrc) previewImg.src = imgSrc; })
                .set(previewImg, { clipPath: 'inset(100% 0% 0% 0%)' })
                .to(previewImg, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' });
        }

        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function hidePreview() {
        killPreviewTweens();
        previewHidden = true;

        previewTl = gsap.timeline()
            .to(previewImg, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.22, ease: 'power2.in' }, 0)
            .to(previewLine, { scaleX: 0, duration: 0.28, ease: 'power2.in' }, 0.05)
            .to(preview, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.12);
    }

    // ==== Глитч (scramble) эффект текста ====
    const GLITCH_CHARS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ0123456789#@%&*+=<>/\\';

    function scramble(el, duration = 520) {
        if (!el) return;
        if (!el.dataset.original) el.dataset.original = el.textContent.trim();
        const original = el.dataset.original;
        const len = original.length;

        if (el._glitchFrame) cancelAnimationFrame(el._glitchFrame);

        const start = performance.now();

        function frame(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // fast out
            const revealed = Math.floor(eased * len);

            let out = '';
            for (let i = 0; i < len; i++) {
                const ch = original[i];
                if (ch === ' ') { out += ' '; continue; }
                out += i < revealed
                    ? ch
                    : GLITCH_CHARS[(Math.random() * GLITCH_CHARS.length) | 0];
            }
            el.textContent = out;

            if (p < 1) {
                el._glitchFrame = requestAnimationFrame(frame);
            } else {
                el.textContent = original;
                el._glitchFrame = null;
            }
        }

        el._glitchFrame = requestAnimationFrame(frame);
    }

    function resetText(el) {
        if (!el) return;
        if (el._glitchFrame) {
            cancelAnimationFrame(el._glitchFrame);
            el._glitchFrame = null;
        }
        if (el.dataset.original) el.textContent = el.dataset.original;
    }

    // ==== Обработчики ====
    links.forEach((link) => {
        const label = link.querySelector('.advantages__label');
        const hint = link.querySelector('.advantages__hint');

        link.addEventListener('mouseenter', (e) => {
            showPreview(link, e);
            scramble(label, 520);
            setTimeout(() => scramble(hint, 420), 90);
        });

        link.addEventListener('mousemove', (e) => {
            setTargetFromEvent(e);
            if (previewHidden && !rafId) rafId = requestAnimationFrame(tick);
        });

        link.addEventListener('mouseleave', () => {
            hidePreview();
            resetText(label);
            resetText(hint);
        });
    });

    // Уход со всего списка
    if (list) list.addEventListener('mouseleave', () => {
        hidePreview();
        links.forEach((link) => {
            resetText(link.querySelector('.advantages__label'));
            resetText(link.querySelector('.advantages__hint'));
        });
    });

    // Останавливаем RAF, когда превью не нужно
    const stopObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting && rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }, { threshold: 0 });

    stopObserver.observe(section);
}