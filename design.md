# Samudhra — Design Specification (from Figma)

Source: Figma file `S22nNjcZnc62nfN0pJcKeZ`, node `1:1069` (page/frame name: **"home"**).
Extracted via the Figma MCP server (`get_metadata`, `get_variable_defs`, `get_design_context`). This is the single source of truth for building the site with heavy animation. Values below are copied verbatim from the Figma API output — nothing is rounded or guessed. Where a value could not be retrieved (see "Known gaps" at the end), that is stated explicitly rather than invented.

## Overview

"home" is one long desktop landing page, canvas size **1920 × 7291.14px**, for **Samudhra**, a contemporary Indian restaurant. The page sits on a warm cream (`Serenade #FFF8ED`) background. A dark, rounded "card" hero is inset at the top of that cream page (not full-bleed — it has 14px margin and 22px corner radius), then the page continues in light/cream sections below. This hero-as-card-on-light-page treatment, plus the fine hairline dividers, pill buttons, circular dish photography, and large display type (up to 150px), gives the design an **upscale, editorial, warm/moody fine-dining** direction — not flat/corporate, not playful/bright. Primary palette is deep maroon/near-black (hero) and cream/maroon (rest of page), with a single orange accent used sparingly for emphasis and dividers.

Top-level structure (in document order, with node ids):

| Section | Node id | y-position | height |
|---|---|---|---|
| Header | `1:7205` | 0 | 92 |
| Hero ("Section") | `1:1072` | 0 (within Main) | 860.81 |
| Section — SIGNATURE DISHES | `1:1130` | 860.81 | 1260.36 |
| Section — WEEKEND THALI | `1:3873` | 2121.17 | 1260 |
| Section — DINING & LOUNGE | `1:4086` | 3381.17 | 869.39 |
| Section — OUR STORY | `1:4131` | 4250.56 | 1020 |
| Section — CATERING & EVENTS | `1:4336` | 5270.56 | 924.42 |
| Section — CONTACT | `1:7067` | 6194.98 | 476.97 |
| Footer — FOOTER | `1:7151` | 6897.83 | 393.31 |

(Hero + the 6 content sections live inside a `Main` frame (`1:1071`) offset 92px down, i.e. below the fixed-height Header; the Header and Footer are siblings of `Main` inside the `Background` frame `1:1070`.)

**Screenshots:** could not be captured in this pass — the Figma MCP server hit its Starter-plan tool-call rate limit before `get_screenshot` could run (see "Known gaps"). Re-run `get_screenshot` on `1:1069` (full page) and on `1:1072` (hero) once the limit resets to get reference images.

## Design Tokens: Colors

All colors use a single font-neutral palette: warm cream, deep maroon/near-black, and one orange accent. Figma variable names are kept alongside the hex so they can be traced back to the file.

### Neutral / Base

| Token | Hex | Notes |
|---|---|---|
| `Serenade` (`color/grey/96`) | `#FFF8ED` | Warm off-white — main light section background, and text color on dark backgrounds |
| `Serenade 75%` | `rgba(255,248,237,0.75)` | Button border (outline buttons) on dark hero |
| `Serenade 78%` | `rgba(255,248,237,0.78)` | Secondary/muted text on dark backgrounds |
| `Serenade 22%` | `rgba(255,248,237,0.22)` | Hairline border inside hero (`Border` frame) |
| `color/grey/95` | `#F2F2F2` | Secondary light neutral (present in tokens; specific usage not confirmed in sampled sections) |
| `Black` (`color/black/solid`) | `#000000` | Base for black overlays |
| `Black 20% / 30% / 40% / 60% / 80% / 90%` | `rgba(0,0,0,0.2–0.9)` | Overlay/shadow opacities defined in the file (not confirmed to a specific layer in sampled sections) |
| `White` (`color/white/solid`) | `#FFFFFF` | Base white |
| `White 0.2%` | `rgba(255,255,255,0.004)` | Near-fully-transparent white, defined in file |
| `White Serenade` | gradient `#FFFFFF → #FFF8ED` | Named two-stop gradient token |

### Primary — Maroon ("red" family)

