import { initMenu } from './modules/menu.js';
import { initModal } from './modules/modal.js';
import { initSmoothScroll } from './modules/scroll.js';
import { initBar } from './modules/bar.js';
import { initPageTransition } from './modules/page-transition.js';

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initModal();
    initSmoothScroll();
    initBar();
    initPageTransition();
});