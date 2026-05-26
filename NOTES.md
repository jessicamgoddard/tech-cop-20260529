# CSS Today — Presenter Script

**Audience:** Backend developers and designers.

---

## Intro

---

### CSS Today ⚡


Hey everyone! This is Tech CoP for May 28, 2026 and today I'm going to walk through a bunch of CSS features that are pretty cool and also ready to use right now — in the latest version every major browser. I'll be covering selectors, properties, etc. that open up some design possibilities and make things easier for developers.

---

### What is Baseline? ⚡


First I want to talk briefly about Baseline. You may have seen this badge showing up on MDN — it's an indicator from browser vendors about whether a feature is safe to use everywhere.

* Green means it's widely supported and has been in all major browsers for over two years — use it confidently.
* Blue means it's newly supported in every browser — safe for most projects.
* Yellow means not yet cross-browser supported

Ideally you can think of uses for the things I'm sharing today in current projects, so I've limited this presentation to only what is newly or widely supported.

---

### Interop 2026 ⚡


A quick note about Interop. There's a yearly program called Interop where Apple, Google, Mozilla, and Microsoft agree to fix the same browser compatibility issues in the same year. It's in its fifth year now and it's a big reason browser support has gotten so much more consistent recently.

These chips are this year's CSS focus areas — anchor positioning, scroll snap, container queries are all on the list. Features from this deck are only going to get better supported this year.

---

## Selectors

---

### — Selectors — ⚡


Let's start with selectors — some of the most useful ones are newer than you might think.

---

### `:not()` ⚡


`:not()` has been around for a long time, but it got a big upgrade. The old version only accepted one thing — `:not(.foo)` worked, but `:not(.foo, .bar)` didn't. Now you can pass in a whole list.

The pattern is: style everything, then exclude what you don't want. Instead of applying styles and then writing overrides to undo them, you say "apply this to everything that is *not* one of these."

**[ACTION]** Point to the selector in the editor — show how it reads like natural language.

---

### `:has()`


This is one of my favorites. Developers asked for this for literally 25 years and it's finally here. `:has()` is a parent selector. `.card:has(img)` selects any card that contains an image. CSS can now look *inside* an element and make decisions based on what's there.

Here's why this is a big deal for backend work. If you've ever added a class to a parent element just to indicate that it has a child element, you don't have to do that any more. That's the pattern `:has()` eliminates completely. CSS reads the DOM directly now. No template logic, no JavaScript class toggling.

**[ACTION]** Show the `.card:has(img)` rule in the editor. Point out the card without an image gets no special treatment — nothing changed in the HTML, only the CSS rule.

It also works sideways across siblings — `h2:has(+ p)` selects an `h2` immediately followed by a paragraph. A lot is possible with this one.

---

### `:nth-child(n of .selector)` ⚡


The old `:nth-child(2)` counted every sibling regardless of class or type, which made it nearly useless for most real-world lists. Now you can filter the count: `li:nth-child(2 of .highlight)` counts only the `.highlight` items, ignoring everything else.

**[ACTION]** In the editor, change `2 of .highlight` to `1 of .highlight` or `3 of .highlight` and show the highlight moving.

Before this, you'd add numbered classes in your markup or write JavaScript. Now it's one CSS expression.

---

### `:empty` ⚡


`:empty` matches an element with no children at all — no text, no elements, nothing. A good use case for this would be when your API returns an empty array or null and the template renders an empty container, CSS can detect it. You can hide it, show a placeholder, add an empty-state message — all without JavaScript.

One important gotcha: whitespace counts as content. If your template outputs `<div> </div>` with a space inside, that is *not* empty as far as CSS is concerned. Make sure your templates produce truly empty tags.

**[ACTION]** Point to the third box in the demo — it has whitespace inside and doesn't match `:empty`, even though it looks empty.

---

### `:focus-visible` ⚡


Focus rings are important for accessibility, but they look wrong when you click a button with a mouse. `:focus-visible` handles this automatically — the browser only applies it when you're navigating by keyboard, not on mouse clicks.

This is now the recommended way to style focus rings. The old approach — `outline: none` on everything — removes focus indicators for keyboard users entirely, which is a real accessibility issue. `:focus-visible` gives you both: clean for mouse, visible for keyboard, with one selector.

**[ACTION]** Tab to the button to show the ring. Click it with the mouse to show it doesn't appear. Then in the editor, change `:focus-visible` to just `:focus` and click again — show the ring appearing on mouse click too.

---

### `:user-valid` / `:user-invalid` ⚡


`:invalid` in CSS has always been annoying — it fires immediately on page load, so fields show red error borders before the user has done anything. `:user-valid` and `:user-invalid` only kick in after someone has actually interacted with the field — typed something, then moved on.

