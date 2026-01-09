import { watch } from 'fs';

const PORT = 3000;

// Build the dev bundle
async function buildDev() {
  await Bun.build({
    entrypoints: ['./dev/main.tsx'],
    outdir: './dev-dist',
    target: 'browser',
  });
}

// Initial build
await buildDev();
console.log('Built dev bundle');

// Watch for changes
watch('./src', { recursive: true }, async (event: any, filename: any) => {
  console.log(`Detected ${event} in ${filename}, rebuilding...`);
  await buildDev();
  console.log('Rebuilt dev bundle');
});

watch('./dev/main.tsx', async (event: any, filename: any) => {
  console.log(`Detected ${event} in ${filename}, rebuilding...`);
  await buildDev();
  console.log('Rebuilt dev bundle');
});

// Serve files
Bun.serve({
  port: PORT,
  async fetch(req: any) {
    const url = new URL(req.url);
    let filePath = url.pathname;

    if (filePath === '/') {
      filePath = '/index.html';
    }

    // Map routes to files
    const fileMap: Record<string, string> = {
      '/index.html': './dev/index.html',
      '/dev.js': './dev-dist/main.js',
      '/output.css': './dist/output.css',
    };

    const actualPath = fileMap[filePath];
    if (actualPath) {
      const file = Bun.file(actualPath);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log(`Dev server running at http://localhost:${PORT}`);
