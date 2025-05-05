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
let text_container = document.querySelector('#faded_text')
let canScroll = true;
let timeout;
let lines = [
    '<a href="01_synthetic_exodus.html" class="question_link" style="cursor: none;">Can we be in motion as NOMADS<br>in a SETTLEMENT?</a>',
    '<a href="01_glacial_investigations.html" class="question_link">Can we cast the motion of GLACIERS<br>into SEDIMENT?</a>',
    '<a href="01_pina_bausch.html" class="question_link">Can a building unfold MOTION<br>through a STORY?</a>',
    '<a href="01_matrix.html" class="question_link">Can a building UNFOLD<br>to become an INVENTORY?</a>',
    '<a href="01_heilbronn.html" class="question_link">Can we form AI into the<br>ROOTS of a city?</a>',
    '<a href="01_itree.html" class="question_link">Can we form TREES to<br>ROOT a new city?</a>',
    '<a href="01_tianfu.html" class="question_link">In a time where we take images<br>of OPERAS and TOWERS</a>',
    '<a href="01_flower_toilet.html" class="question_link">Is there time to imagine a TOILET<br>that grows FLOWERS?</a>'
]
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

// Applying debounce to the scroll event listener
scrolling_container.addEventListener('scroll', debounce((e) => {
    scroll_question();
}, 100), {passive: false});
  


let menu_shown = 0;
const video = document.getElementById('background-video');
const background_image = document.getElementById('background_image');

scrolling_container.addEventListener('click', function() {
    var menu_left = document.getElementById('menu_left');
    var menu_right = document.getElementById('menu_right');
    var label_left = document.getElementById('left-label');
    var label_right = document.getElementById('right-label');
    if (menu_shown===0) {
        menu_left.style.transform = 'translateX(0%)';
        menu_right.style.transform = 'translateX(0%)';
        label_left.style.transform = 'translate(0%, -50%)';
        label_right.style.transform = 'translate(0%, -50%)';
        scrolling_container.style.opacity = 0;
        video.style.opacity = 0;
        background_image.style.filter = 'blur(3vw) saturate(2)';
        menu_shown = 1;
    } else {
        menu_left.style.transform = 'translateX(-200%)';
        menu_right.style.transform = 'translateX(200%)';
        label_left.style.transform = 'translate(-400%, -50%)';
        label_right.style.transform = 'translate(400%, -50%)';
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
    const squarePath = 'media/00_cursor/square.png'
  
    scrolling_container.addEventListener('mousemove', (e) => {
      customCursor.style.display = 'block';
      customCursor.style.left = `${e.pageX}px`;
      customCursor.style.top = `${e.pageY}px`;
  
      customCursor.style.backgroundImage = `url(${squarePath})`;
    });

    const faded_text = document.getElementById('question_block')
    faded_text.addEventListener('mousemove', (e) => {
        customCursor.style.display = 'block';
        customCursor.style.left = `${e.pageX}px`;
        customCursor.style.top = `${e.pageY}px`;
        customCursor.style.backgroundImage = `url(${cursorPath})`;
    });

    const hyperlinks = document.querySelectorAll('a') 
    hyperlinks.forEach((hyperlink) => {
        hyperlink.addEventListener('mousemove', (e) => {
            customCursor.style.display = 'block';
            customCursor.style.left = `${e.pageX}px`;
            customCursor.style.top = `${e.pageY}px`;
            customCursor.style.backgroundImage = `url(${cursorPath})`;
        });
        hyperlink.addEventListener('click', function(e) {
            document.body.style.opacity = 0

            const link = this.href;
            e.preventDefault();
            setTimeout(function() {
                window.location.href = link
            }, 500);
        });
    });
});

// SIDE LABELS
document.querySelectorAll('.side-label').forEach(label => {
    const text = label.dataset.text;
    label.innerHTML = '';
    [...text].forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        label.appendChild(span);
    });
});


// warning
function checkOrientation() {
    const warning = document.getElementById('warning')
    if (window.innerHeight > window.innerWidth) {
        warning.style.display = 'block'
    } else {
        warning.style.display = 'none'
    }
  }

  // Check on initial load
  checkOrientation();

  // Add event listener for changes, e.g., when the user rotates their device
  window.addEventListener('resize', checkOrientation);