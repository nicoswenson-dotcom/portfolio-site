# Nico Swenson — Portfolio Site

Static site (plain HTML/CSS, no build step) housing three lanes:

- **Drag** — Miss Texas 1988 photos, résumé, booking
- **Design** — Graphic design portfolio (Thot Bubbles, app, bar rebrand, posters, album covers, retouches)
- **Writing** — Reporting bylines for *The Stranger* under "Nico Swenson"

## File structure

```
portfolio-site/
├── index.html          ← Hub homepage
├── drag.html           ← Drag portfolio
├── design.html         ← Graphic design portfolio
├── writing.html        ← Writing/reporting
├── README.md
├── netlify.toml        ← Netlify deploy config (already set up)
└── assets/
    ├── css/style.css
    ├── images/         ← All images live here
    └── docs/           ← PDFs (drag résumé)
```

## How to run it locally

Just open `index.html` in your browser. Or, if you want a proper local server:

```bash
cd portfolio-site
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## Deploying to GitHub + Netlify

### 1. Push to GitHub

```bash
cd portfolio-site
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio-site.git
git push -u origin main
```

### 2. Connect Netlify

1. Sign in at [app.netlify.com](https://app.netlify.com)
2. **Add new site → Import an existing project → Deploy with GitHub**
3. Pick the `portfolio-site` repo
4. **Publish directory:** `.` (root) — leave build command **blank** (it's a static site)
5. Click **Deploy site**

Netlify gives you a free `*.netlify.app` URL immediately.

### 3. Connect your custom domain

In Netlify: **Domain settings → Add custom domain → enter your domain → Verify**

Netlify will show you DNS records to point your domain at. Two paths:

- **Easy:** transfer DNS to Netlify (they walk you through it)
- **Keep your registrar:** add the `A` record + `CNAME` they provide at your registrar's DNS panel

HTTPS turns on automatically once DNS propagates (usually < 1 hour).

---

## Swapping in your real assets

### Instagram feed (homepage + drag page)

Currently a placeholder. To make it live:

1. Sign up at [Elfsight Instagram Feed](https://elfsight.com/instagram-feed-instagram-widget/) (free tier shows up to 6 photos)
2. Create a widget connected to `@misstexas1988`
3. Copy the embed code Elfsight gives you (it'll look like `<script src="...elfsight..."></script><div class="elfsight-app-..."></div>`)
4. In `index.html` AND `drag.html`, search for `===== INSTAGRAM EMBED =====`
5. Paste the code between the `<!-- PASTE WIDGET SCRIPT -->` markers
6. Delete the `<div class="placeholder">...</div>` block above it

> Alternative: [SnapWidget](https://snapwidget.com) — same idea, slightly different styling.

### Design portfolio thumbnails

In `design.html`, each project card has a placeholder thumbnail with this pattern:

```html
<div class="thumb placeholder" data-slot="thot-bubbles-cover">
  <span>[ Drop hero image:<br />thot-bubbles-cover.jpg ]</span>
</div>
```

To swap in your real cover image:

1. Save the image to `assets/images/` (e.g. `thot-bubbles-cover.jpg`)
2. Replace the placeholder div with:

```html
<div class="thumb" style="background-image: url('assets/images/thot-bubbles-cover.jpg')"></div>
```

The colored tint behind each card stays — it shows through any image with transparency.

### Writing — adding articles

In `writing.html`, find the `<ol>` block and update each `<a class="article">` row:

```html
<a class="article" href="HTTPS-LINK-TO-STRANGER-ARTICLE" target="_blank" rel="noopener">
  <span class="date">Apr 2026</span>
  <h3>Your real article title here</h3>
  <span class="pub">The Stranger</span>
</a>
```

Add new rows at the **top** of the `<ol>` so newest is first.

### Drag résumé

The PDF is at `assets/docs/miss-texas-1988-drag-resume.pdf` — when you update it, just replace that file (keep the same filename) and re-deploy.

---

## Customizing the look

All design tokens live at the top of `assets/css/style.css` under `:root`. Tweak the colors there and the whole site updates:

```css
:root {
  --cream:  #FAF5E8;
  --cobalt: #1B3FB5;
  --pink:   #F4B4C4;
  --lemon:  #F5C842;
  --tomato: #E04535;
  /* ... */
}
```

---

## Built with

- Hand-written HTML + CSS, no framework, no build step
- Google Fonts (Fraunces, Space Grotesk, JetBrains Mono)
- Pure semantic markup (good for SEO + accessible)
- Mobile-responsive at every breakpoint

Built May 2026. Made with way too much style.
