const { lookup, artistOf, sigOf, params, send, fail, preflight } = require('../lib/util');

// GET /v1/signatures?artist=NAME[&format=svg][&type=handwritten][&verified=true]
// GET /v1/name/NAME
module.exports = (req, res) => {
  if (preflight(req, res)) return;
  const url = params(req);
  const p = url.searchParams;
  let artist = p.get('artist') || (req.query && req.query.artist) || '';
  if (!artist && url.pathname.startsWith('/v1/name/')) {
    artist = decodeURIComponent(url.pathname.slice('/v1/name/'.length));
  }
  if (!artist) return fail(res, 400, 'bad_request', 'Provide ?artist=NAME');

  const found = lookup(artist);
  if (!found) return fail(res, 404, 'not_found', 'No signature for this artist');
  if (found.many) {
    return send(res, 200, { matches: found.many.map((a) => ({ id: a.id, name: a.name })) }, true);
  }

  let sigs = [sigOf(found.one, req)];
  const format = p.get('format');
  const type = p.get('type');
  if (format) sigs = sigs.filter((s) => s.format === format);
  if (type) sigs = sigs.filter((s) => s.type === type);
  if (p.get('verified') === 'true') sigs = sigs.filter((s) => s.verified);
  if (!sigs.length) return fail(res, 404, 'not_found', 'No signature matches those filters');

  send(res, 200, { artist: artistOf(found.one), signatures: sigs }, true);
};
