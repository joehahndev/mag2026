/**
 * @file
 * script.js — magazine UI behaviours (ported from the classic theme's
 * script1.js).
 *
 * Handles the header search show/hide flow, the "most read / most shared"
 * toggle wiring, exposed-filter relabelling, the search placeholder + clear
 * button, and a couple of legacy content clean-ups. Written with jQuery (loaded
 * via core/jquery) to stay close to the original; the Bootstrap/ekko-lightbox
 * and matchHeight plugins it used to depend on are now handled, without jQuery,
 * in mag2026.js.
 */
(function ($) {
  $(document).ready(function () {

    // Wire up the "most read / most shared" toggle switch (js/toggles.js).
    $('.toggle').toggles({
      text: { on: '', off: '' }
    });

    // Search field placeholder and exposed-filter option relabelling.
    $('#edit-search-api-fulltext').attr('placeholder', 'Search');
    $('#edit-name option:contains("- Any -")').text('- Topic -');
    $('#edit-created option:contains("- Any -")').text('- Year -');

    // Top-stories: default to showing "most read", hide the "most shared"
    // attachment until the toggle is switched.
    $('#block-mag2026-views-block-mag-top-stories-block-1 .attachment').hide();
    $('.toggle').on('toggle', function (e, active) {
      if (active) {
        $('.view-mag-top-stories .mostread').hide();
        $('#block-mag2026-views-block-mag-top-stories-block-1 .attachment').fadeIn();
      } else {
        $('.view-mag-top-stories .mostread').fadeIn();
        $('#block-mag2026-views-block-mag-top-stories-block-1 .attachment').hide();
      }
    });

    // Clear-search "X" button (styled as an SVG via .search-clear in CSS).
    $('.form-item-search-api-fulltext').append('<span id="searchclose" class="search-clear" aria-label="Clear search" role="button"></span>');

    // Header search reveal/hide flow.
    $('#block-mag2026-exposedformmag-search-2page-1').hide();
    $('#showsearch').click(function () {
      $('.mnavcon').hide();
      $('.navlogo').hide();
      $('#block-mag2026-exposedformmag-search-2page-1').fadeIn();
      $('#edit-search-api-fulltext').focus();
    });
    $('#showsearch2').click(function () {
      $('.mnavcon').toggle();
      $('#block-mag2026-exposedformmag-search-2page-1').fadeIn();
      $('#edit-search-api-fulltext').focus();
    });
    $('#searchclose').click(function () {
      $('#block-mag2026-exposedformmag-search-2page-1').hide();
      $('.mnavcon').fadeIn();
      $('.navlogo').fadeIn();
    });
    $(document).keyup(function (e) {
      if (e.keyCode === 27) { // Escape closes the search.
        $('#block-mag2026-exposedformmag-search-2page-1').hide();
        $('.mnavcon').fadeIn();
        $('.navlogo').fadeIn();
      }
    });

    // Strip leftover Drupal 7 [[…]] media/image placeholder syntax from text.
    $('body :not(script)').contents().filter(function () {
      return this.nodeType === 3;
    }).replaceWith(function () {
      return this.nodeValue.replace(/\[\[.+?\]\]/g, '');
    });

    // On magazine-issue pages, wrap each <h2> section of the body so the
    // three-column TOC layout breaks cleanly between sections.
    $('.magazine-issue').each(function () {
      $('.field--type-text-with-summary h2').each(function () {
        $(this).nextUntil('h2').addBack().wrapAll("<div class='wrap1'></div>");
      });
    });

  });
})(jQuery);