| Token | Hex | Notes |
|---|---|---|
| `Heath` (`color/red/18`) | `#4D0F10` | Primary brand color: heading text, primary button fill, borders, icon-circle strokes on light sections |
| `Heath 78%` | `rgba(77,15,16,0.78)` | Body copy on cream sections |
| `Heath 75%` | `rgba(77,15,16,0.75)` | — |
| `Heath 72%` | `rgba(77,15,16,0.72)` | Hero gradient overlay stop (0%) |
| `Heath 50%` | `rgba(77,15,16,0.5)` | Hero gradient overlay stop (40%) |
| `Heath 35%` | `rgba(77,15,16,0.35)` | Icon-circle border on cream sections |
| `Heath 25%` | `rgba(77,15,16,0.25)` | — |
| `Heath 20%` | `rgba(77,15,16,0.2)` | Hairline divider between list rows (e.g. Dining & Lounge rows) |
| `Heath 18%` | `rgba(77,15,16,0.18)` | — |
| `Heath 14%` | `rgba(77,15,16,0.14)` | — |
| `Creole` (`color/red/7`) | `#1D0506` | Near-black maroon: hero section background |
| `Creole 82%` | `rgba(29,5,6,0.82)` | Hero gradient overlay stop (100%) |
| `Creole 55%` | `rgba(29,5,6,0.55)` | Hero radial-gradient vignette, inner stop |
| `Creole 20%` | `rgba(29,5,6,0.2)` | Hero radial-gradient vignette, outer stop |

### Accent — Orange

| Token | Hex | Notes |
|---|---|---|
| `Zest` (`color/orange/49`) | `#DB851D` | Accent orange: eyebrow-label dividers, accent diamond/dot markers, the highlighted word "Reinterpreted" in the hero headline, decorative corner marks |
| `Zest 80%` | `rgba(219,133,29,0.8)` | Hero eyebrow divider lines |
| `Zest 20%` | `rgba(219,133,29,0.2)` | — |
| `Korma` (`color/orange/33`) | `#9A5A0F` | Darker orange, defined in file (likely a hover/active state of Zest — not confirmed against a live interaction state since Figma has no interaction states for this static page) |

**Count:** 9 distinct base hues (Serenade, grey/95, Black, White, White→Serenade gradient, Heath, Creole, Zest, Korma), with roughly 24 additional opacity variants of those same hues defined as separate tokens in the file.

## Typography

Single font family throughout: **Montserrat** (`font family/Font 1` → `Montserrat`).

### Named semantic styles (as defined in Figma variables)

| Style | Weight | Size | Line-height | Letter-spacing | Used for |
|---|---|---|---|---|---|
| Semantic/Heading 1 | Regular (400) | 106px | 106px (auto) | 1.06px | Hero headline, second line ("Reinterpreted", in Zest orange) |
| Semantic/Heading 2 | Regular (400) | 64px | 64px (auto) | -0.64px | Section headings, e.g. "Stay a While", "Weekend Thali", "Bring the Table to You", "Find Us" |
| Semantic/Heading 3 | Regular (400) | 34px | 37.4px | 0 | Sub-headings / card titles, e.g. dish category names, location names |
| Semantic/Heading 3 upper | Medium (500) | 56px | 51.52px | -1.12px | Large uppercase display variant (defined; exact usage not confirmed in sampled sections) |
| Semantic/Link | Regular (400) | 16px | 20.8px | 0 | Inline links |
| Semantic/Link upper | SemiBold (600) | 11px | 11px | 2.64px | Uppercase link labels |
| Semantic/Button upper | Medium (500) | 11px | 11px | 2.64px | Uppercase button labels, e.g. header "Menu", "Order Online" |
| Semantic/Link underline upper | Medium (500) | 10px | 14px | 2.4px | Small uppercase underlined links (defined; exact usage not confirmed) |

### Montserrat weight utilities (used directly, size varies by context)

| Style | Weight | Observed sizes | Observed line-heights | Letter-spacing | Used for |
|---|---|---|---|---|---|
| Montserrat/Regular | Regular (400) | 13 / 14 / 16 / 17 / 18px | 18.2 / 20.8 / 23.8 / 25.5 / 27px | 0 / 0.72px | Body copy, card captions, paragraph text across sections |
| Montserrat/Medium | Medium (500) | 13px | 18.2px | 0.78px | Pill-button labels ("Reserve a Table", "Order Online", "Private Events") |
| Montserrat/SemiBold | SemiBold (600) | 13px | 18.2px | 0.78px | Emphasized labels |
| Montserrat/SemiBold upper | SemiBold (600) | 10 / 11px | 14 / 15.4px | 2.6 / 2.64px | Eyebrow numbering labels, e.g. "02 — Dining & Lounge" |
| Montserrat/Medium upper | Medium (500) | 10px | 14px | 2.4px | Small uppercase labels |

### One-off display size (hero only)

| Style | Weight | Size | Line-height | Letter-spacing | Used for |
|---|---|---|---|---|---|
| (unnamed, hero display) | Regular (400) | **150px** | 135px | 1.5px | First hero headline word "Traditional" (cream/Serenade color) — this is larger than the "Semantic/Heading 1" token (106px) used for the second line "Reinterpreted" (orange), so the hero title deliberately mixes two sizes/colors on two lines |

