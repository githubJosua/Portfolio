// transitions
document.addEventListener('DOMContentLoaded', function() {
  document.body.style.opacity = 1
  document.body.style.backgroundColor = '#fff'
});


// HEADERS
document.querySelectorAll('h1').forEach(function(header) {
  var words = header.textContent.split(' ');
  var newText = words.join('<br>');
  header.innerHTML = newText;
});

// Scrolling Behaviour
let scrollTimeout = null;
let canScroll = true;

function scroll_to_next_section(direction) {
  if (canScroll) {
      canScroll = false;

      setTimeout(() => {
        const snapPoints = document.querySelectorAll('.snap_section');
        let currentSection = document.querySelector('.current_section');
  
        let targetSection;
        if (direction === 'down') {
          targetSection = currentSection.nextElementSibling || currentSection; // || -> default if none is given 
        } else if (direction === 'up') {
          targetSection = currentSection.previousElementSibling || snapPoints[0];
        } else {
          targetSection = currentSection.nextElementSibling || currentSection;
        }
  
        if (targetSection && targetSection !== currentSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          if (currentSection) currentSection.classList.remove('current_section');
          targetSection.classList.add('current_section');
        }

        setTimeout(() => {
          canScroll = true;
        }, 500);
      }, 200);
  }    
}

document.addEventListener('wheel', (e) => {
  e.preventDefault();
  const direction = e.deltaY > 0 ? 'down' : 'up';
  scroll_to_next_section(direction);
}, {passive: false});



// GALLERY Mouse and Navigation
const header = document.getElementById('page_header_container');
const intro = document.getElementById('project_intro_container');
const gallery = document.getElementById('gallery');
let currentIndex = 0;
const video_container = document.getElementById('video_container');

const cursorPaths = {
  cursor: 'media/00_cursor/cursor.png',
  left: 'media/00_cursor/cursor_left.png',
  right: 'media/00_cursor/cursor_right.png',
  up: 'media/00_cursor/cursor_up.png',
  down: 'media/00_cursor/cursor_down.png'
};

document.addEventListener('DOMContentLoaded', () => {
  // Custom Cursor
  const customCursor = document.createElement('div');
  document.body.appendChild(customCursor);
  customCursor.style.position = 'absolute';
  customCursor.style.pointerEvents = 'none';
  customCursor.style.height = '50px';
  customCursor.style.width = '50px';
  customCursor.style.backgroundSize = 'cover';
  customCursor.style.zIndex = '1000';
  customCursor.style.display = 'none';

  header.addEventListener('mousemove', (e) => {
    customCursor.style.display = 'block';
    customCursor.style.left = `${e.pageX}px`;
    customCursor.style.top = `${e.pageY}px`;

    customCursor.style.backgroundImage = `url(${cursorPaths.down})`;
  });
  header.addEventListener('mouseleave', () => {
    customCursor.style.display = 'none';
  });
  header.addEventListener('click', () => {
    scroll_to_next_section('down');
  });

  intro.addEventListener('mousemove', (e) => {
    customCursor.style.display = 'block';
    customCursor.style.left = `${e.pageX}px`;
    customCursor.style.top = `${e.pageY}px`;

    customCursor.style.backgroundImage = `url(${cursorPaths.down})`;
  });
  intro.addEventListener('mouseleave', () => {
    customCursor.style.display = 'none';
  });
  intro.addEventListener('click', () => {
    scroll_to_next_section('down');
  });

  let image_containers = document.querySelectorAll('.image_container')
  image_containers.forEach((image_container) => {
    if (image_container) {
      image_container.addEventListener('mousemove', (e) => {
        customCursor.style.display = 'block';
        customCursor.style.left = `${e.pageX}px`;
        customCursor.style.top = `${e.pageY}px`;
    
        customCursor.style.backgroundImage = `url(${cursorPaths.down})`;
      });
      image_container.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
      });
      image_container.addEventListener('click', () => {
        scroll_to_next_section('down');
      });
    }
  });

  if (gallery) {
    gallery.addEventListener('mousemove', (e) => {
      const galleryRect = gallery.getBoundingClientRect();
      const mouseXRelative = e.clientX - galleryRect.left;
  
      customCursor.style.display = 'block';
  
      customCursor.style.left = `${e.pageX}px`;
      customCursor.style.top = `${e.pageY}px`;
  
      // Left / Right
      if (mouseXRelative < galleryRect.width / 2) {
          customCursor.style.backgroundImage = `url(${cursorPaths.left})`;
      } else {
          customCursor.style.backgroundImage = `url(${cursorPaths.right})`;
      }
    });
  
    gallery.addEventListener('mouseleave', () => {
      customCursor.style.display = 'none';
    });
  }

  // VIDEO
  if (video_container) {
    const video = document.getElementById('video');
    const play_button = document.querySelector('.play_button');

    if (video) {  
      video_container.addEventListener('mousemove', (e) => {
        customCursor.style.display = 'block';
        customCursor.style.left = `${e.pageX}px`;
        customCursor.style.top = `${e.pageY}px`;

        if (video.paused || video.ended) {
          customCursor.style.backgroundImage = `url(${cursorPaths.right})`;
          play_button.style.display = 'block';
        } else {
          customCursor.style.backgroundImage = `url(${cursorPaths.cursor})`;
          play_button.style.display = 'none';
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

      play_button.addEventListener('click', function() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
      });

      video_container.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
      });
    }
  }

  // GRID
  const grid = document.getElementById('image_grid');
  if (grid) {
    grid.addEventListener('mousemove', (e) => {
      customCursor.style.display = 'block';
      customCursor.style.left = `${e.pageX}px`;
      customCursor.style.top = `${e.pageY}px`;
      customCursor.style.backgroundImage = `url(${cursorPaths.cursor})`;
    });

    const columns = document.querySelectorAll('.grid_column');
    const close = document.querySelector('.close');

    columns.forEach(column => {
      column.addEventListener('click', function() {
        gallery.innerHTML = '';
        const images = column.querySelectorAll('img');
  
        // Create gallery items for each image and append to modal content
        let imageClones = [] 
        images.forEach(img => {
          const galleryItem = document.createElement('div');
          galleryItem.className = 'gallery_item';
          const imgClone = img.cloneNode();
          galleryItem.appendChild(imgClone);
          gallery.appendChild(galleryItem);
          imageClones.push(galleryItem)
        });

        currentIndex = 0;
        updateGallery(imageClones, currentIndex);
        gallery.style.display = 'flex';
      });
    });

    window.addEventListener('click', (event) => {
      if (event.target == gallery) {
        gallery.style.display = 'none';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (e.target == gallery) {
        customCursor.style.display = 'block';
        customCursor.style.left = `${e.pageX}px`;
        customCursor.style.top = `${e.pageY}px`;
        customCursor.style.backgroundImage = `url(${cursorPaths.down})`;
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (gallery) {
    let images = gallery.querySelectorAll('.gallery_item');

    // Initially set the first image as active
    updateGallery(images, currentIndex);

    gallery.addEventListener('click', (e) => {
      images = gallery.querySelectorAll('.gallery_item');
      const galleryRect = gallery.getBoundingClientRect();
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
  }
});

function updateGallery(images, currentIndex) {
  images.forEach((img, index) => {
      img.classList.remove('active', 'next', 'prev');

      if (index === currentIndex) {
          img.classList.add('active');
      } else if (index === (currentIndex + 1) % images.length) {
          img.classList.add('next');
      } else if (index === (currentIndex - 1 + images.length) % images.length) {
          img.classList.add('prev');
      }
  });
}
