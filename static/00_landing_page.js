// transitions
window.addEventListener('pageshow', function(event) {
    document.body.style.transition = 'none';
    document.body.style.opacity = 0;

    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = 1;
    }, 0);
});


// type text
function typeText(element, text_to_type, speed) {
    let charIndex = 0;
    const typingSpeed = speed;
    const variationFactor = 0.6;

    function typeCharacter() {
        if (charIndex < text_to_type.length) {
            const char = text_to_type.charAt(charIndex);
            element.textContent += char; 
            charIndex++;
            const randomDelay = typingSpeed + (Math.random() - 0.5) * typingSpeed * 2 * variationFactor;
            setTimeout(typeCharacter, randomDelay);
        }
    }

    typeCharacter();
}

// execute function for all typed_text elements
document.addEventListener("DOMContentLoaded", () => {
    const typedElements = document.querySelectorAll(".typed_text");
    
    typedElements.forEach((element, index) => {
        const text_to_type = element.getAttribute("data-text").trim();
        const delay = parseInt(element.getAttribute("data-delay"));
        const speed = parseInt(element.getAttribute("data-speed"));
        element.textContent = "";
        setTimeout(() => {
            typeText(element, text_to_type, speed);
        }, delay);
    });
});


let scrolling_container = document.querySelector('#scrolling_container');
let text_container = document.querySelector('#faded_text');
let canScroll = true;
let timeout;
let lines = [
    '<a href="01_abyssora.html" class="question_link">Can architecture embody the DEPTHS<br>of UNCHARTED space?</a>',
    '<a href="01_artificially_intelligent_cities.html" class="question_link">Can human UNREASON negotiate<br>ALGORITHMIC control?</a>',
    '<a href="01_artificially_unreasonable_cities.html" class="question_link">Can architecture become<br>ARTIFICIALLY UNREASONABLE?</a>',
    '<a href="01_synthetic_exodus.html" class="question_link" style="cursor: none;">Can we be in motion as NOMADS<br>in a SETTLEMENT?</a>',
    '<a href="01_glacial_investigations.html" class="question_link">Can we cast the motion of GLACIERS<br>into SEDIMENT?</a>',
    '<a href="01_behind_closed_doors.html" class="question_link">What hides BEHIND<br>CLOSED DOORS?</a>',
    '<a href="01_pina_bausch.html" class="question_link">Can a building unfold MOTION<br>through a STORY?</a>',
    '<a href="01_matrix.html" class="question_link">Can a building UNFOLD<br>to become an INVENTORY?</a>',
    '<a href="01_heilbronn.html" class="question_link">Can we form AI into the<br>ROOTS of a city?</a>',
    '<a href="01_itree.html" class="question_link">Can we form TREES to<br>ROOT a new city?</a>',
    '<a href="01_tianfu.html" class="question_link">In a time where we take images<br>of OPERAS and TOWERS</a>',
    '<a href="01_flower_toilet.html" class="question_link">Is there time to imagine a TOILET<br>that grows FLOWERS?</a>'
];
let index = -2;


function scroll_question() {
    if (canScroll) {
        canScroll = false;
        text_container.style.opacity = 0; 

        setTimeout(() => {
            index = (index + 2) % lines.length;
            text_container.innerHTML = `${lines[index]}<br><br>${lines[index + 1]}`;
            text_container.style.opacity = 1;
            text_container.style.cursor = 'none';
            scrolling_container.scrollTop = 0;

            setTimeout(() => {
                canScroll = true;
            }, 500);
        }, 300);
    }    
}

function debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}

scrolling_container.addEventListener('scroll', debounce((e) => {
    scroll_question();
}, 100), {passive: false});


let menu_shown = 0;
let isAnimating = false;
const video = document.getElementById('background-video');
const background_image = document.getElementById('background_image');
let shelfImagesInFlight = 0;
const SHELF_IMAGE_PARALLEL = 3;
const shelfImageQueue = [];

