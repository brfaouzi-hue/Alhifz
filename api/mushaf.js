export default async function handler(req, res) {
  const { page = "1" } = req.query;
  const pg = parseInt(page);
  if (!pg || pg < 1 || pg > 604) return res.status(400).json({ error: "Page invalide" });
  const num = String(pg).padStart(3, "0");
  const url = `https://www.searchtruth.com/quran/images/large/${num}.jpg`;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error();
    const buf = await r.arrayBuffer();
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000");
    return res.send(Buffer.from(buf));
  } catch {
    return res.status(404).json({ error: "Image non trouvée" });
  }
}
