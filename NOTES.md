# Tech Cop — Presenter Notes

Slide order follows 9 thematic sections. Use the live CodeMirror editor on each slide to demonstrate and tweak CSS in real time.

---

## Context

### What is Baseline?

**Key points**
- Baseline is a signal from browser vendors + MDN about whether a feature is safe to use across Chrome, Edge, Firefox, and Safari
- Three tiers: Widely Available (30+ months in all browsers), Newly Available (just landed everywhere), Limited Availability (not yet cross-browser)
- MDN shows the Baseline badge on every CSS property page — right at the top

**For the audience**
- All slides in this deck are Baseline (Newly or Widely Available) — nothing experimental

---

### Interop 2026

**Key points**
- Not a standards proposal process — this is browser vendors *agreeing together* to fix specific interop issues in the same year
- Run by Apple, Google, Igalia, Microsoft, and Mozilla — this is the fifth year of the project
- Focus areas are chosen from developer community submissions
- Track live scores at wpt.fyi/interop-2026

**For the audience**
- Anchor positioning and view transitions are already shipping; several 2026 CSS focus areas will likely reach Baseline this year
- This deck covers scroll snap and container queries — both are active 2026 focus areas

---

## Selectors

### `:not()`

**Key points**
- Widely Available — safe everywhere
- Old `:not()` only accepted a single simple selector: `:not(.foo)` worked, `:not(.foo, .bar)` did not
- Now supports complex selectors and lists: `:not(:is(h1, h2, h3))`, `:not(.selected, [disabled])`

**Compared to old approach**
- Old: `.item { ... }` + `.item.excluded { ... undo styles ... }` — fragile
- New: `.item:not(.excluded) { ... }` — expressive

**Gotchas**
- `:not()` inherits the specificity of its argument, not zero — `:not(.foo)` has `(0,1,0)`

---

### `:is()` / `:where()`

**Key points**
- Widely Available
- Both accept a selector list and match any element that matches any of the arguments
- **The key difference is specificity**: `:is(h1, .title)` takes the specificity of its most specific argument — so `(0,1,0)` because of `.title`. `:where()` always contributes zero specificity

**Compared to old approach**
- Old: `h2 a, h3 a, h4 a { color: hotpink }` — repetitive
- New: `:is(h2, h3, h4) a { color: hotpink }` — DRY

**Demo tip**
- Point out the `.override` class in the demo — it overrides `:where(p)` because `(0,1,0) > (0,0,0)`, but a plain `p {}` rule would not override `:is(p)` if specificity matched

---

### `:has()`

**Key points**
- Widely Available (2024) — the "parent selector" developers wanted for 25 years
- `.card:has(img)` — select cards that contain an image
- Works for siblings too: `h2:has(+ p)` selects an h2 immediately followed by a p
- Child combinator: `a:has(> img)` — direct child only

**Compared to old approach**
- Old: add a class in JavaScript or CMS template logic (`class="card card--has-image"`)
- New: CSS detects content natively

**Gotchas**
- `:has()` inside `:has()` is not supported
- Performance: complex `:has()` selectors can be slow on very large DOMs

---

### `:nth-child(n of .selector)`

**Key points**
- Widely Available
- Old `:nth-child(2)` counted ALL siblings regardless of type or class
- Now you can filter: `li:nth-child(2 of .highlight)` counts only among `.highlight` elements
- `:nth-last-child(1 of .highlight)` targets the *last* matching element

**Compared to old approach**
- Old: add numbered classes in markup (`.item-1`, `.item-2`) or use JavaScript
- New: pure CSS filtering within a sibling set

**Demo tip**
- Change `2 of .highlight` to `1 of .highlight` or `3 of .highlight` in the editor to show selection shifting

---

### `:empty`

**Key points**
- Widely Available
- Matches elements with zero children — including zero text nodes
- Common use: hide empty CMS output fields, style unfilled slots in a grid

