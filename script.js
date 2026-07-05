document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initMobileNav();
  initActiveNavLink();
  initScrollReveal();
  initPageTransitions();
  
  // Page-specific initializations
  if (document.getElementById('terminal-typing')) {
    initTypingAnimation();
  }
  
  if (document.querySelector('.skills-grid')) {
    initSkillBars();
  }
  
  if (document.querySelector('.projects-filter-bar')) {
    initProjectFilters();
  }
  
  if (document.getElementById('contact-form')) {
    initContactForm();
  }

  if (document.querySelector('.clickable-copy')) {
    initCopyToClipboard();
  }

  if (document.querySelector('.logo-anim')) {
    initLogoTagAnimation();
  }

  if (document.getElementById('hero-terminal-body')) {
    initHeroTerminalLoopAnimation();
  }

  if (document.getElementById('about-terminal-body')) {
    initAboutTerminalAnimation();
  }

  if (document.querySelector('.timeline')) {
    initScrollTimelineTracking();
  }

  initScrollProgressBar();
});

/* ==========================================================================
   Navigation Features
   ========================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('nav');
  
  if (!toggle || !nav) return;
  
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    toggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) lucide.createIcons();
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== toggle) {
      nav.classList.remove('open');
      toggle.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    }
  });

  // Close menu when resizing beyond mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    }
  });
}

function initActiveNavLink() {
  const navLinks = document.querySelectorAll('nav ul li a');
  // Get current page filename (e.g. index.html or skills.html)
  let path = window.location.pathname;
  let page = path.split("/").pop();
  
  if (page === '' || page === '/') {
    page = 'index.html';
  }
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === page || (page === 'index.html' && linkHref === './') || (page === 'index.html' && linkHref === '')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   Animations & Scroll Reveals
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (reveals.length === 0) return;
  
  // Check if system prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }
  
  const observerOptions = {
    root: null, // viewport
    threshold: 0.15, // trigger when 15% is visible
    rootMargin: '0px 0px -50px 0px' // slightly before scrolling into view
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // only reveal once
      }
    });
  }, observerOptions);
  
  reveals.forEach(el => observer.observe(el));
}

function initPageTransitions() {
  // Smooth page transition effect on link clicks
  const pageLinks = document.querySelectorAll('a[href$=".html"]');
  const body = document.body;
  
  pageLinks.forEach(link => {
    // Skip if it opens in a new tab
    if (link.getAttribute('target') === '_blank') return;
    
    link.addEventListener('click', (e) => {
      const destination = link.getAttribute('href');
      
      // If it's a valid link and not to a hash
      if (destination && !destination.startsWith('#')) {
        e.preventDefault();
        body.style.transition = 'opacity 0.25s ease';
        body.style.opacity = '0';
        
        setTimeout(() => {
          window.location.href = destination;
        }, 250);
      }
    });
  });
}

/* ==========================================================================
   Terminal Window Auto-Typing Simulation
   ========================================================================== */
function initTypingAnimation() {
  const terminalSpan = document.getElementById('terminal-typing');
  if (!terminalSpan) return;
  
  const strings = JSON.parse(terminalSpan.getAttribute('data-words') || '[]');
  if (strings.length === 0) return;
  
  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 90; // base typing speed in ms
  
  function typeEffect() {
    const currentString = strings[stringIndex];
    
    if (isDeleting) {
      terminalSpan.textContent = currentString.substring(0, charIndex - 1);
      charIndex--;
      speed = 40; // faster deleting
    } else {
      terminalSpan.textContent = currentString.substring(0, charIndex + 1);
      charIndex++;
      speed = 90; // normal typing
    }
    
    // Typing complete for current word
    if (!isDeleting && charIndex === currentString.length) {
      isDeleting = true;
      speed = 2000; // pause at end of statement
    } 
    // Deleting complete
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % strings.length;
      speed = 400; // short pause before typing next word
    }
    
    setTimeout(typeEffect, speed);
  }
  
  setTimeout(typeEffect, 500); // initial delay
}