// Deliberate smooth entrance parameters
const SHELF_FOLDER_ENTRANCE_MS = 380;
const SHELF_STAGGER_MS = 75;

// Fast & responsive exit parameters
const SHELF_FOLDER_EXIT_MS = 180;
const SHELF_EXIT_STAGGER_MS = 20;

const shelfTimers = [];
let shelfFrame;

// Every folder shows a tiny preview (~1 KB) at once; the sharp image replaces it when ready
function showShelfPreviews() {
    document.querySelectorAll('.folder-img').forEach((image) => {
        image.src = image.dataset.src.replace('/folders/', '/folders/tiny/');
    });
}

function loadShelfImage(image) {
    if (!image || image.dataset.imageState) return Promise.resolve();

    image.dataset.imageState = 'loading';
    const full = new Image();
    full.src = image.dataset.src;

    return full.decode()
        .catch(() => {})
        .then(() => {
            image.src = full.src;
            image.dataset.imageState = 'loaded';
            image.classList.add('is-loaded');
        });
}

// A few downloads in parallel, back to back
function processShelfImageQueue() {
    while (shelfImagesInFlight < SHELF_IMAGE_PARALLEL && shelfImageQueue.length) {
        const image = shelfImageQueue.shift();
        if (image.dataset.imageState) continue;
        shelfImagesInFlight++;
        loadShelfImage(image).finally(() => {
            shelfImagesInFlight--;
            processShelfImageQueue();
        });
    }
}

function queueShelfImage(image, priority = false) {
    if (!image || image.dataset.imageState) return;

    if (priority) {
        // The folder being opened loads right away, not behind the queue
        const queued = shelfImageQueue.indexOf(image);
        if (queued !== -1) shelfImageQueue.splice(queued, 1);
        loadShelfImage(image);
    } else if (!shelfImageQueue.includes(image)) {
        shelfImageQueue.push(image);
    }
}

function preloadShelfImages() {
    document.querySelectorAll('.folder-img').forEach((image) => queueShelfImage(image));
    processShelfImageQueue();
}

function clearAllShelfTimers() {
    window.cancelAnimationFrame(shelfFrame);
    shelfTimers.forEach((timer) => window.clearTimeout(timer));
    shelfTimers.length = 0;
}

function resetShelfState() {
    clearAllShelfTimers();
    document.querySelectorAll('.folder').forEach((folder) => {
        folder.classList.remove('is-entering', 'is-settled', 'is-hovered', 'is-exiting', 'is-shifted');
    });
}

function showStaggeredShelves() {
    isAnimating = true;
    const shelves = [document.getElementById('menu_left'), document.getElementById('menu_right')];
    const folders = shelves.flatMap((shelf) => Array.from(shelf.querySelectorAll('.folder')));
    const lastStep = Math.max(...folders.map((folder) => Number(folder.dataset.index)));

    resetShelfState();
    shelves.forEach((shelf) => shelf.classList.add('show-shelf'));

    shelfFrame = window.requestAnimationFrame(() => {
        folders.forEach((folder) => {
            const delay = Number(folder.dataset.index) * SHELF_STAGGER_MS;
            shelfTimers.push(window.setTimeout(() => {
                folder.classList.add('is-entering');
            }, delay));
            shelfTimers.push(window.setTimeout(() => {
                folder.classList.remove('is-entering');
                folder.classList.add('is-settled');
            }, delay + SHELF_FOLDER_ENTRANCE_MS));
        });
    });

    const totalEntranceTime = lastStep * SHELF_STAGGER_MS + SHELF_FOLDER_ENTRANCE_MS;
    shelfTimers.push(window.setTimeout(() => {
        isAnimating = false;
    }, totalEntranceTime));

    preloadShelfImages();
}

