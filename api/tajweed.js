// api/tajweed.js — Proxy Vercel pour images tajweed
export default async function handler(req, res) {
  const { page } = req.query;
  if (!page) return res.status(400).end("missing page");

  const pg = parseInt(page) || 1;
  const pad = String(pg).padStart(3, "0");

  const sources = [
    `https://static.qurancdn.com/images/quran/pages/v4/tajweed/page${pad}.png`,
    `https://static.qurancdn.com/images/quran/pages/v4/en/hafs/page${pad}.png`,
    `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
    `https://cdn.islamic.network/quran/images/${pg}.jpg`,
  ];

  const headers = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
    "Accept": "image/webp,image/png,image/*,*/*",
    "Referer": "https://quran.com/",
    "Origin": "https://quran.com",
  };

  for (const url of sources) {
    try {
      const r = await fetch(url, { headers });
      if (r.ok) {
        const buf = await r.arrayBuffer();
        const ct = r.headers.get("content-type") || "image/jpeg";
        res.setHeader("Content-Type", ct);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("X-Source", url);
        return res.send(Buffer.from(buf));
      }
    } catch(e) { continue; }
  }

  res.status(404).json({ error: "not found", tried: sources });
}
