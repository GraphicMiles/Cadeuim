# lamosa Studio — Agency/SaaS Template (Clone)

A faithful HTML/CSS/JS recreation of the **lamosa Studio** premium agency / SaaS
Framer template, rebuilt from scratch with semantic markup, a flexible CSS
architecture, and vanilla-JS interactions.

## Features

- **Hero** — animated glow, floating testimonial-card marquees, and trusted-logo marquee
- **Featured project slideshow** — 3 slides with crossfade, arrows, progress, and thumbnails
- **Stats** — count-up numbers and award pills
- **Services** — interactive list with crossfading visuals
- **Projects / Process / Pricing** — full card layouts
- **Testimonials** — review cards with metrics and avatar stacks
- **FAQ** — accordion (first item open)
- **Contact** — form + info
- **Blog** — featured post + post list
- **Footer** — newsletter, company links, socials, legal

## Tech

- Plain HTML5 + CSS3 (Flexbox) + vanilla JavaScript
- Font Awesome icons, Satoshi + Inter fonts
- No build step — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Structure

```
index.html    — markup
styles.css    — styles (flexbox, rem, 2–3 color system, responsive)
script.js     — reveal/count-up/marquee/slideshow/accordion/nav logic
assets/       — images
```
