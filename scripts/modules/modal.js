export function initModal() {
    const modal = document.getElementById('bookingModal');
    if (!modal || !window.gsap) return;

    const overlay = modal.querySelector('.modal__overlay');
    const win = modal.querySelector('.modal__window');
    const openers = document.querySelectorAll('[data-modal-open]');
    const closers = modal.querySelectorAll('[data-modal-close]');

    let isOpen = false;
    let tl = null;

    function open() {
        if (isOpen) return;
        isOpen = true;
        modal.setAttribute('aria-hidden', 'false');

        if (tl) tl.kill();
        tl = gsap.timeline()
            .set(modal, { visibility: 'visible' })
            .fromTo(overlay,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power1.out' })
            .fromTo(win,
                { opacity: 0, y: 40, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' },
                '-=0.15');
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        modal.setAttribute('aria-hidden', 'true');

        if (tl) tl.kill();
        tl = gsap.timeline({
            onComplete: () => gsap.set(modal, { visibility: 'hidden' }),
        })
            .to(win, { opacity: 0, y: 24, duration: 0.3, ease: 'power2.in' })
            .to(overlay, { opacity: 0, duration: 0.25 }, '-=0.15');
    }

    openers.forEach((btn) => btn.addEventListener('click', open));
    closers.forEach((btn) => btn.addEventListener('click', close));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) close();
    });
}