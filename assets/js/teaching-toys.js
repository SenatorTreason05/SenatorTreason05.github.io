/* Teaching page, right-hand column: Conway's Game of Life and a
 * Mandelbrot/Julia explorer, drawn on canvas.
 *
 * Colours come from the site's CSS variables and both redraw when the theme
 * or the column width changes, so they follow light/dark mode.
 */
(function () {
  'use strict';

  var aside = document.querySelector('.teaching-aside');
  if (!aside || !window.HTMLCanvasElement) return;
  aside.hidden = false;

  // Tell the CSS how tall the column is, so it can pin it at the window's center
  function measure() { aside.style.setProperty('--aside-h', aside.scrollHeight + 'px'); }
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(measure);
    [aside].concat([].slice.call(aside.children)).forEach(function (el) { ro.observe(el); });
  }
  measure();

  /* ---------- shared helpers ------------------------------------------ */

  function palette() {
    var cs = getComputedStyle(document.documentElement);
    var v = function (name) { return cs.getPropertyValue(name).trim(); };
    return {
      ink: v('--text-strong'), text: v('--text'), quiet: v('--text-quiet'),
      rule: v('--rule'), ruleStrong: v('--rule-strong'), bg: v('--bg'),
      accent: v('--link'), good: v('--good'), bad: v('--bad')
    };
  }

  // Size a canvas to its CSS box at device resolution; returns a drawing context
  function fit(canvas) {
    var w = canvas.clientWidth, h = canvas.clientHeight, dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }

  var redraws = [];
  function redrawAll() { redraws.forEach(function (f) { f(); }); }
  window.addEventListener('resize', redrawAll);
  new MutationObserver(redrawAll).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', redrawAll);
  }

  /* ---------- Game of Life ---------------------------------------------- */

  (function () {
    var card = document.getElementById('toy-life');
    if (!card) return;
    var canvas = card.querySelector('canvas');
    var COLS = 26, ROWS = 14;
    var grid = new Uint8Array(COLS * ROWS);
    var timer = null;
    var runBtn = card.querySelector('[data-life="run"]');

    function at(x, y) { return grid[((y + ROWS) % ROWS) * COLS + ((x + COLS) % COLS)]; }
    function set(x, y, v) { grid[y * COLS + x] = v; }

    function seed() {
      grid.fill(0);
      // two gliders and an R-pentomino
      [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]].forEach(function (c) { set(c[0] + 2, c[1] + 2, 1); });
      [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]].forEach(function (c) { set(c[0] + 5, c[1] + 10, 1); });
      [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]].forEach(function (c) { set(c[0] + 16, c[1] + 7, 1); });
    }

    function step() {
      var next = new Uint8Array(grid.length);
      for (var y = 0; y < ROWS; y++) {
        for (var x = 0; x < COLS; x++) {
          var n = 0;
          for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if (dx || dy) n += at(x + dx, y + dy);
          var alive = grid[y * COLS + x];
          next[y * COLS + x] = (n === 3 || (alive && n === 2)) ? 1 : 0;
        }
      }
      grid = next;
      draw();
    }

    function draw() {
      var c = fit(canvas), ctx = c.ctx, s = c.w / COLS, p = palette();
      ctx.strokeStyle = p.rule;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var x = 0; x <= COLS; x++) { ctx.moveTo(Math.round(x * s) + .5, 0); ctx.lineTo(Math.round(x * s) + .5, c.h); }
      for (var y = 0; y <= ROWS; y++) { ctx.moveTo(0, Math.round(y * s) + .5); ctx.lineTo(c.w, Math.round(y * s) + .5); }
      ctx.stroke();
      ctx.fillStyle = p.ink;
      for (y = 0; y < ROWS; y++) for (x = 0; x < COLS; x++) {
        if (grid[y * COLS + x]) ctx.fillRect(x * s + 1.5, y * s + 1.5, s - 2, s - 2);
      }
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } runBtn.textContent = 'Run'; runBtn.classList.remove('is-on'); }

    runBtn.addEventListener('click', function () {
      if (timer) return stop();
      timer = setInterval(step, 130);
      runBtn.textContent = 'Pause';
      runBtn.classList.add('is-on');
    });
    card.querySelector('[data-life="step"]').addEventListener('click', function () { stop(); step(); });
    card.querySelector('[data-life="clear"]').addEventListener('click', function () { stop(); grid.fill(0); draw(); });
    card.querySelector('[data-life="random"]').addEventListener('click', function () {
      for (var i = 0; i < grid.length; i++) grid[i] = Math.random() < .28 ? 1 : 0;
      draw();
    });

    // click or drag to paint; the first cell touched decides live or dead
    var painting = null;
    function cellFrom(e) {
      var r = canvas.getBoundingClientRect(), s = r.width / COLS;
      return [Math.min(COLS - 1, Math.floor((e.clientX - r.left) / s)), Math.min(ROWS - 1, Math.floor((e.clientY - r.top) / s))];
    }
    canvas.addEventListener('pointerdown', function (e) {
      var c = cellFrom(e);
      painting = grid[c[1] * COLS + c[0]] ? 0 : 1;
      set(c[0], c[1], painting);
      canvas.setPointerCapture(e.pointerId);
      draw();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (painting === null) return;
      var c = cellFrom(e);
      if (c[0] < 0 || c[1] < 0) return;
      set(c[0], c[1], painting);
      draw();
    });
    ['pointerup', 'pointercancel'].forEach(function (t) { canvas.addEventListener(t, function () { painting = null; }); });

    seed();
    redraws.push(draw);
    draw();
  })();

  /* ---------- Fractal explorer ------------------------------------------ */

  (function () {
    var card = document.getElementById('toy-fractal');
    if (!card) return;
    var canvas = card.querySelector('canvas');
    var readout = card.querySelector('[data-fractal-readout]');
    var HOME = { mandelbrot: { x: -0.6, y: 0, w: 3.2 }, julia: { x: 0, y: 0, w: 3.4 } };
    var DEFAULT_C = { x: -0.8, y: 0.156 };   // a classic, dendritic Julia set
    var mode = 'mandelbrot';
    var view = Object.assign({}, HOME.mandelbrot);
    var c = Object.assign({}, DEFAULT_C);
    var job = 0;   // bumped on every render, so a stale render stops

    function rgb(color) {
      var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
      if (!m) return [128, 128, 128];
      var h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
      return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); });
    }

    function fmt(v) { return (v < 0 ? '−' : '') + Math.abs(v).toFixed(4); }
    function complex(x, y) { return fmt(x) + (y < 0 ? ' − ' : ' + ') + Math.abs(y).toFixed(4) + 'i'; }

    function render() {
      var id = ++job;
      var dpr = window.devicePixelRatio || 1;
      var W = Math.round(canvas.clientWidth * dpr), H = Math.round(canvas.clientHeight * dpr);
      if (!W || !H) return;
      canvas.width = W; canvas.height = H;
      var ctx = canvas.getContext('2d');
      var img = ctx.createImageData(W, H), px = img.data;
      var p = palette(), bg = rgb(p.bg), accent = rgb(p.accent), ink = rgb(p.ink);
      var zoom = HOME[mode].w / view.w;
      var maxIter = Math.round(120 + 60 * Math.log2(Math.max(1, zoom)));
      var scale = view.w / W, x0 = view.x - view.w / 2, y0 = view.y + (H * scale) / 2;
      var LN2 = Math.log(2);

      function row(j) {
        var ci = y0 - j * scale;
        for (var i = 0; i < W; i++) {
          var cr = x0 + i * scale, zr, zi, kr, ki;
          if (mode === 'mandelbrot') { zr = 0; zi = 0; kr = cr; ki = ci; }
          else { zr = cr; zi = ci; kr = c.x; ki = c.y; }
          var n = 0, r2 = 0;
          while (n < maxIter && (r2 = zr * zr + zi * zi) <= 64) {
            var t = zr * zr - zi * zi + kr;
            zi = 2 * zr * zi + ki; zr = t; n++;
          }
          var o = (j * W + i) * 4, col;
          if (n >= maxIter) col = ink;
          else {
            // smooth escape time, eased so the background stays quiet away from the set
            var mu = n + 1 - Math.log(Math.log(r2) / 2 / LN2) / LN2;
            var f = 1 - Math.exp(-Math.max(0, mu) / 18);
            col = [0, 1, 2].map(function (k) { return bg[k] + (accent[k] - bg[k]) * f; });
          }
          px[o] = col[0]; px[o + 1] = col[1]; px[o + 2] = col[2]; px[o + 3] = 255;
        }
      }

      // draw in strips so zooming never freezes the page
      var j = 0, STRIP = 24;
      (function chunk() {
        if (id !== job) return;
        var end = Math.min(H, j + STRIP);
        for (; j < end; j++) row(j);
        ctx.putImageData(img, 0, 0);
        if (j < H) requestAnimationFrame(chunk);
      })();

      readout.textContent = (mode === 'julia' ? 'Julia set, c = ' + complex(c.x, c.y) + ' · ' : 'Center ' + complex(view.x, view.y) + ' · ')
        + (zoom < 10 ? zoom.toFixed(zoom % 1 ? 1 : 0) : Math.round(zoom).toLocaleString()) + '×';
    }

    function setMode(next) {
      if (next === 'julia' && mode === 'mandelbrot') {
        // explore the Julia set of the point you were looking at in the Mandelbrot set
        var atHome = view.w === HOME.mandelbrot.w && view.x === HOME.mandelbrot.x;
        c = atHome ? Object.assign({}, DEFAULT_C) : { x: view.x, y: view.y };
      }
      mode = next;
      view = Object.assign({}, HOME[mode]);
      [].forEach.call(card.querySelectorAll('[data-fractal="mandelbrot"], [data-fractal="julia"]'), function (b) {
        b.classList.toggle('is-on', b.getAttribute('data-fractal') === mode);
      });
      render();
    }

    function zoomAt(e, factor) {
      var r = canvas.getBoundingClientRect();
      var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      var h = view.w * r.height / r.width;
      view.x = view.x - view.w / 2 + fx * view.w;
      view.y = view.y + h / 2 - fy * h;
      view.w *= factor;
      render();
    }

    canvas.addEventListener('click', function (e) { zoomAt(e, e.shiftKey ? 2 : 0.5); });
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); zoomAt(e, 2); });
    card.querySelector('[data-fractal="mandelbrot"]').addEventListener('click', function () { setMode('mandelbrot'); });
    card.querySelector('[data-fractal="julia"]').addEventListener('click', function () { setMode('julia'); });
    card.querySelector('[data-fractal="out"]').addEventListener('click', function () {
      view.w = Math.min(view.w * 2, HOME[mode].w);
      if (view.w === HOME[mode].w) { view.x = HOME[mode].x; view.y = HOME[mode].y; }
      render();
    });
    card.querySelector('[data-fractal="reset"]').addEventListener('click', function () {
      if (mode === 'julia') c = Object.assign({}, DEFAULT_C);
      view = Object.assign({}, HOME[mode]);
      render();
    });

    redraws.push(render);
    render();
  })();

})();
