import { initLoader } from './modules/loader.js';
import { initMenu } from './modules/menu.js';
import { initHero } from './modules/hero.js';
import { initModal } from './modules/modal.js';
import { initAbout } from './modules/about.js';
import { initSmoothScroll } from './modules/scroll.js';
import { initAdvantages } from './modules/advantages.js';
import { initGames } from './modules/games.js';
import { initPageTransition } from './modules/page-transition.js';

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initMenu();
    initHero();
    initModal();
    initAbout();
    initSmoothScroll();
    initAdvantages();
    initGames();
    initPageTransition();
});