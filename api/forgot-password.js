module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  await fetch(`${process.env.MONITOR_URL}/api/dashboard-auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: process.env.MONITOR_SLUG,
      base_url: process.env.BASE_URL,
    }),
  });

  return res.status(200).json({ ok: true });
};
