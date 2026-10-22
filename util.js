const data = require('../data/signatures.json');

const norm = (s) =>
  String(s || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const index = data.map((a) => ({ a, keys: [a.name, ...(a.aliases || [])].map(norm) }));

function baseUrl(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  return `${proto}://${req.headers.host}`;
}

const artistOf = (a) => ({ id: a.id, name: a.name, years: a.years || null });

function sigOf(a, req) {
  const ext = a.file.split('.').pop().toLowerCase();
  return {
    id: a.id,
    type: a.type || 'handwritten',
    format: ext === 'jpg' ? 'jpeg' : ext,
    asset: `${baseUrl(req)}/signatures/${a.file}`,
    width: a.width || 600,
    height: a.height || 260,
    license: a.license || { name: 'Unknown', url: '', status: 'unknown' },
    source: a.source || { provider: 'self', url: '' },
    verification: a.verified ? 'verified' : 'unverified',
    verified: !!a.verified
  };
}

// Exact name or alias wins. Otherwise a name prefix: one hit is used,
// several hits are returned as "matches" so the app never shows a wrong pick.
function lookup(name) {
  const full = String(name || '');
  const parts = full.split(/,|;|&|\bfeat\.?|\bft\.?/i);
  const candidates = [full, ...parts].map(norm).filter(Boolean);
  for (const q of candidates) {
    const hit = index.find((e) => e.keys.includes(q));
    if (hit) return { one: hit.a };
  }
  const q = candidates[0];
  if (q && q.length >= 3) {
    const hits = index.filter((e) => e.keys.some((k) => k.startsWith(q))).map((e) => e.a);
    if (hits.length === 1) return { one: hits[0] };
    if (hits.length > 1) return { many: hits };
  }
  return null;
}

function params(req) {
  return new URL(req.url, 'http://local');
}

function send(res, status, body, cache) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (cache) res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.end(JSON.stringify(body));
}

const fail = (res, status, code, message) => send(res, status, { error: { code, message } });

function preflight(req, res) {
  if (req.method !== 'OPTIONS') return false;
  res.statusCode = 204;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.end();
  return true;
}

module.exports = { data, norm, lookup, artistOf, sigOf, params, send, fail, preflight };
