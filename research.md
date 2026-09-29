---
title: Research
permalink: /research/
---

<header class="page-heading">
  <!-- <h1>Research</h1> -->

  <p class="research-quote">
    “Algebra is but written geometry, and geometry is but figured algebra.”
    <span>— Sophie Germain</span>
  </p>
</header>


<section class="research-section">
  <h2 class="section-heading">Ongoing Projects</h2>

  <div class="stack-list">
  {% for project in site.data.research %}
    {% if project.category == "ongoing" %}
    {% include research-card.html project=project %}
    {% endif %}
  {% endfor %}
  </div>
</section>


<section class="research-section">
  <h2 class="section-heading">Past Projects</h2>

  <div class="stack-list">
  {% for project in site.data.research %}
    {% if project.category == "past" %}
    {% include research-card.html project=project %}
    {% endif %}
  {% endfor %}
  </div>
</section>