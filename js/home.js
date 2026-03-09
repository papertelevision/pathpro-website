/* ============================================
   PathPro Landing Page — home.js
   Scroll animations, nav scroll effect,
   smooth scroll, mobile menu toggle
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll-triggered animations ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  animatedElements.forEach((el) => observer.observe(el));

  // --- Sticky nav scroll effect ---
  const nav = document.getElementById('nav');
  if (nav) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('nav--scrolled', window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navEl = document.getElementById('nav');
        const navHeight = navEl ? navEl.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // --- Mobile menu toggle ---
  const mobileToggle = document.querySelector('.nav__mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMobileMenu() {
    if (!mobileMenu || !mobileToggle) return;
    document.body.classList.add('nav--open');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileMenu || !mobileToggle) return;
    document.body.classList.remove('nav--open');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
      if (mobileToggle) mobileToggle.focus();
    }
  });

  // --- Nav dropdowns (hover) ---
  var dropdowns = document.querySelectorAll('.nav__dropdown');

  dropdowns.forEach(function(dropdown) {
    var trigger = dropdown.querySelector('.nav__dropdown-trigger');
    var panel = dropdown.querySelector('.nav__dropdown-panel');
    var timeout;

    if (!trigger || !panel) return;

    function open() {
      clearTimeout(timeout);
      // Close any other open dropdowns
      dropdowns.forEach(function(other) {
        if (other !== dropdown && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          other.querySelector('.nav__dropdown-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.nav__dropdown-panel').setAttribute('aria-hidden', 'true');
        }
      });
      dropdown.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
    }

    function close() {
      timeout = setTimeout(function() {
        dropdown.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
      }, 150);
    }

    dropdown.addEventListener('mouseenter', open);
    dropdown.addEventListener('mouseleave', close);

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      if (dropdown.classList.contains('is-open')) {
        clearTimeout(timeout);
        close();
      } else {
        open();
      }
    });
  });

  // Close all dropdowns on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(function(dropdown) {
        if (dropdown.classList.contains('is-open')) {
          dropdown.classList.remove('is-open');
          var trigger = dropdown.querySelector('.nav__dropdown-trigger');
          trigger.setAttribute('aria-expanded', 'false');
          dropdown.querySelector('.nav__dropdown-panel').setAttribute('aria-hidden', 'true');
          trigger.focus();
        }
      });
    }
  });

  // --- Sticky table header "stuck" detection ---
  // Works for both home (.matrix-table) and pricing (.comparison__table)
  const stickyTables = document.querySelectorAll('.matrix-table, .comparison__table');
  if (stickyTables.length > 0) {
    const navHeight = 76;

    stickyTables.forEach((table) => {
      const thead = table.querySelector('thead');
      if (!thead) return;

      // Create a sentinel element just above the table
      const sentinel = document.createElement('div');
      sentinel.style.height = '0';
      sentinel.style.width = '0';
      sentinel.style.pointerEvents = 'none';
      sentinel.setAttribute('aria-hidden', 'true');
      table.parentNode.insertBefore(sentinel, table);

      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // When sentinel scrolls above the nav, the thead is stuck
          thead.classList.toggle('is-stuck', !entry.isIntersecting);
        });
      }, {
        root: null,
        rootMargin: '-' + navHeight + 'px 0px 0px 0px',
        threshold: 0,
      });

      obs.observe(sentinel);
    });
  }

  // --- Stripe hero animation ---
  var heroStripe = document.querySelector('.hero-stripe');
  if (heroStripe) {
    // --- Geometry ---
    var r = 70;
    var centerY = 300;
    var startAmp = 40;
    var endAmp = 276;
    var numPairs = 7;
    var k = 0.5523;
    var kr = k * r;

    function R(v) { return Math.round(v * 10) / 10; }

    // --- Progressive growth: amplitude increases left to right ---
    var botLevels = [];
    var topLevels = [];
    for (var j = 0; j < numPairs; j++) {
      var t = numPairs > 1 ? j / (numPairs - 1) : 0;
      var amp = R(startAmp + (endAmp - startAmp) * Math.pow(t, 1.5));
      botLevels.push(R(centerY + amp));
      topLevels.push(R(centerY - amp));
    }

    // --- Build serpentine path with cubic bezier turns ---
    var x = -r;
    var d = 'M' + x + ',' + topLevels[0];

    for (var j = 0; j < numPairs; j++) {
      var yBot = botLevels[j];
      var yTop = topLevels[j];
      var isLast = (j === numPairs - 2);

      d += ' V' + yBot;
      d += ' C' + x + ',' + R(yBot + kr);
      d += ' ' + R(x + r - kr) + ',' + R(yBot + r);
      d += ' ' + R(x + r) + ',' + R(yBot + r);
      d += ' C' + R(x + r + kr) + ',' + R(yBot + r);
      d += ' ' + R(x + 2 * r) + ',' + R(yBot + kr);
      d += ' ' + R(x + 2 * r) + ',' + yBot;
      x += 2 * r;

      d += ' V' + yTop;

      if (isLast) {
        d += ' C' + x + ',' + R(yTop - kr);
        d += ' ' + R(x + r - kr) + ',' + R(yTop - r);
        d += ' ' + R(x + r) + ',' + R(yTop - r);
        d += ' H2000';
        break;
      } else {
        d += ' C' + x + ',' + R(yTop - kr);
        d += ' ' + R(x + r - kr) + ',' + R(yTop - r);
        d += ' ' + R(x + r) + ',' + R(yTop - r);
        d += ' C' + R(x + r + kr) + ',' + R(yTop - r);
        d += ' ' + R(x + 2 * r) + ',' + R(yTop - kr);
        d += ' ' + R(x + 2 * r) + ',' + yTop;
        x += 2 * r;
      }
    }

    // --- Create border-only stripes using SVG mask ---
    var svg = heroStripe.querySelector('.stripe-svg');
    var ns = 'http://www.w3.org/2000/svg';
    var widths = [84, 72, 60, 48, 36, 24, 12];
    var bw = 1;

    var defs = document.createElementNS(ns, 'defs');
    var mask = document.createElementNS(ns, 'mask');
    mask.setAttribute('id', 'border-mask');

    function makeMaskPath(color, width) {
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', color);
      p.setAttribute('stroke-width', width);
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-linejoin', 'round');
      return p;
    }

    for (var i = 0; i < widths.length; i++) {
      mask.appendChild(makeMaskPath('white', widths[i] + bw));
      mask.appendChild(makeMaskPath('black', widths[i] - bw));
    }
    mask.appendChild(makeMaskPath('white', bw));

    defs.appendChild(mask);
    svg.appendChild(defs);

    var g = document.createElementNS(ns, 'g');
    g.setAttribute('mask', 'url(#border-mask)');

    var paths = [];
    for (var s = 1; s <= 7; s++) {
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('d', d);
      p.setAttribute('class', 'stripe stripe-' + s);
      g.appendChild(p);
      paths.push(p);
    }
    svg.appendChild(g);

    // --- Draw-in animation ---
    var pathLength = paths[0].getTotalLength();

    var timing = [
      { delay: 0,    duration: 3.2 },
      { delay: 0.7,  duration: 2.9 },
      { delay: 1.4,  duration: 2.7 },
      { delay: 2.1,  duration: 2.4 },
      { delay: 2.8,  duration: 2.6 },
      { delay: 3.5,  duration: 2.2 },
      { delay: 4.2,  duration: 2.0 }
    ];

    // First stripe (outermost, darkest) is already visible
    paths[0].style.strokeDasharray = 'none';
    paths[0].style.strokeDashoffset = '0';

    // Remaining stripes start hidden
    for (var i = 1; i < paths.length; i++) {
      paths[i].style.strokeDasharray = pathLength;
      paths[i].style.strokeDashoffset = pathLength;
    }

    svg.classList.add('visible');
    svg.getBoundingClientRect();

    // Animate stripes 2-7 with staggered delays
    for (var i = 1; i < paths.length; i++) {
      paths[i].style.transition =
        'stroke-dashoffset ' + timing[i].duration + 's ease-out ' + timing[i].delay + 's';
      paths[i].style.strokeDashoffset = '0';
    }

    heroStripe.querySelector('.stripe-animator').classList.add('active');

    // --- Avatar pop-in timed to stripe progress ---
    var avatarTimings = [
      { id: 'avatar-maria',  delay: 2.5 },
      { id: 'avatar-josh',   delay: 3.2 },
      { id: 'avatar-aisha',  delay: 3.8 },
      { id: 'avatar-sarah',  delay: 4.5 },
      { id: 'avatar-marcus', delay: 5.0 }
    ];

    avatarTimings.forEach(function(a) {
      setTimeout(function() {
        var el = document.getElementById(a.id);
        if (el) el.classList.add('pop-in');
      }, a.delay * 1000);
    });

    // --- Speech bubbles cycle randomly ---
    var quotes = {
      maria: [
        'Your product really needs keyboard shortcuts.',
        'Just upvoted the dark mode request!',
        'A mobile app would be a game changer.',
        'Would love to see better export options.',
        'Upvoted! Bulk editing is a must-have.',
        'Can we get email notification settings?',
        'Just submitted a request for templates.',
        'The API integration idea is brilliant, voted!',
        'Would love drag-and-drop file uploads.',
        'Voted for the calendar view, need that!'
      ],
      aisha: [
        'Wow, they really listened, looks great!',
        'Love that they shipped this so fast!',
        'This update is exactly what we needed.',
        'Upvoted, this would help our whole team.',
        'Just saw the fix go live, incredible support!',
        'The new feature works perfectly, thank you!',
        'So glad this made it to the roadmap.',
        'Voted! This would save us hours weekly.',
        'Finally, a team that actually listens to users.',
        'The response time on this was amazing!',
        'I bet the creator of PathPro is extra handsome.'
      ],
      josh: [
        'Feature confirmed, adding it to the roadmap.',
        'Great feedback, creating a task for this now.',
        'Community spoke, we\'re building it next sprint.',
        'Hearing you loud and clear, it\'s prioritized.',
        'Added to the backlog, shipping next month.',
        'Love this idea, assigning it to the team.',
        'This has 50 votes now, fast-tracking it.',
        'Confirmed, the team is on it this week.',
        'Moved to in-progress, stay tuned for updates.',
        'We hear you, releasing a fix by Friday.',
        'PathFox flagged this as a top request.',
        'PathFox detected a trend, users want this.',
        'PathFox analyzed 200 comments, clear winner.',
        'PathFox insights confirm, this is priority #1.',
        'PathFox surfaced this from community feedback.'
      ],
      sarah: [
        'Great suggestion! highlighting for later.',
        'Looking into this now, will update shortly.',
        'Thanks for flagging, passing to the team!',
        'Good catch, I\'ll escalate this right away.',
        'Noted! Adding context for the dev team.',
        'On it! Expect an update within 24 hours.',
        'Great idea, linking to a related request.',
        'Reproduced the issue, fix is in the works.',
        'Tagging the team, this needs attention.',
        'Helpful feedback, documenting for the team.',
        'Shoutout to @maria for suggesting this one!',
        'Big thanks to @aisha for the detailed feedback!',
        'Props to the community for driving this feature!',
        'Hat tip to @marcus for building this so fast!',
        'Huge shoutout to everyone who voted on this!'
      ],
      marcus: [
        'Sprint complete, let\'s ship the update!',
        'Bug fixed, deploying to production now.',
        'Feature done, ready for QA review.',
        'Pushed the update, should be live shortly.',
        'Task complete, moving on to the next one.',
        'Merged the PR, releasing tomorrow morning.',
        'All tests passing, marking this complete.',
        'Hotfix deployed, issue should be resolved.',
        'Finished the integration, works like a charm.',
        'Release notes updated, version 2.4 is live.'
      ]
    };

    var bubbles = [
      { bubble: 'bubble-aisha',  avatar: 'avatar-aisha',  quotes: quotes.aisha },
      { bubble: 'bubble-josh',   avatar: 'avatar-josh',   quotes: quotes.josh },
      { bubble: 'bubble-marcus', avatar: 'avatar-marcus', quotes: quotes.marcus },
      { bubble: 'bubble-maria',  avatar: 'avatar-maria',  quotes: quotes.maria },
      { bubble: 'bubble-sarah',  avatar: 'avatar-sarah',  quotes: quotes.sarah }
    ];
    var lastBubble = -1;

    function showRandomBubble() {
      var idx;
      do {
        idx = Math.floor(Math.random() * bubbles.length);
      } while (idx === lastBubble);
      lastBubble = idx;

      var b = bubbles[idx];
      var bubbleEl = document.getElementById(b.bubble);
      var avatarEl = document.getElementById(b.avatar);
      if (!bubbleEl || !avatarEl) return;

      var quote = b.quotes[Math.floor(Math.random() * b.quotes.length)];
      var attribution = bubbleEl.querySelector('.attribution');
      bubbleEl.firstChild.textContent = quote;

      bubbleEl.classList.remove('show');
      avatarEl.classList.remove('shine');
      void bubbleEl.offsetWidth;
      void avatarEl.offsetWidth;
      bubbleEl.classList.add('show');
      avatarEl.classList.add('shine');

      setTimeout(showRandomBubble, 5000);
    }

    setTimeout(showRandomBubble, 5800);
  }

});
