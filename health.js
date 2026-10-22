const { data, send, preflight } = require('../lib/util');

// GET /v1/health  (BitChord saves the URL only if this answers 2xx)
module.exports = (req, res) => {
  if (preflight(req, res)) return;
  send(res, 200, { ok: true, artists: data.length });
};
