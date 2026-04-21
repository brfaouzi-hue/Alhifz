export default async function handler(req, res) {
  const { page = "1", edition = "hafs" } = req.query;
  const pg = parseInt(page);
  if (!pg || pg < 1 || pg > 604) return res.status(400).json({ error: "Page invalide" });
  const pad = String(pg).padStart(3, "0");
  const urls = [
    `https://static.qurancdn.com/images/quran/pages/v4/en/${edition}/${pg}.png`,
    `https://quran.com/images/pages/page_${pad}.png`,
    `https://cdn.jsdelivr.net/gh/quran/quran.com-images@master/images/pages/page${pad}.png`,
    `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)",
          "Referer": "https://quran.com",
          "Accept": "image/*"
        }
      });
      if (r.ok) {
        const buf = await r.arrayBuffer();
        const ct = r.headers.get("content-type") || "image/jpeg";
        res.setHeader("Content-Type", ct);
        res.setHeader("Cache-Control", "public, max-age=31536000");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send(Buffer.from(buf));
      }
    } catch {}
  }
  return res.status(404).json({ error: "Image non trouvée" });
}
