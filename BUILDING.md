# Building the Extension

## Quick Start

```bash
bun install
bun run build
```

The complete extension will be in the `dist/` folder.

## Build Process

The build runs three steps:

1. **`bun run build:content`** - Bundles TypeScript/React code into `dist/index.js`
2. **`bun run build:css`** - Compiles Tailwind CSS into `dist/output.css`
3. **`bun run build:copy`** - Copies `manifest.json` and `icons/*.png` to `dist/`

## If Icons Don't Copy Automatically

If the automatic build doesn't copy icons, run manually:

```bash
chmod +x copy-icons-to-dist.sh
./copy-icons-to-dist.sh
```

Or copy manually:
```bash
mkdir -p dist/icons
cp icons/*.png dist/icons/
cp manifest.json dist/
```

## Verify Build

Check that `dist/` contains:
- `index.js` (bundled JavaScript, ~890KB)
- `output.css` (compiled Tailwind CSS)
- `manifest.json` (extension manifest)
- `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`

```bash
ls -la dist/
ls -la dist/icons/
```

## Load in Chrome

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the **`dist/`** folder

## Development

Watch mode (auto-rebuild on changes):
```bash
bun run dev
```

Note: Watch mode rebuilds code/CSS but doesn't auto-copy icons. If you change icons, re-run `bun run build:copy`.
