#!/usr/bin/env bun
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Ensure dist directory exists
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

// Ensure dist/icons directory exists
if (!existsSync('dist/icons')) {
  mkdirSync('dist/icons', { recursive: true });
}

// Copy manifest.json
console.log('Copying manifest.json...');
copyFileSync('manifest.json', 'dist/manifest.json');

// Copy icons
console.log('Copying icons...');
const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png'];
iconFiles.forEach(file => {
  const srcPath = join('icons', file);
  const destPath = join('dist/icons', file);
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath);
  } else {
    console.warn(`Warning: ${srcPath} not found, skipping...`);
  }
});

console.log('Build complete! Extension is ready in dist/ folder.');
