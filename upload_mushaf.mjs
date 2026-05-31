// upload_mushaf.mjs — ESM compatible
import { createClient } from '@supabase/supabase-js';

// ⚠️ REMPLACE CES DEUX VALEURS
const SUPABASE_URL = 'https://dccirpngkozsexrzuzgy.supabase.co';
const SUPABASE_KEY = 'sb_secret_dnpL1WTbrrb7WHBV7Y_hJA_QVAnMPqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET = 'mushaf';
const TOTAL_PAGES = 3; // Test d'abord — change en 604 quand ça marche

const getSources = (pg) => {
  const pad = String(pg).padStart(3, '0');
  return [
    `https://ia800305.us.archive.org/BookReader/BookReaderImages.php?zip=/30/items/al-quran-al-karim-tajwid-hafs/al-quran-al-karim-tajwid-hafs_jp2.zip&file=al-quran-al-karim-tajwid-hafs_jp2/al-quran-al-karim-tajwid-hafs_${pad}.jp2&id=al-quran-al-karim-tajwid-hafs&scale=2&rotate=0`,
    `https://ia803006.us.archive.org/BookReader/BookReaderImages.php?zip=/6/items/al-quran-al-karim-tajwid-hafs/al-quran-al-karim-tajwid-hafs_jp2.zip&file=al-quran-al-karim-tajwid-hafs_jp2/al-quran-al-karim-tajwid-hafs_${pad}.jp2&id=al-quran-al-karim-tajwid-hafs&scale=2&rotate=0`,
  ];
};

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'image/*' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error(`Trop petit: ${buf.length} bytes`);
  return buf;
}

async function uploadPage(pg) {
  const fileName = `tajweed/${String(pg).padStart(3,'0')}.jpg`;
  for (const url of getSources(pg)) {
    try {
      const buf = await downloadImage(url);
      const { error } = await supabase.storage.from(BUCKET).upload(fileName, buf, {
        contentType: 'image/jpeg', upsert: true, cacheControl: '31536000'
      });
      if (!error) { console.log(`  ✅ Page ${pg} (${Math.round(buf.length/1024)}KB)`); return true; }
      console.log(`  ⚠ Upload error:`, error.message);
    } catch(e) { console.log(`  ✗ ${e.message}`); }
  }
  return false;
}

async function main() {
  console.log(`🚀 Upload ${TOTAL_PAGES} pages → Supabase\n`);
  let ok=0, fail=0;
  for (let i=1; i<=TOTAL_PAGES; i++) {
    process.stdout.write(`Page ${i}... `);
    const r = await uploadPage(i);
    r ? ok++ : fail++;
    await new Promise(r=>setTimeout(r,300));
  }
  console.log(`\n✅ ${ok} uploadées, ${fail} échouées`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl('tajweed/001.jpg');
  console.log(`\n🔗 URL base: ${data.publicUrl.replace('001.jpg','')}`);
}

main().catch(console.error);
