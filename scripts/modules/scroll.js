export function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Интеграция с GSAP ScrollTrigger (если используешь)
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    // Разблокировка скролла после лоадера
    const loader = document.getElementById('loader');
    function enableScroll() {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        lenis.start();
    }

    if (!loader || loader.classList.contains('loader--hidden')) {
        enableScroll();
    } else {
        window.addEventListener('loader:complete', enableScroll, { once: true });
        setTimeout(enableScroll, 3200);
    }

    // Остановка скролла при открытии меню/модалки
    window.addEventListener('menu:open', () => lenis.stop());
    window.addEventListener('menu:close', () => lenis.start());
    window.addEventListener('modal:open', () => lenis.stop());
    window.addEventListener('modal:close', () => lenis.start());
}