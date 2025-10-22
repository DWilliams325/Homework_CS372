const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3720;
const PUBLIC_DIR = path.join(__dirname, 'public');
const INDEX_HTML = path.join(PUBLIC_DIR, 'index.html');
const OWM_API_KEY = "Personal_API KEY"; // openwaether api key

function sendFile(res, filePath, contentType = 'text/html') {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain' });
      res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json; charset=utf-8',
  }[ext] || 'application/octet-stream');
}

function serveStatic(res, reqPath) {
  const safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    sendFile(res, filePath, contentTypeFor(filePath));
  });
}

function fetchTemp(cityQuery, cb) {
  if (!OWM_API_KEY) {
    cb(new Error('Missing OWM_API_KEY environment variable.'));
    return;
  }
  const apiURL = new URL('https://api.openweathermap.org/data/2.5/weather');
  apiURL.searchParams.set('q', cityQuery);
  apiURL.searchParams.set('appid', OWM_API_KEY);
  apiURL.searchParams.set('units', 'metric');

  https.get(apiURL, (r) => {
    let body = '';
    r.on('data', (chunk) => (body += chunk));
    r.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.cod && json.cod !== 200) {
          cb(new Error(json.message || 'API error'), json);
          return;
        }
        const out = {
          ok: true,
          city: json.name,
          temp_c: json.main?.temp,
          weather: json.weather?.[0]?.description || '',
        };
        cb(null, out);
      } catch (e) {
        cb(e);
      }
    });
  }).on('error', (e) => cb(e));
}

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/' || (pathname === '/index.js' && !query.q)) {
    return sendFile(res, INDEX_HTML, 'text/html; charset=utf-8');
  }

  if (pathname === '/index.js' && typeof query.q === 'string') {
    const q = query.q.trim();
    if (!q.toLowerCase().startsWith('temp:')) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: 'Query must start with Temp:' }));
    }
    const cityQuery = q.slice(5).trim(); 
    if (!cityQuery) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: 'No city specified.' }));
    }
    fetchTemp(cityQuery, (err, data) => {
      if (err) {
        res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: false, error: String(err.message || err) }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
    });
    return;
  }

  if (pathname.startsWith('/')) {
    const reqPath = pathname === '/index.html' ? '/index.html' : pathname;
    return serveStatic(res, reqPath);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`CS372 Search server running at http://localhost:${PORT}`);
});
//push