function hideStaggeredShelves() {
    isAnimating = true;
    clearAllShelfTimers();

    const shelves = [document.getElementById('menu_left'), document.getElementById('menu_right')];
    const folders = shelves.flatMap((shelf) => Array.from(shelf.querySelectorAll('.folder')));
    const maxIndex = Math.max(...folders.map((folder) => Number(folder.dataset.index)));

    // Animate folders sliding back offscreen with clean reverse stagger
    folders.forEach((folder) => {
        const idx = Number(folder.dataset.index);
        const delay = (maxIndex - idx) * SHELF_EXIT_STAGGER_MS;

        shelfTimers.push(window.setTimeout(() => {
            folder.classList.remove('is-settled', 'is-entering', 'is-hovered', 'is-shifted');
            folder.classList.add('is-exiting');
        }, delay));
    });

    const totalExitTime = maxIndex * SHELF_EXIT_STAGGER_MS + SHELF_FOLDER_EXIT_MS;

    shelfTimers.push(window.setTimeout(() => {
        shelves.forEach((shelf) => shelf.classList.remove('show-shelf'));
        folders.forEach((folder) => folder.classList.remove('is-exiting'));
        isAnimating = false;
    }, totalExitTime));
}

scrolling_container.addEventListener('click', function(e) {
    if (isAnimating) return;

    if (menu_shown === 0) {
        showStaggeredShelves();
        scrolling_container.style.opacity = 0;
        scrolling_container.style.pointerEvents = 'none';
        menu_shown = 1;
    } else {
        hideStaggeredShelves();
        scrolling_container.style.opacity = 0;
        scrolling_container.style.pointerEvents = 'auto';
        menu_shown = 0;
    }
});

// Click background to close shelves with smooth exit transition
document.body.addEventListener('click', (e) => {
    if (isAnimating) return;

    if (menu_shown === 1 && !e.target.closest('.folder') && !e.target.closest('#scrolling_container')) {
        // Touch: first tap outside only closes an open preview
        const previewed = document.querySelector('.folder.is-hovered');
        if (previewed && lastPointerType !== 'mouse') {
            clearShelfPreview(previewed.closest('.folder-shelf').id);
            return;
        }
        hideStaggeredShelves();
        scrolling_container.style.opacity = 0;
        scrolling_container.style.pointerEvents = 'auto';
        menu_shown = 0;
    }
});


/* ==========================================================================
   FOLDER HOVER SLIDING
   ========================================================================== */

// Mouse previews on hover; touch previews on the first tap and opens on the second
let lastPointerType = 'mouse';
window.addEventListener('pointerdown', (e) => { lastPointerType = e.pointerType; }, true);

function previewFolder(folder, shelfId) {
    if (isAnimating || menu_shown !== 1) return;
    const folders = Array.from(document.getElementById(shelfId).querySelectorAll('.folder'));
    const index = parseInt(folder.getAttribute('data-index'), 10);
    folders.forEach(f => f.classList.remove('is-hovered'));
    folder.classList.add('is-hovered');
    queueShelfImage(folder.querySelector('.folder-img'), true);
    updateShelfTransforms(folders, index);
}

function clearShelfPreview(shelfId) {
    const folders = Array.from(document.getElementById(shelfId).querySelectorAll('.folder'));
    folders.forEach((folder) => folder.classList.remove('is-hovered'));
    updateShelfTransforms(folders, -1);
}

function setupShelfHover(shelfId) {
    const shelf = document.getElementById(shelfId);
    if (!shelf) return;

    const folders = Array.from(shelf.querySelectorAll('.folder'));

    folders.forEach(folder => {
        if (folder.classList.contains('folder-cover')) return;

        folder.addEventListener('pointerenter', (e) => {
            if (e.pointerType === 'mouse') previewFolder(folder, shelfId);
        });

        // Registered before the page-transition handler, so it can hold back navigation
        folder.addEventListener('click', (e) => {
            if (lastPointerType === 'mouse' || folder.classList.contains('is-hovered')) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            ['menu_left', 'menu_right'].forEach(clearShelfPreview);
            previewFolder(folder, shelfId);
        });
    });

    shelf.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'mouse') clearShelfPreview(shelfId);
    });
}

