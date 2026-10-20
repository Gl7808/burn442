export function initPageTransition() {
    const transition = document.getElementById('pageTransition');
    const titleEl = document.getElementById('transitionTitle');
    const progressBar = document.getElementById('transitionProgress');

    if (!transition || !window.gsap) return;

    const blinds = [...transition.querySelectorAll('.page-transition__blind')];
    const content = transition.querySelector('.page-transition__content');

    let isTransitioning = false;

    function shouldSkipTransition(link) {
        if (!link || !link.href) return true;
        if (link.target === '_blank') return true;
        if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) return true;
        if (link.dataset.noTransition !== undefined) return true;
        if (link.href.includes('#') && link.href.split('#')[0] === window.location.href.split('#')[0]) return true;
        if (link.href.startsWith('http') && !link.href.startsWith(window.location.origin)) return true;
        return false;
    }

    function getPageTitle(link) {
        const label = link.querySelector('[class$="__label"]');
        if (label) return label.textContent.trim();

        const href = link.getAttribute('href');
        if (href === '/') return 'Главная';
        if (href.includes('about')) return 'О клубе';
        if (href.includes('prices')) return 'Тарифы';
        if (href.includes('promo')) return 'Акции';
        if (href.includes('hardware')) return 'Железо';
        if (href.includes('contacts')) return 'Контакты';
        if (href.includes('bar')) return 'Чай и кальяны';
        if (href.includes('catalog')) return 'Каталог игр';
        if (href.includes('gallery')) return 'Галерея';

        const text = link.textContent.trim();
        if (text) return text;

        return 'BURN44';
    }

    function resetTransition() {
        gsap.set(blinds, { scaleY: 0, transformOrigin: 'top' });
        gsap.set(content, { opacity: 0 });
        gsap.set(progressBar, { scaleX: 0 });
        transition.style.pointerEvents = 'none';
        isTransitioning = false;
    }

    function handleLinkClick(e) {
        const link = e.target.closest('a');
        if (!link || shouldSkipTransition(link)) return;

        e.preventDefault();

        if (isTransitioning) return;
        isTransitioning = true;

        const title = getPageTitle(link);
        const href = link.href;

        if (titleEl) titleEl.textContent = title;

        sessionStorage.setItem('pageTransition', 'true');

        const tl = gsap.timeline({
            onComplete: () => {
                window.location.href = href;
            },
        });

        tl.set(blinds, { scaleY: 0, transformOrigin: 'top' })
            .to(blinds, {
                scaleY: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: 'power3.inOut',
            })
            .to(content, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
            }, '-=0.2')
            .add(() => {
                gsap.to(progressBar, {
                    scaleX: 1,
                    duration: 0.8,
                    ease: 'power2.inOut',
                });
            }, '-=0.1')
            .to({}, { duration: 0.8 });
    }

    function initPageLoad() {
        const isTransition = sessionStorage.getItem('pageTransition') === 'true';

        if (isTransition) {
            sessionStorage.removeItem('pageTransition');

            gsap.set(blinds, { scaleY: 1, transformOrigin: 'bottom' });
            gsap.set(content, { opacity: 0 });

            const tl = gsap.timeline({
                onComplete: () => {
                    transition.style.pointerEvents = 'none';
                },
            });

            tl.to(blinds, {
                scaleY: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: 'power3.inOut',
            })
                .set(blinds, { transformOrigin: 'top' });
        } else {
            resetTransition();
        }
    }

    // Обработка восстановления страницы из кеша браузера
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            // Страница восстановлена из bfcache
            resetTransition();
            sessionStorage.removeItem('pageTransition');
        }
    });

    // Дополнительная защита: при загрузке страницы всегда сбрасываем состояние
    window.addEventListener('load', () => {
        if (!sessionStorage.getItem('pageTransition')) {
            resetTransition();
        }
    });

    document.addEventListener('click', handleLinkClick);

    initPageLoad();
}