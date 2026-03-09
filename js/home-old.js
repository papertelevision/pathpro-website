/* PathPro — Mobile nav toggle + scroll animations + isometric grid */

/* Mobile nav toggle */
(function () {
    var hamburger = document.querySelector('.site-header__hamburger');
    var nav = document.querySelector('.site-header__nav');
    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('is-open');
        nav.classList.toggle('is-open');
    });

    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            hamburger.classList.remove('is-open');
            nav.classList.remove('is-open');
        });
    }
})();

/* Scroll animations */
(function () {
    var elements = document.querySelectorAll('[data-animate]');
    if (!elements.length || !('IntersectionObserver' in window)) return;

    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.add('animate-hidden');
    }

    var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                entries[i].target.classList.remove('animate-hidden');
                entries[i].target.classList.add('animate-visible');
                observer.unobserve(entries[i].target);
            }
        }
    }, { threshold: 0.15 });

    for (var i = 0; i < elements.length; i++) {
        observer.observe(elements[i]);
    }
})();

/* Isometric Q*bert block grid — symbolises product growth */
(function () {
    var container = document.querySelector('.home-hero__iso');
    if (!container) return;

    var ns = 'http://www.w3.org/2000/svg';
    var hw = 36;   // half-width of top diamond
    var hh = 21;   // half-height of top diamond
    var fh = 28;   // face height per cube level
    var gap = 82;  // column centre-to-centre spacing
    var x0 = 40;   // first column x
    var gy = 850;  // ground y-level

    // Column heights — grows from left to right like a product growth curve
    var front = [1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 9, 10, 11, 12, 13, 15, 17, 19, 21, 23, 26];
    var back  = [0, 0, 1, 0, 1, 1, 2, 2, 3, 3, 4, 3, 5, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16, 19];

    // Accent colours for top face fills (cycle: teal, coral, blue)
    var topFills = [
        'rgba(95,138,139,0.09)',
        'rgba(224,120,96,0.07)',
        'rgba(51,118,163,0.09)'
    ];

    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 2000 900');
    svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    svg.setAttribute('class', 'iso-grid');
    svg.setAttribute('aria-hidden', 'true');

    function drawColumn(n, cx, groundY, colorIdx, isBack, delay) {
        if (n <= 0) return null;
        var topY = groundY - n * fh;
        var g = document.createElementNS(ns, 'g');
        g.setAttribute('class', 'iso-col' + (isBack ? ' iso-col--back' : ''));
        g.style.animationDelay = delay + 's';

        // Coordinate strings
        var pN = cx + ',' + (topY - hh);
        var pE = (cx + hw) + ',' + topY;
        var pS = cx + ',' + (topY + hh);
        var pW = (cx - hw) + ',' + topY;
        var pBL = (cx - hw) + ',' + groundY;
        var pBR = (cx + hw) + ',' + groundY;
        var pBF = cx + ',' + (groundY + hh);

        // Top face
        var top = document.createElementNS(ns, 'polygon');
        top.setAttribute('class', 'iso-top');
        top.setAttribute('points', pN + ' ' + pE + ' ' + pS + ' ' + pW);
        top.style.fill = topFills[colorIdx % 3];
        g.appendChild(top);

        // Left face
        var left = document.createElementNS(ns, 'polygon');
        left.setAttribute('class', 'iso-left');
        left.setAttribute('points', pW + ' ' + pS + ' ' + pBF + ' ' + pBL);
        g.appendChild(left);

        // Right face
        var right = document.createElementNS(ns, 'polygon');
        right.setAttribute('class', 'iso-right');
        right.setAttribute('points', pS + ' ' + pE + ' ' + pBR + ' ' + pBF);
        g.appendChild(right);

        // Division lines (Q*bert cube separation marks)
        for (var k = 1; k < n; k++) {
            var ly = topY + k * fh;

            // Left face division
            var lnL = document.createElementNS(ns, 'line');
            lnL.setAttribute('class', 'iso-div');
            lnL.setAttribute('x1', cx - hw);
            lnL.setAttribute('y1', ly);
            lnL.setAttribute('x2', cx);
            lnL.setAttribute('y2', ly + hh);
            g.appendChild(lnL);

            // Right face division
            var lnR = document.createElementNS(ns, 'line');
            lnR.setAttribute('class', 'iso-div');
            lnR.setAttribute('x1', cx);
            lnR.setAttribute('y1', ly + hh);
            lnR.setAttribute('x2', cx + hw);
            lnR.setAttribute('y2', ly);
            g.appendChild(lnR);
        }

        return g;
    }

    // Draw back row first (behind front row)
    var backGroundY = gy - hh;
    for (var i = 0; i < back.length; i++) {
        var col = drawColumn(back[i], x0 + i * gap + hw, backGroundY, i + 1, true, i * 0.09 + 0.3);
        if (col) svg.appendChild(col);
    }

    // Draw front row
    for (var i = 0; i < front.length; i++) {
        var col = drawColumn(front[i], x0 + i * gap, gy, i, false, i * 0.09);
        if (col) svg.appendChild(col);
    }

    container.appendChild(svg);
})();