function updateShelfTransforms(folders, hoverIndex) {
    folders.forEach((folder, i) => {
        folder.classList.toggle('is-shifted', hoverIndex !== -1 && i >= hoverIndex);
    });
}

function autoIndexShelves() {
    ['menu_left', 'menu_right'].forEach((shelfId) => {
        const shelf = document.getElementById(shelfId);
        if (!shelf) return;
        
        const cover = shelf.querySelector('.folder-cover');
        if (cover) {
            cover.setAttribute('data-index', '0');
            cover.style.setProperty('--i', '0');
            cover.style.setProperty('--z', '50');
            cover.style.zIndex = '50';
        }

        const folders = shelf.querySelectorAll('.folder:not(.folder-cover)');
        folders.forEach((folder, idx) => {
            const num = idx + 1;
            const tabTop = -1 + (idx % 7) * 7.5;
            
            folder.setAttribute('data-index', num);
            folder.style.setProperty('--i', num);
            folder.style.setProperty('--z', 25 - num);
            folder.style.setProperty('--tab-top', `${tabTop}vh`);
            folder.style.setProperty('--tab-step', idx % 7);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    autoIndexShelves();
    showShelfPreviews();
    setupShelfHover('menu_left');
    setupShelfHover('menu_right');

    // Touch screens: adapt the hint
    if (!window.matchMedia('(hover: hover)').matches) {
        const hint = document.querySelector('#copyright p');
        if (hint) hint.textContent = '// tap // swipe //';
    }

    // Global custom cursor (30px, glowing on interactive hover) - mouse only
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const customCursor = document.createElement('div');
    document.body.appendChild(customCursor);
    customCursor.style.position = 'fixed';
    customCursor.style.pointerEvents = 'none';
    customCursor.style.height = '30px';
    customCursor.style.width = '30px';
    customCursor.style.backgroundSize = 'contain';
    customCursor.style.backgroundRepeat = 'no-repeat';
    customCursor.style.backgroundPosition = 'center';
    customCursor.style.zIndex = '10000';
    customCursor.style.display = 'none';
    customCursor.style.transform = 'translate(-50%, -50%)';
    customCursor.style.opacity = '1';
    customCursor.style.transition = 'filter 0.2s ease, transform 0.18s ease';
  
    const squarePath = 'media/00_cursor/square.png';
    customCursor.style.backgroundImage = `url(${squarePath})`;

    window.addEventListener('mousemove', (e) => {
        customCursor.style.display = 'block';
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;

        const isInteractive = e.target.closest('a') || e.target.closest('.folder') || e.target.closest('#question_block') || e.target.closest('#name');
        if (isInteractive) {
            customCursor.style.filter = 'brightness(2.4) drop-shadow(0 0 6px rgba(230, 220, 255, 1)) drop-shadow(0 0 16px rgba(160, 140, 255, 0.95)) drop-shadow(0 0 28px rgba(110, 95, 255, 0.7))';
            customCursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
        } else {
            customCursor.style.filter = 'brightness(1) drop-shadow(0 0 0px transparent)';
            customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });

    window.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
    });
    }

    // Smooth page navigation transitions
    const hyperlinks = document.querySelectorAll('a');
    hyperlinks.forEach((hyperlink) => {
        hyperlink.addEventListener('click', function(e) {
            document.body.style.opacity = 0;
            const link = this.href;
            e.preventDefault();
            setTimeout(function() {
                window.location.href = link;
            }, 500);
        });
    });
});

// Folder images load in the background as soon as the page itself is ready,
// so they are already there when a folder opens
window.addEventListener('load', preloadShelfImages);
