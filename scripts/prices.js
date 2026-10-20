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

    const items = document.querySelectorAll('.prices__item, .prices__night, .prices__note');
    gsap.fromTo(items,
        { y: 16, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.03,
            ease: 'power3.out',
            delay: 0.2,
        }
    );
});