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


// FALLBACK REGISTRY (Used if landing page HTML cannot be dynamically fetched)
const FALLBACK_PORTFOLIO_PROJECTS = [
  { url: '01_urban_creatures.html', title: 'Urban Creatures', icon: 'media/00_landing_page/Icons/Icon_Bellevue.png' },
  { url: '01_abyssora.html', title: 'Abyssora', icon: 'media/00_landing_page/Icons/Icon_Oasis.png' },
  { url: '01_artificially_intelligent_cities.html', title: 'AI Cities', icon: 'media/00_landing_page/Icons/Icon_Voluntary_Exile.png' },
  { url: '01_artificially_unreasonable_cities.html', title: 'AU Cities', icon: 'media/00_landing_page/Icons/Icon_SyntheticExodus.png' },
  { url: '01_synthetic_exodus.html', title: 'Synthetic Exodus', icon: 'media/00_landing_page/Icons/Icon_SyntheticExodus.png' },
  { url: '01_behind_closed_doors.html', title: 'Closed Doors', icon: 'media/00_landing_page/Icons/Icon_behind_closed_doors.png' },
  { url: '01_glacial_investigations.html', title: 'Glacial Remnants', icon: 'media/00_landing_page/Icons/Icon_GlacialRemnants.png' },
  { url: '01_voluntary_exile.html', title: 'Voluntary Exile', icon: 'media/00_landing_page/Icons/Icon_Voluntary_Exile.png' },
  { url: '01_pulse_motion.html', title: 'Pulse & Motion', icon: 'media/00_landing_page/Icons/Icon_pulse_motion.png' },
  { url: '01_oasis.html', title: 'Oasis', icon: 'media/00_landing_page/Icons/Icon_Oasis.png' },
  { url: '01_breating_down_your_neck.html', title: 'Breathing Neck', icon: 'media/00_landing_page/Icons/Icon_breating_down_your_neck.png' },
  { url: '01_flower_toilet.html', title: 'Flower Toilet', icon: 'media/00_landing_page/Icons/Icon_FlowerToilet.png' },
  { url: '01_presence_absence.html', title: 'Presence Absence', icon: 'media/00_landing_page/Icons/Icon_presence_absence.png' },
  { url: '01_new_heart.html', title: 'New Heart', icon: 'media/00_landing_page/Icons/Icon_NewHeart.png' },
  { url: '01_opera_duesseldorf.html', title: 'Opera Düsseldorf', icon: 'media/00_landing_page/Icons/Icon_Opera.png' },
  { url: '01_itree.html', title: 'iTree', icon: 'media/00_landing_page/Icons/Icon_iTree.png' },
  { url: '01_pina_bausch.html', title: 'Pina Bausch', icon: 'media/00_landing_page/Icons/Icon_PinaBausch.png' },
  { url: '01_tianfu.html', title: 'Tianfu Park', icon: 'media/00_landing_page/Icons/Icon_Tianfu.png' },
  { url: '01_heilbronn.html', title: 'Heilbronn', icon: 'media/00_landing_page/Icons/Icon_Heilbronn.png' },
  { url: '01_matrix.html', title: 'Matrix', icon: 'media/00_landing_page/Icons/Icon_Matrix.png' }
];

async function getDynamicProjectList() {
  try {
    const res = await fetch('00_landing_page.html');
    if (!res.ok) throw new Error('Fetch status ' + res.status);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const folders = doc.querySelectorAll('.folder:not(.folder-cover)');
    if (folders && folders.length > 0) {
      const list = [];
      folders.forEach(folder => {
        const href = folder.getAttribute('href') || '';
        const url = href.split('/').pop().split('?')[0];
        const titleEl = folder.querySelector('.folder-title') || folder.querySelector('.folder-name');
        const title = titleEl ? titleEl.textContent.trim() : url;
        const iconEl = folder.querySelector('.folder-icon');
        const icon = iconEl ? iconEl.getAttribute('src') : 'media/00_cursor/square.png';
        if (url) list.push({ url, title, icon });
      });
      if (list.length > 0) return list;
    }
  } catch (e) {
    // Return fallback if fetch is restricted
  }
  return FALLBACK_PORTFOLIO_PROJECTS;
}

async function setupCornerNavigation() {
  const projects = await getDynamicProjectList();
  const currentPath = window.location.pathname.toLowerCase();
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || '01_urban_creatures.html';

  let currentIndex = projects.findIndex(p => p.url.toLowerCase() === currentFile);
  if (currentIndex === -1) {
    if (currentFile.includes('glacial')) currentIndex = projects.findIndex(p => p.url.includes('glacial'));
    else if (currentFile.includes('breath')) currentIndex = projects.findIndex(p => p.url.includes('breath'));
    else if (currentFile.includes('opera')) currentIndex = projects.findIndex(p => p.url.includes('opera'));
    else if (currentFile.includes('bellevue')) currentIndex = 0;
    else {
      currentIndex = projects.findIndex(p => currentFile.includes(p.url.replace('.html', '').replace('01_', '')));
    }
    if (currentIndex === -1) currentIndex = 0;
  }

  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;

  const prevProj = projects[prevIndex];
  const nextProj = projects[nextIndex];

  // Previous Project Button (Bottom-Left)
  const prevBtn = document.createElement('a');
  prevBtn.href = prevProj.url;
  prevBtn.className = 'project-corner-nav nav-prev';
  prevBtn.title = `Previous: ${prevProj.title}`;
  prevBtn.innerHTML = `
    <img class="corner-nav-icon" src="${prevProj.icon}" alt="">
    <div class="corner-nav-label">
      <span class="corner-nav-dir">PREV</span>
      <span class="corner-nav-title">${prevProj.title}</span>
    </div>
  `;

  // Next Project Button (Bottom-Right)
  const nextBtn = document.createElement('a');
  nextBtn.href = nextProj.url;
  nextBtn.className = 'project-corner-nav nav-next';
  nextBtn.title = `Next: ${nextProj.title}`;
  nextBtn.innerHTML = `
    <div class="corner-nav-label" style="text-align: right;">
      <span class="corner-nav-dir">NEXT</span>
      <span class="corner-nav-title">${nextProj.title}</span>
    </div>
    <img class="corner-nav-icon" src="${nextProj.icon}" alt="">
  `;

  document.body.appendChild(prevBtn);
  document.body.appendChild(nextBtn);

  // Smooth page transition on click
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.href;
      document.body.style.opacity = 0;
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  });
}


// GALLERY & CUSTOM CURSOR
const header = document.getElementById('page_header_container');
const intro = document.getElementById('project_intro_container');
const gallery = document.getElementById('gallery');
const gallery2 = document.getElementById('gallery2');
let currentIndex = 0;
const video_container = document.getElementById('video_container');

document.addEventListener('DOMContentLoaded', () => {
  // Setup Next/Prev Corner Navigation
  setupCornerNavigation();

  // Custom Cursor (30px square, glowing on interactive & gallery hover)
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

  targetGallery.addEventListener('click', (e) => {
    const images = targetGallery.querySelectorAll('.gallery_item');
    if (!images.length) return;
    const galleryRect = targetGallery.getBoundingClientRect();
    const mouseXRelative = e.clientX - galleryRect.left;

    if (mouseXRelative < galleryRect.width / 2) {
        // Move to the previous image
        currentIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
    } else {
        // Move to the next image
        currentIndex = (currentIndex + 1) % images.length;
    }
    
    updateGallery(images, currentIndex);
  });

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
