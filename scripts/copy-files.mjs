import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// Ensure dist/icons directory exists
mkdirSync('dist/icons', { recursive: true });

// Copy manifest.json
console.log('Copying manifest.json...');
copyFileSync('manifest.json', 'dist/manifest.json');

// Copy all icon files
console.log('Copying icons...');
try {
  const iconFiles = readdirSync('icons').filter(f => f.endsWith('.png'));
  iconFiles.forEach(file => {
    copyFileSync(join('icons', file), join('dist/icons', file));
    console.log(`  Copied ${file}`);
  });
} catch (err) {
  console.warn('Warning: Could not copy icons:', err.message);
}

console.log('\n✓ Build complete! Extension is ready in dist/ folder.');
