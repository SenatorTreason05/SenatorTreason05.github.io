---
title: Research
permalink: /research/
---

<header class="page-heading">
  <p class="eyebrow">Research</p>
  <h1>Projects and mathematical interests</h1>
  <p class="lede">A concise record of current projects, working notes, and completed work.</p>
</header>

<div class="stack-list">
{% for project in site.data.research %}
<article class="list-card">
  <div class="list-card-meta">{{ project.status }}</div>
  <h2>{{ project.title }}</h2>
  <p>{{ project.description }}</p>
  {% if project.links.size > 0 %}
  <div class="inline-links">
    {% for link in project.links %}<a href="{{ link.url }}">{{ link.label }} →</a>{% endfor %}
  </div>
  {% endif %}
</article>
{% endfor %}
</div>

## Interests

Edit this section with the areas you actually work in. For example:

- Algebraic geometry
- Enumerative geometry
- Schubert calculus
- Combinatorics and geometry
- Real algebraic geometry

## Papers and preprints

Add citations here as your work becomes public. A simple format is:

**Your Name**, *Title of paper*, with Coauthor Name. Preprint, 2026. [PDF](#) · [arXiv](#)
