(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Colour scheme
     Untouched, the site follows the operating system. Once the
     visitor picks a scheme it is remembered for this browser.
     --------------------------------------------------------------- */
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');

  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || systemTheme();
  }

  function label() {
    if (!toggle) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('title', 'Switch to ' + next + ' mode');
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
  }

  if (toggle) {
    label();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
      label();
    });
  }

  // Follow the system while the visitor has not made a choice.
  if (window.matchMedia) {
    var query = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () {
      if (!root.hasAttribute('data-theme')) label();
    };
    if (query.addEventListener) query.addEventListener('change', onChange);
    else if (query.addListener) query.addListener(onChange);
  }

  /* ---------------------------------------------------------------
     Links in the page content open in a new tab (the header's
     navigation still moves between pages in place).
     --------------------------------------------------------------- */
  var content = document.querySelector('.page-shell');
  if (content) {
    [].forEach.call(content.querySelectorAll('a[href]'), function (a) {
      if (a.getAttribute('href').charAt(0) === '#') return; // in-page anchors
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  /* ---------------------------------------------------------------
     Page changes
     Fade the content out before following an internal link; the next
     page fades it back in (style.scss). Anything that isn't a plain
     same-site navigation -- new tabs, downloads, in-page anchors,
     modifier clicks -- is left alone.
     --------------------------------------------------------------- */
  var shell = document.querySelector('.page-shell');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (shell && !reduceMotion) {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var link = e.target.closest && e.target.closest('a[href]');
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;

      var url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page / anchor

      e.preventDefault();
      shell.classList.add('is-leaving');
      window.setTimeout(function () { location.href = url.href; }, 140);
    });

    // Coming back via the back button restores the page from cache mid-fade
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) shell.classList.remove('is-leaving');
    });
  }

  /* ---------------------------------------------------------------
     Small-screen navigation
     --------------------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
  }
})();