**Gotchas**
- `<div> </div>` (with whitespace) is NOT empty — whitespace is a text node
- `<div></div>` and `<div><!-- comment --></div>` ARE empty (comments don't count as nodes in this context)

**Demo tip**
- The third box in the demo has a whitespace-only text node — it does not match `:empty`; good talking point

---

### `:focus-visible`

**Key points**
- Widely Available
- The browser applies `:focus-visible` only when it determines keyboard navigation is in use — not on mouse click
- This is the recommended way to style focus rings now

**Compared to old approach**
- Bad old practice: `* { outline: none }` — removed focus rings for everyone including keyboard users
- Attempted fix: `:focus { outline: none }` + JS `mousedown` handler to add a class — complex
- New: `:focus-visible` handles the distinction automatically

**Demo tip**
- Tab to the button to show the ring; click it to show it doesn't appear — then remove the `:focus-visible` condition to show what `:focus` alone would do

---

### `:user-valid` / `:user-invalid`

**Key points**
- Widely Available (2023)
- `:invalid` fires immediately on page load — before the user has done anything, fields can show red error states
- `:user-valid` / `:user-invalid` only activate after the user has interacted with the field (focused and blurred, or typed)

**Compared to old approach**
- Old: JavaScript `blur` event handler to add a `.touched` class, then style `.touched:invalid`
- New: native CSS, no JavaScript

---

## Cascade & Custom Properties

### `@layer`

**Key points**
- Widely Available (2022)
- Declare layer order once at the top: `@layer base, components, utilities;` — later layers win regardless of selector specificity
- Unlayered styles (no `@layer`) always beat any layered style — important for progressive adoption

**Compared to old approach**
- Old: specificity + source order were the only tools. Third-party libraries with high-specificity selectors required `!important` to override
- New: your `utilities` layer beats a library's `(0,3,0)` selector even with a `(0,0,1)` selector, because layer order wins over specificity

**Demo tip**
- Uncomment the unlayered `p { color: green }` rule at the bottom to show it beats both layers

---

### `@scope`

**Key points**
- Newly Available (Chrome 118+, 2023)
- Scopes styles to a subtree — styles cannot "escape" the root selector
- Proximity wins over specificity: if two `@scope` rules both match, the closer ancestor wins
- Donut scope: `@scope (.card) to (.slot)` — styles apply inside `.card` but stop at `.slot`

**Compared to old approach**
- CSS Modules: `:local`/`:global` achieve similar scoping but require a build tool (webpack/Vite)
- High-specificity parent: `.card h3 { ... }` — works but raises specificity globally
- New: `@scope (.card) { h3 { ... } }` — native, zero build tooling

---

### `@property`

**Key points**
- Widely Available (2024)
- Registers a custom property with a type, initial value, and inheritance flag
- Without it, `--hue: 0deg` is a string — you can't animate strings, so `transition: --hue 0.6s` silently does nothing
- With `syntax: '<angle>'`, the browser knows it's an angle and can interpolate it

**Type options**
- `<color>`, `<angle>`, `<number>`, `<length>`, `<percentage>`, `<integer>`, and more

**What it unlocks**
- Animating color themes, gradient positions, counter values — all in pure CSS
- Type checking: invalid values fall back to `initial-value`

**Demo tip**
- Hover the box to see the hue transition; then remove the `@property` block to show the transition breaks silently

---

## Layout & Sizing

### Logical sizing

**Key points**
- Widely Available
- `inline-size` = width in horizontal writing, height in vertical writing
- `block-size` = height in horizontal writing, width in vertical writing
- `min-inline-size`, `max-block-size`, etc. all follow the same pattern

**Compared to old approach**
- Old: `width` and `height` are physical — they don't adapt to writing mode or direction
- New: logical properties work correctly in RTL and vertical writing modes without overrides

**Demo tip**
- Uncomment `writing-mode: vertical-rl` in the editor — `inline-size: 200px` becomes the height, showing the logical axis flip

---

### Logical spacing

**Key points**
- Widely Available
- `margin-inline: auto` = center horizontally in any writing mode (replaces `margin: 0 auto`)
- `padding-block` = top+bottom padding; `padding-inline` = left+right
- `border-inline-start` = left border in LTR, right border in RTL

**Most useful daily pattern**
- `margin-inline: auto` for centering — works in all writing modes, no physical axis assumption

**Demo tip**
- Uncomment `direction: rtl` to show `border-inline-start` flipping to the right side — physical `border-left` would stay left

---

### `place-*`

**Key points**
- Widely Available
- `place-content: center` = `align-content: center; justify-content: center` (both axes)
- `place-items: center` = `align-items: center; justify-items: center`
- `place-self` for individual grid/flex items
- If one value: applies to both axes. Two values: first = block axis, second = inline axis

**Compared to old approach**
- Old: always had to write two properties
- New: one property for most centering cases

---

### `display: flow-root`

**Key points**
- Widely Available
- Creates a Block Formatting Context (BFC): contains floated children and prevents margin collapsing across the boundary
- Explicit, semantic — no side effects

**Compared to old approach**
- Clearfix hack: `::after { content: ''; display: table; clear: both }` — magic incantation
- `overflow: hidden` — worked as a BFC side effect but clips content
- New: `display: flow-root` says exactly what you mean

**Demo tip**
- Switch `display: flow-root` to `display: block` to show the container collapsing around the float

---

### `aspect-ratio`

**Key points**
- Widely Available (2021)
- Maintains a ratio between width and height — works with any sizing strategy
- `aspect-ratio: 1` for squares, `aspect-ratio: 16 / 9` for video

**Compared to old approach**
- Padding-top hack: `padding-top: 56.25%` on a `position: relative` parent with the content `position: absolute` inside — fragile, unintuitive
- New: `aspect-ratio: 16 / 9` is declarative and works without positioning tricks

---

### `fit-content`

**Key points**
- Widely Available
- Sizes to the content's natural width, up to a maximum
- `width: fit-content` = shrink to content, no maximum
- `width: fit-content(250px)` = shrink to content, capped at 250px

**Compared to old approach**
- `display: inline-block` — shrinks to content but removes block context, changes flow behavior
- `width: max-content` — shrinks to content but no cap; can overflow
- New: `fit-content` keeps block context + caps at a max

**Related intrinsic sizing values**
- `min-content` = narrowest possible without overflow
- `max-content` = full single-line width

---

### `min()`, `max()`, `clamp()`

**Key points**
- Widely Available (2020)
- `min(a, b)` = the smaller value ("at most b" if b is fixed)
- `max(a, b)` = the larger value ("at least b" if b is fixed)
- `clamp(min, preferred, max)` = preferred value, clamped between min and max

**Compared to old approach**
- Fluid typography used to require multiple `@media` breakpoints just to scale font-size
- `clamp(1rem, 2.5vw + 0.5rem, 1.5rem)` replaces 2–3 media queries with one declaration

**Composability**
- These work inside `calc()` and each other: `min(50%, max(200px, 30vw))`
- Critical pattern: `minmax(min(10rem, 100%), 1fr)` in grid — prevents overflow on narrow containers

---

### `round()`, `abs()`, trig functions

**Key points**
- Newly Available (2023–2024)
- `round(value, step)` — snaps to nearest step. `round(2.7rem, 0.5rem)` → `3rem`
- Strategies: `round(nearest, ...)`, `round(up, ...)`, `round(down, ...)`
- `abs(value)` — always positive; useful when a custom property might be negative
- `sign(value)` — returns -1, 0, or 1; useful for direction-aware calc

**Trig functions**
- `sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`, `atan2()`
- Circular layouts: `translate: calc(100px * cos(45deg)) calc(100px * sin(45deg))`

---

### Pattern: center a shrink-wrapped element

**Key points**
- `width: fit-content` + `margin-inline: auto` is the modern centering pattern for content-sized block elements

**Compared to old approach**
- Old: hardcode a `width`, then `margin: 0 auto` — requires knowing the width
- Or: `display: inline-block` on element + `text-align: center` on parent — two elements involved
- New: single element, two properties, no hardcoded width

---

### Pattern: responsive grid, no media queries

**Key points**
- `repeat(auto-fit, minmax(min(10rem, 100%), 1fr))` — items wrap and fill automatically
- `auto-fit` collapses empty tracks (items fill available space)
- `auto-fill` keeps empty tracks (useful when you need alignment with a known column count)
- `min(10rem, 100%)` prevents overflow: if the container is narrower than 10rem, the column is 100%

**Compared to old approach**
- Old: `@media (min-width: 600px) { grid-template-columns: repeat(2, 1fr) }` etc. — multiple breakpoints
- New: zero breakpoints, fully fluid, works at any container width

---

### Viewport units

**Key points**
- Widely Available (2023)
- `dvh` = dynamic — updates as browser UI (address bar, toolbar) shows and hides
- `svh` = small — the viewport when browser UI is fully visible (smallest possible)
- `lvh` = large — the viewport when browser UI is hidden (largest possible)
- `vi` / `vb` = logical inline/block axis equivalents of `vw`/`vh`

**Compared to old approach**
- `100vh` on mobile iOS Safari: toolbar shows/hides as you scroll, causing the viewport height to change and layouts to jump
- Fix was JavaScript `window.innerHeight` — now obsolete for this use case
- New: use `100dvh` for full-height hero sections and app shells on mobile

---

## Typography

### `text-*`

**Key points**
- Widely Available
- `text-decoration` is now a shorthand: line + style + color + thickness in one declaration
- `text-underline-offset` — moves the underline down from the baseline; great for descenders (p, y, g, j)
- `text-decoration-style: wavy` — the squiggly red underline style, useful for error states

**Compared to old approach**
- Old: fake decorative underlines with `::after` pseudo-elements, `border-bottom`, or `background-image` gradients
- New: `text-decoration: underline 2px wavy hotpink` in one line

---

### `hyphens`

**Key points**
- Widely Available
- `hyphens: auto` — browser uses language-aware hyphenation dictionary (requires `lang` attribute on `<html>`)
- `hyphens: manual` — only hyphenates at explicit soft hyphens (`&shy;` / `­`)
- `hyphens: none` — disables all hyphenation

**Gotchas**
- Language matters: `<html lang="en">` is required for `auto` to work
- Combine with `overflow-wrap: break-word` as a fallback for URLs and very long strings

---

### `text-wrap`

**Key points**
- Widely Available (2023–2024)
- `text-wrap: balance` — browser redistributes words across lines to equalize line lengths; ideal for headings and pull quotes
- `text-wrap: pretty` — avoids orphans (single word on last line) in body text; applies multi-line lookahead
- Performance: `balance` has a cost on large blocks; use it on headings, not paragraphs

**Compared to old approach**
- Old: manually insert `<br>` tags or adjust `max-width` by trial and error
- Or: JavaScript libraries that measured and inserted breaks
- New: browser handles it, responds to resize

---

### `font-size-adjust`

**Key points**
- Newly Available (2023)
- Different typefaces have different x-heights — a fallback font at the same `font-size` can look dramatically larger or smaller
- `font-size-adjust: 0.5` scales the fallback to match the primary font's x-height ratio
- `font-size-adjust: from-font` reads the value directly from the font's metrics

**When it matters**
- Web font loading: while the web font loads, the fallback is shown; `font-size-adjust` reduces the visual jump
- Font stacks with mixed x-heights

---

## Color & Visual Effects

### `color-mix()`

**Key points**
- Widely Available (2023)
- `color-mix(in srgb, hotpink 50%, dodgerblue)` — 50/50 mix in sRGB
- The color space changes the result significantly — sRGB can produce muddy or gray midpoints; OkLCH stays perceptually vivid
- Percentage controls the ratio: `color-mix(in oklch, hotpink 25%, dodgerblue)` = 25% pink, 75% blue

**Best practice**
- Use `oklch` for design token tints/shades: `color-mix(in oklch, var(--brand) 80%, white)` for a light tint

**Demo tip**
- Compare the two swatches — sRGB vs OkLCH — to show how the color space changes the midpoint hue

---

### `mask-image`

**Key points**
- Widely Available (needs `-webkit-` prefix — both are shown in the demo)
- Like `clip-path` but pixel-based rather than geometry-based
- Black = visible, white = invisible (opposite of intuition for many developers)
- Most common: gradient mask to fade an image to transparent at edges

**Compared to old approach**
- Old: CSS clip-path for simple shapes, SVG `<clipPath>` for complex shapes, or JavaScript canvas compositing
- New: `mask-image` with gradients handles most fade/reveal use cases natively

**Extras**
- `mask-composite` for combining multiple mask layers
- SVG masks for complex shapes: `mask-image: url(#my-mask)`

---

### `backdrop-filter`

**Key points**
- Widely Available
- Applies graphical filters to the area *behind* an element — frosted glass effect
- The element itself needs a semi-transparent `background` to make the effect visible
- Supports all `filter` functions: `blur()`, `brightness()`, `grayscale()`, `contrast()`, etc.

**Gotchas**
- Performance: creates a compositing layer — can be expensive on low-end devices
- A `transform` on a parent creates a stacking context that clips the backdrop area
- Must have `rgba` or transparent background on the overlay — fully opaque blocks it

---

### `isolation`

**Key points**
- Widely Available
- Creates a stacking context without any visible change to the element
- Primary use: contain `mix-blend-mode` — without `isolation: isolate`, a blended child bleeds through to the page background
- Secondary use: prevent `z-index` from leaking out of a component

**Compared to old approach**
- Old: `position: relative; z-index: 0` creates a stacking context as a side effect — but changes positioning behavior
- Old: `overflow: hidden` also creates a stacking context — but clips content
- New: `isolation: isolate` is explicit and has zero side effects

---

### `color-scheme`

**Key points**
- Widely Available
- System UI controls (inputs, selects, checkboxes, scrollbars) use the OS color scheme by default — they don't automatically follow your dark mode styles
- `color-scheme: dark` tells the browser this element supports dark mode → form controls render in dark
- `color-scheme: light dark` = "I support both; follow the OS preference"

**Compared to old approach**
- Old: override every form control's appearance manually with `appearance: none` + custom styles
- New: `color-scheme` on `:root` gives you system-appropriate controls for free

---

### `caret-color`

**Key points**
- Widely Available
- Controls the color of the text insertion cursor in `<input>`, `<textarea>`, and `contenteditable` elements
- `caret-color: transparent` hides the cursor (niche use cases: custom cursor implementations)
- `caret-color: auto` restores the default

**When to use**
- Brand-colored cursor in search fields or key inputs for a polished detail

---

## Scroll UX

### `scrollbar-gutter`

**Key points**
- Widely Available
- When content overflows and a scrollbar appears, it displaces layout — content shifts inward
- `scrollbar-gutter: stable` reserves the scrollbar space even when the scrollbar is hidden — no layout shift
- `scrollbar-gutter: stable both-edges` mirrors the gutter on both sides for visual symmetry

**Gotchas**
- Overlay scrollbars (default on macOS, all mobile OSes) take no space — `auto` is effectively the same as `stable` there
- Only applies to classic scrollbars (Windows default, or macOS with "Always show scrollbars" preference)

---

### Scroll snap

**Key points**
- Widely Available
- CSS-only carousels, full-page scrolling, and gallery rows without JavaScript
- Two parts: `scroll-snap-type` on the container + `scroll-snap-align` on the children
- `mandatory` — always snaps to the nearest snap point regardless of scroll distance
- `proximity` — only snaps if the scroll position ends close to a snap point

**Adjustments**
- `scroll-padding-top` on container: offset snap point for sticky headers
- `scroll-margin-top` on items: individual item offset
- `scroll-behavior: smooth` for animated scrolling (also affects anchor links)

**Demo tip**
- Change `mandatory` to `proximity` and try stopping mid-scroll to show the behavioral difference

---

## Transitions

### `transition-behavior: allow-discrete`

**Key points**
- Widely Available (2024)
- `display: none` is a "discrete" property — it can't be interpolated, so transitions don't work on it by default
- `allow-discrete` tells the browser to handle it: the element stays visible during the exit transition, then `display: none` is applied at the end
- Must list `display` explicitly in the `transition` shorthand

**Compared to old approach**
- Old: JS `transitionend` listener — remove visible class → wait for animation → set `display: none`
- New: `transition: display 0.4s allow-discrete, opacity 0.4s` — no JavaScript

**Note**
- This handles the *exit* animation. For the *enter* animation, you need `@starting-style` (next slide)

---

### `@starting-style`

**Key points**
- Widely Available (2024)
- Defines where a newly-rendered element starts its transition from
- Without `@starting-style`, a newly displayed element snaps in fully visible (no enter animation)
- The browser applies starting styles on the first render frame, then immediately transitions to final styles

**Compared to old approach**
- Old: JS `requestAnimationFrame` after setting display → add visible class → CSS transitions from there
- New: purely declarative, no JavaScript

**Complete pattern**
- Exit: `transition-behavior: allow-discrete` (previous slide)
- Enter: `@starting-style { ... }` (this slide)
- Together: full CSS enter + exit animations with `display: none` — zero JavaScript

---

## Container Queries

### `@container`

**Key points**
- Widely Available (2023)
- Media queries answer "how big is the viewport?" — container queries answer "how big is my parent?"
- Enables truly component-level responsive design: the same component adapts whether it's in a sidebar or a main column
- `container-type: inline-size` — watch the inline (horizontal) dimension
- `cqi` / `cqb` units — percentage of the container's inline/block size

**Compared to old approach**
- Old: JavaScript ResizeObserver + class toggling, or duplicated CSS for each context
- New: native, no JavaScript, components are self-contained

**Demo tip**
- Drag the container resize handle to show the card changing style at 300px — the viewport width doesn't change

---

### Pattern: `:has()` + `@container`

**Key points**
- These solve complementary problems that often appear together:
  - `@container` → "how much space does this component have?" (layout)
  - `:has(img)` → "what content does this component contain?" (content)
- Combining them: the grid switches to a row layout when wide *and* the card highlights when it contains an image — no JavaScript for either

**Why this pattern matters**
- Before `:has()`, the server or JavaScript had to add a class to mark content-containing elements
- Before `@container`, viewport media queries were the only responsive tool — context-blind
- Together: fully declarative, self-contained, content-aware responsive components
