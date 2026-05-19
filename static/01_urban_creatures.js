/* ============================================
   URBAN CREATURES — Application Logic v2
   ============================================ */

(function () {
  'use strict';

  let DATA = null;
  let activeCreatureIdx = null;
  let panelShowColor = false;

  const PROXY_URL = 'https://creature-comment-proxy.jojo-hefti-jh.workers.dev/';

  // ── Boot ──────────────────────────────────
  document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initHeroCanvas();
    initStepTabs('manifesto-tabs', 'manifesto-panels');
    initStepTabs('pipeline-grid', 'pipeline-panels');
    renderBanners();
    initScrollReveal();
    wireEvents();
  });

  async function loadData() {
    const res = await fetch('static/01_urban_creatures_data.json');
    DATA = await res.json();
    if (DATA && DATA.creatures) {
      DATA.creatures.forEach(creature => {
        if (creature.days) {
          creature.days.sort((a, b) => a.day - b.day);
        }
      });
    }
  }

  // ── Hero Particle Canvas ──────────────────
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor((w * h) / 14000), 80);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.1 + 0.3,
          dx: (Math.random() - 0.5) * 0.25,
          dy: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.35 + 0.08,
          // alternate between purple and orange particles
          color: Math.random() > 0.7 ? '215,84,44' : '115,85,190',
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      }
      // Faint connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(115,85,190,${0.05 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
  }

  function initStepTabs(tabsId, panelsId) {
    const tabsEl = document.getElementById(tabsId);
    const panelsEl = document.getElementById(panelsId);
    if (!tabsEl || !panelsEl) return;

    const tabs = tabsEl.querySelectorAll('.step-tab');
    const panels = panelsEl.querySelectorAll('.step-panel');

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t, j) => t.classList.toggle('active', j === i));
        panels.forEach((p, j) => p.classList.toggle('active', j === i));
      });
    });
  }

  // ── Creature Banners ──────────────────────
  function renderBanners() {
    if (!DATA) return;
    const strip = document.getElementById('creature-banners');
    if (!strip) return;

    DATA.creatures.forEach((creature, idx) => {
      const latestDay = creature.days[creature.days.length - 1];
      const banner = document.createElement('div');
      banner.className = 'creature-banner';
      banner.id = `banner-${creature.id}`;
      banner.innerHTML = `
        <div class="creature-banner-indicator"></div>
        <img class="creature-banner-img" src="${latestDay.imageColor || latestDay.image}" alt="${creature.name}" loading="lazy">
        <div class="creature-banner-label">
          <span class="creature-banner-name">${creature.shortName}</span>
          <span class="creature-banner-loc">${creature.location}</span>
        </div>
      `;
      banner.addEventListener('click', () => toggleTimeline(idx));
      strip.appendChild(banner);
    });
  }

  // ── Vertical Evolution Timeline ───────────
  function toggleTimeline(creatureIdx) {
    const timelineEl = document.getElementById('evolution-timeline');
    const innerEl = document.getElementById('evolution-timeline-inner');

    // If same creature clicked again, collapse
    if (activeCreatureIdx === creatureIdx && timelineEl.style.height && timelineEl.style.height !== '0px') {
      collapseTimeline();
      return;
    }

    // Update active banner
    document.querySelectorAll('.creature-banner').forEach((b, i) => {
      b.classList.toggle('active', i === creatureIdx);
    });

    activeCreatureIdx = creatureIdx;
    const creature = DATA.creatures[creatureIdx];

    // Clear previous content before rendering new creature
    innerEl.innerHTML = '';

    // Creature header
    const header = document.createElement('div');
    header.innerHTML = `
      <div class="evolution-creature-header">
        <div class="evolution-creature-name">${creature.name.toUpperCase()}</div>
        <div class="evolution-creature-location">${creature.location}</div>
      </div>
      <div class="evolution-creature-purpose">${creature.purpose}</div>
    `;
    innerEl.appendChild(header);

    // ——— Comment box ———
    const commentCard = document.createElement('div');
    commentCard.className = 'comment-card';
    commentCard.innerHTML = `
      <div class="comment-title">
        <span class="comment-title-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21a9 9 0 1 0-9-9c0 2.15.95 4.16 2.46 5.68L4 21l5.32-1.46A8.93 8.93 0 0 0 12 21z" />
            <path d="M12 7L13.29 10.71L17 12L13.29 13.29L12 17L10.71 13.29L7 12L10.71 10.71Z" />
          </svg>
        </span>
        Influence this creature
      </div>
      <div class="comment-input-row">
        <input type="text" class="comment-input" placeholder="I think it should…" />
        <button class="comment-submit">Send</button>
      </div>
      <div class="comment-sent">✓ Sent</div>
    `;
    innerEl.appendChild(commentCard);

    const inputEl = commentCard.querySelector('.comment-input');
    const submitBtn = commentCard.querySelector('.comment-submit');
    const sentMsg = commentCard.querySelector('.comment-sent');

    const handleSubmit = async () => {
      const text = inputEl.value.trim();
      if (!text) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const response = await fetch(PROXY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            creature_id: creature.id,
            creature_name: creature.name,
            comment: text,
            timestamp: new Date().toISOString()
          })
        });

        if (response.ok) {
          sentMsg.classList.add('show');
          setTimeout(() => sentMsg.classList.remove('show'), 3000);
          inputEl.value = '';
        } else {
          alert('Could not send comment. Try again.');
        }
      } catch (err) {
        console.error(err);
        alert('Network error — make sure the server is running.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
      }
    };

    submitBtn.addEventListener('click', handleSubmit);
    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });

    // Day entries
    const dayList = document.createElement('div');
    dayList.className = 'day-entries';

    // Group days by date
    const daysByDate = {};
    creature.days.forEach((day, dayIdx) => {
      const d = day.date || `DAY ${day.day}`;
      if (!daysByDate[d]) daysByDate[d] = [];
      daysByDate[d].push({ day, dayIdx });
    });

    Object.keys(daysByDate).sort().reverse().forEach(date => {
      const itemsInDate = daysByDate[date].slice().reverse();

      // Feedback comes from the date, so we take it from the first item
      const feedbackArray = itemsInDate[0].day.feedback;
      let inlineFeedback = '';
      if (feedbackArray && feedbackArray.length > 0) {
        const itemsHtml = feedbackArray.map(fb => {
          const src = fb.source.toLowerCase() === 'bsky' ? 'bsky'
            : fb.source.toLowerCase() === 'ig' ? 'ig' : 'tg';
          return `<li class="day-card-feedback-item">
            <span class="badge ${src}">${fb.source}</span>
            <span class="day-card-feedback-text">"${fb.text}"</span>
          </li>`;
        }).join('');
        inlineFeedback = `
          <div class="day-card-feedback-label">Feedback Influenced This Step</div>
          <ul class="day-card-feedback-list">${itemsHtml}</ul>
        `;
      }

      let groupItemsHtml = '';
      itemsInDate.forEach(item => {
        const d = item.day;
        groupItemsHtml += `
          <div class="timeline-item" data-idx="${item.dayIdx}">
            <div class="day-node">
              <div class="day-node-dot"></div>
              <div class="day-node-label">D${d.day}</div>
            </div>
            <div class="day-card">
              <div class="day-card-image">
                <img src="${d.imageColor || d.image}" loading="lazy" alt="${creature.name} Day ${d.day}">
                <span class="day-card-hint">EXPLORE →</span>
              </div>
            </div>
          </div>
        `;
      });

      const entry = document.createElement('div');
      entry.className = 'timeline-date-group';
      entry.innerHTML = `
        <div class="day-info">
          <div class="day-card-day">${date}</div>
          ${inlineFeedback}
        </div>
        <div class="timeline-group-items">
          ${groupItemsHtml}
        </div>
      `;

      // Attach events to all items
      entry.querySelectorAll('.timeline-item').forEach(el => {
        const dayIdx = parseInt(el.getAttribute('data-idx'));
        el.addEventListener('click', () => openDetailPanel(creatureIdx, dayIdx));
      });

      dayList.appendChild(entry);
    });

    // Add Jump to Top button at the bottom
    const jumpTopWrap = document.createElement('div');
    jumpTopWrap.className = 'timeline-jump-wrap bottom';
    jumpTopWrap.innerHTML = `<button class="timeline-jump-btn">↑ Jump to Latest</button>`;
    jumpTopWrap.querySelector('button').addEventListener('click', () => {
      timelineEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Add Jump to Bottom button at the top
    const jumpBottomWrap = document.createElement('div');
    jumpBottomWrap.className = 'timeline-jump-wrap top';
    jumpBottomWrap.innerHTML = `<button class="timeline-jump-btn">↓ Jump to Day 1</button>`;
    jumpBottomWrap.querySelector('button').addEventListener('click', () => {
      // Images load asynchronously and expand the DOM height. 
      // We trigger the scroll a few times to guarantee it anchors to the true bottom.
      let attempts = 0;
      jumpTopWrap.scrollIntoView({ behavior: 'smooth', block: 'end' });
      const scrollInterval = setInterval(() => {
        jumpTopWrap.scrollIntoView({ behavior: 'smooth', block: 'end' });
        attempts++;
        if (attempts > 6) clearInterval(scrollInterval);
      }, 150);
    });

    innerEl.appendChild(jumpBottomWrap);
    innerEl.appendChild(dayList);
    innerEl.appendChild(jumpTopWrap);

    // Animate open
    timelineEl.style.height = '0px';
    timelineEl.style.display = 'block';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Set height to scrollHeight so CSS transition works
        timelineEl.style.height = innerEl.scrollHeight + 96 + 'px'; // +padding
        timelineEl.classList.add('open');

        setTimeout(() => {
          timelineEl.style.height = 'auto';
        }, 600);
      });
    });
  }

  function collapseTimeline() {
    const timelineEl = document.getElementById('evolution-timeline');
    timelineEl.style.height = '0px';
    timelineEl.classList.remove('open');
    activeCreatureIdx = null;
    document.querySelectorAll('.creature-banner').forEach(b => b.classList.remove('active'));
    setTimeout(() => { timelineEl.style.display = 'none'; }, 600);
  }

  // ── Day Detail Panel ──────────────────────
  let panelImageState = 'bw';

  function openDetailPanel(creatureIdx, dayIdx) {
    const creature = DATA.creatures[creatureIdx];
    const day = creature.days[dayIdx];
    panelImageState = 'bw';

    const namePart = creature.shortName.toUpperCase();
    const dayPart = `DAY ${day.day}`;
    document.getElementById('panel-title').innerHTML =
      `<span class="detail-panel-title-name">${namePart}</span><span class="detail-panel-title-day">${dayPart}</span>`;

    renderPanelBody(creature, day);

    document.getElementById('detail-panel').classList.add('open');
    document.getElementById('panel-backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderPanelBody(creature, day) {
    const body = document.getElementById('panel-body');
    let imgSrc = day.image;
    if (panelImageState === 'color' && day.imageColor) imgSrc = day.imageColor;

    // Feedback HTML (Current day + previous 2 days)
    const currentDayIdx = creature.days.findIndex(d => d.day === day.day);
    let combinedFeedback = [];

    // Accumulate up to 3 days of feedback
    for (let i = 0; i < 3; i++) {
      if (currentDayIdx - i >= 0) {
        const pastDay = creature.days[currentDayIdx - i];
        if (pastDay.feedback && pastDay.feedback.length > 0) {
          combinedFeedback = combinedFeedback.concat(pastDay.feedback);
        }
      }
    }

    let feedbackHtml;
    if (combinedFeedback.length > 0) {
      const items = combinedFeedback.map(fb => {
        const src = fb.source.toLowerCase() === 'bsky' ? 'bsky'
          : fb.source.toLowerCase() === 'ig' ? 'ig' : 'tg';
        return `<li class="panel-feedback-item">
          <span class="badge ${src}">${fb.source}</span>
          <span class="panel-feedback-text">"${fb.text}"</span>
        </li>`;
      }).join('');
      feedbackHtml = `<ul class="panel-feedback-list">${items}</ul>`;
    } else {
      feedbackHtml = `<p class="panel-no-feedback">No comments recorded for this period.</p>`;
    }

    let controlsHtml = `
      <div class="panel-controls">
        <button class="panel-toggle" id="btn-bw" ${panelImageState === 'bw' ? 'disabled' : ''}>← Base B&amp;W</button>
        ${day.imageColor && day.imageColor !== day.image ? `<button class="panel-toggle" id="btn-color" ${panelImageState === 'color' ? 'disabled' : ''}>Color →</button>` : ''}
      </div>
    `;

    let anchorsHtml = '';
    let anchorsArray = [];
    if (day.anchors) {
      if (Array.isArray(day.anchors)) {
        anchorsArray = day.anchors;
      } else if (typeof day.anchors === 'string') {
        anchorsArray = [day.anchors];
      }
    }
    
    anchorsArray.forEach((anchorPath) => {
      if (anchorPath) {
        let label = 'Anchor';
        const match = anchorPath.match(/_anchor_(\d+)/);
        if (match && match[1]) {
          label = `Anchor (D${match[1]})`;
        } else {
          const simpleMatch = anchorPath.match(/day_(\d+)_anchor/);
          if (simpleMatch && simpleMatch[1]) {
            label = `Anchor (D${simpleMatch[1]})`;
          }
        }
        anchorsHtml += `<figure><img src="${anchorPath}" loading="lazy"><figcaption>${label}</figcaption></figure>`;
      }
    });

    const angleImg = day.angleImage || day.blueprint;

    body.innerHTML = `
      <div class="panel-left">
        <div class="panel-row">
          <div class="panel-row-label">Creature DNA — Form</div>
          <div class="panel-row-value">${creature.form}</div>
        </div>
        <div class="panel-row">
          <div class="panel-row-label">Feedback That Influenced This Day</div>
          ${feedbackHtml}
        </div>
        <div class="panel-row">
          <div class="panel-row-label">Prompt</div>
          <div class="panel-row-value">${day.prompt || 'Day 1 — first form emerged from DNA alone.'}</div>
        </div>
        <div class="panel-input-images">
          ${angleImg ? `<figure><img src="${angleImg}"><figcaption>Angle</figcaption></figure>` : ''}
          ${day.reference ? `<figure><img src="${day.reference}"><figcaption>Reference</figcaption></figure>` : ''}
          ${anchorsHtml}
        </div>
      </div>

      <div class="detail-panel-divider">&#x2192;</div>

      <div class="panel-right">
        <div class="panel-image-wrap">
          <img id="panel-img" src="${imgSrc}" alt="${creature.name} Day ${day.day}">
          ${controlsHtml}
        </div>
      </div>
    `;

    // Wire up buttons
    const btnBw = document.getElementById('btn-bw');
    const btnColor = document.getElementById('btn-color');

    const updateImage = (state) => {
      panelImageState = state;
      let src = day.image;
      if (state === 'color' && day.imageColor) src = day.imageColor;
      document.getElementById('panel-img').src = src;
      if (btnBw) btnBw.disabled = (state === 'bw');
      if (btnColor) btnColor.disabled = (state === 'color');
    };

    if (btnBw) btnBw.addEventListener('click', () => updateImage('bw'));
    if (btnColor) btnColor.addEventListener('click', () => updateImage('color'));
  }

  function closeDetailPanel() {
    document.getElementById('detail-panel').classList.remove('open');
    document.getElementById('panel-backdrop').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Scroll Reveal ─────────────────────────
  function initScrollReveal() {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  // ── Events ────────────────────────────────
  function wireEvents() {
    document.getElementById('panel-close-btn').addEventListener('click', closeDetailPanel);
    document.getElementById('panel-backdrop').addEventListener('click', closeDetailPanel);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDetailPanel();
    });
  }

})();
