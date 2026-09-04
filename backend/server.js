const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

loadEnv();
const port = Number(process.env.PORT || 3001);
const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:5500';
const dataFile = path.resolve(__dirname, process.env.DATA_FILE || './data/products.json');
const adminPassword = process.env.ADMIN_PASSWORD || '';
const tokenSecret = process.env.ADMIN_TOKEN_SECRET || '';
const loginAttempts = new Map();

function loadEnv() {
  const envFile = path.join(__dirname, '.env');
  if (!fs.existsSync(envFile)) return;
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

function readProducts() { return JSON.parse(fs.readFileSync(dataFile, 'utf8')); }
function writeProducts(products) { fs.writeFileSync(dataFile, JSON.stringify(products, null, 2) + '\n'); }
function send(response, status, body) {
  response.writeHead(status, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization'});
  response.end(body === undefined ? '' : JSON.stringify(body));
}
function body(request) {
  return new Promise((resolve, reject) => { let raw = ''; request.on('data', chunk => raw += chunk); request.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('Geçersiz JSON')); } }); });
}

function sameText(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function createToken() {
  const payload = Buffer.from(JSON.stringify({exp: Date.now() + 8 * 60 * 60 * 1000})).toString('base64url');
  const signature = crypto.createHmac('sha256', tokenSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
function isAuthorized(request) {
  if (!tokenSecret) return false;
  const token = (request.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = crypto.createHmac('sha256', tokenSecret).update(payload).digest('base64url');
  if (!sameText(signature, expected)) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url')).exp > Date.now(); } catch { return false; }
}
function canAttemptLogin(ip) {
  const now = Date.now();
  const recent = (loginAttempts.get(ip) || []).filter(time => now - time < 15 * 60 * 1000);
  loginAttempts.set(ip, recent);
  return recent.length < 5;
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return send(response, 204);
  if (request.url === '/api/health' && request.method === 'GET') return send(response, 200, {ok: true});
  if (request.url === '/api/auth/login' && request.method === 'POST') {
    const ip = request.socket.remoteAddress || 'unknown';
    if (!canAttemptLogin(ip)) return send(response, 429, {error: 'Çok fazla deneme. Lütfen 15 dakika sonra tekrar deneyin.'});
    try {
      const credentials = await body(request);
      if (!adminPassword || !tokenSecret || !sameText(credentials.password || '', adminPassword)) {
        loginAttempts.get(ip).push(Date.now());
        return send(response, 401, {error: 'Yönetici şifresi hatalı.'});
      }
      loginAttempts.delete(ip);
      return send(response, 200, {token: createToken()});
    } catch (error) { return send(response, 400, {error: error.message}); }
  }
  if (request.url === '/api/auth/session' && request.method === 'GET') {
    return send(response, isAuthorized(request) ? 200 : 401, {authenticated: isAuthorized(request)});
  }
  if (!request.url.startsWith('/api/products')) return send(response, 404, {error: 'Bulunamadı'});
  if (request.method !== 'GET' && !isAuthorized(request)) return send(response, 401, {error: 'Yönetici girişi gerekli.'});
  try {
    const products = readProducts();
    const match = request.url.match(/^\/api\/products\/?(\d+)?(?:\?.*)?$/);
    const id = match && match[1] ? Number(match[1]) : null;
    if (request.method === 'GET') return send(response, 200, id ? products.find(product => product.id === id) || {error: 'Ürün bulunamadı'} : products);
    if (request.method === 'POST') {
      const product = await body(request);
      const created = {...product, id: Date.now()};
      products.unshift(created); writeProducts(products); return send(response, 201, created);
    }
    if (!id) return send(response, 400, {error: 'Ürün kimliği gerekli'});
    const index = products.findIndex(product => product.id === id);
    if (index < 0) return send(response, 404, {error: 'Ürün bulunamadı'});
    if (request.method === 'PUT') { products[index] = {...products[index], ...(await body(request)), id}; writeProducts(products); return send(response, 200, products[index]); }
    if (request.method === 'DELETE') { products.splice(index, 1); writeProducts(products); return send(response, 204); }
    return send(response, 405, {error: 'Method desteklenmiyor'});
  } catch (error) { send(response, 500, {error: error.message}); }
});
if (!adminPassword || !tokenSecret) console.warn('UYARI: ADMIN_PASSWORD ve ADMIN_TOKEN_SECRET ayarlanmadı; yönetici girişi kapalı.');
server.listen(port, () => console.log(`Akgün API http://localhost:${port}`));
