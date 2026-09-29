// transitions
window.addEventListener('pageshow', function(event) {
  document.body.style.transition = 'none';
  document.body.style.opacity = 0;
  document.body.style.backgroundColor = '#000';

  setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease-in-out, background-color 1s ease-in-out';
      document.body.style.opacity = 1;
      document.body.style.backgroundColor = '#fff';
  }, 0);
});


// HEADERS
document.querySelectorAll('h1').forEach(function(header) {
  var words = header.textContent.split(' ');
  var newText = words.join('<br>');
  header.innerHTML = newText;
});


// GALLERY & CUSTOM CURSOR
const header = document.getElementById('page_header_container');
const intro = document.getElementById('project_intro_container');
const gallery = document.getElementById('gallery');
const gallery2 = document.getElementById('gallery2');
let currentIndex = 0;
const video_container = document.getElementById('video_container');

document.addEventListener('DOMContentLoaded', () => {



  // Custom Cursor (30px square, glowing on interactive & gallery hover) - mouse only
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

    const isInteractive = e.target.closest('a') || 
                          e.target.closest('button') || 
                          e.target.closest('#name') || 
                          e.target.closest('.interactive') || 
                          e.target.closest('.play_button') ||
                          e.target.closest('#gallery') ||
                          e.target.closest('#gallery2') ||
                          e.target.closest('.gallery_item') ||
                          e.target.closest('#image_grid') ||
                          e.target.closest('.grid_column') ||
                          e.target.closest('.circle-link') ||
                          e.target.closest('.project-corner-nav') ||
                          e.target.closest('.close') ||
                          e.target.closest('#video_container');

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

  // GALLERIES
  setupGallery(gallery);
  setupGallery(gallery2);

  // VIDEO
  if (video_container) {
    const video = document.getElementById('video');
    const play_button = document.querySelector('.play_button');

    if (video) {  
      video_container.addEventListener('mousemove', () => {
        if (play_button) {
          play_button.style.display = (video.paused || video.ended) ? 'block' : 'none';
        }
      });

      video.addEventListener('click', () => {
        if (video.paused || video.ended) {
          video.play();
        } else {
          video.pause();
        }
        video.disablePictureInPicture = true;
        video.controlsList.add("nodownload");
      });

      if (play_button) {
        play_button.addEventListener('click', function() {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        });
      }
    }
  }

  // IMAGE GRID
  const grid = document.getElementById('image_grid');
  if (grid) {
    const columns = document.querySelectorAll('.grid_column');

    columns.forEach(column => {
      column.addEventListener('click', function() {
        if (!gallery) return;
        gallery.innerHTML = '';
        const images = column.querySelectorAll('img');
  
        // Create gallery items for each image and append to modal content
        let imageClones = [];
        images.forEach(img => {
          const galleryItem = document.createElement('div');
          galleryItem.className = 'gallery_item';
          const imgClone = img.cloneNode();
          galleryItem.appendChild(imgClone);
          gallery.appendChild(galleryItem);
          imageClones.push(galleryItem);
        });

        currentIndex = 0;
        updateGallery(imageClones, currentIndex);
        gallery.style.display = 'flex';
      });
    });

    window.addEventListener('click', (event) => {
      if (gallery && event.target === gallery) {
        gallery.style.display = 'none';
      }
    });
  }
});


function setupGallery(targetGallery) {
  if (!targetGallery) return;

  function step(direction) {
    const images = targetGallery.querySelectorAll('.gallery_item');
    if (!images.length) return;
    currentIndex = (currentIndex + direction + images.length) % images.length;
    updateGallery(images, currentIndex);
  }

  targetGallery.addEventListener('click', (e) => {
    const galleryRect = targetGallery.getBoundingClientRect();
    const mouseXRelative = e.clientX - galleryRect.left;

    // Left half: previous image, right half: next image
    step(mouseXRelative < galleryRect.width / 2 ? -1 : 1);
  });

  // Touch: swipe left / right
  let touchStartX = null;
  let touchStartY = null;
  targetGallery.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  targetGallery.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    touchStartX = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  let images = targetGallery.querySelectorAll('.gallery_item');
  if (images.length) {
    updateGallery(images, currentIndex);
  }
}  

function updateGallery(images, targetIndex) {
  images.forEach((img, index) => {
    img.classList.remove('active', 'next', 'prev');

    if (index === targetIndex) {
      img.classList.add('active');
    } else if (index === (targetIndex + 1) % images.length) {
      img.classList.add('next');
    } else if (index === (targetIndex - 1 + images.length) % images.length) {
      img.classList.add('prev');
    }
  });
}

// PHONES: scale a long project intro down until it fits on one screen
function fitIntroToScreen() {
  const container = document.getElementById('project_intro_container');
  const introBox = document.getElementById('project_intro');
  if (!container || !introBox) return;

  const texts = introBox.querySelectorAll('p');
  texts.forEach((p) => p.style.removeProperty('font-size'));
  if (!texts.length || !window.matchMedia('(max-width: 700px)').matches) return;

  const style = getComputedStyle(container);
  const available = container.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  let size = parseFloat(getComputedStyle(texts[0]).fontSize);

  while (introBox.getBoundingClientRect().height > available && size > 9) {
    size -= 0.25;
    texts.forEach((p) => p.style.fontSize = `${size}px`);
  }
}

document.addEventListener('DOMContentLoaded', fitIntroToScreen);
window.addEventListener('load', fitIntroToScreen);
window.addEventListener('resize', fitIntroToScreen);
