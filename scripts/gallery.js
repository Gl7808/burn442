import { initMenu } from './modules/menu.js';
import { initSmoothScroll } from './modules/scroll.js';
import { initGallery } from './modules/gallery.js';
import { initPageTransition } from './modules/page-transition.js';

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initSmoothScroll();
    initGallery();
    initPageTransition();
});