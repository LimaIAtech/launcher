const { parseBody, signSession } = require('./_helpers');

const MONITOR_URL  = process.env.MONITOR_URL;
const MONITOR_SLUG = process.env.MONITOR_SLUG;
const SECRET       = process.env.SESSION_SECRET;
const DURATION     = 60 * 60 * 24 * 7; // 7 dias

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = await parseBody(req);
  if (!password) return res.status(400).json({ error: 'Senha obrigatória.' });

  const r = await fetch(`${MONITOR_URL}/api/dashboard-auth/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: MONITOR_SLUG, password }),
  });
  const data = await r.json();

  if (!data.valid) return res.status(401).json({ error: 'Senha incorreta.' });

  const now = Math.floor(Date.now() / 1000);
  const token = signSession({ sub: 'admin', iat: now, exp: now + DURATION }, SECRET);

  res.setHeader('Set-Cookie',
    `painel_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${DURATION}`);
  return res.status(200).json({ ok: true });
};
