---
title: Notes
permalink: /notes/
---

<header class="page-heading">
  <p class="eyebrow">Notes</p>
  <h1>Mathematical notes and resources</h1>
  <p class="lede">These are working documents: useful, but not necessarily polished or error-free.</p>
</header>

<div class="stack-list compact">
{% for note in site.data.notes %}
<article class="list-card">
  {% if note.term != "" %}<div class="list-card-meta">{{ note.term }}</div>{% endif %}
  <h2>{{ note.title }}</h2>
  <p>{{ note.description }}</p>
  <a href="{{ note.url }}">Open notes →</a>
</article>
{% endfor %}
</div>

### Adding a new set of notes

1. Put the PDF in `assets/files/`.
2. Open `_data/notes.yml`.
3. Add a new entry and set its URL to `/assets/files/your-file.pdf`.
