---
layout: page
permalink: /blog/
title: Blog posts
---

<div id="posts-container">
  {% assign postyears = site.posts | group_by:"date" | reverse %}
  {% for year in postyears %}
    <h2 id="y{{ year.name }}" class="year">{{ year.name }}</h2>
    {% for post in year.items %}
      {% include blog-item-categorization.html post=post %}
    {% endfor %}
  {% endfor %}
</div>