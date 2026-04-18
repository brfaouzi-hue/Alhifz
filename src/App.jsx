import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";

const SURAHS = [
  {n:1,name:"Al-Fatiha",ar:"الفاتحة",v:7,juz:1,type:"Mecquoise"},
  {n:2,name:"Al-Baqara",ar:"البقرة",v:286,juz:1,type:"Médinoise"},
  {n:3,name:"Al-Imran",ar:"آل عمران",v:200,juz:3,type:"Médinoise"},
  {n:4,name:"An-Nisa",ar:"النساء",v:176,juz:4,type:"Médinoise"},
  {n:5,name:"Al-Maida",ar:"المائدة",v:120,juz:6,type:"Médinoise"},
  {n:6,name:"Al-Anam",ar:"الأنعام",v:165,juz:7,type:"Mecquoise"},
  {n:7,name:"Al-Araf",ar:"الأعراف",v:206,juz:8,type:"Mecquoise"},
  {n:8,name:"Al-Anfal",ar:"الأنفال",v:75,juz:9,type:"Médinoise"},
  {n:9,name:"At-Tawba",ar:"التوبة",v:129,juz:10,type:"Médinoise"},
  {n:10,name:"Yunus",ar:"يونس",v:109,juz:11,type:"Mecquoise"},
  {n:11,name:"Hud",ar:"هود",v:123,juz:11,type:"Mecquoise"},
  {n:12,name:"Yusuf",ar:"يوسف",v:111,juz:12,type:"Mecquoise"},
  {n:13,name:"Ar-Ra\u2019d",ar:"الرعد",v:43,juz:13,type:"Médinoise"},
  {n:14,name:"Ibrahim",ar:"إبراهيم",v:52,juz:13,type:"Mecquoise"},
  {n:15,name:"Al-Hijr",ar:"الحجر",v:99,juz:14,type:"Mecquoise"},
  {n:16,name:"An-Nahl",ar:"النحل",v:128,juz:14,type:"Mecquoise"},
  {n:17,name:"Al-Isra",ar:"الإسراء",v:111,juz:15,type:"Mecquoise"},
  {n:18,name:"Al-Kahf",ar:"الكهف",v:110,juz:15,type:"Mecquoise"},
  {n:19,name:"Maryam",ar:"مريم",v:98,juz:16,type:"Mecquoise"},
  {n:20,name:"Ta-Ha",ar:"طه",v:135,juz:16,type:"Mecquoise"},
  {n:21,name:"Al-Anbiya",ar:"الأنبياء",v:112,juz:17,type:"Mecquoise"},
  {n:22,name:"Al-Hajj",ar:"الحج",v:78,juz:17,type:"Médinoise"},
  {n:23,name:"Al-Muminun",ar:"المؤمنون",v:118,juz:18,type:"Mecquoise"},
  {n:24,name:"An-Nur",ar:"النور",v:64,juz:18,type:"Médinoise"},
  {n:25,name:"Al-Furqan",ar:"الفرقان",v:77,juz:18,type:"Mecquoise"},
  {n:26,name:"Ash-Shuara",ar:"الشعراء",v:227,juz:19,type:"Mecquoise"},
  {n:27,name:"An-Naml",ar:"النمل",v:93,juz:19,type:"Mecquoise"},
  {n:28,name:"Al-Qasas",ar:"القصص",v:88,juz:20,type:"Mecquoise"},
  {n:29,name:"Al-Ankabut",ar:"العنكبوت",v:69,juz:20,type:"Mecquoise"},
  {n:30,name:"Ar-Rum",ar:"الروم",v:60,juz:21,type:"Mecquoise"},
  {n:31,name:"Luqman",ar:"لقمان",v:34,juz:21,type:"Mecquoise"},
  {n:32,name:"As-Sajda",ar:"السجدة",v:30,juz:21,type:"Mecquoise"},
  {n:33,name:"Al-Ahzab",ar:"الأحزاب",v:73,juz:21,type:"Médinoise"},
  {n:34,name:"Saba",ar:"سبأ",v:54,juz:22,type:"Mecquoise"},
  {n:35,name:"Fatir",ar:"فاطر",v:45,juz:22,type:"Mecquoise"},
  {n:36,name:"Ya-Sin",ar:"يس",v:83,juz:22,type:"Mecquoise"},
  {n:37,name:"As-Saffat",ar:"الصافات",v:182,juz:23,type:"Mecquoise"},
  {n:38,name:"Sad",ar:"ص",v:88,juz:23,type:"Mecquoise"},
  {n:39,name:"Az-Zumar",ar:"الزمر",v:75,juz:23,type:"Mecquoise"},
  {n:40,name:"Ghafir",ar:"غافر",v:85,juz:24,type:"Mecquoise"},
  {n:41,name:"Fussilat",ar:"فصلت",v:54,juz:24,type:"Mecquoise"},
  {n:42,name:"Ash-Shura",ar:"الشورى",v:53,juz:25,type:"Mecquoise"},
  {n:43,name:"Az-Zukhruf",ar:"الزخرف",v:89,juz:25,type:"Mecquoise"},
  {n:44,name:"Ad-Dukhan",ar:"الدخان",v:59,juz:25,type:"Mecquoise"},
  {n:45,name:"Al-Jathiya",ar:"الجاثية",v:37,juz:25,type:"Mecquoise"},
  {n:46,name:"Al-Ahqaf",ar:"الأحقاف",v:35,juz:26,type:"Mecquoise"},
  {n:47,name:"Muhammad",ar:"محمد",v:38,juz:26,type:"Médinoise"},
  {n:48,name:"Al-Fath",ar:"الفتح",v:29,juz:26,type:"Médinoise"},
  {n:49,name:"Al-Hujurat",ar:"الحجرات",v:18,juz:26,type:"Médinoise"},
  {n:50,name:"Qaf",ar:"ق",v:45,juz:26,type:"Mecquoise"},
  {n:51,name:"Adh-Dhariyat",ar:"الذاريات",v:60,juz:26,type:"Mecquoise"},
  {n:52,name:"At-Tur",ar:"الطور",v:49,juz:27,type:"Mecquoise"},
  {n:53,name:"An-Najm",ar:"النجم",v:62,juz:27,type:"Mecquoise"},
  {n:54,name:"Al-Qamar",ar:"القمر",v:55,juz:27,type:"Mecquoise"},
  {n:55,name:"Ar-Rahman",ar:"الرحمن",v:78,juz:27,type:"Mecquoise"},
  {n:56,name:"Al-Waqia",ar:"الواقعة",v:96,juz:27,type:"Mecquoise"},
  {n:57,name:"Al-Hadid",ar:"الحديد",v:29,juz:27,type:"Médinoise"},
  {n:58,name:"Al-Mujadila",ar:"المجادلة",v:22,juz:28,type:"Médinoise"},
  {n:59,name:"Al-Hashr",ar:"الحشر",v:24,juz:28,type:"Médinoise"},
  {n:60,name:"Al-Mumtahina",ar:"الممتحنة",v:13,juz:28,type:"Médinoise"},
  {n:61,name:"As-Saf",ar:"الصف",v:14,juz:28,type:"Médinoise"},
  {n:62,name:"Al-Jumua",ar:"الجمعة",v:11,juz:28,type:"Médinoise"},
  {n:63,name:"Al-Munafiqun",ar:"المنافقون",v:11,juz:28,type:"Médinoise"},
  {n:64,name:"At-Taghabun",ar:"التغابن",v:18,juz:28,type:"Médinoise"},
  {n:65,name:"At-Talaq",ar:"الطلاق",v:12,juz:28,type:"Médinoise"},
  {n:66,name:"At-Tahrim",ar:"التحريم",v:12,juz:28,type:"Médinoise"},
  {n:67,name:"Al-Mulk",ar:"الملك",v:30,juz:29,type:"Mecquoise"},
  {n:68,name:"Al-Qalam",ar:"القلم",v:52,juz:29,type:"Mecquoise"},
  {n:69,name:"Al-Haqqa",ar:"الحاقة",v:52,juz:29,type:"Mecquoise"},
  {n:70,name:"Al-Maarij",ar:"المعارج",v:44,juz:29,type:"Mecquoise"},
  {n:71,name:"Nuh",ar:"نوح",v:28,juz:29,type:"Mecquoise"},
  {n:72,name:"Al-Jinn",ar:"الجن",v:28,juz:29,type:"Mecquoise"},
  {n:73,name:"Al-Muzzammil",ar:"المزمل",v:20,juz:29,type:"Mecquoise"},
  {n:74,name:"Al-Muddaththir",ar:"المدثر",v:56,juz:29,type:"Mecquoise"},
  {n:75,name:"Al-Qiyama",ar:"القيامة",v:40,juz:29,type:"Mecquoise"},
  {n:76,name:"Al-Insan",ar:"الإنسان",v:31,juz:29,type:"Médinoise"},
  {n:77,name:"Al-Mursalat",ar:"المرسلات",v:50,juz:29,type:"Mecquoise"},
  {n:78,name:"An-Naba",ar:"النبأ",v:40,juz:30,type:"Mecquoise"},
  {n:79,name:"An-Naziat",ar:"النازعات",v:46,juz:30,type:"Mecquoise"},
  {n:80,name:"Abasa",ar:"عبس",v:42,juz:30,type:"Mecquoise"},
  {n:81,name:"At-Takwir",ar:"التكوير",v:29,juz:30,type:"Mecquoise"},
  {n:82,name:"Al-Infitar",ar:"الانفطار",v:19,juz:30,type:"Mecquoise"},
  {n:83,name:"Al-Mutaffifin",ar:"المطففين",v:36,juz:30,type:"Mecquoise"},
  {n:84,name:"Al-Inshiqaq",ar:"الانشقاق",v:25,juz:30,type:"Mecquoise"},
  {n:85,name:"Al-Buruj",ar:"البروج",v:22,juz:30,type:"Mecquoise"},
  {n:86,name:"At-Tariq",ar:"الطارق",v:17,juz:30,type:"Mecquoise"},
  {n:87,name:"Al-Ala",ar:"الأعلى",v:19,juz:30,type:"Mecquoise"},
  {n:88,name:"Al-Ghashiya",ar:"الغاشية",v:26,juz:30,type:"Mecquoise"},
  {n:89,name:"Al-Fajr",ar:"الفجر",v:30,juz:30,type:"Mecquoise"},
  {n:90,name:"Al-Balad",ar:"البلد",v:20,juz:30,type:"Mecquoise"},
  {n:91,name:"Ash-Shams",ar:"الشمس",v:15,juz:30,type:"Mecquoise"},
  {n:92,name:"Al-Layl",ar:"الليل",v:21,juz:30,type:"Mecquoise"},
  {n:93,name:"Ad-Duha",ar:"الضحى",v:11,juz:30,type:"Mecquoise"},
  {n:94,name:"Ash-Sharh",ar:"الشرح",v:8,juz:30,type:"Mecquoise"},
  {n:95,name:"At-Tin",ar:"التين",v:8,juz:30,type:"Mecquoise"},
  {n:96,name:"Al-Alaq",ar:"العلق",v:19,juz:30,type:"Mecquoise"},
  {n:97,name:"Al-Qadr",ar:"القدر",v:5,juz:30,type:"Mecquoise"},
  {n:98,name:"Al-Bayyina",ar:"البينة",v:8,juz:30,type:"Médinoise"},
  {n:99,name:"Az-Zalzala",ar:"الزلزلة",v:8,juz:30,type:"Médinoise"},
  {n:100,name:"Al-Adiyat",ar:"العاديات",v:11,juz:30,type:"Mecquoise"},
  {n:101,name:"Al-Qaria",ar:"القارعة",v:11,juz:30,type:"Mecquoise"},
  {n:102,name:"At-Takathur",ar:"التكاثر",v:8,juz:30,type:"Mecquoise"},
  {n:103,name:"Al-Asr",ar:"العصر",v:3,juz:30,type:"Mecquoise"},
  {n:104,name:"Al-Humaza",ar:"الهمزة",v:9,juz:30,type:"Mecquoise"},
  {n:105,name:"Al-Fil",ar:"الفيل",v:5,juz:30,type:"Mecquoise"},
  {n:106,name:"Quraysh",ar:"قريش",v:4,juz:30,type:"Mecquoise"},
  {n:107,name:"Al-Maun",ar:"الماعون",v:7,juz:30,type:"Mecquoise"},
  {n:108,name:"Al-Kawthar",ar:"الكوثر",v:3,juz:30,type:"Mecquoise"},
  {n:109,name:"Al-Kafirun",ar:"الكافرون",v:6,juz:30,type:"Mecquoise"},
  {n:110,name:"An-Nasr",ar:"النصر",v:3,juz:30,type:"Médinoise"},
  {n:111,name:"Al-Masad",ar:"المسد",v:5,juz:30,type:"Mecquoise"},
  {n:112,name:"Al-Ikhlas",ar:"الإخلاص",v:4,juz:30,type:"Mecquoise"},
  {n:113,name:"Al-Falaq",ar:"الفلق",v:5,juz:30,type:"Mecquoise"},
  {n:114,name:"An-Nas",ar:"الناس",v:6,juz:30,type:"Mecquoise"},
];
const TOTAL_VERSES = SURAHS.reduce((s,x)=>s+x.v,0);

const Q = {
};
const QURAN_THEMES = [
  {id:"patience",label:"La Patience",icon:"⏳",color:"#4fc3f7",verses:[{s:2,v:153},{s:2,v:155},{s:2,v:177},{s:3,v:17},{s:3,v:200},{s:8,v:46},{s:16,v:126},{s:39,v:10},{s:103,v:3}],desc:"As-Sabr — fondement de la foi"},
  {id:"gratitude",label:"La Gratitude",icon:"🤲",color:"#22c55e",verses:[{s:2,v:152},{s:14,v:7},{s:16,v:114},{s:31,v:12},{s:34,v:15},{s:55,v:13},{s:76,v:3}],desc:"Ash-Shukr — reconnaître les bienfaits"},
  {id:"pardon",label:"Le Pardon",icon:"💚",color:"#a855f7",verses:[{s:2,v:286},{s:3,v:135},{s:4,v:110},{s:7,v:199},{s:24,v:22},{s:39,v:53},{s:42,v:40},{s:64,v:14}],desc:"Al-Maghfira — miséricorde divine"},
  {id:"mort",label:"La Mort & L'au-delà",icon:"🌙",color:"#ef4444",verses:[{s:2,v:281},{s:3,v:185},{s:21,v:35},{s:29,v:57},{s:39,v:42},{s:56,v:60},{s:67,v:2},{s:75,v:26}],desc:"Al-Mawt — rappel de la fin"},
  {id:"paradise",label:"Le Paradis",icon:"🌿",color:"#22c55e",verses:[{s:2,v:25},{s:3,v:133},{s:13,v:35},{s:47,v:15},{s:55,v:46},{s:56,v:15},{s:76,v:5},{s:98,v:8}],desc:"Al-Janna — la demeure éternelle"},
  {id:"tawakkul",label:"La Confiance en Allah",icon:"☪",color:"#c9a84c",verses:[{s:3,v:159},{s:3,v:160},{s:8,v:2},{s:9,v:51},{s:14,v:12},{s:39,v:38},{s:65,v:3}],desc:"At-Tawakkul — s'en remettre à Allah"},
  {id:"dhikr",label:"Le Rappel d'Allah",icon:"📿",color:"#e2c46a",verses:[{s:2,v:152},{s:3,v:41},{s:13,v:28},{s:18,v:24},{s:33,v:41},{s:62,v:10},{s:87,v:15}],desc:"Adh-Dhikr — se souvenir d'Allah"},
  {id:"akhira",label:"Le Jour du Jugement",icon:"⚖️",color:"#ff9800",verses:[{s:1,v:4},{s:2,v:281},{s:18,v:49},{s:39,v:68},{s:56,v:1},{s:69,v:13},{s:82,v:1},{s:99,v:7}],desc:"Yawm al-Qiyama — le Grand Jour"},
];

const ld=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
const today=()=>new Date().toISOString().split("T")[0];

const getRamadanInfo=()=>{
  const now=new Date();
  const KNOWN_RAMADAN=new Date("2026-02-18"); // début Ramadan 1447
  const HIJRI_YEAR=354.367;
  let start=new Date(KNOWN_RAMADAN);
  while(start>now) start=new Date(start.getTime()-HIJRI_YEAR*86400000);
  while(new Date(start.getTime()+HIJRI_YEAR*86400000)<now) start=new Date(start.getTime()+HIJRI_YEAR*86400000);
  const nextStart=new Date(start.getTime()+HIJRI_YEAR*86400000);
  const end=new Date(start.getTime()+29*86400000);
  const nextEnd=new Date(nextStart.getTime()+29*86400000);
  const isActive=now>=start&&now<=end;
  const target=isActive?end:(now<start?start:nextStart);
  const daysLeft=Math.ceil((target.getTime()-now.getTime())/86400000);
  const dayIn=isActive?Math.floor((now.getTime()-start.getTime())/86400000)+1:0;
  return{isActive,daysLeft,dayIn,start,end,totalDays:30};
};

const THEMES={
  dark:{bg:"#050608",s1:"#090c10",s2:"#0e1218",s3:"#13181f",b1:"#181f28",b2:"#1e2733",
    acc:"#c9a84c",acc2:"#e2c46a",acc3:"#f5dc8c",gr:"#22c55e",grD:"rgba(34,197,94,.12)",
    tx:"#e2e8f0",tx2:"#94a3b8",tx3:"#4b5c70",rd:"#ef4444",bl:"#4fc3f7",pu:"#a855f7",
    navBg:"#090c10",cardBg:"#090c10",inputBg:"#0e1218",hero:"linear-gradient(160deg,#0e1218,#13181f)"},
  light:{bg:"#f0f7f0",s1:"#ffffff",s2:"#f4faf4",s3:"#e8f5e8",b1:"#d0e8d0",b2:"#bddcbd",
    acc:"#2e7d32",acc2:"#388e3c",acc3:"#43a047",gr:"#2e7d32",grD:"rgba(46,125,50,.12)",
    tx:"#1a2e1a",tx2:"#3d5c3d",tx3:"#6a8f6a",rd:"#c62828",bl:"#1565c0",pu:"#6a1b9a",
    navBg:"#ffffff",cardBg:"#ffffff",inputBg:"#f4faf4",hero:"linear-gradient(160deg,#e8f5e8,#c8e6c9)"},
  andalous:{bg:"#0d0a06",s1:"#130e08",s2:"#1a1409",s3:"#221a0e",b1:"#2e2010",b2:"#3d2c15",
    acc:"#d4892a",acc2:"#e8a840",acc3:"#f5c860",gr:"#4e9c6a",grD:"rgba(78,156,106,.12)",
    tx:"#f0e8d8",tx2:"#c4a87a",tx3:"#7a5c35",rd:"#c0392b",bl:"#2980b9",pu:"#8e44ad",
    navBg:"#0d0a06",cardBg:"#130e08",inputBg:"#1a1409",
    hero:"linear-gradient(160deg,#1a0e06,#2a1a0a)",
    arabesque:true},
  ottoman:{bg:"#04080f",s1:"#070e18",s2:"#0a1420",s3:"#0e1c2e",b1:"#142438",b2:"#1c3050",
    acc:"#c8102e",acc2:"#e8203e",acc3:"#f5405a",gr:"#2ecc71",grD:"rgba(46,204,113,.12)",
    tx:"#e8f0f8",tx2:"#8aafcc",tx3:"#4a6a88",rd:"#e74c3c",bl:"#3498db",pu:"#9b59b6",
    navBg:"#04080f",cardBg:"#070e18",inputBg:"#0a1420",
    hero:"linear-gradient(160deg,#070e18,#0e1c2e)",
    arabesque:true},
  abbasid:{bg:"#080600",s1:"#100c00",s2:"#181200",s3:"#201800",b1:"#2a2000",b2:"#382a00",
    acc:"#f0c040",acc2:"#f8d860",acc3:"#fff080",gr:"#50c878",grD:"rgba(80,200,120,.12)",
    tx:"#fff8e8",tx2:"#d4b060",tx3:"#806030",rd:"#e74c3c",bl:"#3498db",pu:"#9b59b6",
    navBg:"#080600",cardBg:"#100c00",inputBg:"#181200",
    hero:"linear-gradient(160deg,#100c00,#201800)",
    arabesque:true},
};

const THEME_META={
  dark:{label:"Nuit",sub:"Sobre et élégant",preview:["#050608","#c9a84c","#22c55e"]},
  light:{label:"Clarté",sub:"Thème vert naturel",preview:["#f0f7f0","#2e7d32","#388e3c"]},
  andalous:{label:"Andalousie",sub:"Alhambra — or et terre",preview:["#0d0a06","#d4892a","#4e9c6a"]},
  ottoman:{label:"Ottomane",sub:"İznik — rouge impérial",preview:["#04080f","#c8102e","#2ecc71"]},
  abbasid:{label:"Abbasside",sub:"Bagdad — or sur noir",preview:["#080600","#f0c040","#50c878"]},
};
const TJC_DARK={
  m:"#4FC3F7",      // Madd naturel (2h) — bleu clair comme Mushaf
  mr:"#0288D1",     // Madd permissible (2-4-6h) — bleu moyen
  mo:"#880E4F",     // Madd wajib muttasil (4-5h) — bordeaux/magenta
  ml:"#B71C1C",     // Madd lazim (6h) — rouge foncé comme Mushaf
  g:"#2E7D32",      // Ghunna — vert foncé
  idg:"#388E3C",    // Idgham avec ghunna — vert
  q:"#B71C1C",      // Qalqala — rouge (comme Mushaf standard)
  ikh:"#F57F17",    // Ikhfa — jaune-orange
  iql:"#E65100",    // Iqlab — orange foncé
  ls:"#01579B",     // Lam shamsiyya — bleu foncé
  hw:"#546E7A",     // Ham Wasl — gris bleu
  sl:"#607d8b",     // Silence/Sakt — gris bleu
};
const TJC_LIGHT={
  m:"#0277BD",      // Madd naturel — bleu
  mr:"#01579B",     // Madd permissible — bleu foncé
  mo:"#880E4F",     // Madd wajib — bordeaux
  ml:"#B71C1C",     // Madd lazim — rouge foncé
  g:"#1B5E20",      // Ghunna — vert très foncé
  idg:"#2E7D32",    // Idgham — vert foncé
  q:"#B71C1C",      // Qalqala — rouge
  ikh:"#E65100",    // Ikhfa — orange
  iql:"#BF360C",    // Iqlab — orange-rouge
  ls:"#01579B",     // Lam shamsiyya
  hw:"#37474F",     // Ham Wasl
  sl:"#263238",
};

const Icons = {
  Book:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>),
  Brain:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>),
  Star:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  Chart:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  Moon:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
  Sun:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
  Check:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  Play:({size=24,color="currentColor",fill=false})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill={fill?color:"none"} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>),
  Settings:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
  Scroll:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>),
  Share:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>),
  Heart:({size=24,color="currentColor",filled=false})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:"none"} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>),
  List:({size=24,color="currentColor"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
};

function CalligraphyBurst({text, onDone}) {
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:500,pointerEvents:"none",
      display:"flex",alignItems:"center",justifyContent:"center",
    }}>
      <div style={{
        fontFamily:"'Amiri Quran',serif",fontSize:"clamp(1.5rem,5vw,3rem)",
        direction:"rtl",textAlign:"center",color:"#c9a84c",
        textShadow:"0 0 30px #c9a84c88,0 0 60px #c9a84c44",
        animation:"calligIn .6s cubic-bezier(.34,1.56,.64,1) forwards",
        maxWidth:"80vw",lineHeight:1.8,padding:20,
        background:"radial-gradient(ellipse,rgba(0,0,0,.7),transparent 70%)",
        borderRadius:20,
      }}>
        {text}
        <div style={{fontSize:".75rem",color:"#c9a84c88",marginTop:8,fontFamily:"'DM Sans',sans-serif",textAlign:"center",direction:"ltr"}}>
          ✓ Mémorisé
        </div>
      </div>
      <style>{`
        @keyframes calligIn {
          0%{opacity:0;transform:scale(.3) rotate(-10deg);}
          60%{opacity:1;transform:scale(1.1) rotate(2deg);}
          80%{transform:scale(.95) rotate(-1deg);}
          100%{opacity:1;transform:scale(1) rotate(0);}
        }
      `}</style>
    </div>
  );
}

function HourglassIcon({pct=0.5, color="#c9a84c", size=32}) {
  const sandFill = Math.max(0, Math.min(1, 1 - pct));
  const topH = 14 * sandFill;
  const botH = 14 * (1 - sandFill * 0.3);
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{display:"block"}}>
      <defs>
        <linearGradient id="hg_grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.4"/>
        </linearGradient>
        <clipPath id="hg_top_clip">
          <polygon points="6,3 26,3 19,16 13,16"/>
        </clipPath>
        <clipPath id="hg_bot_clip">
          <polygon points="13,16 19,16 26,29 6,29"/>
        </clipPath>
      </defs>
      <polygon points="6,3 26,3 19,16 13,16" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.7"/>
      <polygon points="13,16 19,16 26,29 6,29" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.7"/>
      <line x1="4" y1="2" x2="28" y2="2" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="4" y1="30" x2="28" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="6" y={3 + (13 - topH)} width="20" height={topH} fill="url(#hg_grad)" clipPath="url(#hg_top_clip)" opacity="0.85"/>
      <rect x="6" y={29 - botH * 0.6} width="20" height={botH * 0.6} fill={color} clipPath="url(#hg_bot_clip)" opacity="0.6"/>
      {sandFill > 0.05 && sandFill < 0.95 && (
        <circle cx="16" cy="17.5" r="1.2" fill={color} opacity="0.9">
          <animate attributeName="cy" values="16;19;16" dur="1.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.4s" repeatCount="indefinite"/>
        </circle>
      )}
    </svg>
  );
}

const TAJWID_CLASS_COLORS={
  "madda_normal":        tjc=>tjc.m,   // Madd naturel (2 harakats)
  "madda_permissible":   tjc=>tjc.mr,  // Madd permissible (2, 4 ou 6h)
  "madda_necessary":     tjc=>tjc.ml,  // Madd lazim (6h obligatoire)
  "madda_obligatory":    tjc=>tjc.mo,  // Madd wajib muttasil (4-5h)
  "madda_wajib":         tjc=>tjc.mo,
  "ghunnah":             tjc=>tjc.g,
  "idgham_with_ghunnah": tjc=>tjc.g,
  "idgham_ghunnah":      tjc=>tjc.g,
  "idgham_mutajanisayn": tjc=>tjc.g,
  "idgham_mutaqaribayn": tjc=>tjc.idg,
  "idgham_without_ghunnah": tjc=>tjc.idg,
  "idgham_shafawi":      tjc=>tjc.g,
  "qalaqah":             tjc=>tjc.q,
  "ikhafa":              tjc=>tjc.ikh,
  "ikhafa_shafawi":      tjc=>tjc.ikh,
  "ikhafa_with_ghunnah": tjc=>tjc.ikh,
  "iqlab":               tjc=>tjc.iql,
  "laam_shamsiyah":      tjc=>tjc.ls,
  "ham_wasl":            ()=>null,
  "silent":              ()=>null,
  "sakt":                tjc=>tjc.sl,
};

function HifzVerseText({ar, level, tjc, showTj, vmark, onRevealWord}) {
  const clean=(ar||"").replace(/<[^>]*>/g,"");
  const words=clean.split(/\s+/).filter(Boolean);
  const total=words.length;
  const hiddenCount=Math.round(total*(level/5));
  const visibleCount=total-hiddenCount;
  
  return (
    <bdi style={{direction:"rtl",lineHeight:2.4,letterSpacing:0}}>
      {words.map((w,i)=>{
        const isHidden=i>=visibleCount;
        if(isHidden) return (
          <span key={i}
            title="Appuie pour révéler"
            onClick={onRevealWord}
            style={{
              display:"inline-block",
              background:tjc?tjc.q+"33":"rgba(120,80,0,.25)",
              border:"1px solid rgba(201,168,76,.2)",
              borderRadius:4,
              padding:"0 3px",
              margin:"0 2px",
              cursor:"pointer",
              minWidth:"1.5em",
              textAlign:"center",
              color:"transparent",
              userSelect:"none",
              transition:"all .2s",
              verticalAlign:"middle",
            }}>
            {w}
          </span>
        );
        return <span key={i} style={{display:"inline"}}><TajwidSpan text={w} enabled={showTj} tjc={tjc}/>{" "}</span>;
      })}
      <span style={{fontFamily:"'Amiri',serif",fontSize:".72rem",color:"#c9a84c",margin:"0 4px",verticalAlign:"middle"}}>﴿{vmark}﴾</span>
    </bdi>
  );
}