/* ==========================================================================
   Skills Level Progress Bar Animations
   ========================================================================== */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.progress-bar-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.getAttribute('data-percent') || '0%';
        bar.style.width = targetPercent;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });
  
  skillBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   Projects Category Filters
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-container');
  
  if (filterBtns.length === 0 || projectCards.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const categories = JSON.parse(card.getAttribute('data-categories') || '[]');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'block';
          // Force reflow and animate in
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // match transition time
        }
      });
    });
  });
}

/* ==========================================================================
   Contact Form (Async post submission handler)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  
  if (!form || !statusDiv) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;
    
    // Disable button and set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Deploying...';
    
    // Set status window to in-progress message
    statusDiv.style.display = 'block';
    statusDiv.className = 'form-status';
    statusDiv.innerHTML = `<div class="form-status-line info"><span class="terminal-prompt">&gt;</span> Sending payload...</div>`;
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: new FormData(form)
      });
      
      if (response.ok) {
        // Success
        statusDiv.className = 'form-status success';
        statusDiv.innerHTML = `<div class="form-status-line success"><span class="terminal-prompt">&gt;</span> Message delivered successfully ✓</div>`;
        form.reset();
      } else {
        // HTTP Error
        let errorReason = 'Unknown Error';
        try {
          const errData = await response.json();
          errorReason = errData.message || response.statusText || errorReason;
        } catch (_) {
          errorReason = response.statusText || errorReason;
        }
        statusDiv.className = 'form-status error';
        statusDiv.innerHTML = `<div class="form-status-line error"><span class="terminal-prompt">&gt;</span> Delivery failed: ${errorReason}</div>`;
      }
    } catch (err) {
      // Network/Connection Error
      statusDiv.className = 'form-status error';
      statusDiv.innerHTML = `<div class="form-status-line error"><span class="terminal-prompt">&gt;</span> Connection failed: check your network</div>`;
    } finally {
      // Restore submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  });
}

/* ==========================================================================
   Click to Copy Utility
   ========================================================================== */
