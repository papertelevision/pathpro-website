/* ============================================================
   Sidebar — mobile toggle, active states, collapsible sections
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'kb_collapsed_sections';
  var sidebar = document.querySelector('.sidebar');
  var hamburger = document.querySelector('.sidebar__hamburger');
  var overlay = document.querySelector('.sidebar__overlay');

  /* ---- Mobile toggle ---- */
  function openSidebar() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (sidebar.classList.contains('is-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  /* ---- Active link ---- */
  var currentPath = window.location.pathname;
  var links = document.querySelectorAll('.sidebar__link');

  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    // Normalize: compare just the filename portion for relative paths
    var linkPath = href.replace(/^\.?\.\//g, '');
    if (currentPath.indexOf(linkPath) !== -1 || currentPath.endsWith(linkPath)) {
      link.classList.add('is-active');
    }
  });

  /* ---- Collapsible sections ---- */
  var savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) { /* ignore */ }

  var sections = document.querySelectorAll('.sidebar__section');

  sections.forEach(function (section) {
    var header = section.querySelector('.sidebar__section-header');
    var linkList = section.querySelector('.sidebar__section-links');
    if (!header || !linkList) return;

    var sectionId = header.textContent.trim().toLowerCase().replace(/\s+/g, '-');

    // Restore state
    if (savedState[sectionId] === true) {
      section.classList.add('is-collapsed');
    }

    // Set max-height for transition
    if (!section.classList.contains('is-collapsed')) {
      linkList.style.maxHeight = linkList.scrollHeight + 'px';
    }

    header.addEventListener('click', function () {
      var isCollapsed = section.classList.toggle('is-collapsed');
      savedState[sectionId] = isCollapsed;

      if (!isCollapsed) {
        linkList.style.maxHeight = linkList.scrollHeight + 'px';
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
      } catch (e) { /* ignore */ }
    });
  });
})();
