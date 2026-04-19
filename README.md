# PoolCheck

A vision-based pool water test strip analyzer — no internet or API key required. Works fully offline as an installable Progressive Web App (PWA) on Android and iOS.

## How It Works

1. Photograph your Hach 4-in-1 test strip flat in good lighting
2. Drag a box over each of the 4 color pads (pH, Free Chlorine, Total Alkalinity, Stabilizer)
3. The app reads the pixel colors using CIELAB color science and matches them to the reference chart from your bottle
4. Results are shown instantly with OK / LOW / HIGH status and recommendations

## Installation on Android

1. Host the files on GitHub Pages or Netlify
2. Open the URL in Chrome on your Android device
3. Tap the **Install** banner or use ⋮ menu → Add to Home Screen
4. PoolCheck appears on your home screen and runs fully offline

## Color Science

- Converts sampled pixels to **CIELAB color space** for perceptually accurate color comparison
- Uses **CIE76 ΔE (Delta-E)** distance to find the closest match in the Hach reference chart
- Samples the **median pixel** from each selected region to ignore highlights and shadows
- Confidence score shown for each reading (Low / Medium / High)

## Reference Ranges (Hach 4-in-1 Strips)

| Parameter        | OK Range     |
|------------------|--------------|
| pH               | 7.2 – 7.8    |
| Free Chlorine    | 1 – 3 ppm    |
| Total Alkalinity | 80 – 120 ppm |
| Stabilizer (CYA) | 30 – 50 ppm  |

## Files

| File            | Purpose                                      |
|-----------------|----------------------------------------------|
| `index.html`    | Main app — all logic, UI, and color analysis |
| `sw.js`         | Service worker — offline caching + updates   |
| `manifest.json` | PWA manifest — icons, name, display mode     |
| `icons/`        | App icons in all required sizes              |

## Updating

To push a new version:
```bash
cd poolcheck-pwa
git add .
git commit -m "vN — description"
git push
```

When a new version is deployed, the app detects it in the background and shows an **⬆ Update App** button. Tapping it applies the update instantly.

---

## Changelog

### v7
- Removed version number from top header — version now only shown in footer
- **Auto-analyze**: after marking the last pad the app automatically runs analysis (no button tap needed)
- **Zoom crop**: canvas zooms in on the strip as pads are confirmed, eliminating irrelevant background and making subsequent pad selections easier

### v6
- **Responsive layout**: all sizing now uses `clamp()` so the UI scales fluidly to any screen size
- **Auto-advance on pad selection**: drag a valid region and the app automatically moves to the next pad after a brief flash — no separate "Next" button required
- Tab bar height measured dynamically and stored as a CSS variable so scroll areas always clear it correctly

### v5
- Fixed dynamic layout with proper flex column structure filling exactly `100dvh`
- Tab bar fixed to bottom of screen with safe area inset support
- Each page has a dedicated scroll area — content scrolls, buttons always reachable
- Version number now visible immediately on load (no async delay)

### v4
- Fixed version display — `APP_VERSION` hardcoded in `index.html` as single source of truth
- Version shown in header badge and footer on every page load
- Added **Update App** button: app detects new service worker in background and shows purple update banner + footer button
- Tapping either applies the update instantly and reloads

### v3
- Service worker bumped to `poolcheck-v3`; network-first strategy for HTML ensures updates are always picked up
- Version display synced between `index.html` and `sw.js`
- Footer added showing `PoolCheck · vN` at the bottom of every page

### v2
- Added **History tab** with persistent storage across sessions
- Every analysis automatically saved with date, time, and all 4 readings
- Color-coded overall status per entry (✅ All OK / ⬇️ Low / ⚠️ Issues)
- Clear All button to wipe history

### v1
- Initial release
- Camera/photo upload with canvas-based color analysis
- CIELAB Delta-E color matching against Hach 4-in-1 reference chart
- 4-pad marking wizard with drag-to-select regions
- Confidence bar per reading
- Recommendations generated from results

### v8
- **Strip region selection**: new first step prompts user to draw a box around the entire test strip before pad marking begins — the canvas then crops and zooms to just the strip, eliminating all background before any pad is selected
- **Update notification moved**: update available banner repositioned to bottom-left of screen so it no longer overlaps the Update App footer button

### v8 (rebuild)
- Complete clean rebuild from scratch — eliminated accumulated patching bugs
- **Strip region selection**: new dedicated step prompts user to draw a box around the entire test strip first; canvas then crops and zooms to just the strip before pad marking begins
- **Auto-analyze**: after the last pad is marked the analysis runs automatically with no extra button press
- **Update notification**: moved to bottom-left, compact size, no longer overlaps the Update App footer button
- Responsive layout with `clamp()` sizing throughout; fixed bottom tab bar with dynamic height measurement via CSS variable
- Shared drag engine (`attachDrag`) used consistently for both strip selection and pad marking

### v9
- **Canvas fits viewport without scrolling**: strip image is now sized using both width AND height constraints so the entire strip is always visible on screen during pad selection — no scrolling required
- Canvas `max-height` is calculated dynamically from the actual viewport height minus all UI elements (header, instruction row, progress dots, swatches, button, tab bar)
- Same height-aware sizing applied to the strip region selection step
- All confirmed pad markers remain visible on the canvas while selecting remaining pads