function initCopyToClipboard() {
  const copyElements = document.querySelectorAll('.clickable-copy');
  
  copyElements.forEach(el => {
    el.style.cursor = 'pointer';
    
    // Add hover hint attribute or styling class
    el.setAttribute('title', 'Click to copy');
    
    el.addEventListener('click', () => {
      const textToCopy = el.getAttribute('data-copy');
      if (!textToCopy) return;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        const feedbackEl = el.querySelector('.copy-feedback');
        if (feedbackEl) {
          const originalText = feedbackEl.textContent;
          feedbackEl.textContent = 'Copied to Clipboard! ✓';
          feedbackEl.style.color = 'var(--color-teal)';
          
          setTimeout(() => {
            feedbackEl.textContent = originalText;
            feedbackEl.style.color = '';
          }, 2000);
        }
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });
}

/* ==========================================================================
   Logo Tag Terminal Typing Animation
   ========================================================================== */
function initLogoTagAnimation() {
  const animSpan = document.querySelector('.logo-anim');
  if (!animSpan) return;
  const targetText = animSpan.getAttribute('data-target') || '';
  if (!targetText) return;
  
  let index = 0;
  animSpan.textContent = '~/';
  
  function type() {
    if (index < targetText.length) {
      animSpan.textContent += targetText.charAt(index);
      index++;
      setTimeout(type, 100);
    } else {
      const cursor = document.createElement('span');
      cursor.className = 'terminal-cursor';
      cursor.style.height = '12px';
      cursor.style.width = '6px';
      cursor.style.marginLeft = '2px';
      animSpan.appendChild(cursor);
    }
  }
  
  setTimeout(type, 300);
}

/* ==========================================================================
   Hero Terminal Multi-Stage Animation Loop
   ========================================================================== */
function initHeroTerminalLoopAnimation() {
  const terminalBody = document.getElementById('hero-terminal-body');
  if (!terminalBody) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sleep utility
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Type text helper
  function typeText(element, text, speed) {
    return new Promise(resolve => {
      let charIdx = 0;
      function type() {
        if (charIdx < text.length) {
          element.textContent += text.charAt(charIdx);
          charIdx++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      }
      type();
    });
  }

  // Progress bar animation counter
  function animateBar(fillEl, percentEl, targetVal) {
    return new Promise(resolve => {
      fillEl.style.width = `${targetVal}%`;
      let current = 0;
      const interval = setInterval(() => {
        if (current >= targetVal) {
          percentEl.textContent = `~${targetVal}%`;
          clearInterval(interval);
          resolve();
        } else {
          percentEl.textContent = `~${current}%`;
          current += 1;
        }
      }, 10);
    });
  }

  if (prefersReducedMotion) {
    // Render Intro instantly
    const introBlock = document.createElement('div');
    introBlock.style.marginBottom = '1rem';
    introBlock.style.minHeight = '80px';
    introBlock.innerHTML = `
      <div style="margin-bottom: 0.3rem;">Booting Abdul Shakoor...</div>
      <div style="margin-bottom: 0.3rem;">Full-Stack Dev meets AI Automation Engineer</div>
      <div style="margin-bottom: 0.3rem;">Currently shipping at GCISC</div>
      <div style="margin-bottom: 0.3rem;">Status: Ready for high-impact work ✓</div>
    `;
    terminalBody.appendChild(introBlock);

    // Render Stat Bars instantly
    const statsBlock = document.createElement('div');
    statsBlock.style.marginBottom = '1rem';
    statsBlock.style.display = 'flex';
    statsBlock.style.flexDirection = 'column';
    statsBlock.style.gap = '0.5rem';
    
    const stats = [
      { name: 'AI Automation', val: 90, color: 'var(--color-pink)' },
      { name: 'Full-Stack Development', val: 95, color: 'var(--color-teal)' },
      { name: 'Cloud / DevOps', val: 80, color: 'var(--color-yellow)' },
      { name: 'UI/UX Sensibility', val: 75, color: 'var(--color-teal)' }
    ];
    
    stats.forEach(st => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.flexDirection = 'column';
      row.style.gap = '0.2rem';
      row.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 500;">
          <span class="stat-name" style="color:var(--text-bright);">${st.name}</span>
          <span class="stat-percent" style="color:var(--color-teal); font-family:var(--font-code);">~${st.val}%</span>
        </div>
        <div class="stat-bar-bg" style="height: 6px; background-color: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: 3px; overflow: hidden;">
          <div class="stat-bar-fill" style="height: 100%; width: ${st.val}%; background-color: ${st.color}; border-radius: 3px;"></div>
        </div>
      `;
      statsBlock.appendChild(row);
    });
    terminalBody.appendChild(statsBlock);

    // Render Feed instantly (3 items static)
    const feedBlock = document.createElement('div');
    feedBlock.style.borderTop = '1px dashed var(--border-color)';
    feedBlock.style.paddingTop = '0.75rem';
    feedBlock.style.display = 'flex';
    feedBlock.style.flexDirection = 'column';
    feedBlock.style.gap = '0.3rem';
    feedBlock.style.height = '90px';
    feedBlock.style.justifyContent = 'flex-end';
    feedBlock.innerHTML = `
      <div style="color: var(--text-dim); font-size: 0.8rem;"><span style="color: var(--color-teal); margin-right: 0.5rem;">✓</span> Deployed automation script</div>
      <div style="color: var(--text-dim); font-size: 0.8rem;"><span style="color: var(--color-teal); margin-right: 0.5rem;">✓</span> Fixed auth bug</div>
      <div style="color: var(--text-dim); font-size: 0.8rem;"><span style="color: var(--color-teal); margin-right: 0.5rem;">✓</span> Trained AI agent</div>
    `;
    terminalBody.appendChild(feedBlock);
    return;
  }

  // Dynamic animated version execution
  async function runAnimation() {
    terminalBody.innerHTML = '';

    // Step 1: Intro typing
    const introBlock = document.createElement('div');
    introBlock.style.marginBottom = '1rem';
    introBlock.style.minHeight = '80px';
    terminalBody.appendChild(introBlock);

    const lines = [
      "Booting Abdul Shakoor...",
      "Full-Stack Dev meets AI Automation Engineer",
      "Currently shipping at GCISC",
      "Status: Ready for high-impact work ✓"
    ];

    for (let i = 0; i < lines.length; i++) {
      const lineDiv = document.createElement('div');
      lineDiv.style.marginBottom = '0.3rem';
      lineDiv.innerHTML = `<span class="line-text"></span><span class="terminal-cursor" style="height:12px; width:6px; background-color:var(--color-teal); display:inline-block; vertical-align:middle; margin-left:3px; animation: blink 0.8s infinite;"></span>`;
      introBlock.appendChild(lineDiv);
      
      const textSpan = lineDiv.querySelector('.line-text');
      const cursorSpan = lineDiv.querySelector('.terminal-cursor');
      
      await typeText(textSpan, lines[i], 30);
      await sleep(600);
      if (cursorSpan) cursorSpan.style.display = 'none';
    }

    // Step 2: Stats progress bars
    const statsBlock = document.createElement('div');
    statsBlock.style.marginBottom = '1rem';
    statsBlock.style.display = 'flex';
    statsBlock.style.flexDirection = 'column';
    statsBlock.style.gap = '0.5rem';
    statsBlock.style.opacity = '0';
    statsBlock.style.transition = 'opacity 0.6s ease';
    terminalBody.appendChild(statsBlock);

    const stats = [
      { name: 'AI Automation', val: 90, color: 'var(--color-pink)' },
      { name: 'Full-Stack Development', val: 95, color: 'var(--color-teal)' },
      { name: 'Cloud / DevOps', val: 80, color: 'var(--color-yellow)' },
      { name: 'UI/UX Sensibility', val: 75, color: 'var(--color-teal)' }
    ];

    const barElements = [];

    stats.forEach(st => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.flexDirection = 'column';
      row.style.gap = '0.2rem';
      row.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 500;">
          <span class="stat-name" style="color:var(--text-bright);">${st.name}</span>
          <span class="stat-percent" style="color:var(--color-teal); font-family:var(--font-code);">~0%</span>
        </div>
        <div class="stat-bar-bg" style="height: 6px; background-color: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: 3px; overflow: hidden;">
          <div class="stat-bar-fill" style="height: 100%; width: 0%; background-color: ${st.color}; border-radius: 3px; transition: width 1.2s cubic-bezier(0.1, 0.8, 0.3, 1);"></div>
        </div>
      `;
      statsBlock.appendChild(row);
      
      const fillEl = row.querySelector('.stat-bar-fill');
      const percentEl = row.querySelector('.stat-percent');
      barElements.push({ fillEl, percentEl, target: st.val });
    });

    // Trigger fade-in
    setTimeout(() => {
      statsBlock.style.opacity = '1';
    }, 100);

    await sleep(400);

    // Parallel bar fills
    await Promise.all(barElements.map(b => animateBar(b.fillEl, b.percentEl, b.target)));

    // Step 3: Activity feed
    const feedBlock = document.createElement('div');
    feedBlock.style.borderTop = '1px dashed var(--border-color)';
    feedBlock.style.paddingTop = '0.75rem';
    feedBlock.style.display = 'flex';
    feedBlock.style.flexDirection = 'column';
    feedBlock.style.gap = '0.3rem';
    feedBlock.style.height = '90px';
    feedBlock.style.justifyContent = 'flex-end';
    feedBlock.style.overflow = 'hidden';
    feedBlock.style.opacity = '0';
    feedBlock.style.transition = 'opacity 0.6s ease';
    terminalBody.appendChild(feedBlock);

    setTimeout(() => {
      feedBlock.style.opacity = '1';
    }, 100);

    await sleep(300);

    const feedLogs = [
      "Deployed automation script",
      "Fixed auth bug",
      "Trained AI agent",
      "Shipped new feature",
      "Optimized DB cluster",
      "Configured route gateway",
      "Synchronized cloud instances",
      "Resolved JWT auth failure",
      "Compiled production bundle"
    ];

    let feedIndex = 0;

    function pushFeedItem(text) {
      const line = document.createElement('div');
      line.style.color = 'var(--text-dim)';
      line.style.fontSize = '0.8rem';
      line.style.opacity = '0';
      line.style.transform = 'translateY(10px)';
      line.style.transition = 'all 0.4s ease';
      line.innerHTML = `<span style="color: var(--color-teal); margin-right: 0.5rem;">✓</span> ${text}`;
      
      feedBlock.appendChild(line);
      
      // Force reflow
      line.offsetHeight;
      
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
      
      if (feedBlock.children.length > 3) {
        const oldest = feedBlock.children[0];
        oldest.style.opacity = '0';
        oldest.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          oldest.remove();
        }, 400);
      }
    }

    // Push initial lines
    for (let j = 0; j < 3; j++) {
      pushFeedItem(feedLogs[feedIndex]);
      feedIndex = (feedIndex + 1) % feedLogs.length;
      await sleep(1000);
    }

    // Loop indefinite interval scrolling
    setInterval(() => {
      pushFeedItem(feedLogs[feedIndex]);
      feedIndex = (feedIndex + 1) % feedLogs.length;
    }, 3000);
  }

  runAnimation();
}

