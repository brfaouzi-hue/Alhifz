export default async function handler(req, res) {
  const { page = "1", edition = "hafs" } = req.query;
  const pg = parseInt(page);

  if (!pg || pg < 1 || pg > 604) {
    return res.status(400).json({ error: "Page invalide (1-604)" });
  }

  // URLs par édition — tentées dans l'ordre
  const urls = {
    hafs: [
      `https://static.qurancdn.com/images/quran/pages/v4/en/hafs/${pg}.png`,
      `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
    ],
    warsh: [
      `https://static.qurancdn.com/images/quran/pages/v4/en/warsh/${pg}.png`,
      `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
    ],
    indopak: [
      `https://static.qurancdn.com/images/quran/pages/v4/en/indopak/${pg}.png`,
      `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
    ],
  };

  const candidates = urls[edition] || urls.hafs;

  for (const url of candidates) {
    try {
      const upstream = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      if (upstream.ok) {
        const contentType = upstream.headers.get("Content-Type") || "image/jpeg";
        const buffer = await upstream.arrayBuffer();

        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send(Buffer.from(buffer));
      }
    } catch {
      // essaie l'URL suivante
      continue;
    }
  }

  return res.status(404).json({ error: "Image non trouvée" });
}
