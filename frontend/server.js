const http = require('http');
const fs = require('fs');
const path = require('path');

loadEnv();

const port = Number(process.env.PORT || 5500);
const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
const publicRoot = __dirname;
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function loadEnv() {
  const envFile = path.join(__dirname, '.env');
  if (!fs.existsSync(envFile)) return;
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

function send(response, status, contentType, content) {
  response.writeHead(status, {
    'Content-Type': contentType,
    'Cache-Control': contentType.startsWith('text/javascript') ? 'no-store' : 'public, max-age=300'
  });
  response.end(content);
}

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);

  if (pathname === '/config.js') {
    return send(
      response,
      200,
      mimeTypes['.js'],
      `window.APP_CONFIG = ${JSON.stringify({ API_BASE_URL: apiBaseUrl })};\n`
    );
  }

  const requestedPath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const filePath = path.resolve(publicRoot, `.${requestedPath}`);
  const relativePath = path.relative(publicRoot, filePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return send(response, 403, mimeTypes['.txt'], 'Erişim reddedildi');
  }

  fs.readFile(filePath, (error, content) => {
    if (error) return send(response, error.code === 'ENOENT' ? 404 : 500, mimeTypes['.txt'], 'Dosya bulunamadı');
    send(response, 200, mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream', content);
  });
});

server.listen(port, () => console.log(`Akgün frontend http://localhost:${port}`));
