// Servidor estático mínimo y SENSIBLE a mayúsculas (como GitHub Pages / Linux).
// Así "Ingreso.html" vs "ingreso.html" falla igual en Windows que en producción.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.env.SITE_DIR || path.join(__dirname, '..'));
const PORT = Number(process.env.PORT || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
};

// Resuelve la ruta verificando mayúsculas/minúsculas segmento por segmento.
function resolveExact(urlPath) {
  const segs = decodeURIComponent(urlPath).split('/').filter(Boolean);
  let cur = ROOT;
  for (const s of segs) {
    if (s === '..') return null;
    let names;
    try { names = fs.readdirSync(cur); } catch { return null; }
    // Distingue mayúsculas/minúsculas, pero tolera tildes guardadas de otra forma
    // (NFC "Ú" vs NFD "U"+tilde), que Windows/macOS/Linux manejan distinto.
    const real = names.find((n) => n === s) || names.find((n) => n.normalize('NFC') === s.normalize('NFC'));
    if (!real) return null;
    cur = path.join(cur, real);
  }
  return cur;
}

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0].split('#')[0];
  let file = resolveExact(urlPath);
  if (file && fs.statSync(file).isDirectory()) file = resolveExact(path.posix.join(urlPath, 'index.html'));
  if (!file || !fs.existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }
  const stat = fs.statSync(file);
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const range = req.headers.range; // necesario para video/audio (seek)
  if (range) {
    const [s, e] = range.replace('bytes=', '').split('-');
    const start = Number(s), end = e ? Number(e) : stat.size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Sitio servido en http://localhost:${PORT} desde ${ROOT}`));
