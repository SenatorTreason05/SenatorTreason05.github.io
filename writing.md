---
title: Writing
permalink: /writing/
---

<header class="page-heading">
  <p class="eyebrow">Writing</p>
  <h1>Short expository pieces</h1>
  <p class="lede">Notes on mathematics I am learning, proofs I want to remember, and occasional longer explanations.</p>
</header>

{% if site.posts.size > 0 %}
<div class="stack-list compact">
  {% for post in site.posts %}
  <article class="list-card">
    <div class="list-card-meta">{{ post.date | date: "%B %-d, %Y" }}</div>
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    {% if post.excerpt %}<p>{{ post.excerpt | strip_html | truncate: 180 }}</p>{% endif %}
  </article>
  {% endfor %}
</div>
{% else %}
<p>No posts yet.</p>
{% endif %}
