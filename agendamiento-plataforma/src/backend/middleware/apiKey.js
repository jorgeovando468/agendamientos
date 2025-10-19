module.exports = function apiKey(req, res, next) {
  const configuredKey = process.env.API_KEY;
  if (!configuredKey) return next();
  const provided = req.header('x-api-key');
  if (provided === configuredKey) return next();
  return res.status(401).json({ error: 'Unauthorized' });
};