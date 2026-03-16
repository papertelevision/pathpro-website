/* ============================================================
   Sidebar Nav — single source of truth for all KB navigation
   ============================================================ */
(function () {
  'use strict';

  var ARROW_SVG = '<svg class="sidebar__section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';

  var SECTIONS = [
    {
      title: 'Getting Started',
      links: [
        { href: 'articles/getting-started/creating-your-first-project.html', label: 'Creating Your First Project' },
        { href: 'articles/getting-started/quick-start-guide.html', label: 'Quick Start Guide' },
        { href: 'articles/getting-started/roles-and-permissions.html', label: 'Roles &amp; Permissions' },
        { href: 'articles/getting-started/publish-your-project.html', label: 'Publish Your Project' }
      ]
    },
    {
      title: 'Core Features',
      links: [
        { href: 'articles/core-features/roadmap-and-tasks.html', label: 'Roadmap &amp; Tasks' },
        { href: 'articles/core-features/feature-voting.html', label: 'Feature Voting' },
        { href: 'articles/core-features/release-notes.html', label: 'Release Notes' },
        { href: 'articles/core-features/community-submissions.html', label: 'Community Submissions' },
        { href: 'articles/core-features/support-tickets.html', label: 'Support Tickets' },
        { href: 'articles/core-features/community-members.html', label: 'Community Members' },
        { href: 'articles/core-features/team-management.html', label: 'Team Management' },
        { href: 'articles/core-features/comments-and-discussions.html', label: 'Comments &amp; Discussions' }
      ]
    },
    {
      title: 'Publishing Projects',
      links: [
        { href: 'articles/publishing-projects/overview.html', label: 'Overview' },
        { href: 'articles/publishing-projects/widgets.html', label: 'Widgets' }
      ]
    },
    {
      title: 'Advanced',
      links: [
        { href: 'articles/advanced/pathfox-ai.html', label: 'PathFox Product Intelligence' },
        { href: 'articles/advanced/developer-api.html', label: 'Developer API' },
        { href: 'articles/advanced/custom-domains.html', label: 'Custom Domains &amp; Branding' },
        { href: 'articles/advanced/header-and-design.html', label: 'Header &amp; Design' },
        { href: 'articles/advanced/analytics-dashboard.html', label: 'Analytics Dashboard' },
        { href: 'articles/advanced/billing-and-plans.html', label: 'Billing &amp; Plans' }
      ]
    },
    {
      title: 'Best Practices',
      links: [
        { href: 'articles/best-practices/feature-voting-campaigns.html', label: 'Feature Voting Campaigns' },
        { href: 'articles/best-practices/public-roadmap.html', label: 'Public Roadmap Strategy' },
        { href: 'articles/best-practices/closing-the-feedback-loop.html', label: 'Closing the Feedback Loop' },
        { href: 'articles/best-practices/community-engagement.html', label: 'Community Engagement' }
      ]
    }
  ];

  // Determine base path from current page to KB root
  function getBasePath() {
    var path = window.location.pathname;
    if (path.indexOf('/articles/') !== -1) {
      return '../../';
    }
    return '';
  }

  var nav = document.querySelector('.sidebar__nav');
  if (!nav) return;

  var base = getBasePath();
  var html = '';

  SECTIONS.forEach(function (section) {
    html += '<div class="sidebar__section">';
    html += '<div class="sidebar__section-header">' + section.title + ' ' + ARROW_SVG + '</div>';
    html += '<ul class="sidebar__section-links">';
    section.links.forEach(function (link) {
      html += '<li><a href="' + base + link.href + '" class="sidebar__link">' + link.label + '</a></li>';
    });
    html += '</ul>';
    html += '</div>';
  });

  nav.innerHTML = html;
})();
