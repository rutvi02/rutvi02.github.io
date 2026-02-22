# Website [![Build Status](https://travis-ci.org/domoritz/domoritz.github.io.svg?branch=master)](https://travis-ci.org/domoritz/domoritz.github.io)

## Customizing the design

All design tokens (colors, spacing, fonts, shadows, border radius) live in **`styles.scss`** at the top of the file. Change those variables to update the look site-wide without editing individual SCSS partials. Page-specific styles are in **`_sass/`**: `_home.scss`, `_blog.scss`, `_nav.scss`, `_footer.scss`, etc.

## Write

```
bundle exec jekyll post "My New Post"
```

## Run

```
bundle exec jekyll serve --livereload
```

## Run with Docker

```
docker run \
  --volume="$PWD:/srv/jekyll" \
  -p 4000:4000 -p 35729:35729 \
  -it jekyll/jekyll \
  jekyll serve --livereload
```
