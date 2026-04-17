export default async function handler(req, res) {
  const { page = "1" } = req.query;
  const pg = parseInt(page);
  if (!pg || pg < 1 || pg > 604) return res.status(400).json({ error: "Page invalide" });
  const urls = [
    `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
    `https://cdn.islamic.network/quran/images/${pg}.jpg`,
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://quran.com" } });
      if (r.ok) {
        const buf = await r.arrayBuffer();
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=31536000");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send(Buffer.from(buf));
      }
    } catch {}
  }
  return res.status(404).json({ error: "Image non trouvée" });
}
