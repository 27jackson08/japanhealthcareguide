# Japan Healthcare Guide

Source for [japanhealthcareguide.com](https://japanhealthcareguide.com), a guide to English-friendly
healthcare in Tokyo. It's a plain static site served by GitHub Pages: no build step, no framework.
Whatever is on `main` is live.

## Layout

```text
index.html                    Home
about/index.html              /about
clinic-finder/index.html      /clinic-finder
clinic-map/index.html         /clinic-map
emergency/index.html          /emergency
healthcare-in-japan/index.html /healthcare-in-japan
navigating-care/index.html    /navigating-care

data/clinics.js               The clinic directory (both clinic pages read this)
assets/css/tokens.css         Brand colours shared by every page
assets/css/pages/<page>.css   Styles for one page
assets/js/clinics-common.js   Code shared by the finder and the map
assets/js/pages/<page>.js     Scripts for one page
assets/img/                   Images
en14.pdf … en29.pdf           Bilingual medical questionnaires linked from /navigating-care
CNAME                         Custom domain for GitHub Pages
```

Each page folder holds an `index.html` so the URLs stay clean (`/about` rather than `/about.html`).

## Common edits

**Add or update a clinic.** Edit `data/clinics.js` only. Changes show up on both the finder and the map.

- Add the entry to `ALL_CLINICS`.
- Add its coordinates to `clinicCoords` under the exact same name. Without coordinates it still
  appears in the finder, but gets no map pin.
- Opening hours are optional and go in `clinicHours`, also keyed by the exact name.
- Add `showOnMap: false` to an entry to list it in the finder but hide it from the map. The online
  therapy and rehab providers use this.

**Change a page's look.** Edit `assets/css/pages/<page>.css`. Brand colours that every page uses are in
`assets/css/tokens.css`.

**Saved clinics, comments, reactions, corrections.** These live in `assets/js/clinics-common.js`.
Comments and reactions are stored in Supabase, using the public anon key; access is controlled by
row-level security policies in the Supabase dashboard.

## Previewing locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. The map tiles may not load on localhost if the Mapbox token is
restricted to the live domain.
