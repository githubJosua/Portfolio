
document.addEventListener('DOMContentLoaded', function() {
  const content = document.getElementById('content')
  content.classList.add('fade-in');
});


const cursorPath = 'media/00_cursor/square.png';
const divs = document.querySelectorAll('div')

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

  divs.forEach((div) => {
    div.style.cursor = 'none'
    div.addEventListener('mousemove', (e) => {
      
      customCursor.style.display = 'block';
      customCursor.style.left = `${e.pageX}px`;
      customCursor.style.top = `${e.pageY}px`;
  
      customCursor.style.backgroundImage = `url(${cursorPath})`;
    });
  });

  document.body.addEventListener('mousemove', (e) => {
    customCursor.style.display = 'block';
    customCursor.style.left = `${e.pageX}px`;
    customCursor.style.top = `${e.pageY}px`;

    customCursor.style.backgroundImage = `url(${cursorPath})`;
  });
});

