# Developer Documentation

## Asset Policy

### Purpose
This policy keeps asset handling consistent across:
- PWA/web app deployment
- Chrome-based installable web app behavior
- VS Code extension packaging and runtime

### Folder Responsibilities

#### `public/assets/images/`
Use for files that must exist at a stable, literal URL.

Examples:
- PWA manifest icons (`icon-192.png`, `icon-512.png`)
- Favicon-style assets referenced directly in HTML
- Critical branding images that should be explicitly precached for offline startup

Characteristics:
- Served as-is at `/assets/images/...`
- Not fingerprinted by Vite
- Best for URL-contract files (manifest/HTML literals)

#### `assets/images/`
Use for application UI assets imported by code.

Examples:
- React component images (`import logo from '@assets/images/logo.png'`)
- Themed UI logos used in TSX modules
- Non-critical UI/media assets

Characteristics:
- Processed and fingerprinted by Vite during build
- Better cache busting when files change
- Preferred for most app-facing images

### Referencing Rules

1. Root HTML (`index.html`, `app.html`) and `manifest.webmanifest`:
- Use literal paths under `/assets/images/...` and ensure those files live in `public/assets/images/`.

2. React/TSX/CSS modules:
- Prefer imports from `assets/images/` (for example `@assets/images/...`).
- Avoid hardcoded `/assets/images/...` URLs in app code unless the file is intentionally served from `public`.

### PWA Caching Rules

1. Critical assets:
- Keep critical branding/icon assets in `public/assets/images/`.
- Include them in VitePWA `includeAssets` so they are precached and available offline on first app launch after service worker install.

2. Non-critical images:
- Use runtime caching (`CacheFirst`) for `/assets/*.(png|jpg|jpeg|svg|webp|gif)` so images are available offline after first successful online fetch.

3. Operational note:
- After deploy, open the app online once and refresh once to activate updated service worker caches before testing offline behavior.

### VS Code Extension Note

Do not assume web `public/` URL paths automatically map to extension webview paths.

For extension UI:
- Prefer extension-safe asset resolution and packaging conventions in extension code.
- Keep extension asset handling independent from web/PWA URL contracts where needed.