/* ==========================================================================
   About Terminal Whoami Typewriter Animation
   ========================================================================== */
function initAboutTerminalAnimation() {
  const terminalBody = document.getElementById('about-terminal-body');
  if (!terminalBody) return;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    terminalBody.innerHTML = `
      <div style="margin-bottom: 0.8rem; color: var(--color-pink); font-size: 1.1rem; font-weight: bold;">Abdul Shakoor</div>
      <div style="margin-bottom: 0.8rem; color: var(--text-bright);">Full-Stack Dev + AI Automation Engineer</div>
      <div style="margin-bottom: 0.8rem; color: var(--color-teal);">Based in Rawalpindi, Punjab, PK</div>
      <div style="margin-bottom: 0.8rem; color: var(--color-yellow);">Stack: MERN / Next.js / OpenAI / LangChain</div>
    `;
    return;
  }
  
  // Sleep utility
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Type text helper
  function typeText(element, text, speed) {
    return new Promise(resolve => {
      let charIdx = 0;
      function type() {
        if (charIdx < text.length) {
          element.textContent += text.charAt(charIdx);
          charIdx++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      }
      type();
    });
  }

  async function runType() {
    terminalBody.innerHTML = '';
    
    // Command line: guest@shakoor:~$ whoami
    const cmdLine = document.createElement('div');
    cmdLine.style.marginBottom = '0.8rem';
    cmdLine.innerHTML = `<span class="terminal-prompt" style="color: var(--color-teal); margin-right: 0.5rem;">guest@shakoor:~$</span><span class="cmd-text"></span><span class="terminal-cursor" style="height:12px; width:6px; background-color:var(--color-teal); display:inline-block; vertical-align:middle; margin-left:3px; animation: blink 0.8s infinite;"></span>`;
    terminalBody.appendChild(cmdLine);
    
    const cmdText = cmdLine.querySelector('.cmd-text');
    const cmdCursor = cmdLine.querySelector('.terminal-cursor');
    
    await sleep(200);
    await typeText(cmdText, 'whoami', 80);
    await sleep(300);
    if (cmdCursor) cmdCursor.remove();
    
    // Line 1: Abdul Shakoor
    const line1 = document.createElement('div');
    line1.style.marginBottom = '0.8rem';
    line1.style.color = 'var(--color-pink)';
    line1.style.fontSize = '1.1rem';
    line1.style.fontWeight = 'bold';
    line1.innerHTML = `<span class="line-text"></span><span class="terminal-cursor" style="height:12px; width:6px; background-color:var(--color-pink); display:inline-block; vertical-align:middle; margin-left:3px; animation: blink 0.8s infinite;"></span>`;
    terminalBody.appendChild(line1);
    
    const text1 = line1.querySelector('.line-text');
    const cursor1 = line1.querySelector('.terminal-cursor');
    await typeText(text1, 'Abdul Shakoor', 40);
    await sleep(400);
    if (cursor1) cursor1.remove();
    
    // Line 2: Full-Stack Dev + AI Automation Engineer
    const line2 = document.createElement('div');
    line2.style.marginBottom = '0.8rem';
    line2.style.color = 'var(--text-bright)';
    line2.innerHTML = `<span class="line-text"></span><span class="terminal-cursor" style="height:12px; width:6px; background-color:var(--text-bright); display:inline-block; vertical-align:middle; margin-left:3px; animation: blink 0.8s infinite;"></span>`;
    terminalBody.appendChild(line2);
    
    const text2 = line2.querySelector('.line-text');
    const cursor2 = line2.querySelector('.terminal-cursor');
    await typeText(text2, 'Full-Stack Dev + AI Automation Engineer', 40);
    await sleep(400);
    if (cursor2) cursor2.remove();
    
    // Line 3: Based in Rawalpindi, Punjab, PK
    const line3 = document.createElement('div');
    line3.style.marginBottom = '0.8rem';
    line3.style.color = 'var(--color-teal)';
    line3.innerHTML = `<span class="line-text"></span><span class="terminal-cursor" style="height:12px; width:6px; background-color:var(--color-teal); display:inline-block; vertical-align:middle; margin-left:3px; animation: blink 0.8s infinite;"></span>`;
    terminalBody.appendChild(line3);
    
    const text3 = line3.querySelector('.line-text');
    const cursor3 = line3.querySelector('.terminal-cursor');
    await typeText(text3, 'Based in Rawalpindi, Punjab, PK', 40);
    await sleep(400);
    if (cursor3) cursor3.remove();
    
    // Line 4: Stack: MERN / Next.js / OpenAI / LangChain
    const line4 = document.createElement('div');
    line4.style.marginBottom = '0.8rem';
    line4.style.color = 'var(--color-yellow)';
    line4.innerHTML = `<span class="line-text"></span><span class="terminal-cursor" style="height:12px; width:6px; background-color:var(--color-yellow); display:inline-block; vertical-align:middle; margin-left:3px; animation: blink 0.8s infinite;"></span>`;
    terminalBody.appendChild(line4);
    
    const text4 = line4.querySelector('.line-text');
    await typeText(text4, 'Stack: MERN / Next.js / OpenAI / LangChain', 40);
  }
  
  runType();
}

