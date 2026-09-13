(() => {
    const section = document.getElementById('panorama_section');
    if (!section) return;
    const viewport = section.querySelector('.panorama-viewport');
    const image = viewport.querySelector('img');
    const position = section.querySelector('input[type="range"]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const maximum = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);

    function sync() {
        const max = maximum();
        const progress = max ? Math.round(viewport.scrollLeft / max * 100) : 0;
        position.value = progress;
        position.setAttribute('aria-valuetext', `${progress}% across panorama`);
        position.disabled = max === 0;
    }
    function step(direction) {
        viewport.scrollBy({ left: direction * viewport.clientWidth * 0.7,
            behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
    position.addEventListener('input', () => {
        viewport.scrollLeft = Number(position.value) / 100 * maximum();
    });
    viewport.addEventListener('scroll', sync, { passive: true });
    viewport.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            step(event.key === 'ArrowLeft' ? -1 : 1);
        }
    });

    // Touch keeps native swiping and vertical page scrolling; mouse users can drag.
    let drag = null;
    viewport.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        drag = { x: event.clientX, scroll: viewport.scrollLeft };
        viewport.setPointerCapture(event.pointerId);
        viewport.classList.add('is-dragging');
    });
    viewport.addEventListener('pointermove', event => {
        if (drag) viewport.scrollLeft = drag.scroll - (event.clientX - drag.x);
    });
    function stopDrag() {
        drag = null;
        viewport.classList.remove('is-dragging');
    }
    viewport.addEventListener('pointerup', stopDrag);
    viewport.addEventListener('pointercancel', stopDrag);
    viewport.addEventListener('lostpointercapture', stopDrag);
    image.addEventListener('load', sync);
    new ResizeObserver(sync).observe(viewport);
    sync();
})();
