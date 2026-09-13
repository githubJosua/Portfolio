(() => {
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


document.addEventListener('DOMContentLoaded', setupCornerNavigation);
})();
