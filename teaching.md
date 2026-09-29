---
title: Teaching &amp; Notes
permalink: /teaching/
---

<!-- <header class="page-heading">
  <h1>Research</h1>

  <p class="research-quote">
    “Algebra is but written geometry, and geometry is but figured algebra.”
    <span>— Sophie Germain</span>
  </p>
</header> -->

<div class="teaching-layout">
<div class="teaching-main">

<h2 class="section-title">Teaching</h2>

<div class="stack-list full-width">
{% for item in site.data.teaching %}
<article class="list-card">
  <div class="list-card-meta">{{ item.term }}</div>
  <h2>{{ item.course }}</h2>
  <p>{{ item.description }}</p>
  {% if item.links.size > 0 %}
  <div class="inline-links">
    {% for link in item.links %}<a href="{{ link.url }}">{{ link.label }} →</a>{% endfor %}
  </div>
  {% endif %}
</article>
{% endfor %}
</div>

<h2 class="section-title">Notes</h2>

<!-- <p class="section-note">These are working documents: useful, but not necessarily polished or error-free.</p> -->

<div class="stack-list compact full-width">
{% for note in site.data.notes %}
<article class="list-card">
  {% if note.term != "" %}<div class="list-card-meta">{{ note.term }}</div>{% endif %}
  <h2>{{ note.title }}</h2>
  <p>{{ note.description }}</p>
  <a href="{{ note.url | relative_url }}" target="_blank" rel="noopener">Open notes →</a>
</article>
{% endfor %}
</div>

</div>

<!-- Right-hand column: Game of Life and a fractal explorer, pinned while the
     page scrolls. Behaviour is in assets/js/teaching-toys.js; hidden without
     JavaScript. -->
<aside class="teaching-aside" aria-label="Mathematical toys" hidden>

  <!-- <section class="corner-card" id="toy-life">
    <p class="list-card-meta">Conway's Game of Life</p>
    <canvas class="toy-canvas" style="aspect-ratio: 26 / 14" aria-label="Game of Life grid; click or drag to toggle cells"></canvas>
    <div class="toy-controls">
      <button class="corner-button" type="button" data-life="run">Run</button>
      <button class="corner-button" type="button" data-life="step">Step</button>
      <button class="corner-button" type="button" data-life="random">Random</button>
      <button class="corner-button" type="button" data-life="clear">Clear</button>
    </div>
    <p class="toy-note">Each cell counts its eight neighbours: three bring it to life, and two or three keep it alive. Courtesy of MATH 118R — Dynamical Systems.</p>
  </section> -->

  <section class="corner-card" id="toy-fractal">
    <p class="list-card-meta">Fractal explorer  (Click to zoom)</p>
    <canvas class="toy-canvas" style="aspect-ratio: 16 / 10" aria-label="Fractal; click to zoom in, shift-click or right-click to zoom out"></canvas>
    <div class="toy-controls">
      <button class="corner-button is-on" type="button" data-fractal="mandelbrot">Mandelbrot</button>
      <button class="corner-button" type="button" data-fractal="julia">Julia</button>
      <button class="corner-button" type="button" data-fractal="out">Zoom out</button>
      <button class="corner-button" type="button" data-fractal="reset">Reset</button>
    </div>
    <p class="toy-readout" data-fractal-readout></p>
    <p class="toy-note">The Mandelbrot set is every $c$ for which $z \mapsto z^2 + c$, started at $0$, stays bounded. A Julia set fixes $c$ and varies the start. I learned about these in MATH 271Z — Complex Dynamics. </p>
  </section>

</aside>
</div>

<script src="{{ '/assets/js/teaching-toys.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>

