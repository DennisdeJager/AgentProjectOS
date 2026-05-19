import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApiRequest } from './lib/api.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';

const server = http.createServer(async (req, res) => {
  try {
    if (req.url?.startsWith('/api/')) {
      await handleApiRequest(req, res, rootDir);
      return;
    }

    await serveStatic(req, res);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: { code: 'server_error', message: error.message } }));
  }
});

server.listen(port, host, () => {
  console.log(`Agent Project OS running at http://${host}:${port}`);
});

async function serveStatic(req, res) {
  const url = new URL(req.url ?? '/', `http://${host}:${port}`);
  const requestedPath = decodeURIComponent(url.pathname);
  const filePath = requestedPath === '/' ? path.join(distDir, 'index.html') : path.join(distDir, requestedPath);
  const safePath = path.normalize(filePath);

  if (!safePath.startsWith(distDir)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  try {
    const stat = await fs.stat(safePath);
    if (stat.isFile()) {
      res.setHeader('Content-Type', contentType(safePath));
      res.end(await fs.readFile(safePath));
      return;
    }
  } catch {
    // Fall through to SPA fallback.
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(await fs.readFile(path.join(distDir, 'index.html')));
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}

