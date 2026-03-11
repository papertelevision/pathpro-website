/* ============================================================
   Table of Contents — auto-generated from h2/h3, scroll spy
   ============================================================ */
(function () {
  'use strict';

  var tocContainer = document.querySelector('.toc');
  if (!tocContainer) return;

  var article = document.querySelector('.article');
  if (!article) return;

  var headings = article.querySelectorAll('h2, h3');
  if (headings.length === 0) return;

  /* ---- Build the ToC ---- */
  var title = document.createElement('div');
  title.className = 'toc__title';
  title.textContent = 'On this page';
  tocContainer.appendChild(title);

  var list = document.createElement('ul');
  list.className = 'toc__list';

  headings.forEach(function (heading, index) {
    // Ensure heading has an ID
    if (!heading.id) {
      heading.id = heading.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'section-' + index;
    }

    var li = document.createElement('li');
    li.className = 'toc__item';
    if (heading.tagName === 'H3') {
      li.classList.add('toc__item--h3');
    }
    li.setAttribute('data-target', heading.id);

    var a = document.createElement('a');
    a.className = 'toc__link';
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;

    a.addEventListener('click', function (e) {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + heading.id);
    });

    li.appendChild(a);
    list.appendChild(li);
  });

  tocContainer.appendChild(list);

  /* ---- Scroll spy with IntersectionObserver ---- */
  var tocItems = list.querySelectorAll('.toc__item');
  var currentActive = null;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          tocItems.forEach(function (item) {
            if (item.getAttribute('data-target') === id) {
              if (currentActive) currentActive.classList.remove('is-active');
              item.classList.add('is-active');
              currentActive = item;
            }
          });
        }
      });
    }, {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0
    });

    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  }
})();
