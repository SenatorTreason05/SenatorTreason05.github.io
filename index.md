---
title: Home
permalink: /
---

<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">{{ site.role }}{% if site.affiliation %} · {{ site.affiliation }}{% endif %}</p>
    <h1>{{ site.name }}</h1>
    <p class="hero-tagline">{{ site.tagline }}</p>
    <p class="hero-intro">
      I am interested in mathematical problems where geometry, algebra, and combinatorics interact.
      This site collects my research, notes, teaching materials, and occasional expository writing.
    </p>
    <div class="hero-actions">
      <a class="button" href="{{ '/research/' | relative_url }}">Research</a>
      <a class="button button-secondary" href="{{ '/notes/' | relative_url }}">Notes</a>
      {% if site.show_cv %}<a class="text-link" href="{{ site.cv_path | relative_url }}">Download CV →</a>{% endif %}
    </div>
  </div>

  <aside class="profile-card" aria-label="Profile details">
    <div class="monogram" aria-hidden="true">YN</div>
    <dl>
      <div><dt>Affiliation</dt><dd>{{ site.affiliation }}</dd></div>
      {% if site.location != "" %}<div><dt>Location</dt><dd>{{ site.location }}</dd></div>{% endif %}
      <div><dt>Email</dt><dd><a href="mailto:{{ site.email }}">{{ site.email }}</a></dd></div>
      <div><dt>GitHub</dt><dd><a href="https://github.com/{{ site.github_username }}">@{{ site.github_username }}</a></dd></div>
    </dl>
  </aside>
</section>

<section class="section-block puzzle-section" aria-labelledby="daily-puzzle-title">
  <div class="puzzle-copy">
    <p class="eyebrow">Chess</p>
    <h2 id="daily-puzzle-title">Puzzle of the day</h2>
    <p class="puzzle-description">
      A small daily diversion, courtesy of Lichess. Make your move directly on the board.
    </p>

    <div class="puzzle-meta" id="lichess-puzzle-meta" aria-live="polite">
      <span class="puzzle-chip">Daily Lichess puzzle</span>
    </div>

    <a
      id="lichess-puzzle-link"
      class="text-link"
      href="https://lichess.org/training/daily"
      target="_blank"
      rel="noopener noreferrer"
    >Open on Lichess →</a>
  </div>

  <div class="puzzle-frame-wrap">
    <iframe
      class="lichess-puzzle-frame"
      src="https://lichess.org/training/frame?theme=blue&bg=light&pieceSet=cburnett"
      title="Lichess daily chess puzzle"
      loading="lazy"
      frameborder="0"
    ></iframe>
  </div>
</section>

<section class="section-block">
  <div class="section-heading">
    <p class="eyebrow">Current work</p>
    <h2>Research</h2>
  </div>
  <div class="card-grid">
    {% for project in site.data.research limit:2 %}
      <article class="card">
        <div class="card-topline"><span>{{ project.status }}</span></div>
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        {% if project.links.size > 0 %}
          <div class="inline-links">
            {% for link in project.links %}<a href="{{ link.url }}">{{ link.label }} →</a>{% endfor %}
          </div>
        {% endif %}
      </article>
    {% endfor %}
  </div>
  <p class="section-more"><a href="{{ '/research/' | relative_url }}">All research →</a></p>
</section>

<section class="section-block two-column">
  <div>
    <p class="eyebrow">Resources</p>
    <h2>Notes</h2>
    <p>Course notes, expository write-ups, problem sets, and material I want to keep organized in one place.</p>
    <a class="text-link" href="{{ '/notes/' | relative_url }}">Browse notes →</a>
  </div>
  <div>
    <p class="eyebrow">Exposition</p>
    <h2>Writing</h2>
    <p>Short mathematical explanations, reading notes, and occasional posts about ideas I am learning.</p>
    <a class="text-link" href="{{ '/writing/' | relative_url }}">Read writing →</a>
  </div>
</section>
