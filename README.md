# Personal Jekyll Site

A minimal academic personal website built with Jekyll and designed for GitHub Pages.

## Edit these first

Open `_config.yml` and replace:

- `YOUR NAME`
- `YOUR_GITHUB_USERNAME`
- `your.email@example.com`
- `Your University`
- the role/tagline/description fields

Then open `index.md` and replace the short biography paragraph.

Also edit:

- `_data/research.yml`
- `_data/notes.yml`
- `_data/teaching.yml`
- `research.md` interests/publications section

The round `YN` monogram on the home page is in `index.md`; replace it with your initials.

## Add a CV

1. Put your CV at `assets/files/cv.pdf`.
2. In `_config.yml`, change `show_cv: false` to `show_cv: true`.

## Add PDFs / notes

Put PDFs inside `assets/files/`, then point to them from `_data/notes.yml` or any Markdown page.

## Add a blog/writing post

Create `_posts/YYYY-MM-DD-title.md` with:

```yaml
---
title: "Post title"
excerpt: "One-sentence summary."
---
```

Then write normal Markdown underneath it. MathJax is already enabled, so `$x^2$` and display equations work.

## Run locally (optional)

Install Ruby and Bundler, then:

```bash
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`.

## Deploy

This repository includes `.github/workflows/jekyll.yml`.

On GitHub, go to:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

Every push to `main` will build and publish the site.
