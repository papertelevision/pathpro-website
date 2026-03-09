/**
 * PathPro Pricing Page — Dynamic pricing from API
 */
(function () {
    'use strict';

    var APP_URL = 'https://app.pathpro.co';
    var plans = [];
    var isYearly = false;

    // -----------------------------------------------
    // Fetch plans from API
    // -----------------------------------------------

    function fetchPlans() {
        return fetch(APP_URL + '/pricing-plans')
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function (json) {
                plans = json.data;
                return plans;
            })
            .catch(function (err) {
                console.error('Failed to load pricing plans:', err);
                var grid = document.querySelector('.pricing__grid');
                if (grid) {
                    grid.innerHTML = '<p style="text-align:center;color:#666;grid-column:1/-1;">Unable to load pricing plans. Please refresh the page or try again later.</p>';
                }
            });
    }

    // -----------------------------------------------
    // Render Pricing Cards
    // -----------------------------------------------

    function renderPricingCards() {
        var grid = document.querySelector('.pricing__grid');
        if (!grid) return;

        grid.innerHTML = '';

        plans.forEach(function (plan) {
            var card = document.createElement('div');
            card.className = 'pricing-card' + (plan.is_recommended ? ' is-recommended' : '');
            card.setAttribute('data-plan', plan.slug);

            var html = '';

            if (plan.is_recommended) {
                html += '<div class="pricing-card__badge">Most Popular</div>';
            }

            html += '<div class="pricing-card__name">' + plan.name + '</div>';
            html += '<div class="pricing-card__price">' + buildPriceHTML(plan) + '</div>';
            html += '<div class="pricing-card__seats">' + buildSeatsHTML(plan) + '</div>';
            html += '<div class="pricing-card__community">Unlimited Community Members</div>';
            html += '<div class="pricing-card__cta">' + buildCTAHTML(plan) + '</div>';
            html += '<ul class="pricing-card__features">' + buildFeaturesHTML(plan) + '</ul>';

            if (plan.ai_features_included) {
                html += '<div class="pricing-card__pathfox">PathFox Product Intelligence\u2122</div>';
            }

            card.innerHTML = html;
            grid.appendChild(card);
        });
    }

    function buildPriceHTML(plan) {
        if (plan.is_free) {
            return '<span class="amount">$0</span><span class="period">/mo</span>';
        }
        if (isYearly) {
            return '<span class="original">$' + formatPrice(plan.monthly_price) + '</span>' +
                '<span class="amount">$' + formatPrice(plan.discounted_monthly_price) + '</span>' +
                '<span class="period">/mo</span>';
        }
        return '<span class="amount">$' + formatPrice(plan.monthly_price) + '</span>' +
            '<span class="period">/mo</span>';
    }

    function buildSeatsHTML(plan) {
        var seats = plan.included_seats || 1;
        var label = seats === 1 ? '1 seat' : seats + ' seats';
        if (plan.additional_seat_price) {
            var seatPrice = isYearly
                ? plan.additional_seat_price * (1 - (plan.yearly_discount_percentage / 100))
                : plan.additional_seat_price;
            return '<strong>' + label + '</strong> included &middot; $' + formatPrice(seatPrice) + '/seat/mo after';
        }
        return '<strong>' + label + '</strong> included';
    }

    function buildCTAHTML(plan) {
        if (plan.is_free) {
            return '<a href="' + plan.get_started_monthly_url + '" class="btn btn--outline" data-cta>Get Started Free</a>';
        }
        var url = isYearly ? plan.get_started_yearly_url : plan.get_started_monthly_url;
        return '<a href="' + url + '" class="btn btn--primary" data-cta>Get Started</a>';
    }

    function buildFeaturesHTML(plan) {
        if (!plan.features || !plan.features.length) return '';
        return plan.features.filter(function (f) {
            return f.feature.toLowerCase().indexOf('pathfox') === -1;
        }).map(function (f) {
            var cls = f.is_header ? ' class="is-header"' : '';
            return '<li' + cls + '>' + stripWrappingTags(f.feature) + '</li>';
        }).join('');
    }

    // -----------------------------------------------
    // Billing Toggle
    // -----------------------------------------------

    function initBillingToggle() {
        var toggle = document.querySelector('.billing-toggle__switch');
        var monthlyLabel = document.querySelector('[data-toggle="monthly"]');
        var yearlyLabel = document.querySelector('[data-toggle="yearly"]');

        if (!toggle) return;

        toggle.addEventListener('click', function () {
            isYearly = !isYearly;
            toggle.classList.toggle('is-yearly', isYearly);
            monthlyLabel.classList.toggle('is-active', !isYearly);
            yearlyLabel.classList.toggle('is-active', isYearly);
            renderPricingCards();
            renderCalculators();
        });
    }

    function updateBillingBadge() {
        var badge = document.querySelector('.billing-toggle__badge');
        if (!badge) return;

        var discountPlan = plans.find(function (p) { return p.yearly_discount_percentage > 0; });
        if (discountPlan) {
            badge.textContent = 'Save ' + discountPlan.yearly_discount_percentage + '%';
        }
    }

    // -----------------------------------------------
    // Seat Calculator
    // -----------------------------------------------

    function renderCalculators() {
        var grid = document.querySelector('.calculator__grid');
        if (!grid) return;

        grid.innerHTML = '';

        plans.forEach(function (plan) {
            if (!plan.has_per_seat_pricing) return;

            var card = document.createElement('div');
            card.className = 'calculator__card';
            card.setAttribute('data-calc-plan', plan.slug);

            var seats = plan.included_seats || 1;
            var maxSeats = Math.max(seats * 3, 30);

            card.innerHTML =
                '<div class="calculator__card-name">' + plan.name + '</div>' +
                '<div class="calculator__slider-label">Team members</div>' +
                '<input type="range" min="1" max="' + maxSeats + '" value="' + seats + '" class="calculator__slider">' +
                '<div class="calculator__seat-count">' + seats + ' team members</div>' +
                '<div class="calculator__breakdown"></div>' +
                '<div class="calculator__total"></div>';

            grid.appendChild(card);

            var slider = card.querySelector('.calculator__slider');
            slider.addEventListener('input', function () {
                updateCalculator(card, plan);
            });

            updateCalculator(card, plan);
        });
    }

    function updateCalculator(card, plan) {
        var slider = card.querySelector('.calculator__slider');
        var countEl = card.querySelector('.calculator__seat-count');
        var breakdownEl = card.querySelector('.calculator__breakdown');
        var totalEl = card.querySelector('.calculator__total');

        var totalSeats = parseInt(slider.value, 10);
        var additionalSeats = Math.max(0, totalSeats - plan.included_seats);

        var basePrice = isYearly ? plan.discounted_monthly_price : plan.monthly_price;
        var seatPrice = plan.additional_seat_price;
        if (isYearly) {
            seatPrice = seatPrice * (1 - (plan.yearly_discount_percentage / 100));
        }
        var seatCost = additionalSeats * seatPrice;
        var total = basePrice + seatCost;

        var teamMembers = Math.max(0, totalSeats - 1);
        countEl.textContent = '1 Admin + ' + teamMembers + ' team member' + (teamMembers !== 1 ? 's' : '');

        var lines = [
            'Base plan: $' + formatPrice(basePrice) + '/mo',
            'Total included seats: ' + plan.included_seats,
            'Additional seats: ' + additionalSeats + (additionalSeats > 0 ? ' x $' + formatPrice(seatPrice) + ' = $' + formatPrice(seatCost) : ''),
        ];
        breakdownEl.innerHTML = lines.join('<br>');
        totalEl.innerHTML = '$' + formatPrice(total) + '<span class="period">/mo</span>';
    }

    // -----------------------------------------------
    // Comparison Table
    // -----------------------------------------------

    function renderComparisonTable() {
        var thead = document.querySelector('.comparison__table thead');
        var tbody = document.querySelector('.comparison__table tbody');
        if (!thead || !tbody) return;

        var colCount = plans.length + 1;

        // Header row
        var headerRow = '<tr><th></th>';
        plans.forEach(function (plan) {
            var cls = plan.is_recommended ? ' class="is-recommended"' : '';
            headerRow += '<th' + cls + '>' + plan.name + '</th>';
        });
        headerRow += '</tr>';
        thead.innerHTML = headerRow;

        // Build body rows
        var rows = '';

        // --- Pricing ---
        rows += categoryRow('Pricing', colCount);
        rows += dataRow('Base price', plans.map(function (p) {
            return '$' + formatPrice(p.monthly_price) + '/mo';
        }));
        rows += dataRow('Included seats', plans.map(function (p) {
            return p.included_seats || 1;
        }));
        rows += dataRow('Additional seat price', plans.map(function (p) {
            return p.additional_seat_price ? '$' + formatPrice(p.additional_seat_price) + '/seat/mo' : dash();
        }));
        rows += dataRow('Team members', plans.map(function (p) {
            var seats = p.included_seats || 1;
            return Math.max(0, seats - 1);
        }));
        rows += dataRow('Community members', plans.map(function () {
            return '<strong>Unlimited</strong>';
        }));

        // --- Projects & Content ---
        rows += categoryRow('Projects & Content', colCount);
        rows += dataRow('Projects', plans.map(function (p) {
            return p.projects_count === 'UNLIMITED' ? 'Unlimited' : p.projects_count;
        }));
        rows += dataRow('Tasks', plans.map(function (p) {
            if (p.roadmap_tasks_count === 'UNLIMITED') return 'Unlimited';
            return p.roadmap_tasks_count;
        }));
        rows += dataRow('Task groups', plans.map(function (p) {
            return p.task_groups_count === 'UNLIMITED' ? 'Unlimited' : p.task_groups_count;
        }));
        rows += dataRow('Feature voting items', plans.map(function (p) {
            return p.features_count === 'UNLIMITED' ? 'Unlimited' : p.features_count;
        }));

        // --- Features ---
        rows += categoryRow('Features', colCount);
        rows += boolRow('Public roadmap', plans.map(function () { return true; }));
        rows += boolRow('Feature voting', plans.map(function () { return true; }));
        rows += boolRow('Private projects', plans.map(function (p) { return p.are_private_projects_allowed; }));
        rows += boolRow('File attachments', plans.map(function (p) { return p.file_attachments_included; }));
        rows += boolRow('Custom domains', plans.map(function (p) { return p.custom_domains_allowed; }));
        rows += boolRow('White labeling', plans.map(function (p) { return p.is_white_labeled; }));
        rows += boolRow('PathFox Product Intelligence\u2122', plans.map(function (p) { return p.ai_features_included; }));
        rows += boolRow('Support system', plans.map(function (p) { return p.support_system_enabled; }));
        rows += boolRow('CRM features', plans.map(function (p) { return p.crm_features_included; }));

        // --- Support ---
        rows += categoryRow('Support', colCount);
        rows += dataRow('Support', plans.map(function (p) {
            return capitalizeFirst(p.tech_support_type || 'community');
        }));

        tbody.innerHTML = rows;
    }

    function categoryRow(label, colCount) {
        return '<tr class="category-row"><td colspan="' + colCount + '">' + label + '</td></tr>';
    }

    function dataRow(label, values) {
        var row = '<tr><td>' + label + '</td>';
        values.forEach(function (val, i) {
            var cls = plans[i].is_recommended ? ' class="is-recommended"' : '';
            row += '<td' + cls + '>' + val + '</td>';
        });
        return row + '</tr>';
    }

    function boolRow(label, values) {
        var row = '<tr><td>' + label + '</td>';
        values.forEach(function (val, i) {
            var cls = plans[i].is_recommended ? ' class="is-recommended"' : '';
            var content = val ? '<span class="check">&#10003;</span>' : dash();
            row += '<td' + cls + '>' + content + '</td>';
        });
        return row + '</tr>';
    }

    function dash() {
        return '<span class="dash">&mdash;</span>';
    }

    // -----------------------------------------------
    // Helpers
    // -----------------------------------------------

    function formatPrice(value) {
        if (value % 1 === 0) return value.toString();
        return value.toFixed(2);
    }

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function stripWrappingTags(html) {
        if (!html) return '';
        // Remove outer <p> wrapper if it's the only top-level element
        var stripped = html.replace(/^<p>(.*)<\/p>$/s, '$1').trim();
        return stripped;
    }

    // -----------------------------------------------
    // Init
    // -----------------------------------------------

    document.addEventListener('DOMContentLoaded', function () {
        initBillingToggle();

        fetchPlans().then(function () {
            if (!plans || !plans.length) return;
            updateBillingBadge();
            renderPricingCards();
            renderCalculators();
            renderComparisonTable();
        });
    });
})();
