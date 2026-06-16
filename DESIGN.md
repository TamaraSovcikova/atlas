# Atlas - Design Brief / Art Direction

The north star for every UI decision. The coding agent reads this before building any
screen and builds against it instead of defaulting to the generic AI look. The human sets
the vision here once; the agent executes against it and self-checks with the Preview MCP.

Last set: 2026-05-31. Direction chosen by Tamara: premium, crafted, clean, minimal,
editorial-magazine / modern-museum. Both light and dark themes.

---

## The one line

> Atlas is a quiet museum of everything. An editorial, grown-up reading room where the
> world's knowledge is laid out with the confidence of a good magazine and the calm of a
> gallery at dusk - and a star atlas you slowly light up as you remember.

## Vibe (the adjectives that decide ties)

**Sophisticated. Editorial. Calm. Crafted. Confident.** Never busy, never cute, never techy.
If a choice makes it look more like a designed print object and less like a web app
template, take it. White space is a feature. Restraint is the brand.

## The metaphor (the identity, used everywhere)

A **star atlas / observatory**. Knowledge is a sky of constellations; remembering a concept
lights its star. This is not decoration bolted on at the end - it is the signature. Two
ownable mechanics no generic app has:

- **Star brightness = FSRS retention.** The better you remember a concept, the brighter and
  larger its star. The map visibly matures as you learn.
- **Star colour = domain.** History, geography, politics, religions, culture, science, modern
  spine each own a hue. Clusters self-organise into recognisable constellations.

The constellation must be **visible during a session** (not a tab you press) and the
**hero of the home screen**. The current collapsed-banner-you-tap is a regression to undo.

## Typography (the highest-leverage lever)

A real type system. Display face with character, clean non-Inter body. Numerals and dates -
which matter in a history app - get the display face for editorial flavour.

- **Display (headings, concept titles, years):** an editorial high-contrast face.
  First choice: **Fraunces** (warm, characterful, "old-style" but modern; free, Google Fonts).
  Alternate: **Zodiak** (Fontshare) for more drama.
- **Body / UI:** a clean grotesque that is **not Inter**. First choice: **Switzer** or
  **General Sans** (Fontshare, free commercial licence). Warm, neutral, legible small.
- **Scale:** a deliberate modular scale, not ad-hoc sizes. Big confident headings, generous
  line-height on body. Type does the hierarchy work, not boxes and borders.
- Self-host the fonts (offline PWA); subset to what is used.

## Colour

Editorial restraint, not one-accent-on-flat-dark. Built in OKLCH so lightness reads true.

- **Neutrals carry the UI.** A warm-tinted ink/paper ramp (never pure #000 or #fff). The app
  is mostly neutral; colour is earned, not sprinkled.
- **Domain hues are the only saturated colour, and they MEAN domain.** They live primarily on
  the constellation and as small, precise accents (a concept's domain tag, a progress mark).
  Extend the existing `DOMAIN_HUE` system across the UI so colour always carries meaning.
- **No purple/indigo. No multi-stop gradients as decoration.** A single restrained accent
  treatment at most. The richness comes from neutrals, type, space, and the star colours.

### Themes (both, first-class)

- **Default: "Observatory" (dark).** A warm near-black/deep-ink base (not blue-black), faint
  grain, the constellation glowing against it. The natural home for a 10-minute evening habit.
- **"Daylight gallery" (light).** A warm off-white / soft paper base, ink-dark text, the
  constellation rendered as fine ink-on-paper celestial chart lines rather than glow. Must
  feel like a deliberate gallery, not an inverted dark theme.
- One toggle. Both audited for contrast (WCAG AA).

## Depth, texture, motion

- **Depth via light and considered shadow, not glassmorphism/blur.** Subtle, layered, soft.
- **A whisper of grain** on the base surface. Tasteful, barely there.
- **One spring, everywhere.** Spring physics (tension/friction), not fixed `300ms ease`. It
  becomes a signature. Mastered stars pulse slowly; connections shimmer along an edge on a
  correct answer; reveals settle. Honour `prefers-reduced-motion` globally (already done).
- Motion is calm and purposeful. No bounce-for-bounce's-sake. Premium, not playful.

## Layout

**Editorial, not card-grid.** Asymmetry, a strong baseline grid used then broken, generous
negative space, clear focal hierarchy. A session is a calm reading spread, not a dashboard.
Avoid the centred-hero-plus-three-feature-cards and the uniform rounded-card grid entirely.
Vary rhythm: a large title, a quiet brief, a single confident action.

## Icons

A consistent custom line set (one weight, one corner treatment), not stock lucide-as-shipped.
Even lightly restyling weight/terminals breaks the generated read.

---

## DO

- Persona: build as a frontend engineer with a print / editorial-magazine background.
- A distinctive display serif (Fraunces) + a non-Inter grotesque body.
- Warm-tinted OKLCH neutrals; colour only where it means something.
- Domain-hue system extended from the constellation across the UI.
- One spring for all motion; star brightness tied to FSRS retention.
- Generous negative space; type-led hierarchy; editorial asymmetry.
- Self-host fonts; both themes; AA contrast; reduced-motion.
- Use the Preview MCP to screenshot and self-critique every screen against this brief
  before showing the human.

## DON'T

- Inter (or system/Roboto) for headings or body.
- Purple/indigo accents; decorative multi-stop gradients.
- Uniform rounded-card grids; centred hero + 3 feature cards.
- Glassmorphism/blur as the only depth idea; uniform shadows on everything.
- One-accent-on-flat-dark as the whole palette.
- The constellation as a collapsed tab/banner you must press to see.
- Fixed-duration linear motion; bounce for its own sake.

## How to use this file

1. Every UI session: read this first. If a request conflicts with it, flag the conflict.
2. Build the screen, then run the Preview MCP, screenshot it, and compare against DO/DON'T.
   Fix divergences before involving the human.
3. The human reviews whole screens against the vibe, not individual elements.
4. If the vision itself should change, edit this file first, then the code.
