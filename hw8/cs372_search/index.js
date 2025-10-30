// hw8/cs372_search/index.js
const express = require('express');
const https = require('https');
const path = require('path');

const PORT = 3720;
const PUBLIC_DIR = path.join(__dirname, 'public');
const INDEX_HTML = path.join(PUBLIC_DIR, 'index.html');
const OWM_API_KEY = "b448c6e3a5055ae3c1c8accbd08216db";

function fetchTemp(cityQuery, cb) {
  if (!OWM_API_KEY) return cb(new Error('Missing OWM_API_KEY'));
  const apiURL = new URL('https://api.openweathermap.org/data/2.5/weather');
  apiURL.searchParams.set('q', cityQuery);
  apiURL.searchParams.set('appid', OWM_API_KEY);
  apiURL.searchParams.set('units', 'imperial');

  https.get(apiURL, (r) => {
    let body = '';
    r.on('data', (chunk) => (body += chunk));
    r.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.cod && Number(json.cod) !== 200) return cb(new Error(json.message || 'API error'), json);
        cb(null, {
          ok: true,
          city: json.name,
          temp_f: json.main?.temp,
          weather: json.weather?.[0]?.description || '',
        });
      } catch (e) {
        cb(e);
      }
    });
  }).on('error', (e) => cb(e));
}

const app = express();

app.use(express.static(PUBLIC_DIR));

app.get('/', (_req, res) => {
  res.sendFile(INDEX_HTML);
});

app.get('/index.js', (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.redirect('/');

  if (!q.toLowerCase().startsWith('temp:')) {
    return res.redirect(`https://www.google.com/search?q=${encodeURIComponent(q)}`);
  }

  const cityQuery = q.slice(5).trim();
  if (!cityQuery) return res.status(400).json({ ok: false, error: 'No city specified.' });

  fetchTemp(cityQuery, (err, data) => {
    if (err) return res.status(502).json({ ok: false, error: String(err.message || err) });
    res.json(data);
  });
});

app.listen(PORT, () => {
  console.log(`CS372 Search server running at http://localhost:${PORT}`);
});
