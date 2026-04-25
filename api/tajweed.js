export default async function handler(req, res) {
  const { page } = req.query;
  const pg = parseInt(page) || 1;

  try {
    const r = await fetch(
      `https://api.qurancdn.com/api/qdc/verses/by_page/${pg}?language=ar&words=false&per_page=50&fields=text_uthmani_tajweed,text_uthmani,verse_number,chapter_id`,
      { headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" } }
    );
    if (!r.ok) throw new Error(`API ${r.status}`);
    const data = await r.json();
    const verses = data.verses || [];

    // Couleurs tajweed — classes CSS de qurancdn
    const C = {
      ham_wasl:"#AAAAAA", slnt:"#AAAAAA", laam_shamsiyya:"#AAAAAA",
      madda_normal:"#537FFF", madda_permissible:"#4050FF",
      madda_necessary:"#000EBC", madda_obligatory:"#2144C1",
      qalaqah:"#DD8800",
      ikhafa_shafawi:"#D500B7", ikhafa:"#D500B7",
      idgham_shafawi:"#58B800", idgham_ghunnah:"#169200",
      idgham_wo_ghunnah:"#169200", idgham_mutajanisayn:"#169200",
      idgham_mutaqaribayn:"#169200", ghunnah:"#169200",
      iqlab:"#26BFFD",
      izhar_shafawi:"#58B800", izhar_qamariyya:"#2D9660",
    };

    // Parser le HTML tajweed de qurancdn
    // Format : <tajweed class="xxx">text</tajweed>
    function colorize(html) {
      return html.replace(
        /<tajweed class="([^"]+)">([^<]*)<\/tajweed>/g,
        (_, cls, text) => {
          const color = C[cls] || null;
          return color
            ? `<span style="color:${color};font-weight:bold">${text}</span>`
            : text;
        }
      ).replace(/<[^>]+>/g, ''); // strip remaining tags
    }

    let content = '';
    let lastChapter = null;

    for (const v of verses) {
      const chId = v.chapter_id;
      const raw = v.text_uthmani_tajweed || v.text_uthmani || '';
      const colored = colorize(raw);

      // En-tête sourate si nouveau chapitre
      if (chId !== lastChapter) {
        lastChapter = chId;
        if (v.verse_number === 1) {
          const surahName = verses.find(x => x.chapter_id === chId)?.chapter_id;
          content += `<div class="surah-name">سورة</div>`;
          if (chId !== 1 && chId !== 9) {
            content += `<div class="basmala">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>`;
          }
        }
      }

      content += `<span class="verse">${colored}<span class="num"> ﴿${v.verse_number}﴾ </span></span>`;
    }

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  background:#faf7f2;
  font-family:'Scheherazade New',serif;
  padding:16px 14px 60px;
  direction:rtl;
}
.page-num{
  text-align:center;
  font-size:.75rem;
  color:#8a7050;
  margin-bottom:14px;
  font-family:sans-serif;
  direction:ltr;
  letter-spacing:1px;
}
.content{
  text-align:justify;
  font-size:1.9rem;
  line-height:3.0;
  color:#1a0a00;
  word-spacing:3px;
}
.verse{display:inline}
.num{
  font-size:.9rem;
  color:#c9a84c;
  margin:0 2px;
  vertical-align:middle;
  font-family:'Scheherazade New',serif;
}
.surah-name{
  display:block;
  text-align:center;
  background:linear-gradient(135deg,#2c1810,#4a2c18);
  color:#e8c060;
  padding:10px 16px;
  border-radius:8px;
  margin:8px 0 12px;
  font-size:1.4rem;
  letter-spacing:3px;
}
.basmala{
  display:block;
  text-align:center;
  background:#f0e8d4;
  color:#1a0a00;
  padding:8px 16px;
  border-radius:8px;
  margin:0 0 14px;
  font-size:1.8rem;
  line-height:2;
}
.legend{
  margin-top:18px;
  padding-top:12px;
  border-top:1px solid #e0d4c0;
  display:flex;
  flex-wrap:wrap;
  gap:8px 14px;
  justify-content:center;
  direction:ltr;
}
.li{
  display:flex;
  align-items:center;
  gap:4px;
  font-size:.62rem;
  font-family:sans-serif;
  color:#6a5a40;
}
.dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
</style>
</head>
<body>
<div class="page-num">Page ${pg} / 604 — Tajweed</div>
<div class="content">${content}</div>
<div class="legend">
  <div class="li"><div class="dot" style="background:#537FFF"></div>Madd naturel</div>
  <div class="li"><div class="dot" style="background:#000EBC"></div>Madd nécessaire</div>
  <div class="li"><div class="dot" style="background:#DD8800"></div>Qalqala</div>
  <div class="li"><div class="dot" style="background:#D500B7"></div>Ikhfâ</div>
  <div class="li"><div class="dot" style="background:#169200"></div>Idghâm / Ghunna</div>
  <div class="li"><div class="dot" style="background:#26BFFD"></div>Iqlab</div>
  <div class="li"><div class="dot" style="background:#AAAAAA"></div>Liaison</div>
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
