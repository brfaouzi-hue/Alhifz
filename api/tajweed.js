// api/tajweed.js — Proxy Vercel pour images tajweed qurancdn
export default async function handler(req, res) {
  const { page } = req.query;
  if (!page) return res.status(400).end("missing page");

  const pad = String(page).padStart(3, "0");
  const sources = [
    `https://static.qurancdn.com/images/quran/pages/v4/tajweed/page${pad}.png`,
    `https://cdn.islamic.network/quran/images/high-resolution/${page}.jpg`,
  ];

  for (const url of sources) {
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://quran.com/" },
      });
      if (r.ok) {
        const buf = await r.arrayBuffer();
        const ct = r.headers.get("content-type") || "image/png";
        res.setHeader("Content-Type", ct);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send(Buffer.from(buf));
      }
    } catch {}
  }
  res.status(404).end("image not found");
}