Note: in the hero, "Traditional" is structurally split into **one text node per letter** (`T`, `r`, `a`, `d`, `i`, `t`, `i`, `o`, `n`, `a`, `l` — each its own frame/text node). This is purely a structural observation from the Figma node tree, not an animation definition — see "Motion/Animation" below.

**Count:** 8 named semantic type styles + 5 Montserrat weight-utility groups (spanning ~10 distinct size/line-height/letter-spacing combinations) + 1 hero-only display size = **~14 distinct type styles** in total.

## Spacing & Layout

### Spacing scale (named `item spacing` tokens)

| Token | Value |
|---|---|
| (unnamed) | 0px |
| — | 6px |
| — | 9px |
| — | 10px |
| — | 12px |
| `s` | 16px |
| — | 18px |
| — | 19px |
| — | 20px / 20.8px |
| — | 22px |
| `s+` | 24px |
| — | 28px |
| `m` | 32px |
| — | 44px |
| `l` | 48px |
| — | 80px |
| `xl` | 64px |

(Larger one-off values such as 106.52, 126.78, 141.48, 190.59, 248.89, 260.48, 454.3, 462.78, 464.61px also exist in the variable set — these are computed `justify-between`/flex-gap distances for specific layouts, not reusable scale steps, and should not be treated as design-system spacing.)

### Widths (container / max-width tokens)

| Token | Value | Used for |
|---|---|---|
| `width/1320` | 1320px | Footer container max-width |
| `width/1280` | 1280px | Content container max-width (page content width = 1920 − 2×320 margin) |
| `width/1100` | 1100px | Hero content container max-width |
| `width/520` | 520px | Signature Dishes intro paragraph width |
| `width/360` | 360px | — |
| `width/320` | 320px | Dining & Lounge intro paragraph max-width |
| `width/260` | 260px | — |
| `width/240` | 240px | Card caption max-width (Dining & Lounge rows) |

Page canvas width: **1920px** (desktop design). Outer page gutter is **320px** on the main sections (`px-320`), and the hero/dining sections use a **56px** inner gutter on top of that container. No tablet/mobile breakpoints are present in the file — this is a desktop-only design; responsive breakpoints are **not specified in Figma** and will need to be authored in code.

### Heights

| Token | Value | Used for |
|---|---|---|
| `height/92` | 92px | Header height |
| `height/860` | 860px | Hero section height (≈860.81px actual) |
| `height/680` | 680px | — |
| `height/52` | 52px | Circular icon-link buttons (Dining & Lounge rows) |
| `height/46` | 46px | — |
| `height/44` | 44px | Standard button height |
| `height/42` | 42px | Header "Order Online"/"Reservations" button height |

### Corner radius

| Token | Value | Used for |
|---|---|---|
| `corner radius/999` | 999px | Pill buttons (fully rounded) — used everywhere for CTAs |
| `corner radius/292` | 292px | — |
| `corner radius/137.28` | 137.28px | — |
| `corner radius/126.63` | 126.63px | — |
| `corner radius/124.17` / `124.18` | 124.17 / 124.18px | — |
| `corner radius/26` | 26px | Circular icon-link buttons (52px square → 26px = fully round) |
| `corner radius/22` | 22px | Hero section outer corners (the rounded "card" look) |
| `corner radius/14` | 14px | Inner hairline border frame inside hero |

The large (124–292px) radius tokens are defined in the file but weren't tied to a confirmed node in the sections sampled this pass — they most likely back the circular dish-photo cards in Signature Dishes (370.66 × 370.66px square frames that read visually as circles). Treat those photo cards as `border-radius: 50%` / fully rounded in code and verify against the hero screenshot once available.

### Stroke weights

0.97px, 1px, 1.08px, 1.19px, 1.4px, 1.47px, 1.6px, 4.75px, 5.55px. The dominant value used across borders/dividers/hairlines is **1px** (`stroke weight/1`).

### Opacity scale

20, 25, 50, 100 (percent) — used for overlay/texture layers (see Effects).

## Effects

- **Hero background image overlay (gradient wash):** a two-layer gradient sits over the hero photo —
  - Radial gradient (vignette), center-weighted: `rgba(29,5,6,0.55)` → `rgba(29,5,6,0.2)` (Creole 55% → Creole 20%)
  - Linear gradient, 180deg: `rgba(77,15,16,0.72)` 0% → `rgba(77,15,16,0.5)` 40% → `rgba(29,5,6,0.82)` 100% (Heath 72% → Heath 50% → Creole 82%)
