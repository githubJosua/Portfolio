// transitions
document.addEventListener('DOMContentLoaded', function() {
  const content = document.getElementById('content');
  if (content) content.classList.add('fade-in');
});

window.addEventListener('pageshow', function(event) {
  document.body.style.transition = 'none';
  document.body.style.opacity = 0;

  setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease-in-out';
      document.body.style.opacity = 1;
  }, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  // Global custom cursor (30px, glowing on interactive hover)
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

    const isInteractive = e.target.closest('a') || e.target.closest('button') || e.target.closest('#name') || e.target.closest('.interactive');
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
});

// arrangement for orientation
function checkOrientation() {
  const content = document.getElementById('content');
  if (!content) return;
  if (window.innerHeight > window.innerWidth) {
      content.style.flexDirection = 'column';
  } else {
      content.style.flexDirection = 'row';
  }
}

checkOrientation();
window.addEventListener('resize', checkOrientation);