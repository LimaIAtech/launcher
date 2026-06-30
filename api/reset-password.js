const { parseBody } = require('./_helpers');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, newPassword } = await parseBody(req);

  const r = await fetch(`${process.env.MONITOR_URL}/api/dashboard-auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: process.env.MONITOR_SLUG, token, newPassword }),
  });
  const data = await r.json();

  if (!r.ok) return res.status(r.status).json(data);
  return res.status(200).json({ ok: true });
};