- **Grain/noise texture overlay:** a repeating texture image (tile size 69 × 110.5px) is layered on top with `mix-blend-mode: screen` at **50% opacity** in the hero, masked to the hero shape. A similar texture overlay appears on the right side of the Dining & Lounge section at a much lower opacity (~22%, derived from `opacity/22` in the generated output — note the Figma→code export mapped this to the `corner-radius/22` variable, which is very likely an export quirk, not a real token mix-up; treat the Dining & Lounge texture opacity as **≈22%**, to be confirmed visually).
- **Decorative accent marks:** small 7–8.485px orange (`Zest`) diamonds (rotated 45° squares) used as micro accents next to the hero sub-line and at the hero border's top/bottom center — a recurring "diamond bullet" motif.
- **Card/image mask shapes:** `Mask Group` + `Mask` (rounded-rectangle) pattern used repeatedly to clip photography (hero image, Signature Dishes circular photos, Weekend Thali composite photos, Dining & Lounge background texture).
- **Shadows:** a layer literally named `Overlay+Shadow` exists in the Weekend Thali section (on the composite "thali" photo), indicating an applied shadow/overlay effect, but its exact shadow parameters (blur/spread/color) were not retrieved this pass — **not specified** beyond the layer's existence. No CSS `box-shadow` values were observed in any of the generated code samples; shadows in this design appear to be baked into overlay images/effects rather than applied as flat drop-shadows.
- **Blurs:** no blur effects were observed in the sampled nodes. Not specified elsewhere.
- No other opacity/overlay values beyond those listed in the Opacity scale above were found.

## Components

### Buttons (pill, `corner-radius: 999px`, height 42–44px)

**Border-radius follows Figma, not the HTML reference.** The coded reference (`samudhra-homepage-final.html`) actually ships sharp `border-radius: 3px` buttons with an inset double-border hover effect, but the user has confirmed **Figma is the source of truth for border-radius specifically** — buttons are fully-rounded pills (`corner-radius/999`), overriding what the reference file's CSS does. Everything else about the reference (colors, easing, entrance/scroll animation) still stands; this override is scoped to corner radius only.

1. **Primary (filled) button** — e.g. header "Reservations": `background: Heath (#4D0F10)`, 1px solid `Heath` border, `border-radius: 999px` (pill), text `Serenade (#FFF8ED)`, label style Semantic/Button-upper-like (Montserrat Medium, 11px, uppercase, 2.64px tracking), padding `pt-14px pb-15px px-20px`.
2. **Secondary (outline) button, dark context** — e.g. header "Menu" area / hero "Reserve a Table", "Order Online": 1px solid border in `Serenade 75%` (on dark hero) or `Heath` (on header), transparent fill, `border-radius: 999px`, text color matches border hue, same label style/padding as primary.
3. **Outline button, light context** — e.g. header "Order Online": 1px solid `Heath` border, transparent fill, text `Heath`, Montserrat Medium 11px uppercase, 2.64px tracking, `border-radius: 999px`.
4. **Text link (no border)** — e.g. hero "Private Events": same typography as buttons (Montserrat Medium 13px, 0.78px tracking) but no border/background, height 44px, centered padding.
5. **Circular icon-link button** — 52×52px, 1px solid `Heath 35%` border, fully rounded (`corner-radius/26`, i.e. an actual circle — this one genuinely is round, unlike the pill buttons), centers an 18×18px SVG icon; used as the trailing "go to" affordance on each row in Dining & Lounge.

### Header (`1:7205`)

Height 92px, background `Serenade (#FFF8ED)`, horizontal padding 48px (clamps down on narrower desktop widths). Layout: left — a small "Menu" trigger (two stacked horizontal-divider bars of different widths, 30px container, 6px gap, acting as a hamburger glyph) + "Menu" label (Montserrat Medium 11px uppercase, `Heath`); center — logo image ("Samudhra", 243.47 × 40px); right — two buttons (3px radius, not pill — see Components), "Order Online" (outline, `Heath` border/text) and "Reservations" (filled, `Heath` bg, `Serenade` text). Full-bleed (no max-width container) — unlike every other section, which caps at 1280/1320px.

**Responsive (confirmed from the HTML reference, `@media (max-width:720px)`):** header height drops to 72px; the "Menu" text label hides (icon only); the "Order Online" outline button hides, leaving only the filled "Reservations" button; logo shrinks to 26px tall (from 40px) and centers in a 3-column `auto 1fr auto` grid instead of the desktop `1fr auto 1fr`.

