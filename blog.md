---
layout: page
permalink: /blog/
title: Blog posts
---

<!-- TAG FILTER BAR -->
<div class="tags">
  <a href="{{ page.url | relative_url }}">All</a>
  {% assign all_tags = site.tags | sort %}
  {% for tag in all_tags %}
    <a href="{{ page.url | relative_url }}?tag={{ tag[0] | escape }}">
      {{ tag[0] }}
    </a>
  {% endfor %}
</div>

<hr>

<!-- POSTS LIST -->
<div class="post-list">
  {% assign date = nil %}

  {% for post in site.posts %}
    {% assign currentdate = post.date | date: "%Y" %}

    {% if currentdate != date %}
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

<script>
  const params = new URLSearchParams(window.location.search);
  const tag = params.get("tag");
  if (tag) {
    const posts = document.querySelectorAll(".post-item");
    posts.forEach(p => {
      if (!p.getAttribute("data-tags").includes(tag)) {
        p.style.display = "none";
      }
    });

    // Highlight active tag link
    document.querySelectorAll(".tags a").forEach(a => {
      if (a.href.includes(`tag=${tag}`)) {
        a.classList.add("active");
      }
    });
  }
</script>