**[ACTION]** Load the slide and show the fields looking clean. Tab through them, enter something invalid, and tab away — show the error state appearing at the right time.

The old fix was a JavaScript `blur` event adding a `.touched` class, which you'd then style. This is that pattern, natively, in one CSS selector.

---

## Scoping

---

### — Scoping — ⚡


Next — keeping styles contained to where they belong.

---

### `@scope` ⚡


`@scope` lets you write styles that can't escape a specific container. `@scope (.card) { h3 { color: pink } }` — that `h3` rule only applies inside `.card`, nowhere else on the page.

The old way was prefixing every selector: `.card h3`, `.card p`, `.card ul` — verbose and easy to forget. If you've used Vue scoped styles or CSS Modules in React, this is that, but native, no build tools required.

**[ACTION]** Point to the scoped selector. Show that the `h3` outside the card container is unaffected.

---

## Layout

---

### — Layout — ⚡


Let's move to layout and sizing — several of these replace patterns that used to need JavaScript or careful math.

---

### Logical sizing ⚡


You may have seen `inline-size` and `block-size` in codebases and wondered what they are. They're the writing-direction-aware versions of `width` and `height`. `inline-size` is width in a left-to-right layout. In a vertical writing mode, it becomes height.

This matters if your app ever needs right-to-left or vertical text — logical properties adapt automatically without extra overrides.

**[ACTION]** Uncomment `writing-mode: vertical-rl` in the editor to show `inline-size: 200px` becoming the height of the element.

---

### Logical spacing ⚡


Same idea for margin and padding. The one you'll use every day: `margin-inline: auto` centers an element horizontally in any writing direction — it's the modern `margin: 0 auto`. `padding-block` covers top and bottom in one declaration.

**[ACTION]** Uncomment `direction: rtl` to show `border-inline-start` flipping to the right side automatically — a physical `border-left` would have stayed on the left.

---

### `place-*` ⚡


`place-content: center` is shorthand for centering both axes in a grid or flexbox container at once. If you're writing `align-content: center; justify-content: center` separately, this replaces both. `place-items` and `place-self` work the same way.

---

### `display: flow-root` ⚡


If you've ever inherited code with a "clearfix" — the `::after { content: ''; display: table; clear: both }` magic spell — `flow-root` is the modern, explicit replacement. It makes a container wrap around floated children and prevents margin collapsing across its boundary. One property, no side effects, says exactly what it does.

**[ACTION]** Switch `display: flow-root` to `display: block` and show the container collapsing around the float.

---

### `aspect-ratio` ⚡


`aspect-ratio: 16 / 9` maintains a 16:9 ratio as the element scales. `aspect-ratio: 1` is a perfect square.

The old approach was a padding-top hack — `padding-top: 56.25%` on a relatively positioned wrapper with absolute content inside. It worked but was completely unintuitive. This is just declarative.

---

### `fit-content` ⚡


`width: fit-content` shrinks an element to the size of its content while keeping it as a block element. The key difference from `display: inline-block` — it stays in normal flow, so you can still center it with `margin-inline: auto`.

There's also `min-content` and `max-content` for when you need more control, but `fit-content` covers most cases.

---

### `min()`, `max()`, `clamp()` 🕐


These three functions let you do responsive sizing without media queries. `min(a, b)` gives you the smaller value — `min(50%, 400px)` means "be 50% wide, but never wider than 400px." `max(a, b)` gives the larger — `max(200px, 30vw)` means "never narrower than 200px." `clamp(min, preferred, max)` combines both.

The most useful pattern is fluid typography: `clamp(1rem, 2.5vw + 0.5rem, 1.5rem)` — text that scales smoothly between 1rem and 1.5rem based on viewport width. That one line replaces two or three media query breakpoints.

**[ACTION]** Adjust the clamp values in the editor. Slowly resize the browser window to show the text scaling fluidly between the bounds.

For designers: this is how you get text that looks right at every viewport size, without defining breakpoints. The browser handles the math.

---

### Pattern: center a shrink-wrapped element ⚡


Worth calling out as its own pattern: `width: fit-content` plus `margin-inline: auto` centers a content-sized block element without hardcoding a width. The old way required either knowing the width in advance, or using `inline-block` plus `text-align: center` on the parent — two elements involved. This is one element, two properties.

---

### Pattern: responsive grid, no media queries 🕐


This is probably the most useful layout pattern in the whole deck. `grid-template-columns: repeat(auto-fit, minmax(min(10rem, 100%), 1fr))` — let me break it down.

`auto-fit` creates as many columns as fit and collapses empty ones. `minmax(10rem, 1fr)` means each column is at least 10rem wide and they share leftover space equally. The `min(10rem, 100%)` prevents overflow — if the container is narrower than 10rem, the column becomes 100% wide.

