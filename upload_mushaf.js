// upload_mushaf.js
// Lance depuis le terminal : node upload_mushaf.js
// Nécessite : npm install @supabase/supabase-js node-fetch

const { createClient } = require('@supabase/supabase-js');

// ⚠️ Remplace ces valeurs par tes vraies clés Supabase
const SUPABASE_URL = 'https://TON_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'TA_SERVICE_ROLE_KEY'; // Settings → API → service_role (pas anon)

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TOTAL_PAGES = 3; // TEST — change en 604 quand ça marche
const BUCKET = 'mushaf';

// Sources en cascade
const getSources = (pg) => {
  const pad = String(pg).padStart(3, '0');
  return [
    // Archive.org — fonctionne depuis browser
    `https://archive.org/download/al-quran-al-karim-tajwid-hafs/al-quran-al-karim-tajwid-hafs_jp2.zip/al-quran-al-karim-tajwid-hafs_jp2%2Fal-quran-al-karim-tajwid-hafs_${pad}.jp2`,
    // Alternative Archive.org PDF page directe
    `https://ia800305.us.archive.org/BookReader/BookReaderImages.php?zip=/30/items/al-quran-al-karim-tajwid-hafs/al-quran-al-karim-tajwid-hafs_jp2.zip&file=al-quran-al-karim-tajwid-hafs_jp2/al-quran-al-karim-tajwid-hafs_${pad}.jp2&id=al-quran-al-karim-tajwid-hafs&scale=2&rotate=0`,
  ];
};

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'image/webp,image/png,image/jpeg,image/*',
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error(`Trop petit (${buf.length} bytes) - probablement une erreur`);
  return buf;
}

async function uploadPage(pg) {
  const fileName = `tajweed/${String(pg).padStart(3, '0')}.jpg`;

  // Vérifier si déjà uploadé
  const { data: existing } = await supabase.storage.from(BUCKET).list('tajweed', {
    search: String(pg).padStart(3, '0')
  });
  if (existing?.length > 0) {
    console.log(`  ✓ Page ${pg} déjà uploadée`);
    return true;
  }

  const sources = getSources(pg);
  for (const url of sources) {
    try {
      const buf = await downloadImage(url);
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, buf, {
          contentType: 'image/jpeg',
          upsert: true,
          cacheControl: '31536000',
        });
      if (!error) {
        console.log(`  ✅ Page ${pg} uploadée (${Math.round(buf.length/1024)}KB)`);
        return true;
      }
      console.log(`  ⚠ Upload error page ${pg}:`, error.message);
    } catch(e) {
      console.log(`  ✗ Source ${url.slice(0,50)}... → ${e.message}`);
    }
  }
  return false;
}

async function main() {
  console.log('🚀 Upload Mushaf Tajweed → Supabase Storage');
  console.log(`📄 ${TOTAL_PAGES} pages à uploader\n`);

  let success = 0, failed = 0;
  const BATCH = 5; // 5 pages en parallèle

  for (let i = 1; i <= TOTAL_PAGES; i += BATCH) {
    const batch = [];
    for (let j = i; j < Math.min(i + BATCH, TOTAL_PAGES + 1); j++) {
      batch.push(j);
    }
    console.log(`Pages ${batch[0]}-${batch[batch.length-1]}...`);
    const results = await Promise.all(batch.map(uploadPage));
    success += results.filter(Boolean).length;
    failed += results.filter(r => !r).length;

    // Pause pour éviter le rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n✅ Terminé : ${success} uploadées, ${failed} échouées`);
  
  // Afficher l'URL de base pour l'app
  const { data } = supabase.storage.from(BUCKET).getPublicUrl('tajweed/001.jpg');
  const baseUrl = data.publicUrl.replace('001.jpg', '');
  console.log(`\n📎 URL base pour App.jsx :\n${baseUrl}`);
}

main().catch(console.error);
