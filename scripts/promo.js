import { initMenu } from './modules/menu.js';
import { initModal } from './modules/modal.js';
import { initSmoothScroll } from './modules/scroll.js';
import { initPageTransition } from './modules/page-transition.js';

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initModal();
    initSmoothScroll();
    initPageTransition();

    if (!window.gsap) return;

    const cards = document.querySelectorAll('.promo__card');
    gsap.fromTo(cards,
        { y: 24, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.2,
        }
    );
});