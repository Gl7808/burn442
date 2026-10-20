import { initMenu } from './modules/menu.js';
import { initSmoothScroll } from './modules/scroll.js';
import { initCatalog } from './modules/catalog.js';
import { initPageTransition } from './modules/page-transition.js';

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initSmoothScroll();
    initCatalog();
    initPageTransition();
});