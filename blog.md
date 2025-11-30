---
layout: page
permalink: /blog/
title: Blog posts
---

<!-- {% include search.html %} -->

<!-- <p class="rss-subscribe">Subscribe <a href="{{ "/feed.xml" | absolute_url }}">via RSS</a></p> -->


<div id="facets" class="hidden">
  <div class="facet" id="tags">
    <strong>Tag</strong>
    <ul></ul>
  </div>
</div>

<div class="p1 db">
  <input id="ft-search" type="search" placeholder="Search by keyword..." />
</div>

<p id="clear-filters" class="hidden">
  <i class="fas fa-times-circle" aria-hidden="true"></i> Clear all filters. <span id="count_hidden">X</span> of <span id="count_total">X</span> blog posts are hidden by the filters.
</p>

<div id="posts-container">
  {% assign postyears = site.posts | group_by:"date" | reverse %}
  {% for year in postyears %}
    <h2 id="y{{ year.name }}" class="year">{{ year.name }}</h2>
    {% for post in year.items %}
      {% include blog-item.html post=post %} {% endfor %}
  {% endfor %}
</div>

<script>
  {% include itemsjs.min.js %}
  {% include postfilter.js %}
</script>