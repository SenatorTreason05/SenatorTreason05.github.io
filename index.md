---
permalink: /
---

<p class="intro-line">{{ site.role }}{% if site.affiliation != "" %} @ {{ site.affiliation }}{% endif %}</p>

<h2 class="block-title">Research Interests</h2>

<ul class="interests">
  <li>
    <a href="https://www.mathematik.uni-konstanz.de/working-group-real-geometry-and-algebra/research/invitation-to-nonlinear-algebra/">Nonlinear algebra</a>:
    <a href="https://arxiv.org/abs/2211.16467">causal representation learning</a>,
    <a href="https://arxiv.org/abs/2409.01356">real algebraic geometry</a>, and
    <a href="https://arxiv.org/abs/2411.14080">algebraic statistics</a>
  </li>

  <li>
    <a href="https://dash.harvard.edu/entities/publication/73120379-47fa-6bd4-e053-0100007fdf3b">Enumerative geometry</a>:
    <a href="https://arxiv.org/abs/math/0302294">the geometric Littlewood–Richardson rule</a> and
    <a href="https://arxiv.org/abs/2108.07905">Galois/monodromy groups</a>
  </li>
</ul>

<div class="bio-grid">
  <aside class="bio-aside">
    {% if site.portrait != "" %}
      <img class="portrait" src="{{ site.portrait | relative_url }}" alt="{{ site.name }}">
    {% else %}
      <div class="monogram" aria-hidden="true">{% assign name_parts = site.name | split: " " %}{% for part in name_parts %}{{ part | slice: 0 }}{% endfor %}</div>
    {% endif %}

    <ul class="side-links">
      <li>{{ site.email }}</li>
      <!-- {% if site.linkedin_url != "" %}<li><a href="{{ site.linkedin_url }}">LinkedIn</a></li>{% endif %} -->
      {% if site.location != "" %}<li>{{ site.location }}</li>{% endif %}
    </ul>
  </aside>

  <div class="bio-body">
    <h2 class="block-title">Bio{% if site.show_cv %} (<a href="{{ site.cv_path | relative_url }}">CV</a>){% endif %}</h2>

    <p>
      I’m a senior undergraduate at Harvard University studying math and physics. I first fell in love with math while teaching, and I haven’t looked back since! I’m broadly interested in studying how geometric structure governs the behavior of solutions to algebraic systems.
    </p>

    <p>
      I'm currently working on methods for multi-modal causal representation learning from perfect interventions and investigating the real algebraic geometry of determinantal varieties in Prof. <a href="https://seigal.github.io/">Anna Seigal</a>'s group. I'm also completing my senior thesis advised by Prof. <a href="https://www.math.harvard.edu/people/harris-joe/">Joe Harris</a>, studying how solutions to incidence problems on orthogonal Grassmannians degenerate as geometric conditions vary.
    </p>

    <p>
      In my daily life, I run the <a href="https://soco.college.harvard.edu/257861/home/">Harvard Fencing Club</a> and I'm an avid chess enthusiast (<a href="https://www.chess.com/member/ruthlessmorse">challenge me!</a>). I'm enjoying volunteering as a teacher at the <a href="https://www.cambridgemathcircle.org/">Cambridge Math Circle</a>, and doing a directed reading on <a href="https://sites.math.washington.edu/~jarod/moduli.pdf">algebraic stacks</a>. To wind down, I like watching movies, eating food, biking, and spending time with loved ones.
    </p>
  </div>
</div>
