const { parseBody, verifySession, getSessionCookie } = require('./_helpers');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const payload = verifySession(getSessionCookie(req), process.env.SESSION_SECRET);
  if (!payload) return res.status(401).json({ error: 'Não autenticado.' });

  const { currentPassword, newPassword } = await parseBody(req);

  const r = await fetch(`${process.env.MONITOR_URL}/api/dashboard-auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: process.env.MONITOR_SLUG, currentPassword, newPassword }),
  });
  const data = await r.json();

  if (!r.ok) return res.status(r.status).json(data);
  return res.status(200).json({ ok: true });
};
