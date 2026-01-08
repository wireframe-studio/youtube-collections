#!/bin/bash
# Manual script to copy icons to dist folder if build doesn't do it automatically

mkdir -p dist/icons
cp icons/*.png dist/icons/
cp manifest.json dist/

echo "✓ Icons and manifest copied to dist/"
ls -lh dist/icons/
