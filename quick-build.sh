#!/bin/bash
cd /Users/mfucek/Documents/projects/youtube-sub-manager-2
echo "Building..."
bun build src/content/index.tsx --outdir dist --target browser --minify && \
bunx @tailwindcss/cli -i ./src/styles/input.css -o ./dist/output.css --minify && \
cp manifest.json dist/ && \
cp icons/*.png dist/icons/ 2>/dev/null
echo "✓ Done!"
