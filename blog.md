---
layout: page
permalink: /blog/
title: Blog
---

<div class="blog-intro">
  <h1 class="blog-intro-title">{{ page.title }}</h1>
  <p class="blog-intro-text">Thoughts on AI, anything I find interesting, and life in general.</p>
</div>

<!-- TAG FILTER BAR: multi-select (click to add/remove), "All" clears -->
<nav class="blog-tags" aria-label="Filter posts by category">
  <div class="blog-tags-inner">
    <a class="blog-tag blog-tag-all" href="{{ page.url | relative_url }}">All</a>
    {% assign all_tags = site.tags | sort %}
    {% for tag in all_tags %}
      <a class="blog-tag" href="{{ page.url | relative_url }}?tag={{ tag[0] | url_encode }}" data-tag="{{ tag[0] | escape }}">
        {{ tag[0] }}
      </a>
    {% endfor %}
  </div>
</nav>

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
         data-tags="{{ post.tags | join: '|' }}">
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
    </div>
  {% endfor %}
  </div>
</div>

<script>
  (function () {
    const baseUrl = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    // Dedupe and preserve order (e.g. ?tag=a&tag=a -> ["a"])
    const selectedTags = Array.from(new Set(params.getAll("tag"))).filter(Boolean);
    const postItems = document.querySelectorAll(".post-item");
    const yearGroups = document.querySelectorAll(".year-group");
    const tagLinks = document.querySelectorAll(".blog-tags-inner .blog-tag[data-tag]");

    function normalize(s) { return (s || "").trim().toLowerCase(); }
    function postTagList(el) {
      var raw = (el.getAttribute("data-tags") || "").trim();
      if (!raw) return [];
      return raw.split("|").map(function (s) { return s.trim(); }).filter(Boolean);
    }
    function tagMatches(postTags, selectedTags) {
      if (selectedTags.length === 0) return true;
      var postNorm = postTags.map(normalize);
      return selectedTags.some(function (t) {
        var tn = normalize(t);
        return postNorm.indexOf(tn) !== -1;
      });
    }

    function applyFilter() {
      const tags = selectedTags;
      postItems.forEach(function (p) {
        var postTags = postTagList(p);
        var show = tagMatches(postTags, tags);
        p.style.display = show ? "" : "none";
        if (show) p.classList.remove("hidden-by-filter"); else p.classList.add("hidden-by-filter");
      });
      yearGroups.forEach(function (group) {
        var visible = group.querySelectorAll(".post-item:not(.hidden-by-filter)").length;
        group.style.display = visible === 0 ? "none" : "";
      });
      tagLinks.forEach(function (a) {
        var t = a.getAttribute("data-tag");
        var isActive = tags.some(function (st) { return normalize(st) === normalize(t); });
        if (isActive) a.classList.add("active"); else a.classList.remove("active");
      });
      var allBtn = document.querySelector(".blog-tag-all");
      if (allBtn) allBtn.classList.toggle("active", tags.length === 0);
    }

    applyFilter();

    tagLinks.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var tag = a.getAttribute("data-tag");
        if (!tag) return;
        var tagNorm = normalize(tag);
        var already = selectedTags.some(function (t) { return normalize(t) === tagNorm; });
        var next = already
          ? selectedTags.filter(function (t) { return normalize(t) !== tagNorm; })
          : selectedTags.concat([tag]);
        var query = next.length ? "?" + next.map(function (t) { return "tag=" + encodeURIComponent(t); }).join("&") : "";
        window.location.replace(baseUrl + query);
      });
    });
  })();
</script>
