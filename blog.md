---
layout: page
permalink: /blog/
title: Blog posts
---

<div id="facets" class="hidden">
  <div class="facet" id="tags">
    <strong>Tags</strong>
    <ul></ul>
  </div>
  </div>
<!-- <input id="ft-search" type="search" placeholder="Search by title or tags..." /> -->

<div class="post-list">
  {% for post in site.posts %}
    {% assign currentdate = post.date | date: "%Y" %}
    {% if currentdate != date %}
      <h2 id="y{{ currentdate }}" class="year">{{ currentdate }}</h2>
      {% assign date = currentdate %}
    {% endif %}

    <div class="post-block">
      <h3>
        <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </h3>
      <span class="post-meta" title="{{ post.date | date: "%b %-d Y" }}">{{ post.date | date: "%b %-d" }} <span class="meta-year">{{ currentdate }}</span></span>
      {% if post.description %}<p class="post-subtitle">{{ post.description }}</p>{% endif %}
    </div>
  {% endfor %}
</div>


<script>
  {% include itemsjs.min.js %}
  {% include postfilter.js %}
</script>