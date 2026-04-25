// api/tajweed.js — Génère une page Mushaf en SVG/HTML avec tajweed coloré
// Utilise l'API quran.com qui est publique et accessible depuis Vercel

export default async function handler(req, res) {
  const { page } = req.query;
  const pg = parseInt(page) || 1;

  try {
    // API quran.com v4 — publique, pas de restrictions IP
    const r = await fetch(
      `https://api.quran.com/api/v4/verses/by_page/${pg}?language=ar&words=true&word_fields=text_uthmani,text_uthmani_tajweed&per_page=50&fields=text_uthmani_tajweed,chapter_id,verse_number`,
      { headers: { "Accept": "application/json" } }
    );

    if (!r.ok) throw new Error(`quran.com API ${r.status}`);
    const data = await r.json();
    const verses = data.verses || [];

    // Couleurs tajweed standard
    const COLORS = {
      "ham_wasl": "#AAAAAA",
      "slnt": "#AAAAAA",
      "laam_shamsiyya": "#AAAAAA",
      "madda_normal": "#537FFF",
      "madda_permissible": "#4050FF",
      "madda_necessary": "#000EBC",
      "madda_obligatory": "#2144C1",
      "qalaqah": "#DD8800",
      "ikhafa_shafawi": "#D500B7",
      "ikhafa": "#D500B7",
      "idgham_shafawi": "#58B800",
      "idgham_ghunnah": "#169200",
      "idgham_wo_ghunnah": "#169200",
      "idgham_mutajanisayn": "#169200",
      "idgham_mutaqaribayn": "#169200",
      "ghunnah": "#169200",
      "iqlab": "#26BFFD",
      "izhar_shafawi": "#58B800",
      "izhar": "#58B800",
      "izhar_qamariyya": "#2D9660",
    };

    // Construire le HTML de la page
    let verseBlocks = "";
    for (const v of verses) {
      const ar = (v.text_uthmani_tajweed || v.text_uthmani || "")
        .replace(/<tajweed class="([^"]*)">(.*?)<\/tajweed>/g, (_, cls, text) => {
          const color = COLORS[cls] || "#1a0a00";
          return `<span style="color:${color};font-weight:bold">${text}</span>`;
        })
        .replace(/<[^>]*>/g, "");

      verseBlocks += `
        <div class="verse">
          <span class="text">${ar}</span>
          <span class="num">﴿${v.verse_number}﴾</span>
        </div>`;
    }

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    background: #faf7f2;
    font-family: 'Scheherazade New', serif;
    padding: 20px 16px 40px;
    min-height: 100vh;
  }
  .page-header {
    text-align: center;
    font-size: 1rem;
    color: #8a7050;
    margin-bottom: 16px;
    font-family: sans-serif;
    direction: ltr;
  }
  .content {
    direction: rtl;
    text-align: justify;
    font-size: 2rem;
    line-height: 3.2;
    color: #1a0a00;
    word-spacing: 4px;
  }
  .verse { display: inline; }
  .text { display: inline; }
  .num {
    font-size: 1rem;
    color: #c9a84c;
    margin: 0 4px;
    font-family: 'Scheherazade New', serif;
    vertical-align: middle;
  }
  .surah-header {
    text-align: center;
    background: linear-gradient(135deg, #2c1810, #4a2c18);
    color: #e8c060;
    padding: 12px 20px;
    border-radius: 10px;
    margin-bottom: 16px;
    font-size: 1.4rem;
    letter-spacing: 2px;
    display: block;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 0;
    margin-top: 20px;
    border-top: 1px solid #e0d8cc;
    direction: ltr;
    justify-content: center;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.65rem;
    font-family: sans-serif;
    color: #6a5a40;
  }
  .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
</style>
</head>
<body>
  <div class="page-header">Page ${pg} / 604</div>
  <div class="content">${verseBlocks}</div>
  <div class="legend">
    <div class="legend-item"><div class="dot" style="background:#537FFF"></div>Madd naturel</div>
    <div class="legend-item"><div class="dot" style="background:#000EBC"></div>Madd nécessaire</div>
    <div class="legend-item"><div class="dot" style="background:#DD8800"></div>Qalqala</div>
    <div class="legend-item"><div class="dot" style="background:#D500B7"></div>Ikhfâ</div>
    <div class="legend-item"><div class="dot" style="background:#169200"></div>Idghâm/Ghunna</div>
    <div class="legend-item"><div class="dot" style="background:#26BFFD"></div>Iqlab</div>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.send(html);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
