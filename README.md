# YouTube Collections

Organize your YouTube subscriptions into custom categories and filter your feed with ease.

## Features

- 📁 Create custom categories with icons and colors
- 🎯 Filter your subscription feed by categories (OR logic)
- 🔄 Auto-detect channels from your subscriptions
- 🎨 Beautiful dark mode UI that matches YouTube's design
- 💾 Persistent filters (until browser restart)
- 🚀 Fast and lightweight

## Installation

### Prerequisites

- [Bun](https://bun.sh) installed on your system
- Google Chrome or Chromium-based browser

### Steps

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Build the extension**
   ```bash
   bun run build
   ```

4. **Add your icons** (icon16.png, icon48.png, icon128.png)
   - Place your icon files in the `icons/` directory
   - You can use any PNG images sized appropriately (16x16, 48x48, 128x128)

5. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the root directory of this project (where `manifest.json` is located)

6. **Start using it!**
   - Go to [YouTube Subscriptions](https://www.youtube.com/feed/channels) to scan your channels
   - Go to [YouTube Feed](https://www.youtube.com/feed/subscriptions) to use the extension

## Development Workflow

### Watch Mode

To automatically rebuild when you make changes:

```bash
bun run dev
```

This will watch for changes in your source files and automatically rebuild both the TypeScript/React code and the Tailwind CSS.

### Manual Build

If you prefer to build manually:

```bash
bun run build
```

### Seeing Changes in Chrome

After making changes to the code:

1. **Rebuild the extension** (either automatically via watch mode or manually with `bun run build`)
2. **Reload the extension in Chrome:**
   - Go to `chrome://extensions/`
   - Find "YouTube Collections"
   - Click the refresh/reload icon
3. **Reload the YouTube page** you're testing on (F5 or Cmd+R)

> **Tip:** Keep the Chrome Extensions page open in a tab for quick reloading during development.

### Project Structure

```
youtube-sub-manager-2/
├── src/
│   ├── components/          # React components
│   │   ├── CategoryCircle.tsx
│   │   ├── CategorySection.tsx
│   │   ├── Modal.tsx
│   │   ├── CategoryManagement.tsx
│   │   ├── ChannelAssignment.tsx
│   │   └── IconPicker.tsx
│   ├── content/            # Content script entry
│   │   └── index.tsx
│   ├── styles/             # Tailwind CSS
│   │   └── input.css
│   ├── types.ts            # TypeScript types
│   ├── storage.ts          # Chrome storage utilities
│   ├── channelScraper.ts   # Channel detection logic
│   └── videoFilter.ts      # Video filtering logic
├── dist/                   # Build output (generated)
├── icons/                  # Extension icons
├── manifest.json           # Chrome extension manifest
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## How It Works

### Channel Detection

- Visit the [YouTube Channels page](https://www.youtube.com/feed/channels)
- The extension automatically scans all your subscribed channels
- A progress indicator appears while scanning
- Channel data is stored locally in Chrome storage

### Creating Categories

1. On the [Subscriptions feed](https://www.youtube.com/feed/subscriptions), click the Settings icon
2. Click "New Category"
3. Choose a name, icon, and color
4. Click "Create"

### Assigning Channels

1. Open the modal (Settings icon)
2. Switch to the "Channels by Category" tab
3. Use the dropdown for each channel to assign it to categories
4. A channel can belong to multiple categories

### Filtering Videos

1. On the Subscriptions feed, click on category circles to toggle filters
2. Multiple categories use OR logic (show videos from ANY selected category)
3. Click "Show All" to clear filters

### Filter Persistence

- Filters persist across page navigations within the same browser session
- Filters are cleared when you close the browser
- This prevents stale filters from cluttering your feed on a fresh start

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **Bun** - Build tool and package manager
- **Chrome Extension Manifest V3** - Extension platform

## Troubleshooting

### Extension not appearing on YouTube

- Make sure you're on `https://www.youtube.com/feed/subscriptions`
- Check that the extension is enabled in `chrome://extensions/`
- Try reloading the YouTube page

### Channels not detected

- Visit `https://www.youtube.com/feed/channels` and wait for the scan to complete
- Make sure the page has fully loaded before the scan starts
- Check the browser console for errors (F12)

### Videos not filtering

- Ensure you've created categories and assigned channels to them
- Verify that filters are active (category circles should be highlighted)
- Try clicking "Show All" then re-enabling filters

### Build errors

- Make sure you have Bun installed: `bun --version`
- Delete `node_modules` and `dist`, then run `bun install` and `bun run build`
- Check that all files in `src/` are present

## License

MIT License - feel free to use and modify as needed!