**[ACTION]** Slowly resize the browser window and show items wrapping and re-flowing. Then change `10rem` to something bigger or smaller.

The old way: `@media (min-width: 600px) { grid-template-columns: repeat(2, 1fr) }` and so on — multiple breakpoints, hard-coded column counts. This is zero breakpoints, fully fluid, works at any container width.

---

### Viewport units ⚡


`100vh` has a well-known bug on mobile — the browser address bar shows and hides as you scroll, changing the viewport height and causing full-height layouts to jump. The fix used to be JavaScript `window.innerHeight`. Now there are better units.

`dvh` is dynamic — it updates as browser UI shows and hides. `svh` is the small viewport when the chrome is fully visible, `lvh` is large when it's hidden. For any full-height hero sections or app shells, swap `100vh` for `100dvh`.

---

## Typography

---

### — Typography — ⚡


A couple of text properties worth knowing.

---

### `text-*` ⚡


`text-decoration` is now a real shorthand — line, style, color, and thickness all in one. `text-decoration: underline 2px wavy #FF69B3` in a single declaration.

The one I use constantly is `text-underline-offset` — it moves the underline slightly below the baseline so it doesn't cut through descenders on letters like g, p, and y. Small detail, noticeably more polished.

**[ACTION]** Set `text-underline-offset` to `0` in the editor and show the underline cutting into the descenders. Bring it back.

---

### `text-wrap: balance` 🕐


This one's great for designers. `text-wrap: balance` tells the browser to distribute words across lines so each line is roughly the same length. It's for headings and pull quotes — anywhere you'd otherwise be tweaking `max-width` until the line breaks look right.

**[ACTION]** Show the heading with `balance` applied. Remove it and resize the browser — show a single word stranded on the last line. Put it back.

The old fix was `<br>` tags hardcoded in the CMS, a `max-width` set by trial and error that breaks at different font sizes, or a JavaScript library. This is one property and it adapts to any container width automatically.

One note: it has a small performance cost on large blocks of text, so use it on headings and short copy, not paragraphs.

---

## Color & Visual Effects

---

### — Color & Visual Effects — ⚡


This section is good for designers — a lot of things that used to need Photoshop or canvas are now just CSS.

---

### `color-mix()` 🕐


`color-mix()` blends two colors together in CSS. `color-mix(in oklch, hotpink 25%, dodgerblue)` — 25% pink, 75% blue, mixed in the OkLCH color space.

For designers: this is how you generate tints, shades, and blends from a brand color without a design tool or preprocessor. `color-mix(in oklch, var(--brand) 80%, white)` gives you a light tint. No Sass, no build step, just CSS.

**[ACTION]** Compare the two swatches — one mixes in sRGB, one in OkLCH. Point out the sRGB version going muddy in the middle, and the OkLCH version staying vivid.

The color space matters a lot. sRGB mixing often produces gray or muddy midpoints. OkLCH is perceptually uniform — colors stay vivid as you blend. When in doubt, use `oklch`.

---

### `mask-image` 🕐


`mask-image` lets you use a gradient or image as a mask over an element. Black areas are visible, white areas are transparent. The most common use is a gradient fade, blending an image into the page background at its edges.

For designers: this is the "fade photo to background" effect that used to need canvas, SVG workarounds, or a Photoshop export. It's one CSS declaration.

**[ACTION]** In the editor, change the gradient direction from `to bottom` to `to right` or adjust the stops to show how the fade shifts.

One thing to know — you still need the `-webkit-mask-image` prefix alongside the standard property. The demo already includes both.

---

### `backdrop-filter` ⚡


`backdrop-filter` applies filters to whatever's *behind* an element — this is the frosted glass effect you see everywhere in modern UI. The element needs a semi-transparent background to make the blur visible; a fully opaque element would just cover the effect.

`backdrop-filter: blur(12px)` with `background: rgba(255,255,255,0.1)` — that's the whole recipe.

**[ACTION]** Adjust the blur value in the editor. Then set the background to fully opaque to show why the transparency is required.

---

### `color-scheme` ⚡


When you build a dark UI, your custom elements look great — but browser-native controls like inputs, checkboxes, and scrollbars still render in light mode unless you tell the browser otherwise. `color-scheme: dark` fixes that. Add it to `:root` and native controls render dark.

`color-scheme: light dark` means "I support both, follow the OS setting." That's the right value if you have a real dark mode implementation.

---

### `caret-color` ⚡


`caret-color` controls the blinking cursor color inside text inputs. It's a small finishing touch for brand-colored search fields or key inputs. You can also set it to `transparent` to hide it entirely, which comes up when building custom cursor implementations.

---

## Scroll

---

### — Scroll — ⚡


A couple of scroll properties worth having in your toolkit.

