// HEADERS
document.querySelectorAll('h1').forEach(function(header) {
  var words = header.textContent.split(' '); // Split the text content into words
  var newText = words.join('<br>'); // Join the words with <br> tag
  header.innerHTML = newText; // Set the new content
});

// Scrolling Behaviour
let scrollTimeout = null;

function scroll_to_next_section(direction) {
  if (scrollTimeout !== null) {
      clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
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
  }, 100); // Delay before execution
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
  customCursor.style.height = '100px';
  customCursor.style.width = '100px';
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

  if (video_container) {
    const video = document.getElementById('video');

    if (video) {  
      video_container.addEventListener('mousemove', (e) => {
        customCursor.style.display = 'block';
        customCursor.style.left = `${e.pageX}px`;
        customCursor.style.top = `${e.pageY}px`;

        if (video.paused || video.ended) {
          customCursor.style.backgroundImage = `url(${cursorPaths.right})`;
        } else {
          customCursor.style.backgroundImage = `url(${cursorPaths.cursor})`;
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

      video_container.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
      });
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (gallery) {
    const images = gallery.querySelectorAll('.gallery_item');
    let currentIndex = 0; // Track the current image

    // Initially set the first image as active
    updateGallery();

    gallery.addEventListener('click', (e) => {
        const galleryRect = gallery.getBoundingClientRect();
        const mouseXRelative = e.clientX - galleryRect.left;

        if (mouseXRelative < galleryRect.width / 2) {
            // Move to the previous image
            currentIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
        } else {
            // Move to the next image
            currentIndex = (currentIndex + 1) % images.length;
        }

        updateGallery();
    });

    function updateGallery() {
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
  }
});

