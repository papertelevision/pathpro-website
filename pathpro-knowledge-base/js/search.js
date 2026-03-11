/* ============================================================
   Search — client-side full-text search with keyboard nav
   ============================================================ */
(function () {
  'use strict';

  /* ---- Search Index ---- */
  var SEARCH_INDEX = [
    { title: 'Welcome to PathPro', url: '/index.html', category: 'Home', excerpt: 'What PathPro is, who it\'s for, and how the core workflow loop works.', headings: ['What is PathPro?', 'Who is it for?', 'How it works', 'Explore the Knowledge Base'] },
    { title: 'Creating Your First Project', url: '/articles/getting-started/creating-your-first-project.html', category: 'Getting Started', excerpt: 'Step-by-step project creation flow, slug, subdomain, visibility settings.', headings: ['Project Creation Flow', 'Project Name, Slug & Subdomain', 'Visibility Settings', 'Basic Project Settings', 'What Your Community Sees'] },
    { title: 'Quick Start Guide', url: '/articles/getting-started/quick-start-guide.html', category: 'Getting Started', excerpt: 'The essential 5-step workflow to get up and running in minutes.', headings: ['Create Your Project', 'Add Task Groups', 'Add Features for Voting', 'Invite Your Community', 'Publish Release Notes'] },
    { title: 'Roles & Permissions', url: '/articles/getting-started/roles-and-permissions.html', category: 'Getting Started', excerpt: 'Admins, Team Members, Community Members — per-project role assignments.', headings: ['Role Types', 'Permission Matrix', 'Super Admin', 'Per-Project Roles', 'Free Plan Limitations'] },
    { title: 'Publish Your Project', url: '/articles/getting-started/publish-your-project.html', category: 'Getting Started', excerpt: 'How to publish your roadmap and voting panel on your site using direct links, iframe embeds, or custom domains.', headings: ['How PathPro Displays Content by Role', 'Your Project URL', 'Embedding on Your Site', 'Custom Header Links', 'Custom Domains', 'Choosing the Right Approach'] },
    { title: 'Roadmap & Task Management', url: '/articles/core-features/roadmap-and-tasks.html', category: 'Core Features', excerpt: 'Task groups, tasks, subtasks, statuses, assignments, drag-and-drop.', headings: ['Task Groups', 'Creating Tasks', 'Task Statuses & Types', 'Subtasks', 'Assignments', 'File Attachments', 'Public vs Internal Roadmap', 'PathFox: Your New Team Member'] },
    { title: 'Feature Voting', url: '/articles/core-features/feature-voting.html', category: 'Core Features', excerpt: 'Community-driven feature prioritization through upvoting.', headings: ['How Feature Voting Works', 'Feature Types', 'Filtering & Search', 'Upvoting Mechanics', 'Feature Statuses', 'Adopting Features', 'PathFox Product Intelligence'] },
    { title: 'Release Notes', url: '/articles/core-features/release-notes.html', category: 'Core Features', excerpt: 'Version-based changelogs, linking tasks, email notifications.', headings: ['Creating Release Notes', 'Linking Tasks & Features', 'Author Attribution', 'Public Changelog', 'Email Notifications'] },
    { title: 'Community Submissions', url: '/articles/core-features/community-submissions.html', category: 'Core Features', excerpt: 'Feedback button, submission types, triage workflow, adoption.', headings: ['How Submissions Work', 'Submission Types', 'Triage Workflow', 'Adopting Submissions', 'File Attachments'] },
    { title: 'Support Tickets', url: '/articles/core-features/support-tickets.html', category: 'Core Features', excerpt: 'Ticket creation, status workflow, reply threading, admin dashboard.', headings: ['Enabling Support Tickets', 'Creating Tickets', 'Ticket Statuses', 'Reply Threading', 'Admin Dashboard'] },
    { title: 'Community Members', url: '/articles/core-features/community-members.html', category: 'Core Features', excerpt: 'Registration, social login, profiles, community growth.', headings: ['How Members Join', 'Social Login', 'Member Profiles', 'Community Growth', 'What Members Can Do'] },
    { title: 'Team Management', url: '/articles/core-features/team-management.html', category: 'Core Features', excerpt: 'Inviting team members, roles per project, managing access.', headings: ['Inviting Team Members', 'Invitation Flow', 'Team Roles', 'Managing Members', 'Free Plan Limitations'] },
    { title: 'Comments & Discussions', url: '/articles/core-features/comments-and-discussions.html', category: 'Core Features', excerpt: 'Threaded comments, upvoting, highlights, attachments.', headings: ['Commenting', 'Threaded Replies', 'Comment Upvoting', 'Highlighted Comments', 'Attachments'] },
    { title: 'PathFox Product Intelligence', url: '/articles/advanced/pathfox-ai.html', category: 'Advanced', excerpt: 'AI-powered product intelligence — demand scoring, duplicates, sentiment.', headings: ['What is PathFox?', 'Demand Scoring', 'Duplicate Detection', 'Sentiment Analysis', 'Context-Aware Analysis', 'Token Usage'] },
    { title: 'Developer API', url: '/articles/advanced/developer-api.html', category: 'Advanced', excerpt: 'API tokens, authentication, task endpoints, rate limiting.', headings: ['Generating API Tokens', 'Authentication', 'Task Endpoints', 'Rate Limiting', 'Revoking Tokens'] },
    { title: 'Custom Domains & Branding', url: '/articles/advanced/custom-domains.html', category: 'Advanced', excerpt: 'Custom domains, DNS configuration, white-label options.', headings: ['Default Subdomain', 'Setting Up Custom Domain', 'DNS Configuration', 'Domain Verification', 'White-Label'] },
    { title: 'Header & Design Settings', url: '/articles/advanced/header-and-design.html', category: 'Advanced', excerpt: 'Navigation tabs, logos, custom CSS, accent colors.', headings: ['Navigation Tabs', 'Project Logo', 'Custom Links', 'Custom CSS', 'Accent Color'] },
    { title: 'Analytics & Overview Dashboard', url: '/articles/advanced/analytics-dashboard.html', category: 'Advanced', excerpt: 'KPIs, community growth, submission feed, ticket breakdown.', headings: ['Dashboard KPIs', 'Community Growth', 'Recent Submissions', 'Support Tickets', 'Project Filtering'] },
    { title: 'Billing & Plans', url: '/articles/advanced/billing-and-plans.html', category: 'Advanced', excerpt: 'Plan tiers, feature comparison, Stripe billing management.', headings: ['Plan Tiers', 'Feature Comparison', 'Upgrading & Downgrading', 'Stripe Billing'] },
    { title: 'Running Effective Feature Voting Campaigns', url: '/articles/best-practices/feature-voting-campaigns.html', category: 'Best Practices', excerpt: 'Setting up campaigns, writing descriptions, promoting, interpreting data.', headings: ['Setting Up Campaigns', 'Writing Descriptions', 'Vote Now vs Confirmed', 'Promoting Your Page', 'Interpreting Data'] },
    { title: 'Building a Public Roadmap', url: '/articles/best-practices/public-roadmap.html', category: 'Best Practices', excerpt: 'Why public roadmaps build trust, what to show, handling changes.', headings: ['Why Public Roadmaps', 'What to Show', 'Balancing Transparency', 'Communicating Progress', 'Handling Delays'] },
    { title: 'Closing the Feedback Loop', url: '/articles/best-practices/closing-the-feedback-loop.html', category: 'Best Practices', excerpt: 'Submission to release notes — the complete feedback cycle.', headings: ['The Complete Cycle', 'Adopting Submissions', 'Tagging Features', 'Notifying Users', 'Measuring Impact'] },
    { title: 'Growing & Engaging Your Community', url: '/articles/best-practices/community-engagement.html', category: 'Best Practices', excerpt: 'Discovery, registration, driving participation, feedback culture.', headings: ['Community Discovery', 'Encouraging Registration', 'Driving Participation', 'Responding Promptly', 'Feedback Culture'] }
  ];

  var input = document.querySelector('.sidebar__search-input');
  var resultsContainer = document.querySelector('.search-results');
  if (!input || !resultsContainer) return;

  var activeIndex = -1;

  function getBasePath() {
    // Determine the base path to the KB root so URLs resolve correctly
    var path = window.location.pathname;
    if (path.indexOf('/articles/') !== -1) {
      // We're inside /articles/category/page.html — go up 3 levels
      return '../../';
    }
    // We're at the root (index.html)
    return './';
  }

  function search(query) {
    if (!query || query.length < 2) return [];
    var q = query.toLowerCase();
    var results = [];

    SEARCH_INDEX.forEach(function (item) {
      var score = 0;
      var titleLower = item.title.toLowerCase();
      var excerptLower = item.excerpt.toLowerCase();
      var headingsLower = item.headings.join(' ').toLowerCase();

      if (titleLower.indexOf(q) !== -1) score += 10;
      if (headingsLower.indexOf(q) !== -1) score += 5;
      if (excerptLower.indexOf(q) !== -1) score += 3;

      if (score > 0) {
        results.push({ item: item, score: score });
      }
    });

    results.sort(function (a, b) { return b.score - a.score; });
    return results.map(function (r) { return r.item; });
  }

  function renderResults(items) {
    resultsContainer.innerHTML = '';
    activeIndex = -1;

    if (items.length === 0) {
      resultsContainer.innerHTML = '<div class="search-results__empty">No results found</div>';
      resultsContainer.classList.add('is-open');
      return;
    }

    var base = getBasePath();

    items.slice(0, 8).forEach(function (item) {
      var a = document.createElement('a');
      a.className = 'search-results__item';
      a.href = base + item.url.replace(/^\//, '');
      a.innerHTML = '<div class="search-results__title">' + escapeHtml(item.title) + '</div>' +
                     '<div class="search-results__category">' + escapeHtml(item.category) + '</div>';
      resultsContainer.appendChild(a);
    });

    resultsContainer.classList.add('is-open');
  }

  function closeResults() {
    resultsContainer.classList.remove('is-open');
    activeIndex = -1;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function updateActiveItem() {
    var items = resultsContainer.querySelectorAll('.search-results__item');
    items.forEach(function (item, i) {
      item.classList.toggle('is-active', i === activeIndex);
    });
  }

  /* ---- Event listeners ---- */
  input.addEventListener('input', function () {
    var query = input.value.trim();
    if (query.length < 2) {
      closeResults();
      return;
    }
    var results = search(query);
    renderResults(results);
  });

  input.addEventListener('keydown', function (e) {
    var items = resultsContainer.querySelectorAll('.search-results__item');
    if (!resultsContainer.classList.contains('is-open') || items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      updateActiveItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActiveItem();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && items[activeIndex]) {
        window.location.href = items[activeIndex].href;
      }
    } else if (e.key === 'Escape') {
      closeResults();
      input.blur();
    }
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.sidebar__search')) {
      closeResults();
    }
  });

  // Keyboard shortcut: / to focus search
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== input && !e.ctrlKey && !e.metaKey) {
      var tag = document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault();
      input.focus();
    }
  });
})();