---

### `scrollbar-gutter` ⚡


When content overflows and a scrollbar appears, it takes up space — the layout shifts inward. `scrollbar-gutter: stable` reserves that space even when the scrollbar isn't showing, so the layout never jumps.

Worth knowing: on macOS and all mobile browsers, scrollbars overlay and take no space — so this mainly matters on Windows or macOS with the "always show scrollbars" preference.

---

### Scroll snap 🕐


Scroll snap gives you carousels, full-page scrolling, and gallery rows in pure CSS. Two pieces: `scroll-snap-type` on the container and `scroll-snap-align` on each item.

`scroll-snap-type: x mandatory` means "snap horizontally, always land on a snap point." `mandatory` always snaps; `proximity` only snaps if you stop close enough to one — more forgiving for long content.

**[ACTION]** Change `mandatory` to `proximity` in the editor, then try stopping mid-scroll to show the different snap behavior.

This replaces Swiper.js, Flickity, and similar libraries for most carousels. No JavaScript, no event listeners, no dependencies.

You can also use `scroll-padding-top` on the container to offset for a sticky header, and `scroll-behavior: smooth` for animated keyboard or programmatic scrolling.

---

## Transitions

---

### — Transitions — ⚡


This next section is probably the most impactful for eliminating JavaScript — smooth show/hide animations without async code.

---

### `transition-behavior: allow-discrete` 🕐


Here's a problem you've probably hit. You want to animate an element out before hiding it — fade it, slide it away. But `display: none` can't be animated. The moment you apply it, the element disappears. No transition.

The old fix: remove the visible class, listen for the `transitionend` event, *then* set `display: none`. Two async steps, easy to get the timing wrong.

`transition-behavior: allow-discrete` handles it in CSS. The browser keeps the element visible long enough for the exit transition to finish, then applies `display: none` at the end. You include it alongside your `transition` declaration on `display`.

**[ACTION]** Click the toggle button — show the exit animation working. Then remove `allow-discrete` from the CSS and click again — the element disappears instantly with no transition.

This handles the exit. For the enter animation, you need one more piece — that's the next slide.

---

### `@starting-style` 🕐


`@starting-style` is the other half. It defines where a newly-shown element starts its transition *from*. Without it, when something goes from hidden to visible, it snaps in at full opacity. `@starting-style` gives the browser a "before" state to transition away from.

**[ACTION]** Toggle the element visible. With `@starting-style` in place, it fades in smoothly. Remove the `@starting-style` block and toggle again — it snaps in instantly.

Put both together: `transition-behavior: allow-discrete` for the exit, `@starting-style` for the enter — full in/out animations on `display: none` elements. Zero JavaScript. This is the pattern designers have been asking for and devs have been hacking around for years. Now it's just CSS.

---

## Container Queries

---

### — Container Queries — ⚡


Last section — and it's a big one for component-based work.

---

### `@container` 🕐


Media queries answer "how big is the viewport?" Container queries answer "how big is my parent?" That difference matters a lot for reusable components.

Imagine a card. In a wide main column it should show the image and text side by side. In a narrow sidebar it should stack. With media queries, you'd need to know where the card was placed and write viewport breakpoints for each context. With container queries, the card knows its own available space and adapts itself.

**[ACTION]** Drag the resize handle on the demo container slowly. Show the card switching layout. Point out that the viewport width isn't changing — only the container size.

For backend devs: before this, "responsive at the component level" meant JavaScript `ResizeObserver`, a separate template for each layout context, or a server-side context flag. Now it's in the component's own CSS. Mark the parent with `container-type: inline-size`, write `@container (min-width: 300px) { ... }`, done.

---

### Pattern: `:has()` + `@container` 🕐


These two features solve different problems that often come up together. `:has()` answers "what does this component contain?" — is there an image, a badge, extra content? `@container` answers "how much space does it have?" Together: a component that knows both what it contains *and* where it's placed — self-contained, no JavaScript for either.

**[ACTION]** Point to the demo — the card changes layout at a certain width AND highlights differently when it has an image. Drag the resize handle and show both behaviors working at the same time.

This combination replaces an entire category of patterns: conditional classes in templates to expose content state, ResizeObservers to expose container dimensions, duplicate markup for different layouts. A component built this way just works, wherever you put it, with whatever content you give it.

---

## Wrap Up

---

### Learn More ⚡


That's the deck! Here are the places to go if you want to dig into anything we covered.

MDN is the best reference — every property page shows its Baseline status right at the top. Can I Use has detailed browser version tables if you need to check specifics. web.dev has walkthroughs for most of these features. And wpt.fyi/interop-2026 lets you track cross-browser compatibility progress in real time.

Thanks everyone — happy to take questions, and the live editor is still up if you want to play with any of the demos.