**Menu trigger opens a left slide-in drawer** (`min(420px, 100vw)` wide, full width on ≤720px), sliding in via `transform: translateX(...)` over 0.6s (`--eo` easing), with a scrim behind it. Drawer contents: header row (logo + close ✕), then nav grouped by section exactly as in the Footer (Our Menu / Dining & Lounge / Catering & Events / Our Story / Contact, each a small-caps group label + its links), then a CTA row (Reservations / Order Online as plain uppercase text links) and a placeholder address block at the bottom.

### Hero (`1:1072`, the "home" section)

Full-bleed photo background, rounded card (`corner-radius/22`, 14px inset from page edges, so effectively a framed photo-card at the top of the page), background color `Creole (#1D0506)` showing through any gaps, gradient + grain overlay as described in Effects, and a 1px `Serenade 22%` border inset 22px with corner-radius 14px and small orange diamond accents at its top/bottom center. Content (max-width 1100px, centered):
- Eyebrow: "Contemporary Indian Dining" flanked by two 46px horizontal dividers (`Zest 80%`), Montserrat Medium 13px, `Serenade 78%`, 0.78px tracking.
- Headline: "Traditional" (150px, Regular, `Serenade`, letter-spacing 1.5px, line-height 135px, split into one node per letter) on line 1, "Reinterpreted" (106px, Regular, `Zest` orange, Semantic/Heading 1 token) on line 2.
- Sub-line: "A contemporary expression of Indian warmth" flanked by two small rotated-square (diamond) orange accents, Montserrat Regular 18px, `Serenade 78%`, 0.72px tracking, 27px line-height.
- CTA row (44px tall, 16px gap, wraps): "Reserve a Table" (outline pill), "Order Online" (outline pill), "Private Events" (text link) — all `Serenade 75%` border / `Serenade` text, Montserrat Medium 13px.
- "Scroll down" affordance: small 34×18px SVG arrow, centered, 46px from the bottom.

### Section — Signature Dishes (`1:1130`)

Eyebrow "Our Menu" between two 40px dividers; Heading 2 "From the Samudhra kitchen"; intro paragraph (max-width 520px): "Each dish begins with the traditions, spices and regional flavours that shape Indian cooking — interpreted through a modern dining experience." Below: a row of **3 circular dish-category cards** (≈370.66 × 370.66px photo, fully rounded), each with Heading-3-style category name and a short italic-style caption underneath, plus a horizontal-border accent:
- "Curries" — "Rooted in tradition, rich with spice."
- "Signature Plates" — "Familiar flavours, refined for the table."
- "Biryani" — "Fresh, vibrant and distinctly Samudhra."
Followed by a single centered filled pill button: "Order Online".

### Section — Weekend Thali (`1:3873`)

A composite photo collage on one side (4 overlapping `Figure` images — "Cocktails on the bar", "A bartender mixing a drink", "Biryani with egg and lime", "Plated dish with beetroot" — plus a large circular hero shot of a thali spread with an `Overlay+Shadow` effect) and text content on the other:
- Eyebrow "Our Menu · Weekends at Samudhra"
- Heading 2 "Weekend Thali"
- Body copy: "Many small bowls around one plate — curries, dal, rice and accompaniments. A generous way to taste a little of everything."
- Two CTAs: "Reserve for the Weekend" and "View Thali Menu".

### Section — Dining & Lounge (`1:4086`)

Content container max-width 1280px, 56px inner gutter, 136px vertical padding; a grain-texture image mask covers the right ~38% of the section at low opacity. Header row: eyebrow "02 — Dining & Lounge" (Montserrat SemiBold-upper, `Zest`, 2.64px tracking) + Heading 2 "Stay a While"; paired with a right-aligned 3-line paragraph (max-width 320px): "From the first plate to the last pour — an evening at Samudhra is meant to be lingered over." Below, a **3-row link list**, each row a CSS-grid of `[160px photo | ≤240px caption | flexible 64px heading | 52px circular icon button]`, separated by 1px `Heath 20%` hairlines:
- Row 1: 110px rounded photo thumb, caption "The dining room, service and the evening at the table.", title "Dining Experience" (Heading-2-style, 64px).
- Row 2: photo thumb, caption "Cocktails and conversation, poured with care for spice and balance.", title "The Lounge".
- Row 3: photo thumb, caption "Food, drinks and the rooms they're served in.", title "Photo Gallery".

### Section — Our Story (`1:4131`)

Eyebrow "03 — About Samudhra"; Heading 2 "Our Story"; a secondary line "What begins in tradition becomes something new at the table." (styled distinctly from the main heading — likely Heading-3 weight/size, not confirmed to exact px this pass); body paragraph: "Each dish begins with the traditions, spices, and regional flavors that shape Indian cooking, interpreted through a modern dining experience. The menu brings familiar flavors into a refined setting — rooted in tradition, still fresh, vibrant, and distinctly Samudhra."; a photo ("A Samudhra bartender pouring a cocktail at the bar") with decorative vector/line accents around it; a link "About Samudhra".

