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
let text_container = document.querySelector('#faded_text')
let canScroll = true;
let timeout;
let lines = [
    'Can we be in motion as NOMADS<br>in a SETTLEMENT?<br><br>Can we cast the motion of GLACIERS<br>into SEDIMENT?',
    'Can a building unfold MOTION<br>through a STORY?<br><br>Can a building UNFOLD<br>to become an INVENTORY?',
    'Can we form AI into the<br>ROOTS of a city?<br><br>Can we form TREES to<br>ROOT a new city?',
    'In a time where we take images<br>of OPERAS and TOWERS<br><br>Is there time to imagine a TOILET<br>that grows FLOWERS?'
]
let index = -1;


scrolling_container.addEventListener('scroll', function() {
    if (canScroll) {
        console.log('Scrolling...');
        canScroll = false;

        text_container.style.opacity = 0; 

        setTimeout(() => {
            index = (index + 1) % lines.length;
            text_container.innerHTML = lines[index];

            text_container.style.opacity = 1;

            scrolling_container.scrollTop = 0;

            setTimeout(() => {
                canScroll = true;
            }, 500);
        }, 300);
    }    
});


// document.addEventListener("click", () => {
    // window.location.href = "https://josuahefti.myportfolio.com/work";
  // });


let menu_shown = 0;
const video = document.getElementById('background-video');
const background_image = document.getElementById('background_image');

scrolling_container.addEventListener('click', function() {
    var menu_left = document.getElementById('menu_left');
    var menu_right = document.getElementById('menu_right');
    if (menu_shown===0) {
        menu_left.style.transform = 'translateX(0%)';
        menu_right.style.transform = 'translateX(0%)';
        scrolling_container.style.opacity = 0;
        video.style.opacity = 0;
        background_image.style.filter = 'blur(3vw) saturate(2)';
        menu_shown = 1;
    } else {
        menu_left.style.transform = 'translateX(-100%)';
        menu_right.style.transform = 'translateX(100%)';
        scrolling_container.style.opacity = 0;
        video.style.opacity = 1;
        background_image.style.filter = 'none';
        menu_shown = 0;
    }

});



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
  
    const cursorPath = 'media/00_cursor/cursor.png'
  
    scrolling_container.addEventListener('mousemove', (e) => {
      customCursor.style.display = 'block';
      customCursor.style.left = `${e.pageX}px`;
      customCursor.style.top = `${e.pageY}px`;
  
      customCursor.style.backgroundImage = `url(${cursorPath})`;
    });
    scrolling_container.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
    });
});