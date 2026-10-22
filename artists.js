const { data, norm, artistOf, params, send, preflight } = require('../lib/util');

// GET /v1/search?q=exa
module.exports = (req, res) => {
  if (preflight(req, res)) return;
  const q = norm(params(req).searchParams.get('q'));
  const results = data
    .filter((a) => !q || [a.name, ...(a.aliases || [])].some((n) => norm(n).includes(q)))
    .map(artistOf);
  send(res, 200, { results, next: null }, true);
};
