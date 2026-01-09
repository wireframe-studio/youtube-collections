import { watch } from 'fs';

const PORT = 3000;

// Track connected clients for hot reload
const clients = new Set<ReadableStreamDefaultController>();

// Build the dev bundle
async function buildDev() {
  await Bun.build({
    entrypoints: ['./dev/main.tsx'],
    outdir: './dev-dist',
    target: 'browser',
  });
}

// Notify all clients to reload
function notifyClients() {
  for (const controller of clients) {
    try {
      controller.enqueue('data: reload\n\n');
    } catch (e) {
      clients.delete(controller);
    }
  }
}

// Initial build
await buildDev();
console.log('Built dev bundle');

// Watch for changes
watch('./src', { recursive: true }, async (event: any, filename: any) => {
  console.log(`Detected ${event} in ${filename}, rebuilding...`);
  await buildDev();
  console.log('Rebuilt dev bundle');
  notifyClients();
});

watch('./dev/main.tsx', async (event: any, filename: any) => {
  console.log(`Detected ${event} in ${filename}, rebuilding...`);
  await buildDev();
  console.log('Rebuilt dev bundle');
  notifyClients();
});

// Watch CSS changes (CSS is rebuilt by build:css --watch)
watch('./dist/output.css', async (event: any, filename: any) => {
  console.log(`Detected CSS change, reloading...`);
  notifyClients();
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

    // Server-Sent Events endpoint for hot reload
    if (filePath === '/hot-reload') {
      const stream = new ReadableStream({
        start(controller) {
          clients.add(controller);
          controller.enqueue('data: connected\n\n');
        },
        cancel() {
          clients.delete(stream as any);
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
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
