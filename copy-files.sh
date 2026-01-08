#!/bin/bash

# Copy manifest and icons to dist folder
echo "Copying manifest.json..."
cp manifest.json dist/

echo "Copying icons..."
mkdir -p dist/icons
cp icons/*.png dist/icons/ 2>/dev/null || echo "Warning: No icon files found"

echo "Build complete! Extension is ready in dist/ folder."
