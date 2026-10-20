const PHOTOS_COUNT = 5;

export function initGallery() {
    const grid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = lightbox?.querySelector('.lightbox__close');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (!grid || !lightbox) return;

    const photos = [];
    for (let i = 1; i <= PHOTOS_COUNT; i++) {
        photos.push(`images/photo/${i}.jpg`);
    }

    let currentIndex = 0;

    const plusIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  `;

    photos.forEach((src, i) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'gallery__item';
        item.dataset.index = i;
        item.setAttribute('aria-label', `Фото ${i + 1}`);
        item.innerHTML = `
      <img src="${src}" alt="Фото клуба ${i + 1}" loading="lazy" decoding="async">
      <span class="gallery__item-plus">${plusIcon}</span>
    `;
        grid.appendChild(item);
    });

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        if (!lightboxImg) return;
        lightboxImg.src = photos[currentIndex];
        if (lightboxCounter) {
            lightboxCounter.innerHTML = `<span>${currentIndex + 1}</span> / ${photos.length}`;
        }
    }

    function navigate(direction) {
        currentIndex = (currentIndex + direction + photos.length) % photos.length;

        if (window.gsap && lightboxImg) {
            gsap.to(lightboxImg, {
                opacity: 0,
                x: direction * 30,
                duration: 0.18,
                ease: 'power2.in',
                onComplete: () => {
                    updateLightbox();
                    gsap.fromTo(lightboxImg,
                        { opacity: 0, x: -direction * 30 },
                        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
                    );
                },
            });
        } else {
            updateLightbox();
        }
    }

    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery__item');
        if (!item) return;
        openLightbox(parseInt(item.dataset.index, 10));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigate(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    if (window.gsap) {
        gsap.fromTo(grid.querySelectorAll('.gallery__item'),
            { y: 24, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.03,
                ease: 'power3.out',
                delay: 0.2,
                clearProps: 'transform',
            }
        );
    }
}