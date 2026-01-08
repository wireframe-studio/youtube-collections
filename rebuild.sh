#!/bin/bash
# Quick rebuild script for development

echo "🔨 Building YouTube Collections extension..."
echo ""

echo "📦 Bundling JavaScript..."
bun build src/content/index.tsx --outdir dist --target browser --minify

echo ""
echo "🎨 Compiling CSS..."
bunx @tailwindcss/cli -i ./src/styles/input.css -o ./dist/output.css

echo ""
echo "📋 Copying manifest and icons..."
cp manifest.json dist/
mkdir -p dist/icons
cp icons/*.png dist/icons/ 2>/dev/null

echo ""
echo "✅ Build complete! Load the 'dist' folder in Chrome."