### Section — Catering & Events (`1:4336`)

Eyebrow "04 — Catering & Events"; Heading 2 "Bring the Table to You"; intro paragraph: "Celebrations, gatherings and occasions large or small — shaped around your guests, at Samudhra or wherever you host." Two linked cards/CTAs:
- "Catering Menu" — "For gatherings of every size" → "View the menu"
- "Event Inquiry" — "Tell us about your occasion" → "Start an inquiry"

### Section — Contact (`1:7067`)

Eyebrow "05 — Contact"; Heading 2 "Find Us"; intro: "Location & hours, and how to reach the team for reservations, orders and events."; two CTAs "Reserve a Table" / "Order Online". Below, **two identical location cards**, each: "Location 0N" label, Heading 3 placeholder `[Location One]` / `[Location Two]`, then a 4-row hairline-separated detail list — Address `[Street, city, postcode]`, Hours `[Mon–Sun hours]`, Phone `[Phone]`, Email `[Email]` — and a "Reserve here" button. **All bracketed values are explicit Figma placeholders**, not real content (see Footer note below).

### Footer (`1:7151`)

Container max-width 1320px. Columns: brand block (logo + tagline "Tradition, reinterpreted. A contemporary expression of Indian warmth."); "Our Menu" (links: Food & Drinks, Weekend Thali); "Dining & Lounge" (links: Dining Experience, Photo Gallery); "Catering & Events" (links: Catering Menu, Event Inquiry); "Our Story" (link: About Samudhra); "Contact" (links: Location & Hours, Contact Details). Below a hairline divider: "Back to top" link, "© 2026 Samudhra", and an explicit note — **"Prototype — [bracketed] details are placeholders"** — confirming the Contact section's bracketed address/phone/email/location-name text is intentional placeholder copy to be replaced with real content.

## Motion/Animation data

**No animation, transition, keyframe, or easing data could be retrieved from Figma in this pass.** `get_motion_context` could not be called — the Figma MCP server (Starter plan) hit its tool-call rate limit partway through this extraction (confirmed via the `whoami` tool, team plan tier = `starter`). This is a capacity/quota issue, not evidence that the file has no Smart Animate / prototype transitions defined — **re-run `get_motion_context` on node `1:1069` with `recursive: true` once the rate limit resets**, and update this section with its actual output before treating "no motion" as confirmed.

In the meantime, two structural observations are worth carrying into the code-level animation design (these are observations about node structure, not Figma-authored motion data):
- The hero's first headline word ("Traditional") is built as **one text node per letter**. This is a common structural pattern for designers who intend a per-character stagger/reveal animation, but Figma attached no timing/easing to it in what we could read — treat it only as a hint that the hero headline is a good candidate for a letter-stagger entrance (e.g., via a GSAP SplitText-style stagger or Motion's `staggerChildren`), to be designed in code.
- Per the user's stated plan, all actual motion (scroll-triggered reveals, hero parallax, Lenis smooth scroll, button/link hover states, etc.) is expected to be authored in code regardless of what Figma contains — this document's job was to capture Figma-native motion data if present, and for this pass, none was retrieved.

## Known gaps (please re-run when possible)

The Figma MCP server returned **"You've reached the Figma MCP tool call limit on the Starter plan"** partway through extraction. As a result, the following could not be completed in this pass:
- `get_screenshot` — no reference screenshots were captured (full page `1:1069`, or hero `1:1072`).
- `get_motion_context` — no motion/animation data was retrieved at all.
- `get_design_context` (full, code-level) for: Signature Dishes (`1:1130`, got structural/content metadata only, not generated code), Weekend Thali (`1:3873`), Catering & Events (`1:4336`), Contact (`1:7067`), and Footer (`1:7151`) — these sections' **content, structure, and node ids are fully captured** above (from `get_metadata`), and their colors/typography can be inferred with high confidence from the semantic design tokens already documented (since every section reuses the same `Heading 2`/`Heading 3`/eyebrow/button styles), but exact Tailwind-class-level measurements (precise paddings/gaps within those 5 sections, and the exact corner-radius of the circular dish photos) were not individually confirmed via code export the way Header, Hero, Dining & Lounge, and Our Story were.

Recommended next step: once the Starter-plan limit resets (check via the `whoami` tool), run `get_design_context` on the 5 remaining sections plus `get_motion_context` (recursive) and `get_screenshot` on `1:1069`, and fold those results into this file.