/* ==========================================================================
   Scroll Progress Bar
   ========================================================================== */
function initScrollProgressBar() {
  const header = document.querySelector('header');
  if (!header) return;
  
  const progress = document.createElement('div');
  progress.id = 'scroll-progress';
  progress.style.position = 'absolute';
  progress.style.bottom = '0';
  progress.style.left = '0';
  progress.style.width = '0%';
  progress.style.height = '3px';
  progress.style.backgroundColor = 'var(--color-teal)';
  progress.style.zIndex = '10';
  progress.style.transition = 'width 0.1s ease';
  header.appendChild(progress);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressPct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = `${progressPct}%`;
  });
}

/* ==========================================================================
   Scroll Timeline Line Drawing
   ========================================================================== */
function initScrollTimelineTracking() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  const educationCards = document.querySelectorAll('.education-card');
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    timelineItems.forEach(item => item.classList.add('active'));
    educationCards.forEach(card => card.classList.add('active'));
    return;
  }
  
  function checkScroll() {
    const triggerPoint = window.innerHeight * 0.85; // 15% of viewport from bottom
    
    timelineItems.forEach(item => {
      if (item.classList.contains('active')) return;
      const rect = item.getBoundingClientRect();
      if (rect.top < triggerPoint) {
        item.classList.add('active');
      }
    });
    
    educationCards.forEach(card => {
      if (card.classList.contains('active')) return;
      const rect = card.getBoundingClientRect();
      if (rect.top < triggerPoint) {
        card.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', checkScroll);
  window.addEventListener('resize', checkScroll);
  
  // Initial check with a small timeout to let rendering settle
  setTimeout(checkScroll, 100);
}

