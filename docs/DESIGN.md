# Samudhra — design reference

> **The home page's source of truth is the approved single-file build**,
> `samudhra-homepage-final.html`, not the Figma frames. It is newer: real
> photography, the letter-by-letter hero, the black-and-white thali collage,
> the per-location contact blocks and six responsive breakpoints the Figma
> never had.
>
> Its stylesheet was ported verbatim into
> [`apps/web/src/styles/site.css`](../apps/web/src/styles/site.css) and the
> React sections emit the same markup and class names, so the two render
> identically — section heights and total page height match exactly. Change
> the look in that stylesheet, not by overriding it from components.
>
> Its photography was extracted to `apps/web/public/images/`.
>
> The Figma inventory below still describes the six pages that are not built
> yet.

## Figma inventory

Source: [Figma file `d5Xv5xyeuizdoMYmg6XAmH`](https://www.figma.com/design/d5Xv5xyeuizdoMYmg6XAmH/Samudhra?node-id=0-1)
Reviewed 2026-11-21. Everything lives on one page (`0:1 — Page 1`).

**What it is:** Samudhra, a contemporary Indian restaurant with two locations
(New Jersey and New York). Desktop frames at 1920px, plus one 1440px splash.

---

## Screens

| Node | Frame | Size | What it is |
| --- | --- | --- | --- |
| `1:8894` | Option 6 | 1440×1112 | **Location splash** — wordmark, two city cards (New Jersey / New York), each with *Reserve a Table* and *Order Online* |
| `2:117` | home | 1920×7291 | **Home** — hero "Tradition Reinterpreted", menu teasers (Curries / Signature Plates / Biryani), Weekend Thali, Dining & Lounge, Our Story, Catering & Events, Gallery. **Built** — its seven sections are `hero`, `menuShowcase`, `weekendThali`, `diningLounge`, `ourStory`, `cateringEvents`, `contactCta` |
| `2:6280` | Frame | 1920×6561 | **Menu** — Signature Plates, Curries, Biryani & Rice, Weekend Thali, Bar & Cocktails; each dish has name, description, price |
| `2:6686` | Frame | 1920×4544 | **About** — story, stats, team (Head Chef, Tandoor Chef, Pastry Chef, Bar Manager), FAQ / help centre |
| `2:8073` | Frame | 1920×7100 | **Dining & Lounge** — The Dining Room, The Lounge, Private Dining, newsletter signup, contact + hours |
| `2:9959` | Frame | 1920×5149 | **Catering & Events** — event inquiry form (location, name, email, occasion, guests, date, message) |
| `2:10558` | Frame | 1920×3167 | **Contact / Reservation** — reservation form (name, phone, email, guests, date, time, location, message), map, hours, takeaway |

Every page frame also contains a `Dialog - Site menu` / `Site menu` overlay
(2340×1200) — the full-screen navigation.

**Site navigation** (from the splash footer and the overlay): Menu ·
Dining Experience · Gallery · Catering & Events · Our Story · Location & Hours ·
Contact.

### Component sections

| Node | Section | Contents |
| --- | --- | --- |
| `2:11187` | Components | Components 6–13, each with `default` / `hover` and variants 1–5 |
| `2:11303` | Componets *(sic)* | Components 1–5, variants 1–8 |

---

## Tokens

Pulled from Figma variables and already applied in
[`apps/web/src/app/globals.css`](../apps/web/src/app/globals.css).

### Colour

| Figma name | Variable | Hex | Used as |
| --- | --- | --- | --- |
| Creole | `color/red/7` | `#1D0506` | Near-black maroon — body text, dark surfaces |
| Heath | `color/red/18` | `#4D0F10` | Deep maroon — primary |
| Zest | `color/orange/49` | `#DB851D` | Amber — accent, focus ring, logo gradient |
| Korma | `color/orange/33` | `#9A5A0F` | Dark amber |
| Serenade | `color/grey/96` | `#FFF8ED` | Warm cream — page background |
| — | `color/grey/95` | `#F2F2F2` | Muted surface |

Tints exist at 14/18/20/22/25/35/50/55/72/75/78/80/82% and are defined as flat
values (`--color-heath-20`, `--color-zest-80`, …) so Tailwind can emit them.

### Type — Montserrat throughout

| Figma style | Size / line-height / tracking | Tailwind |
| --- | --- | --- |
| Semantic/Heading 1 | 106 / 106 / 1.06 | `text-display` |
| Semantic/Heading 2 | 64 / 64 / −0.64 | `text-h2` |
| Semantic/Heading 3 upper | 56 / 51.52 / −1.12, Medium | `text-h2-upper` |
| Semantic/Heading 3 | 34 / 37.4 | `text-h3` |
| Montserrat/Regular | 17 / 25.5 | `text-body` |
| Semantic/Link | 16 / 20.8 | `text-link` |
| Montserrat/Medium | 13 / 18.2 / 0.78 | `text-small` |
| Semantic/Button upper, Link upper | 11 / 11 / 2.64, uppercase | `text-eyebrow`, `.u-eyebrow` |

### Spacing, radii, sizes

- Spacing scale: `s` 16, `s+` 24, `m` 32, `l` 48, `xl` 64
- Radii: 14, 22, 26, 999 (pill) → `rounded-sm`, `rounded-card`, `rounded-lg`, `rounded-pill`
- Containers: 1100 (text column), 1280, 1320 (page) → `container-content`, `container-site`
- Control heights: 42, 44, 46, 52 → `height-control`, `height-control-lg`

---

## Gaps to settle before building the public site

1. **No mobile or tablet frames.** Only 1920 (and one 1440). Responsive
   behaviour has to be derived — needs a decision on breakpoints per section.
2. **No admin panel design.** The superadmin panel keeps its own clean UI,
   built from the same tokens.
3. **`[Bracketed]` copy is placeholder.** The file says so itself:
   *"Prototype — [bracketed] details are placeholders"*. Still needed: both
   street addresses, phone numbers, email, opening hours, chef names, years
   trading, parking/transit notes.
4. **Forms are not wired.** The file notes *"Prototype form — not sent."*
   Reservation, catering inquiry and newsletter all need real handling.
5. **The wordmark** is a retro display face in an orange→maroon gradient —
   not Montserrat. It needs to come across as an SVG asset.
6. **Photography** is placeholder stock; real images needed, and the About page
   literally says *"Photo to come"*.

## Content the database will need

Beyond `profiles` / `settings` / `audit_logs`, the design implies:

| Entity | Comes from | Managed in admin by |
| --- | --- | --- |
| `locations` (2) | splash, contact, hours | superadmin |
| `menu_categories` + `menu_items` (name, description, price, tags) | Menu page | admin / editor |
| `team_members` (name, role, photo) | About | editor |
| `faqs` (question, answer, group) | About | editor |
| `gallery_images` | Home, Dining | editor |
| `opening_hours` (per location, per day) | Contact, Dining | admin |
| `reservations` | Contact form | admin reads |
| `catering_inquiries` | Catering form | admin reads |
| `newsletter_subscribers` | Dining page signup | admin reads |

None of these are built yet — they are the next migration.