## Planned: Super Admin Panel (content management)

Not part of the Figma design — a product requirement to build alongside the site. Captured here so it's not lost before implementation starts.

- **One single admin panel only.** Not a per-user/per-client admin system — there is exactly one super admin panel for the whole site, no multi-tenant admin accounts.
- **Page-wise content editing.** The client can go into the panel and edit the content of every page on the site (text/copy per section, page by page) — this is the generalized, permanent version of the "editable words" content-panel idea from earlier in the project's history, extended to cover all pages, not just the home page.
- **Access via a super admin key, not a normal login.** No username/password/user accounts for this — a single generated secret "super admin key" that, when entered, grants direct access to the panel. Mechanism (hashing/storage/session) is still to be designed when implementation starts.

To design/decide during implementation: where page content is stored (likely Supabase, one row/table per page or per section), how the key is generated and verified, session handling after key entry, and how the public site pulls this editable content in at render time.

## Planned: SEO, GEO, AEO & Sitemap

Also not part of the Figma design — a product requirement: the site should be built to the standard of "world's best website" on discoverability, not just visual/motion polish.

- **SEO (Search Engine Optimization):** proper per-page `<title>`/meta description, canonical URLs, Open Graph + Twitter card images per page, semantic HTML headings, clean human-readable URL slugs, fast Core Web Vitals (since content is admin-editable, titles/descriptions should be editable per page too, not hardcoded).
- **GEO (Generative Engine Optimization):** content written and structured so AI answer engines (ChatGPT, Perplexity, Google AI Overviews, etc.) can parse, quote, and cite it correctly — clear entity statements (what Samudhra is, where, what it serves), structured data (schema.org `Restaurant`/`LocalBusiness`/`Menu`/`FAQPage` JSON-LD), consistent facts across pages (same address/hours/name everywhere).
- **AEO (Answer Engine Optimization):** content shaped to directly answer likely questions (e.g. "What are Samudhra's hours?", "Does Samudhra take reservations?") in concise, quotable blocks — FAQ sections with `FAQPage` schema, direct-answer-first paragraphs, voice-assistant-friendly phrasing.
- **Dynamic sitemap:** `sitemap.xml` must be generated dynamically from the actual page/content list (not hand-maintained), so that when the super admin adds/edits pages or content through the admin panel, the sitemap reflects it automatically. Same for `robots.txt` pointing at it.

To design/decide during implementation: which schema.org types apply to which section, where per-page SEO fields (title/description/OG image) live in the content model so the admin panel can edit them, and the sitemap generation route/strategy (Next.js `sitemap.ts` reading from the same content source as the pages).

## Approved Animation Reference

The user supplied a reference file, `samudhra-homepage-final.html` (a static HTML/CSS/vanilla-JS export of this same design), and asked that **the site's animations match it exactly** — this is now the authoritative motion spec, superseding the earlier "no Figma motion data" gap. Colors in the reference (`#4D0F10`, `#DB851D`, `#FFF8ED`) match the Figma tokens exactly, confirming it's the same design.

**Stack used in the reference — zero animation libraries.** No GSAP, no Framer Motion, no AOS, no Lenis. Everything is native CSS (`@keyframes` + modern scroll-driven animation) plus ~20 lines of vanilla JS. This is deliberate and is a big part of why it's fast — worth preserving the spirit of (lean, native-CSS-first) even though the user wants Motion/GSAP-class tooling available in the React/Next.js build for anything CSS can't do.

- **Two easing tokens only, used everywhere:** `--e: cubic-bezier(.22,.61,.36,1)` and `--eo: cubic-bezier(.16,1,.3,1)` (an "ease-out-expo"-like curve). Reuse these two curves consistently rather than inventing new ones per component.
- **Hero entrance choreography** — staggered fade/slide-up, each element `animation: up <dur> <delay> var(--eo) both`:
  - Eyebrow label: `1.2s` duration, `.3s` delay
  - Headline "Traditional": split into **one `<span>` per letter**, each animates `translateY(105%) → 0` over `1.3s` (`letter` keyframe) — confirms the per-letter node structure seen in Figma was intentional
  - Headline "Reinterpreted": `1.4s` duration, `1.1s` delay
  - Sub-line: `1.2s` duration, `1.4s` delay
  - CTA button row: `1.2s` duration, `1.6s` delay
  - Scroll-down chevron: simple fade, `1s` duration, `2.2s` delay, then bobs forever (`bob 2.6s ease-in-out infinite`)
