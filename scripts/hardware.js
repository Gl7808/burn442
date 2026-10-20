import { initMenu } from './modules/menu.js';
import { initModal } from './modules/modal.js';
import { initHardware } from './modules/hardware.js';
import { initSmoothScroll } from './modules/scroll.js';
import { initPageTransition } from './modules/page-transition.js';

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initModal();
    initHardware();
    initSmoothScroll();
    initPageTransition();
});