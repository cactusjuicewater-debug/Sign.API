const { send, preflight } = require('../lib/util');

module.exports = (req, res) => {
  if (preflight(req, res)) return;
  send(res, 200, {
    name: 'Artist Signature API',
    endpoints: {
      health: '/v1/health',
      signatures: '/v1/signatures?artist=NAME',
      name: '/v1/name/NAME',
      search: '/v1/search?q=TEXT'
    }
  });
};
