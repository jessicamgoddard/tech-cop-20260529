# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start      # dev server with live reload (http://localhost:8080)
npm run build  # build to _site/
```

There are no tests.

## Architecture

This is an interactive CSS property demo tool — a scrollable "deck" of slides, each containing a live CodeMirror editor and a preview area. Editing CSS in a slide immediately applies it to that slide's demo region.

**Build:** Eleventy processes `src/index.html` as a Nunjucks template. The `.eleventy.js` config sets `includes` to `../slides` (relative to `src/`), so slide partials in `slides/` can be pulled in with `{% include "property-name.html" %}`. Static assets (`assets/`) are passed through unchanged to `_site/`.

**Slides:** Each file in `slides/` is a `<section class="slide">` containing:
- `.code > textarea` — initial CSS shown in the editor
- `.demo` — the element(s) the CSS is applied to

**Live editing (`assets/index.js`):** On load, `initSlide` replaces each textarea with a CodeMirror instance and creates a `<style>` tag in `<head>`. The `scopeCSS` function rewrites every CSS selector to be prefixed with `.slide[data-slide="N"] .demo`, scoping edits to that slide's demo only. Changes update the style tag on every editor change event.

**Adding a new slide:** Create `slides/property-name.html` following the existing pattern, then add `{% include "property-name.html" %}` inside the `.deck` in `src/index.html`.