function TajwidSpan({text,enabled,tjc}) {
  const raw=text||"";
  const clean=raw.replace(/\[[a-z]+\](.*?)\[\/[a-z]+\]/g,"$1");

  if(!enabled){
    return <bdi style={{direction:"rtl"}}>{clean.replace(/<[^>]*>/g,"")}</bdi>;
  }

  if(!clean.includes("<tajweed")){
    return <bdi style={{direction:"rtl",letterSpacing:0}}>{clean.replace(/<[^>]*>/g,"")}</bdi>;
  }

  const parts=[];
  let i=0,key=0;
  while(i<clean.length){
    if(clean[i]!=="<"){
      let j=i;
      while(j<clean.length&&clean[j]!=="<")j++;
      const chunk=clean.slice(i,j);
      if(chunk) parts.push(<React.Fragment key={key++}>{chunk}</React.Fragment>);
      i=j;
      continue;
    }
    const closeAngle=clean.indexOf(">",i);
    if(closeAngle===-1){
      parts.push(<React.Fragment key={key++}>{clean.slice(i)}</React.Fragment>);
      break;
    }
    const tagContent=clean.slice(i+1,closeAngle).trim();

    if(tagContent.startsWith("tajweed")){
      const clsMatch=tagContent.match(/class=["']?([a-z_]+)["']?/);
      const cls=clsMatch?clsMatch[1]:null;
      const colorFn=cls?TAJWID_CLASS_COLORS[cls]:null;
      const color=colorFn?colorFn(tjc):null;
      const closeTag=clean.indexOf("</tajweed>",closeAngle+1);
      const inner=closeTag!==-1?clean.slice(closeAngle+1,closeTag):clean.slice(closeAngle+1);
      if(color){
        parts.push(
          <bdi key={key++} style={{color,fontWeight:"bold",letterSpacing:0}} title={cls?.replace(/_/g," ")}>
            {inner}
          </bdi>
        );
      } else {
        parts.push(<React.Fragment key={key++}>{inner}</React.Fragment>);
      }
      i=closeTag!==-1?closeTag+"</tajweed>".length:clean.length;
    }
    else if(tagContent.startsWith("/tajweed")||tagContent.startsWith("/")){
      i=closeAngle+1;
    }
    else{
      i=closeAngle+1;
    }
  }
  return <bdi style={{direction:"rtl",letterSpacing:0,lineHeight:"inherit"}}>{parts}</bdi>;
}

const EDITION_IMGS = {
  hafs: pg => [
    `/api/mushaf?page=${pg}&edition=hafs`,           // proxy Vercel — toujours disponible
    `https://static.qurancdn.com/images/quran/pages/v4/en/hafs/${pg}.png`,
    `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
  ],
  tajweed: pg => [], // mode texte uniquement
  warsh: pg => [
    `/api/mushaf?page=${pg}&edition=warsh`,
    `https://static.qurancdn.com/images/quran/pages/v4/en/warsh/${pg}.png`,
    `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
  ],
  indopak: pg => [
    `/api/mushaf?page=${pg}&edition=indopak`,
    `https://static.qurancdn.com/images/quran/pages/v4/en/indopak/${pg}.png`,
    `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
  ],
};

const fetchMushafPageUrl=async(pg, editionId)=>{
  try{
    const r=await fetch(`https://api.qurancdn.com/api/qdc/pages/${pg}?book_name=${editionId==="warsh"?"warsh":"hafs"}`);
    const d=await r.json();
    return d?.page?.image_url||null;
  }catch{return null;}
};
function MushafPage({page,t,tjc,arFont,edition,fullscreen,onToggleFullscreen,onNext,onPrev}) {
  const ed = edition||MUSHAF_EDITIONS[0];
  const isTextOnly = ed.id==="tajweed";
  const [mode,setMode]=useState(isTextOnly?"text":"image");
  const [imgSrc,setImgSrc]=useState("");
  const [imgState,setImgState]=useState("loading");
  const [verses,setVerses]=useState([]);
  const [textState,setTextState]=useState("idle");
  const touchStart=useRef(null);
  const effectiveTjc=tjc||TJC_DARK;
  const AC="#c9a84c";

  useEffect(()=>{ setMode(ed.id==="tajweed"?"text":"image"); },[ed.id]);

  useEffect(()=>{
    if(mode!=="image")return;
    setImgState("loading");setImgSrc("");
    const urlsFn=EDITION_IMGS[ed.id]||EDITION_IMGS.hafs;
    const staticUrls=urlsFn(page||1);
    let cancelled=false;

    const tryUrl=url=>new Promise(res=>{
      const img=new Image();
      img.crossOrigin="anonymous";
      img.onload=()=>res(url);
      img.onerror=()=>res(null);
      img.src=url;
    });

    const loadImage=async()=>{
      for(const url of staticUrls){
        if(cancelled)return;
        const ok=await tryUrl(url);
        if(ok&&!cancelled){setImgSrc(ok);setImgState("ok");return;}
      }
      if(!cancelled){
        try{
          const r=await fetch(`https://api.qurancdn.com/api/qdc/pages/${page||1}`);
          const d=await r.json();
          const apiUrl=d?.page?.image_url||d?.image_url;
          if(apiUrl&&!cancelled){
            const ok=await tryUrl(apiUrl);
            if(ok&&!cancelled){setImgSrc(ok);setImgState("ok");return;}
          }
        }catch{}
      }
      if(!cancelled)setImgState("error");
    };
    loadImage();
    return()=>{cancelled=true;};

  },[page,mode,ed.id]);

  useEffect(()=>{
    if(mode!=="text")return;
    const ck=`mpage9_${page}`;
    try{const c=localStorage.getItem(ck);if(c){setVerses(JSON.parse(c));setTextState("ok");return;}}catch{}
    setTextState("loading");setVerses([]);
    fetch(`https://api.qurancdn.com/api/qdc/verses/by_page/${page||1}?language=en&words=false&per_page=50&fields=text_uthmani_tajweed,text_uthmani,verse_number,chapter_id`)
      .then(r=>r.json()).then(d=>{
        const vs=(d.verses||[]).map(a=>({n:a.verse_number,s:a.chapter_id,ar:a.text_uthmani_tajweed||a.text_uthmani||"",sName:SURAHS.find(x=>x.n===a.chapter_id)?.name||"",sAr:SURAHS.find(x=>x.n===a.chapter_id)?.ar||""}));
        setVerses(vs);setTextState(vs.length?"ok":"error");
        if(vs.length) try{localStorage.setItem(ck,JSON.stringify(vs));}catch{}
      }).catch(()=>setTextState("error"));
  },[page,mode]);

  const groups=[];let cur=null;
  for(const v of verses){if(!cur||cur.s!==v.s){cur={s:v.s,sName:v.sName,sAr:v.sAr,vs:[]};groups.push(cur);}cur.vs.push(v);}

  const onTS=e=>{touchStart.current=e.touches[0].clientX;};
  const onTE=e=>{if(!touchStart.current)return;const dx=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(dx)>50){dx<0?onNext?.():onPrev?.();}touchStart.current=null;};

  const outer=fullscreen
    ?{position:"fixed",inset:0,zIndex:200,background:"#0d1800",display:"flex",flexDirection:"column",overflow:"hidden"}
    :{width:"100%",minHeight:480,background:"#0d1800",display:"flex",flexDirection:"column",borderRadius:"0 0 14px 14px"};

  return (
    <div style={outer} onTouchStart={onTS} onTouchEnd={onTE}>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"rgba(0,0,0,.5)",flexShrink:0,borderBottom:"1px solid rgba(201,168,76,.15)"}}>
        <button onClick={onPrev} style={{background:"rgba(201,168,76,.12)",border:"1px solid rgba(201,168,76,.22)",color:AC,padding:"5px 14px",borderRadius:8,cursor:"pointer",fontWeight:700,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(201,168,76,.12)"}>◄</button>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:".68rem",color:AC,fontWeight:700}}>p.{page||1}</span>
          {!isTextOnly&&(
            <div style={{display:"flex",background:"rgba(0,0,0,.5)",borderRadius:6,padding:2,gap:1}}>
              {[["image","Image"],["text","Tajwid"]].map(([m,l])=>(
                <button key={m} onClick={()=>setMode(m)} style={{padding:"3px 10px",borderRadius:4,border:"none",background:mode===m?AC:"transparent",color:mode===m?"#0d1800":"#7a6a4a",fontSize:".58rem",cursor:"pointer",fontWeight:700,transition:"all .15s"}}>{l}</button>
              ))}
            </div>
          )}
          <span style={{fontSize:".58rem",color:"#5a4a2a",fontStyle:"italic"}}>{ed.name}</span>
        </div>
        <button onClick={onToggleFullscreen} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#777",padding:"5px 11px",borderRadius:8,cursor:"pointer",fontSize:".62rem",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=AC} onMouseLeave={e=>e.currentTarget.style.color="#777"}>{fullscreen?"✕":"⛶"}</button>
        <button onClick={onNext} style={{background:"rgba(201,168,76,.12)",border:"1px solid rgba(201,168,76,.22)",color:AC,padding:"5px 14px",borderRadius:8,cursor:"pointer",fontWeight:700,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(201,168,76,.12)"}>►</button>
      </div>
      {mode==="image"&&(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:10,minHeight:400}}>
          {imgState==="loading"&&(
            <div style={{textAlign:"center",color:AC}}>
              <div style={{width:30,height:30,border:`2px solid ${AC}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 12px"}}/>
              <div style={{fontFamily:"'Amiri',serif",fontSize:"1rem",opacity:.8}}>جاري التحميل…</div>
            </div>
          )}
          {imgState==="error"&&(
            <div style={{textAlign:"center",padding:24,maxWidth:300}}>
              <div style={{width:44,height:44,borderRadius:"50%",border:"1.5px solid rgba(201,168,76,.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:"1.4rem",color:"rgba(201,168,76,.5)"}}>📵</div>
              <div style={{fontSize:".8rem",color:"#888",marginBottom:6}}>Image indisponible</div>
              <div style={{fontSize:".68rem",color:"#555",lineHeight:1.6,marginBottom:14}}>Connexion requise pour charger le Mushaf.<br/>Le mode Tajwid fonctionne hors ligne.</div>
              <button onClick={()=>setMode("text")} style={{padding:"7px 16px",background:AC,border:"none",borderRadius:8,color:"#0d1800",fontWeight:700,fontSize:".75rem",cursor:"pointer"}}>Lire en Tajwid →</button>
            </div>
          )}
          {imgState==="ok"&&<img src={imgSrc} alt={`p.${page}`} style={{width:"100%",maxWidth:660,display:"block",borderRadius:6,boxShadow:"0 4px 24px rgba(0,0,0,.7)"}}/>}
        </div>
      )}
      {mode==="text"&&(
        <div style={{flex:1,overflowY:"auto",padding:"14px 16px",background:"#FAFAF4"}}>
          {textState==="loading"&&(<div style={{textAlign:"center",padding:40,color:"#7a6a40"}}><div style={{width:26,height:26,border:"3px solid #c9a84c",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 10px"}}/><div style={{fontFamily:"'Amiri',serif",fontSize:".9rem"}}>جاري التحميل…</div></div>)}
          {textState==="error"&&(<div style={{textAlign:"center",padding:28,color:"#c62828",fontSize:".8rem"}}><div style={{fontSize:"1.8rem",marginBottom:8}}>⚠</div>Connexion requise.<br/><button onClick={()=>{try{localStorage.removeItem(`mpage9_${page}`);}catch{}setTextState("idle");setTimeout(()=>setTextState("loading"),50);}} style={{marginTop:10,padding:"5px 12px",border:"1px solid #c9a84c",background:"transparent",color:"#c9a84c",borderRadius:7,cursor:"pointer",fontSize:".7rem"}}>↺ Réessayer</button></div>)}
          {textState==="ok"&&groups.map((g,gi)=>(
            <div key={gi} style={{marginBottom:16}}>
              {g.vs[0]?.n===1&&(
                <div style={{textAlign:"center",margin:"0 0 12px",padding:"10px 16px",background:"linear-gradient(135deg,#1a3a1a,#2d5a1e)",borderRadius:10,border:"1px solid rgba(201,168,76,.3)"}}>
                  <div style={{fontFamily:"'Amiri',serif",fontSize:"1.15rem",color:"#e8c060",letterSpacing:2}}>{g.sAr}</div>
                  <div style={{fontSize:".58rem",color:"#a0c080",marginTop:2}}>{g.sName}</div>
                  {g.s!==1&&g.s!==9&&(<div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.35rem",color:"#1a3a1a",marginTop:8,direction:"rtl",background:"#f5f0dc",padding:"7px 14px",borderRadius:8}}>بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>)}
                </div>
              )}
              <div style={{direction:"rtl",textAlign:"justify",fontFamily:arFont||"'Amiri Quran',serif",fontSize:"1.5rem",lineHeight:"2.8",color:"#1a0a00",wordSpacing:2}}>
                {g.vs.map((v,vi)=>(
                  <span key={vi}>
                    <TajwidSpan text={v.ar} enabled={true} tjc={effectiveTjc}/>
                    <span style={{fontFamily:"'Amiri',serif",fontSize:".72rem",color:"#c9a84c",margin:"0 4px",verticalAlign:"middle"}}>﴿{v.n}﴾</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {mode==="text"&&(
        <div style={{padding:"5px 12px",background:"rgba(0,0,0,.4)",borderTop:"1px solid rgba(201,168,76,.1)",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",flexShrink:0}}>
          {[[effectiveTjc.m,"Madd"],[effectiveTjc.mr,"Madd perm."],[effectiveTjc.mo,"Madd wajib"],
            [effectiveTjc.ml,"Madd lazim"],[effectiveTjc.g,"Ghunna"],[effectiveTjc.q,"Qalqala"],
            [effectiveTjc.ikh,"Ikhfa"],[effectiveTjc.iql,"Iqlab"]].map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:6,height:6,borderRadius:"50%",background:c}}/><span style={{fontSize:".5rem",color:"#9a8a6a"}}>{l}</span></div>
          ))}
        </div>
      )}
    </div>
  );
}

function buildCSS(t,tjc,arFont,tn,ramadan){
ramadan=ramadan||false;
const bg=ramadan&&tn==="dark"?"#0a0518":t.bg;
const hero=ramadan&&tn==="dark"?"linear-gradient(160deg,#0f0a2e,#1a0f3d)":t.hero;
const acc=ramadan?"#c4a35a":t.acc;
const acc2=ramadan?"#e8c87a":t.acc2;
const acc3=ramadan?"#f5e0a0":t.acc3;
return `
@import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&family=Lateef:wght@400&family=Noto+Naskh+Arabic:wght@400;600&family=Noto+Nastaliq+Urdu:wght@400;700&family=Reem+Kufi:wght@400;700&family=Cairo:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:${bg};color:${t.tx};font-family:'DM Sans',sans-serif;min-height:100vh;padding-bottom:80px;transition:background .4s,color .4s;}
${t.arabesque ? (
"body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.04;" +
"background-image:radial-gradient(circle at 25% 25%," + acc + "44 0%,transparent 50%)," +
"radial-gradient(circle at 75% 75%," + acc + "22 0%,transparent 50%)," +
"repeating-conic-gradient(from 0deg at 50% 50%,transparent 0deg,transparent 8deg," + acc + "18 9deg,transparent 10deg);" +
"background-size:120px 120px,120px 120px,80px 80px;}"
) : ""}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:${t.s1};}
::-webkit-scrollbar-thumb{background:${t.b2};border-radius:99px;}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;opacity:${tn==="dark"?".018":".035"};background-image:repeating-linear-gradient(0deg,transparent,transparent 40px,${acc} 40px,${acc} 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,${acc} 40px,${acc} 41px),repeating-linear-gradient(45deg,transparent,transparent 28px,${acc} 28px,${acc} 29px),repeating-linear-gradient(-45deg,transparent,transparent 28px,${acc} 28px,${acc} 29px);}
${ramadan?"body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:radial-gradient(circle,"+acc+"33 1px,transparent 1px);background-size:30px 30px;opacity:.4;}":""}
body>*{position:relative;z-index:1;}
.wrap{animation:pageIn .25s ease;}
.wrap.transitioning{animation:pageOut .12s ease forwards;}
@keyframes pageOut{to{opacity:0;transform:translateY(4px)}}
@keyframes pageIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes memGlow{0%{box-shadow:0 0 0 0 ${t.gr}66}70%{box-shadow:0 0 0 10px ${t.gr}00}100%{box-shadow:0 0 0 0 ${t.gr}00}}
@keyframes confetti{0%{transform:scale(1) rotate(0deg);opacity:1}50%{transform:scale(1.4) rotate(10deg);opacity:.8}100%{transform:scale(1) rotate(0deg);opacity:1}}
@keyframes slideIn{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
@keyframes micPulse{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(233,30,99,.4)}70%{transform:scale(1.05);box-shadow:0 0 0 8px rgba(233,30,99,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(233,30,99,0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes sandDrip{0%{transform:translateY(0);opacity:1}100%{transform:translateY(6px);opacity:0}}
@keyframes hoverLift{from{transform:translateY(0) scale(1)}to{transform:translateY(-3px) scale(1.01)}}
.topbar{position:sticky;top:0;z-index:60;background:${t.navBg};border-bottom:1px solid ${t.b1};backdrop-filter:blur(16px);}
.tb{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:52px;padding:0 16px;}
.logo{display:flex;align-items:baseline;gap:8px;}
.logo-h{font-family:'Amiri',serif;font-size:1.4rem;color:${acc};text-shadow:0 0 20px ${acc}44;}
.logo-ar{font-family:'Amiri Quran',serif;font-size:1.1rem;color:${acc2};}
.logo-sub{font-size:.55rem;color:${t.tx3};letter-spacing:2px;text-transform:uppercase;}
.tb-r{display:flex;gap:6px;align-items:center;}
.ib{background:transparent;border:1px solid ${t.b2};color:${t.tx2};padding:5px 10px;border-radius:8px;font-size:.68rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:4px;}
.ib:hover{border-color:${acc};color:${acc};}
.ib.pri{background:${acc};border-color:${acc};color:#fff;font-weight:600;}
.hero{background:${hero};border-bottom:1px solid ${t.b1};padding:16px 16px 14px;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 10% 50%,${acc}08 0%,transparent 60%),radial-gradient(ellipse at 90% 50%,${acc}08 0%,transparent 60%);pointer-events:none;}
.hero-i{max-width:1200px;margin:0 auto;position:relative;}
.bnav{position:fixed;bottom:0;left:0;right:0;z-index:60;background:${t.navBg}ee;border-top:1px solid ${t.b1};display:flex;align-items:stretch;height:62px;backdrop-filter:blur(16px);}
.bn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:none;background:transparent;color:${t.tx3};font-size:.58rem;font-weight:500;cursor:pointer;transition:all .25s;padding:6px 2px;position:relative;}
.bn:hover{color:${t.tx2};transform:translateY(-2px);}
.bn.on{color:${acc};}
.bn.on::after{content:'';position:absolute;top:0;left:20%;right:20%;height:2px;background:linear-gradient(90deg,${acc},${acc2});border-radius:0 0 99px 99px;box-shadow:0 0 6px ${acc};}
.bn-lbl{font-size:.52rem;font-weight:500;}
.wrap{max-width:1200px;margin:0 auto;padding:14px 16px 100px;}
.two{display:grid;grid-template-columns:300px 1fr;gap:12px;align-items:start;}
.card{background:${t.cardBg};border:1px solid ${t.b1};border-radius:14px;overflow:hidden;transition:box-shadow .25s,border-color .25s;}
.card:hover{box-shadow:0 4px 24px ${acc}18;border-color:${acc}44;}
.ch{padding:10px 14px;border-bottom:1px solid ${t.b1};display:flex;align-items:center;justify-content:space-between;}
.ct{font-size:.63rem;text-transform:uppercase;letter-spacing:1.5px;color:${t.tx3};font-weight:600;}
.lp{display:flex;flex-direction:column;max-height:calc(100vh - 200px);position:sticky;top:58px;}
.ltabs{display:flex;border-bottom:1px solid ${t.b1};}
.lt{flex:1;padding:9px 4px;border:none;background:transparent;color:${t.tx2};font-size:.68rem;font-weight:500;border-bottom:2px solid transparent;cursor:pointer;transition:all .15s;}
.lt:hover{color:${t.tx};}.lt.on{color:${acc};border-bottom-color:${acc};}
.sbox{padding:8px;}
.sinp{width:100%;background:${t.inputBg};border:1px solid ${t.b2};border-radius:8px;padding:7px 10px;color:${t.tx};font-size:.76rem;outline:none;transition:border-color .2s;}
.sinp:focus{border-color:${acc};}.sinp::placeholder{color:${t.tx3};}
.slist{flex:1;overflow-y:auto;}
.srow{padding:8px 12px;display:flex;align-items:center;gap:8px;cursor:pointer;transition:background .15s,border-left-color .15s;border-left:3px solid transparent;position:relative;overflow:hidden;touch-action:pan-y;user-select:none;}
.srow:hover{background:${t.s2};}
.srow:hover .srow-hint{opacity:1;}
.srow.sel{background:${t.s2};border-left-color:${acc};}.srow.done{border-left-color:${t.gr};}
.srow-reveal{position:absolute;top:0;bottom:0;right:0;display:flex;align-items:stretch;pointer-events:none;}
.srow-reveal-btn{width:72px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:.55rem;font-weight:700;border-radius:0;}
.srow-hint{position:absolute;right:6px;top:50%;transform:translateY(-50%);opacity:0;transition:opacity .2s;font-size:.55rem;color:${t.tx3};pointer-events:none;}
.snum{width:21px;height:21px;border-radius:50%;border:1px solid ${t.b2};display:flex;align-items:center;justify-content:center;font-size:.56rem;color:${t.tx3};flex-shrink:0;cursor:pointer;transition:all .2s;}
.snum:hover{border-color:${acc};color:${acc};transform:scale(1.15);}
.snum.done{background:${t.grD};border-color:${t.gr};color:${t.gr};}
.sname{font-size:.76rem;font-weight:500;}
.smeta{font-size:.56rem;color:${t.tx3};margin-top:1px;}
.sar{font-family:'Amiri',serif;font-size:.9rem;color:${acc};}
.mbar{width:36px;height:3px;background:${t.b2};border-radius:99px;overflow:hidden;margin-top:3px;}
.mfill{height:100%;background:${t.gr};border-radius:99px;}
.jg{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:7px;}
.jc{background:${t.s2};border:1px solid ${t.b1};border-radius:7px;padding:6px 3px;text-align:center;cursor:pointer;transition:all .2s;}
.jc:hover{border-color:${acc};transform:translateY(-2px);box-shadow:0 4px 12px ${acc}22;}
.jc.sel{border-color:${acc};background:${t.s3};}
.jn{font-family:'Amiri',serif;font-size:1.2rem;color:${acc};line-height:1;}
.jl{font-size:.48rem;color:${t.tx3};text-transform:uppercase;}
.jb{height:3px;background:${t.b1};border-radius:99px;overflow:hidden;margin-top:3px;}
.jf{height:100%;background:${t.gr};border-radius:99px;}
.rp{position:sticky;top:58px;}
.vhd{padding:12px 14px;border-bottom:1px solid ${t.b1};}
.v-ar-title{font-family:${arFont};font-size:1.9rem;color:${acc};direction:rtl;text-align:right;line-height:1.5;margin-bottom:4px;}
.v-info{font-size:.65rem;color:${t.tx3};}
.vbar{height:4px;background:${t.b2};border-radius:99px;overflow:hidden;margin-top:7px;}
.vfill{height:100%;background:${t.gr};border-radius:99px;transition:width .5s;}
.vtoolbar{padding:7px 12px;border-bottom:1px solid ${t.b1};display:flex;align-items:center;gap:5px;flex-wrap:wrap;background:${t.s2};}
.tbtn{padding:4px 9px;border-radius:99px;border:1px solid ${t.b2};background:transparent;color:${t.tx2};font-size:.65rem;cursor:pointer;transition:all .2s;white-space:nowrap;}
.tbtn:hover{border-color:${acc};color:${acc};transform:translateY(-1px);}
.tbtn.on{background:${acc};border-color:${acc};color:#fff;font-weight:600;}
.tsel{background:${t.inputBg};border:1px solid ${t.b2};color:${t.tx};padding:4px 8px;border-radius:8px;font-size:.65rem;outline:none;}
.tj-legend{display:flex;gap:10px;flex-wrap:wrap;padding:5px 12px;background:${t.s3};border-bottom:1px solid ${t.b1};font-size:.58rem;}
.tj-item{display:flex;align-items:center;gap:3px;}
.tj-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.arow{padding:6px 12px;border-bottom:1px solid ${t.b1};background:${t.s2};display:flex;align-items:center;gap:7px;}
.vscroll{max-height:calc(100vh - 380px);overflow-y:auto;}
.vitem{padding:12px 14px;border-bottom:1px solid ${t.b1};transition:background .15s,transform .15s;animation:fadeIn .3s ease;}
.vitem:hover{background:${t.s2};transform:translateX(2px);}
.vitem.mem{background:${t.grD};border-left:3px solid ${t.gr};animation:memGlow .6s ease;}
.vitem.pl{background:rgba(201,168,76,.08);border-left:3px solid ${acc};position:relative;}
.vitem.pl::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,${acc2},${acc},${acc2});animation:pulse .9s ease infinite;}
.vitem.due{border-left:3px solid ${t.rd};background:rgba(239,68,68,.05);}
.immersive{position:fixed;inset:0;z-index:100;background:${tn==="dark"?"#04060a":"#faf6ef"};display:flex;flex-direction:column;overflow:hidden;}
.immersive-header{padding:14px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${t.b1};}
.immersive-title{font-family:'Amiri',serif;font-size:1.3rem;color:${acc};}
.immersive-scroll{flex:1;overflow-y:auto;padding:20px 18px;display:flex;flex-direction:column;gap:24px;}
.immersive-verse{text-align:center;padding:20px 0;transition:background .2s,border-radius .2s;}
.immersive-verse:hover{background:${t.s2};border-radius:12px;}
.immersive-ar{font-family:${arFont};direction:rtl;text-align:center;line-height:2.5;color:${tn==="dark"?"#f0e6c8":"#2a1a00"};}
.immersive-fr{font-size:.82rem;color:${t.tx2};font-style:italic;line-height:1.8;margin-top:10px;text-align:center;}
.immersive-num{font-size:.65rem;color:${t.tx3};margin-top:8px;}
.vtop{display:flex;align-items:flex-start;gap:8px;}
.vnum{min-width:24px;height:24px;border-radius:50%;border:1px solid ${t.b2};display:flex;align-items:center;justify-content:center;font-size:.6rem;color:${t.tx3};flex-shrink:0;cursor:pointer;transition:all .2s;margin-top:6px;}
.vnum:hover{border-color:${t.bl};color:${t.bl};transform:scale(1.15);}
.vnum.mem{background:${t.grD};border-color:${t.gr};color:${t.gr};}
.vnum.pl{border-color:${acc};color:${acc};}
.var-text{font-family:${arFont};font-size:1.65rem;direction:rtl;text-align:right;line-height:2.1;flex:1;}
.vmark{margin-right:4px;font-size:.8rem;color:${t.tx3};font-family:'Amiri',serif;}
.vfr{font-size:.74rem;color:${t.tx2};line-height:1.7;margin-top:6px;padding-top:6px;border-top:1px solid ${t.b1};font-style:italic;}
.vtf{margin-top:7px;padding:8px 10px;background:rgba(168,85,247,.07);border-left:3px solid ${t.pu};border-radius:0 8px 8px 0;font-size:.7rem;color:${t.tx2};line-height:1.7;}
.vtf-hd{font-size:.58rem;color:${t.pu};text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:3px;}
.vacts{display:flex;gap:4px;margin-top:7px;flex-wrap:wrap;}
.vbtn{padding:3px 8px;border-radius:99px;border:1px solid ${t.b2};background:transparent;color:${t.tx3};font-size:.6rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:3px;}
.vbtn:hover{border-color:${acc};color:${acc};transform:translateY(-1px);}
.vbtn.mem{background:${t.grD};border-color:${t.gr};color:${t.gr};}
.vbtn.snd{border-color:${t.bl};color:${t.bl};}
.sp{display:flex;flex-direction:column;gap:12px;}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.sc{background:${t.cardBg};border:1px solid ${t.b1};border-radius:13px;padding:13px;transition:transform .2s,box-shadow .2s,border-color .2s;}
.sc:hover{transform:translateY(-3px);box-shadow:0 8px 24px ${acc}22;border-color:${acc}44;}
.slbl{font-size:.58rem;text-transform:uppercase;letter-spacing:1.5px;color:${t.tx3};margin-bottom:6px;}
.sval{font-size:1.4rem;font-weight:700;line-height:1;margin-bottom:3px;}
.ssub{font-size:.62rem;color:${t.tx3};}
.sc.a .sval{color:${acc};}.sc.g .sval{color:${t.gr};}.sc.b .sval{color:${t.bl};}.sc.r .sval{color:${t.rd};}
.two-h{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.donut-w{position:relative;width:150px;height:150px;margin:0 auto;}
.donut-c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.d-pct{font-size:1.75rem;font-weight:700;color:${acc};}.d-lbl{font-size:.58rem;color:${t.tx3};text-transform:uppercase;letter-spacing:1px;}
.bc{display:flex;align-items:flex-end;gap:3px;height:100px;}
.bcol{display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;}
.bfw{flex:1;width:100%;display:flex;flex-direction:column;justify-content:flex-end;}
.bfi{background:linear-gradient(180deg,${acc2},${acc});border-radius:3px 3px 0 0;min-height:2px;transition:height .4s;}
.bfi:hover{filter:brightness(1.2);}
.blbl{font-size:.48rem;color:${t.tx3};}.bval{font-size:.48rem;color:${acc};}
.trow{display:flex;align-items:center;gap:8px;padding:5px 0;transition:background .15s,transform .15s;border-radius:6px;}
.trow:hover{background:${t.s2};transform:translateX(3px);}
.tbar{flex:2;height:5px;background:${t.b1};border-radius:99px;overflow:hidden;}
.tfill{height:100%;background:${t.gr};border-radius:99px;}
.cd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px;padding:12px;}
.cdc{background:${t.s2};border:1px solid ${t.b1};border-radius:10px;padding:11px;cursor:pointer;transition:all .2s;}
.cdc:hover{border-color:${acc};transform:translateY(-2px);box-shadow:0 4px 12px ${acc}22;}
.khatma-wrap{display:flex;flex-direction:column;gap:14px;padding-bottom:20px;}
.kh-active{background:${t.cardBg};border:1px solid ${t.b1};border-radius:14px;padding:18px;overflow:visible;}
.kp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;}
.kp-card{background:${t.s2};border:2px solid ${t.b1};border-radius:12px;padding:14px;cursor:pointer;transition:all .2s;text-align:center;}
.kp-card:hover{border-color:${acc};transform:translateY(-2px);box-shadow:0 4px 16px ${acc}22;}
.kp-card.sel{border-color:${acc};background:${t.s3};}
.kp-label{font-size:.85rem;font-weight:600;color:${t.tx};margin-bottom:4px;}
.kp-desc{font-size:.65rem;color:${t.tx3};}
.kp-icon{font-size:1.5rem;margin-bottom:6px;}
.kh-title{font-family:'Amiri',serif;font-size:1.4rem;color:${acc};margin-bottom:4px;}
.kh-sub{font-size:.68rem;color:${t.tx3};margin-bottom:14px;}
.kh-track{height:20px;background:${t.b1};border-radius:99px;overflow:hidden;margin-bottom:8px;position:relative;}
.kh-fill{height:100%;background:linear-gradient(90deg,${acc},${acc2});border-radius:99px;transition:width .8s ease;}
.kh-pct{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:700;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5);}
.kd-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-top:12px;}
.kd-cell{aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700;cursor:pointer;transition:all .15s;border:1.5px solid ${t.b2};background:${t.s2};color:${t.tx3};min-height:32px;}
.kd-cell.done{background:${t.gr};border-color:${t.gr};color:#fff;}
.kd-cell.today{border-color:${acc};color:${acc};background:${t.s3};font-weight:800;}
.kd-cell:hover{border-color:${acc};transform:scale(1.08);box-shadow:0 2px 8px ${acc}33;}
.kh-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px;}
.khs{background:${t.s2};border-radius:10px;padding:12px;text-align:center;transition:transform .2s;}
.khs:hover{transform:translateY(-2px);}
.khs-v{font-size:1.3rem;font-weight:700;color:${acc};}
.khs-l{font-size:.6rem;color:${t.tx3};text-transform:uppercase;letter-spacing:1px;margin-top:2px;}
.streak-fire{font-size:1.8rem;}
.settings-wrap{display:flex;flex-direction:column;gap:14px;max-width:600px;margin:0 auto;}
.settings-section{background:${t.cardBg};border:1px solid ${t.b1};border-radius:14px;overflow:hidden;transition:box-shadow .2s;}
.settings-section:hover{box-shadow:0 4px 20px ${acc}14;}
.ss-hd{padding:12px 16px;border-bottom:1px solid ${t.b1};font-size:.68rem;text-transform:uppercase;letter-spacing:1.5px;color:${t.tx3};font-weight:600;}
.font-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px;}
.font-card{border:2px solid ${t.b1};border-radius:10px;padding:10px;cursor:pointer;transition:all .2s;}
.font-card:hover{border-color:${acc};transform:translateY(-2px);box-shadow:0 4px 12px ${acc}22;}
.font-card.sel{border-color:${acc};background:${t.s3};}
.font-preview{font-size:1.4rem;direction:rtl;text-align:center;margin-bottom:4px;line-height:1.6;}
.font-name{font-size:.68rem;font-weight:600;color:${t.tx};text-align:center;}
.font-desc{font-size:.58rem;color:${t.tx3};text-align:center;}
.set-row{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid ${t.b1};transition:background .15s;}
.set-row:hover{background:${t.s2};}
.set-row:last-child{border-bottom:none;}
.set-lbl{font-size:.78rem;color:${t.tx};}
.set-sub{font-size:.63rem;color:${t.tx3};margin-top:2px;}
.set-inp{background:${t.inputBg};border:1px solid ${t.b2};color:${t.tx};padding:6px 10px;border-radius:8px;font-size:.76rem;outline:none;width:100px;transition:border-color .2s;}
.set-inp:focus{border-color:${acc};}
.toggle{width:42px;height:24px;background:${t.b2};border-radius:99px;cursor:pointer;position:relative;transition:background .2s;border:none;flex-shrink:0;}
.toggle::after{content:'';position:absolute;top:2px;left:2px;width:20px;height:20px;background:white;border-radius:50%;transition:transform .2s;}
.toggle.on{background:${acc};}
.toggle.on::after{transform:translateX(18px);}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);}
.modal{background:${t.s1};border:1px solid ${acc};border-radius:18px;padding:26px;max-width:380px;width:92%;}
.modal h2{font-family:'Amiri',serif;font-size:1.7rem;color:${acc};margin-bottom:5px;}
.modal p{font-size:.76rem;color:${t.tx2};line-height:1.65;margin-bottom:18px;}
.modal label{display:block;font-size:.64rem;color:${t.tx3};text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
.modal input{width:100%;background:${t.inputBg};border:1px solid ${t.b2};border-radius:8px;padding:8px 12px;color:${t.tx};font-size:.85rem;margin-bottom:10px;outline:none;transition:border-color .2s;}
.modal input:focus{border-color:${acc};}
.mbtn{width:100%;padding:11px;background:${acc};border:none;border-radius:8px;color:#fff;font-size:.85rem;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;}
.mbtn:hover{opacity:.92;transform:translateY(-1px);}
.hg-kpi{display:flex;align-items:center;gap:8px;padding:8px 12px;background:${t.s2};border-radius:12px;border:1px solid ${t.b1};transition:all .2s;cursor:default;}
.hg-kpi:hover{border-color:${acc}44;background:${t.s3};transform:translateY(-2px);box-shadow:0 4px 16px ${acc}18;}
.hg-kpi-v{font-size:1.1rem;font-weight:800;color:${acc};line-height:1;font-variant-numeric:tabular-nums;}
.hg-kpi-l{font-size:.48rem;color:${t.tx3};text-transform:uppercase;letter-spacing:1.5px;margin-top:1px;}
.badge-card{padding:12px;border-radius:12px;text-align:center;transition:all .25s;}
.badge-card:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 8px 24px rgba(0,0,0,.15);}
.empty{text-align:center;padding:36px 14px;color:${t.tx3};font-size:.8rem;}
.big-ar{font-family:${arFont};font-size:2rem;color:${acc};margin-bottom:8px;}
@media(max-width:860px){
  .two{grid-template-columns:1fr;}.rp,.lp{position:static;max-height:none;}.vscroll{max-height:none;}
  .sg{grid-template-columns:repeat(2,1fr);}.two-h{grid-template-columns:1fr;}
}
`;}

export default function App() {
  const [tn,setTn]=useState(()=>ld("qtheme2","dark")); // qtheme2 = new key with new themes
  const t=THEMES[tn]||THEMES.dark;
  const tjc=(tn==="light")?TJC_LIGHT:TJC_DARK; // dark for all dark-bg themes
  const [fontId,setFontId]=useState(()=>ld("qfont","amiri-quran"));
  const arFont=(FONTS.find(f=>f.id===fontId)||FONTS[0]).css;
  const [mem,setMem]=useState(()=>ld("qmem6",{}));
  const [settings,setSettings]=useState(()=>ld("qset6",null));
  const [hist,setHist]=useState(()=>ld("qhist6",{}));
  const [setup,setSetup]=useState(()=>!ld("qset6",null));
  const [page,setPage]=useState("quran");
  const [pageTransition,setPageTransition]=useState(false);
  const [ltab,setLtab]=useState("list");
  const [selS,setSelS]=useState(null);
  const [selJuz,setSelJuz]=useState(null);
  const [search,setSearch]=useState("");
  const [showTr,setShowTr]=useState(true);
  const [showTj,setShowTj]=useState(true);
  const [showTf,setShowTf]=useState(false);
  const [showPage,setShowPage]=useState(false);
  const [mushafPage,setMushafPage]=useState(null);
  const [rec,setRec]=useState(RECITERS[0]);
  const [playing,setPlaying]=useState(null);
  const [audioPlaying,setAudioPlaying]=useState(false); // état réactif pour l'UI
  const [audioPct,setAudioPct]=useState(0);
  const [karaokeMode,setKaraokeMode]=useState(false);
  const [wordTimings,setWordTimings]=useState({}); // {sn_vn: [{text,start,end}]}
  const [activeWordIdx,setActiveWordIdx]=useState(-1);
  const karaokeRaf=useRef(null);
  const [khatmas,setKhatmas]=useState(()=>ld("qkhatmas",[]));
  const [activeKhatma,setActiveKhatma]=useState(()=>ld("qakthatma",null));
  const [kPreset,setKPreset]=useState(null);
  const [kCustomDays,setKCustomDays]=useState("30");
  const [kName,setKName]=useState("Ma Khatma");
  const [goal,setGoal]=useState("5");
  const [baselineInput,setBaselineInput]=useState("0"); // versets déjà connus à l'inscription
  const [startDate,setStartDate]=useState(new Date().toISOString().split("T")[0]);
  const [arabicSize,setArabicSize]=useState(()=>ld("qasize",1.65));
  const [loopCount,setLoopCount]=useState(3);
  const [loopCurrent,setLoopCurrent]=useState(0);
  const [reviewMode,setReviewMode]=useState(false);
  const [hifzMode,setHifzMode]=useState(false);
  const [hifzLevel,setHifzLevel]=useState({});
  const [speechMode,setSpeechMode]=useState(false);
  const [speechListening,setSpeechListening]=useState(false);
  const [speechResult,setSpeechResult]=useState(""); // ce que l'utilisateur a dit
  const [speechVerseTarget,setSpeechVerseTarget]=useState(null); // verset cible
  const [speechScore,setSpeechScore]=useState(null); // {correct:[], wrong:[], pct}
  const recognitionRef=useRef(null);
  const [revealedVerses,setRevealedVerses]=useState({});
  const [bookmark,setBookmark]=useState(()=>ld("qbookmark",null));
  const [spaced,setSpaced]=useState(()=>ld("qspaced",{}))
  const [tafsirData,setTafsirData]=useState({}) // {sn_vn: text}
  const [tafsirLoading,setTafsirLoading]=useState({});
  const [badges,setBadges]=useState(()=>ld("qbadges",[]));
  const [autoNight,setAutoNight]=useState(()=>ld("qautonight",false));
  const [playbackRate,setPlaybackRate]=useState(1);
  const [favorites,setFavorites]=useState(()=>ld("qfavs",[]));
  const [notes,setNotes]=useState(()=>ld("qnotes",{}));
  const [lists,setLists]=useState(()=>ld("qlists",[]));
  const [editingNote,setEditingNote]=useState(null);
  const [noteText,setNoteText]=useState("");
  const [shareVerse,setShareVerse]=useState(null);
  const [shareGenerating,setShareGenerating]=useState(false);

  const generateShareImage=async(verse)=>{
    setShareGenerating(true);
    try{
      const canvas=document.createElement("canvas");
      canvas.width=1080;canvas.height=1080;
      const ctx=canvas.getContext("2d");
      const grad=ctx.createLinearGradient(0,0,1080,1080);
      grad.addColorStop(0,"#0a0f14");
      grad.addColorStop(1,"#141a0a");
      ctx.fillStyle=grad;ctx.fillRect(0,0,1080,1080);
      ctx.strokeStyle="#c9a84c";ctx.lineWidth=6;
      ctx.strokeRect(30,30,1020,1020);
      ctx.strokeStyle="rgba(201,168,76,0.3)";ctx.lineWidth=2;
      ctx.strokeRect(45,45,990,990);
      ctx.fillStyle="#c9a84c";
      ctx.font="bold 42px serif";
      ctx.textAlign="center";
      ctx.fillText(verse.surah+" · "+verse.surahAr,540,130);
      ctx.fillStyle="rgba(201,168,76,0.6)";
      ctx.font="28px serif";
      ctx.fillText("﴿"+verse.vn+"﴾",540,185);
      const arText=(verse.ar||"").replace(/<[^>]*>/g,"");
      ctx.fillStyle="#f0e8d0";
      ctx.font="52px 'Amiri',serif";
      ctx.direction="rtl";
      const words=arText.split(" ");
      const lineHeight=80;let line="";let y=350;
      for(const w of words){
        const test=line?line+" "+w:w;
        if(ctx.measureText(test).width>900&&line){ctx.fillText(line,540,y);line=w;y+=lineHeight;}
        else line=test;
      }
      if(line){ctx.fillText(line,540,y);y+=lineHeight;}
      ctx.direction="ltr";
      ctx.fillStyle="rgba(200,185,150,0.7)";
      ctx.font="italic 28px sans-serif";
      ctx.textAlign="center";
      const frWords=(verse.fr||"").split(" ");
      let frLine="";let fy=y+60;
      for(const w of frWords){
        const test=frLine?frLine+" "+w:w;
        if(ctx.measureText(test).width>900&&frLine){ctx.fillText(frLine,540,fy);frLine=w;fy+=40;}
        else frLine=test;
      }
      if(frLine)ctx.fillText(frLine,540,fy);
      ctx.fillStyle="rgba(201,168,76,0.4)";
      ctx.font="24px sans-serif";
      ctx.fillText("Al-Hifz · alhifz.vercel.app",540,1020);
      const link=document.createElement("a");
      link.download=`alhifz-${verse.surah}-v${verse.vn}.png`;
      link.href=canvas.toDataURL("image/png");
      link.click();
    }catch(e){console.error(e);}
    setShareGenerating(false);
  };
  const [newListName,setNewListName]=useState("");
  const [selList,setSelList]=useState(null);
  const [mushafFullscreen,setMushafFullscreen]=useState(false);
  const [mushafEdition,setMushafEdition]=useState("hafs");
  const [immersive,setImmersive]=useState(false);
  const [heroExpanded,setHeroExpanded]=useState(false);
  const [focusMode,setFocusMode]=useState(false);
  const [focusIdx,setFocusIdx]=useState(0);
  const touchStartX=useRef(null);
  const touchStartY=useRef(null);
  const [readHistory,setReadHistory]=useState(()=>ld("qreadhist",[]));
  const [verseSearch,setVerseSearch]=useState("");
  const [verseSearchResults,setVerseSearchResults]=useState([]);
  const [verseSearchLoading,setVerseSearchLoading]=useState(false);
  const [selTheme,setSelTheme]=useState(null);
  const [playlist,setPlaylist]=useState([]);
  const [playlistIdx,setPlaylistIdx]=useState(0);
  const [playlistActive,setPlaylistActive]=useState(false);
  const [showWeeklyReport,setShowWeeklyReport]=useState(false);
  const [chartView,setChartView]=useState("daily");
  const [testMode,setTestMode]=useState(false);
  const [testSurah,setTestSurah]=useState(null);
  const [testVerses,setTestVerses]=useState([]);
  const [testIdx,setTestIdx]=useState(0);
  const [testRevealed,setTestRevealed]=useState(false);
  const [testScore,setTestScore]=useState({correct:0,wrong:0,total:0});
  const [testDone,setTestDone]=useState(false);
  const [splash,setSplash]=useState(true);
  const [isOffline,setIsOffline]=useState(()=>!navigator.onLine);
  const [showInstallBanner,setShowInstallBanner]=useState(false);
  const installPromptRef=useRef(null);
  const [showAIPlan,setShowAIPlan]=useState(false);
  const [aiPlanLoading,setAiPlanLoading]=useState(false);
  const [aiPlanResult,setAiPlanResult]=useState("");
  const [aiPlanParams,setAiPlanParams]=useState({goal:"juz30",months:"3",level:"debutant",dailyTime:"20"});
  const [ramadanTheme,setRamadanTheme]=useState(false);
  const [calligAnim,setCalligAnim]=useState(null); // {ar, x, y} — animation sur mémorisation // always false on load — user toggles manually
  const [pageRead,setPageRead]=useState(()=>ld("qpages",{}));
  const [revFlags,setRevFlags]=useState(()=>ld("qrevflags",{})); // {surahN: "active"|"mastered"|"paused"}
  const [revSessions,setRevSessions]=useState(()=>ld("qrevsessions",[])); // [{date,sn,score,mode}]
  const [revFilter,setRevFilter]=useState("all");
  const [openMenu,setOpenMenu]=useState(null); // key sn_vn pour le menu "..."
  const [swipeState,setSwipeState]=useState({});
  const swipeTouchStart=useRef({});
  const [verses,setVerses]=useState([]);
  const [loadState,setLoadState]=useState("idle");
  const audioRef=useRef(null);
  const preloadRef=useRef(new Audio()); // préchargement du verset suivant
  const vpRef=useRef(null);

  useEffect(()=>sv("qreadhist",readHistory),[readHistory]);
  useEffect(()=>sv("qbookmark",bookmark),[bookmark]);
  useEffect(()=>sv("qspaced",spaced),[spaced]);
  useEffect(()=>sv("qbadges",badges),[badges]);
  useEffect(()=>sv("qautonight",autoNight),[autoNight]);
  useEffect(()=>sv("qfavs",favorites),[favorites]);
  useEffect(()=>sv("qnotes",notes),[notes]);
  useEffect(()=>sv("qlists",lists),[lists]);
  useEffect(()=>sv("qmem6",mem),[mem]);
  useEffect(()=>sv("qset6",settings),[settings]);
  useEffect(()=>sv("qhist6",hist),[hist]);
  useEffect(()=>sv("qtheme2",tn),[tn]);
  useEffect(()=>sv("qfont",fontId),[fontId]);
  useEffect(()=>sv("qkhatmas",khatmas),[khatmas]);
  useEffect(()=>sv("qakthatma",activeKhatma),[activeKhatma]);
  useEffect(()=>sv("qramadan",ramadanTheme),[ramadanTheme]);
  useEffect(()=>sv("qpages",pageRead),[pageRead]);
  useEffect(()=>sv("qrevflags",revFlags),[revFlags]);
  useEffect(()=>sv("qrevsessions",revSessions),[revSessions]);

  useEffect(()=>{
    const t=setTimeout(()=>setSplash(false),2200);
    try{
      Object.keys(localStorage).filter(k=>k.startsWith("qv3_")||k.startsWith("qv4_")).forEach(k=>localStorage.removeItem(k));
    }catch{}
    return()=>clearTimeout(t);
  },[]);

  useEffect(()=>{
    const tod=today();
    const tot=Object.values(mem).reduce((s,v)=>s+Object.keys(v).length,0);
    setHist(h=>({...h,[tod]:tot}));
  },[mem]);

  useEffect(()=>{if(audioRef.current)audioRef.current.playbackRate=playbackRate;},[playbackRate,playing]);
  useEffect(()=>{if(!autoNight)return;const h=new Date().getHours();if(h>=20||h<7)setTn("dark");else setTn("light");},[autoNight]);
  useEffect(()=>{
    const onOnline=()=>setIsOffline(false);
    const onOffline=()=>setIsOffline(true);
    const onInstall=e=>{e.preventDefault();installPromptRef.current=e;setShowInstallBanner(true);};
    window.addEventListener("online",onOnline);
    window.addEventListener("offline",onOffline);
    window.addEventListener("beforeinstallprompt",onInstall);
    return()=>{window.removeEventListener("online",onOnline);window.removeEventListener("offline",onOffline);window.removeEventListener("beforeinstallprompt",onInstall);};
  },[]);

  const totalMem=useMemo(()=>Object.values(mem).reduce((s,v)=>s+Object.keys(v).length,0),[mem]);
  const remaining=TOTAL_VERSES-totalMem;
  const pct=+(totalMem/TOTAL_VERSES*100).toFixed(1);

  const {vpd,daysLeft,eta}=useMemo(()=>{
    if(!settings) return{vpd:parseInt(settings?.dailyGoal)||5,daysLeft:0,eta:"-"};
    const baseline=settings.baselineVerses||0;
    const start=new Date(settings.startDate),now=new Date();
    const dp=Math.max(1,Math.floor((now-start)/86400000));
    const earnedMem=Math.max(0,totalMem-baseline);
    const rate=earnedMem>0 ? earnedMem/dp : parseInt(settings.dailyGoal)||5;
    const eff=Math.max(rate,1);
    const days=remaining>0?Math.ceil(remaining/eff):0;
    const d=new Date();d.setDate(d.getDate()+days);
    return{
      vpd:Math.round(eff*10)/10,
      daysLeft:days,
      eta:remaining>0?d.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}):"🎉 Terminé!",
    };
  },[settings,totalMem,remaining]);

  const hourglassPct=useMemo(()=>{
    if(!settings||daysLeft<=0)return daysLeft<=0?1:0;
    const start=new Date(settings.startDate),now=new Date();
    const elapsed=Math.max(0,Math.floor((now-start)/86400000));
    const total=elapsed+daysLeft;
    return total>0?elapsed/total:0;
  },[settings,daysLeft]);

  const sMem=s=>Object.keys(mem[String(s.n)]||{}).length;
  const sPct=s=>Math.round(sMem(s)/s.v*100);
  const juzPct=j=>{const ss=SURAHS.filter(s=>s.juz===j);const tot=ss.reduce((a,s)=>a+s.v,0),don=ss.reduce((a,s)=>a+sMem(s),0);return tot>0?Math.round(don/tot*100):0;};

  const addToHistory=(sn,vn)=>{
    const entry={sn,vn,ts:Date.now(),surah:SURAHS.find(s=>s.n===sn)?.name||""};
    setReadHistory(p=>{const filtered=p.filter(h=>!(h.sn===sn&&h.vn===vn));return[entry,...filtered].slice(0,50);});
  };

  const searchVerses=useCallback(async(q)=>{
    if(!q.trim()||q.length<2){setVerseSearchResults([]);return;}
    setVerseSearchLoading(true);
    const ql=q.toLowerCase().trim();const results=[];
    Object.entries(Q).forEach(([sn,vs])=>{vs.forEach(v=>{const arClean=v.ar.replace(/\[[mgqrt]\](.*?)\[\/[mgqrt]\]/g,"$1");if(arClean.includes(q)||v.fr?.toLowerCase().includes(ql)){results.push({sn:parseInt(sn),vn:v.n,ar:arClean,fr:v.fr,surah:SURAHS.find(s=>s.n===parseInt(sn))?.name||""});}});});
    for(const s of SURAHS){if(Q[s.n])continue;try{const cached=localStorage.getItem(`qv3_${s.n}`);if(cached){const vs=JSON.parse(cached);vs.forEach(v=>{const arClean=(v.ar||"").replace(/<[^>]*>/g,"");if(arClean.includes(q)||v.fr?.toLowerCase().includes(ql)){results.push({sn:s.n,vn:v.n,ar:arClean,fr:v.fr,surah:s.name});}});}}catch{}}
    setVerseSearchResults(results.slice(0,30));setVerseSearchLoading(false);
  },[]);

  const startPlaylist=(sn,vs,startVn=1)=>{
    if(!audioRef.current)return;
    const items=vs.filter(v=>v&&v.n).map(v=>({sn,vn:v.n}));
    if(!items.length)return;
    const idx=Math.max(0,items.findIndex(v=>v.vn===startVn));
    const first=items[idx];
    const url=buildUrl(first.sn,first.vn);
    setPlaylist(items);
    setPlaylistIdx(idx);
    setPlaylistActive(true);
    setPlaying(first.vn);
    const audio=audioRef.current;
    audio.pause();
    audio.src=url;
    audio.load();
    audio.play().catch(()=>{});
    addToHistory(first.sn,first.vn);
  };

  useEffect(()=>{
    if(playing===null){
      setActiveWordIdx(-1);
      if(karaokeRaf.current){cancelAnimationFrame(karaokeRaf.current);karaokeRaf.current=null;}
      return;
    }
    const el=document.getElementById(`v-${selS?.n}-${playing}`);
    if(el){
      const scroller=el.closest(".vscroll");
      if(scroller){
        const elRect=el.getBoundingClientRect();
        const boxRect=scroller.getBoundingClientRect();
        scroller.scrollBy({top:elRect.top-boxRect.top-boxRect.height/3,behavior:"smooth"});
      } else el.scrollIntoView({behavior:"smooth",block:"center"});
    }
    if(karaokeMode&&selS){
      loadWordTimings(selS.n,playing).then(words=>{
        const audio=audioRef.current;
        if(words.length&&audio){
          const onMeta=()=>{ startKaraokeLoop(words,audio.duration); };
          if(audio.duration) startKaraokeLoop(words,audio.duration);
          else{ audio.addEventListener("loadedmetadata",onMeta,{once:true}); }
        }
      });
    }
  },[playing,karaokeMode]);

  const weeklyReport=useMemo(()=>{
    const now=new Date();const days=[];
    for(let i=6;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);const key=d.toISOString().split("T")[0];const val=hist[key]||0;const prev=i<6?(hist[Object.keys(hist).sort()[Object.keys(hist).sort().indexOf(key)-1]]||0):0;days.push({date:key,label:d.toLocaleDateString("fr-FR",{weekday:"short"}),total:val,gained:Math.max(0,val-prev)});}
    const totalWeek=days.reduce((s,d)=>s+d.gained,0);const activeDays=days.filter(d=>d.gained>0).length;const best=days.reduce((a,b)=>b.gained>a.gained?b:a,days[0]);
    return{days,totalWeek,activeDays,best};
  },[hist]);

  const handleTouchStart=useCallback(e=>{touchStartX.current=e.touches[0].clientX;touchStartY.current=e.touches[0].clientY;},[]);
  const handleTouchEnd=useCallback(e=>{
    if(!touchStartX.current||!selS)return;
    const dx=touchStartX.current-e.changedTouches[0].clientX;
    const dy=Math.abs(touchStartY.current-e.changedTouches[0].clientY);
    if(Math.abs(dx)>60&&dy<50){const idx=SURAHS.findIndex(s=>s.n===selS.n);if(dx>0&&idx<SURAHS.length-1)doSelect(SURAHS[idx+1]);if(dx<0&&idx>0)doSelect(SURAHS[idx-1]);}
    touchStartX.current=null;
  },[selS]);

  const memStreak=useMemo(()=>{let s=0,d=new Date();while(true){const key=d.toISOString().split("T")[0];if(!hist[key])break;s++;d.setDate(d.getDate()-1);}return s;},[hist]);

  useEffect(()=>{
    const newBadges=[];const completedSurahs=SURAHS.filter(s=>sMem(s)===s.v);
    const add=(id,cond)=>{if(cond&&!badges.includes(id))newBadges.push(id);};
    add("first_surah",completedSurahs.length>=1);add("three_surahs",completedSurahs.length>=3);add("five_surahs",completedSurahs.length>=5);add("ten_surahs",completedSurahs.length>=10);add("twenty_surahs",completedSurahs.length>=20);
    add("50_verses",totalMem>=50);add("100_verses",totalMem>=100);add("500_verses",totalMem>=500);add("1000_verses",totalMem>=1000);
    add("juz30",SURAHS.filter(s=>s.juz===30).every(s=>sMem(s)===s.v));add("juz29",SURAHS.filter(s=>s.juz===29).every(s=>sMem(s)===s.v));
    add("fatiha",sMem(SURAHS[0])===SURAHS[0].v);add("ikhlas",sMem(SURAHS[111])===SURAHS[111].v);
    add("streak_3",memStreak>=3);add("streak_7",memStreak>=7);add("streak_30",memStreak>=30);
    if(newBadges.length>0)setBadges(p=>[...p,...newBadges]);
  },[mem,memStreak]);

  const sm2Due=useMemo(()=>{
    const today2=new Date().toISOString().split("T")[0];
    return Object.entries(spaced).filter(([k,v])=>{
      if(!v.nextDate) return false;
      return v.nextDate<=today2;
    }).map(([k])=>k);
  },[spaced]);
  const spacedDue=sm2Due; // alias pour compatibilité

  const sm2Update=(sn,vn,quality)=>{
    const key=`${sn}_${vn}`;
    setSpaced(prev=>{
      const card=prev[key]||{interval:1,repetitions:0,ef:2.5};
      let {interval,repetitions,ef}=card;
      if(quality>=3){
        if(repetitions===0) interval=1;
        else if(repetitions===1) interval=6;
        else interval=Math.round(interval*ef);
        repetitions++;
      } else {
        repetitions=0;
        interval=1;
      }
      ef=Math.max(1.3, ef + 0.1 - (5-quality)*(0.08+(5-quality)*0.02));
      const nextDate=new Date();
      nextDate.setDate(nextDate.getDate()+interval);
      return {...prev,[key]:{
        interval,repetitions,ef:+ef.toFixed(2),
        nextDate:nextDate.toISOString().split("T")[0],
        lastDate:new Date().toISOString().split("T")[0],
        quality,
      }};
    });
  };
  const markSpaced=(sn,vn,quality=4)=>sm2Update(sn,vn,quality);

  const getHifzText=(text,level)=>{
    if(!level||level===0)return text;
    const clean=(text||"").replace(/<[^>]*>/g,"");
    const words=clean.split(" ").filter(w=>w.trim());
    const total=words.length;
    const hiddenCount=Math.round(total*(level/5));
    const indices=new Set();
    for(let i=total-1;i>=total-hiddenCount;i--)indices.add(i);
    return words.map((w,i)=>indices.has(i)?<span key={i} style={{background:"#1a1a1a",color:"#1a1a1a",borderRadius:3,cursor:"pointer",userSelect:"none",transition:"all .2s"}} onClick={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="inherit";}}>{"█".repeat(Math.max(2,Math.round(w.length*0.8)))}</span>:<span key={i}>{w} </span>);
  };

  const doSelect=s=>{
    setSelS(s);setPlaying(null);
    setMushafPage(SURAH_PAGE[s.n]||1);
    if(audioRef.current){audioRef.current.pause();audioRef.current.src="";}
    if(window.innerWidth<860){
      setTimeout(()=>{
        const panel=document.getElementById("verse-panel");
        if(panel)panel.scrollIntoView({behavior:"smooth",block:"start"});
      },80);
    }
  };

  const toggleV=(sn,vn,verseAr="")=>setMem(p=>{
    const k=String(sn),vk=String(vn),c={...p[k]||{}};
    const wasMemorized=!!c[vk];
    if(wasMemorized) delete c[vk];
    else {
      c[vk]=true;
      if(verseAr){
        const clean=verseAr.replace(/<[^>]*>/g,"").slice(0,60);
        setCalligAnim(clean);
        setTimeout(()=>setCalligAnim(null),2000);
      }
    }
    return{...p,[k]:c};
  });
  const toggleAll=s=>{const k=String(s.n),done=sMem(s)===s.v;setMem(p=>{if(done){const n={...p};delete n[k];return n;}const a={};for(let i=1;i<=s.v;i++)a[String(i)]=true;return{...p,[k]:a};});};

  const doPlay=vn=>{
    if(!selS||!audioRef.current)return;
    const audio=audioRef.current;
    if(playing===vn){
      if(!audio.paused){audio.pause();} 
      else{audio.play().catch(()=>{});}
      return;
    }
    setPlaylistActive(false); // on sort du mode playlist
    const url=buildUrl(selS.n,vn);
    const pre=preloadRef.current;
    audio.pause();
    if(pre.src===url&&pre.readyState>=2){
      audio.src=url;
    } else {
      audio.src=url;
    }
    setPlaying(vn);
    audio.load();
    audio.play().catch(()=>{
      audio.src=`https://cdn.islamic.network/quran/audio/128/${rec.id}/${String(selS.n).padStart(3,"0")}${String(vn).padStart(3,"0")}.mp3`;
      audio.load();
      audio.play().catch(()=>setPlaying(null));
    });
  };

  const loadTafsir=useCallback(async(sn,vn)=>{
    const key=`${sn}_${vn}`;
    if(tafsirData[key]||tafsirLoading[key]) return;
    setTafsirLoading(p=>({...p,[key]:true}));
    try{
      const r=await fetch(`https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/fr-tafsir-ibn-kathir/${sn}/${vn}.json`);
      if(r.ok){
        const d=await r.json();
        const text=(d.text||d.tafsir||"").replace(/<[^>]*>/g,"").slice(0,600);
        if(text) setTafsirData(p=>({...p,[key]:text}));
      }
    }catch{}
    setTafsirLoading(p=>({...p,[key]:false}));
  },[tafsirData,tafsirLoading]);

  const buildUrl=(sn,vn)=>{
    const s=String(sn).padStart(3,"0");const v=String(vn).padStart(3,"0");
    return `https://everyayah.com/data/${rec.everyayah||"Alafasy_128kbps"}/${s}${v}.mp3`;
  };

  const loadWordTimings=useCallback(async(sn,vn)=>{
    const key=`${sn}_${vn}`;
    if(wordTimings[key])return wordTimings[key];
    try{
      const r=await fetch(`https://api.qurancdn.com/api/qdc/verses/by_chapter/${sn}?verse_number=${vn}&words=true&word_fields=audio_url,location,text_uthmani&per_page=1`);
      const d=await r.json();
      const words=(d.verses?.[0]?.words||[])
        .filter(w=>w.char_type_name==="word")
        .map((w,i)=>({text:w.text_uthmani||w.text||"",idx:i}));
      setWordTimings(p=>({...p,[key]:words}));
      return words;
    }catch{return[];}
  },[wordTimings]);

  const startKaraokeLoop=useCallback((words,duration)=>{
    if(karaokeRaf.current) cancelAnimationFrame(karaokeRaf.current);
    if(!words.length||!duration) return;
    const wordsPerSec=words.length/duration;
    const tick=()=>{
      const audio=audioRef.current;
      if(!audio||audio.paused){karaokeRaf.current=null;return;}
      const idx=Math.min(Math.floor(audio.currentTime*wordsPerSec),words.length-1);
      setActiveWordIdx(idx);
      karaokeRaf.current=requestAnimationFrame(tick);
    };
    karaokeRaf.current=requestAnimationFrame(tick);
  },[]);

  useEffect(()=>{
    if(!playlistActive||playing===null)return;
    const curIdx=playlist.findIndex(p=>p.vn===playing);
    if(curIdx<0||curIdx>=playlist.length-1)return;
    const next=playlist[curIdx+1];
    const pre=preloadRef.current;
    const url=buildUrl(next.sn,next.vn);
    if(pre.src!==url){pre.src=url;pre.load();}
  },[playing,playlistActive,playlist,rec]);

  useEffect(()=>{
    const audio=audioRef.current;
    if(!audio)return;
    const handleEnded=()=>{
      if(playlistActive){
        const curIdx=playlist.findIndex(p=>p.vn===playing);
        if(curIdx>=0&&curIdx<playlist.length-1){
          const next=playlist[curIdx+1];
          const pre=preloadRef.current;
          const url=buildUrl(next.sn,next.vn);
          if(pre.src===url&&pre.readyState>=2){
            audio.src=url;
          } else {
            audio.src=url;
          }
          audio.load();
          audio.play().catch(()=>{});
          setPlaying(next.vn);
          setPlaylistIdx(curIdx+1);
          addToHistory(next.sn,next.vn);
        } else {
          setPlaylistActive(false);
          setPlaying(null);
          setAudioPlaying(false);
          setAudioPct(0);
        }
        return;
      }
      if(loopCount>1&&loopCurrent<loopCount){
        setLoopCurrent(p=>p+1);
        audio.currentTime=0;
        audio.play().catch(()=>{});
      } else {
        setPlaying(null);
        setLoopCurrent(0);
        setAudioPlaying(false);
        setAudioPct(0);
      }
    };
    audio.addEventListener("ended",handleEnded);
    return()=>audio.removeEventListener("ended",handleEnded);
  },[playlistActive,playlist,playing,loopCount,loopCurrent,rec]);

  useEffect(()=>{
    if(!selS){setVerses([]);setLoadState("idle");return;}
    const cacheKey=`qv5_${selS.n}`; // v4 = tajweed HTML + traduction fusionnée
    try{
      const cached=localStorage.getItem(cacheKey);
      if(cached){setVerses(JSON.parse(cached));setLoadState("done");return;}
    }catch{}
    setVerses([]);setLoadState("loading");
    const arFetch=fetch(`https://api.qurancdn.com/api/qdc/verses/by_chapter/${selS.n}?language=fr&words=false&per_page=300&fields=text_uthmani_tajweed,text_uthmani,translations&translations=31`)
      .then(r=>r.json());
    const frFetch=fetch(`https://api.alquran.cloud/v1/surah/${selS.n}/fr.hamidullah`)
      .then(r=>r.json()).catch(()=>({data:{ayahs:[]}}));
    Promise.all([arFetch,frFetch]).then(([arData,frData])=>{
      const arAyahs=arData?.verses||[];
      const frAyahs=frData?.data?.ayahs||[];
      const localQ=Q[selS.n]||[];
      if(!arAyahs.length){
        if(localQ.length){setVerses(localQ);setLoadState("done");}
        else setLoadState("error");
        return;
      }
      const result=arAyahs.map((a,i)=>({
        n:a.verse_number,
        ar:a.text_uthmani_tajweed||a.text_uthmani||"",
        fr:(a.translations?.[0]?.text||frAyahs[i]?.text||localQ[i]?.fr||"").replace(/<[^>]*>/g,""),
        tf:localQ[i]?.tf||"",
      }));
      setVerses(result);setLoadState("done");
      try{localStorage.setItem(cacheKey,JSON.stringify(result));}catch{}
    }).catch(()=>{
      if(Q[selS.n]?.length){setVerses(Q[selS.n]);setLoadState("done");}
      else setLoadState("error");
    });
  },[selS]);

  const filtered=useMemo(()=>{const q=search.toLowerCase().trim();if(!q)return SURAHS;return SURAHS.filter(s=>s.name.toLowerCase().includes(q)||s.ar.includes(q)||String(s.n).includes(q));},[search]);
  const juzList=[...new Set(SURAHS.map(s=>s.juz))].sort((a,b)=>a-b);

  const handleSwipeEnd=(sn,s)=>{
    const x=swipeState[sn]?.x||0;
    if(x<-130){
      setFavorites(prev=>{
        const key=`surah_${sn}`;
        if(prev.find(f=>f.key===key)) return prev.filter(f=>f.key!==key);
        return [...prev,{key,sn,vn:0,ar:s.ar||"",fr:"",surah:s.name,isSurah:true}];
      });
    } else if(x<-60){
      setRevFlags(prev=>({...prev,[String(sn)]:prev[String(sn)]==="active"?undefined:"active"}));
    }
    setSwipeState(prev=>({...prev,[sn]:{x:0,swiping:false}}));
  };

  const createKhatma=()=>{if(!kPreset)return;const days=kPreset.id==="custom"?parseInt(kCustomDays)||30:kPreset.days;const nk={id:Date.now(),name:kName,preset:kPreset.id,totalDays:days,startDate:today(),log:{},pages:604};setKhatmas(p=>[...p,nk]);setActiveKhatma(nk);setKPreset(null);};
  const markKhatmaDay=(k,d)=>{const updated={...k,log:{...k.log,[d]:!(k.log[d])}};setKhatmas(p=>p.map(x=>x.id===k.id?updated:x));if(activeKhatma?.id===k.id)setActiveKhatma(updated);};
  const getKhatmaDays=k=>{const days=[];const start=new Date(k.startDate);for(let i=0;i<k.totalDays;i++){const d=new Date(start);d.setDate(d.getDate()+i);days.push(d.toISOString().split("T")[0]);}return days;};
  const khatmaStreak=k=>{const days=getKhatmaDays(k).filter(d=>d<=today()).reverse();let streak=0;for(const d of days){if(k.log[d])streak++;else break;}return streak;};
  const togglePage=p=>setPageRead(prev=>({...prev,[String(p)]:!prev[String(p)]}));
  const toggleFav=(sn,vn,ar,fr,surah)=>{const key=`${sn}_${vn}`;setFavorites(p=>p.find(f=>f.key===key)?p.filter(f=>f.key!==key):[...p,{key,sn,vn,ar,fr,surah}]);};
  const isFav=(sn,vn)=>favorites.some(f=>f.key===`${sn}_${vn}`);
  const saveNote=(sn,vn,text)=>{const k=`${sn}_${vn}`;if(text.trim())setNotes(p=>({...p,[k]:text.trim()}));else setNotes(p=>{const n={...p};delete n[k];return n;});setEditingNote(null);};
  const generateAIPlan=async()=>{
    setAiPlanLoading(true);setAiPlanResult("");
    const goalLabels={juz30:"le Juz 30 (37 sourates)",juz29:"les Juz 29-30",halfquran:"la moitié du Coran (15 juz)",fullquran:"le Coran complet"};
    const completedSurahs=SURAHS.filter(s=>sMem(s)===s.v).map(s=>s.name).join(", ")||"aucune pour l'instant";
    const prompt=`Tu es un coach expert en mémorisation coranique (hifz). Génère un plan de mémorisation personnalisé en français.

Profil de l'utilisateur :
- Objectif : mémoriser ${goalLabels[aiPlanParams.goal]||aiPlanParams.goal}
- Délai souhaité : ${aiPlanParams.months} mois
- Niveau : ${aiPlanParams.level}
- Temps disponible par jour : ${aiPlanParams.dailyTime} minutes
- Versets déjà mémorisés : ${totalMem} / ${TOTAL_VERSES}
- Sourates complètes : ${completedSurahs}
- Rythme actuel : ${vpd} versets/jour

Génère un plan structuré avec :
1. Analyse de la faisabilité de l'objectif
2. Planning semaine par semaine (les 4 premières semaines détaillées)
3. Sourates recommandées dans l'ordre avec leur durée estimée
4. Techniques de mémorisation adaptées au niveau
5. Planning de révision (muraja'a) intégré
6. Conseils spécifiques et motivations islamiques

Sois précis, pratique et bienveillant. Inclus des hadiths pertinents sur la mémorisation.`;
    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:2000,
          messages:[{role:"user",content:prompt}]
        })
      });
      const data=await resp.json();
      const text=data.content?.[0]?.text||"Erreur de génération";
      setAiPlanResult(text);
    }catch(e){
      setAiPlanResult("Connexion requise pour générer le plan IA.");
    }
    setAiPlanLoading(false);
  };

  const createList=name=>{if(!name.trim())return;const nl={id:Date.now(),name:name.trim(),items:[]};setLists(p=>[...p,nl]);setNewListName("");return nl;};
  const removeFromList=(listId,sn,vn)=>setLists(p=>p.map(l=>l.id===listId?{...l,items:l.items.filter(i=>!(i.sn===sn&&i.vn===vn))}:l));

  const speechSupported=typeof window!=="undefined"&&("SpeechRecognition" in window||"webkitSpeechRecognition" in window);

  const [speechCountdown,setSpeechCountdown]=useState(0); // 3,2,1,0
  const [continuousMode,setContinuousMode]=useState(false);
  const [continuousIdx,setContinuousIdx]=useState(0);
  const countdownRef=useRef(null);

  const arabicMatch=(a,b)=>{
    const clean=s=>s.replace(/[ًٌٍَُِّْٰ]/g,"").replace(/[أإآ]/g,"ا").replace(/[ىة]/g,"ي").trim();
    const ca=clean(a),cb=clean(b);
    return ca===cb||ca.includes(cb)||cb.includes(ca);
  };

  const analyzeRecitation=(targetAr,spoken)=>{
    const target=(targetAr||"").replace(/<[^>]*>/g,"").trim().split(/\s+/).filter(Boolean);
    const said=(spoken||"").trim().split(/\s+/).filter(Boolean);
    let si=0;
    return target.map(tw=>{
      if(si>=said.length) return {word:tw,status:"missing"};
      if(arabicMatch(tw,said[si])){si++;return {word:tw,status:"ok"};}
      const ahead=said.slice(si,si+3).findIndex(w=>arabicMatch(tw,w));
      if(ahead>=0){si+=ahead+1;return {word:tw,status:"ok"};}
      return {word:tw,status:"wrong"};
    });
  };

  const startListening=(verseAr,vn,onDone)=>{
    if(!speechSupported)return;
    setSpeechVerseTarget({ar:verseAr,vn});
    setSpeechResult("");
    setSpeechScore(null);
    setSpeechCountdown(3);
    let cd=3;
    countdownRef.current=setInterval(()=>{
      cd--;
      setSpeechCountdown(cd);
      if(cd<=0){
        clearInterval(countdownRef.current);
        const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
        const recognition=new SR();
        recognition.lang="ar-SA";
        recognition.continuous=true;
        recognition.interimResults=true;  // affiche en temps réel
        recognition.maxAlternatives=3;
        recognitionRef.current=recognition;
        setSpeechListening(true);
        recognition.onresult=e=>{
          let finalTranscript="";
          let interimTranscript="";
          for(let i=0;i<e.results.length;i++){
            const t=e.results[i][0].transcript;
            if(e.results[i].isFinal) finalTranscript+=t+" ";
            else interimTranscript+=t;
          }
          if(interimTranscript) setSpeechResult(interimTranscript);
          if(finalTranscript.trim()){
            const transcript=finalTranscript.trim();
            setSpeechResult(transcript);
            recognition.stop();
            setSpeechListening(false);
            const analysis=analyzeRecitation(verseAr,transcript);
            const correct=analysis.filter(w=>w.status==="ok").length;
            const total=analysis.length;
            const pct=Math.round(correct/total*100);
            const score={
              pct,
              analysis,
              wrong:analysis.filter(w=>w.status!=="ok").map(w=>w.word),
              correct:analysis.filter(w=>w.status==="ok").map(w=>w.word),
              targetWords:analysis.map(w=>w.word),
              spokenWords:transcript.split(/\s+/),
            };
            setSpeechScore(score);
            if(onDone) onDone(score);
          }
        };
        recognition.onerror=()=>setSpeechListening(false);
        recognition.onend=()=>setSpeechListening(false);
        recognition.start();
      }
    },1000);
  };

  const stopListening=()=>{
    clearInterval(countdownRef.current);
    recognitionRef.current?.stop();
    setSpeechListening(false);
    setSpeechCountdown(0);
  };

  const startContinuousRecitation=(startVn=0)=>{
    if(!speechSupported||!verses.length)return;
    setContinuousMode(true);
    setContinuousIdx(startVn);
  };
  const continuousNext=(score)=>{
    if(score&&score.pct>=70) markSpaced(selS?.n,verses[continuousIdx]?.n,score.pct>=90?5:3);
    const next=continuousIdx+1;
    if(next>=verses.length){setContinuousMode(false);return;}
    setContinuousIdx(next);
    const v=verses[next];
    if(v){
      doPlay(v.n);
      setTimeout(()=>startListening(v.ar,v.n,(s)=>continuousNext(s)),3000);
    }
  };

  const startTest=(s,vs)=>{const memVerses=vs.filter(v=>!!(mem[String(s.n)]||{})[String(v.n)]);if(memVerses.length<2){alert("Il faut au moins 2 versets mémorisés pour ce test.");return;}const shuffled=[...memVerses].sort(()=>Math.random()-.5);setTestSurah(s);setTestVerses(shuffled);setTestIdx(0);setTestRevealed(false);setTestScore({correct:0,wrong:0,total:0});setTestDone(false);setTestMode(true);};

  const histKeys=Object.keys(hist).sort().slice(-14);
  const histVals=histKeys.map(k=>hist[k]||0);
  const gains=histVals.map((v,i)=>i===0?v:Math.max(0,v-histVals[i-1]));
  const maxG=Math.max(...gains,1);
  const topS=[...SURAHS].map(s=>({...s,p:sPct(s)})).filter(s=>s.p>0).sort((a,b)=>b.p-a.p).slice(0,10);
  const cdS=SURAHS.map(s=>{const done=sMem(s),rem=s.v-done,days=vpd>0?Math.ceil(rem/vpd):null;return{...s,done,rem,days,p:sPct(s)};}).filter(s=>s.rem>0).slice(0,30);

  const weeklyData=useMemo(()=>{const weeks=[];for(let w=6;w>=0;w--){const start=new Date();start.setDate(start.getDate()-w*7-6);const end=new Date();end.setDate(end.getDate()-w*7);const days=Object.keys(hist).filter(d=>{const dd=new Date(d);return dd>=start&&dd<=end;});const gained=days.reduce((s,d,i)=>{const prev=days[i-1]?hist[days[i-1]]:0;return s+Math.max(0,(hist[d]||0)-prev);},0);weeks.push({label:`S${7-w}`,v:gained});}return weeks;},[hist]);
  const maxWeek=Math.max(...weeklyData.map(w=>w.v),1);
  const monthlyData=useMemo(()=>{const months=[];for(let m=5;m>=0;m--){const d=new Date();d.setMonth(d.getMonth()-m);const y=d.getFullYear(),mo=d.getMonth();const days=Object.keys(hist).filter(k=>{const dd=new Date(k);return dd.getFullYear()===y&&dd.getMonth()===mo;}).sort();const gained=days.reduce((s,d,i)=>{const prev=days[i-1]?hist[days[i-1]]:0;return s+Math.max(0,(hist[d]||0)-prev);},0);months.push({label:d.toLocaleDateString("fr-FR",{month:"short"}),v:gained});}return months;},[hist]);
  const maxMonth=Math.max(...monthlyData.map(m=>m.v),1);

  const acc=ramadanTheme?"#c4a35a":t.acc;
  const acc2=ramadanTheme?"#e8c87a":t.acc2;
  const acc3=ramadanTheme?"#f5e0a0":t.acc3;

  const riInfo=getRamadanInfo();

  const versetDuJour=useMemo(()=>{
    const seed=parseInt(today().replace(/-/g,""))%9999;
    const memList=[];
    SURAHS.forEach(s=>{
      const mkeys=Object.keys(mem[String(s.n)]||{});
      mkeys.forEach(vk=>{
        const localV=Q[s.n]?.find(v=>String(v.n)===vk);
        if(localV) memList.push({...localV,sn:s.n,surah:s.name,surahAr:s.ar});
      });
    });
    const fallbackList=[];
    [112,113,114,97,103,108].forEach(sn=>{
      (Q[sn]||[]).forEach(v=>fallbackList.push({...v,sn,surah:SURAHS.find(s=>s.n===sn)?.name||"",surahAr:SURAHS.find(s=>s.n===sn)?.ar||""}));
    });
    const pool=memList.length>=3?memList:fallbackList;
    return pool.length?pool[seed%pool.length]:null;
  },[mem]);
  const filtered2=SURAHS.filter(s=>{
    if(revFilter==="memorized")return sPct(s)===100;
    if(revFilter==="active")return revFlags[String(s.n)]==="active";
    if(revFilter==="none")return sMem(s)===0&&!revFlags[String(s.n)];
    return true;
  });
  const versesThisRamadan=riInfo.isActive?Object.keys(hist).filter(d=>d>=riInfo.start.toISOString().split("T")[0]&&d<=riInfo.end.toISOString().split("T")[0]).reduce((s,d,i,arr)=>{const prev=arr[i-1]?hist[arr[i-1]]:0;return s+Math.max(0,(hist[d]||0)-prev);},0):0;

  return (
    <>
      <style>{buildCSS(t,tjc,arFont,tn,ramadanTheme)}</style>

      {showAIPlan&&(
        <div className="overlay" onClick={()=>setShowAIPlan(false)}>
          <div style={{background:t.s1,border:`1px solid ${t.acc}`,borderRadius:18,padding:24,maxWidth:520,width:"92%",maxHeight:"85vh",display:"flex",flexDirection:"column",gap:14}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <h2 style={{fontFamily:"'Amiri',serif",fontSize:"1.5rem",color:t.acc,marginBottom:2}}>Plan IA personnalisé</h2>
                <p style={{fontSize:".65rem",color:t.tx3}}>Généré par Claude · adapté à ton profil</p>
              </div>
              <button onClick={()=>setShowAIPlan(false)} style={{background:"none",border:"none",color:t.tx3,fontSize:"1.3rem",cursor:"pointer"}}>✕</button>
            </div>
            {!aiPlanResult&&(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div>
                  <label style={{fontSize:".65rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:5}}>Objectif</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[["juz30","Juz 30"],["juz29","Juz 29-30"],["halfquran","Demi-Coran"],["fullquran","Coran complet"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setAiPlanParams(p=>({...p,goal:v}))} style={{padding:"8px 10px",borderRadius:8,border:`1.5px solid ${aiPlanParams.goal===v?t.acc:t.b2}`,background:aiPlanParams.goal===v?`${t.acc}15`:t.s2,color:aiPlanParams.goal===v?t.acc:t.tx,fontSize:".72rem",cursor:"pointer",fontWeight:aiPlanParams.goal===v?700:400,transition:"all .15s"}}>{l}</button>
                    ))}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>
                    <label style={{fontSize:".65rem",color:t.tx3,display:"block",marginBottom:4}}>Délai (mois)</label>
                    <input className="sinp" type="number" min="1" max="120" value={aiPlanParams.months} onChange={e=>setAiPlanParams(p=>({...p,months:e.target.value}))} style={{width:"100%"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:".65rem",color:t.tx3,display:"block",marginBottom:4}}>Min/jour</label>
                    <input className="sinp" type="number" min="5" max="180" value={aiPlanParams.dailyTime} onChange={e=>setAiPlanParams(p=>({...p,dailyTime:e.target.value}))} style={{width:"100%"}}/>
                  </div>
                </div>
                <div>
                  <label style={{fontSize:".65rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:5}}>Niveau</label>
                  <div style={{display:"flex",gap:6}}>
                    {[["debutant","Débutant"],["intermediaire","Intermédiaire"],["avance","Avancé"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setAiPlanParams(p=>({...p,level:v}))} style={{flex:1,padding:"7px",borderRadius:8,border:`1.5px solid ${aiPlanParams.level===v?t.acc:t.b2}`,background:aiPlanParams.level===v?`${t.acc}15`:t.s2,color:aiPlanParams.level===v?t.acc:t.tx,fontSize:".7rem",cursor:"pointer",fontWeight:aiPlanParams.level===v?700:400,transition:"all .15s"}}>{l}</button>
                    ))}
                  </div>
                </div>
                <button onClick={generateAIPlan} disabled={aiPlanLoading} style={{width:"100%",padding:"12px",background:`linear-gradient(135deg,${t.acc},${t.acc2})`,border:"none",borderRadius:10,color:"#fff",fontSize:".85rem",fontWeight:700,cursor:"pointer",opacity:aiPlanLoading?.6:1,transition:"opacity .2s"}}>
                  {aiPlanLoading?"Génération en cours…":"✦ Générer mon plan"}
                </button>
                {aiPlanLoading&&(
                  <div style={{textAlign:"center",color:t.tx3,fontSize:".7rem"}}>
                    <div style={{width:24,height:24,border:`2px solid ${t.acc}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 8px"}}/>
                    Claude analyse ton profil…
                  </div>
                )}
              </div>
            )}
            {aiPlanResult&&(
              <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
                <div style={{padding:"12px 14px",background:t.s2,borderRadius:10,border:`1px solid ${t.b1}`,fontSize:".75rem",color:t.tx,lineHeight:1.8,fontFamily:"'DM Sans',sans-serif",overflowY:"auto",maxHeight:"50vh",whiteSpace:"pre-wrap"}}>
                  {aiPlanResult}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{navigator.clipboard?.writeText(aiPlanResult);}} style={{flex:1,padding:"9px",background:`${t.acc}18`,border:`1px solid ${t.acc}`,borderRadius:8,color:t.acc,fontSize:".75rem",cursor:"pointer",fontWeight:600}}>Copier le plan</button>
                  <button onClick={()=>setAiPlanResult("")} style={{flex:1,padding:"9px",background:t.s2,border:`1px solid ${t.b2}`,borderRadius:8,color:t.tx2,fontSize:".75rem",cursor:"pointer"}}>Nouveau plan</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {splash&&(
        <div style={{position:"fixed",inset:0,zIndex:300,background:tn==="dark"?"#07090d":"#f0f7f0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeOut 0.5s ease 1.8s forwards"}}>
          <style>{`@keyframes fadeOut{to{opacity:0;pointer-events:none;}}`}</style>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{marginBottom:20}}>
            <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={acc}/><stop offset="1" stopColor={acc3}/></linearGradient></defs>
            <circle cx="60" cy="60" r="55" fill="none" stroke={acc} strokeWidth=".8" opacity=".3" strokeDasharray="4,3"/>
            {[0,45,90,135,180,225,270,315].map(a=>(<g key={a} transform={`rotate(${a} 60 60)`}><line x1="60" y1="12" x2="60" y2="35" stroke="url(#sg)" strokeWidth="2" strokeLinecap="round"/><polygon points="60,12 56,22 60,35 64,22" fill={acc} opacity=".6"/></g>))}
            <circle cx="60" cy="60" r="18" fill="none" stroke="url(#sg)" strokeWidth="2"/>
            <circle cx="60" cy="60" r="10" fill={acc} opacity=".15"/>
          </svg>
          <div style={{fontFamily:"'Amiri',serif",fontSize:"2.2rem",color:acc,textShadow:`0 0 30px ${acc}66`,letterSpacing:"2px",marginBottom:6}}>Al-Hifz</div>
          <div style={{fontFamily:"'Amiri Quran',serif",fontSize:".9rem",color:acc2,letterSpacing:"3px",opacity:.7}}>حفظ القرآن الكريم</div>
          <div style={{marginTop:20,display:"flex",gap:5}}>{[0,1,2].map(i=>(<div key={i} style={{width:5,height:5,borderRadius:"50%",background:acc,animation:`pulse 1s ${i*0.2}s infinite`,opacity:.6}}/>))}</div>
        </div>
      )}

      {testMode&&(
        <div style={{position:"fixed",inset:0,zIndex:100,background:tn==="dark"?"#04060a":"#faf6ef",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${t.b1}`,display:"flex",alignItems:"center",gap:10,background:t.navBg}}>
            <div style={{flex:1}}><div style={{fontFamily:"'Amiri',serif",fontSize:"1.2rem",color:acc}}>{testSurah?.name}</div><div style={{fontSize:".62rem",color:t.tx3}}>Test {testIdx+1}/{testVerses.length} · {testScore.correct} ✓ {testScore.wrong} ✗</div></div>
            <button className="tbtn" style={{borderColor:t.rd,color:t.rd}} onClick={()=>setTestMode(false)}>✕ Quitter</button>
          </div>
          {testDone?(
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,gap:16}}>
              <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="36" fill="none" stroke={t.gr} strokeWidth="3"/><polyline points="24,40 35,52 56,28" stroke={t.gr} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div style={{fontSize:"2rem",fontWeight:800,color:acc}}>{Math.round(testScore.correct/testScore.total*100)}%</div>
              <div style={{fontSize:".85rem",color:t.tx2,textAlign:"center"}}>{testScore.correct} correct · {testScore.wrong} incorrect</div>
              <button className="mbtn" style={{width:200}} onClick={()=>startTest(testSurah,testVerses)}>Recommencer</button>
              <button className="tbtn" onClick={()=>setTestMode(false)}>Retour</button>
            </div>
          ):(testVerses[testIdx]&&<div style={{flex:1,display:"flex",flexDirection:"column",padding:20,gap:16,overflowY:"auto"}}>
                <div style={{height:4,background:t.b1,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",background:t.acc,borderRadius:99,width:`${(testIdx/testVerses.length)*100}%`,transition:"width .3s"}}/></div>
                <div style={{background:t.s2,borderRadius:14,padding:16,border:`1px solid ${t.b1}`}}>
                  <div style={{fontSize:".62rem",color:t.tx3,marginBottom:8,textTransform:"uppercase",letterSpacing:"1px"}}>Complète — {testSurah?.name} v.{testVerses[testIdx]?.n}</div>
                  <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.6rem",direction:"rtl",textAlign:"right",lineHeight:2.2,color:t.acc}}>{(testVerses[testIdx]?.ar||"").replace(/<[^>]*>/g,"").split(" ").slice(0,3).join(" ")}…</div>
                  <div style={{fontSize:".68rem",color:t.tx3,marginTop:6,fontStyle:"italic"}}>{testVerses[testIdx]?.fr?.split(" ").slice(0,6).join(" ")}…</div>
                </div>
                {testRevealed&&(<div style={{background:t.s3,borderRadius:14,padding:16,border:`2px solid ${t.acc}44`}}>
                  <div style={{fontSize:".6rem",color:t.acc,marginBottom:8,textTransform:"uppercase"}}>Verset complet</div>
                  <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.6rem",direction:"rtl",textAlign:"right",lineHeight:2.2,color:t.tx}}>{(testVerses[testIdx]?.ar||"").replace(/<[^>]*>/g,"")} ﴿{testVerses[testIdx]?.n}﴾</div>
                  <div style={{fontSize:".75rem",color:t.tx2,marginTop:8,fontStyle:"italic"}}>{testVerses[testIdx]?.fr}</div>
                </div>)}
                {!testRevealed
                  ?(<button className="mbtn" onClick={()=>setTestRevealed(true)}>Révéler le verset</button>)
                  :(<div style={{display:"flex",gap:10}}>
                      <button style={{flex:1,padding:"14px",borderRadius:12,border:"none",background:`${t.rd}22`,color:t.rd,fontSize:".85rem",fontWeight:700,cursor:"pointer"}} onClick={()=>{setTestScore(p=>({...p,wrong:p.wrong+1,total:p.total+1}));if(testIdx+1>=testVerses.length)setTestDone(true);else{setTestIdx(i=>i+1);setTestRevealed(false);}}}>✗ Difficile</button>
                      <button style={{flex:1,padding:"14px",borderRadius:12,border:"none",background:`${t.gr}22`,color:t.gr,fontSize:".85rem",fontWeight:700,cursor:"pointer"}} onClick={()=>{markSpaced(testSurah.n,testVerses[testIdx]?.n,4);setTestScore(p=>({...p,correct:p.correct+1,total:p.total+1}));if(testIdx+1>=testVerses.length)setTestDone(true);else{setTestIdx(i=>i+1);setTestRevealed(false);}}}>✓ Maîtrisé</button>
                    </div>)
                }
              </div>)}
        </div>
      )}

      {setup&&(
        <div className="overlay">
          <div className="modal">
            <h2>بِسْمِ ٱللَّهِ</h2>
            <p>Bienvenue dans Al-Hifz. Configure ton suivi de mémorisation.</p>
            <label>Sourates déjà mémorisées</label>
            <p style={{fontSize:".63rem",color:t.tx3,marginBottom:6,lineHeight:1.5}}>Si tu connais déjà des sourates, entre le nombre de versets. Ils seront exclus du calcul de rythme — seules tes nouvelles mémorisations compteront.</p>
            <input type="number" min="0" max="6236" placeholder="0 si tu débutes" value={baselineInput} onChange={e=>setBaselineInput(e.target.value)}/>
            <label>Nouveaux versets à mémoriser par jour</label>
            <input type="number" min="1" max="100" placeholder="5" value={goal} onChange={e=>setGoal(e.target.value)}/>
            <label>Date de début</label>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/>
            <button className="mbtn" onClick={()=>{
              setSettings({
                dailyGoal:parseInt(goal)||5,
                startDate,
                baselineVerses:parseInt(baselineInput)||0,
                baselineDate:today(),
              });
              setSetup(false);
            }}>Commencer →</button>
          </div>
        </div>
      )}

      {editingNote&&(<div className="overlay" onClick={()=>setEditingNote(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>Note personnelle</h2><p style={{fontSize:".72rem",color:t.tx3,marginBottom:12}}>{editingNote.replace("_"," · verset ")}</p><textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Écris ta note…" style={{width:"100%",minHeight:100,background:t.inputBg,border:`1px solid ${t.b2}`,borderRadius:8,padding:"10px 12px",color:t.tx,fontSize:".85rem",resize:"vertical",outline:"none",marginBottom:12}}/><div style={{display:"flex",gap:8}}><button className="mbtn" style={{flex:1}} onClick={()=>{const[sn,vn]=editingNote.split("_");saveNote(sn,vn,noteText);}}>Sauvegarder</button>{notes[editingNote]&&(<button className="tbtn" style={{borderColor:t.rd,color:t.rd}} onClick={()=>{const[sn,vn]=editingNote.split("_");saveNote(sn,vn,"");}}>Supprimer</button>)}</div></div></div>)}

      {shareVerse&&(<div className="overlay" onClick={()=>setShareVerse(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2 style={{fontFamily:"'Amiri',serif",color:acc,marginBottom:4}}>{shareVerse.surahAr}</h2><p style={{fontSize:".68rem",color:t.tx3,marginBottom:14}}>{shareVerse.surah} · verset {shareVerse.vn}</p><div style={{background:`linear-gradient(135deg,${t.s2},${t.s3})`,border:`2px solid ${acc}`,borderRadius:14,padding:"20px 18px",marginBottom:14,textAlign:"center"}}><div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.5rem",direction:"rtl",lineHeight:2.2,color:t.tx,marginBottom:10}}>{shareVerse.ar.replace(/<[^>]*>/g,"")}</div><div style={{fontSize:".75rem",color:t.tx2,fontStyle:"italic",lineHeight:1.6}}>{shareVerse.fr}</div><div style={{marginTop:10,fontSize:".6rem",color:t.tx3}}>— {shareVerse.surah} ({shareVerse.sn}:{shareVerse.vn}) · Al-Hifz</div></div><div style={{display:"flex",gap:8,marginTop:4}}>
              <button className="mbtn" style={{flex:1}} onClick={()=>{const txt=`${shareVerse.ar.replace(/<[^>]*>/g,"")}\n\n${shareVerse.fr}\n\n— ${shareVerse.surah} (${shareVerse.sn}:${shareVerse.vn})`;navigator.clipboard?.writeText(txt).catch(()=>{});setShareVerse(null);}}>Copier</button>
              <button className="mbtn" style={{flex:1,background:`linear-gradient(135deg,${acc},${acc2})`,border:"none",color:"#000"}} onClick={()=>generateShareImage(shareVerse)} disabled={shareGenerating}>{shareGenerating?"…":"🖼 Image"}</button>
            </div></div></div>)}

      {showWeeklyReport&&(<div className="overlay" onClick={()=>setShowWeeklyReport(false)}><div className="modal" onClick={e=>e.stopPropagation()}><h2 style={{marginBottom:4}}>Rapport hebdomadaire</h2><p style={{marginBottom:16}}>{weeklyReport.totalWeek} versets · {weeklyReport.activeDays}/7 jours actifs</p><div style={{display:"flex",alignItems:"flex-end",gap:6,height:80,marginBottom:12}}>{weeklyReport.days.map((d,i)=>{const maxG=Math.max(...weeklyReport.days.map(x=>x.gained),1);const isToday=d.date===today();return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{fontSize:".52rem",color:acc}}>{d.gained||""}</div><div style={{width:"100%",height:60,display:"flex",alignItems:"flex-end"}}><div style={{width:"100%",height:`${Math.max(Math.round(d.gained/maxG*100),4)}%`,background:isToday?acc:`${acc}66`,borderRadius:"3px 3px 0 0",minHeight:3}}/></div><div style={{fontSize:".52rem",color:isToday?acc:t.tx3,fontWeight:isToday?700:400}}>{d.label}</div></div>);})}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>{[{v:weeklyReport.totalWeek,l:"Versets",c:acc},{v:weeklyReport.activeDays,l:"Jours actifs",c:t.gr},{v:weeklyReport.best?.gained||0,l:"Meilleur jour",c:t.bl}].map((k,i)=>(<div key={i} style={{background:t.s2,borderRadius:10,padding:"10px",textAlign:"center"}}><div style={{fontSize:"1.4rem",fontWeight:700,color:k.c}}>{k.v}</div><div style={{fontSize:".58rem",color:t.tx3}}>{k.l}</div></div>))}</div><div style={{textAlign:"center",color:weeklyReport.totalWeek>0?t.gr:t.tx3,fontSize:".75rem",marginBottom:14,fontWeight:600}}>{weeklyReport.activeDays>=5?"Excellente semaine ! 🌟":weeklyReport.activeDays>=3?"Bonne progression, continue !":"Essaie de mémoriser chaque jour."}</div><button className="mbtn" onClick={()=>setShowWeeklyReport(false)}>Fermer</button></div></div>)}

      {isOffline&&(
        <div style={{background:`${t.rd}CC`,color:"#fff",padding:"6px 16px",textAlign:"center",fontSize:".7rem",fontWeight:600,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,position:"sticky",top:0,zIndex:61}}>
          <span>●</span> Mode hors ligne — Coran embarqué et mémorisations disponibles
        </div>
      )}
      {showInstallBanner&&(
        <div style={{background:`linear-gradient(135deg,${t.acc}ee,${t.acc2}ee)`,padding:"8px 16px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:61,backdropFilter:"blur(8px)"}}>
          <span style={{fontSize:".75rem",fontWeight:700,color:"#fff",flex:1}}>Installer Al-Hifz sur ton écran d'accueil</span>
          <button onClick={()=>{installPromptRef.current?.prompt();setShowInstallBanner(false);}} style={{background:"rgba(255,255,255,.25)",border:"1px solid rgba(255,255,255,.4)",color:"#fff",borderRadius:8,padding:"4px 12px",fontSize:".7rem",fontWeight:700,cursor:"pointer"}}>Installer</button>
          <button onClick={()=>setShowInstallBanner(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:"1rem"}}>✕</button>
        </div>
      )}

      <div className="topbar">
        <div className="tb">
          <div className="logo"><span className="logo-h">Al-Hifz</span><span className="logo-ar">القرآن</span><span className="logo-sub">mémorisation</span></div>
          <div className="tb-r">
            <button className="tbtn" style={{borderColor:acc,color:acc,fontSize:".6rem"}} onClick={()=>setShowWeeklyReport(true)}>Semaine</button>
            <button className="tbtn" style={{borderColor:t.pu,color:t.pu,fontSize:".6rem"}} onClick={()=>setShowAIPlan(true)}>✦ Plan IA</button>
            <button className="ib" title={THEME_META[tn]?.label||tn} onClick={()=>{const keys=Object.keys(THEMES);setTn(keys[(keys.indexOf(tn)+1)%keys.length]);}}>{tn==="dark"||tn==="andalous"||tn==="ottoman"||tn==="abbasid"?<Icons.Sun size={14}/>:<Icons.Moon size={14}/>}</button>
          </div>
        </div>
      </div>

      <div className="hero">
        <svg style={{position:"absolute",top:0,left:0,width:"100%",height:12,display:"block"}} preserveAspectRatio="none" viewBox="0 0 800 12">
          <defs><linearGradient id="bord" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="transparent"/><stop offset=".15" stopColor={acc}/><stop offset=".5" stopColor={acc3}/><stop offset=".85" stopColor={acc}/><stop offset="1" stopColor="transparent"/></linearGradient></defs>
          <rect y="0" width="800" height="1.5" fill="url(#bord)"/>
          <path d="M0,6 Q25,2 50,6 Q75,10 100,6 Q125,2 150,6 Q175,10 200,6 Q225,2 250,6 Q275,10 300,6 Q325,2 350,6 Q375,10 400,6 Q425,2 450,6 Q475,10 500,6 Q525,2 550,6 Q575,10 600,6 Q625,2 650,6 Q675,10 700,6 Q725,2 750,6 Q775,10 800,6" stroke={acc} strokeWidth="1" fill="none" opacity=".35"/>
        </svg>
        <svg style={{position:"absolute",top:8,left:8,opacity:.18}} width="40" height="40" viewBox="0 0 40 40"><path d="M0,0 L40,0 L40,4 L4,4 L4,40 L0,40 Z" fill={acc}/><circle cx="4" cy="4" r="3" fill="none" stroke={acc} strokeWidth="1"/><path d="M8,4 Q20,4 20,16" stroke={acc} strokeWidth=".8" fill="none"/><path d="M4,8 Q4,20 16,20" stroke={acc} strokeWidth=".8" fill="none"/></svg>
        <svg style={{position:"absolute",top:8,right:8,opacity:.18,transform:"scaleX(-1)"}} width="40" height="40" viewBox="0 0 40 40"><path d="M0,0 L40,0 L40,4 L4,4 L4,40 L0,40 Z" fill={acc}/><circle cx="4" cy="4" r="3" fill="none" stroke={acc} strokeWidth="1"/><path d="M8,4 Q20,4 20,16" stroke={acc} strokeWidth=".8" fill="none"/><path d="M4,8 Q4,20 16,20" stroke={acc} strokeWidth=".8" fill="none"/></svg>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 100%,${acc}0e 0%,transparent 70%)`,pointerEvents:"none"}}/>

        <div className="hero-i" style={{paddingTop:6}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:14}}>
            <svg width="80" height="10" viewBox="0 0 80 10"><line x1="0" y1="5" x2="55" y2="5" stroke={acc} strokeWidth=".8" opacity=".4"/><circle cx="62" cy="5" r="2.5" fill="none" stroke={acc} strokeWidth=".8" opacity=".6"/><circle cx="72" cy="5" r="1.5" fill={acc} opacity=".5"/><circle cx="79" cy="5" r=".8" fill={acc} opacity=".3"/></svg>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Amiri',serif",fontSize:"1.6rem",fontWeight:700,color:acc,lineHeight:1,letterSpacing:"1px",textShadow:`0 0 30px ${acc}55,0 2px 4px rgba(0,0,0,.3)`}}>Al-Hifz</div>
              <div style={{fontSize:".48rem",textTransform:"uppercase",letterSpacing:"4px",color:t.tx3,marginTop:2}}>حفظ القرآن الكريم</div>
            </div>
            <svg width="80" height="10" viewBox="0 0 80 10" style={{transform:"scaleX(-1)"}}><line x1="0" y1="5" x2="55" y2="5" stroke={acc} strokeWidth=".8" opacity=".4"/><circle cx="62" cy="5" r="2.5" fill="none" stroke={acc} strokeWidth=".8" opacity=".6"/><circle cx="72" cy="5" r="1.5" fill={acc} opacity=".5"/><circle cx="79" cy="5" r=".8" fill={acc} opacity=".3"/></svg>
          </div>

          <div style={{display:"flex",gap:14,alignItems:"stretch"}}>
            <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{position:"relative",width:88,height:88}}>
                <svg width="88" height="88" viewBox="0 0 88 88">
                  <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={acc}/><stop offset="1" stopColor={acc3}/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                  <circle cx="44" cy="44" r="42" fill="none" stroke={acc} strokeWidth=".4" opacity=".2" strokeDasharray="3,4"/>
                  <circle cx="44" cy="44" r="35" fill="none" stroke={t.b1} strokeWidth="7"/>
                  <circle cx="44" cy="44" r="35" fill="none" stroke="url(#cg)" strokeWidth="7" strokeDasharray={`${2*Math.PI*35*pct/100} ${2*Math.PI*35*(1-pct/100)}`} strokeLinecap="round" transform="rotate(-90 44 44)" filter="url(#glow)" style={{transition:"stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)"}}/>
                  <circle cx="44" cy="44" r="26" fill="none" stroke={acc} strokeWidth=".4" opacity=".15"/>
                  <g transform="translate(44,44)" opacity=".15">{[0,60,120,180,240,300].map(a=>(<line key={a} x1="0" y1="-12" x2="0" y2="-7" stroke={acc} strokeWidth=".8" transform={`rotate(${a})`}/>))}</g>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:"1.55rem",fontWeight:800,color:acc,lineHeight:1,textShadow:`0 0 12px ${acc}77`,fontVariantNumeric:"tabular-nums"}}>{pct}<span style={{fontSize:".65rem",fontWeight:600}}>%</span></div>
                  <div style={{fontSize:".48rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px"}}>mémorisé</div>
                </div>
              </div>
            </div>

            <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:8}}>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:".58rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1.5px"}}>Versets mémorisés</span>
                  <span style={{fontSize:".65rem",color:acc,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{totalMem.toLocaleString()} <span style={{color:t.tx3,fontWeight:400}}>/ {TOTAL_VERSES}</span></span>
                </div>
                <div style={{height:10,background:t.b1,borderRadius:99,overflow:"hidden",boxShadow:"inset 0 2px 4px rgba(0,0,0,.25)"}}>
                  <div style={{height:"100%",width:`${pct}%`,borderRadius:99,background:`linear-gradient(90deg,${acc},${acc2},${acc3})`,boxShadow:`0 0 10px ${acc}99`,transition:"width 1.2s cubic-bezier(.4,0,.2,1)",position:"relative"}}>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)",backgroundSize:"200% 100%",animation:"shimmer 2.5s infinite",borderRadius:99}}/>
                  </div>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:".7rem",color:t.bl,opacity:.6}}>◈</span>
                  <div><div style={{fontSize:".85rem",fontWeight:700,color:t.bl,lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>{vpd}/j</div><div style={{fontSize:".48rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px"}}>Rythme</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:".7rem",color:"#f97316",opacity:.6}}>◆</span>
                  <div><div style={{fontSize:".85rem",fontWeight:700,color:daysLeft<=0?t.gr:"#f97316",lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>{daysLeft>0?`${daysLeft}j`:"Fini!"}</div><div style={{fontSize:".48rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px"}}>Avant fin</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:".7rem",color:t.gr,opacity:.6}}>✦</span>
                  <div><div style={{fontSize:".85rem",fontWeight:700,color:t.gr,lineHeight:1.1}}>{SURAHS.filter(s=>sPct(s)===100).length}</div><div style={{fontSize:".48rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px"}}>Sourates</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:".7rem",color:t.tx2,opacity:.6}}>◆</span>
                  <div><div style={{fontSize:".85rem",fontWeight:700,color:t.tx2,lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>{remaining.toLocaleString()}</div><div style={{fontSize:".48rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px"}}>Restants</div></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{marginTop:10,padding:"8px 12px",borderTop:`1px solid ${acc}20`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,background:`${acc}06`,borderRadius:"0 0 10px 10px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <svg width="28" height="8" viewBox="0 0 28 8"><polygon points="4,4 8,1 12,4 8,7" fill="none" stroke={acc} strokeWidth=".8" opacity=".5"/><line x1="0" y1="4" x2="3" y2="4" stroke={acc} strokeWidth=".8" opacity=".3"/><line x1="13" y1="4" x2="28" y2="4" stroke={acc} strokeWidth=".5" opacity=".2"/></svg>
              <span style={{fontSize:".63rem",color:t.tx2,fontStyle:"italic"}}>{remaining>0?`Fin estimée · ${eta}`:"🎉 Coran complet !"}</span>
              <svg width="28" height="8" viewBox="0 0 28 8" style={{transform:"scaleX(-1)"}}><polygon points="4,4 8,1 12,4 8,7" fill="none" stroke={acc} strokeWidth=".8" opacity=".5"/><line x1="0" y1="4" x2="3" y2="4" stroke={acc} strokeWidth=".3" opacity=".3"/><line x1="13" y1="4" x2="28" y2="4" stroke={acc} strokeWidth=".5" opacity=".2"/></svg>
            </div>
            <div title={`${Math.round(hourglassPct*100)}% du temps écoulé`} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:8,border:`1px solid ${acc}25`,background:`${acc}08`,flexShrink:0}}>
              <HourglassIcon pct={hourglassPct} color={daysLeft<=0?"#22c55e":acc} size={16}/>
              <span style={{fontSize:".55rem",color:daysLeft<=0?t.gr:t.tx3,letterSpacing:".5px",fontVariantNumeric:"tabular-nums"}}>{Math.round(hourglassPct*100)}%</span>
            </div>
          </div>

          { !(hist[today()]||0) && (<div style={{marginTop:7,display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:`${t.bl}15`,borderRadius:8,border:`1px solid ${t.bl}30`,cursor:"pointer",transition:"transform .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"} onMouseLeave={e=>e.currentTarget.style.transform=""} onClick={()=>{const s=SURAHS.find(x=>sPct(x)<100);if(s)doSelect(s);}}><div style={{width:6,height:6,borderRadius:"50%",background:t.bl,animation:"pulse 1.5s infinite"}}/><span style={{fontSize:".65rem",color:t.bl,fontWeight:600}}>Aucune mémorisation aujourd'hui — on commence ?</span><span style={{fontSize:".6rem",color:t.bl,marginLeft:"auto",opacity:.7}}>→</span></div>)}
          {spacedDue.length>0&&(<div style={{marginTop:7,display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:`${t.rd}15`,borderRadius:8,border:`1px solid ${t.rd}30`,cursor:"pointer",transition:"transform .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"} onMouseLeave={e=>e.currentTarget.style.transform=""} onClick={()=>setPage("stats")}><div style={{width:6,height:6,borderRadius:"50%",background:t.rd,animation:"pulse 1.5s infinite"}}/><span style={{fontSize:".65rem",color:t.rd,fontWeight:600}}>{spacedDue.length} verset{spacedDue.length>1?"s":""} à réviser aujourd'hui</span><span style={{fontSize:".6rem",color:t.rd,marginLeft:"auto",opacity:.7}}>Voir →</span></div>)}
          {bookmark&&(<div style={{marginTop:7,display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:`${acc}10`,borderRadius:8,cursor:"pointer",border:`1px solid ${acc}25`,transition:"transform .2s,box-shadow .2s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 4px 12px ${acc}22`;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}} onClick={()=>{setPage("quran");const s=SURAHS.find(x=>x.n===bookmark.sn);if(s)doSelect(s);}}><span style={{fontSize:".75rem",color:acc}}>◈</span><span style={{fontSize:".68rem",color:t.tx,fontWeight:600,flex:1}}>Reprendre : {bookmark.name}</span><span style={{fontSize:".58rem",color:t.tx3}}>→</span></div>)}

          {versetDuJour&&(
            <div style={{marginTop:8,padding:"10px 14px",background:`linear-gradient(135deg,${acc}12,${acc}06)`,borderRadius:10,border:`1px solid ${acc}30`,cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 4px 16px ${acc}22`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}
              onClick={()=>{const s=SURAHS.find(x=>x.n===versetDuJour.sn);if(s){doSelect(s);setPage("quran");}}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <span style={{fontSize:".58rem",color:acc,textTransform:"uppercase",letterSpacing:"1.5px",fontWeight:700}}>Verset du jour</span>
                <span style={{fontSize:".6rem",color:t.tx3}}>{versetDuJour.surah} · v.{versetDuJour.n}</span>
              </div>
              <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.2rem",direction:"rtl",textAlign:"right",lineHeight:2,color:t.tx,marginBottom:4}}>
                {(versetDuJour.ar||"").replace(/<[^>]*>/g,"")}
              </div>
              {versetDuJour.fr&&<div style={{fontSize:".65rem",color:t.tx2,fontStyle:"italic",lineHeight:1.5}}>{versetDuJour.fr}</div>}
            </div>
          )}
        <svg style={{position:"absolute",bottom:0,left:0,width:"100%",height:10,display:"block"}} preserveAspectRatio="none" viewBox="0 0 800 10"><path d="M0,5 Q25,9 50,5 Q75,1 100,5 Q125,9 150,5 Q175,1 200,5 Q225,9 250,5 Q275,1 300,5 Q325,9 350,5 Q375,1 400,5 Q425,9 450,5 Q475,1 500,5 Q525,9 550,5 Q575,1 600,5 Q625,9 650,5 Q675,1 700,5 Q725,9 750,5 Q775,1 800,5" stroke={acc} strokeWidth=".8" fill="none" opacity=".3"/></svg>
      </div>

      <div className={`wrap${pageTransition?" transitioning":""}`}>
        {page==="quran"&&(
          <div className="two">
            <div className="lp card">
              <div className="ltabs">
                {[["list","Sourates"],["juz","Juz"],["pages-nav","Pages"],["vsearch","Versets"],["themes","Thèmes"]].map(([id,l])=>(
                  <button key={id} className={`lt ${ltab===id?"on":""}`} onClick={()=>setLtab(id)}>{l}</button>
                ))}
              </div>
              {ltab==="list"&&(<div className="sbox"><input className="sinp" placeholder="Chercher sourate…" value={search} onChange={e=>setSearch(e.target.value)} onInput={e=>setSearch(e.target.value)} inputMode="search" type="search" autoComplete="off" autoCorrect="off" spellCheck={false}/></div>)}
              {ltab==="pages-nav"&&(
                <div className="slist">
                  <div style={{padding:"6px 10px",borderBottom:`1px solid ${t.b1}`,fontSize:".58rem",color:t.tx3,display:"flex",justifyContent:"space-between"}}>
                    <span>604 pages · cliquer pour ouvrir</span>
                    <span style={{color:t.gr}}>{Object.keys(pageRead).filter(k=>pageRead[k]).length} lues</span>
                  </div>
                  <div style={{padding:"8px",display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3,overflowY:"auto"}}>
                    {Array.from({length:604},(_,i)=>i+1).map(pg=>{
                      const isRead=pageRead[String(pg)];
                      const isCur=(mushafPage||1)===pg;
                      const surahEntry=Object.entries(SURAH_PAGE).find(([_,p])=>p===pg);
                      return (
                        <div key={pg}
                          title={surahEntry?`Sourate ${surahEntry[0]} — page ${pg}`:`Page ${pg}`}
                          style={{height:28,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:".55rem",fontWeight:700,
                            border:`1px solid ${isCur?t.acc:surahEntry?(t.acc+"55"):isRead?t.gr:t.b1}`,
                            background:isRead?`${t.gr}18`:isCur?`${t.acc}20`:surahEntry?`${t.acc}08`:t.s2,
                            color:isCur?t.acc:isRead?t.gr:t.tx3,transition:"all .12s"}}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor=t.acc;e.currentTarget.style.transform="scale(1.1)";}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor=isCur?t.acc:surahEntry?`${t.acc}55`:isRead?t.gr:t.b1;e.currentTarget.style.transform="";}}
                          onClick={()=>{setMushafPage(pg);setPage("mushaf");}}>
                          {pg}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {ltab==="vsearch"&&(
                <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
                  <div className="sbox" style={{borderBottom:`1px solid ${t.b1}`}}>
                    <input className="sinp" placeholder="Chercher en arabe ou français…" value={verseSearch} onChange={e=>{setVerseSearch(e.target.value);searchVerses(e.target.value);}} autoFocus/>
                  </div>
                  <div className="slist">
                    {verseSearchLoading&&<div style={{textAlign:"center",padding:20,color:t.tx3,fontSize:".75rem"}}>Recherche…</div>}
                    {!verseSearchLoading&&verseSearch&&verseSearchResults.length===0&&(<div style={{textAlign:"center",padding:20,color:t.tx3,fontSize:".75rem"}}>Aucun résultat dans les sourates téléchargées</div>)}
                    {verseSearchResults.map((r,i)=>(
                      <div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${t.b1}`,cursor:"pointer",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=t.s2} onMouseLeave={e=>e.currentTarget.style.background=""} onClick={()=>{const s=SURAHS.find(x=>x.n===r.sn);if(s)doSelect(s);addToHistory(r.sn,r.vn);}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:".68rem",fontWeight:600,color:t.acc}}>{r.surah}</span><span style={{fontSize:".6rem",color:t.tx3}}>v.{r.vn}</span></div>
                        <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1rem",direction:"rtl",textAlign:"right",color:t.tx,lineHeight:1.8,marginBottom:4}}>{r.ar}</div>
                        {r.fr&&<div style={{fontSize:".65rem",color:t.tx2,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{r.fr}</div>}
                      </div>
                    ))}
                    {!verseSearch&&(<div style={{padding:16,color:t.tx3,fontSize:".72rem",textAlign:"center"}}><div style={{fontSize:"1.5rem",marginBottom:8}}>🔍</div>Tape en arabe ou français pour chercher</div>)}
                  </div>
                </div>
              )}
              {ltab==="themes"&&(
                <div className="slist">
                  {QURAN_THEMES.map(th=>(
                    <div key={th.id} style={{padding:"10px 12px",borderBottom:`1px solid ${t.b1}`,cursor:"pointer",background:selTheme===th.id?t.s3:"transparent",transition:"background .15s"}} onClick={()=>setSelTheme(selTheme===th.id?null:th.id)}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:"1.4rem",width:28,textAlign:"center",flexShrink:0}}>{th.icon}</span>
                        <div style={{flex:1,minWidth:0}}><div style={{fontSize:".76rem",fontWeight:700,color:th.color,whiteSpace:"nowrap"}}>{th.label}</div><div style={{fontSize:".58rem",color:t.tx3,marginTop:1}}>{th.desc}</div></div>
                        <span style={{fontSize:".6rem",color:t.tx3,background:t.s2,padding:"2px 6px",borderRadius:4,flexShrink:0}}>{th.verses.length}v</span>
                      </div>
                      {selTheme===th.id&&(
                        <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4}}>
                          {th.verses.map((ref,i)=>{const s=SURAHS.find(x=>x.n===ref.s);return(
                            <div key={i} style={{padding:"6px 10px",background:t.s2,borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateX(3px)"} onMouseLeave={e=>e.currentTarget.style.transform=""} onClick={e=>{e.stopPropagation();const su=SURAHS.find(x=>x.n===ref.s);if(su){doSelect(su);setTimeout(()=>{const el=document.getElementById(`v-${ref.s}-${ref.v}`);if(el)el.scrollIntoView({behavior:"smooth",block:"center"});},600);}}}>
                              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:".62rem",color:th.color,fontWeight:600}}>{s?.name}</span><span style={{fontSize:".6rem",color:t.tx2,fontFamily:"'Amiri',serif"}}>{s?.ar}</span></div>
                              <span style={{fontSize:".6rem",color:t.tx3,background:t.s3,padding:"2px 6px",borderRadius:4}}>v.{ref.v}</span>
                            </div>
                          );})}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {ltab==="list"&&(
                <div className="slist">
                  {filtered.length===0&&(
                    <div style={{textAlign:"center",padding:"30px 20px",color:t.tx3}}>
                      <div style={{fontSize:"1.5rem",marginBottom:8}}>🔍</div>
                      <div style={{fontSize:".75rem",fontWeight:600,marginBottom:4}}>Aucune sourate trouvée</div>
                      <div style={{fontSize:".65rem"}}>Essaie un autre nom ou numéro</div>
                    </div>
                  )}
                  {filtered.map(s=>{
                    const p=sPct(s),emb=!!Q[s.n];
                    const sw=swipeState[s.n]||{x:0,swiping:false};
                    const revealed=sw.x<-50;
                    const likeAction=sw.x<-130;
                    return (
                      <div key={s.n}
                        className={`srow ${selS?.n===s.n?"sel":""} ${p===100?"done":""}`}
                        style={{transform:`translateX(${Math.min(0,sw.x)}px)`,transition:sw.swiping?"none":"transform .25s ease"}}
                        onClick={()=>{ if(Math.abs(sw.x||0)<8) doSelect(s); }}
                        onTouchStart={e=>{
                          swipeTouchStart.current[s.n]=e.touches[0].clientX;
                          setSwipeState(prev=>({...prev,[s.n]:{...prev[s.n],swiping:true,x:0}}));
                        }}
                        onTouchMove={e=>{
                          const dx=e.touches[0].clientX-(swipeTouchStart.current[s.n]||0);
                          if(dx<0) setSwipeState(prev=>({...prev,[s.n]:{...prev[s.n],x:Math.max(-160,dx),swiping:true}}));
                        }}
                        onTouchEnd={()=>handleSwipeEnd(s.n,s)}
                        onMouseDown={e=>{
                          if(e.button!==0)return;
                          swipeTouchStart.current[`m_${s.n}`]=e.clientX;
                          swipeTouchStart.current[`md_${s.n}`]=true;
                        }}
                        onMouseMove={e=>{
                          if(!swipeTouchStart.current[`md_${s.n}`])return;
                          const dx=e.clientX-(swipeTouchStart.current[`m_${s.n}`]||0);
                          if(dx<-8) setSwipeState(prev=>({...prev,[s.n]:{...prev[s.n],x:Math.max(-160,dx),swiping:true}}));
                        }}
                        onMouseUp={()=>{
                          swipeTouchStart.current[`md_${s.n}`]=false;
                          handleSwipeEnd(s.n,s);
                        }}
                        onMouseLeave={()=>{
                          if(swipeTouchStart.current[`md_${s.n}`]){
                            swipeTouchStart.current[`md_${s.n}`]=false;
                            handleSwipeEnd(s.n,s);
                          }
                        }}>
                        {revealed&&(
                          <div className="srow-reveal" style={{right:0,left:`calc(100% + ${Math.min(0,sw.x)}px)`}}>
                            {likeAction
                              ?(<div className="srow-reveal-btn" style={{background:"#e91e63",color:"#fff",width:70}}>
                                  <span style={{fontSize:"1rem"}}>♥</span>
                                  <span>Favori</span>
                                </div>)
                              :(<div className="srow-reveal-btn" style={{background:revFlags[String(s.n)]==="active"?t.tx3:t.acc,color:"#fff",width:70}}>
                                  <span style={{fontSize:"1rem"}}>{revFlags[String(s.n)]==="active"?"✕":"◈"}</span>
                                  <span>{revFlags[String(s.n)]==="active"?"Retirer":"Révision"}</span>
                                </div>)
                            }
                          </div>
                        )}
                        <div className="srow-hint">← glisser</div>
                        <div className={`snum ${p===100?"done":""}`} onClick={e=>{e.stopPropagation();toggleAll(s);}}>
                          {p===100?<Icons.Check size={10} color={t.gr}/>:s.n}
                        </div>
                        <div style={{flex:1}}>
                          <div className="sname" style={{display:"flex",alignItems:"center",gap:4}}>
                            {s.name}
                            {emb&&<span style={{fontSize:".45rem",color:t.gr}}>⬤</span>}
                            {revFlags[String(s.n)]==="active"&&<span style={{fontSize:".5rem",background:`${t.acc}20`,color:t.acc,padding:"1px 4px",borderRadius:3}}>révision</span>}
                            {revFlags[String(s.n)]==="mastered"&&<span style={{fontSize:".5rem",background:`${t.gr}20`,color:t.gr,padding:"1px 4px",borderRadius:3}}>✓</span>}
                          </div>
                          <div className="smeta">Juz {s.juz} · {s.v}v · {s.type}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div className="sar">{s.ar}</div>
                          <div className="mbar"><div className="mfill" style={{width:`${p}%`}}/></div>
                          <div style={{fontSize:".52rem",color:t.tx3,marginTop:2}}>{sMem(s)}/{s.v}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {ltab==="juz"&&(
                <>
                  <div className="jg">
                    {juzList.map(j=>{const p=juzPct(j);return(
                      <div key={j} className={`jc ${selJuz===j?"sel":""}`} onClick={()=>{setSelJuz(j===selJuz?null:j);const firstS=SURAHS.find(s=>s.juz===j);if(firstS&&j!==selJuz)doSelect(firstS);}}>
                        <div className="jl">Juz</div><div className="jn">{j}</div>
                        <div className="jb"><div className="jf" style={{width:`${p}%`}}/></div>
                        <div style={{fontSize:".56rem",color:p===100?t.gr:p>0?t.acc:t.tx3,marginTop:2}}>{p}%</div>
                      </div>
                    );})}
                  </div>
                  {selJuz&&(<div className="slist" style={{borderTop:`1px solid ${t.b1}`}}>
                    {SURAHS.filter(s=>s.juz===selJuz).map(s=>(
                      <div key={s.n} className={`srow ${selS?.n===s.n?"sel":""}`} onClick={()=>doSelect(s)}>
                        <div className={`snum ${sPct(s)===100?"done":""}`} onClick={e=>{e.stopPropagation();toggleAll(s);}}>{sPct(s)===100?<Icons.Check size={10} color={t.gr}/>:s.n}</div>
                        <div style={{flex:1}}><div className="sname">{s.name}</div><div className="smeta">{s.v}v{!!Q[s.n]&&<span style={{color:t.gr,marginLeft:4}}>⬤</span>}</div></div>
                        <div className="sar">{s.ar}</div>
                      </div>
                    ))}
                  </div>)}
                </>
              )}
            </div>

            <div ref={vpRef} id="verse-panel" className="rp">
              {!selS?(
                <div className="card empty">
                  <div className="big-ar">اختر سورة</div>
                  Sélectionne une sourate pour lire, mémoriser et écouter
                  <div style={{marginTop:8,fontSize:".65rem",color:t.acc}}>⬤ = embarqué · autres = chargés depuis internet</div>
                </div>
              ):(
                <div className="card">
                  <div className="vhd">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                      <div>
                        <div className="v-ar-title">{selS.ar}</div>
                        <div className="v-info">Sourate {selS.n} · {selS.name} · Juz {selS.juz} · {selS.v} versets · {selS.type}</div>
                        <div style={{fontSize:".6rem",color:t.tx3,marginTop:2}}>
                          {sMem(selS)}/{selS.v} mémorisés ({sPct(selS)}%)
                          {vpd>0&&sMem(selS)<selS.v&&<span style={{marginLeft:8,color:t.bl}}>· ~{Math.ceil((selS.v-sMem(selS))/vpd)} jours</span>}
                          {loadState==="error"&&<span style={{marginLeft:8,color:t.rd}}>· erreur chargement</span>}
                          {loadState==="loading"&&<span style={{marginLeft:8,color:t.tx3}}>· chargement…</span>}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <button className="tbtn" onClick={()=>toggleAll(selS)}>{sMem(selS)===selS.v?"Tout décocher":"Tout cocher"}</button>
                        {sMem(selS)>=2&&(<button className="tbtn" style={{borderColor:t.pu,color:t.pu}} onClick={()=>startTest(selS,verses)}>Test</button>)}
                      </div>
                    </div>
                    <div className="vbar"><div className="vfill" style={{width:`${sPct(selS)}%`}}/></div>
                  </div>

                  <div className="vtoolbar">
                    <button className={`tbtn ${showTj?"on":""}`} onClick={()=>setShowTj(v=>!v)}>Tajwid</button>
                    <button className={`tbtn ${showTr?"on":""}`} onClick={()=>setShowTr(v=>!v)}>Traduction</button>
                    <button className={`tbtn ${showTf?"on":""}`} onClick={()=>setShowTf(v=>!v)}>Tafsir</button>

                    <button className={`tbtn ${reviewMode?"on":""}`} style={reviewMode?{background:t.rd,borderColor:t.rd,color:"#fff"}:{}} onClick={()=>{setReviewMode(v=>!v);setRevealedVerses({});}}>{reviewMode?"Quitter révision":"Révision"}</button>
                    <button className={`tbtn ${karaokeMode?"on":""}`} style={karaokeMode?{background:"#e91e63",borderColor:"#e91e63",color:"#fff"}:{borderColor:t.b2}} onClick={()=>{setKaraokeMode(v=>!v);setActiveWordIdx(-1);}}>Tilawa</button>
                    <button className={`tbtn ${hifzMode?"on":""}`} style={hifzMode?{background:t.pu,borderColor:t.pu,color:"#fff"}:{}} onClick={()=>{setHifzMode(v=>!v);setHifzLevel({});setRevealedVerses({});}}>Hifz</button>
                    <button className="tbtn" onClick={()=>setImmersive(true)}>Immersif</button>
                    <button className={`tbtn ${focusMode?"on":""}`} style={focusMode?{background:"#1a1a1a",borderColor:"#444",color:"#fff"}:{}} onClick={()=>{setFocusMode(v=>!v);setFocusIdx(0);}}>Concentration</button>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginLeft:"auto"}}>
                      <button className="tbtn" onClick={()=>setArabicSize(s=>Math.max(1,s-0.15))}>A-</button>
                      <button className="tbtn" onClick={()=>setArabicSize(s=>Math.min(3,s+0.15))}>A+</button>
                    </div>
                  </div>

                  {SURAH_INFO[selS.n]&&(<div style={{padding:"10px 14px",background:t.s3,borderBottom:`1px solid ${t.b1}`,fontSize:".7rem",color:t.tx2,lineHeight:1.6}}><div style={{fontWeight:700,color:t.acc,marginBottom:3,fontSize:".65rem",textTransform:"uppercase",letterSpacing:"1px"}}>Vertus & occasions</div><div style={{marginBottom:4}}>{SURAH_INFO[selS.n].virtue}</div><div style={{color:t.gr,fontWeight:600}}>Quand réciter : {SURAH_INFO[selS.n].occasion}</div></div>)}

                  {reviewMode&&(<div style={{padding:"8px 14px",background:`${t.rd}22`,borderBottom:`1px solid ${t.rd}44`,display:"flex",alignItems:"center",gap:8}}><div style={{fontSize:".72rem",color:t.rd,fontWeight:600,flex:1}}>Mode révision — appuie pour révéler</div><button className="tbtn" style={{borderColor:t.rd,color:t.rd}} onClick={()=>setRevealedVerses({})}>Tout masquer</button></div>)}
                  {hifzMode&&(<div style={{padding:"8px 14px",background:`${t.pu}18`,borderBottom:`1px solid ${t.pu}44`,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <div style={{fontSize:".72rem",color:t.pu,fontWeight:600,flex:1}}>Mode Hifz — les derniers mots sont masqués. Clique pour révéler.</div>
                    <div style={{display:"flex",gap:4,alignItems:"center"}}>
                      <span style={{fontSize:".6rem",color:t.tx3}}>Difficulté :</span>
                      {[1,2,3,4,5].map(l=>(
                        <button key={l} className={`tbtn`} style={{minWidth:24,padding:"2px 6px",borderColor:l<=Object.values(hifzLevel).filter(v=>v===l).length?t.pu:t.b2}} onClick={()=>setHifzLevel(()=>{const nv={};verses.forEach(v=>{nv[v.n]=l;});return nv;})}>{l}</button>
                      ))}
                      <button className="tbtn" onClick={()=>setHifzLevel({})}>Reset</button>
                    </div>
                  </div>)}

                  <div style={{padding:"10px 14px",background:t.s1,borderBottom:`1px solid ${t.b1}`,display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:"1rem",flexShrink:0}}>🎙️</span>
                      <div style={{flex:1,position:"relative"}}>
                        <select value={rec.id} onChange={e=>setRec(RECITERS.find(r=>r.id===e.target.value)||RECITERS[0])} style={{width:"100%",appearance:"none",WebkitAppearance:"none",background:t.s2,border:`1.5px solid ${t.b1}`,borderRadius:10,padding:"8px 30px 8px 12px",fontSize:".72rem",color:t.tx,fontWeight:500,cursor:"pointer",outline:"none"}}>
                          {RECITERS.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:t.tx3,fontSize:".75rem",pointerEvents:"none"}}>▾</span>
                      </div>
                      <button onClick={()=>{if(continuousMode){setContinuousMode(false);stopListening();}else if(speechSupported&&verses.length>0){const firstV=verses.find(v=>!!(mem[String(selS.n)]||{})[String(v.n)]);if(firstV){doPlay(firstV.n);setTimeout(()=>startListening(firstV.ar,firstV.n,(s)=>continuousNext(s)),2500);}setContinuousMode(true);setContinuousIdx(0);}}} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,background:continuousMode?"#e53935":`${t.acc}22`,border:`1px solid ${continuousMode?"#e53935":t.acc}`,borderRadius:10,padding:"7px 12px",color:continuousMode?"#fff":t.acc,fontSize:".68rem",fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
                      {continuousMode?"■ Stop récit.":"🎤 Récitation"}
                    </button>
                    <button onClick={()=>{if(playlistActive&&playlist[0]?.sn===selS.n){setPlaylistActive(false);setPlaying(null);if(audioRef.current)audioRef.current.pause();}else if(verses.length>0)startPlaylist(selS.n,verses,1);}} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,background:playlistActive&&playlist[0]?.sn===selS.n?"#e53935":t.acc,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontSize:".72rem",fontWeight:700,cursor:"pointer",boxShadow:`0 2px 8px ${t.acc}44`,transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>{playlistActive&&playlist[0]?.sn===selS.n?"■ Stop":"▶ Sourate"}</button>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:".6rem",color:t.tx3}}>Répét.</span>
                      {[1,3,5,10].map(n=>(<button key={n} className={`tbtn ${loopCount===n?"on":""}`} onClick={()=>setLoopCount(n)} style={{minWidth:26,padding:"3px 6px"}}>{n}×</button>))}
                      {loopCurrent>1&&<span style={{fontSize:".6rem",color:t.acc,fontWeight:700}}>{loopCurrent}/{loopCount}</span>}
                      <span style={{fontSize:".6rem",color:t.tx3,marginLeft:4}}>Vitesse</span>
                      {[0.75,1,1.25,1.5].map(s=>(<button key={s} className={`tbtn ${playbackRate===s?"on":""}`} onClick={()=>setPlaybackRate(s)} style={{minWidth:32,padding:"3px 5px"}}>{s}×</button>))}
                      <button className="tbtn" style={{marginLeft:"auto",borderColor:bookmark?.sn===selS.n?t.acc:t.b2,color:bookmark?.sn===selS.n?t.acc:t.tx3,fontWeight:bookmark?.sn===selS.n?700:400}} onClick={()=>setBookmark(bookmark?.sn===selS.n?null:{sn:selS.n,name:selS.name})}>{bookmark?.sn===selS.n?"● Signet":"○ Signet"}</button>
                    </div>
                  </div>

                  {showTj&&(<div className="tj-legend">
                    {[
                      [tjc.m,"Madd naturel"],[tjc.mr,"Madd permissible"],[tjc.mo,"Madd wajib"],
                      [tjc.ml,"Madd lazim"],[tjc.g,"Ghunna/Idgham"],[tjc.q,"Qalqala"],
                      [tjc.ikh,"Ikhfa"],[tjc.iql,"Iqlab"],[tjc.ls,"Lam shamsiyya"],
                    ].map(([c,l])=>(<div key={l} className="tj-item"><div className="tj-dot" style={{background:c}}/><span style={{color:t.tx2,fontSize:".58rem"}}>{l}</span></div>))}
                  </div>)}

                  {playing!==null&&(<div className="arow"><button className="vbtn snd" style={{flexShrink:0}} onClick={()=>doPlay(playing)}>{audioPlaying?"⏸":"▶ "+playing}</button><span style={{fontSize:".62rem",color:t.tx2,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selS?.name} · v.{playing} · {rec.name}</span><button className="tbtn" style={{flexShrink:0}} onClick={()=>{setPlaying(null);if(audioRef.current){audioRef.current.pause();audioRef.current.src="";}}}>✕</button></div>)}

                  {continuousMode&&(
                    <div style={{padding:"10px 14px",background:"linear-gradient(135deg,rgba(233,30,99,.12),rgba(233,30,99,.06))",borderBottom:`1px solid rgba(233,30,99,.3)`,display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:"#e91e63",animation:"pulse .8s infinite",flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:".72rem",fontWeight:700,color:"#e91e63"}}>Mode récitation active</div>
                        <div style={{fontSize:".6rem",color:t.tx3,marginTop:1}}>Écoute → répète → valide · verset {continuousIdx+1}/{verses.length}</div>
                      </div>
                      <div style={{height:24,width:1,background:"rgba(233,30,99,.3)"}}/>
                      <button onClick={()=>{setContinuousMode(false);stopListening();}} style={{background:"none",border:"1px solid rgba(233,30,99,.4)",color:"#e91e63",borderRadius:6,padding:"3px 8px",fontSize:".62rem",cursor:"pointer",fontWeight:600}}>■ Stop</button>
                    </div>
                  )}
                  <div className="vscroll" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    {loadState==="loading"&&(<div style={{textAlign:"center",padding:"30px 14px",color:t.tx3}}><div style={{display:"inline-block",width:22,height:22,border:`2px solid ${t.b2}`,borderTopColor:t.acc,borderRadius:"50%",animation:"spin .7s linear infinite",marginBottom:10}}/><div style={{fontSize:".8rem"}}>Chargement des versets…</div></div>)}
                    {loadState==="error"&&(<div style={{textAlign:"center",padding:"24px 14px",color:t.rd,fontSize:".78rem"}}><div style={{fontSize:"1.8rem",marginBottom:8}}>⚠️</div>Impossible de charger cette sourate.<br/><button className="tbtn" style={{marginTop:10,borderColor:t.acc,color:t.acc}} onClick={()=>{const s=selS;setSelS(null);setTimeout(()=>setSelS(s),50);}}>↻ Réessayer</button></div>)}
                    {loadState==="done"&&verses.map(v=>{
                      const isMem=!!(mem[String(selS.n)]||{})[String(v.n)];
                      const isPl=playing===v.n;
                      const isRevealed=!!revealedVerses[v.n];
                      const spacedKey=`${selS.n}_${v.n}`;
                      const isDue=spacedDue.includes(spacedKey);
                      const showBismillah=v.n===1&&selS.n!==1&&selS.n!==9;
                      return (
                        <React.Fragment key={v.n}>
                          {showBismillah&&(<div style={{textAlign:"center",padding:"14px 8px 6px",direction:"rtl",fontFamily:"'Amiri Quran',serif",fontSize:"1.3rem",color:t.acc,letterSpacing:2,borderBottom:`1px solid ${t.b1}`,marginBottom:4,background:`linear-gradient(135deg,${t.acc}08,transparent)`}}>بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>)}
                          <div id={`v-${selS?.n}-${v.n}`} className={`vitem ${isMem?"mem":""} ${isPl?"pl":""} ${isDue?"due":""}`}>
                            <div className="vtop">
                              <div className={`vnum ${isMem?"mem":""} ${isPl?"pl":""}`} onClick={()=>toggleV(selS.n,v.n,v.ar)}>{isMem?<Icons.Check size={11} color={t.gr}/>:v.n}</div>
                              <div className="var-text" style={{fontSize:`${arabicSize}rem`}}>
                                {reviewMode&&!isRevealed
                                  ?(<div style={{background:t.b1,borderRadius:8,padding:"8px 14px",cursor:"pointer",textAlign:"center",color:t.tx3,fontSize:".75rem",userSelect:"none"}} onClick={()=>setRevealedVerses(p=>({...p,[v.n]:true}))}>Appuyer pour révéler le verset {v.n}</div>)
                                  :hifzMode&&(hifzLevel[v.n]||0)>0
                                    ?(<HifzVerseText ar={v.ar} level={hifzLevel[v.n]||0} tjc={tjc} showTj={showTj} vmark={v.n} onRevealWord={()=>setHifzLevel(p=>({...p,[v.n]:Math.max(0,(p[v.n]||0)-1)}))}/>)
                                    :karaokeMode&&playing===v.n&&wordTimings[`${selS.n}_${v.n}`]?.length
                                    ?(
                                      <bdi style={{direction:"rtl",lineHeight:2.5,letterSpacing:0}}>
                                        {wordTimings[`${selS.n}_${v.n}`].map((w,wi)=>(
                                          <span key={wi} style={{
                                            color:wi===activeWordIdx?"#e91e63":wi<activeWordIdx?t.tx2:t.tx,
                                            fontWeight:wi===activeWordIdx?900:wi<activeWordIdx?400:500,
                                            fontSize:wi===activeWordIdx?"1.1em":"1em",
                                            transition:"all .15s ease",
                                            textShadow:wi===activeWordIdx?`0 0 12px #e91e6388`:"none",
                                            display:"inline",
                                          }}>{w.text} </span>
                                        ))}
                                        <span className="vmark"> ﴿{v.n}﴾</span>
                                      </bdi>
                                    )
                                    :(<><TajwidSpan text={v.ar} enabled={showTj} tjc={tjc}/><span className="vmark"> ﴿{v.n}﴾</span></>)
                                }
                              </div>
                            </div>
                            {showTr&&v.fr&&(!reviewMode||isRevealed)&&<div className="vfr">{v.fr}</div>}
                            {showTf&&(!reviewMode||isRevealed)&&(
                              <div className="vtf">
                                <div className="vtf-hd" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                  <span>Tafsir Ibn Kathir</span>
                                  {!tafsirData[`${selS.n}_${v.n}`]&&!tafsirLoading[`${selS.n}_${v.n}`]&&(
                                    <button style={{background:"none",border:`1px solid ${t.pu}`,color:t.pu,fontSize:".58rem",cursor:"pointer",borderRadius:4,padding:"1px 6px",fontWeight:600}} onClick={()=>loadTafsir(selS.n,v.n)}>Charger</button>
                                  )}
                                </div>
                                {tafsirLoading[`${selS.n}_${v.n}`]&&<div style={{color:t.tx3,fontSize:".65rem",fontStyle:"italic",marginTop:4}}>Chargement…</div>}
                                {tafsirData[`${selS.n}_${v.n}`]
                                  ?<div style={{lineHeight:1.7,marginTop:4}}>{tafsirData[`${selS.n}_${v.n}`]}</div>
                                  :v.tf
                                    ?<div style={{lineHeight:1.7,marginTop:4}}>{v.tf}</div>
                                    :(!tafsirLoading[`${selS.n}_${v.n}`]&&<div style={{color:t.tx3,fontSize:".65rem",fontStyle:"italic",marginTop:4}}>Appuie sur "Charger" pour voir le tafsir.</div>)
                                }
                              </div>
                            )}
                            <div className="vacts">
                              <button className={`vbtn ${isMem?"mem":""}`} onClick={()=>toggleV(selS.n,v.n,v.ar)}>
                                {isMem?<><Icons.Check size={10}/>Mémorisé</>:<>+ Mémoriser</>}
                              </button>
                              <button className="vbtn snd" onClick={()=>{setLoopCurrent(1);doPlay(v.n);addToHistory(selS.n,v.n);}}>
                                <Icons.Play size={10}/>{isPl?"Stop":"Écouter"}
                              </button>
                              {speechSupported&&(
                              <button className="vbtn"
                                style={{
                                  borderColor:speechListening&&speechVerseTarget?.vn===v.n?"#e91e63":
                                             speechCountdown>0&&speechVerseTarget?.vn===v.n?"#ff9800":
                                             speechScore?.pct>=80&&speechVerseTarget?.vn===v.n?t.gr:
                                             speechScore&&speechVerseTarget?.vn===v.n?t.rd:t.b2,
                                  color:speechListening&&speechVerseTarget?.vn===v.n?"#e91e63":
                                        speechCountdown>0&&speechVerseTarget?.vn===v.n?"#ff9800":
                                        speechScore?.pct>=80&&speechVerseTarget?.vn===v.n?t.gr:
                                        speechScore&&speechVerseTarget?.vn===v.n?t.rd:t.tx3,
                                  position:"relative",overflow:"hidden",fontWeight:600,
                                }}
                                onClick={()=>{
                                  if(speechListening&&speechVerseTarget?.vn===v.n) stopListening();
                                  else if(speechCountdown>0){clearInterval(countdownRef.current);setSpeechCountdown(0);}
                                  else{setSpeechScore(null);startListening(v.ar,v.n);}
                                }}>
                                {speechCountdown>0&&speechVerseTarget?.vn===v.n&&(
                                  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="48" fill="none" stroke="#ff9800" strokeWidth="3" strokeDasharray={`${(3-speechCountdown)/3*301} 301`} strokeLinecap="round" transform="rotate(-90 50 50)" opacity=".6"/>
                                  </svg>
                                )}
                                {speechListening&&speechVerseTarget?.vn===v.n
                                  ?(<>{speechResult?<span style={{fontFamily:"'Amiri',serif",direction:"rtl",fontSize:".9rem"}}>{speechResult}</span>:<><span style={{animation:"pulse .6s infinite",display:"inline-block"}}>●</span> Écoute…</>}</>)
                                  :speechCountdown>0&&speechVerseTarget?.vn===v.n?`${speechCountdown}…`
                                  :speechScore?.pct>=80&&speechVerseTarget?.vn===v.n?`✓ ${speechScore.pct}%`
                                  :speechScore&&speechVerseTarget?.vn===v.n?`↺ ${speechScore.pct}%`
                                  :"🎤 Réciter"
                                }
                              </button>)}
                              <div style={{position:"relative",display:"inline-block"}}>
                                <button className="vbtn" onClick={()=>setOpenMenu(openMenu===`${selS.n}_${v.n}`?null:`${selS.n}_${v.n}`)}>•••</button>
                                {openMenu===`${selS.n}_${v.n}`&&(
                                  <div style={{position:"absolute",bottom:"100%",right:0,background:t.s1,border:`1px solid ${t.b2}`,borderRadius:10,padding:6,zIndex:50,display:"flex",flexDirection:"column",gap:4,minWidth:140,boxShadow:`0 4px 20px rgba(0,0,0,.3)`}}>
                                    <button className={`vbtn ${isFav(selS.n,v.n)?"mem":""}`} style={{width:"100%",textAlign:"left"}} onClick={()=>{toggleFav(selS.n,v.n,v.ar,v.fr,selS.name);setOpenMenu(null);}}>
                                      {isFav(selS.n,v.n)?"♥ Favori":"♡ Ajouter aux favoris"}
                                    </button>
                                    <button className={"vbtn "+(notes[selS.n+"_"+v.n]?"on":"")} style={{width:"100%",textAlign:"left"}} onClick={()=>{setEditingNote(selS.n+"_"+v.n);setOpenMenu(null);}}>
                                      ✏️ {notes[`${selS.n}_${v.n}`]?"Modifier note":"Ajouter note"}
                                    </button>
                                    <button className="vbtn" style={{width:"100%",textAlign:"left"}} onClick={()=>{setShareVerse({sn:selS.n,vn:v.n,ar:v.ar,fr:v.fr,surah:selS.name,surahAr:selS.ar});setOpenMenu(null);}}>
                                      ↗ Partager
                                    </button>
                                    {isMem&&(
                                      <button className={`vbtn ${isDue?"":"snd"}`} style={isDue?{borderColor:t.rd,color:t.rd,width:"100%",textAlign:"left"}:{width:"100%",textAlign:"left"}} onClick={()=>{markSpaced(selS.n,v.n);setOpenMenu(null);}}>
                                        {isDue?"⚡ Réviser maintenant":"◈ Marquer révisé"}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {page==="mushaf"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div className="card">
              <div className="ch"><span className="ct">Édition du Mushaf</span></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,padding:12}}>
                {MUSHAF_EDITIONS.map(ed=>(
                  <div key={ed.id} style={{borderRadius:12,border:`2px solid ${mushafEdition===ed.id?t.acc:t.b1}`,overflow:"hidden",cursor:"pointer",transition:"all .2s",transform:mushafEdition===ed.id?"translateY(-2px)":"none",boxShadow:mushafEdition===ed.id?`0 4px 16px ${t.acc}33`:"none"}} onMouseEnter={e=>{if(mushafEdition!==ed.id){e.currentTarget.style.borderColor=t.acc+"66";e.currentTarget.style.transform="translateY(-2px)";}}} onMouseLeave={e=>{if(mushafEdition!==ed.id){e.currentTarget.style.borderColor=t.b1;e.currentTarget.style.transform="none";}}} onClick={()=>setMushafEdition(ed.id)}>
                    <div style={{height:60,background:ed.coverBg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:"1.6rem"}}>{ed.coverIcon}</span>
                      <span style={{fontFamily:"'Amiri',serif",fontSize:".7rem",color:"#fff",opacity:.8,marginTop:2}}>{ed.coverSub}</span>
                    </div>
                    <div style={{padding:"7px 10px",background:t.s2}}>
                      <div style={{fontSize:".72rem",fontWeight:600,color:t.tx}}>{ed.name}</div>
                      <div style={{fontSize:".58rem",color:t.tx3,marginTop:1}}>{ed.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ch">
                <span className="ct">Page {mushafPage||1} / 604</span>
                <div style={{display:"flex",gap:6}}>
                  <button className="tbtn" onClick={()=>setMushafPage(p=>Math.max(1,(p||1)-1))}>← Précédente</button>
                  <button className={`tbtn ${pageRead[String(mushafPage||1)]?"on":""}`} onClick={()=>togglePage(mushafPage||1)}>{pageRead[String(mushafPage||1)]?"Lue ✓":"Marquer lue"}</button>
                  <button className="tbtn" onClick={()=>setMushafPage(p=>Math.min(604,(p||1)+1))}>Suivante →</button>
                </div>
              </div>
              <MushafPage page={mushafPage||1} t={t} tjc={tjc} arFont={arFont} edition={MUSHAF_EDITIONS.find(e=>e.id===mushafEdition)||MUSHAF_EDITIONS[0]} fullscreen={mushafFullscreen} onToggleFullscreen={()=>setMushafFullscreen(f=>!f)} onNext={()=>setMushafPage(p=>Math.min(604,(p||1)+1))} onPrev={()=>setMushafPage(p=>Math.max(1,(p||1)-1))}/>
            </div>
          </div>
        )}

        {page==="pages"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[
                {l:"En révision",v:Object.values(revFlags).filter(f=>f==="active").length,c:t.acc,icon:"◈"},
                {l:"Maîtrisées",v:Object.values(revFlags).filter(f=>f==="mastered").length,c:t.gr,icon:"✦"},
                {l:"En pause",v:Object.values(revFlags).filter(f=>f==="paused").length,c:t.tx3,icon:"◆"},
              ].map((k,i)=>(
                <div key={i} style={{background:t.cardBg,border:`1px solid ${t.b1}`,borderRadius:12,padding:"12px 10px",textAlign:"center",transition:"transform .2s,box-shadow .2s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 18px ${k.c}22`;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                  <div style={{fontSize:"1.1rem",color:k.c,marginBottom:2}}>{k.icon}</div>
                  <div style={{fontSize:"1.3rem",fontWeight:800,color:k.c}}>{k.v}</div>
                  <div style={{fontSize:".55rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",marginTop:2}}>{k.l}</div>
                </div>
              ))}
            </div>

            {Object.entries(revFlags).filter(([,f])=>f==="active").length>0&&(
              <div className="card">
                <div className="ch">
                  <span className="ct">Révision active</span>
                  <span style={{fontSize:".62rem",color:t.acc}}>Révision espacée — {spacedDue.length} dus aujourd'hui</span>
                </div>
                {SURAHS.filter(s=>revFlags[String(s.n)]==="active").map(s=>{
                  const memPct=sPct(s);
                  const spacedKeys=spacedDue.filter(k=>k.startsWith(`${s.n}_`));
                  const lastSession=revSessions.filter(x=>x.sn===s.n).slice(-1)[0];
                  return (
                    <div key={s.n} style={{padding:"13px 16px",borderBottom:`1px solid ${t.b1}`,transition:"background .15s,transform .15s"}} onMouseEnter={e=>{e.currentTarget.style.background=t.s2;e.currentTarget.style.transform="translateX(3px)";}} onMouseLeave={e=>{e.currentTarget.style.background="";e.currentTarget.style.transform="";}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                        <div style={{width:34,height:34,borderRadius:"50%",border:`2px solid ${t.acc}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Amiri',serif",fontSize:".75rem",color:t.acc,flexShrink:0}}>{s.n}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <div style={{fontWeight:700,color:t.tx,fontSize:".82rem"}}>{s.name}</div>
                            <div style={{display:"flex",gap:4}}>
                              {spacedKeys.length>0&&(<span style={{fontSize:".6rem",background:`${t.rd}18`,color:t.rd,padding:"1px 7px",borderRadius:99,fontWeight:700}}>{spacedKeys.length} dus</span>)}
                              <span style={{fontSize:".6rem",background:`${t.acc}15`,color:t.acc,padding:"1px 7px",borderRadius:99}}>{memPct}%</span>
                            </div>
                          </div>
                          <div style={{fontSize:".6rem",color:t.tx3,marginTop:2,fontFamily:"'Amiri',serif"}}>{s.ar} · Juz {s.juz} · {s.v}v</div>
                        </div>
                      </div>
                      <div style={{height:5,background:t.b1,borderRadius:99,overflow:"hidden",marginBottom:8}}>
                        <div style={{height:"100%",width:`${memPct}%`,background:memPct===100?t.gr:"linear-gradient(90deg,"+t.acc+","+t.acc2+")",borderRadius:99,boxShadow:memPct===100?`0 0 6px ${t.gr}66`:`0 0 4px ${t.acc}44`}}/>
                      </div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <button className="vbtn" style={{borderColor:t.bl,color:t.bl}} onClick={()=>{doSelect(s);setPage("quran");}}>Ouvrir</button>
                        {sMem(s)>=2&&(<button className="vbtn" style={{borderColor:t.pu,color:t.pu}} onClick={()=>startTest(s,selS?.n===s.n?verses:(Q[s.n]||[]))}>Test mémoire</button>)}
                        {spacedKeys.length>0&&(<button className="vbtn" style={{borderColor:t.rd,color:t.rd}} onClick={()=>{spacedKeys.forEach(k=>{const[sn,vn]=k.split("_").map(Number);markSpaced(sn,vn);});}}>Réviser tous</button>)}
                        {lastSession&&(<span style={{fontSize:".6rem",color:t.tx3,alignSelf:"center",marginLeft:"auto"}}>Dernière session : {new Date(lastSession.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}</span>)}
                        <button className="vbtn" style={{borderColor:t.gr,color:t.gr,marginLeft:"auto"}} onClick={()=>setRevFlags(p=>({...p,[String(s.n)]:"mastered"}))}>Maîtrisée ✓</button>
                        <button className="vbtn" onClick={()=>setRevFlags(p=>({...p,[String(s.n)]:"paused"}))}>Pause</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="card">
              <div className="ch">
                <span className="ct">Toutes les sourates</span>
                <span style={{fontSize:".62rem",color:t.tx3}}>Cliquer sur le statut pour changer</span>
              </div>

              <div>
                    <div style={{display:"flex",gap:4,padding:"8px 12px",borderBottom:`1px solid ${t.b1}`,overflowX:"auto"}}>
                      {[["all","Toutes",SURAHS.length],["memorized","Mémorisées",SURAHS.filter(s=>sPct(s)===100).length],["active","En révision",Object.values(revFlags).filter(f=>f==="active").length],["none","Sans progrès",SURAHS.filter(s=>sMem(s)===0).length]].map(([f,l,cnt])=>(
                        <button key={f} onClick={()=>setRevFilter(f)} style={{padding:"3px 10px",borderRadius:99,border:`1px solid ${revFilter===f?t.acc:t.b2}`,background:revFilter===f?`${t.acc}18`:"transparent",color:revFilter===f?t.acc:t.tx3,fontSize:".62rem",cursor:"pointer",whiteSpace:"nowrap",fontWeight:revFilter===f?700:400,transition:"all .15s"}}>{l} <span style={{opacity:.7}}>({cnt})</span></button>
                      ))}
                    </div>
                    <div style={{maxHeight:400,overflowY:"auto"}}>
                      {filtered2.map(s=>{
                        const flag=revFlags[String(s.n)];
                        const pct2=sPct(s);
                        const flagColors={active:t.acc,mastered:t.gr,paused:t.tx3};
                        const flagLabels={active:"En révision",mastered:"Maîtrisée",paused:"En pause"};
                        return (
                          <div key={s.n} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderBottom:`1px solid ${t.b1}`,transition:"background .12s"}} onMouseEnter={e=>e.currentTarget.style.background=t.s2} onMouseLeave={e=>e.currentTarget.style.background=""}>
                            <div style={{width:26,height:26,borderRadius:"50%",border:`1.5px solid ${flag?flagColors[flag]:t.b2}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".58rem",color:flag?flagColors[flag]:t.tx3,flexShrink:0}}>{s.n}</div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <span style={{fontSize:".75rem",fontWeight:600,color:t.tx}}>{s.name}</span>
                                <span style={{fontFamily:"'Amiri',serif",fontSize:".85rem",color:t.acc,flexShrink:0}}>{s.ar}</span>
                              </div>
                              <div style={{height:3,background:t.b1,borderRadius:99,overflow:"hidden",marginTop:4}}>
                                <div style={{height:"100%",width:`${pct2}%`,background:pct2===100?t.gr:t.acc,borderRadius:99}}/>
                              </div>
                              <div style={{fontSize:".55rem",color:t.tx3,marginTop:2}}>{sMem(s)}/{s.v}v · Juz {s.juz}</div>
                            </div>
                            <button onClick={()=>setRevFlags(p=>{const n={...p};const cur=n[String(s.n)];if(cur==="active")n[String(s.n)]="mastered";else if(cur==="mastered")n[String(s.n)]="paused";else if(cur==="paused")delete n[String(s.n)];else n[String(s.n)]="active";return n;})}
                              style={{padding:"4px 10px",borderRadius:8,border:`1px solid ${flag?flagColors[flag]:t.b2}`,background:flag?`${flagColors[flag]}15`:"transparent",color:flag?flagColors[flag]:t.tx3,fontSize:".6rem",cursor:"pointer",flexShrink:0,fontWeight:flag?700:400,transition:"all .15s",whiteSpace:"nowrap"}}>
                              {flag?flagLabels[flag]:"+ Ajouter"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
            </div>

            {Object.entries(revFlags).filter(([,f])=>f==="mastered").length>0&&(
              <div className="card">
                <div className="ch"><span className="ct">Maîtrisées</span><span style={{fontSize:".65rem",color:t.gr,fontWeight:700}}>{Object.entries(revFlags).filter(([,f])=>f==="mastered").length} sourates</span></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,padding:12}}>
                  {SURAHS.filter(s=>revFlags[String(s.n)]==="mastered").map(s=>(
                    <div key={s.n} style={{padding:"5px 12px",borderRadius:99,background:`${t.gr}15`,border:`1px solid ${t.gr}44`,display:"flex",alignItems:"center",gap:6,cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}} onClick={()=>{doSelect(s);setPage("quran");}}>
                      <span style={{fontSize:".68rem",fontWeight:700,color:t.gr}}>{s.name}</span>
                      <span style={{fontFamily:"'Amiri',serif",fontSize:".78rem",color:t.acc}}>{s.ar}</span>
                      <button onClick={e=>{e.stopPropagation();setRevFlags(p=>{const n={...p};delete n[String(s.n)];return n;});}} style={{background:"none",border:"none",color:`${t.gr}77`,cursor:"pointer",fontSize:".65rem",padding:"0 0 0 2px",lineHeight:1}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card">
              <div className="ch"><span className="ct">Activité de mémorisation</span><span style={{fontSize:".62rem",color:t.tx3}}>14 derniers jours</span></div>
              <div style={{padding:"10px 14px"}}>
                <div style={{display:"flex",gap:3,alignItems:"flex-end",height:60}}>
                  {Object.keys(hist).sort().slice(-14).map((d,i)=>{
                    const prev=i>0?hist[Object.keys(hist).sort().slice(-14)[i-1]]:0;
                    const gain=Math.max(0,(hist[d]||0)-prev);
                    const maxG2=Math.max(...Object.keys(hist).sort().slice(-14).map((dk,ii)=>{const p2=ii>0?hist[Object.keys(hist).sort().slice(-14)[ii-1]]:0;return Math.max(0,(hist[dk]||0)-p2);}),1);
                    const isToday=d===today();
                    const lbl=new Date(d).toLocaleDateString("fr-FR",{weekday:"short"});
                    return (
                      <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                        {gain>0&&<span style={{fontSize:".48rem",color:t.acc,fontWeight:700}}>+{gain}</span>}
                        <div style={{width:"100%",height:`${Math.max(Math.round(gain/maxG2*50),3)}px`,background:isToday?t.acc:`${t.acc}66`,borderRadius:"3px 3px 0 0",transition:"height .3s"}}/>
                        <span style={{fontSize:".48rem",color:isToday?t.acc:t.tx3,fontWeight:isToday?700:400}}>{lbl}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {page==="khatma"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {!activeKhatma?(
              <>
                <div style={{background:`linear-gradient(135deg,${t.s2},${t.s3})`,borderRadius:16,padding:"24px 20px",border:`1px solid ${t.b1}`,textAlign:"center",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 0%,${t.acc}12,transparent 60%)`,pointerEvents:"none"}}/>
                  <div style={{fontFamily:"'Amiri',serif",fontSize:"2.5rem",color:t.acc,marginBottom:4,textShadow:`0 0 20px ${t.acc}44`}}>ختمة القرآن</div>
                  <div style={{fontSize:".75rem",color:t.tx2,marginBottom:16,lineHeight:1.7}}>Commence une Khatma pour suivre ta lecture complète du Coran.<br/>Chaque jour compté, chaque page une victoire.</div>
                  <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
                    {[{v:SURAHS.filter(s=>sMem(s)===s.v).length,l:"Sourates mémorisées",c:t.gr},{v:totalMem,l:"Versets mémorisés",c:t.acc},{v:Object.keys(pageRead).filter(k=>pageRead[k]).length,l:"Pages lues",c:t.bl}].map((k,i)=>(
                      <div key={i} style={{textAlign:"center",padding:"10px 16px",background:`${k.c}12`,borderRadius:12,border:`1px solid ${k.c}30`}}>
                        <div style={{fontSize:"1.4rem",fontWeight:800,color:k.c}}>{k.v}</div>
                        <div style={{fontSize:".58rem",color:t.tx3,marginTop:2}}>{k.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="ch"><span className="ct">Nouvelle Khatma</span></div>
                  <div style={{padding:16}}>
                    <div style={{marginBottom:14}}>
                      <label style={{display:"block",fontSize:".65rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Nom de ta Khatma</label>
                      <input className="sinp" style={{width:"100%",padding:"10px 14px",fontSize:".85rem"}} value={kName} onChange={e=>setKName(e.target.value)} placeholder="ex: Ma Khatma Ramadan 1446…"/>
                    </div>
                    <label style={{display:"block",fontSize:".65rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>Rythme</label>
                    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                      {KHATMA_PRESETS.map(kp=>{
                        const sel=kPreset?.id===kp.id;
                        const pagesPerDay={daily:604,weekly:86,monthly:20,ramadan:20,custom:null};
                        const ppd=pagesPerDay[kp.id];
                        return (
                          <div key={kp.id} onClick={()=>setKPreset(kp)}
                            style={{display:"flex",alignItems:"center",gap:14,padding:"13px 16px",borderRadius:12,
                              border:`2px solid ${sel?t.acc:t.b1}`,
                              background:sel?`linear-gradient(135deg,${t.acc}12,${t.acc2}06)`:t.s2,
                              cursor:"pointer",transition:"all .18s",
                              boxShadow:sel?`0 4px 16px ${t.acc}22`:"none",
                            }}
                            onMouseEnter={e=>{if(!sel){e.currentTarget.style.borderColor=t.acc+"66";e.currentTarget.style.transform="translateX(3px)";}}}
                            onMouseLeave={e=>{if(!sel){e.currentTarget.style.borderColor=t.b1;e.currentTarget.style.transform="";}}}>
                            <div style={{width:36,height:36,borderRadius:"50%",border:`1.5px solid ${sel?t.acc:t.b2}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:sel?`${t.acc}15`:"transparent",transition:"all .18s"}}>
                              {sel
                                ?<svg width="14" height="14" viewBox="0 0 14 14"><polyline points="2,7 5.5,10.5 12,3.5" stroke={t.acc} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                :<div style={{width:6,height:6,borderRadius:"50%",background:t.b2}}/>
                              }
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:".82rem",fontWeight:700,color:sel?t.acc:t.tx,marginBottom:2}}>{kp.label}</div>
                              <div style={{fontSize:".63rem",color:t.tx3,lineHeight:1.4}}>{kp.desc}</div>
                            </div>
                            {ppd&&<div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:".75rem",fontWeight:700,color:sel?t.acc:t.tx2}}>{ppd}</div><div style={{fontSize:".52rem",color:t.tx3}}>p/j</div></div>}
                          </div>
                        );
                      })}
                    </div>
                                        {kPreset?.id==="custom"&&(
                      <div style={{marginBottom:14,padding:"12px 14px",background:t.s2,borderRadius:10,border:`1px solid ${t.b1}`}}>
                        <label style={{display:"block",fontSize:".65rem",color:t.tx3,marginBottom:6}}>Nombre de jours</label>
                        <input className="sinp" type="number" min="1" value={kCustomDays} onChange={e=>setKCustomDays(e.target.value)} style={{width:100}}/>
                      </div>
                    )}
                    {kPreset&&(
                      <button onClick={createKhatma} style={{width:"100%",padding:"13px",background:`linear-gradient(135deg,${t.acc},${t.acc2})`,border:"none",borderRadius:12,color:"#fff",fontSize:".88rem",fontWeight:700,cursor:"pointer",boxShadow:`0 4px 16px ${t.acc}44`,transition:"transform .15s,box-shadow .15s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 6px 20px ${t.acc}55`;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 16px ${t.acc}44`;}}>
                        Commencer la Khatma ✦
                      </button>
                    )}
                  </div>
                </div>

                {khatmas.length>0&&(
                  <div className="card">
                    <div className="ch"><span className="ct">Khatmas précédentes</span></div>
                    {khatmas.map(k=>{
                      const done=Object.values(k.log).filter(Boolean).length;
                      const p2=Math.round(done/k.totalDays*100);
                      return (
                        <div key={k.id} style={{padding:"14px 16px",borderBottom:`1px solid ${t.b1}`,cursor:"pointer",transition:"background .15s,transform .15s"}} onMouseEnter={e=>{e.currentTarget.style.background=t.s2;e.currentTarget.style.transform="translateX(4px)";}} onMouseLeave={e=>{e.currentTarget.style.background="";e.currentTarget.style.transform="";}} onClick={()=>setActiveKhatma(k)}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                            <div><div style={{fontWeight:700,color:t.tx,fontSize:".85rem"}}>{k.name}</div><div style={{fontSize:".62rem",color:t.tx3,marginTop:2}}>Démarré le {new Date(k.startDate).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}</div></div>
                            <div style={{textAlign:"right"}}><div style={{fontSize:"1.1rem",fontWeight:800,color:p2===100?t.gr:t.acc}}>{p2}%</div><div style={{fontSize:".58rem",color:t.tx3}}>{done}/{k.totalDays}j</div></div>
                          </div>
                          <div style={{height:5,background:t.b1,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${p2}%`,background:p2===100?t.gr:`linear-gradient(90deg,${t.acc},${t.acc2})`,borderRadius:99,transition:"width .5s"}}/></div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ):(
              /* Active Khatma view */
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{background:`linear-gradient(135deg,${t.s2},${t.s3})`,borderRadius:16,padding:"20px 18px",border:`1px solid ${t.b1}`,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:`radial-gradient(circle,${t.acc}10,transparent 70%)`,borderRadius:"0 16px 0 0",pointerEvents:"none"}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                    <div>
                      <div style={{fontFamily:"'Amiri',serif",fontSize:"1.6rem",color:t.acc,lineHeight:1,marginBottom:4}}>{activeKhatma.name}</div>
                      <div style={{fontSize:".65rem",color:t.tx3}}>Depuis le {new Date(activeKhatma.startDate).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div>
                    </div>
                    <button onClick={()=>setActiveKhatma(null)} style={{background:"transparent",border:`1px solid ${t.rd}44`,color:t.rd,borderRadius:8,padding:"5px 10px",fontSize:".65rem",cursor:"pointer",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.background=`${t.rd}12`;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>Terminer</button>
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:".65rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px"}}>Progression</span>
                      <span style={{fontSize:".8rem",fontWeight:800,color:t.acc}}>{Math.round(Object.values(activeKhatma.log).filter(Boolean).length/activeKhatma.totalDays*100)}%</span>
                    </div>
                    <div style={{height:14,background:t.b1,borderRadius:99,overflow:"hidden",boxShadow:"inset 0 2px 4px rgba(0,0,0,.1)"}}>
                      <div style={{height:"100%",width:`${Math.round(Object.values(activeKhatma.log).filter(Boolean).length/activeKhatma.totalDays*100)}%`,background:`linear-gradient(90deg,${t.acc},${t.acc2},${t.acc3})`,borderRadius:99,boxShadow:`0 0 8px ${t.acc}66`,transition:"width .8s ease",position:"relative"}}>
                        <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)",borderRadius:99}}/>
                      </div>
                    </div>
                  </div>
                  <div className="kh-stats">
                    <div className="khs"><div className="khs-v">{Object.values(activeKhatma.log).filter(Boolean).length}</div><div className="khs-l">Jours ✓</div></div>
                    <div className="khs"><div style={{fontSize:"1.4rem"}}>🔥</div><div className="khs-v">{khatmaStreak(activeKhatma)}j</div><div className="khs-l">Série ◈</div></div>
                    <div className="khs"><div className="khs-v" style={{color:t.rd}}>{Math.max(0,activeKhatma.totalDays-Object.values(activeKhatma.log).filter(Boolean).length)}</div><div className="khs-l">Restants</div></div>
                  </div>
                </div>

                <div className="card">
                  <div className="ch"><span className="ct">Calendrier</span><span style={{fontSize:".65rem",color:t.tx3}}>{activeKhatma.totalDays} jours · page/jour ≈ {Math.ceil(604/activeKhatma.totalDays)}</span></div>
                  <div style={{padding:"10px 12px"}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
                      {["D","L","M","M","J","V","S"].map((d,i)=>(<div key={i} style={{textAlign:"center",fontSize:".52rem",color:t.tx3,fontWeight:700,padding:"3px 0"}}>{d}</div>))}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
                      {getKhatmaDays(activeKhatma).map((d,i)=>{
                        const isDone=activeKhatma.log[d];
                        const isTod=d===today();
                        const isFut=d>today();
                        return (
                          <div key={i} style={{aspectRatio:"1",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",fontWeight:700,cursor:isFut?"default":"pointer",border:`1.5px solid ${isTod?t.acc:isDone?t.gr:t.b2}`,background:isDone?`${t.gr}25`:isTod?`${t.acc}18`:t.s2,color:isTod?t.acc:isDone?t.gr:isFut?t.tx3+"66":t.tx3,transition:"all .15s",minHeight:28}} onMouseEnter={e=>{if(!isFut){e.currentTarget.style.transform="scale(1.12)";e.currentTarget.style.boxShadow=`0 2px 8px ${t.acc}33`;e.currentTarget.style.borderColor=t.acc;}}} onMouseLeave={e=>{if(!isFut){e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";e.currentTarget.style.borderColor=isTod?t.acc:isDone?t.gr:t.b2;}}} onClick={()=>{if(!isFut)markKhatmaDay(activeKhatma,d);}}>
                            {isDone?"✓":i+1}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="ch"><span className="ct">Progression du Coran</span></div>
                  <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
                    {[{l:"Juz terminés",v:SURAHS.reduce((s,su)=>{const j=su.juz;if(!s.includes(j)&&SURAHS.filter(x=>x.juz===j).every(x=>sMem(x)===x.v))return[...s,j];return s;},[]).length,max:30,c:t.acc},{l:"Sourates terminées",v:SURAHS.filter(s=>sMem(s)===s.v).length,max:114,c:t.gr},{l:"Versets mémorisés",v:totalMem,max:TOTAL_VERSES,c:t.bl},{l:"Pages lues",v:Object.keys(pageRead).filter(k=>pageRead[k]).length,max:604,c:t.pu}].map((it,i)=>(
                      <div key={i}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:".7rem",color:t.tx2}}>{it.l}</span><span style={{fontSize:".7rem",color:it.c,fontWeight:700}}>{it.v}<span style={{color:t.tx3,fontWeight:400}}>/{it.max}</span></span></div>
                        <div style={{height:7,background:t.b1,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${it.v/it.max*100}%`,background:it.c,borderRadius:99,transition:"width .6s",boxShadow:`0 0 6px ${it.c}55`}}/></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {page==="communaute"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div className="card">
              <div className="ch"><span className="ct">Versets favoris</span><span style={{fontSize:".65rem",color:t.tx3}}>{favorites.length} versets</span></div>
              {favorites.length===0?(<div className="empty"><div style={{fontSize:"1.8rem",marginBottom:8}}>💚</div>Marque des versets avec ♥ pour les retrouver ici</div>):(
                <div>{favorites.map((fav,i)=>(
                  <div key={i} style={{padding:"12px 14px",borderBottom:`1px solid ${t.b1}`,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=t.s2} onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:".72rem",fontWeight:600,color:t.acc}}>{fav.surah} · v.{fav.vn}</span>
                      <button className="vbtn" style={{borderColor:t.rd,color:t.rd}} onClick={()=>toggleFav(fav.sn,fav.vn,fav.ar,fav.fr,fav.surah)}>✕</button>
                    </div>
                    <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.2rem",direction:"rtl",textAlign:"right",color:t.tx,lineHeight:2,marginBottom:6}}>{fav.ar.replace(/<[^>]*>/g,"")}</div>
                    {fav.fr&&<div style={{fontSize:".7rem",color:t.tx2,fontStyle:"italic",lineHeight:1.6}}>{fav.fr}</div>}
                    <div style={{marginTop:8,display:"flex",gap:6}}>
                      <button className="vbtn snd" onClick={()=>{const s=SURAHS.find(x=>x.n===fav.sn);if(s){doSelect(s);setPage("quran");}}}><Icons.Book size={10}/>Ouvrir</button>
                      <button className="vbtn" onClick={()=>setShareVerse({sn:fav.sn,vn:fav.vn,ar:fav.ar,fr:fav.fr,surah:fav.surah,surahAr:SURAHS.find(s=>s.n===fav.sn)?.ar||""})}><Icons.Share size={10}/>Partager</button>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
            <div className="card">
              <div className="ch"><span className="ct">Mes listes</span></div>
              <div style={{padding:12}}>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <input className="sinp" style={{flex:1}} placeholder="Nom de la liste…" value={newListName} onChange={e=>setNewListName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newListName.trim()){createList(newListName);}}}/>
                  <button className="tbtn" style={{borderColor:t.acc,color:t.acc,flexShrink:0}} onClick={()=>createList(newListName)}>Créer</button>
                </div>
                {lists.length===0?<div style={{textAlign:"center",color:t.tx3,fontSize:".75rem",padding:"12px 0"}}>Crée des listes thématiques de versets</div>:(
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {lists.map(l=>(
                      <div key={l.id} style={{background:t.s2,border:`1px solid ${selList===l.id?t.acc:t.b1}`,borderRadius:10,overflow:"hidden",transition:"border-color .2s"}}>
                        <div style={{padding:"10px 12px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>setSelList(selList===l.id?null:l.id)}>
                          <span style={{fontWeight:600,color:t.tx}}>{l.name}</span>
                          <span style={{fontSize:".65rem",color:t.tx3,background:t.s3,padding:"2px 8px",borderRadius:99}}>{l.items.length} versets</span>
                        </div>
                        {selList===l.id&&l.items.map((it,i)=>(
                          <div key={i} style={{padding:"8px 12px",borderTop:`1px solid ${t.b1}`,display:"flex",alignItems:"center",gap:8,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=t.s3} onMouseLeave={e=>e.currentTarget.style.background=""}>
                            <div style={{flex:1}}><span style={{fontSize:".68rem",color:t.acc,fontWeight:600}}>{it.surah} v.{it.vn}</span></div>
                            <button className="vbtn" style={{borderColor:t.rd,color:t.rd,fontSize:".58rem"}} onClick={()=>removeFromList(l.id,it.sn,it.vn)}>✕</button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {readHistory.length>0&&(
              <div className="card">
                <div className="ch"><span className="ct">Historique de lecture</span><button className="tbtn" style={{borderColor:t.rd,color:t.rd,fontSize:".6rem"}} onClick={()=>setReadHistory([])}>Effacer</button></div>
                <div style={{maxHeight:260,overflowY:"auto"}}>
                  {readHistory.slice(0,20).map((h,i)=>(
                    <div key={i} style={{padding:"8px 14px",borderBottom:`1px solid ${t.b1}`,display:"flex",alignItems:"center",gap:10,cursor:"pointer",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=t.s2} onMouseLeave={e=>e.currentTarget.style.background=""} onClick={()=>{const s=SURAHS.find(x=>x.n===h.sn);if(s){doSelect(s);setPage("quran");}}}>
                      <span style={{fontSize:".72rem",color:t.acc,fontWeight:600}}>{h.surah}</span>
                      <span style={{fontSize:".65rem",color:t.tx3}}>v.{h.vn}</span>
                      <span style={{fontSize:".6rem",color:t.tx3,marginLeft:"auto"}}>{new Date(h.ts).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {page==="stats"&&(
          <div className="sp">
            <div className="card" style={{overflow:"hidden"}}>
              <div className="ch"><span className="ct">Constellation du Coran</span><span style={{fontSize:".62rem",color:t.tx3}}>{SURAHS.filter(s=>sPct(s)===100).length} / 114 sourates allumées</span></div>
              <div style={{padding:"8px 4px 4px",position:"relative"}}>
                <svg viewBox="0 0 380 260" style={{width:"100%",display:"block"}}>
                  <defs>
                    <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#c9a84c" stopOpacity="1"/>
                      <stop offset="100%" stopColor="#c9a84c" stopOpacity="0"/>
                    </radialGradient>
                    <filter id="glow2">
                      <feGaussianBlur stdDeviation="2" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                  {Array.from({length:40},(_,i)=>(
                    <circle key={`star-${i}`} cx={(i*97+13)%380} cy={(i*61+7)%260} r={0.3+((i*37)%10)*0.05} fill="white" opacity={0.15+((i*23)%30)*0.01}/>
                  ))}
                  <path d="M 40 200 Q 120 20 200 15 Q 280 10 340 80 Q 370 130 340 190" fill="none" stroke={t.acc} strokeWidth="0.3" strokeDasharray="3,6" opacity="0.2"/>
                  {SURAHS.map((s,i)=>{
                    const total=114;
                    const row=Math.floor(i/19);
                    const col=i%19;
                    const x=22+col*18.5+(row%2)*9;
                    const y=25+row*36;
                    const pct2=sPct(s);
                    const isComplete=pct2===100;
                    const hasProgress=pct2>0;
                    const isRevision=revFlags[String(s.n)]==="active";
                    const baseR=1.5+Math.min(s.v/20,3);
                    const r=isComplete?baseR+1.5:baseR;
                    return (
                      <g key={s.n} style={{cursor:"pointer"}}
                        onClick={()=>{doSelect(s);setPage("quran");}}>
                        {isComplete&&(
                          <circle cx={x} cy={y} r={r+3} fill="url(#starGlow)" opacity="0.4">
                            <animate attributeName="r" values={`${r+2};${r+5};${r+2}`} dur={`${2+i%3}s`} repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.4;0.15;0.4" dur={`${2+i%3}s`} repeatCount="indefinite"/>
                          </circle>
                        )}
                        <circle cx={x} cy={y} r={r}
                          fill={isComplete?"#c9a84c":hasProgress?`rgba(201,168,76,${pct2/100*0.6+0.1})`:"rgba(255,255,255,0.08)"}
                          stroke={isRevision?"#e91e63":isComplete?"#f5dc8c":hasProgress?`rgba(201,168,76,0.5)`:"rgba(255,255,255,0.15)"}
                          strokeWidth={isComplete?0.8:0.4}
                          filter={isComplete?"url(#glow2)":undefined}
                        />
                        {isComplete&&s.v<=10&&(
                          <text x={x} y={y+0.5} textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#0a0800" fontWeight="bold" style={{pointerEvents:"none"}}>{s.n}</text>
                        )}
                      </g>
                    );
                  })}
                </svg>
                <div style={{display:"flex",gap:12,padding:"4px 12px 8px",justifyContent:"center",flexWrap:"wrap"}}>
                  {[[t.acc,"Mémorisée"],["rgba(201,168,76,0.4)","En cours"],["rgba(255,255,255,0.15)","À commencer"],["#e91e63","En révision"]].map(([c,l])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:c,border:`1px solid ${c}`}}/>
                      <span style={{fontSize:".58rem",color:t.tx3}}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="sg">
              {[
                {l:"Versets mémorisés",v:totalMem,s:`/ ${TOTAL_VERSES}`,c:"a",icon:"📿"},
                {l:"Sourates complètes",v:SURAHS.filter(s=>sPct(s)===100).length,s:"/ 114",c:"g",icon:"📚"},
                {l:"Série actuelle",v:`${memStreak}j`,s:"consécutifs",c:"b",icon:"🔥"},
                {l:"Pages lues",v:Object.keys(pageRead).filter(k=>pageRead[k]).length,s:"/ 604",c:"r",icon:"📖"},
              ].map((k,i)=>(
                <div key={i} className={`sc ${k.c}`}>
                  <div style={{fontSize:"1.2rem",marginBottom:3}}>{k.icon}</div>
                  <div className="slbl">{k.l}</div>
                  <div className="sval">{k.v}</div>
                  <div className="ssub">{k.s}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="ch">
                <span className="ct">Progression</span>
                <div style={{display:"flex",gap:4}}>
                  {[["daily","Jours"],["weekly","Semaines"],["monthly","Mois"]].map(([v,l])=>(
                    <button key={v} className={`tbtn ${chartView===v?"on":""}`} onClick={()=>setChartView(v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{padding:"12px 14px"}}>
                {chartView==="daily"&&(
                  <div>
                    <div style={{display:"flex",alignItems:"flex-end",gap:4,height:100,marginBottom:6}}>
                      {gains.map((g,i)=>{const lbl=new Date(histKeys[i]).toLocaleDateString("fr-FR",{weekday:"short",day:"numeric"});const isToday=histKeys[i]===today();return(<div key={i} className="bcol"><div className="bfw"><div className="bfi" style={{height:`${Math.max(Math.round(g/maxG*100),4)}px`,background:isToday?`linear-gradient(180deg,${t.acc2},${t.acc})`:`linear-gradient(180deg,${t.acc}88,${t.acc}44)`}}/></div><div className="blbl" style={{color:isToday?t.acc:t.tx3}}>{lbl}</div>{g>0&&<div className="bval">+{g}</div>}</div>);})}</div>
                    <div style={{textAlign:"center",fontSize:".65rem",color:t.tx3}}>Versets mémorisés par jour (14 derniers jours)</div>
                  </div>
                )}
                {chartView==="weekly"&&(
                  <div>
                    <div style={{display:"flex",alignItems:"flex-end",gap:4,height:100,marginBottom:6}}>
                      {weeklyData.map((w,i)=>(<div key={i} className="bcol"><div className="bfw"><div className="bfi" style={{height:`${Math.max(Math.round(w.v/maxWeek*100),4)}px`,background:`linear-gradient(180deg,${t.acc2},${t.acc})`}}/></div><div className="blbl">{w.label}</div>{w.v>0&&<div className="bval">+{w.v}</div>}</div>))}
                    </div>
                    <div style={{textAlign:"center",fontSize:".65rem",color:t.tx3}}>Versets mémorisés par semaine</div>
                  </div>
                )}
                {chartView==="monthly"&&(
                  <div>
                    <div style={{display:"flex",alignItems:"flex-end",gap:4,height:100,marginBottom:6}}>
                      {monthlyData.map((m,i)=>(<div key={i} className="bcol"><div className="bfw"><div className="bfi" style={{height:`${Math.max(Math.round(m.v/maxMonth*100),4)}px`,background:`linear-gradient(180deg,${t.acc2},${t.acc})`}}/></div><div className="blbl">{m.label}</div>{m.v>0&&<div className="bval">+{m.v}</div>}</div>))}
                    </div>
                    <div style={{textAlign:"center",fontSize:".65rem",color:t.tx3}}>Versets mémorisés par mois</div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="ch"><span className="ct">Badges</span><span style={{fontSize:".65rem",color:t.acc,fontWeight:700}}>{badges.length} / {BADGE_DEFS.length}</span></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8,padding:12}}>
                {BADGE_DEFS.map(bd=>{const earned=badges.includes(bd.id);return(
                  <div key={bd.id} className="badge-card" style={{background:earned?`linear-gradient(135deg,${t.acc}22,${t.acc2}11)`:t.s2,border:`1.5px solid ${earned?t.acc:t.b1}`,opacity:earned?1:0.45}}>
                    <div style={{fontSize:"1.6rem",marginBottom:4}}>{bd.icon}</div>
                    <div style={{fontSize:".7rem",fontWeight:700,color:earned?t.acc:t.tx3,marginBottom:3}}>{bd.label}</div>
                    <div style={{fontSize:".58rem",color:t.tx3}}>{bd.desc}</div>
                    {earned&&<div style={{marginTop:4,fontSize:".55rem",color:t.gr,fontWeight:700}}>✓ Obtenu</div>}
                  </div>
                );})}
              </div>
            </div>

            {topS.length>0&&(
              <div className="card">
                <div className="ch"><span className="ct">Progression par sourate</span></div>
                <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:6}}>
                  {topS.map((s,i)=>(
                    <div key={s.n} className="trow" style={{padding:"5px 8px",cursor:"pointer"}} onClick={()=>{doSelect(s);setPage("quran");}}>
                      <span style={{width:20,textAlign:"right",fontSize:".65rem",color:t.tx3,flexShrink:0}}>{i+1}</span>
                      <span style={{minWidth:80,fontSize:".72rem",fontWeight:600,color:s.p===100?t.gr:t.tx}}>{s.name}</span>
                      <div className="tbar"><div className="tfill" style={{width:`${s.p}%`,background:s.p===100?t.gr:t.acc}}/></div>
                      <span style={{fontSize:".65rem",color:s.p===100?t.gr:t.acc,fontWeight:700,width:32,textAlign:"right",flexShrink:0}}>{s.p}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {spacedDue.length>0&&(
              <div className="card" style={{border:`1px solid ${t.rd}44`}}>
                <div className="ch" style={{background:`${t.rd}10`}}><span className="ct" style={{color:t.rd}}>Révision du jour — {spacedDue.length} versets</span></div>
                <div>
                  {spacedDue.slice(0,10).map((key,i)=>{const[sn,vn]=key.split("_").map(Number);const s=SURAHS.find(x=>x.n===sn);const v=Q[sn]?.[vn-1];return(
                    <div key={i} style={{padding:"10px 14px",borderBottom:`1px solid ${t.b1}`,display:"flex",alignItems:"center",gap:8,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=t.s2} onMouseLeave={e=>e.currentTarget.style.background=""}>
                      <div style={{flex:1}}><span style={{fontSize:".72rem",fontWeight:600,color:t.acc}}>{s?.name}</span><span style={{fontSize:".65rem",color:t.tx3,marginLeft:6}}>v.{vn}</span>{v&&<div style={{fontFamily:"'Amiri Quran',serif",fontSize:".9rem",direction:"rtl",textAlign:"right",color:t.tx,marginTop:4}}>{v.ar.replace(/<[^>]*>/g,"")}</div>}</div>
                      <button className="vbtn" style={{borderColor:t.gr,color:t.gr,flexShrink:0}} onClick={()=>{markSpaced(sn,vn);}}>✓ Révisé</button>
                    </div>
                  );})}
                </div>
              </div>
            )}

            {cdS.length>0&&(
              <div className="card">
                <div className="ch"><span className="ct">Prochaines sourates à terminer</span></div>
                <div className="cd-grid">
                  {cdS.map(s=>(
                    <div key={s.n} className="cdc" onClick={()=>{doSelect(s);setPage("quran");}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}><span style={{fontFamily:"'Amiri',serif",fontSize:".95rem",color:t.acc}}>{s.ar}</span>{s.p>0&&<span style={{fontSize:".6rem",color:t.gr,fontWeight:700,background:`${t.gr}18`,padding:"1px 6px",borderRadius:99}}>{s.p}%</span>}</div>
                      <div style={{fontSize:".72rem",fontWeight:600,color:t.tx,marginBottom:3}}>{s.name}</div>
                      <div style={{height:4,background:t.b1,borderRadius:99,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:`${s.p}%`,background:t.gr,borderRadius:99}}/></div>
                      <div style={{fontSize:".62rem",color:t.tx3}}>{s.rem}v restants{s.days&&<span style={{color:t.bl,marginLeft:4}}>·~{s.days}j</span>}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {page==="settings"&&(
          <div className="settings-wrap">
            <div className="settings-section">
              <div className="ss-hd">Objectif & profil</div>
              <div className="set-row">
                <div><div className="set-lbl">Versets par jour</div><div className="set-sub">Objectif de nouvelles mémorisations</div></div>
                <input className="set-inp" type="number" min="1" max="200" value={settings?.dailyGoal||5} onChange={e=>setSettings(s=>({...s,dailyGoal:parseInt(e.target.value)||5}))}/>
              </div>
              <div className="set-row">
                <div>
                  <div className="set-lbl">Versets connus avant Al-Hifz</div>
                  <div className="set-sub">Exclus du calcul de rythme · actuellement : {settings?.baselineVerses||0}</div>
                </div>
                <input className="set-inp" type="number" min="0" max="6236" value={settings?.baselineVerses||0} onChange={e=>setSettings(s=>({...s,baselineVerses:parseInt(e.target.value)||0}))}/>
              </div>
              <div className="set-row">
                <div><div className="set-lbl">Date de début</div><div className="set-sub">Depuis quand mémorises-tu ?</div></div>
                <input className="set-inp" type="date" value={settings?.startDate||today()} onChange={e=>setSettings(s=>({...s,startDate:e.target.value}))}/>
              </div>
            </div>

            <div className="settings-section">
              <div className="ss-hd">Apparence</div>
              <div style={{padding:12}}>
                <div style={{fontSize:".65rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>Thème visuel</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {Object.entries(THEME_META).map(([key,meta])=>(
                    <div key={key} onClick={()=>setTn(key)} style={{border:`2px solid ${tn===key?t.acc:t.b1}`,borderRadius:12,padding:"10px 12px",cursor:"pointer",background:tn===key?`${t.acc}10`:t.s2,transition:"all .2s",transform:tn===key?"translateY(-1px)":"none",boxShadow:tn===key?`0 4px 14px ${t.acc}33`:"none"}}>
                      <div style={{display:"flex",gap:4,marginBottom:6}}>
                        {meta.preview.map((c,i)=>(<div key={i} style={{width:14,height:14,borderRadius:"50%",background:c,border:"1px solid rgba(255,255,255,.1)"}}/>))}
                      </div>
                      <div style={{fontSize:".75rem",fontWeight:700,color:tn===key?t.acc:t.tx}}>{meta.label}</div>
                      <div style={{fontSize:".58rem",color:t.tx3,marginTop:1}}>{meta.sub}</div>
                      {tn===key&&<div style={{marginTop:4,fontSize:".58rem",color:t.acc,fontWeight:700}}>✓ Actif</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="set-row">
                <div><div className="set-lbl">Mode nuit automatique</div><div className="set-sub">Bascule après 20h</div></div>
                <button className={`toggle ${autoNight?"on":""}`} onClick={()=>setAutoNight(v=>!v)}/>
              </div>
              <div className="set-row">
                <div><div className="set-lbl">Thème Ramadan</div><div className="set-sub">Décorations de la nuit bénie</div></div>
                <button className={`toggle ${ramadanTheme?"on":""}`} onClick={()=>setRamadanTheme(v=>!v)}/>
              </div>
            </div>

            <div className="settings-section">
              <div className="ss-hd">Police arabe</div>
              <div className="font-grid">
                {FONTS.map(f=>(
                  <div key={f.id} className={`font-card ${fontId===f.id?"sel":""}`} onClick={()=>setFontId(f.id)}>
                    <div className="font-preview" style={{fontFamily:f.css}}>بِسْمِ اللَّهِ</div>
                    <div className="font-name">{f.name}</div>
                    <div className="font-desc">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <div className="ss-hd">Récitateurs</div>
              <div style={{padding:12,display:"flex",flexDirection:"column",gap:6}}>
                {RECITERS.map(r=>(
                  <div key={r.id} style={{padding:"10px 12px",borderRadius:10,border:`1.5px solid ${rec.id===r.id?t.acc:t.b1}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",background:rec.id===r.id?`${t.acc}10`:t.s2,transition:"all .2s"}} onMouseEnter={e=>{if(rec.id!==r.id)e.currentTarget.style.borderColor=t.acc+"66";}} onMouseLeave={e=>{if(rec.id!==r.id)e.currentTarget.style.borderColor=t.b1;}} onClick={()=>setRec(r)}>
                    <div>
                      <div style={{fontSize:".76rem",fontWeight:600,color:rec.id===r.id?t.acc:t.tx}}>{r.name}</div>
                      <div style={{fontFamily:"'Amiri',serif",fontSize:".85rem",color:t.tx3,marginTop:2}}>{r.ar}</div>
                    </div>
                    {rec.id===r.id&&<Icons.Check size={16} color={t.acc}/>}
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <div className="ss-hd">Données</div>
              <div className="set-row">
                <div><div className="set-lbl">Exporter les mémorisations</div><div className="set-sub">Fichier JSON de sauvegarde</div></div>
                <button className="tbtn" style={{borderColor:t.gr,color:t.gr}} onClick={()=>{const data=JSON.stringify({mem,settings,hist,badges,spaced,favorites,notes,khatmas,activeKhatma,readHistory,pageRead},null,2);const blob=new Blob([data],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`alhifz_backup_${today()}.json`;a.click();}}>Exporter</button>
              </div>
              <div className="set-row">
                <div><div className="set-lbl">Importer une sauvegarde</div><div className="set-sub">Restaurer depuis un fichier</div></div>
                <label className="tbtn" style={{borderColor:t.bl,color:t.bl,cursor:"pointer"}}>
                  Importer
                  <input type="file" accept=".json" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.mem)setMem(d.mem);if(d.settings)setSettings(d.settings);if(d.hist)setHist(d.hist);if(d.badges)setBadges(d.badges);if(d.favorites)setFavorites(d.favorites);if(d.notes)setNotes(d.notes);if(d.khatmas)setKhatmas(d.khatmas);if(d.spaced)setSpaced(d.spaced);alert("Import réussi !");}catch{alert("Fichier invalide");}};r.readAsText(f);}}/>
                </label>
              </div>
              <div className="set-row" style={{borderBottom:"none"}}>
                <div><div className="set-lbl" style={{color:t.rd}}>Effacer toutes les données</div><div className="set-sub">Action irréversible</div></div>
                <button className="tbtn" style={{borderColor:t.rd,color:t.rd}} onClick={()=>{if(window.confirm("Effacer toutes tes mémorisations ? Cette action est irréversible.")){setMem({});setHist({});setBadges([]);setSpaced({});setFavorites([]);setNotes({});setKhatmas([]);setActiveKhatma(null);setReadHistory([]);setPageRead({});}}}>Effacer</button>
              </div>
            </div>

            <div style={{textAlign:"center",padding:16,color:t.tx3,fontSize:".6rem"}}>
              Al-Hifz — حفظ القرآن الكريم<br/>
              <span style={{fontFamily:"'Amiri',serif",fontSize:".9rem",color:t.acc,marginTop:4,display:"block"}}>رَبِّ زِدْنِي عِلْمًا</span>
            </div>
          </div>
        )}
      </div>{/* end .wrap */}

      {focusMode&&selS&&verses.length>0&&(
        <div style={{position:"fixed",inset:0,zIndex:150,background:"#050505",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #1a1a1a"}}>
            <div>
              <div style={{fontFamily:"'Amiri',serif",fontSize:"1rem",color:"#c9a84c"}}>{selS.ar} · v.{verses[focusIdx]?.n}</div>
              <div style={{fontSize:".6rem",color:"#555",marginTop:2}}>{focusIdx+1} / {verses.length}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>doPlay(verses[focusIdx]?.n)} style={{background:audioPlaying?"#c9a84c":"rgba(201,168,76,.15)",border:"1px solid rgba(201,168,76,.3)",color:"#c9a84c",borderRadius:8,padding:"5px 14px",cursor:"pointer",fontSize:".75rem",transition:"all .2s"}}>{audioPlaying?"⏸":"▶"}</button>
              <button onClick={()=>setFocusMode(false)} style={{background:"none",border:"1px solid #333",color:"#666",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:".75rem"}}>✕</button>
            </div>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",gap:20}}>
            <div style={{width:40,height:40,borderRadius:"50%",border:"1.5px solid rgba(201,168,76,.3)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(201,168,76,.5)",fontSize:".75rem"}}>
              {verses[focusIdx]?.n}
            </div>
            <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"clamp(1.6rem,5vw,2.6rem)",direction:"rtl",textAlign:"center",lineHeight:2.5,color:"#f0e8d0",maxWidth:600,transition:"opacity .3s"}}>
              {(verses[focusIdx]?.ar||"").replace(/<[^>]*>/g,"")}
            </div>
            {showTr&&verses[focusIdx]?.fr&&(
              <div style={{fontSize:"clamp(.75rem,2.5vw,1rem)",color:"#888",fontStyle:"italic",textAlign:"center",lineHeight:1.8,maxWidth:500}}>
                {verses[focusIdx]?.fr}
              </div>
            )}
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {!!(mem[String(selS.n)]||{})[String(verses[focusIdx]?.n)]
                ?<span style={{fontSize:".7rem",color:"#22c55e",background:"rgba(34,197,94,.1)",padding:"3px 10px",borderRadius:99,border:"1px solid rgba(34,197,94,.2)"}}>✓ Mémorisé</span>
                :<button onClick={()=>toggleV(selS.n,verses[focusIdx]?.n,verses[focusIdx]?.ar)} style={{fontSize:".7rem",color:"#c9a84c",background:"rgba(201,168,76,.08)",padding:"4px 12px",borderRadius:99,border:"1px solid rgba(201,168,76,.25)",cursor:"pointer"}}>+ Mémoriser</button>
              }
            </div>
          </div>
          <div style={{padding:"16px 24px",borderTop:"1px solid #111",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <button onClick={()=>setFocusIdx(i=>Math.max(0,i-1))} disabled={focusIdx===0} style={{flex:1,padding:"12px",background:"#111",border:"1px solid #222",color:focusIdx===0?"#333":"#888",borderRadius:10,cursor:focusIdx===0?"default":"pointer",fontSize:"1rem",transition:"all .2s"}}>◄</button>
            <div style={{flex:3,height:4,background:"#1a1a1a",borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(focusIdx+1)/verses.length*100}%`,background:"#c9a84c",borderRadius:99,transition:"width .3s"}}/>
            </div>
            <button onClick={()=>setFocusIdx(i=>Math.min(verses.length-1,i+1))} disabled={focusIdx===verses.length-1} style={{flex:1,padding:"12px",background:"#111",border:"1px solid #222",color:focusIdx===verses.length-1?"#333":"#c9a84c",borderRadius:10,cursor:focusIdx===verses.length-1?"default":"pointer",fontSize:"1rem",transition:"all .2s"}}>►</button>
          </div>
        </div>
      )}

      {immersive&&selS&&(
        <div className="immersive">
          <div className="immersive-header">
            <div>
              <div className="immersive-title">{selS.ar} — {selS.name}</div>
              <div style={{fontSize:".62rem",color:t.tx3}}>Juz {selS.juz} · {selS.v} versets · Mode immersif</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="tbtn" onClick={()=>{if(verses.length>0)startPlaylist(selS.n,verses,1);}}>{playlistActive&&playlist[0]?.sn===selS.n?"■ Stop":"▶ Tout"}</button>
              <button className="tbtn" onClick={()=>setImmersive(false)}>✕ Fermer</button>
            </div>
          </div>
          <div className="immersive-scroll">
            {verses.map(v=>{
              const isMem=!!(mem[String(selS.n)]||{})[String(v.n)];
              const isPl=playing===v.n;
              return (
                <div key={v.n} className="immersive-verse" id={`iv-${selS.n}-${v.n}`}>
                  <div className="immersive-ar" style={{fontSize:`${arabicSize*1.2}rem`}}>
                    <TajwidSpan text={v.ar} enabled={showTj} tjc={tjc}/>
                    <span style={{color:t.acc,fontFamily:"'Amiri',serif",fontSize:".75rem",marginRight:6}}> ﴿{v.n}﴾</span>
                  </div>
                  {showTr&&v.fr&&(<div className="immersive-fr">{v.fr}</div>)}
                  {showTf&&v.tf&&(<div style={{background:`${t.pu}10`,borderRadius:10,padding:"10px 14px",marginTop:8,fontSize:".72rem",color:t.tx2,fontStyle:"italic",textAlign:"center",lineHeight:1.7}}>{v.tf}</div>)}
                  <div className="immersive-num">v.{v.n} {isMem&&"· ✓ mémorisé"}</div>
                  <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:8}}>
                    <button className={`vbtn ${isMem?"mem":""}`} onClick={()=>toggleV(selS.n,v.n)}>{isMem?"✓ Mémorisé":"+ Mémoriser"}</button>
                    <button className={`vbtn ${isPl?"snd":""}`} onClick={()=>doPlay(v.n)}><Icons.Play size={10}/>{isPl?"Stop":"Écouter"}</button>
                    <button className={`vbtn ${isFav(selS.n,v.n)?"mem":""}`} onClick={()=>toggleFav(selS.n,v.n,v.ar,v.fr,selS.name)}><Icons.Heart size={10} filled={isFav(selS.n,v.n)}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {calligAnim&&<CalligraphyBurst text={calligAnim} onDone={()=>setCalligAnim(null)}/>}

      {playing!==null&&selS&&!focusMode&&!immersive&&(
        <div style={{position:"fixed",bottom:70,left:12,right:12,zIndex:55,background:t.navBg,border:`1px solid ${t.acc}44`,borderRadius:14,padding:"9px 14px",display:"flex",alignItems:"center",gap:10,boxShadow:`0 -2px 20px rgba(0,0,0,.25)`,backdropFilter:"blur(12px)"}}>
          <div style={{width:32,height:32,borderRadius:8,background:`${t.acc}15`,border:`1px solid ${t.acc}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontFamily:"'Amiri',serif",fontSize:".7rem",color:t.acc}}>{selS.n}</span>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:t.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selS.name} · v.{playing}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
              <div style={{flex:1,height:3,background:t.b1,borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${audioPct}%`,background:t.acc,borderRadius:99,transition:"width .3s linear"}}/>
              </div>
              <span style={{fontSize:".55rem",color:t.tx3,flexShrink:0}}>{rec.name?.split(" ")[0]}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
            <button onClick={()=>doPlay(Math.max(1,playing-1))} style={{background:"none",border:`1px solid ${t.b2}`,borderRadius:7,padding:"4px 9px",color:t.tx2,cursor:"pointer",fontSize:".7rem",transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=t.acc} onMouseLeave={e=>e.currentTarget.style.borderColor=t.b2}>◄◄</button>
            <button onClick={()=>doPlay(playing)} style={{background:t.acc,border:"none",borderRadius:7,padding:"5px 12px",color:"#fff",cursor:"pointer",fontSize:".75rem",fontWeight:700,minWidth:36}}>
              {audioPlaying?"⏸":"▶"}
            </button>
            <button onClick={()=>doPlay(Math.min(selS.v,playing+1))} style={{background:"none",border:`1px solid ${t.b2}`,borderRadius:7,padding:"4px 9px",color:t.tx2,cursor:"pointer",fontSize:".7rem",transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=t.acc} onMouseLeave={e=>e.currentTarget.style.borderColor=t.b2}>►►</button>
            <button onClick={()=>{setPlaying(null);if(audioRef.current){audioRef.current.pause();audioRef.current.src="";setPlaylistActive(false);}}} style={{background:"none",border:"none",color:t.tx3,cursor:"pointer",fontSize:".9rem",padding:"4px",marginLeft:2}}>✕</button>
          </div>
        </div>
      )}

      <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{position:"fixed",bottom:76,right:14,zIndex:50,width:38,height:38,borderRadius:"50%",background:t.s2,border:`1px solid ${t.b2}`,color:t.tx2,fontSize:"1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.15)",transition:"all .2s",opacity:0.7}} onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=t.acc;e.currentTarget.style.color=t.acc;}} onMouseLeave={e=>{e.currentTarget.style.opacity="0.7";e.currentTarget.style.transform="";e.currentTarget.style.borderColor=t.b2;e.currentTarget.style.color=t.tx2;}}>↑</button>

      <div className="bnav">
        {[
          {id:"quran",icon:<Icons.Book size={19}/>,label:"Coran"},
          {id:"mushaf",icon:<Icons.Scroll size={19}/>,label:"Mushaf"},
          {id:"pages",icon:<Icons.Brain size={19}/>,label:"Révision"},
          {id:"khatma",icon:<Icons.Star size={19}/>,label:"Khatma"},
          {id:"communaute",icon:<Icons.Heart size={19}/>,label:"Favoris"},
          {id:"stats",icon:<Icons.Chart size={19}/>,label:"Stats"},
          {id:"settings",icon:<Icons.Settings size={19}/>,label:"Réglages"},
        ].map(tab=>(
          <button key={tab.id} className={`bn ${page===tab.id?"on":""}`} onClick={()=>{if(tab.id===page)return;setPageTransition(true);setTimeout(()=>{setPage(tab.id);setPageTransition(false);},120);}}>
            {tab.icon}
            <span className="bn-lbl">{tab.label}</span>
          </button>
        ))}
      </div>

      <audio ref={audioRef} style={{display:"none"}}
        onPlay={()=>setAudioPlaying(true)}
        onPause={()=>setAudioPlaying(false)}
        onTimeUpdate={e=>{const a=e.target;if(a.duration>0)setAudioPct(Math.round(a.currentTime/a.duration*100));}}
      />
    </>
  );
}