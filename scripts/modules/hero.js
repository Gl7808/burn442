export function initHero() {
    const hero = document.querySelector('.hero');
    if (!hero || typeof Swiper === 'undefined') return;

    const slides = [...hero.querySelectorAll('.hero__slide')];
    const thumbs = [...hero.querySelectorAll('.hero__thumb')];
    const thumbsWrap = hero.querySelector('.hero__thumbs');

    // ==== Swiper ====
    const swiper = new Swiper('.hero__slider', {
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 900,
        autoplay: { delay: 16000, disableOnInteraction: false },
        on: {
            slideChange() {
                setActiveThumb(this.activeIndex);
                animateSlideIn(slides[this.activeIndex]);
            },
        },
    });

    thumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => swiper.slideTo(i));
    });

    function setActiveThumb(index) {
        thumbs.forEach((t, i) => t.classList.toggle('is-active', i === index));
    }

    // ==== Анимация контента активного слайда ====
    function animateSlideIn(slide) {
        if (!slide || !window.gsap) return;

        const els = slide.querySelectorAll('[data-hero-anim]');
        gsap.fromTo(els,
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: 'power3.out', overwrite: 'auto' });

        // Лёгкий "наезд" фона
        const bg = slide.querySelector('.hero__bg');
        if (bg) {
            gsap.fromTo(bg,
                { scale: 1.08 },
                { scale: 1, duration: 2.6, ease: 'power2.out', overwrite: 'auto' });
        }
    }

    // ==== Старт после лоадера ====
    let started = false;
    function start() {
        if (started) return;
        started = true;
        setActiveThumb(0);
        animateSlideIn(slides[0]);
    }

    const loader = document.getElementById('loader');
    if (!loader || loader.classList.contains('loader--hidden')) {
        start();
    } else {
        window.addEventListener('loader:complete', start, { once: true });
        setTimeout(start, 3200); // страховка, если событие не придёт
    }

    // ==== Превью-описание над миниатюрами ====
    const preview = document.getElementById('heroPreview');
    const previewBox = preview?.querySelector('.hero-preview__box');
    const previewText = preview?.querySelector('.hero-preview__text');
    const previewLine = preview?.querySelector('.hero-preview__line');

    if (!preview || !window.gsap) return;

    gsap.set(preview, { xPercent: -50, yPercent: -100, x: -600, y: -600 });
    const qx = gsap.quickTo(preview, 'x', { duration: 0.45, ease: 'power3.out' });
    const qy = gsap.quickTo(preview, 'y', { duration: 0.45, ease: 'power3.out' });

    let previewTl = null;
    let previewHidden = true;

    function killPreviewTweens() {
        if (previewTl) { previewTl.kill(); previewTl = null; }
        gsap.killTweensOf([preview, previewBox, previewLine]);
    }

    function showPreview(thumb) {
        const rect = thumb.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top - 16;

        previewText.textContent = thumb.dataset.preview || '';

        killPreviewTweens();

        if (previewHidden) {
            // Первый показ: линия в ширину → текст снизу вверх
            previewHidden = false;
            gsap.set(preview, { x, y });

            previewTl = gsap.timeline()
                .set(preview, { opacity: 1 })
                .fromTo(previewLine,
                    { scaleX: 0 },
                    { scaleX: 1, duration: 0.28, ease: 'power2.out' })
                .fromTo(previewBox,
                    { clipPath: 'inset(100% 0% 0% 0%)' },
                    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' },
                    '-=0.08');
        } else {
            // Переход между миниатюрами: плавно переезжаем, текст обновляем лёгким пульсом
            qx(x);
            qy(y);
            gsap.fromTo(previewText,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        }
    }

    function hidePreview() {
        killPreviewTweens();
        previewHidden = true;

        previewTl = gsap.timeline()
            .to(previewBox, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.22, ease: 'power2.in' }, 0)
            .to(previewLine, { scaleX: 0, duration: 0.26, ease: 'power2.in' }, 0.04)
            .to(preview, { opacity: 0, duration: 0.22 }, 0.12);
    }

    thumbs.forEach((thumb) => {
        thumb.addEventListener('mouseenter', () => showPreview(thumb));
    });

    if (thumbsWrap) {
        thumbsWrap.addEventListener('mouseleave', hidePreview);
    }
}