# Yigex portfolio

The source for [brucexcluding.github.io](https://brucexcluding.github.io/).

## Edit the site

- `src/content.ts`: name, introduction, focus areas, and featured repositories.
- `src/App.tsx`: page sections and the two scrolling rows.
- `src/styles.css`: colors, layout, and responsive styling.
- `public-site/profile-blue-rim.png`: the visible portrait.
- `index.html`: browser title and description.

The visual cards are drawn in CSS. Repository cards link to public GitHub repositories and can be replaced with project screenshots as they become available. The original reference images are excluded from this repository and from the published site.

## Develop

```bash
npm ci
npm run dev
```

Run `npm run build` to produce `dist/`. Pushes to `main` deploy automatically through GitHub Actions.
