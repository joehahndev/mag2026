/**
 * @file
 * mag2026.js — vanilla replacements for the Bootstrap JavaScript the classic
 * theme relied on.
 *
 * The classic mag2 theme pulled in Bootstrap 3's JS (for the navbar collapse
 * and menu dropdowns), jQuery.matchHeight (equal-height story tiles) and
 * ekko-lightbox (image lightbox) — all from CDNs. This file reimplements just
 * those behaviours with plain DOM APIs and Drupal's behaviour/once system, so
 * the theme ships no third-party JS.
 */
(function (Drupal, once) {
  'use strict';

  /**
   * Navbar collapse toggle (replaces Bootstrap collapse).
   *
   * A [data-toggle="collapse"] button shows/hides its [data-target] element by
   * toggling the `in` class — the same hook the classic markup and CSS use.
   */
  Drupal.behaviors.mag2026Collapse = {
    attach: function (context) {
      once('mag2026-collapse', '[data-toggle="collapse"]', context).forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var target = document.querySelector(btn.getAttribute('data-target'));
          if (target) {
            target.classList.toggle('in');
          }
        });
      });
    }
  };

  /**
   * Menu dropdowns (replaces Bootstrap dropdown).
   *
   * On click, toggle `.open` on the parent .dropdown and close any siblings.
   * On wide viewports CSS :hover also opens them; preventing default stops the
   * placeholder href="/" on the toggle links from navigating.
   */
  Drupal.behaviors.mag2026Dropdown = {
    attach: function (context) {
      once('mag2026-dropdown', '.dropdown-toggle', context).forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
          e.preventDefault();
          var parent = toggle.closest('.dropdown');
          if (!parent) {
            return;
          }
          var isOpen = parent.classList.contains('open');
          closeAllDropdowns();
          if (!isOpen) {
            parent.classList.add('open');
          }
        });
      });

      // Close dropdowns when clicking outside of one.
      once('mag2026-dropdown-doc', 'html').forEach(function (html) {
        html.addEventListener('click', function (e) {
          if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
          }
        });
      });
    }
  };

  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown.open').forEach(function (d) {
      d.classList.remove('open');
    });
  }

  /**
   * Equal-height tiles (replaces jQuery.matchHeight).
   *
   * Matches the tallest tile within each listing so grid rows line up. Only
   * runs at >= 700px, mirroring the classic behaviour; recomputes on resize.
   */
  Drupal.behaviors.mag2026EqualHeight = {
    attach: function (context) {
      var selectors = [
        '.view-mag-back-issues .int-wrap',
        '.view-taxonomy-term .int-wrap',
        '.view-mag-homepage-stories-2 .int-wrap'
      ];

      function equalize() {
        var wide = window.innerWidth >= 700;
        selectors.forEach(function (selector) {
          var tiles = document.querySelectorAll(selector);
          if (!tiles.length) {
            return;
          }
          var max = 0;
          tiles.forEach(function (t) { t.style.height = ''; });
          if (!wide) {
            return;
          }
          tiles.forEach(function (t) { max = Math.max(max, t.offsetHeight); });
          tiles.forEach(function (t) { t.style.height = max + 'px'; });
        });
      }

      once('mag2026-equalheight', 'body', context).forEach(function () {
        window.addEventListener('resize', equalize);
        window.addEventListener('load', equalize);
      });
      equalize();
    }
  };

  /**
   * Minimal image lightbox (replaces ekko-lightbox).
   *
   * Clicking a [data-toggle="lightbox"] link opens its target image in a
   * full-screen overlay. Click anywhere or press Escape to close.
   */
  Drupal.behaviors.mag2026Lightbox = {
    attach: function (context) {
      once('mag2026-lightbox', '[data-toggle="lightbox"]', context).forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          openLightbox(link.getAttribute('href'));
        });
      });
    }
  };

  function openLightbox(src) {
    if (!src) {
      return;
    }
    var overlay = document.createElement('div');
    overlay.className = 'mag2026-lightbox';
    var img = document.createElement('img');
    img.src = src;
    img.alt = '';
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    function close() {
      overlay.remove();
      document.removeEventListener('keyup', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        close();
      }
    }
    overlay.addEventListener('click', close);
    document.addEventListener('keyup', onKey);
  }

})(Drupal, once);