- **Scroll-linked reveal, no JS/no IntersectionObserver** — uses the native CSS Scroll-Driven Animations spec directly: `animation-timeline: view(); animation-range: entry 0% entry 55%` (or `70%` for cards), wrapped in `@supports (animation-timeline: view())` with a plain `.in{animation:up 1.1s var(--eo) both}` fallback for browsers that don't support it. Classes: `.rv` (generic reveal), `.rv-card` (card variant, `cardUp` keyframe: fade + `translate 0 80px → 0 0`), `.par` (parallax, `animation-range: cover 0% cover 100%`, used on the decorative arch/background layer).
- **Continuous ambient motion** (slow, low-CPU, never pauses): decorative rotating mark `spin 70s linear infinite`; a soft mouse-reactive spotlight in the hero (`wander 26s ease-in-out infinite alternate` as an idle fallback, replaced by a real cursor-follow when the mouse moves — see below).
- **Interactive hero spotlight:** ~2 lines of vanilla JS (`mousemove` → `hero.style.setProperty('--mx', …)` / `--my`) drive a `radial-gradient` mask positioned via CSS custom properties declared with `@property` (so the browser can smoothly interpolate them without JS doing the animating). A clean, cheap pattern worth porting to React (a mousemove handler setting CSS vars via a ref, not re-rendering).
- **Reveal-mask "sweep" highlight** (`.g-sweep`): a diagonal light sweep across an element, animated via `mask-position` + `mask-image` gradient rather than an extra DOM layer.
- **Modals/panels:** modal backdrop fades `.35s`, modal body slides up `.55s`; the off-canvas mobile nav panel slides via a plain `transform: translateX(...)` *transition* (not keyframes) at `.6s`, same `--eo` easing.
- **Accessibility — `prefers-reduced-motion` is mandatory:** a `@media (prefers-reduced-motion: reduce)` block collapses all animation/transition durations to near-zero. This must be carried into the React build (e.g. a global reduced-motion CSS override, or gating Motion/GSAP animations on `window.matchMedia('(prefers-reduced-motion: reduce)')`) — not optional polish.

Implementation note: port these as native CSS where the target supports it (Tailwind arbitrary `animate-*`/`[animation-timeline:view()]` utilities, or plain CSS modules) before reaching for a JS animation library — only use Motion/GSAP for effects that genuinely need JS (e.g. Lenis smooth scroll itself, or sequencing that depends on real scroll position/velocity rather than simple view-entry).

## Performance & Image Loading Strategy

User requirement: the site must load fast, with "strict"/clean code, and images must use responsive loading (`srcset`-equivalent) rather than single oversized files.

What the reference file already does well (keep this discipline in the Next.js build):
- Single-file-style leanness in spirit: no animation library weight, minimal JS (~20 lines, vanilla, no framework runtime for the animation layer itself).
- Fonts: Google Fonts `Montserrat` loaded with `rel="preconnect"` to both `fonts.googleapis.com` and `fonts.gstatic.com`, `display=swap`, and **only the 4 weights actually used** (300/400/500/600) — never the full font-weight range.
- Images: every below-the-fold `<img>` has `loading="lazy"`; key brand images (logo) have explicit `width`/`height` to prevent layout shift (CLS). The reference file itself uses Figma-export placeholder `data-img="<hash>"` attributes instead of real `src`/`srcset` — this is **not** production-ready image markup and must not be copied as-is.
- Exactly one small, genuinely-repeating asset (a 69×110.5px grain/noise texture tile) is inlined as base64 to save an HTTP request — the right call for a tiny reusable texture, and the *only* case where inlining is acceptable.

What the Next.js build must do differently/better:
- **Use `next/image`** for every real photo (hero, dish photography, gallery, collage) instead of hand-written `srcset` — it generates responsive `srcset`/`sizes` automatically, lazy-loads by default, negotiates modern formats (WebP/AVIF), and prevents CLS via required `width`/`height` or `fill`. Only the hero's LCP image should use `priority` (eager, no lazy) — everything else stays lazy.
- **Never base64-inline real photography.** Base64 inlining is reserved for the one tiny repeating noise texture (or similarly small, truly reusable decorative assets, kept under a couple KB) — never for dish/interior photos, which must be properly optimized files served via `next/image`.
- **Self-host or use `next/font` for Montserrat** rather than a runtime Google Fonts `<link>` — `next/font` self-hosts the font files at build time, eliminates the extra render-blocking DNS/connection round-trip the reference file pays for, and still gives automatic `font-display: swap` + preloading.
- **Keep the CSS-first animation approach** (see above) specifically because it keeps the JS bundle small — this is as much a performance decision as a style one.
- Target: good Core Web Vitals (see "Performance & a11y" item still pending a decision — not yet added to this doc) and avoid shipping a heavy animation-library runtime for effects plain CSS already handles in the reference file.
