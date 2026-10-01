# Personal Jekyll Site

A minimal academic personal website built with Jekyll and designed for GitHub Pages.
The layout follows the plain, wide-measure style of an academic homepage: your name set
large, a small uppercase nav, then research interests and a bio beside a portrait. No
rules, no boxes. It ships with light and dark colour schemes.

Pages: **Home**, **Research**, **Teaching/Notes**, **Fun** (chess puzzles).

There is no footer and no filler: each page is exactly as tall as its content, and the
home page fits in a laptop viewport without scrolling.

## Edit these first

Open `_config.yml` and check:

- `name` / `title` / `short_name` — how your name appears in the header and tab
- `role` and `affiliation` — these combine into the line under your name
- `email` — shown as plain text, not a `mailto:` link, so bots do not harvest it
- `linkedin_url` — leave `""` to drop the link from the home page
- `url` — set this to `https://YOUR_GITHUB_USERNAME.github.io` before deploying

Then open `index.md` and replace the two bio paragraphs.

Also edit:

- `_data/research.yml` — the Research page
- `_data/teaching.yml` and `_data/notes.yml` — the two halves of the Teaching page
- `research.md` interests/publications section

## Add a picture

1. Put the image in `assets/images/` — say `assets/images/portrait.jpg`.
2. Point `portrait:` in `_config.yml` at it:

   ```yaml
   portrait: "/assets/images/portrait.jpg"
   ```

   The path starts with `/` and is relative to the site root, not to this file.

Leave `portrait: ""` and the home page falls back to a framed placeholder showing your
initials, taken from `name:`.

A **portrait-orientation** image works best, since it sits in a narrow column about 200px
wide. Roughly 2:3 (for example 640×960) fills that column exactly. Anything wider gets
scaled down to fit and will look short and stubby. Save it at about twice its display size
so it stays sharp on high-density screens, and keep it under a few hundred KB.

To use a photo elsewhere in a page, the same path works in Markdown:

```markdown
![Description of the picture](/assets/images/something.jpg)
```

Strip EXIF before publishing anything from a phone — photos often carry GPS coordinates.
Re-saving through almost any image editor drops it.

## Add a CV

The `(CV)` link beside the Bio heading is already switched on, so **it currently points at a
file that does not exist**. Drop the PDF at `assets/files/cv.pdf` and it starts working —
no config change needed. To hide the link until then, set `show_cv: false` in `_config.yml`.

## Add PDFs / notes

Put PDFs inside `assets/files/`, then point to them from `_data/notes.yml` or any Markdown
page. MathJax is enabled site-wide, so `$x^2$` and display equations work in any page.

## Fun page

`/fun/` pulls puzzles straight from the public [Lichess puzzle API](https://lichess.org/api#tag/Puzzles)
in the visitor's browser — no account, no key, and nothing to keep in sync. The board in
`assets/js/chess-puzzle.js` is built from the FEN that Lichess returns, and moves are
checked against the puzzle's own solution rather than by a rules engine, so there is no
chess library to load.

Two things worth knowing if you change it:

- `/api/puzzle/next` does **not** return a `fen`, unlike `/api/puzzle/daily` and
  `/api/puzzle/{id}`. The chosen puzzle is fetched a second time by id to get a position.
- Lichess returns **429** if you call it in a burst, so the search for a hard puzzle is
  capped at three attempts spaced about a second apart.

`puzzle_min_rating` in `_config.yml` sets the rating the "Harder puzzle" button aims for.

The board uses Chessground's own brown theme. Note that its three stylesheets are loaded
**before** `style.css` in `_includes/head.html`: `chessground.base.css` sets
`background-size: cover` on `cg-board`, so anything the site wants to override there has
to come after it. The one override is a dimmed board colour for the dark scheme — the
theme derives its dark squares from a fixed SVG overlay, so shifting the single
background colour moves both.

## Colours

The site follows the visitor's operating-system light/dark setting, and the knight in the
header lets them override it (remembered per browser). The knight takes the colour of the
scheme you are in — black on the light page, white on the dark one — and uses the same
glyph as the pieces on the puzzle board. Both palettes are defined at the
top of `assets/css/style.scss` as `light-tokens` and `dark-tokens` — edit those mixins
rather than hunting through the rules.

Type started from joperea.com, which uses futura-pt and proxima-nova (Adobe Fonts
licences a static site cannot serve). The fonts, all loaded from Google Fonts in
`_includes/head.html`, are:

- **Outfit SemiBold**: the name in the header
- **Jost**: nav, subtitle and other display text (the free futura-pt stand-in)
- **IBM Plex Sans Medium**: section labels (Research Interests, Bio, Teaching, ...)
- **Nunito Sans Light**: body text at 16.5px/1.8 (the free proxima-nova stand-in);
  links in running text are SemiBold

Running text on Home, Research and Teaching shares one width, `--measure` in
`assets/css/style.scss`: 45rem, narrowing equally on all three pages in smaller windows.
The canvas is 1200px with 45px gutters.

The page title is written by hand in `_includes/head.html` rather than by jekyll-seo-tag,
which insists on appending the tagline or description to the home page title.

## Run locally

Ruby 3.3 (with MSYS2/DevKit) is installed at `C:\Ruby33-x64`, and the gems live in
`vendor/bundle` inside this repo. To preview the site:

```bash
bundle exec jekyll serve --livereload
```

Then open <http://localhost:4000>. `--livereload` refreshes the browser whenever you save a
file; drop it if you would rather reload by hand. Stop the server with Ctrl+C.

Changes to `_config.yml` are the one exception — Jekyll only reads it at startup, so
restart the server after editing it.

Ruby 3.3 is deliberate: the `github-pages` gem pins an older Jekyll that breaks on Ruby 3.4+,
which dropped `base64` and `csv` from the default gems.

On a fresh clone (or after editing the Gemfile), run `bundle install` first.

Jekyll will suggest adding the `wdm` gem to avoid polling the filesystem on Windows. It is
optional — without it auto-regeneration still works, just with slightly more CPU use.

## Deploy

This repository includes `.github/workflows/jekyll.yml`.

On GitHub, go to:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

Every push to `main` will build and publish the site.
