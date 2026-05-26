# Tech Cop

An interactive CSS presentation deck showcasing modern, production-ready CSS features — with live code editors on every slide.

## About

Tech Cop is a scrollable slide deck built for presenting (or exploring) the CSS features that are ready to use in production today. Each slide pairs a live [CodeMirror](https://codemirror.net/) editor with a scoped demo area — edit the CSS and see your changes instantly, isolated to that slide.

The deck covers features tracked by the [Baseline](https://web.dev/baseline) initiative and the [Interop 2026](https://web.dev/blog/interop-2026) program.

## Features

- Scroll-snapped full-screen slides
- Live CSS editing per slide (CodeMirror)
- Scoped styles — edits in one slide don't affect others
- Dark theme with gradient accents
- Auto-deploys to GitHub Pages on push to `main`

## Topics Covered

| Category | Features |
|---|---|
| **Selectors** | `:not()`, `:has()`, `:nth-child(n of .sel)`, `:empty`, `:focus-visible`, `:user-valid`, `:is()` / `:where()` |
| **Layout** | Logical properties, `aspect-ratio`, `fit-content()`, `min()` / `max()` / `clamp()`, dynamic viewport units |
| **Typography** | `text-wrap`, text measurement functions |
| **Color & Visuals** | `color-mix()`, `mask-image`, `backdrop-filter`, `color-scheme`, `caret-color` |
| **Transitions** | `transition-behavior`, `@starting-style` |
| **Container Queries** | `@container`, container-based responsive design |
| **Advanced at-rules** | `@layer`, `@scope`, `@property`, `@starting-style` |

## Getting Started

**Prerequisites:** Node.js

```bash
npm install       # install dependencies
npm start         # dev server at http://localhost:8080 with live reload
npm run build     # build to _site/
```

## Adding a Slide

1. Create `slides/your-property-name.html` following the existing pattern (`.code > textarea` + `.demo`)
2. Add `{% include "your-property-name.html" %}` inside `.deck` in `src/index.html`

See `CLAUDE.md` for a full architecture overview.

## Stack

- [Eleventy 3](https://www.11ty.dev/) — static site generator
- [Nunjucks](https://mozilla.github.io/nunjucks/) — templating
- [CodeMirror 5](https://codemirror.net/5/) — in-browser code editor (via CDN)
- GitHub Actions + GitHub Pages — CI/CD
