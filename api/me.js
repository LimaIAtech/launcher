const { verifySession, getSessionCookie } = require('./_helpers');

module.exports = (req, res) => {
  const token   = getSessionCookie(req);
  const payload = verifySession(token, process.env.SESSION_SECRET);
  if (!payload) return res.status(401).json({ error: 'Não autenticado.' });
  return res.status(200).json({ ok: true });
};
