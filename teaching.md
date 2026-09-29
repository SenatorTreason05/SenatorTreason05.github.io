---
title: Teaching
permalink: /teaching/
---

<header class="page-heading">
  <p class="eyebrow">Teaching</p>
  <h1>Teaching and course support</h1>
  <p class="lede">Courses, sections, tutoring, and materials I have helped develop.</p>
</header>

<div class="stack-list">
{% for item in site.data.teaching %}
<article class="list-card">
  <div class="list-card-meta">{{ item.term }} · {{ item.role }}</div>
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
