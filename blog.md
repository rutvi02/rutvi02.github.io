---
layout: page
permalink: /blog/
title: Blog posts
---

<!-- TAG FILTER BAR -->
<nav class="blog-tags" aria-label="Filter posts by category">
  <div class="blog-tags-inner">
    <a class="blog-tag" href="{{ page.url | relative_url }}">All</a>
    {% assign all_tags = site.tags | sort %}
    {% for tag in all_tags %}
      <a class="blog-tag" href="{{ page.url | relative_url }}?tag={{ tag[0] | escape }}">
        {{ tag[0] }}
      </a>
    {% endfor %}
  </div>
</nav>

<hr>

<!-- POSTS LIST -->
<div class="post-list">
  {% assign date = nil %}

  {% for post in site.posts %}
    {% assign currentdate = post.date | date: "%Y" %}

    {% if currentdate != date %}
      {% if date != nil %}
        </div>
      {% endif %}
      <div class="year-group" data-year="{{ currentdate }}">
        <h2 id="y{{ currentdate }}" class="year">{{ currentdate }}</h2>
      {% assign date = currentdate %}
    {% endif %}

    <div class="post-block post-item"
         data-tags="{{ post.tags | join:' ' }}">
      <h3>
        <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </h3>
      <span class="post-meta"
            title="{{ post.date | date: "%b %-d Y" }}">
        {{ post.date | date: "%b %-d" }}
        <span class="meta-year">{{ currentdate }}</span>
      </span>

      {% if post.description %}
        <p class="post-subtitle">{{ post.description }}</p>
      {% endif %}

      {% if post.tags %}
        • Tags:
        {% for tag in post.tags %}
          <span class="tag-item">{{ tag }}</span>{% unless forloop.last %}, {% endunless %}
        {% endfor %}
      {% endif %}
    </div>
  {% endfor %}
  </div>
</div>

<script>
  (function () {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get("tag");
    const postItems = document.querySelectorAll(".post-item");
    const yearGroups = document.querySelectorAll(".year-group");

    if (tag) {
      postItems.forEach(function (p) {
        if (!p.getAttribute("data-tags").includes(tag)) {
          p.style.display = "none";
          p.classList.add("hidden-by-filter");
        }
      });

      // Hide year groups that have no visible posts
      yearGroups.forEach(function (group) {
        var visible = group.querySelectorAll(".post-item:not(.hidden-by-filter)").length;
        if (visible === 0) {
          group.style.display = "none";
        }
      });

      // Highlight active tag link
      document.querySelectorAll(".blog-tags-inner .blog-tag").forEach(function (a) {
        try {
          var linkTag = new URL(a.href).searchParams.get("tag");
          if (linkTag === tag) a.classList.add("active");
        } catch (e) {}
      });
    }
  })();
</script>
