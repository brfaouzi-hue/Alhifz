import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";import { supabase } from './supabase'

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

// Embedded data
const Q = {
1:[
  {n:1,ar:"بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",fr:"Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",tf:"La Basmala inaugure chaque sourate sauf At-Tawba. Ar-Rahman désigne la miséricorde universelle, Ar-Rahim la miséricorde particulière aux croyants dans l'au-delà."},
  {n:2,ar:"ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",fr:"Louange à Allah, Seigneur de l'univers,",tf:"Al-Hamd appartient à Allah seul. Rabb al-'Alamin : Il est le Créateur et Dispensateur de bienfaits à toutes les créatures."},
  {n:3,ar:"ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",fr:"le Tout Miséricordieux, le Très Miséricordieux,",tf:"Répétition pour insister sur la miséricorde — attribut fondamental d'Allah."},
  {n:4,ar:"مَٰلِكِ يَوْمِ ٱلدِّينِ",fr:"Maître du Jour de la rétribution.",tf:"Maître absolu du Jugement."},
  {n:5,ar:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",fr:"C'est Toi [Seul] que nous adorons, et c'est Toi [Seul] dont nous implorons le secours.",tf:"Cœur de la sourate et de l'islam : adoration exclusive d'Allah et recours exclusif à Lui."},
  {n:6,ar:"ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",fr:"Guide-nous dans le droit chemin,",tf:"Supplication répétée 17 fois/jour dans la prière."},
  {n:7,ar:"صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",fr:"le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.",tf:"Comblés de faveurs : prophètes, véridiques, martyrs et vertueux."},
],
97:[
  {n:1,ar:"إِنَّٓا أَنزَلْنَٰهُ فِى لَيْلَةِ ٱلْقَدْرِ",fr:"Nous l'avons certes révélé pendant la nuit d'Al-Qadr.",tf:"Le Coran fut descendu en totalité la nuit d'Al-Qadr."},
  {n:2,ar:"وَمَآ أَدْرَاكَ مَا لَيْلَةُ ٱلْقَدْرِ",fr:"Et qui te dira ce qu'est la nuit d'Al-Qadr?",tf:"Question rhétorique pour magnifier l'importance de cette nuit."},
  {n:3,ar:"لَيْلَةُ ٱلْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",fr:"La nuit d'Al-Qadr est meilleure que mille mois.",tf:"Mille mois ≈ 83 ans, une vie entière."},
  {n:4,ar:"تَنَزَّلُ ٱلْمَلَٰٓئِكَةُ وَٱلرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ",fr:"Les Anges ainsi que l'Esprit descendent durant cette nuit, avec la permission de leur Seigneur pour tout ordre.",tf:"Jibrîl et les anges descendent en masse portant les décrets divins pour l'année à venir."},
  {n:5,ar:"سَلَٰمٌ هِىَ حَتَّىٰ مَطْلَعِ ٱلْفَجْرِ",fr:"Elle est paix et salut jusqu'à l'apparition de l'aube.",tf:"Toute la nuit est paix et bénédiction."},
],
98:[
  {n:1,ar:"لَمْ يَكُنِ ٱلَّذِينَ كَفَرُوا۟ مِنْ أَهْلِ ٱلْكِتَٰبِ وَٱلْمُشْرِكِينَ مُنفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ ٱلْبَيِّنَةُ",fr:"Les mécréants parmi les gens du Livre et les associateurs n'auraient pas abandonné leur mécréance jusqu'à ce que leur vînt la preuve manifeste,",tf:"La preuve allait être le Prophète ﷺ et le Coran."},
  {n:2,ar:"رَسُولٌ مِّنَ ٱللَّهِ يَتْلُوا۟ صُحُفًا مُّطَهَّرَةً",fr:"un Messager d'Allah, qui récite des pages purifiées,",tf:"Muhammad ﷺ récitant les feuillets du Coran."},
  {n:3,ar:"فِيهَا كُتُبٌ قَيِّمَةٌ",fr:"contenant des écrits droits.",tf:"Qayyima : droits, justes, immuables."},
  {n:4,ar:"وَمَا تَفَرَّقَ ٱلَّذِينَ أُوتُوا۟ ٱلْكِتَٰبَ إِلَّا مِنۢ بَعْدِ مَا جَآءَتْهُمُ ٱلْبَيِّنَةُ",fr:"Ceux à qui le Livre a été donné ne se sont divisés qu'après que leur fut venue la preuve manifeste.",tf:"La division est venue après la preuve, par jalousie et intérêts mondains."},
  {n:5,ar:"وَمَآ أُمِرُوٓا۟ إِلَّا لِيَعْبُدُوا۟ ٱللَّهَ مُخْلِصِينَ لَهُ ٱلدِّينَ حُنَفَآءَ وَيُقِيمُوا۟ ٱلصَّلَوٰةَ وَيُؤْتُوا۟ ٱلزَّكَوٰةَ وَذَٰلِكَ دِينُ ٱلْقَيِّمَةِ",fr:"Ils n'avaient été commandés que d'adorer Allah sincèrement, d'accomplir la Salat et d'acquitter la Zakat. C'est là la religion droite.",tf:"L'essence de tous les messages : tawhid, prière, zakat."},
  {n:6,ar:"إِنَّ ٱلَّذِينَ كَفَرُوا۟ مِنْ أَهْلِ ٱلْكِتَٰبِ وَٱلْمُشْرِكِينَ فِى نَارِ جَهَنَّمَ خَٰلِدِينَ فِيهَا أُو۟لَٰٓئِكَ هُمْ شَرُّ ٱلْبَرِيَّةِ",fr:"Ceux qui ont mécru parmi les gens du Livre et les associateurs seront dans le feu de la Géhenne éternellement.",tf:"Verdict pour ceux qui ont reçu la preuve et l'ont rejetée sciemment."},
  {n:7,ar:"إِنَّ ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ أُو۟لَٰٓئِكَ هُمْ خَيْرُ ٱلْبَرِيَّةِ",fr:"Ceux qui ont cru et accompli de bonnes œuvres sont les meilleures des créatures.",tf:"Khayr al-bariyya — les meilleures créatures."},
  {n:8,ar:"جَزَآؤُهُمْ عِندَ رَبِّهِمْ جَنَّٰتُ عَدْنٍ تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ خَٰلِدِينَ فِيهَآ أَبَدًا رَّضِىَ ٱللَّهُ عَنْهُمْ وَرَضُوا۟ عَنْهُ ذَٰلِكَ لِمَنْ خَشِىَ رَبَّهُۥ",fr:"Leur récompense sera les jardins d'Eden. Allah est satisfait d'eux et ils sont satisfaits de Lui.",tf:"Le summum du paradis : satisfaction mutuelle entre Allah et Ses serviteurs."},
],
99:[
  {n:1,ar:"إِذَا زُلْزِلَتِ ٱلْأَرْضُ زِلْزَالَهَا",fr:"Quand la terre sera secouée d'un violent tremblement,",tf:"Le tremblement final de la Terre au Jour du Jugement."},
  {n:2,ar:"وَأَخْرَجَتِ ٱلْأَرْضُ أَثْقَالَهَا",fr:"et que la terre aura sorti ses fardeaux,",tf:"La terre vomira tout : les morts ressusciteront."},
  {n:3,ar:"وَقَالَ ٱلْإِنسَٰنُ مَا لَهَا",fr:"et que l'homme dira : Qu'a-t-elle?",tf:"L'homme stupéfait demande ce qui se passe."},
  {n:4,ar:"يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا",fr:"Ce jour-là, elle racontera ses nouvelles,",tf:"La terre témoignera de tout ce qui s'est passé sur elle."},
  {n:5,ar:"بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا",fr:"parce que ton Seigneur lui aura inspiré cela.",tf:"Allah inspirera à la terre sa mission de témoignage."},
  {n:6,ar:"يَوْمَئِذٍ يَصْدُرُ ٱلنَّاسُ أَشْتَاتًا لِّيُرَوْا۟ أَعْمَٰلَهُمْ",fr:"Ce jour-là, les hommes sortiront en groupes séparés pour qu'on leur montre leurs œuvres.",tf:"Chacun confronté à l'intégralité de ses actions."},
  {n:7,ar:"فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُۥ",fr:"Quiconque a fait le poids d'un atome de bien le verra,",tf:"Justice absolue : même le bien le plus infime sera récompensé."},
  {n:8,ar:"وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُۥ",fr:"et quiconque a fait le poids d'un atome de mal le verra.",tf:"Symétrie parfaite. Rien n'échappe à la justice divine."},
],
100:[
  {n:1,ar:"وَٱلْعَٰدِيَٰتِ ضَبْحًا",fr:"Par les coursiers haletants,",tf:"Serment par les chevaux de guerre."},
  {n:2,ar:"فَٱلْمُورِيَٰتِ قَدْحًا",fr:"qui font jaillir des étincelles de leurs sabots,",tf:"Image de puissance et de rapidité."},
  {n:3,ar:"فَٱلْمُغِيرَٰتِ صُبْحًا",fr:"qui font des raids à l'aube,",tf:"Moment de vigilance, courage et action décisive."},
  {n:4,ar:"فَأَثَرْنَ بِهِۦ نَقْعًا",fr:"et soulèvent des nuages de poussière,",tf:"Image vivante du mouvement vers la cause divine."},
  {n:5,ar:"فَوَسَطْنَ بِهِۦ جَمْعًا",fr:"et s'élancent au milieu de l'ennemi groupé.",tf:"Point culminant du tableau de bravoure."},
  {n:6,ar:"إِنَّ ٱلْإِنسَٰنَ لِرَبِّهِۦ لَكَنُودٌ",fr:"L'homme est vraiment ingrat envers son Seigneur,",tf:"Ingratitude fondamentale."},
  {n:7,ar:"وَإِنَّهُۥ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ",fr:"et il en est lui-même témoin.",tf:"L'homme est son propre témoin de son ingratitude."},
  {n:8,ar:"وَإِنَّهُۥ لِحُبِّ ٱلْخَيْرِ لَشَدِيدٌ",fr:"Et il est passionnément attaché aux biens de ce monde.",tf:"Amour excessif des richesses."},
  {n:9,ar:"أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِى ٱلْقُبُورِ",fr:"Ne sait-il pas que lorsque ce qui est dans les tombes sera bouleversé,",tf:"Rappel de la résurrection."},
  {n:10,ar:"وَحُصِّلَ مَا فِى ٱلصُّدُورِ",fr:"et que ce qui est dans les poitrines sera rendu apparent,",tf:"Les secrets du cœur seront tous révélés."},
  {n:11,ar:"إِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَّخَبِيرٌ",fr:"leur Seigneur ce Jour-là est parfaitement informé de ce qu'ils ont fait.",tf:"Allah est Al-Khabir — rien ne Lui échappe."},
],
101:[
  {n:1,ar:"ٱلْقَارِعَةُ",fr:"La Fracassante!",tf:"Nom du Jour du Jugement."},
  {n:2,ar:"مَا ٱلْقَارِعَةُ",fr:"Qu'est-ce que la Fracassante?",tf:"Style d'amplification."},
  {n:3,ar:"وَمَآ أَدْرَاكَ مَا ٱلْقَارِعَةُ",fr:"Et qui te dira ce qu'est la Fracassante?",tf:"Même le Prophète ﷺ ne peut en avoir une image complète sans révélation."},
  {n:4,ar:"يَوْمَ يَكُونُ ٱلنَّاسُ كَٱلْفَرَاشِ ٱلْمَبْثُوثِ",fr:"Le Jour où les hommes seront comme des papillons éparpillés,",tf:"Chaos absolu de la résurrection."},
  {n:5,ar:"وَتَكُونُ ٱلْجِبَالُ كَٱلْعِهْنِ ٱلْمَنفُوشِ",fr:"et les montagnes comme de la laine cardée.",tf:"Montagnes symboles de stabilité réduites à de la laine."},
  {n:6,ar:"فَأَمَّا مَن ثَقُلَتْ مَوَٰزِينُهُۥ",fr:"Quant à celui dont la balance sera lourde,",tf:"Justice divine absolue."},
  {n:7,ar:"فَهُوَ فِى عِيشَةٍ رَّاضِيَةٍ",fr:"il jouira d'une vie agréable.",tf:"Vie parfaite au paradis."},
  {n:8,ar:"وَأَمَّا مَنْ خَفَّتْ مَوَٰزِينُهُۥ",fr:"Mais quant à celui dont la balance sera légère,",tf:"Sort terrible."},
  {n:9,ar:"فَأُمُّهُۥ هَاوِيَةٌ",fr:"son refuge sera l'Abîme.",tf:"Hawiya — l'abîme."},
  {n:10,ar:"وَمَآ أَدْرَاكَ مَا هِيَهْ",fr:"Et qui te dira ce que c'est?",tf:"La Hawiya dépasse toute imagination humaine."},
  {n:11,ar:"نَارٌ حَامِيَةٌ",fr:"C'est un feu ardent!",tf:"Feu d'une intensité incomparable."},
],
102:[
  {n:1,ar:"أَلْهَاكُمُ ٱلتَّكَاثُرُ",fr:"La course aux richesses vous a distraits,",tf:"Compétition pour accumuler — détourne de l'au-delà."},
  {n:2,ar:"حَتَّىٰ زُرْتُمُ ٱلْمَقَابِرَ",fr:"jusqu'à ce que vous visitiez les tombeaux.",tf:"Seule la mort met fin à cette course."},
  {n:3,ar:"كَلَّا سَوْفَ تَعْلَمُونَ",fr:"Non! Vous saurez bientôt!",tf:"Kalla — réprimande forte."},
  {n:4,ar:"ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ",fr:"Non, vraiment! Vous saurez bientôt!",tf:"Répétition pour amplifier."},
  {n:5,ar:"كَلَّا لَوْ تَعْلَمُونَ عِلْمَ ٱلْيَقِينِ",fr:"Non! Si vous saviez avec une science certaine!",tf:"Si vous connaissiez l'au-delà avec certitude."},
  {n:6,ar:"لَتَرَوُنَّ ٱلْجَحِيمَ",fr:"Vous verrez sûrement la Fournaise!",tf:"Certitude : vous verrez l'enfer."},
  {n:7,ar:"ثُمَّ لَتَرَوُنَّهَا عَيْنَ ٱلْيَقِينِ",fr:"Puis vous la verrez avec l'œil de la certitude.",tf:"Ayn al-yaqin — certitude par la vue directe."},
  {n:8,ar:"ثُمَّ لَتُسْـَٔلُنَّ يَوْمَئِذٍ عَنِ ٱلنَّعِيمِ",fr:"Puis, ce jour-là, vous serez interrogés sur les bienfaits reçus.",tf:"Chaque bienfait fera l'objet d'une question."},
],
103:[
  {n:1,ar:"وَٱلْعَصْرِ",fr:"Par le Temps!",tf:"Serment par le temps."},
  {n:2,ar:"إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ",fr:"L'être humain est certes en perdition,",tf:"Verdict général."},
  {n:3,ar:"إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ",fr:"sauf ceux qui ont la foi, font de bonnes œuvres, s'enjoignent mutuellement la vérité et s'enjoignent mutuellement l'endurance.",tf:"4 conditions : foi, bonnes œuvres, vérité, patience."},
],
104:[
  {n:1,ar:"وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ",fr:"Malheur à tout diffamateur et calomniateur,",tf:"Humazah : blesse par gestes. Lumazah : blesse par paroles."},
  {n:2,ar:"ٱلَّذِى جَمَعَ مَالًا وَعَدَّدَهُ",fr:"qui amasse des richesses et les compte sans cesse,",tf:"Obsession d'accumuler."},
  {n:3,ar:"يَحْسَبُ أَنَّ مَالَهُۥ أَخْلَدَهُۥٓ",fr:"croyant que sa fortune le rendra immortel!",tf:"L'illusion suprême."},
  {n:4,ar:"كَلَّا لَيُنۢبَذَنَّ فِى ٱلْحُطَمَةِ",fr:"Certes non! Il sera précipité dans Al-Hutama.",tf:"Al-Hutama : qui broie et fracasse tout."},
  {n:5,ar:"وَمَآ أَدْرَاكَ مَا ٱلْحُطَمَةُ",fr:"Et qui te dira ce qu'est Al-Hutama?",tf:"Ce que tu imagines est bien inférieur à la réalité."},
  {n:6,ar:"نَارُ ٱللَّهِ ٱلْمُوقَدَةُ",fr:"C'est le feu d'Allah, allumé,",tf:"Nâr Allah."},
  {n:7,ar:"ٱلَّتِى تَطَّلِعُ عَلَى ٱلْأَفْـِٔدَةِ",fr:"qui s'élève jusqu'aux cœurs.",tf:"Ce feu atteint les cœurs."},
  {n:8,ar:"إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌ",fr:"elle se referme sur eux,",tf:"Portes fermées à clé."},
  {n:9,ar:"فِى عَمَدٍ مُّمَدَّدَةٍۭ",fr:"sur des colonnes étirées!",tf:"Prison aux barreaux d'acier incandescent."},
],
105:[
  {n:1,ar:"أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَٰبِ ٱلْفِيلِ",fr:"N'as-tu pas vu comment ton Seigneur a agi avec les gens de l'Éléphant?",tf:"An de l'Éléphant (570 EC)."},
  {n:2,ar:"أَلَمْ يَجْعَلْ كَيْدَهُمْ فِى تَضْلِيلٍ",fr:"N'a-t-Il pas rendu vain leur stratagème?",tf:"La force matérielle est impuissante face à la protection divine."},
  {n:3,ar:"وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",fr:"N'a-t-Il pas envoyé sur eux des oiseaux en rangs serrés,",tf:"Miracle absolu de la protection divine."},
  {n:4,ar:"تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ",fr:"qui les bombardaient de pierres d'argile cuite,",tf:"Projectiles d'argile durcie."},
  {n:5,ar:"فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍۭ",fr:"et Il les a rendus pareils à de la paille mâchée.",tf:"Anéantissement total par la volonté divine."},
],
106:[
  {n:1,ar:"لِإِيلَٰفِ قُرَيْشٍ",fr:"A cause de l'accoutumance des Quraychites,",tf:"Protection de la Mecque."},
  {n:2,ar:"إِيلَٰفِهِمْ رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ",fr:"à leur habitude du voyage d'hiver et d'été,",tf:"Deux caravanes annuelles."},
  {n:3,ar:"فَلْيَعْبُدُوا۟ رَبَّ هَٰذَا ٱلْبَيْتِ",fr:"Qu'ils adorent donc le Seigneur de cette Maison,",tf:"Conclusion logique."},
  {n:4,ar:"ٱلَّذِى أَطْعَمَهُم مِّن جُوعٍ وَءَامَنَهُم مِّنْ خَوْفٍ",fr:"qui les a nourris contre la faim et rassurés contre la peur.",tf:"Subsistance et sécurité."},
],
107:[
  {n:1,ar:"أَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ",fr:"As-tu vu celui qui traite la religion de mensonge?",tf:"Nier la rétribution a des conséquences comportementales."},
  {n:2,ar:"فَذَٰلِكَ ٱلَّذِى يَدُعُّ ٱلْيَتِيمَ",fr:"C'est celui qui repousse l'orphelin,",tf:"Cruauté envers les vulnérables."},
  {n:3,ar:"وَلَا يَحُضُّ عَلَىٰ طَعَامِ ٱلْمِسْكِينِ",fr:"et qui n'encourage pas à nourrir le pauvre.",tf:"Indifférence totale face à la misère."},
  {n:4,ar:"فَوَيْلٌ لِّلْمُصَلِّينَ",fr:"Malheur donc aux priants,",tf:"Avertissement choquant."},
  {n:5,ar:"ٱلَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ",fr:"ceux qui sont distraits dans leur prière,",tf:"Sahun : négligents, inattentifs."},
  {n:6,ar:"ٱلَّذِينَ هُمْ يُرَآءُونَ",fr:"ceux qui prient pour être vus,",tf:"Ostentation — le shirk mineur."},
  {n:7,ar:"وَيَمْنَعُونَ ٱلْمَاعُونَ",fr:"et qui refusent de prêter les ustensiles ordinaires.",tf:"La foi authentique se manifeste dans les petits actes."},
],
108:[
  {n:1,ar:"إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ",fr:"Nous t'avons certes donné l'Abondance.",tf:"Al-Kawthar : le bassin du Prophète au paradis."},
  {n:2,ar:"فَصَلِّ لِرَبِّكَ وَٱنْحَرْ",fr:"Accomplis donc la Salat pour ton Seigneur et sacrifie.",tf:"Prier et sacrifier exclusivement pour Allah."},
  {n:3,ar:"إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ",fr:"C'est bien ton ennemi qui est sans postérité.",tf:"Muhammad ﷺ est le plus cité au monde chaque jour."},
],
109:[
  {n:1,ar:"قُلْ يَٰٓأَيُّهَا ٱلْكَٰفِرُونَ",fr:"Dis : Ô vous les mécréants!",tf:"Déclaration de séparation."},
  {n:2,ar:"لَآ أَعْبُدُ مَا تَعْبُدُونَ",fr:"Je n'adore pas ce que vous adorez.",tf:"Pas de compromis en matière de culte."},
  {n:3,ar:"وَلَآ أَنتُمْ عَٰبِدُونَ مَآ أَعْبُدُ",fr:"Et vous n'adorez pas ce que j'adore.",tf:"Constatation."},
  {n:4,ar:"وَلَآ أَنَا۠ عَابِدٌ مَّا عَبَدتُّمْ",fr:"Je ne suis pas adorateur de ce que vous avez adoré.",tf:"Constance."},
  {n:5,ar:"وَلَآ أَنتُمْ عَٰبِدُونَ مَآ أَعْبُدُ",fr:"Et vous n'êtes pas adorateurs de ce que j'adore.",tf:"Choix définitif."},
  {n:6,ar:"لَكُمْ دِينُكُمْ وَلِىَ دِينِ",fr:"A vous votre religion, et à moi ma religion.",tf:"Séparation nette et respectueuse."},
],
110:[
  {n:1,ar:"إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ",fr:"Quand arrive le secours d'Allah et la conquête,",tf:"Al-Fath = conquête de La Mecque (an 8 H)."},
  {n:2,ar:"وَرَأَيْتَ ٱلنَّاسُ يَدْخُلُونَ فِى دِينِ ٱللَّهِ أَفْوَاجًا",fr:"et que tu vois les gens entrer en foule dans la religion d'Allah,",tf:"Des tribus entières embrassèrent l'islam."},
  {n:3,ar:"فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ ۚ إِنَّهُۥ كَانَ تَوَّابًۢا",fr:"alors, célèbre les louanges de ton Seigneur et implore Son pardon. Car Il est certes Grand Accueillant au repentir.",tf:"La réponse à la victoire : non l'orgueil, mais la reconnaissance."},
],
111:[
  {n:1,ar:"تَبَّتْ يَدَآ أَبِى لَهَبٍ وَتَبَّ",fr:"Que soient perdues les deux mains d'Abou Lahab!",tf:"Seule sourate condamnant quelqu'un par nom."},
  {n:2,ar:"مَآ أَغْنَىٰ عَنْهُ مَالُهُۥ وَمَا كَسَبَ",fr:"Sa fortune ne lui a servi à rien, ni ce qu'il a acquis.",tf:"Toute sa richesse ne put le protéger."},
  {n:3,ar:"سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ",fr:"Il brûlera dans un feu plein de flammes.",tf:"Ironie divine."},
  {n:4,ar:"وَٱمْرَأَتُهُۥ حَمَّالَةَ ٱلْحَطَبِ",fr:"Et sa femme, porteuse de bois de brandon,",tf:"Umm Jamil portait des épines sur le chemin du Prophète."},
  {n:5,ar:"فِى جِيدِهَا حَبْلٌ مِّن مَّسَدٍۭ",fr:"aura à son cou une corde de fibres de palmier.",tf:"Justice parfaite du talion divin."},
],
112:[
  {n:1,ar:"قُلْ هُوَ ٱللَّهُ أَحَدٌ",fr:"Dis : Il est Allah, Unique",tf:"Équivaut au tiers du Coran. Ahad — Un absolu, unique dans Son essence."},
  {n:2,ar:"ٱللَّهُ ٱلصَّمَدُ",fr:"Allah, le Seul à être imploré pour ce que nous désirons.",tf:"As-Samad : vers qui toutes les créatures se tournent dans le besoin."},
  {n:3,ar:"لَمْ يَلِدْ وَلَمْ يُولَدْ",fr:"Il n'a jamais engendré, n'a pas été engendré non plus.",tf:"Réfutation des déviations."},
  {n:4,ar:"وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",fr:"Et nul n'est égal à Lui.",tf:"Aucun équivalent dans l'essence, les attributs, les actes."},
],
113:[
  {n:1,ar:"قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",fr:"Dis : Je cherche refuge auprès du Seigneur de l'Aube naissante",tf:"Al-Mu'awwidhatain — les deux sourates de protection."},
  {n:2,ar:"مِن شَرِّ مَا خَلَقَ",fr:"contre le mal de ce qu'Il a créé,",tf:"Protection générale contre tout mal issu de la création."},
  {n:3,ar:"وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",fr:"contre le mal de l'obscurité quand elle s'étend,",tf:"La nuit profonde."},
  {n:4,ar:"وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ",fr:"contre le mal des souffleuses dans les noeuds,",tf:"Femmes pratiquant la magie en soufflant sur des noeuds."},
  {n:5,ar:"وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",fr:"contre le mal de l'envieux quand il envie.",tf:"La jalousie peut provoquer le mauvais oeil."},
],
114:[
  {n:1,ar:"قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",fr:"Dis : Je cherche refuge auprès du Seigneur des hommes,",tf:"Dernière sourate. Trois titres majestueux : Seigneur, Roi, Dieu des hommes."},
  {n:2,ar:"مَلِكِ ٱلنَّاسِ",fr:"du Roi des hommes,",tf:"Malik an-nas — royauté absolue, éternelle, universelle."},
  {n:3,ar:"إِلَٰهِ ٱلنَّاسِ",fr:"du Dieu des hommes,",tf:"Ilah an-nas — seul digne d'adoration."},
  {n:4,ar:"مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ",fr:"contre le mal du tentateur sournois",tf:"Al-waswas : le chuchoteur. Al-khannas : qui recule quand on mentionne Allah."},
  {n:5,ar:"ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ",fr:"qui souffle le mal dans les poitrines des hommes,",tf:"Shaytan suggère doucement depuis l'intérieur."},
  {n:6,ar:"مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",fr:"qu'il soit parmi les djinns ou parmi les hommes.",tf:"Le tentateur peut être djinn ou humain."},
],
};

// Constants
const FONTS = [
  {id:"amiri-quran",name:"Amiri Quran",css:"'Amiri Quran',serif",desc:"Mushaf classique (Naskh)"},
  {id:"amiri",name:"Amiri",css:"'Amiri',serif",desc:"Naskhi élégant"},
  {id:"scheherazade",name:"Scheherazade",css:"'Scheherazade New',serif",desc:"Naskhi arabe raffiné"},
  {id:"lateef",name:"Lateef",css:"'Lateef',serif",desc:"Style Nastaliq simplifié"},
  {id:"noto-naskh",name:"Noto Naskh",css:"'Noto Naskh Arabic',serif",desc:"Moderne et lisible"},
  {id:"noto-nastaliq",name:"Noto Nastaliq",css:"'Noto Nastaliq Urdu',serif",desc:"Style Nastaliq"},
  {id:"reem-kufi",name:"Reem Kufi",css:"'Reem Kufi',serif",desc:"Style Kufique"},
  {id:"cairo",name:"Cairo",css:"'Cairo',sans-serif",desc:"Moderne sans-serif"},
];

const RECITERS = [
  {id:"alafasy",everyayah:"Alafasy_128kbps",name:"Mishary Al-Afasy",ar:"مشاري العفاسي"},
  {id:"abdulbasitmurattal",everyayah:"Abdul_Basit_Murattal_192kbps",name:"Abdul Basit Murattal",ar:"عبد الباسط مرتل"},
  {id:"abdulbasitmujawwad",everyayah:"Abdul_Basit_Mujawwad_128kbps",name:"Abdul Basit Mujawwad",ar:"عبد الباسط مجود"},
  {id:"minshawi",everyayah:"Minshawy_Murattal_128kbps",name:"Al-Minshawi",ar:"المنشاوي"},
  {id:"husary",everyayah:"Husary_128kbps",name:"Al-Husary",ar:"الحصري"},
  {id:"sudais",everyayah:"Abdurrahmaan_As-Sudais_192kbps",name:"Al-Sudais",ar:"السديس"},
  {id:"shuraym",everyayah:"Shuraym_128kbps",name:"Al-Shuraym",ar:"الشريم"},
  {id:"mahermuaiqly",everyayah:"MaherAlMuaiqly128kbps",name:"Maher Al-Muaiqly",ar:"ماهر المعيقلي"},
  {id:"hanirifai",everyayah:"Hani_Rifai_192kbps",name:"Hani Ar-Rifai",ar:"هاني الرفاعي"},
  {id:"dussary",everyayah:"Yasser_Ad-Dussary_128kbps",name:"Yasser Al-Dossari",ar:"ياسر الدوسري"},
  {id:"nasser",everyayah:"Nasser_Alqatami_128kbps",name:"Nasser Al-Qatami",ar:"ناصر القطامي"},
  {id:"aymansowaid",everyayah:"Ayman_Sowaid_64kbps",name:"Ayman Suwaid",ar:"أيمن سويد"},
];

const SURAH_PDF_PAGES=[1,2,50,77,106,128,151,177,187,208,221,235,249,255,262,267,282,293,305,312,322,332,342,350,359,367,377,385,396,404,411,415,418,428,434,440,446,453,458,467,477,483,489,495,499,503,507,510,513,516,520,523,526,528,531,534,537,542,545,549,551,553,557,560,560,560,562,564,566,568,570,573,575,577,578,579,580,582,583,584,586,587,588,589,590,591,592,592,593,593,594,594,595,595,596,596,597,597,598,598,599,599,599,600,600,600,600,600,600,600,600,600,600,600];

const MUSHAF_EDITIONS = [
  {id:"tajwid_hafs",name:"Tajwid Hafs",desc:"Couleurs tajwid — Hafs",coverBg:"linear-gradient(135deg,#1a472a,#2d6a4f)",coverIcon:"☪",coverSub:"حفص — تجويد",archiveId:"al-quran-al-karim-tajwid-hafs"},
  {id:"tajwid_fr",name:"Tajwid + Français",desc:"Tajwid avec traduction française",coverBg:"linear-gradient(135deg,#1565c0,#0d47a1)",coverIcon:"🇫🇷",coverSub:"تجويد + فرنسي",archiveId:"Quran01ss"},
];

const KHATMA_PRESETS = [
  {id:"daily",label:"Quotidienne",desc:"1 Coran / jour — 18.7 pages",pages:604,days:1},
  {id:"weekly",label:"Hebdomadaire",desc:"1 Coran / semaine — ~86 pages/j",pages:604,days:7},
  {id:"monthly",label:"Mensuelle",desc:"1 Coran / mois — ~20 pages/j",pages:604,days:30},
  {id:"ramadan",label:"Ramadan",desc:"1 Coran en 30 jours",pages:604,days:30},
  {id:"custom",label:"Personnalisée",desc:"Définir son propre rythme",pages:604,days:null},
];

const SURAH_PAGE = {
  1:1,2:2,3:50,4:77,5:106,6:128,7:151,8:177,9:187,10:208,
  11:221,12:235,13:249,14:255,15:262,16:267,17:282,18:293,19:305,20:312,
  21:322,22:332,23:342,24:350,25:359,26:367,27:377,28:385,29:396,30:404,
  31:411,32:415,33:418,34:428,35:434,36:440,37:446,38:453,39:458,40:467,
  41:477,42:483,43:489,44:496,45:499,46:502,47:507,48:511,49:515,50:518,
  51:520,52:523,53:526,54:528,55:531,56:534,57:537,58:542,59:545,60:549,
  61:551,62:553,63:554,64:556,65:558,66:560,67:562,68:566,69:568,70:570,
  71:572,72:574,73:575,74:577,75:578,76:580,77:581,78:582,79:583,80:585,
  81:586,82:587,83:587,84:589,85:590,86:591,87:591,88:592,89:593,90:594,
  91:595,92:595,93:596,94:596,95:597,96:597,97:598,98:598,99:599,100:599,
  101:600,102:600,103:601,104:601,105:601,106:602,107:602,108:602,109:603,110:603,
  111:603,112:604,113:604,114:604,
};
const TOTAL_PAGES = 604;

const BADGE_DEFS = [
  {id:"first_surah",label:"Première sourate",desc:"Mémoriser une sourate complète",icon:"🌱"},
  {id:"three_surahs",label:"3 sourates",desc:"Mémoriser 3 sourates",icon:"🌿"},
  {id:"five_surahs",label:"5 sourates",desc:"Mémoriser 5 sourates",icon:"⭐"},
  {id:"ten_surahs",label:"10 sourates",desc:"Mémoriser 10 sourates",icon:"📚"},
  {id:"twenty_surahs",label:"20 sourates",desc:"Mémoriser 20 sourates",icon:"🏅"},
  {id:"juz30",label:"Juz 30 complet",desc:"Mémoriser tout le Juz 30",icon:"🌙"},
  {id:"juz29",label:"Juz 29 complet",desc:"Mémoriser tout le Juz 29",icon:"✨"},
  {id:"50_verses",label:"50 versets",desc:"Mémoriser 50 versets",icon:"🌸"},
  {id:"100_verses",label:"100 versets",desc:"Mémoriser 100 versets",icon:"💯"},
  {id:"500_verses",label:"500 versets",desc:"Mémoriser 500 versets",icon:"🏆"},
  {id:"1000_verses",label:"1000 versets",desc:"Mémoriser 1000 versets",icon:"👑"},
  {id:"streak_3",label:"3 jours consécutifs",desc:"Mémoriser 3 jours de suite",icon:"🔥"},
  {id:"streak_7",label:"7 jours consécutifs",desc:"Une semaine sans s'arrêter",icon:"⚡"},
  {id:"streak_30",label:"30 jours consécutifs",desc:"Un mois de régularité",icon:"🌟"},
  {id:"fatiha",label:"Al-Fatiha mémorisée",desc:"La mère du Livre mémorisée",icon:"🤲"},
  {id:"ikhlas",label:"Al-Ikhlas mémorisée",desc:"Le tiers du Coran mémorisé",icon:"💎"},
];

const SURAH_INFO = {
  1:{virtue:"Oum al-Kitab — mère du Livre. Récitée dans chaque rakat de la prière.",occasion:"Réciter à chaque prière, pour la guérison (ruqya), avant toute chose importante."},
  2:{virtue:"La plus grande sourate du Coran. Contient le Verset du Trône (2:255).",occasion:"Verset du Trône après chaque prière obligatoire, avant de dormir."},
  18:{virtue:"Protection contre le Dajjal — réciter les 10 premiers versets protège.",occasion:"Chaque vendredi — de préférence le matin."},
  36:{virtue:"Coeur du Coran selon le Prophète ﷺ.",occasion:"Auprès des mourants, pour des besoins importants."},
  55:{virtue:"La mariée du Coran.",occasion:"Méditation sur les bienfaits d'Allah, actions de grâce."},
  56:{virtue:"Récitée chaque nuit, elle protège de la pauvreté selon Ibn Masoud.",occasion:"Chaque nuit avant de dormir."},
  67:{virtue:"Protège de l'azab al-qabr (tourment de la tombe).",occasion:"Chaque soir avant de dormir — obligatoire pour tout mémorisateur."},
  97:{virtue:"Meilleure que 1000 mois d'adoration.",occasion:"Les 10 dernières nuits de Ramadan, surtout les nuits impaires."},
  108:{virtue:"Al-Kawthar — la plus courte sourate.",occasion:"Réciter lors des sacrifices (Aïd al-Adha)."},
  112:{virtue:"Équivaut au tiers du Coran. Réciter 3 fois équivaut à réciter le Coran entier.",occasion:"Après chaque prière, avant de dormir, lors de la ruqya."},
  113:{virtue:"Al-Mu'awwidhatain — sourate de protection.",occasion:"Matin et soir (3 fois), avant de dormir, ruqya."},
  114:{virtue:"Dernière sourate — complète la protection commencée par Al-Falaq.",occasion:"Matin et soir (3 fois), avant de dormir, ruqya."},
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

// Calcul approximatif du début de Ramadan (Hijri → Grégorien)
const getRamadanInfo=()=>{
  const now=new Date();
  // Ramadan 1446 AH ≈ 1 mars 2025, Ramadan 1447 AH ≈ 18 fév 2026
  // Calcul simplifié : cycle de 354.367 jours par an hijri
  const KNOWN_RAMADAN=new Date("2026-02-18"); // début Ramadan 1447
  const HIJRI_YEAR=354.367;
  let start=new Date(KNOWN_RAMADAN);
  // Trouver le Ramadan le plus proche
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
  // Andalousie — grenade, alhambra, azulejos
  andalous:{bg:"#0d0a06",s1:"#130e08",s2:"#1a1409",s3:"#221a0e",b1:"#2e2010",b2:"#3d2c15",
    acc:"#d4892a",acc2:"#e8a840",acc3:"#f5c860",gr:"#4e9c6a",grD:"rgba(78,156,106,.12)",
    tx:"#f0e8d8",tx2:"#c4a87a",tx3:"#7a5c35",rd:"#c0392b",bl:"#2980b9",pu:"#8e44ad",
    navBg:"#0d0a06",cardBg:"#130e08",inputBg:"#1a1409",
    hero:"linear-gradient(160deg,#1a0e06,#2a1a0a)",
    arabesque:true},
  // Ottomane — tulipes, bleu iznik, rouge impérial
  ottoman:{bg:"#04080f",s1:"#070e18",s2:"#0a1420",s3:"#0e1c2e",b1:"#142438",b2:"#1c3050",
    acc:"#c8102e",acc2:"#e8203e",acc3:"#f5405a",gr:"#2ecc71",grD:"rgba(46,204,113,.12)",
    tx:"#e8f0f8",tx2:"#8aafcc",tx3:"#4a6a88",rd:"#e74c3c",bl:"#3498db",pu:"#9b59b6",
    navBg:"#04080f",cardBg:"#070e18",inputBg:"#0a1420",
    hero:"linear-gradient(160deg,#070e18,#0e1c2e)",
    arabesque:true},
  // Abbasside — or sur noir de Bagdad, papier de Samarcande
  abbasid:{bg:"#080600",s1:"#100c00",s2:"#181200",s3:"#201800",b1:"#2a2000",b2:"#382a00",
    acc:"#f0c040",acc2:"#f8d860",acc3:"#fff080",gr:"#50c878",grD:"rgba(80,200,120,.12)",
    tx:"#fff8e8",tx2:"#d4b060",tx3:"#806030",rd:"#e74c3c",bl:"#3498db",pu:"#9b59b6",
    navBg:"#080600",cardBg:"#100c00",inputBg:"#181200",
    hero:"linear-gradient(160deg,#100c00,#201800)",
    arabesque:true},
  // Émeraude — thème vert profond comme l'écran de login
  emerald:{bg:"#050f08",s1:"#081510",s2:"#0d1f15",s3:"#122a1c",b1:"#193d28",b2:"#1f4d33",
    acc:"#4ade80",acc2:"#22c55e",acc3:"#86efac",gr:"#4ade80",grD:"rgba(74,222,128,.12)",
    tx:"#e8fff2",tx2:"#86efac",tx3:"#4a7a5a",rd:"#f87171",bl:"#60a5fa",pu:"#c084fc",
    navBg:"#050f08",cardBg:"#081510",inputBg:"#0d1f15",
    hero:"linear-gradient(160deg,#081510,#122a1c)"},
};

// Métadonnées des thèmes pour l'UI de sélection
const THEME_META={
  dark:{label:"Nuit",sub:"Sobre et élégant",preview:["#050608","#c9a84c","#22c55e"]},
  light:{label:"Clarté",sub:"Thème vert naturel",preview:["#f0f7f0","#2e7d32","#388e3c"]},
  andalous:{label:"Andalousie",sub:"Alhambra — or et terre",preview:["#0d0a06","#d4892a","#4e9c6a"]},
  ottoman:{label:"Ottomane",sub:"İznik — rouge impérial",preview:["#04080f","#c8102e","#2ecc71"]},
  abbasid:{label:"Abbasside",sub:"Bagdad — or sur noir",preview:["#080600","#f0c040","#50c878"]},
  emerald:{label:"Émeraude",sub:"Vert profond — login",preview:["#050f08","#4ade80","#22c55e"]},
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

// Icons
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

// Animation Calligraphie — SVG qui s'écrit quand un verset est mémorisé
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

// Sablier SVG animé
function HourglassIcon({pct=0.5, color="#c9a84c", size=32}) {
  // pct = 0 (plein) -> 1 (vide)
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
      {/* Outer frame */}
      <polygon points="6,3 26,3 19,16 13,16" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.7"/>
      <polygon points="13,16 19,16 26,29 6,29" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.7"/>
      {/* Top bar */}
      <line x1="4" y1="2" x2="28" y2="2" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Bottom bar */}
      <line x1="4" y1="30" x2="28" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Top sand */}
      <rect x="6" y={3 + (13 - topH)} width="20" height={topH} fill="url(#hg_grad)" clipPath="url(#hg_top_clip)" opacity="0.85"/>
      {/* Bottom sand */}
      <rect x="6" y={29 - botH * 0.6} width="20" height={botH * 0.6} fill={color} clipPath="url(#hg_bot_clip)" opacity="0.6"/>
      {/* Drip particle */}
      {sandFill > 0.05 && sandFill < 0.95 && (
        <circle cx="16" cy="17.5" r="1.2" fill={color} opacity="0.9">
          <animate attributeName="cy" values="16;19;16" dur="1.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.4s" repeatCount="indefinite"/>
        </circle>
      )}
    </svg>
  );
}

// Tajweed parser
// Mapping complet des classes tajweed de l'API qurancdn → couleurs Mushaf standard
const TAJWID_CLASS_COLORS={
  // Madd (مد) ── bleu/cyan selon durée
  "madda_normal":        tjc=>tjc.m,   // Madd naturel (2 harakats)
  "madda_permissible":   tjc=>tjc.mr,  // Madd permissible (2, 4 ou 6h)
  "madda_necessary":     tjc=>tjc.ml,  // Madd lazim (6h obligatoire)
  "madda_obligatory":    tjc=>tjc.mo,  // Madd wajib muttasil (4-5h)
  "madda_wajib":         tjc=>tjc.mo,
  // Ghunna / Idgham (غنة، إدغام) ── vert
  "ghunnah":             tjc=>tjc.g,
  "idgham_with_ghunnah": tjc=>tjc.g,
  "idgham_ghunnah":      tjc=>tjc.g,
  "idgham_mutajanisayn": tjc=>tjc.g,
  "idgham_mutaqaribayn": tjc=>tjc.idg,
  "idgham_without_ghunnah": tjc=>tjc.idg,
  "idgham_shafawi":      tjc=>tjc.g,
  // Qalqala (قلقلة) ── violet
  "qalaqah":             tjc=>tjc.q,
  // Ikhfa / Iqlab (إخفاء، إقلاب) ── orange / rouge
  "ikhafa":              tjc=>tjc.ikh,
  "ikhafa_shafawi":      tjc=>tjc.ikh,
  "ikhafa_with_ghunnah": tjc=>tjc.ikh,
  "iqlab":               tjc=>tjc.iql,
  // Lam shamsiyya (لام شمسية) ── bleu clair
  "laam_shamsiyah":      tjc=>tjc.ls,
  // Ham Wasl / Sakt ── gris (affiché mais sans couleur forte)
  "ham_wasl":            ()=>null,
  "silent":              ()=>null,
  "sakt":                tjc=>tjc.sl,
};

// HifzVerseText — affiche le verset en mode Hifz
// Les derniers mots (selon level 1-5) sont masqués, les visibles gardent TajwidSpan
function HifzVerseText({ar, level, tjc, showTj, vmark, onRevealWord}) {
  const clean=(ar||"").replace(/<[^>]*>/g,"");
  const words=clean.split(/\s+/).filter(Boolean);
  const total=words.length;
  // level 1=20% caché, 2=40%, 3=60%, 4=80%, 5=100%
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
        // Mot visible — on reconstruis avec TajwidSpan si le tajweed était dans ar
        return <span key={i} style={{display:"inline"}}><TajwidSpan text={w} enabled={showTj} tjc={tjc}/>{" "}</span>;
      })}
      <span style={{fontFamily:"'Amiri',serif",fontSize:".72rem",color:"#c9a84c",margin:"0 4px",verticalAlign:"middle"}}>﴿{vmark}﴾</span>
    </bdi>
  );
}

// TajwidSpan — rend le HTML tajweed de l'API qurancdn avec les couleurs du Mushaf standard
function AuthScreen({authPage,setAuthPage,email,setEmail,password,setPassword,authLoading,authError,onLogin,onSignup,onReset}){  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0a0f0a 0%,#0d1a0f 50%,#0a0f0a 100%)",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:.04,fontSize:"clamp(8rem,20vw,18rem)",fontFamily:"'Amiri Quran',serif",color:"#4ade80",pointerEvents:"none",userSelect:"none",direction:"rtl"}}>بسم الله</div>
      <div style={{width:"100%",maxWidth:380,background:"rgba(255,255,255,.03)",backdropFilter:"blur(20px)",borderRadius:24,padding:36,border:"1px solid rgba(74,222,128,.15)",boxShadow:"0 8px 48px rgba(0,0,0,.6),0 0 80px rgba(74,222,128,.05)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"2rem",color:"#4ade80",marginBottom:6,direction:"rtl",letterSpacing:2}}>الحفظ</div>
          <div style={{fontSize:"1.5rem",fontWeight:800,color:"#fff",letterSpacing:1}}>Al-Hifz</div>
          <div style={{fontSize:".72rem",color:"rgba(74,222,128,.6)",marginTop:4,letterSpacing:2,textTransform:"uppercase"}}>Mémorisation du Coran</div>
        </div>
        <div style={{display:"flex",marginBottom:20,borderRadius:12,overflow:"hidden",background:"rgba(255,255,255,.05)",padding:3,gap:3}}>
          <button onClick={()=>setAuthPage("login")} style={{flex:1,padding:"10px",background:authPage==="login"?"#4ade80":"transparent",color:authPage==="login"?"#000":"rgba(255,255,255,.5)",border:"none",cursor:"pointer",fontWeight:700,fontSize:".8rem",borderRadius:10,transition:"all .2s"}}>Connexion</button>
          <button onClick={()=>setAuthPage("signup")} style={{flex:1,padding:"10px",background:authPage==="signup"?"#4ade80":"transparent",color:authPage==="signup"?"#000":"rgba(255,255,255,.5)",border:"none",cursor:"pointer",fontWeight:700,fontSize:".8rem",borderRadius:10,transition:"all .2s"}}>Inscription</button>
        </div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:"100%",padding:"13px 16px",background:"rgba(255,255,255,.06)",border:"1px solid rgba(74,222,128,.2)",borderRadius:12,color:"#fff",fontSize:".85rem",marginBottom:12,boxSizing:"border-box",outline:"none"}}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" type="password" style={{width:"100%",padding:"13px 16px",background:"rgba(255,255,255,.06)",border:"1px solid rgba(74,222,128,.2)",borderRadius:12,color:"#fff",fontSize:".85rem",marginBottom:20,boxSizing:"border-box",outline:"none"}}/>
        {authError&&<div style={{color:authError.includes("✓")?"#4ade80":"#ef4444",fontSize:".75rem",marginBottom:12,textAlign:"center",padding:"8px",background:authError.includes("✓")?"rgba(74,222,128,.1)":"rgba(239,68,68,.1)",borderRadius:8}}>{authError}</div>}
        <button onClick={authPage==="login"?onLogin:onSignup} disabled={authLoading} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#4ade80,#22c55e)",border:"none",borderRadius:12,color:"#000",fontWeight:800,fontSize:".95rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(74,222,128,.3)"}}>
          {authLoading?"...":(authPage==="login"?"Se connecter →":"Créer mon compte →")}
        </button>{authPage==="login"&&(
  <button onClick={onReset} style={{width:"100%",marginTop:10,padding:"10px",background:"transparent",border:"none",color:"rgba(74,222,128,.6)",fontSize:".75rem",cursor:"pointer",textDecoration:"underline"}}>
    Mot de passe oublié ?
  </button>
)}
      </div>
    </div>
  );
}
 function WordByWord({sn,vn,ar,t}){
  const [words,setWords]=useState(null);
  const [tooltip,setTooltip]=useState(null);
  const [loaded,setLoaded]=useState(false);

  const loadWords=()=>{
    if(loaded)return;
    setLoaded(true);
    fetch(`https://api.quran.com/api/v4/verses/by_key/${sn}:${vn}?words=true&word_fields=text_uthmani,translation&language=fr`)
      .then(r=>r.json())
      .then(d=>setWords(d?.verse?.words||null))
      .catch(()=>setWords(null));
  };

  if(!words)return (
    <bdi style={{direction:"rtl"}} onMouseEnter={loadWords}>
      {ar}
    </bdi>
  );

  return (
    <bdi style={{direction:"rtl",lineHeight:2.5}}>
      {words.filter(w=>w.char_type_name==="word").map((w,i)=>(
        <span key={i} style={{position:"relative",display:"inline-block",margin:"0 2px",cursor:"pointer",padding:"2px 4px",borderRadius:4,transition:"background .15s"}}
          onMouseEnter={e=>{setTooltip(i);e.currentTarget.style.background="rgba(201,168,76,.15)";}}
          onMouseLeave={e=>{setTooltip(null);e.currentTarget.style.background="transparent";}}
          onClick={()=>{const a=new Audio(`https://audio.qurancdn.com/${w.audio_url}`);a.play();}}>
          {w.text_uthmani}
          {tooltip===i&&(
            <span style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",background:"#1a1a1a",color:"#c9a84c",padding:"4px 8px",borderRadius:6,fontSize:".65rem",whiteSpace:"nowrap",zIndex:99,border:"1px solid rgba(201,168,76,.3)",pointerEvents:"none"}}>
              {w.translation?.text||""}
            </span>
          )}
        </span>
      ))}
    </bdi>
  );
}
function WbwModal({sn,vn,t}){
  const [words,setWords]=useState(null);
  useEffect(()=>{
    let cancelled=false;
    fetch(`https://api.quran.com/api/v4/verses/by_key/${sn}:${vn}?words=true&word_fields=text_uthmani,translation&language=fr`)
      .then(r=>r.json())
      .then(d=>{if(!cancelled)setWords(d?.verse?.words?.filter(w=>w.char_type_name==="word")||null);})
      .catch(()=>{if(!cancelled)setWords([]);});
    return()=>{cancelled=true;};
  },[sn,vn]);
  if(!words)return <div style={{textAlign:"center",padding:20,color:t.tx3}}>Chargement…</div>;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {words.map((w,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"rgba(255,255,255,.04)",borderRadius:10,border:`1px solid ${t.b1}`}}>
          <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.4rem",color:"#fff",direction:"rtl"}}>{w.text_uthmani}</div>
          <div style={{fontSize:".75rem",color:t.acc,textAlign:"center",flex:1,padding:"0 12px"}}>{w.translation?.text||""}</div>
          <button onClick={()=>new Audio(`https://audio.qurancdn.com/${w.audio_url}`).play()} style={{background:`${t.acc}22`,border:`1px solid ${t.acc}44`,borderRadius:8,padding:"6px 10px",color:t.acc,cursor:"pointer",fontSize:".7rem"}}>▶</button>
        </div>
      ))}
    </div>
  );
}
function TajwidSpan({text,enabled,tjc}) {
  const raw=text||"";
  // Strip anciens tags de marquage [m]...[/m]
  const clean=raw.replace(/\[[a-z]+\](.*?)\[\/[a-z]+\]/g,"$1");

  if(!enabled){
    return <bdi style={{direction:"rtl"}}>{clean.replace(/<[^>]*>/g,"")}</bdi>;
  }
  if(!clean.includes("<tajweed")){
    return <bdi style={{direction:"rtl",letterSpacing:0}}>{clean.replace(/<[^>]*>/g,"")}</bdi>;
  }

  // Parser robuste via DOMParser — gère tous les cas (imbriqués, sans guillemets, auto-fermants)
  try{
    const wrapped=`<span>${clean}</span>`;
    const doc=new DOMParser().parseFromString(wrapped,"text/html");
    const root=doc.querySelector("span");
    if(!root) throw new Error("parse fail");
    let key=0;
    const renderNode=(node)=>{
      if(node.nodeType===3){ // texte
        return node.textContent?<React.Fragment key={key++}>{node.textContent}</React.Fragment>:null;
      }
      if(node.nodeType===1){
        const tag=node.tagName.toLowerCase();
        const children=Array.from(node.childNodes).map(renderNode).filter(Boolean);
        if(tag==="tajweed"){
          const cls=node.getAttribute("class")||"";
          const colorFn=TAJWID_CLASS_COLORS[cls];
          const color=colorFn?colorFn(tjc):null;
          if(color) return <bdi key={key++} style={{color,fontWeight:"bold",letterSpacing:0}} title={cls.replace(/_/g," ")}>{children}</bdi>;
          return <React.Fragment key={key++}>{children}</React.Fragment>;
        }
        // Tout autre tag HTML — on prend juste le texte
        return <React.Fragment key={key++}>{children}</React.Fragment>;
      }
      return null;
    };
    const parts=Array.from(root.childNodes).map(renderNode).filter(Boolean);
    return <bdi style={{direction:"rtl",letterSpacing:0,lineHeight:"inherit"}}>{parts}</bdi>;
  }catch{
    // Fallback sécurisé : texte brut sans couleurs
    return <bdi style={{direction:"rtl",letterSpacing:0}}>{clean.replace(/<[^>]*>/g,"")}</bdi>;
  }
}

function RecitModal({verses,selS,t,acc,tn,continuousIdx:initIdx,setContinuousIdx,continuousMode:initChain,setContinuousMode,speechListening,speechVerseTarget,speechCountdown,speechScore,speechResult,showTj,tjc,mem,startListening,stopListening,setSpeechScore,setSpeechResult,countdownRef,setSpeechCountdown,doPlay,onClose}){
  // Index interne — ne dépend pas du re-render parent
  const [idx,setIdx]=React.useState(initIdx);
  const [chain,setChain]=React.useState(true); // enchaîné par défaut
  const idxRef=React.useRef(idx);
  const chainRef=React.useRef(true);
  const versesRef=React.useRef(verses);
  React.useEffect(()=>{versesRef.current=verses;},[verses]);

  const curV=verses[idx]||verses[0];
  const isListening=speechListening&&speechVerseTarget?.vn===curV?.n;
  const isCountdown=speechCountdown>0&&speechVerseTarget?.vn===curV?.n;
  const hasScore=speechScore&&speechVerseTarget?.vn===curV?.n;
  const isMem=!!(mem[String(selS.n)]||{})[String(curV?.n)];
  const progress=Math.round((idx/Math.max(verses.length-1,1))*100);

  // Sync vers parent pour la nav externe
  React.useEffect(()=>{setContinuousIdx(idx);},[idx]);
  React.useEffect(()=>{setContinuousMode(chain);},[chain]);

  const nextVerse=React.useCallback(()=>{
    const cur=idxRef.current;
    const vv=versesRef.current;
    if(cur<vv.length-1){
      const n=cur+1;
      idxRef.current=n;
      setIdx(n);
      setSpeechScore(null);setSpeechResult("");
      // Sur desktop uniquement — iOS requiert un geste direct
      const isIOS=/iPhone|iPad|iPod/i.test(navigator.userAgent);
      if(chainRef.current&&!isIOS){
        setTimeout(()=>{
          const nextV=versesRef.current[n];
          if(nextV&&chainRef.current) startListening(nextV.ar||"",nextV.n,(s)=>{
            if(chainRef.current&&s.pct>=70) setTimeout(nextVerse,600);
          });
        },300);
      }
      // Sur iOS : le message "Appuie pour continuer" s'affiche, l'utilisateur tape
    } else {
      setTimeout(onClose,800);
    }
  },[startListening,onClose,setSpeechScore,setSpeechResult]);

  const onDone=React.useCallback((score)=>{
    if(chainRef.current&&score.pct>=70) setTimeout(nextVerse,700);
  },[nextVerse]);

  // Pas de démarrage auto — iOS Safari requiert un geste utilisateur direct
  // L'utilisateur appuie sur le bouton micro pour démarrer

  const goTo=(n)=>{
    stopListening();setSpeechScore(null);setSpeechResult("");
    idxRef.current=n;setIdx(n);
    if(chainRef.current){
      setTimeout(()=>{
        const v=versesRef.current[n];
        if(v) startListening(v.ar||"",v.n,onDone);
      },300);
    }
  };

  const handleMic=()=>{
    if(isListening){stopListening();}
    else if(isCountdown){clearInterval(countdownRef.current);setSpeechCountdown(0);}
    else if(hasScore&&chain&&speechScore?.pct>=70){
      // En mode enchaîné et bon score — passer au verset suivant
      nextVerse();
    }
    else{setSpeechScore(null);setSpeechResult("");startListening(curV?.ar||"",curV?.n,onDone);}
  };

  const toggleChain=()=>{
    const next=!chain;
    chainRef.current=next;setChain(next);
    if(next&&!isListening&&!isCountdown&&curV){
      startListening(curV.ar||"",curV.n,onDone);
    } else if(!next){
      stopListening();
    }
  };

  const bg=tn==="light"?"#fafaf8":"#0a150b";
  return(
    <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",flexDirection:"column",background:bg,overscrollBehavior:"contain"}}>
      <style>{`
        @keyframes micRing{0%{box-shadow:0 0 0 0 rgba(233,30,99,.5)}70%{box-shadow:0 0 0 20px rgba(233,30,99,0)}100%{box-shadow:0 0 0 0 rgba(233,30,99,0)}}
        @keyframes scoreIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wave{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
      `}</style>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",padding:"14px 16px",borderBottom:`1px solid ${t.b1}`,flexShrink:0,gap:10,paddingTop:"max(14px,env(safe-area-inset-top))"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:".52rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"2px",marginBottom:2}}>Récitation</div>
          <div style={{fontFamily:"'Amiri',serif",fontSize:".95rem",color:acc,fontWeight:700,lineHeight:1.2}}>{selS.name}<span style={{color:t.tx3,fontWeight:400,fontSize:".8rem"}}> · {selS.ar}</span></div>
        </div>
        {/* Mode enchaîné toggle */}
        <button onClick={toggleChain} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:20,border:`1px solid ${chain?acc:t.b2}`,background:chain?`${acc}18`:t.s2,color:chain?acc:t.tx3,fontSize:".6rem",fontWeight:700,cursor:"pointer",flexShrink:0,transition:"all .2s"}}>
          {chain
            ?<><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>Enchaîné</>
            :<><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>Verset/verset</>
          }
        </button>
        <span style={{fontSize:".62rem",color:t.tx3,fontWeight:600,flexShrink:0}}>{idx+1}/{verses.length}</span>
        <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",border:`1px solid ${t.b2}`,background:t.s2,color:t.tx3,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Barre progression */}
      <div style={{height:3,background:t.b1,flexShrink:0}}>
        <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${acc},${t.acc2||acc})`,transition:"width .5s ease",boxShadow:`0 0 6px ${acc}55`}}/>
      </div>

      {/* Corps */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",gap:20,overflowY:"auto"}}>

        {/* Badge verset */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:34,height:34,borderRadius:"50%",border:`2px solid ${isMem?t.gr:t.b2}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",fontWeight:800,color:isMem?t.gr:t.tx3,background:isMem?`${t.gr}12`:"transparent",transition:"all .3s"}}>{curV?.n}</div>
          {isMem&&<div style={{fontSize:".6rem",color:t.gr,fontWeight:700,display:"flex",alignItems:"center",gap:3}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Mémorisé
          </div>}
        </div>

        {/* Verset */}
        <div key={idx} style={{fontFamily:"'Scheherazade New','Amiri Quran',serif",fontSize:"clamp(1.6rem,5vw,2.2rem)",direction:"rtl",textAlign:"center",lineHeight:2.2,color:t.tx,width:"100%",maxWidth:540,animation:"scoreIn .25s ease"}}>
          {hasScore
            ? speechScore.analysis?.map((w,wi)=>(
                <span key={wi} style={{color:w.status==="ok"?t.gr:w.status==="wrong"?"#e91e63":t.tx3,fontWeight:w.status==="wrong"?700:400,margin:"0 2px",textDecoration:w.status==="wrong"?"underline wavy #e91e63":"none"}}>{w.word} </span>
              ))
            : <TajwidSpan text={curV?.ar||""} enabled={showTj} tjc={tjc}/>
          }
          <span style={{fontFamily:"'Amiri',serif",fontSize:".65em",color:acc,margin:"0 3px"}}>﴿{curV?.n}﴾</span>
        </div>

        {/* Traduction */}
        {curV?.fr&&<div style={{fontSize:".7rem",color:t.tx2,fontStyle:"italic",textAlign:"center",maxWidth:440,lineHeight:1.7,transition:"opacity .3s"}}>{curV.fr}</div>}

        {/* Score */}
        {hasScore&&(
          <div style={{width:"100%",maxWidth:440,animation:"scoreIn .3s ease"}}>
            <div style={{display:"flex",gap:14,padding:"14px 16px",background:speechScore.pct>=80?`${t.gr}10`:speechScore.pct>=50?`${acc}10`:"rgba(233,30,99,.07)",borderRadius:14,border:`1.5px solid ${speechScore.pct>=80?t.gr:speechScore.pct>=50?acc:"#e91e63"}33`}}>
              <div style={{position:"relative",width:56,height:56,flexShrink:0}}>
                <svg width="56" height="56" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="23" fill="none" stroke={t.b1} strokeWidth="5"/>
                  <circle cx="28" cy="28" r="23" fill="none" stroke={speechScore.pct>=80?t.gr:speechScore.pct>=50?acc:"#e91e63"} strokeWidth="5" strokeDasharray={`${2*Math.PI*23*speechScore.pct/100} ${2*Math.PI*23}`} strokeLinecap="round" transform="rotate(-90 28 28)" style={{transition:"stroke-dasharray .6s"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:".88rem",fontWeight:800,color:speechScore.pct>=80?t.gr:speechScore.pct>=50?acc:"#e91e63",lineHeight:1}}>{speechScore.pct}</span>
                  <span style={{fontSize:".38rem",color:t.tx3}}>%</span>
                </div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:".8rem",fontWeight:700,color:speechScore.pct>=80?t.gr:speechScore.pct>=50?acc:"#e91e63",marginBottom:4}}>
                  {speechScore.pct>=90?"Excellent !":speechScore.pct>=80?"Très bien !":speechScore.pct>=60?"Presque…":"À retravailler"}
                </div>
                <div style={{fontSize:".6rem",color:t.tx3,marginBottom:5}}>{speechScore.correct?.length||0} correct{(speechScore.correct?.length||0)>1?"s":""} · {speechScore.wrong?.length||0} erreur{(speechScore.wrong?.length||0)>1?"s":""}</div>
                <div style={{padding:"5px 8px",background:t.s2,borderRadius:7,direction:"rtl"}}>
                  <div style={{fontSize:".46rem",color:t.tx3,direction:"ltr",marginBottom:2}}>Tu as dit</div>
                  <div style={{fontFamily:"'Amiri',serif",fontSize:".85rem",color:t.tx,lineHeight:1.6}}>{speechResult||"—"}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Micro */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <button onClick={handleMic} style={{width:72,height:72,borderRadius:"50%",border:"none",cursor:"pointer",background:isListening?"#e91e63":isCountdown?"#f59e0b":hasScore&&speechScore?.pct>=80?t.gr:acc,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,animation:isListening?"micRing 1.4s infinite":"none",transition:"background .25s",boxShadow:`0 4px 18px ${isListening?"rgba(233,30,99,.4)":isCountdown?"rgba(245,158,11,.4)":`${acc}44`}`}}>
            {isListening
              ?<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              :isCountdown
              ?<span style={{fontSize:"1.5rem",fontWeight:900,color:"#fff",fontFamily:"monospace"}}>{speechCountdown}</span>
              :hasScore
              ?<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
              :<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" fill="none" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            }
          </button>
          {isListening&&(
            <div style={{display:"flex",gap:3,alignItems:"center",height:22}}>
              {Array.from({length:11},(_,i)=>(
                <div key={i} style={{width:3,background:"#e91e63",borderRadius:99,height:18,transformOrigin:"center",animation:`wave .65s ease-in-out ${i*.055}s infinite`,opacity:.55+i*.04}}/>
              ))}
            </div>
          )}
          <div style={{fontSize:".68rem",color:t.tx3,textAlign:"center",minHeight:18,fontWeight:500}}>
            {isListening?<span style={{color:"#e91e63",fontWeight:700}}>En écoute…</span>
            :isCountdown?<span style={{color:"#f59e0b",fontWeight:700}}>Prépare-toi {speechCountdown}…</span>
            :hasScore&&speechScore?.pct>=70&&chain?"→ Appuie pour verset suivant"
            :hasScore?"Appuie ↺ pour réessayer"
            :chain?"Appuie · mode enchaîné actif"
            :"Appuie pour réciter"}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{display:"flex",gap:8,padding:"12px 16px",borderTop:`1px solid ${t.b1}`,flexShrink:0,alignItems:"center",paddingBottom:"max(12px,env(safe-area-inset-bottom))"}}>
        <button onClick={()=>{if(idx>0)goTo(idx-1);}} disabled={idx===0} style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${t.b2}`,background:t.s2,color:idx===0?t.tx3:t.tx,cursor:idx===0?"default":"pointer",fontSize:".72rem",fontWeight:600,opacity:idx===0?.35:1}}>←</button>
        <button onClick={()=>doPlay(curV?.n)} style={{flex:1,padding:"10px",borderRadius:10,border:`1px solid ${t.b2}`,background:t.s2,color:t.tx2,cursor:"pointer",fontSize:".7rem",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>Écouter
        </button>
        <button onClick={()=>{if(idx<verses.length-1)goTo(idx+1);else onClose();}} style={{padding:"10px 14px",borderRadius:10,border:"none",background:acc,color:"#000",cursor:"pointer",fontSize:".72rem",fontWeight:700}}>
          {idx<verses.length-1?"→":"Fin"}
        </button>
      </div>
    </div>
  );
}

function TajweedLegend({effectiveTjc}){
  const [show,setShow]=React.useState(true);
  if(!show) return(
    <button onClick={()=>setShow(true)} style={{padding:"3px 10px",background:"rgba(26,10,0,.8)",border:"none",borderTop:"1px solid rgba(201,168,76,.1)",color:"#7a6a5a",fontSize:".5rem",cursor:"pointer",flexShrink:0,textAlign:"center",width:"100%"}}>● Afficher légende tajweed</button>
  );
  return(
    <div style={{padding:"4px 10px",background:"rgba(26,10,0,.92)",borderTop:"1px solid rgba(201,168,76,.15)",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",flexShrink:0}}>
      {[[effectiveTjc.m,"Madd nat."],[effectiveTjc.mr,"Madd perm."],[effectiveTjc.mo,"Madd wajib"],[effectiveTjc.ml,"Madd lazim"],[effectiveTjc.g,"Ghunna"],[effectiveTjc.q,"Qalqala"],[effectiveTjc.ikh,"Ikhfa"],[effectiveTjc.iql,"Iqlab"]].map(([c,l])=>(
        <div key={l} style={{display:"flex",alignItems:"center",gap:3}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:c,flexShrink:0}}/>
          <span style={{fontSize:".46rem",color:"#9a8a6a"}}>{l}</span>
        </div>
      ))}
      <button onClick={()=>setShow(false)} style={{marginLeft:"auto",background:"none",border:"none",color:"#7a6a5a",cursor:"pointer",fontSize:".75rem",padding:"0 4px",lineHeight:1}}>✕</button>
    </div>
  );
}

// MushafPage
// Vraies URL par édition — plusieurs fallbacks pour fiabilité
// URLs Mushaf — proxy Vercel en premier (pas de CORS), puis CDN directs en fallback
const EDITION_IMGS = {
 hafs: pg => [
    `https://static.qurancdn.com/images/quran/pages/v4/en/hafs/page${String(pg).padStart(3,"0")}.png`,
    `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
  ],
  tajweed: pg => [],
  warsh: pg => [
    `https://static.qurancdn.com/images/quran/pages/v4/en/warsh/page${String(pg).padStart(3,"0")}.png`,
    `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
  ],
  indopak: pg => [
    `https://static.qurancdn.com/images/quran/pages/v4/en/indopak/page${String(pg).padStart(3,"0")}.png`,
    `https://cdn.islamic.network/quran/images/high-resolution/${pg}.jpg`,
  ],
};
// Charge l'URL réelle depuis l'API qurancdn (contourne les problèmes CORS des CDN directs)
const fetchMushafPageUrl=async(pg, editionId)=>{
  try{
    const r=await fetch(`https://api.qurancdn.com/api/qdc/pages/${pg}?book_name=${editionId==="warsh"?"warsh":"hafs"}`);
    const d=await r.json();
    return d?.page?.image_url||null;
  }catch{return null;}
};
function MushafPage({page,t,tjc,arFont,edition,fullscreen,onToggleFullscreen,onNext,onPrev}) {
  const ed=edition||MUSHAF_EDITIONS[0];
  const isTextOnly=ed.id==="tajweed";
  const [mode,setMode]=useState(isTextOnly?"text":"image");
  const [verses,setVerses]=useState([]);
  const [textState,setTextState]=useState("idle");
  const touchStart=useRef(null);
  const touchStartY=useRef(null);
  const effectiveTjc=tjc||TJC_DARK;
  const AC="#c9a84c";

  useEffect(()=>{ setMode(ed.id==="tajweed"?"text":"image"); },[ed.id]);

  // Mode texte tajweed — charge les versets avec tajweed HTML depuis qurancdn
  useEffect(()=>{
    if(mode!=="text")return;
    const ck=`mpage9_${page}`;
    try{const c=localStorage.getItem(ck);if(c){setVerses(JSON.parse(c));setTextState("ok");return;}}catch{}
    setTextState("loading");setVerses([]);
    fetch(`https://api.qurancdn.com/api/qdc/verses/by_page/${page||1}?language=en&words=false&per_page=50&fields=text_uthmani_tajweed,text_uthmani,verse_number,chapter_id`)
      .then(r=>r.json()).then(d=>{
        const vs=(d.verses||[]).map(a=>({
          n:a.verse_number,s:a.chapter_id,
          ar:a.text_uthmani_tajweed||a.text_uthmani||"",
          sName:SURAHS.find(x=>x.n===a.chapter_id)?.name||"",
          sAr:SURAHS.find(x=>x.n===a.chapter_id)?.ar||""
        }));
        setVerses(vs);setTextState(vs.length?"ok":"error");
        if(vs.length)try{localStorage.setItem(ck,JSON.stringify(vs));}catch{}
      }).catch(()=>setTextState("error"));
  },[page,mode]);

  const groups=[];let cur=null;
  for(const v of verses){if(!cur||cur.s!==v.s){cur={s:v.s,sName:v.sName,sAr:v.sAr,vs:[]};groups.push(cur);}cur.vs.push(v);}

  const onTS=e=>{touchStart.current=e.touches[0].clientX;touchStartY.current=e.touches[0].clientY;};
  const onTE=e=>{
    if(!touchStart.current)return;
    const dx=e.changedTouches[0].clientX-touchStart.current;
    const dy=Math.abs(e.changedTouches[0].clientY-(touchStartY.current||0));
    if(Math.abs(dx)>120&&dy<60){dx<0?onNext?.():onPrev?.();}
    touchStart.current=null;touchStartY.current=null;
  };

  const outer=fullscreen
    ?{position:"fixed",inset:0,zIndex:200,background:mode==="text"?"#f5f0e8":"#0d1800",display:"flex",flexDirection:"column",overflow:"hidden"}
    :{width:"100%",minHeight:480,background:mode==="text"?"#f5f0e8":"#0d1800",display:"flex",flexDirection:"column",borderRadius:"0 0 14px 14px"};

  return (
    <div style={outer} onTouchStart={onTS} onTouchEnd={onTE}>
      {/* Barre nav */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"rgba(0,0,0,.55)",flexShrink:0,borderBottom:"1px solid rgba(201,168,76,.15)"}}>
        <button onClick={onPrev} style={{background:"rgba(201,168,76,.12)",border:"1px solid rgba(201,168,76,.22)",color:AC,padding:"5px 14px",borderRadius:8,cursor:"pointer",fontWeight:700}}>◄</button>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:".68rem",color:AC,fontWeight:700}}>p.{page||1}</span>
          {!isTextOnly&&(
            <div style={{display:"flex",background:"rgba(0,0,0,.5)",borderRadius:6,padding:2,gap:1}}>
              {[["image","📖 Image"],["text","🎨 Tajweed"]].map(([m,l])=>(
                <button key={m} onClick={()=>setMode(m)} style={{padding:"3px 10px",borderRadius:4,border:"none",background:mode===m?AC:"transparent",color:mode===m?"#0d1800":"#7a6a4a",fontSize:".58rem",cursor:"pointer",fontWeight:700,transition:"all .15s"}}>{l}</button>
              ))}
            </div>
          )}
          <span style={{fontSize:".58rem",color:"#5a4a2a",fontStyle:"italic"}}>{ed.name}</span>
        </div>
        <button onClick={onToggleFullscreen} style={{background:"rgba(201,168,76,.18)",border:"1px solid rgba(201,168,76,.4)",color:AC,padding:"5px 11px",borderRadius:8,cursor:"pointer",fontSize:".72rem",fontWeight:700}}>{fullscreen?"✕ Quitter":"⛶ Plein écran"}</button>
        <button onClick={onNext} style={{background:"rgba(201,168,76,.12)",border:"1px solid rgba(201,168,76,.22)",color:AC,padding:"5px 14px",borderRadius:8,cursor:"pointer",fontWeight:700}}>►</button>
      </div>

      {/* Mode image — Archive.org (qui fonctionnait avant) */}
      {mode==="image"&&(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:8,minHeight:400}}>
          <iframe
            src={`https://archive.org/embed/${ed.archiveId||"al-quran-al-karim-tajwid-hafs"}/page/n${(page||1)-1}/mode/1up`}
            style={{width:"100%",height:fullscreen?"calc(100vh - 56px)":"72vh",border:"none",borderRadius:8}}
            title={`Mushaf page ${page}`}
            allowFullScreen
          />
        </div>
      )}

      {/* Mode texte tajweed — rendu Amiri Quran avec couleurs tajweed */}
      {mode==="text"&&(
        <div style={{flex:1,overflowY:"auto",padding:"20px 14px 80px",background:"#f5f0e8",backgroundImage:"radial-gradient(ellipse at top,#f0e8d4,#f5f0e8)"}}>
          {textState==="loading"&&(
            <div style={{textAlign:"center",padding:40,color:"#7a6a40"}}>
              <div style={{width:28,height:28,border:"3px solid #c9a84c",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 12px"}}/>
              <div style={{fontFamily:"'Amiri',serif",fontSize:".9rem"}}>جاري التحميل…</div>
            </div>
          )}
          {textState==="error"&&(
            <div style={{textAlign:"center",padding:28,color:"#c62828",fontSize:".8rem"}}>
              <div style={{fontSize:"1.8rem",marginBottom:8}}>⚠</div>
              Connexion requise.
              <br/>
              <button onClick={()=>{try{localStorage.removeItem(`mpage9_${page}`);}catch{}setTextState("idle");setTimeout(()=>setTextState("loading"),50);}} style={{marginTop:10,padding:"5px 12px",border:"1px solid #c9a84c",background:"transparent",color:"#c9a84c",borderRadius:7,cursor:"pointer",fontSize:".7rem"}}>↺ Réessayer</button>
            </div>
          )}
          {textState==="ok"&&(
            <div style={{
              direction:"rtl",
              fontFamily:"'Scheherazade New',serif",
              fontSize:"1.45rem",
              lineHeight:"2.4",
              color:"#1a0a00",
              padding:"16px 20px",
              textAlign:"justify",
              wordSpacing:"2px",
              letterSpacing:"0",
              background:"rgba(255,255,255,.5)",
              borderRadius:10,
              minHeight:"70vh",
            }}>
              {groups.map((g,gi)=>(
                <React.Fragment key={gi}>
                  {/* En-tête sourate */}
                  {g.vs[0]?.n===1&&(
                    <div style={{textAlign:"center",margin:"8px 0 12px",padding:"8px 14px",background:"linear-gradient(135deg,#2c1810,#4a2c18)",borderRadius:8,border:"1px solid rgba(201,168,76,.4)"}}>
                      <div style={{fontFamily:"'Amiri',serif",fontSize:"1rem",color:"#e8c060",letterSpacing:2}}>{g.sAr}</div>
                      <div style={{fontSize:".55rem",color:"#c8a060",marginTop:2,direction:"ltr"}}>{g.sName}</div>
                      {g.s!==1&&g.s!==9&&(
                        <div style={{fontFamily:"'Scheherazade New',serif",fontSize:"1.3rem",color:"#1a0a00",marginTop:8,direction:"rtl",background:"#f5f0dc",padding:"6px 14px",borderRadius:6}}>
                          بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                        </div>
                      )}
                    </div>
                  )}
                  {/* Versets en flux continu — comme une vraie page */}
                  {g.vs.map((v,vi)=>(
                    <React.Fragment key={vi}>
                      <TajwidSpan text={v.ar} enabled={true} tjc={effectiveTjc}/>
                      <span style={{
                        fontFamily:"'Amiri',serif",
                        fontSize:".65rem",
                        color:"#c9a84c",
                        margin:"0 3px",
                        verticalAlign:"middle",
                        display:"inline-block",
                        lineHeight:1,
                      }}>﴿{v.n}﴾</span>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Légende tajweed masquable */}
      {mode==="text"&&<TajweedLegend effectiveTjc={effectiveTjc}/>}
    </div>
  );
}

// CSS builder
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
*{box-sizing:border-box;}html{overflow-x:hidden;max-width:100vw;}body{overflow-x:hidden;}
body{background:${bg};color:${t.tx};font-family:'DM Sans',sans-serif;min-height:100vh;min-height:100dvh;padding-bottom:80px;transition:background .4s,color .4s;padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right);}
:root{--sat:env(safe-area-inset-top);--sab:env(safe-area-inset-bottom);--sal:env(safe-area-inset-left);--sar:env(safe-area-inset-right);}
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
${ramadan?`body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:radial-gradient(circle,${acc}33 1px,transparent 1px);background-size:30px 30px;opacity:.4;}`:""}
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
/* ── Topbar ── */
.topbar{position:sticky;top:0;z-index:60;background:${t.navBg};border-bottom:1px solid ${t.b1};backdrop-filter:blur(16px);overflow:hidden;}
.tb{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:52px;padding:0 12px;padding-left:max(12px,env(safe-area-inset-left));padding-right:max(12px,env(safe-area-inset-right));gap:8px;}
.logo{display:flex;align-items:baseline;gap:6px;flex-shrink:0;white-space:nowrap;min-width:0;}
.logo-h{font-family:'Amiri',serif;font-size:1.3rem;color:${acc};text-shadow:0 0 20px ${acc}44;white-space:nowrap;}
.logo-ar{font-family:'Amiri Quran',serif;font-size:1rem;color:${acc2};white-space:nowrap;}
.logo-sub{font-size:.5rem;color:${t.tx3};letter-spacing:2px;text-transform:uppercase;white-space:nowrap;}
.tb-r{display:flex;gap:5px;align-items:center;flex-shrink:0;}
.ib{background:transparent;border:1px solid ${t.b2};color:${t.tx2};padding:5px 10px;border-radius:8px;font-size:.68rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:4px;}
.ib:hover{border-color:${acc};color:${acc};}
.ib.pri{background:${acc};border-color:${acc};color:#fff;font-weight:600;}
/* ── Hero ── */
.hero{background:${hero};border-bottom:1px solid ${t.b1};padding:16px 16px 14px;padding-left:max(16px,env(safe-area-inset-left));padding-right:max(16px,env(safe-area-inset-right));position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 10% 50%,${acc}08 0%,transparent 60%),radial-gradient(ellipse at 90% 50%,${acc}08 0%,transparent 60%);pointer-events:none;}
.hero-i{max-width:1200px;margin:0 auto;position:relative;}
/* ── Bottom nav ── */
.bnav{position:fixed;bottom:0;left:0;right:0;z-index:60;background:${t.navBg}ee;border-top:1px solid ${t.b1};display:flex;align-items:stretch;height:calc(62px + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom);backdrop-filter:blur(16px);}
.bn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:none;background:transparent;color:${t.tx3};font-size:.58rem;font-weight:500;cursor:pointer;transition:all .25s;padding:6px 2px;position:relative;}
.bn:hover{color:${t.tx2};transform:translateY(-2px);}
.bn.on{color:${acc};}
.bn.on::after{content:'';position:absolute;top:0;left:20%;right:20%;height:2px;background:linear-gradient(90deg,${acc},${acc2});border-radius:0 0 99px 99px;box-shadow:0 0 6px ${acc};}
.bn-lbl{font-size:.52rem;font-weight:500;}
/* ── Layout ── */
.wrap{max-width:1200px;margin:0 auto;padding:14px 16px calc(120px + env(safe-area-inset-bottom));padding-left:max(16px,env(safe-area-inset-left));padding-right:max(16px,env(safe-area-inset-right));width:100%;box-sizing:border-box;overflow-x:hidden;}
.two{display:grid;grid-template-columns:300px 1fr;gap:12px;align-items:start;}
/* ── Cards — hover effect ── */
.card{background:${t.cardBg};border:1px solid ${t.b1};border-radius:14px;overflow:hidden;transition:box-shadow .25s,border-color .25s;}
.card:hover{box-shadow:0 4px 24px ${acc}18;border-color:${acc}44;}
.ch{padding:10px 14px;border-bottom:1px solid ${t.b1};display:flex;align-items:center;justify-content:space-between;}
.ct{font-size:.63rem;text-transform:uppercase;letter-spacing:1.5px;color:${t.tx3};font-weight:600;}
/* ── Left panel ── */
.lp{display:flex;flex-direction:column;max-height:calc(100vh - 200px);max-height:calc(100dvh - 200px);position:sticky;top:58px;}
.ltabs{display:flex;border-bottom:1px solid ${t.b1};}
.lt{flex:1;padding:9px 4px;border:none;background:transparent;color:${t.tx2};font-size:.68rem;font-weight:500;border-bottom:2px solid transparent;cursor:pointer;transition:all .15s;}
.lt:hover{color:${t.tx};}.lt.on{color:${acc};border-bottom-color:${acc};}
.sbox{padding:8px;}
.sinp{width:100%;background:${t.inputBg};border:1px solid ${t.b2};border-radius:8px;padding:7px 10px;color:${t.tx};font-size:.76rem;outline:none;transition:border-color .2s;}
.sinp:focus{border-color:${acc};}.sinp::placeholder{color:${t.tx3};}
.slist{flex:1;overflow-y:auto;}
/* ── Surah rows — hover ── */
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
/* ── Juz grid ── */
.jg{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:7px;}
.jc{background:${t.s2};border:1px solid ${t.b1};border-radius:7px;padding:6px 3px;text-align:center;cursor:pointer;transition:all .2s;}
.jc:hover{border-color:${acc};transform:translateY(-2px);box-shadow:0 4px 12px ${acc}22;}
.jc.sel{border-color:${acc};background:${t.s3};}
.jn{font-family:'Amiri',serif;font-size:1.2rem;color:${acc};line-height:1;}
.jl{font-size:.48rem;color:${t.tx3};text-transform:uppercase;}
.jb{height:3px;background:${t.b1};border-radius:99px;overflow:hidden;margin-top:3px;}
.jf{height:100%;background:${t.gr};border-radius:99px;}
/* ── Verse viewer ── */
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
.vscroll{max-height:calc(100vh - 380px);max-height:calc(100dvh - 380px);overflow-y:auto;}
/* ── Verse items — hover ── */
.vitem{padding:12px 14px;border-bottom:1px solid ${t.b1};transition:background .15s,transform .15s;animation:fadeIn .3s ease;}
.vitem:hover{background:${t.s2};transform:translateX(2px);}
.vitem.mem{background:${t.grD};border-left:3px solid ${t.gr};animation:memGlow .6s ease;}
.vitem.pl{background:rgba(201,168,76,.08);border-left:3px solid ${acc};position:relative;}
.vitem.pl::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,${acc2},${acc},${acc2});animation:pulse .9s ease infinite;}
.vitem.due{border-left:3px solid ${t.rd};background:rgba(239,68,68,.05);}
/* ── Immersive ── */
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
/* ── Stats ── */
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
/* ── Khatma ── */
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
/* ── Settings ── */
.settings-wrap{display:flex;flex-direction:column;gap:14px;max-width:600px;margin:0 auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;}
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
/* ── Modal ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);}
.modal{background:${t.s1};border:1px solid ${acc};border-radius:18px;padding:26px;max-width:380px;width:92%;}
.modal h2{font-family:'Amiri',serif;font-size:1.7rem;color:${acc};margin-bottom:5px;}
.modal p{font-size:.76rem;color:${t.tx2};line-height:1.65;margin-bottom:18px;}
.modal label{display:block;font-size:.64rem;color:${t.tx3};text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
.modal input{width:100%;background:${t.inputBg};border:1px solid ${t.b2};border-radius:8px;padding:8px 12px;color:${t.tx};font-size:.85rem;margin-bottom:10px;outline:none;transition:border-color .2s;}
.modal input:focus{border-color:${acc};}
.mbtn{width:100%;padding:11px;background:${acc};border:none;border-radius:8px;color:#fff;font-size:.85rem;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;}
.mbtn:hover{opacity:.92;transform:translateY(-1px);}
/* ── Hourglass KPI ── */
.hg-kpi{display:flex;align-items:center;gap:8px;padding:8px 12px;background:${t.s2};border-radius:12px;border:1px solid ${t.b1};transition:all .2s;cursor:default;}
.hg-kpi:hover{border-color:${acc}44;background:${t.s3};transform:translateY(-2px);box-shadow:0 4px 16px ${acc}18;}
.hg-kpi-v{font-size:1.1rem;font-weight:800;color:${acc};line-height:1;font-variant-numeric:tabular-nums;}
.hg-kpi-l{font-size:.48rem;color:${t.tx3};text-transform:uppercase;letter-spacing:1.5px;margin-top:1px;}
/* ── Badge cards ── */
.badge-card{padding:12px;border-radius:12px;text-align:center;transition:all .25s;}
.badge-card:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 8px 24px rgba(0,0,0,.15);}
/* ── Misc ── */
.empty{text-align:center;padding:36px 14px;color:${t.tx3};font-size:.8rem;}
.big-ar{font-family:${arFont};font-size:2rem;color:${acc};margin-bottom:8px;}
@media(max-width:860px){
  .two{grid-template-columns:1fr;}.rp,.lp{position:static;max-height:none;}.vscroll{max-height:none;}
  .sg{grid-template-columns:repeat(2,1fr);}.two-h{grid-template-columns:1fr;}
}
@media(max-width:480px){
  .logo-ar{display:none;}
  .logo-sub{display:none;}
  .logo-h{font-size:1.2rem;}
  .wrap{padding-bottom:calc(130px + env(safe-area-inset-bottom));}
}
`;}

// Main App
export default function App() {
  const [tn,setTn]=useState(()=>ld("qtheme2","light")); // qtheme2 = new key with new themes
  const t=THEMES[tn]||THEMES.dark;
  const tjc=(tn==="light")?TJC_LIGHT:TJC_DARK; // dark for all dark-bg themes
  const [fontId,setFontId]=useState(()=>ld("qfont","amiri-quran"));
  const arFont=(FONTS.find(f=>f.id===fontId)||FONTS[0]).css;
  const [mem,setMem]=useState(()=>ld("qmem6",{}));
  const [settings,setSettings]=useState(()=>ld("qset6",null));
  const [hist,setHist]=useState(()=>ld("qhist6",{}));
  const [setup,setSetup]=useState(()=>!ld("qset6",null));
const [user, setUser] = useState(null);
const [authReady, setAuthReady] = useState(false);

  // iOS viewport-fit=cover + PWA setup
  useEffect(()=>{
    // viewport-fit for iPhone notch
    const meta=document.querySelector('meta[name="viewport"]');
    if(meta&&!meta.content.includes('viewport-fit')){
      meta.content=meta.content+', viewport-fit=cover';
    }
    // PWA manifest link
    if(!document.querySelector('link[rel="manifest"]')){
      const link=document.createElement('link');
      link.rel='manifest';
      link.href='/manifest.json';
      document.head.appendChild(link);
    }
    // Apple PWA meta tags
    const appleItems=[
      {name:'apple-mobile-web-app-capable',content:'yes'},
      {name:'apple-mobile-web-app-status-bar-style',content:'black-translucent'},
      {name:'apple-mobile-web-app-title',content:'Al-Hifz'},
      {name:'theme-color',content:'#050f08'},
    ];
    appleItems.forEach(({name,content})=>{
      if(!document.querySelector(`meta[name="${name}"]`)){
        const m=document.createElement('meta');
        m.name=name;m.content=content;
        document.head.appendChild(m);
      }
    });
  },[]);
const [authPage, setAuthPage] = useState("login");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [authLoading, setAuthLoading] = useState(false);
const [authError, setAuthError] = useState("");
 const [page,setPage]=useState("home");
  const [pageTransition,setPageTransition]=useState(false);
  const [ltab,setLtab]=useState("list");
  const [selS,setSelS]=useState(null);
  const [selJuz,setSelJuz]=useState(null);
  const [search,setSearch]=useState("");
  const [showTr,setShowTr]=useState(false);
  const [showTj,setShowTj]=useState(false);
  const [showTf,setShowTf]=useState(false);
  const [versetDuJourDismissed,setVersetDuJourDismissed]=useState(()=>ld("qvdjdis","")===today());
  const [showPage,setShowPage]=useState(false);
  const [mushafPage,setMushafPage]=useState(null);
  const [mushafSurahModal,setMushafSurahModal]=useState(false);
  const [mushafSurahSearch,setMushafSurahSearch]=useState("");
  const [rec,setRec]=useState(RECITERS[0]);
  const [playing,setPlaying]=useState(null);
  const [audioPlaying,setAudioPlaying]=useState(false); // état réactif pour l'UI
  const [audioPct,setAudioPct]=useState(0);
  // Tilawa (تلاوة — lecture guidée)
  const [karaokeMode,setKaraokeMode]=useState(false);
  const [wordTimings,setWordTimings]=useState({}); // {sn_vn: [{text,start,end}]}
  const [activeWordIdx,setActiveWordIdx]=useState(-1);
  const karaokeRaf=useRef(null);
  const [khatmas,setKhatmas]=useState(()=>ld("qkhatmas",[]));
  const [activeKhatma,setActiveKhatma]=useState(()=>ld("qakthatma",null));
  const [kPreset,setKPreset]=useState(null);
  const [kCustomDays,setKCustomDays]=useState("30");
  const [kName,setKName]=useState("Ma Khatma");
  // Khatma collective
  const [collectiveKhatmas,setCollectiveKhatmas]=useState(()=>ld("qcolkhatmas",[]));
  const [showCollective,setShowCollective]=useState(false);
  const [newColKhatmaName,setNewColKhatmaName]=useState("Notre Khatma");
  const [joinCode,setJoinCode]=useState("");
  const [activeColKhatma,setActiveColKhatma]=useState(()=>ld("qactcolkhatma",null));
  const [goal,setGoal]=useState("5");
  const [baselineInput,setBaselineInput]=useState("0"); // versets déjà connus à l'inscription
  const [startDate,setStartDate]=useState(new Date().toISOString().split("T")[0]);
  const [arabicSize,setArabicSize]=useState(()=>ld("qasize",1.65));
  const [loopCount,setLoopCount]=useState(3);
  const [loopCurrent,setLoopCurrent]=useState(0);
  const [loopInfinite,setLoopInfinite]=useState(false);
  const [reviewMode,setReviewMode]=useState(false);
  const [hifzMode,setHifzMode]=useState(false);
  const [hifzLevel,setHifzLevel]=useState({});
  // Reconnaissance vocale
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
  // SM-2: {key: {interval, repetitions, ef, nextDate, lastDate}}
  // ef = easiness factor (2.5 default), interval en jours
  const [badges,setBadges]=useState(()=>ld("qbadges",[]));
  const [badgePopup,setBadgePopup]=useState(null); // {id, icon, label}
  const [autoNight,setAutoNight]=useState(()=>ld("qautonight",false));
  // Stats Tarteel-style
  const [engagementTime,setEngagementTime]=useState(()=>ld("qengtime",0)); // secondes totales
  const [recitTime,setRecitTime]=useState(()=>ld("qrecittime",0)); // secondes récitation
  const [versesRecited,setVersesRecited]=useState(()=>ld("qvrecited",0));
  const sessionStartRef=useRef(Date.now());
  const lastEngRef=useRef(Date.now());
  // Messages d'encouragement pages lues
  const [encouragementMsg,setEncouragementMsg]=useState(null);
  const [playbackRate,setPlaybackRate]=useState(1);
  const [favorites,setFavorites]=useState(()=>ld("qfavs",[]));
  const [notes,setNotes]=useState(()=>ld("qnotes",{}));
  const [lists,setLists]=useState(()=>ld("qlists",[]));
  const [editingNote,setEditingNote]=useState(null);
  const [noteText,setNoteText]=useState("");
  const [shareVerse,setShareVerse]=useState(null);
 const wbwVerseRef=useRef(null);
const [wbwOpen,setWbwOpen]=useState(false);
const [wbwWords,setWbwWords]=useState(null);
// Lecture partielle
const [partialVerse,setPartialVerse]=useState(null); // {sn,vn,words:[],from:0,to:N}
const partialPlayRef=useRef(null); // {stopAt: ratio 0-1}
  const [newListName,setNewListName]=useState("");
  const [selList,setSelList]=useState(null);
  const [mushafFullscreen,setMushafFullscreen]=useState(false);
  const [mushafEdition,setMushafEdition]=useState("hafs");
  const [immersive,setImmersive]=useState(false);
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
  // Streak

  // Quiz
  const [quizOpen,setQuizOpen]=useState(false);
  const [quizMode,setQuizMode]=useState("surah"); // "surah" | "complete"
  const [quizFilter,setQuizFilter]=useState("memorized"); // "memorized" | "all" | surah number
  const [quizFilterSurah,setQuizFilterSurah]=useState(null); // sourate spécifique
  const [quizQ,setQuizQ]=useState(null);
  const [quizChoices,setQuizChoices]=useState([]);
  const [quizAnswer,setQuizAnswer]=useState(null);
  const [quizScore,setQuizScore]=useState({correct:0,total:0,wrongs:[]});
  const [quizShowWrong,setQuizShowWrong]=useState(null); // affiche le détail d'une erreur
  // Notifications
  const [notifEnabled,setNotifEnabled]=useState(()=>ld("qnotif",false));
  const [notifHour,setNotifHour]=useState(()=>ld("qnotifhour","08:00"));
  // Mushaf audio
  const [mushafAudioActive,setMushafAudioActive]=useState(false);
  const [timerOpen,setTimerOpen]=useState(false);
  const [timerDuration,setTimerDuration]=useState(20);
  const [timerLeft,setTimerLeft]=useState(null);
  const [timerRunning,setTimerRunning]=useState(false);
  const timerRef=useRef(null);
  const [isOffline,setIsOffline]=useState(()=>!navigator.onLine);
  const [showInstallBanner,setShowInstallBanner]=useState(false);
  const installPromptRef=useRef(null);
  // Plan IA
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
  const [swipeState,setSwipeState]=useState({});
  const swipeTouchStart=useRef({});
  const [verses,setVerses]=useState([]);
  const [loadState,setLoadState]=useState("idle");
  const audioRef=useRef(null);
  const preloadRef=useRef(new Audio()); // préchargement du verset suivant
  const vpRef=useRef(null);

  // Persist
  useEffect(()=>sv("qreadhist",readHistory),[readHistory]);
  useEffect(()=>sv("qbookmark",bookmark),[bookmark]);
  useEffect(()=>sv("qspaced",spaced),[spaced]);
  useEffect(()=>sv("qbadges",badges),[badges]);
  useEffect(()=>sv("qengtime",engagementTime),[engagementTime]);
  useEffect(()=>sv("qrecittime",recitTime),[recitTime]);
  useEffect(()=>sv("qvrecited",versesRecited),[versesRecited]);
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
  useEffect(()=>sv("qcolkhatmas",collectiveKhatmas),[collectiveKhatmas]);
  useEffect(()=>sv("qactcolkhatma",activeColKhatma),[activeColKhatma]);
  useEffect(()=>sv("qramadan",ramadanTheme),[ramadanTheme]);
  useEffect(()=>sv("qpages",pageRead),[pageRead]);
  useEffect(()=>sv("qrevflags",revFlags),[revFlags]);
  useEffect(()=>sv("qrevsessions",revSessions),[revSessions]);
const loadProgress=useCallback(async(uid)=>{
  const{data}=await supabase.from('user_progress').select('*').eq('user_id',uid).single();
  if(data){
    if(data.mem)setMem(data.mem);
    if(data.favs)setFavorites(data.favs);
    if(data.notes)setNotes(data.notes);
    if(data.spaced)setSpaced(data.spaced);
  }
},[]);

const saveProgress=useCallback(async(uid,newMem,newFavs,newNotes,newSpaced)=>{
  await supabase.from('user_progress').upsert({
    user_id:uid,
    mem:newMem,
    favs:newFavs,
    notes:newNotes,
    spaced:newSpaced,
    updated_at:new Date().toISOString()
  },{onConflict:'user_id'});
},[]);

useEffect(()=>{
  supabase.auth.getSession().then(({data:{session}})=>{
    const u=session?.user??null;
    setUser(u);
    if(u)loadProgress(u.id);
    setAuthReady(true);
  });
  const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
    setUser(session?.user??null);
  });
  return ()=>subscription.unsubscribe();

},[]);
useEffect(()=>{
  if(user&&authReady)saveProgress(user.id,mem,favorites,notes,spaced);
},[mem,favorites,notes,spaced]);
const handleLogin=async()=>{
  setAuthLoading(true);setAuthError("");
  const{error}=await supabase.auth.signInWithPassword({email,password});
  if(error)setAuthError(error.message);
  setAuthLoading(false);
};
const handleSignup=async()=>{
  setAuthLoading(true);setAuthError("");
  const{error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:"https://alhifz.vercel.app"}});
  if(error)setAuthError(error.message);
  else setAuthError("Vérifie ton email pour confirmer ton compte ✓");
  setAuthLoading(false);
};
const handleReset=async()=>{
  if(!email){setAuthError("Entre ton email d'abord");return;}
  setAuthLoading(true);setAuthError("");
  const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:"https://alhifz.vercel.app"});
  if(error)setAuthError(error.message);
  else setAuthError("Email envoyé ! Vérifie ta boîte mail ✓");
  setAuthLoading(false);
};
  useEffect(()=>{
    const t=setTimeout(()=>setSplash(false),2200);
    // Migrate: clear old qv3 cache entries (had wrong tajweed data)
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
  useEffect(()=>{if(!autoNight)return;const h=new Date().getHours();if(h>=20||h<7)setTn("emerald");else setTn("light");},[autoNight]);
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
    // Versets mémorisés APRÈS l'inscription (hors baseline déclaré)
    const earnedMem=Math.max(0,totalMem-baseline);
    // Rythme réel = nouveaux versets / jours depuis début
    // Si earnedMem=0 on utilise l'objectif défini dans les réglages
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

  // hourglass pct: 0=début(plein), 1=fin(vide)
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
    setVersesRecited(p=>p+1);
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



  // Auto-scroll + chargement Tilawa
  useEffect(()=>{
    if(playing===null){
      setActiveWordIdx(-1);
      if(karaokeRaf.current){cancelAnimationFrame(karaokeRaf.current);karaokeRaf.current=null;}
      return;
    }
    // Auto-scroll
    const el=document.getElementById(`v-${selS?.n}-${playing}`);
    if(el){
      const scroller=el.closest(".vscroll");
      if(scroller){
        const elRect=el.getBoundingClientRect();
        const boxRect=scroller.getBoundingClientRect();
        scroller.scrollBy({top:elRect.top-boxRect.top-boxRect.height/3,behavior:"smooth"});
      } else el.scrollIntoView({behavior:"smooth",block:"center"});
    }
    // Tilawa — charger les mots et lancer le RAF
    if(karaokeMode&&selS){
      loadWordTimings(selS.n,playing).then(words=>{
        const audio=audioRef.current;
        if(words.length&&audio){
          // Attendre que la durée soit connue
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

  // Tracking temps d'engagement — toutes les 30s
  useEffect(()=>{
    const interval=setInterval(()=>{
      const now=Date.now();
      const delta=Math.round((now-lastEngRef.current)/1000);
      if(delta>0&&delta<120){ // max 2min par tick pour éviter les faux positifs (écran éteint)
        setEngagementTime(p=>p+delta);
      }
      lastEngRef.current=now;
    },30000);
    return()=>clearInterval(interval);
  },[]);

  // Tracking temps de récitation audio
  useEffect(()=>{
    if(!audioPlaying)return;
    const interval=setInterval(()=>{
      setRecitTime(p=>p+1);
    },1000);
    return()=>clearInterval(interval);
  },[audioPlaying]);

  // Badge popup + messages encouragement pages
  useEffect(()=>{
    const newBadges=[];const completedSurahs=SURAHS.filter(s=>sMem(s)===s.v);
    const add=(id,cond)=>{if(cond&&!badges.includes(id))newBadges.push(id);};
    add("first_surah",completedSurahs.length>=1);add("three_surahs",completedSurahs.length>=3);add("five_surahs",completedSurahs.length>=5);add("ten_surahs",completedSurahs.length>=10);add("twenty_surahs",completedSurahs.length>=20);
    add("50_verses",totalMem>=50);add("100_verses",totalMem>=100);add("500_verses",totalMem>=500);add("1000_verses",totalMem>=1000);
    add("juz30",SURAHS.filter(s=>s.juz===30).every(s=>sMem(s)===s.v));add("juz29",SURAHS.filter(s=>s.juz===29).every(s=>sMem(s)===s.v));
    add("fatiha",sMem(SURAHS[0])===SURAHS[0].v);add("ikhlas",sMem(SURAHS[111])===SURAHS[111].v);
    add("streak_3",memStreak>=3);add("streak_7",memStreak>=7);add("streak_30",memStreak>=30);
    if(newBadges.length>0){
      setBadges(p=>[...p,...newBadges]);
      const bd=BADGE_DEFS.find(b=>b.id===newBadges[0]);
      if(bd){setBadgePopup(bd);setTimeout(()=>setBadgePopup(null),4000);}
    }
  },[mem,memStreak]);

  // Messages d'encouragement quand on lit des pages (Khatma)
  useEffect(()=>{
    const pagesRead=Object.keys(pageRead).filter(k=>pageRead[k]).length;
    const milestones=[5,10,20,50,100,200,300,400,500,604];
    const msgs={
      5:"MashaAllah ! 5 pages lues 🌱 Le voyage commence",
      10:"10 pages ! بارك الله فيك — continue ainsi",
      20:"20 pages déjà ! Tu construis une belle habitude 📖",
      50:"50 pages ! Mi-chemin du premier juz. اللهم بارك",
      100:"100 pages ! Sous-hân Allah — tu avances avec constance 🌟",
      200:"200 pages ! Un tiers du Coran lu. La baraka est avec toi 🤲",
      300:"300 pages — la moitié du Coran ! Quel honneur 🌙",
      400:"400 pages lues ! Persévérance et dévotion. جزاك الله خيرا",
      500:"500 pages ! Tu approches de la Khatma complète 👑",
      604:"🎉 Khatma complète ! بارك الله فيك — ختمت القرآن الكريم",
    };
    if(milestones.includes(pagesRead)&&msgs[pagesRead]){
      const key=`enc_${pagesRead}`;
      if(!ld(key,false)){
        setEncouragementMsg({pages:pagesRead,msg:msgs[pagesRead]});
        sv(key,true);
        setTimeout(()=>setEncouragementMsg(null),5000);
      }
    }
  },[pageRead]);

  // SM-2 — calcule quels versets sont dus aujourd'hui
  const sm2Due=useMemo(()=>{
    const today2=new Date().toISOString().split("T")[0];
    return Object.entries(spaced).filter(([k,v])=>{
      if(!v.nextDate) return false;
      return v.nextDate<=today2;
    }).map(([k])=>k);
  },[spaced]);
  const spacedDue=sm2Due; // alias pour compatibilité

  // SM-2 update function
  const sm2Update=(sn,vn,quality)=>{
    // quality: 0=blackout, 1=wrong, 2=hard, 3=ok, 4=good, 5=perfect
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
      // Update EF: EF' = EF + (0.1 - (5-q)*(0.08+(5-q)*0.02))
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
  // markSpaced: garde compatibilité, utilise SM-2 quality=4 (good)
  const markSpaced=(sn,vn,quality=4)=>sm2Update(sn,vn,quality);

  // Hifz helper: masque progressivement les mots d'un verset
  const getHifzText=(text,level)=>{
    if(!level||level===0)return text;
    const clean=(text||"").replace(/<[^>]*>/g,"");
    const words=clean.split(" ").filter(w=>w.trim());
    const total=words.length;
    const hiddenCount=Math.round(total*(level/5));
    const indices=new Set();
    // Cacher depuis la fin progressivement
    for(let i=total-1;i>=total-hiddenCount;i--)indices.add(i);
    return words.map((w,i)=>indices.has(i)?<span key={i} style={{background:"#1a1a1a",color:"#1a1a1a",borderRadius:3,cursor:"pointer",userSelect:"none",transition:"all .2s"}} onClick={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="inherit";}}>{"█".repeat(Math.max(2,Math.round(w.length*0.8)))}</span>:<span key={i}>{w} </span>);
  };

  // FIX 1: doSelect — scroll uniquement sur mobile (<860px) — corrige le "saut" de page
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

  const toggleV=(sn,vn,verseAr="")=>{
    const k=String(sn),vk=String(vn);
    const isNew=!(mem[k]||{})[vk];
    if(isNew)updateStreak();
    setMem(p=>{
    const c={...p[k]||{}};
    const wasMemorized=!!c[vk];
    if(wasMemorized) delete c[vk];
    else {
      c[vk]=true;
      // Déclencher l'animation calligraphique
      if(verseAr){
        const clean=verseAr.replace(/<[^>]*>/g,"").slice(0,60);
        setCalligAnim(clean);
        setTimeout(()=>setCalligAnim(null),2000);
      }
    }
    return{...p,[k]:c};
  });
  };
  const toggleAll=s=>{const k=String(s.n),done=sMem(s)===s.v;setMem(p=>{if(done){const n={...p};delete n[k];return n;}const a={};for(let i=1;i<=s.v;i++)a[String(i)]=true;return{...p,[k]:a};});};

  const doPlay=vn=>{
    if(!selS||!audioRef.current)return;
    const audio=audioRef.current;
    // Toggle pause/play si même verset
    if(playing===vn){
      if(!audio.paused){audio.pause();} 
      else{audio.play().catch(()=>{});}
      return;
    }
    // Nouveau verset — vérifier si préchargé
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
      // fallback cdn
      audio.src=`https://cdn.islamic.network/quran/audio/128/${rec.id}/${String(selS.n).padStart(3,"0")}${String(vn).padStart(3,"0")}.mp3`;
      audio.load();
      audio.play().catch(()=>setPlaying(null));
    });
  };

  // Moteur audio unifié — préchargement + zéro latence
  // Charge le tafsir Ibn Kathir (FR) — 3 sources en cascade
  const tafsirLoadingRef=useRef({});
  const loadTafsir=useCallback(async(sn,vn)=>{
    const key=`${sn}_${vn}`;
    if(tafsirLoadingRef.current[key]||tafsirData[key]) return;
    tafsirLoadingRef.current[key]=true;
    setTafsirLoading(p=>({...p,[key]:true}));
    const done=(text)=>{
      setTafsirData(p=>({...p,[key]:text}));
      setTafsirLoading(p=>({...p,[key]:false}));
      tafsirLoadingRef.current[key]=false;
    };
    const clean=(s)=>s.replace(/<[^>]*>/g,"").replace(/&amp;/g,"&").replace(/&nbsp;/g," ").replace(/&#\d+;/g,"").replace(/\s+/g," ").trim();

    // Source 1 : quran.com API — essayer plusieurs IDs tafsir FR
    for(const tid of [31,169,817]){
      try{
        const r=await fetch(`https://api.quran.com/api/v4/tafsirs/${tid}/by_ayah/${sn}:${vn}`,{headers:{"Accept":"application/json"}});
        if(r.ok){
          const d=await r.json();
          const raw=d?.tafsir?.text||d?.data?.text||"";
          const text=clean(raw);
          if(text.length>40){done(text.slice(0,1000));return;}
        }
      }catch{}
    }
    // Source 2 : raw GitHub spa5k (pas de cache CDN)
    try{
      const r=await fetch(`https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/fr-tafsir-ibn-kathir/${sn}/${vn}.json`);
      if(r.ok){
        const d=await r.json();
        const text=clean(d?.text||d?.tafsir||"");
        if(text.length>40){done(text.slice(0,1000));return;}
      }
    }catch{}
    // Source 3 : API alquran.cloud — tafsir jalalayn FR (bon fallback)
    try{
      const r=await fetch(`https://api.alquran.cloud/v1/ayah/${sn}:${vn}/fr.jalalayn`);
      if(r.ok){
        const d=await r.json();
        const text=clean(d?.data?.text||"");
        if(text.length>20){done("Jalâlayn : "+text.slice(0,800));return;}
      }
    }catch{}
    done("Tafsir non disponible hors ligne pour ce verset.");
  },[tafsirData]);

  const buildUrl=(sn,vn)=>{
    const s=String(sn).padStart(3,"0");const v=String(vn).padStart(3,"0");
    return `https://everyayah.com/data/${rec.everyayah||"Alafasy_128kbps"}/${s}${v}.mp3`;
  };

  // Charge les timestamps par mot pour la Tilawa
  const loadWordTimings=useCallback(async(sn,vn)=>{
    const key=`${sn}_${vn}`;
    if(wordTimings[key])return wordTimings[key];
    try{
      const r=await fetch(`https://api.qurancdn.com/api/qdc/verses/by_chapter/${sn}?verse_number=${vn}&words=true&word_fields=audio_url,location,text_uthmani&per_page=1`);
      const d=await r.json();
      const words=(d.verses?.[0]?.words||[])
        .filter(w=>w.char_type_name==="word")
        .map((w,i)=>({text:w.text_uthmani||w.text||"",idx:i}));
      // Les timestamps exacts nécessitent l'audio — on utilise une estimation
      // basée sur la durée totale divisée par le nombre de mots (suffisant pour le highlight)
      setWordTimings(p=>({...p,[key]:words}));
      return words;
    }catch{return[];}
  },[wordTimings]);

  // RAF loop pour le highlight Tilawa (basé sur currentTime)
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

  // Précharge le verset N+1 dès que N commence à jouer
  useEffect(()=>{
    if(!playlistActive||playing===null)return;
    const curIdx=playlist.findIndex(p=>p.vn===playing);
    if(curIdx<0||curIdx>=playlist.length-1)return;
    const next=playlist[curIdx+1];
    const pre=preloadRef.current;
    const url=buildUrl(next.sn,next.vn);
    if(pre.src!==url){pre.src=url;pre.load();}
  },[playing,playlistActive,playlist,rec]);

  // handleEnded unifié — playlist prioritaire, sinon loop
  useEffect(()=>{
    const audio=audioRef.current;
    if(!audio)return;
    const handleEnded=()=>{
      // Mode playlist
      if(playlistActive){
        const curIdx=playlist.findIndex(p=>p.vn===playing);
        if(curIdx>=0&&curIdx<playlist.length-1){
          const next=playlist[curIdx+1];
          const pre=preloadRef.current;
          const url=buildUrl(next.sn,next.vn);
          // Swap instantané si déjà préchargé, sinon chargement normal
          if(pre.src===url&&pre.readyState>=2){
            // l'audio préchargé est prêt — on le bascule directement
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
          // fin de la playlist
          setPlaylistActive(false);
          setPlaying(null);
          setAudioPlaying(false);
          setAudioPct(0);
        }
        return;
      }
      // Mode loop verset unique
      if(loopInfinite||(loopCount>1&&loopCurrent<loopCount)){
        if(!loopInfinite)setLoopCurrent(p=>p+1);
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
  // dépendances minimales pour éviter les ré-attachements inutiles
  },[playlistActive,playlist,playing,loopCount,loopCurrent,loopInfinite,rec]);

  // Chargement versets — TOUJOURS depuis l'API pour avoir le tajweed HTML correct
  // Q[s.n] utilisé uniquement comme fallback traduction hors ligne
  useEffect(()=>{
    if(!selS){setVerses([]);setLoadState("idle");return;}
    const cacheKey=`qv5_${selS.n}`; // v4 = tajweed HTML + traduction fusionnée
    // Check cache first
    try{
      const cached=localStorage.getItem(cacheKey);
      if(cached){setVerses(JSON.parse(cached));setLoadState("done");return;}
    }catch{}
    setVerses([]);setLoadState("loading");
    // Fetch tajweed Arabic + French translation in parallel
    const arFetch=fetch(`https://api.qurancdn.com/api/qdc/verses/by_chapter/${selS.n}?language=fr&words=false&per_page=300&fields=text_uthmani_tajweed,text_uthmani,translations&translations=31`)
      .then(r=>r.json());
    const frFetch=fetch(`https://api.alquran.cloud/v1/surah/${selS.n}/fr.hamidullah`)
      .then(r=>r.json()).catch(()=>({data:{ayahs:[]}}));
    Promise.all([arFetch,frFetch]).then(([arData,frData])=>{
      const arAyahs=arData?.verses||[];
      const frAyahs=frData?.data?.ayahs||[];
      // Local Q fallback for translation
      const localQ=Q[selS.n]||[];
      if(!arAyahs.length){
        // Full offline fallback
        if(localQ.length){setVerses(localQ);setLoadState("done");}
        else setLoadState("error");
        return;
      }
      const result=arAyahs.map((a,i)=>({
        n:a.verse_number,
        // tajweed HTML from API — crucial for correct coloring
        ar:a.text_uthmani_tajweed||a.text_uthmani||"",
        // translation: API > local fallback
        fr:(a.translations?.[0]?.text||frAyahs[i]?.text||localQ[i]?.fr||"").replace(/<[^>]*>/g,""),
        tf:localQ[i]?.tf||"",
      }));
      setVerses(result);setLoadState("done");
      try{localStorage.setItem(cacheKey,JSON.stringify(result));}catch{}
    }).catch(()=>{
      // Offline: use local Q data
      if(Q[selS.n]?.length){setVerses(Q[selS.n]);setLoadState("done");}
      else setLoadState("error");
    });
  },[selS]);

  const filtered=useMemo(()=>{const q=search.toLowerCase().trim();if(!q)return SURAHS;return SURAHS.filter(s=>s.name.toLowerCase().includes(q)||s.ar.includes(q)||String(s.n).includes(q));},[search]);
  const juzList=[...new Set(SURAHS.map(s=>s.juz))].sort((a,b)=>a-b);

  // Fonction commune touch + mouse pour le swipe des sourates
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

  // Khatma collective — entièrement locale (partagée via code)
  const generateCode=()=>Math.random().toString(36).substring(2,8).toUpperCase();
  const createCollectiveKhatma=()=>{
    const code=generateCode();
    const myName=(user?.email||"Moi").split("@")[0];
    const nk={
      id:Date.now(),code,name:newColKhatmaName,
      createdAt:today(),
      members:[{name:myName,uid:user?.id||"local",juzDone:[],lastSeen:today()}],
      totalJuz:30,
    };
    setCollectiveKhatmas(p=>[...p,nk]);
    setActiveColKhatma(nk);
    setShowCollective(false);
  };
  const joinCollectiveKhatma=()=>{
    const found=collectiveKhatmas.find(k=>k.code===joinCode.trim().toUpperCase());
    if(!found){alert("Code introuvable. Vérifie le code avec ton groupe.");return;}
    const myName=(user?.email||"Moi").split("@")[0];
    const alreadyIn=found.members.some(m=>m.uid===(user?.id||"local"));
    if(!alreadyIn){
      const updated={...found,members:[...found.members,{name:myName,uid:user?.id||"local",juzDone:[],lastSeen:today()}]};
      setCollectiveKhatmas(p=>p.map(k=>k.id===found.id?updated:k));
      setActiveColKhatma(updated);
    } else {
      setActiveColKhatma(found);
    }
    setJoinCode("");setShowCollective(false);
  };
  const markColJuz=(juzN)=>{
    if(!activeColKhatma)return;
    const myUid=user?.id||"local";
    const updated={...activeColKhatma,members:activeColKhatma.members.map(m=>{
      if(m.uid!==myUid)return m;
      const done=m.juzDone.includes(juzN)?m.juzDone.filter(j=>j!==juzN):[...m.juzDone,juzN];
      return{...m,juzDone:done,lastSeen:today()};
    })};
    setCollectiveKhatmas(p=>p.map(k=>k.id===activeColKhatma.id?updated:k));
    setActiveColKhatma(updated);
  };
  const colJuzCovered=activeColKhatma?[...new Set(activeColKhatma.members.flatMap(m=>m.juzDone))]:[];
  const colPct=activeColKhatma?Math.round(colJuzCovered.length/30*100):0;
  const markKhatmaDay=(k,d)=>{const updated={...k,log:{...k.log,[d]:!(k.log[d])}};setKhatmas(p=>p.map(x=>x.id===k.id?updated:x));if(activeKhatma?.id===k.id)setActiveKhatma(updated);};
  const getKhatmaDays=k=>{const days=[];const start=new Date(k.startDate);for(let i=0;i<k.totalDays;i++){const d=new Date(start);d.setDate(d.getDate()+i);days.push(d.toISOString().split("T")[0]);}return days;};
  const khatmaStreak=k=>{const days=getKhatmaDays(k).filter(d=>d<=today()).reverse();let streak=0;for(const d of days){if(k.log[d])streak++;else break;}return streak;};
  const togglePage=p=>setPageRead(prev=>({...prev,[String(p)]:!prev[String(p)]}));
  const goToPage=p=>{
    setMushafPage(p);
    // Si khatma active — mémoriser la dernière page lue
    if(activeKhatma){
      const updated={...activeKhatma,lastPage:p};
      setKhatmas(prev=>prev.map(k=>k.id===activeKhatma.id?updated:k));
      setActiveKhatma(updated);
    }
  };
  const toggleFav=(sn,vn,ar,fr,surah)=>{const key=`${sn}_${vn}`;setFavorites(p=>p.find(f=>f.key===key)?p.filter(f=>f.key!==key):[...p,{key,sn,vn,ar,fr,surah}]);};
  const isFav=(sn,vn)=>favorites.some(f=>f.key===`${sn}_${vn}`);
  const saveNote=(sn,vn,text)=>{const k=`${sn}_${vn}`;if(text.trim())setNotes(p=>({...p,[k]:text.trim()}));else setNotes(p=>{const n={...p};delete n[k];return n;});setEditingNote(null);};
  // Génération plan mémorisation via Anthropic API
  const generateAIPlan=async()=>{
    setAiPlanLoading(true);setAiPlanResult("");
    await new Promise(r=>setTimeout(r,800));
    const goalVerses={juz30:564,juz29:1127,halfquran:3118,fullquran:6236};
    const goalLabels={juz30:"Juz 30 (37 sourates — 564 versets)",juz29:"Juz 29-30 (1127 versets)",halfquran:"Demi-Coran (3118 versets)",fullquran:"Coran complet (6236 versets)"};
    const remaining=Math.max(0,(goalVerses[aiPlanParams.goal]||6236)-totalMem);
    const totalDays=parseInt(aiPlanParams.months)*30;
    const vPerDay=Math.ceil(remaining/totalDays);
    const mPerVerse=aiPlanParams.level==="debutant"?8:aiPlanParams.level==="intermediaire"?5:3;
    const timeNeeded=vPerDay*mPerVerse;
    const timeAvail=parseInt(aiPlanParams.dailyTime);
    const feasible=timeNeeded<=timeAvail;
    const adjustedVpd=feasible?vPerDay:Math.max(1,Math.floor(timeAvail/mPerVerse));
    const adjustedMonths=adjustedVpd>0?Math.ceil(remaining/(adjustedVpd*30)):999;
    const completedSurahs=SURAHS.filter(s=>sMem(s)===s.v).map(s=>s.name).join(", ")||"aucune pour l'instant";
    const nextSurahs=aiPlanParams.goal==="juz30"
      ?["An-Naba (40v)","An-Naziat (46v)","Abasa (42v)","At-Takwir (29v)","Al-Infitar (19v)","Al-Mutaffifin (36v)","Al-Inshiqaq (25v)","Al-Buruj (22v)"]
      :aiPlanParams.level==="debutant"
      ?["Al-Fatiha (7v)","Al-Ikhlas (4v)","Al-Falaq (5v)","An-Nas (6v)","Al-Kawthar (3v)","Al-Asr (3v)","Al-Fil (5v)","Al-Humaza (9v)"]
      :["Al-Mulk (30v)","Al-Kahf (110v)","Ya-Sin (83v)","Ar-Rahman (78v)","Al-Waqia (96v)"];
    const techniques=aiPlanParams.level==="debutant"
      ?"• Écoute le verset 10x avant de le mémoriser\n• Mémorise mot par mot, puis phrase par phrase\n• Écris le verset à la main pour renforcer la mémoire\n• Utilise la répétition espacée dans l'app"
      :aiPlanParams.level==="intermediaire"
      ?"• Mémorise par groupes de 3-5 versets\n• Technique de la chaîne (rattacher chaque verset au suivant)\n• Récite à voix haute en marchant\n• Vise mémorisation + compréhension du sens"
      :"• Mémorisation par pages entières\n• Récitation en prière pour ancrer la mémoire\n• Enseigne à un proche pour solidifier\n• Vise Tajwid parfait sur chaque verset";
    const feasibleText=feasible
      ?`Avec ${vPerDay} versets/jour (${timeNeeded} min), tu atteindras ton objectif en ${aiPlanParams.months} mois.`
      :`Avec ${timeAvail} min/jour tu peux memoriser ~${adjustedVpd} versets/jour.\nDuree estimee realiste : ${adjustedMonths} mois.\nPour respecter ${aiPlanParams.months} mois, vise ${timeNeeded} min/jour.`;
    const surahList=nextSurahs.map((s,i)=>`${i+1}. ${s}`).join("\n");
    const plan="\u2756 PLAN DE MEMORISATION PERSONNALISE\n"
      +"\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n"
      +"\ud83d\udcca TON PROFIL\n"
      +"\u2022 Objectif : "+(goalLabels[aiPlanParams.goal]||aiPlanParams.goal)+"\n"
      +"\u2022 Versets memorises : "+totalMem+" / "+TOTAL_VERSES+"\n"
      +"\u2022 Versets restants : "+remaining+"\n"
      +"\u2022 Temps disponible : "+timeAvail+" min/jour\n"
      +"\u2022 Niveau : "+aiPlanParams.level+"\n"
      +"\u2022 Sourates completes : "+completedSurahs+"\n\n"
      +(feasible?"\u2705 OBJECTIF REALISABLE - Tu peux y arriver !":"\u26a0\ufe0f OBJECTIF AMBITIEUX - Voici un plan ajuste")+"\n"
      +feasibleText+"\n\n"
      +"\ud83d\udcc5 PLANNING SEMAINE PAR SEMAINE\n\n"
      +"Semaine 1 - Mise en route\n"
      +"\u2022 Objectif : "+adjustedVpd+" versets/jour\n"
      +"\u2022 Sourate : "+(nextSurahs[0]||"Al-Fatiha")+"\n"
      +"\u2022 Revision : 10 min de muraja'a quotidienne\n"
      +"\u2022 Conseil : Memorise apres Fajr - la memoire est plus receptive.\n\n"
      +"Semaine 2 - Consolidation\n"
      +"\u2022 Sourate : "+(nextSurahs[1]||"Al-Ikhlas")+"\n"
      +"\u2022 Revision : relire semaine 1 chaque soir\n"
      +"\u2022 Objectif cumule : "+(adjustedVpd*14)+" versets\n\n"
      +"Semaine 3 - Acceleration\n"
      +"\u2022 Sourate : "+(nextSurahs[2]||"Al-Falaq")+"\n"
      +"\u2022 Teste ta memorisation : recite sans regarder\n"
      +"\u2022 Objectif cumule : "+(adjustedVpd*21)+" versets\n\n"
      +"Semaine 4 - Bilan du mois\n"
      +"\u2022 Sourate : "+(nextSurahs[3]||"An-Nas")+"\n"
      +"\u2022 Session de revision complete\n"
      +"\u2022 Objectif cumule : "+(adjustedVpd*30)+" versets\n\n"
      +"\ud83d\udcda SOURATES RECOMMANDEES\n"
      +surahList+"\n\n"
      +"\ud83d\udd04 PLANNING DE REVISION (MURAJA'A)\n"
      +"\u2022 Quotidienne : relire les 3 derniers jours\n"
      +"\u2022 Hebdomadaire : reviser la semaine entiere (vendredi)\n"
      +"\u2022 Mensuelle : reciter tout le memorise sans aide\n\n"
      +"\ud83d\udca1 TECHNIQUES POUR TON NIVEAU\n"
      +techniques+"\n\n"
      +"\ud83c\udf1f MOTIVATION\n"
      +"Le Prophete \ufdfa a dit : \u00abLe meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.\u00bb - Al-Bukhari\n\n"
      +adjustedVpd+" versets/jour = "+(adjustedVpd*365)+" versets en un an. La constance vaut mieux que l'intensite. \u0628\u0627\u0631\u0643 \u0627\u0644\u0644\u0647 \u0641\u064a\u0643";
        setAiPlanResult(plan);
    setAiPlanLoading(false);
  };


  // updateStreak is handled via hist/useMemo - no-op needed
  const updateStreak=useCallback(()=>{},[]);

  // Quiz generation
  const generateQuiz=useCallback((filterSurah=null,filterMode="memorized")=>{
    // Pool de versets selon le filtre
    let pool=[];
    if(filterSurah){
      const vs=Q[filterSurah]||[];
      vs.forEach(v=>pool.push({...v,sn:filterSurah,surah:SURAHS.find(s=>s.n===filterSurah)?.name||"",surahAr:SURAHS.find(s=>s.n===filterSurah)?.ar||""}));
    } else if(filterMode==="memorized"){
      // Uniquement les versets que l'utilisateur a mémorisés
      SURAHS.forEach(s=>{
        const memKeys=Object.keys(mem[String(s.n)]||{});
        memKeys.forEach(vk=>{
          const v=Q[s.n]?.find(x=>String(x.n)===vk);
          if(v) pool.push({...v,sn:s.n,surah:s.name,surahAr:s.ar});
        });
      });
    } else {
      SURAHS.forEach(s=>{(Q[s.n]||[]).forEach(v=>pool.push({...v,sn:s.n,surah:s.name,surahAr:s.ar}));});
    }
    if(pool.length<4){
      // Pas assez de versets mémorisés — fallback sur Juz 30 embarqué
      SURAHS.forEach(s=>{(Q[s.n]||[]).forEach(v=>pool.push({...v,sn:s.n,surah:s.name,surahAr:s.ar}));});
    }
    if(pool.length===0)return;
    const q=pool[Math.floor(Math.random()*pool.length)];
    const correct=SURAHS.find(s=>s.n===q.sn);
    const wrong=SURAHS.filter(s=>s.n!==q.sn).sort(()=>Math.random()-.5).slice(0,3);
    const choices=[correct,...wrong].sort(()=>Math.random()-.5);
    setQuizQ(q);
    setQuizChoices(choices);
    setQuizAnswer(null);
  },[mem]);

  // Notifications
  const requestNotifications=async()=>{
    if(!("Notification" in window)){alert("Notifications non supportées sur ce navigateur.");return;}
    const perm=await Notification.requestPermission();
    if(perm==="granted"){
      setNotifEnabled(true);sv("qnotif",true);
      new Notification("Al-Hifz 📖",{body:"Notifications activées ! Tu seras rappelé chaque jour.",icon:"/icon-192.png"});
    }
  };
  const sendTestNotif=()=>{
    if(Notification.permission==="granted"){
      new Notification("Al-Hifz 📖",{body:`🔥 Al-Hifz — Continue ta mémorisation aujourd'hui !`,icon:"/icon-192.png"});
    }
  };

  const createList=name=>{if(!name.trim())return;const nl={id:Date.now(),name:name.trim(),items:[]};setLists(p=>[...p,nl]);setNewListName("");return nl;};

  const startTimer=()=>{
    if(timerRef.current)clearInterval(timerRef.current);
    setTimerLeft(timerDuration*60);
    setTimerRunning(true);
    timerRef.current=setInterval(()=>{
      setTimerLeft(p=>{
        if(p<=1){
          clearInterval(timerRef.current);
          setTimerRunning(false);
          try{new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3").play();}catch{}
          return 0;
        }
        return p-1;
      });
    },1000);
  };
  const pauseTimer=()=>{
    clearInterval(timerRef.current);
    setTimerRunning(false);
  };
  const resetTimer=()=>{
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerLeft(null);
  };
  const fmtTime=s=>s==null?`${timerDuration}:00`:`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const removeFromList=(listId,sn,vn)=>setLists(p=>p.map(l=>l.id===listId?{...l,items:l.items.filter(i=>!(i.sn===sn&&i.vn===vn))}:l));

  // Fonctions reconnaissance vocale
  const speechSupported=typeof window!=="undefined"&&("SpeechRecognition" in window||"webkitSpeechRecognition" in window);

  // ── Moteur de récitation inline amélioré ─────────────────────────────────
  const [speechCountdown,setSpeechCountdown]=useState(0); // 3,2,1,0
  const [continuousMode,setContinuousMode]=useState(false);
  const [continuousIdx,setContinuousIdx]=useState(0);
  const [recitModal,setRecitModal]=useState(false); // modal récitation plein écran
  const countdownRef=useRef(null);

  // Compare deux mots arabes en ignorant les diacritiques
  const arabicMatch=(a,b)=>{
    // Normalisation complète — supprime diacritiques, harmonise les lettres similaires
    const clean=s=>s
      .replace(/<[^>]*>/g,"")              // strip HTML tajweed
      .replace(/[ًٌٍَُِّْٰٓٔءۭۨ]/g,"")  // strip toutes diacritiques et hamza flottante
      .replace(/[أإآٱ]/g,"ا")              // toutes formes de alef → ا
      .replace(/[ىة]/g,"ي")               // ta marbuta et alef maqsura → ي
      .replace(/ؤ/g,"و")                  // waw avec hamza → و
      .replace(/ئ/g,"ي")                  // ya avec hamza → ي
      .replace(/\s+/g,"")
      .trim();
    const ca=clean(a),cb=clean(b);
    if(!ca||!cb) return false;
    if(ca===cb) return true;
    if(ca.includes(cb)||cb.includes(ca)) return true;
    // Levenshtein tolérant — accepte 1 erreur par tranche de 4 caractères
    const maxDist=Math.floor(Math.max(ca.length,cb.length)/4);
    if(maxDist===0) return ca===cb;
    const dp=Array.from({length:ca.length+1},(_,i)=>Array.from({length:cb.length+1},(_,j)=>i===0?j:j===0?i:0));
    for(let i=1;i<=ca.length;i++) for(let j=1;j<=cb.length;j++) dp[i][j]=ca[i-1]===cb[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
    return dp[ca.length][cb.length]<=maxDist;
  };

  // Analyse mot par mot — tolère l'ordre et les omissions mineures
  const analyzeRecitation=(targetAr,spoken)=>{
    const stripH=s=>(s||"").replace(/<[^>]*>/g,"").replace(/[ًٌٍَُِّْٰٓٔءۭۨ]/g,"").replace(/[أإآٱ]/g,"ا").replace(/[ىة]/g,"ي").replace(/ؤ/g,"و").replace(/ئ/g,"ي").trim();
    const target=stripH(targetAr).split(/\s+/).filter(Boolean);
    const said=stripH(spoken).split(/\s+/).filter(Boolean);
    if(!said.length) return target.map(tw=>({word:tw,status:"missing"}));
    let si=0;
    return target.map(tw=>{
      if(si>=said.length) return {word:tw,status:"missing"};
      if(arabicMatch(tw,said[si])){si++;return {word:tw,status:"ok"};}
      // Cherche dans les 4 prochains mots (skip de mots)
      const ahead=said.slice(si,si+4).findIndex(w=>arabicMatch(tw,w));
      if(ahead>=0){si+=ahead+1;return {word:tw,status:"ok"};}
      si++; // avance quand même pour ne pas bloquer
      return {word:tw,status:"wrong"};
    });
  };

  const startListening=(verseAr,vn,onDone)=>{
    if(!speechSupported)return;
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR)return;

    setSpeechVerseTarget({ar:verseAr,vn});
    setSpeechResult("");
    setSpeechScore(null);

    // Créer la recognition MAINTENANT (dans le contexte synchrone du geste utilisateur)
    // pour satisfaire la restriction iOS Safari
    const recognition=new SR();
    recognition.lang="ar-SA";
    recognition.continuous=false;     // false = compatible iOS
    recognition.interimResults=true;
    recognition.maxAlternatives=5;
    recognitionRef.current=recognition;

    recognition.onresult=e=>{
      let finalTranscript="";
      let interimTranscript="";
      for(let i=0;i<e.results.length;i++){
        const r=e.results[i];
        // Prendre la meilleure alternative
        const best=Array.from({length:r.length},(_,k)=>r[k].transcript).join(" ");
        if(r.isFinal) finalTranscript+=r[0].transcript+" ";
        else interimTranscript+=r[0].transcript;
      }
      if(interimTranscript) setSpeechResult(interimTranscript);
      if(finalTranscript.trim()){
        const transcript=finalTranscript.trim();
        setSpeechResult(transcript);
        setSpeechListening(false);
        const analysis=analyzeRecitation(verseAr,transcript);
        const correct=analysis.filter(w=>w.status==="ok").length;
        const total=analysis.length;
        const pct=total>0?Math.round(correct/total*100):0;
        const score={pct,analysis,
          wrong:analysis.filter(w=>w.status!=="ok").map(w=>w.word),
          correct:analysis.filter(w=>w.status==="ok").map(w=>w.word),
          targetWords:analysis.map(w=>w.word),
          spokenWords:transcript.split(/\s+/),
        };
        setSpeechScore(score);
        if(onDone) onDone(score);
      }
    };
    recognition.onerror=(ev)=>{
      console.warn("Speech error:",ev.error);
      setSpeechListening(false);
      setSpeechCountdown(0);
    };
    recognition.onend=()=>{
      setSpeechListening(false);
    };

    // Countdown visuel — mais start() lancé immédiatement
    // (iOS Safari autorise si l'objet recognition a été créé dans le geste)
    setSpeechCountdown(3);
    let cd=3;
    countdownRef.current=setInterval(()=>{
      cd--;
      setSpeechCountdown(cd);
      if(cd<=0){
        clearInterval(countdownRef.current);
        setSpeechCountdown(0);
        setSpeechListening(true);
        try{ recognition.start(); }
        catch(err){ console.warn("recognition.start error:",err); setSpeechListening(false); }
      }
    },1000);
  };

  const stopListening=()=>{
    clearInterval(countdownRef.current);
    recognitionRef.current?.stop();
    setSpeechListening(false);
    setSpeechCountdown(0);
  };

  // Mode récitation continue
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
    // Jouer l'audio du verset suivant puis écouter
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

  // Ramadan info calculée avant return pour éviter les IIFEs dans le JSX
  const riInfo=getRamadanInfo();

  // Verset du jour — seed basé sur la date, tiré parmi les mémorisés ou Juz 30 si rien
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
    // Fallback: versets embarqués du Juz 30
    const fallbackList=[];
    [112,113,114,97,103,108].forEach(sn=>{
      (Q[sn]||[]).forEach(v=>fallbackList.push({...v,sn,surah:SURAHS.find(s=>s.n===sn)?.name||"",surahAr:SURAHS.find(s=>s.n===sn)?.ar||""}));
    });
    const pool=memList.length>=3?memList:fallbackList;
    return pool.length?pool[seed%pool.length]:null;
  },[mem]);
  // filtered2 pour l'onglet révision
  const filtered2=SURAHS.filter(s=>{
    if(revFilter==="memorized")return sPct(s)===100;
    if(revFilter==="active")return revFlags[String(s.n)]==="active";
    if(revFilter==="none")return sMem(s)===0&&!revFlags[String(s.n)];
    return true;
  });
  const versesThisRamadan=riInfo.isActive
    ?Object.keys(hist).filter(d=>d>=riInfo.start.toISOString().split("T")[0]&&d<=riInfo.end.toISOString().split("T")[0])
       .reduce((s,d,i,arr)=>{const prev=arr[i-1]?hist[arr[i-1]]:0;return s+Math.max(0,(hist[d]||0)-prev);},0)
    :0;
if(!authReady)return null;
if(!user)return <AuthScreen authPage={authPage} setAuthPage={setAuthPage} email={email} setEmail={setEmail} password={password} setPassword={setPassword} authLoading={authLoading} authError={authError} onLogin={handleLogin} onSignup={handleSignup} onReset={handleReset}/>;
return (
    <>
      <style>{buildCSS(t,tjc,arFont,tn,ramadanTheme)}</style>

      {/* Modal Plan IA */}
      {showAIPlan&&(
        <div className="overlay" onClick={()=>setShowAIPlan(false)}>
          <div style={{background:t.s1,border:`1px solid ${t.acc}`,borderRadius:18,padding:24,maxWidth:520,width:"92%",maxHeight:"85vh",display:"flex",flexDirection:"column",gap:14}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <h2 style={{fontFamily:"'Amiri',serif",fontSize:"1.5rem",color:t.acc,marginBottom:2}}>Mon Parcours de mémorisation</h2>
                <p style={{fontSize:".65rem",color:t.tx3}}>Plan adapté à ton profil · mis à jour en temps réel</p>
              </div>
              <button onClick={()=>setShowAIPlan(false)} style={{background:"none",border:"none",color:t.tx3,fontSize:"1.3rem",cursor:"pointer"}}>✕</button>
            </div>
            {!aiPlanResult&&(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div>
                  <label style={{fontSize:".65rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:5}}>Objectif global</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[["juz30","Juz 30"],["juz29","Juz 29-30"],["halfquran","Demi-Coran"],["fullquran","Coran complet"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setAiPlanParams(p=>({...p,goal:v,customGoal:null}))} style={{padding:"8px 10px",borderRadius:8,border:`1.5px solid ${aiPlanParams.goal===v&&!aiPlanParams.customGoal?t.acc:t.b2}`,background:aiPlanParams.goal===v&&!aiPlanParams.customGoal?`${t.acc}15`:t.s2,color:aiPlanParams.goal===v&&!aiPlanParams.customGoal?t.acc:t.tx,fontSize:".72rem",cursor:"pointer",fontWeight:aiPlanParams.goal===v&&!aiPlanParams.customGoal?700:400,transition:"all .15s"}}>{l}</button>
                    ))}
                  </div>
                </div>
                {/* Sélection fine par juz, sourate ou hizb */}
                <div>
                  <label style={{fontSize:".65rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:5}}>Ou choisir précisément</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                    <select onChange={e=>{const v=+e.target.value;if(v)setAiPlanParams(p=>({...p,customGoal:`juz_${v}`,goal:null}));}} style={{padding:"7px 6px",borderRadius:8,border:`1px solid ${aiPlanParams.customGoal?.startsWith("juz_")?t.acc:t.b2}`,background:aiPlanParams.customGoal?.startsWith("juz_")?`${t.acc}15`:t.s2,color:aiPlanParams.customGoal?.startsWith("juz_")?t.acc:t.tx,fontSize:".65rem",cursor:"pointer",outline:"none"}}>
                      <option value="">Juz…</option>
                      {Array.from({length:30},(_,i)=>i+1).map(j=><option key={j} value={j}>Juz {j}</option>)}
                    </select>
                    <select onChange={e=>{const v=+e.target.value;if(v)setAiPlanParams(p=>({...p,customGoal:`surah_${v}`,goal:null}));}} style={{padding:"7px 6px",borderRadius:8,border:`1px solid ${aiPlanParams.customGoal?.startsWith("surah_")?t.acc:t.b2}`,background:aiPlanParams.customGoal?.startsWith("surah_")?`${t.acc}15`:t.s2,color:aiPlanParams.customGoal?.startsWith("surah_")?t.acc:t.tx,fontSize:".65rem",cursor:"pointer",outline:"none"}}>
                      <option value="">Sourate…</option>
                      {SURAHS.map(s=><option key={s.n} value={s.n}>{s.name}</option>)}
                    </select>
                    <select onChange={e=>{const v=+e.target.value;if(v)setAiPlanParams(p=>({...p,customGoal:`hizb_${v}`,goal:null}));}} style={{padding:"7px 6px",borderRadius:8,border:`1px solid ${aiPlanParams.customGoal?.startsWith("hizb_")?t.acc:t.b2}`,background:aiPlanParams.customGoal?.startsWith("hizb_")?`${t.acc}15`:t.s2,color:aiPlanParams.customGoal?.startsWith("hizb_")?t.acc:t.tx,fontSize:".65rem",cursor:"pointer",outline:"none"}}>
                      <option value="">Hizb…</option>
                      {Array.from({length:60},(_,i)=>i+1).map(h=><option key={h} value={h}>Hizb {h}</option>)}
                    </select>
                  </div>
                  {aiPlanParams.customGoal&&<div style={{fontSize:".6rem",color:t.acc,marginTop:4}}>✦ Objectif : {aiPlanParams.customGoal.replace("juz_","Juz ").replace("surah_",s=>` Sourate ${SURAHS.find(x=>x.n===+aiPlanParams.customGoal.split("_")[1])?.name||""}`).replace("hizb_","Hizb ")}</div>}
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
                  {aiPlanLoading?"Calcul en cours…":"✦ Générer mon parcours"}
                </button>
                {aiPlanLoading&&(
                  <div style={{textAlign:"center",color:t.tx3,fontSize:".7rem"}}>
                    <div style={{width:24,height:24,border:`2px solid ${t.acc}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 8px"}}/>
                    Analyse de ton profil en cours…
                  </div>
                )}
              </div>
            )}
            {aiPlanResult&&(
              <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
                <div style={{padding:"12px 14px",background:t.s2,borderRadius:10,border:`1px solid ${t.b1}`,fontSize:".75rem",color:t.tx,lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"'DM Sans',sans-serif"}}>
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

      {/* Splash */}
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

      {/* Test */}
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

      {/* Setup */}
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

      {/* Modal Récitation — composant propre */}
      {recitModal&&selS&&verses.length>0&&(
        <RecitModal
          verses={verses} selS={selS} t={t} acc={acc} tn={tn}
          continuousIdx={continuousIdx} setContinuousIdx={setContinuousIdx}
          continuousMode={continuousMode} setContinuousMode={setContinuousMode}
          speechListening={speechListening} speechVerseTarget={speechVerseTarget}
          speechCountdown={speechCountdown} speechScore={speechScore} speechResult={speechResult}
          showTj={showTj} tjc={tjc} mem={mem}
          startListening={startListening} stopListening={stopListening}
          setSpeechScore={setSpeechScore} setSpeechResult={setSpeechResult}
          countdownRef={countdownRef} setSpeechCountdown={setSpeechCountdown}
          doPlay={doPlay}
          onClose={()=>{setRecitModal(false);stopListening();setContinuousMode(false);setSpeechScore(null);setSpeechResult("");}}
        />
      )}

      {/* Modal Lecture partielle */}
      {partialVerse&&(
        <div className="overlay" onClick={()=>setPartialVerse(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
            <h2 style={{fontFamily:"'Amiri',serif",color:acc,marginBottom:4}}>✂ Lecture partielle</h2>
            <p style={{fontSize:".68rem",color:t.tx3,marginBottom:16}}>Sélectionne les mots à lire — idéal pour mémoriser bout à bout</p>
            {/* Aperçu du segment sélectionné */}
            <div style={{background:t.s2,borderRadius:12,padding:"14px 16px",border:`1px solid ${t.b1}`,marginBottom:14,direction:"rtl",textAlign:"right"}}>
              <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.3rem",lineHeight:2.2,color:t.tx}}>
                {partialVerse.words.map((w,i)=>(
                  <span key={i} style={{
                    color:i>=partialVerse.from&&i<=partialVerse.to?acc:t.tx3+"55",
                    fontWeight:i>=partialVerse.from&&i<=partialVerse.to?700:400,
                    cursor:"pointer",
                    transition:"all .15s",
                    padding:"0 2px",
                  }}
                  onClick={()=>{
                    if(i<partialVerse.from) setPartialVerse(p=>({...p,from:i}));
                    else if(i>partialVerse.to) setPartialVerse(p=>({...p,to:i}));
                    else if(i===partialVerse.from&&i<partialVerse.to) setPartialVerse(p=>({...p,from:i+1}));
                    else if(i===partialVerse.to&&i>partialVerse.from) setPartialVerse(p=>({...p,to:i-1}));
                  }}
                  >{w}{" "}</span>
                ))}
              </div>
              <div style={{fontSize:".65rem",color:t.tx3,marginTop:8,textAlign:"left",direction:"ltr"}}>
                Mots {partialVerse.from+1} à {partialVerse.to+1} sur {partialVerse.words.length}
              </div>
            </div>
            {/* Sliders début / fin */}
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              <div>
                <label style={{fontSize:".62rem",color:t.tx3,display:"block",marginBottom:4}}>Début — mot {partialVerse.from+1}</label>
                <input type="range" min={0} max={partialVerse.to} value={partialVerse.from}
                  onChange={e=>setPartialVerse(p=>({...p,from:+e.target.value}))}
                  style={{width:"100%",accentColor:acc}}/>
              </div>
              <div>
                <label style={{fontSize:".62rem",color:t.tx3,display:"block",marginBottom:4}}>Fin — mot {partialVerse.to+1}</label>
                <input type="range" min={partialVerse.from} max={partialVerse.words.length-1} value={partialVerse.to}
                  onChange={e=>setPartialVerse(p=>({...p,to:+e.target.value}))}
                  style={{width:"100%",accentColor:acc}}/>
              </div>
            </div>
            {/* Actions */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button className="mbtn" style={{flex:1}} onClick={()=>{
                const total=partialVerse.words.length;
                const startAt=partialVerse.from/total;
                const stopAt=(partialVerse.to+1)/total;
                // Joue le verset et stoppe au bon ratio de durée
                const url=buildUrl(partialVerse.sn,partialVerse.vn);
                const audio=audioRef.current;
                partialPlayRef.current={startAt,stopAt};
                audio.pause();
                audio.src=url;
                audio.load();
                audio.addEventListener("canplay",function onCp(){
                  audio.removeEventListener("canplay",onCp);
                  audio.currentTime=audio.duration*startAt||0;
                  audio.play().catch(()=>{});
                },{once:true});
                setPlaying(partialVerse.vn);
                setLoopCurrent(1);
                setPartialVerse(null);
              }}>▶ Écouter le segment</button>
              <button className="tbtn" style={{flex:1,borderColor:t.pu,color:t.pu}} onClick={()=>{
                const seg=partialVerse.words.slice(partialVerse.from,partialVerse.to+1).join(" ");
                navigator.clipboard?.writeText(seg);
                setPartialVerse(null);
              }}>📋 Copier</button>
              <button className="tbtn" onClick={()=>setPartialVerse(null)} style={{borderColor:t.b2,color:t.tx3}}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Note modal */}
      {editingNote&&(<div className="overlay" onClick={()=>setEditingNote(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>Note personnelle</h2><p style={{fontSize:".72rem",color:t.tx3,marginBottom:12}}>{editingNote.replace("_"," · verset ")}</p><textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Écris ta note…" style={{width:"100%",minHeight:100,background:t.inputBg,border:`1px solid ${t.b2}`,borderRadius:8,padding:"10px 12px",color:t.tx,fontSize:".85rem",resize:"vertical",outline:"none",marginBottom:12}}/><div style={{display:"flex",gap:8}}><button className="mbtn" style={{flex:1}} onClick={()=>{const[sn,vn]=editingNote.split("_");saveNote(sn,vn,noteText);}}>Sauvegarder</button>{notes[editingNote]&&(<button className="tbtn" style={{borderColor:t.rd,color:t.rd}} onClick={()=>{const[sn,vn]=editingNote.split("_");saveNote(sn,vn,"");}}>Supprimer</button>)}</div></div></div>)}

      {/* Share modal */}
      {shareVerse&&(<div className="overlay" onClick={()=>setShareVerse(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2 style={{fontFamily:"'Amiri',serif",color:acc,marginBottom:4}}>{shareVerse.surahAr}</h2><p style={{fontSize:".68rem",color:t.tx3,marginBottom:14}}>{shareVerse.surah} · verset {shareVerse.vn}</p><div style={{background:`linear-gradient(135deg,${t.s2},${t.s3})`,border:`2px solid ${acc}`,borderRadius:14,padding:"20px 18px",marginBottom:14,textAlign:"center"}}><div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.5rem",direction:"rtl",lineHeight:2.2,color:t.tx,marginBottom:10}}>{shareVerse.ar.replace(/<[^>]*>/g,"")}</div><div style={{fontSize:".75rem",color:t.tx2,fontStyle:"italic",lineHeight:1.6}}>{shareVerse.fr}</div><div style={{marginTop:10,fontSize:".6rem",color:t.tx3}}>— {shareVerse.surah} ({shareVerse.sn}:{shareVerse.vn}) · Al-Hifz</div></div><button className="mbtn" onClick={()=>{const txt=`${shareVerse.ar.replace(/<[^>]*>/g,"")}\n\n${shareVerse.fr}\n\n— ${shareVerse.surah} (${shareVerse.sn}:${shareVerse.vn})`;navigator.clipboard?.writeText(txt).catch(()=>{});setShareVerse(null);}}>Copier le verset</button></div></div>)}

      {/* Weekly report */}
      {showWeeklyReport&&(<div className="overlay" onClick={()=>setShowWeeklyReport(false)}><div className="modal" onClick={e=>e.stopPropagation()}><h2 style={{marginBottom:4}}>Rapport hebdomadaire</h2><p style={{marginBottom:16}}>{weeklyReport.totalWeek} versets · {weeklyReport.activeDays}/7 jours actifs</p><div style={{display:"flex",alignItems:"flex-end",gap:6,height:80,marginBottom:12}}>{weeklyReport.days.map((d,i)=>{const maxG=Math.max(...weeklyReport.days.map(x=>x.gained),1);const isToday=d.date===today();return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{fontSize:".52rem",color:acc}}>{d.gained||""}</div><div style={{width:"100%",height:60,display:"flex",alignItems:"flex-end"}}><div style={{width:"100%",height:`${Math.max(Math.round(d.gained/maxG*100),4)}%`,background:isToday?acc:`${acc}66`,borderRadius:"3px 3px 0 0",minHeight:3}}/></div><div style={{fontSize:".52rem",color:isToday?acc:t.tx3,fontWeight:isToday?700:400}}>{d.label}</div></div>);})}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>{[{v:weeklyReport.totalWeek,l:"Versets",c:acc},{v:weeklyReport.activeDays,l:"Jours actifs",c:t.gr},{v:weeklyReport.best?.gained||0,l:"Meilleur jour",c:t.bl}].map((k,i)=>(<div key={i} style={{background:t.s2,borderRadius:10,padding:"10px",textAlign:"center"}}><div style={{fontSize:"1.4rem",fontWeight:700,color:k.c}}>{k.v}</div><div style={{fontSize:".58rem",color:t.tx3}}>{k.l}</div></div>))}</div><div style={{textAlign:"center",color:weeklyReport.totalWeek>0?t.gr:t.tx3,fontSize:".75rem",marginBottom:14,fontWeight:600}}>{weeklyReport.activeDays>=5?"Excellente semaine ! 🌟":weeklyReport.activeDays>=3?"Bonne progression, continue !":"Essaie de mémoriser chaque jour."}</div><button className="mbtn" onClick={()=>setShowWeeklyReport(false)}>Fermer</button></div></div>)}

      {/* Offline banner */}
      {isOffline&&(
        <div style={{background:`${t.rd}CC`,color:"#fff",padding:"6px 16px",textAlign:"center",fontSize:".7rem",fontWeight:600,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,position:"sticky",top:0,zIndex:61}}>
          <span>●</span> Mode hors ligne — Coran embarqué et mémorisations disponibles
        </div>
      )}
      {/* Install banner */}
      {showInstallBanner&&(
        <div style={{background:`linear-gradient(135deg,${t.acc}ee,${t.acc2}ee)`,padding:"8px 16px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:61,backdropFilter:"blur(8px)"}}>
          <span style={{fontSize:".75rem",fontWeight:700,color:"#fff",flex:1}}>Installer Al-Hifz sur ton écran d'accueil</span>
          <button onClick={()=>{installPromptRef.current?.prompt();setShowInstallBanner(false);}} style={{background:"rgba(255,255,255,.25)",border:"1px solid rgba(255,255,255,.4)",color:"#fff",borderRadius:8,padding:"4px 12px",fontSize:".7rem",fontWeight:700,cursor:"pointer"}}>Installer</button>
          <button onClick={()=>setShowInstallBanner(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:"1rem"}}>✕</button>
        </div>
      )}

      {/* Popup badge débloqué */}
      {badgePopup&&(
        <div style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",zIndex:300,animation:"slideUp .4s ease"}} onClick={()=>setBadgePopup(null)}>
          <style>{`@keyframes slideUp{from{transform:translateX(-50%) translateY(30px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>
          <div style={{background:`linear-gradient(135deg,${t.s1},${t.s2})`,border:`2px solid ${t.acc}`,borderRadius:18,padding:"16px 24px",textAlign:"center",boxShadow:`0 8px 32px ${t.acc}44`,backdropFilter:"blur(16px)",minWidth:220,cursor:"pointer"}}>
            <div style={{fontSize:"2.5rem",marginBottom:6}}>{badgePopup.icon}</div>
            <div style={{fontSize:".6rem",color:t.acc,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:4}}>Badge débloqué !</div>
            <div style={{fontSize:".9rem",fontWeight:800,color:t.tx,marginBottom:2}}>{badgePopup.label}</div>
            <div style={{fontSize:".65rem",color:t.tx3}}>{badgePopup.desc}</div>
            <div style={{marginTop:8,fontSize:".55rem",color:t.tx3}}>Touche pour fermer</div>
          </div>
        </div>
      )}
      {/* Popup encouragement pages */}
      {encouragementMsg&&(
        <div style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",zIndex:300,animation:"slideUp .4s ease"}} onClick={()=>setEncouragementMsg(null)}>
          <div style={{background:`linear-gradient(135deg,${t.s1},${t.s2})`,border:`2px solid ${t.gr}`,borderRadius:18,padding:"14px 22px",textAlign:"center",boxShadow:`0 8px 32px ${t.gr}44`,backdropFilter:"blur(16px)",minWidth:240,cursor:"pointer"}}>
            <div style={{fontSize:"2rem",marginBottom:6}}>📖</div>
            <div style={{fontSize:".6rem",color:t.gr,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:4}}>{encouragementMsg.pages} pages lues</div>
            <div style={{fontSize:".8rem",fontWeight:700,color:t.tx,lineHeight:1.5}}>{encouragementMsg.msg}</div>
            <div style={{marginTop:8,fontSize:".55rem",color:t.tx3}}>Touche pour fermer</div>
          </div>
        </div>
      )}

      {/* Timer flottant en haut quand actif */}
      {timerRunning&&timerLeft!==null&&timerLeft>0&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:250,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",background:tn==="light"?"rgba(255,255,255,.92)":"rgba(13,26,14,.92)",borderBottom:`1px solid ${t.b1}`,boxShadow:`0 2px 20px rgba(0,0,0,.15)`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"7px 16px"}}>
            {/* Icône séance */}
            <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${t.acc},${t.acc2})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 2px 8px ${t.acc}44`}}>
              <span style={{fontSize:".7rem"}}>⏱</span>
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:3,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:".56rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1.5px",fontWeight:600}}>Séance en cours</span>
                <span style={{fontFamily:"monospace",fontWeight:900,fontSize:".85rem",color:t.acc,letterSpacing:"1px"}}>{fmtTime(timerLeft)}</span>
              </div>
              {/* Barre de progression */}
              <div style={{height:4,background:t.b1,borderRadius:99,overflow:"hidden"}}>
                <div style={{
                  height:"100%",
                  width:`${100-(timerLeft/(timerDuration*60)*100)}%`,
                  background:`linear-gradient(90deg,${t.acc},${t.acc2})`,
                  borderRadius:99,
                  transition:"width 1s linear",
                  boxShadow:`0 0 6px ${t.acc}66`,
                }}/>
              </div>
            </div>
            <button onClick={pauseTimer} style={{background:t.s2,border:`1px solid ${t.b2}`,borderRadius:8,padding:"5px 10px",color:t.tx2,cursor:"pointer",fontSize:".65rem",fontWeight:700,flexShrink:0}}>⏸</button>
            <button onClick={()=>setTimerOpen(true)} style={{background:`${t.acc}15`,border:`1px solid ${t.acc}44`,borderRadius:8,padding:"5px 10px",color:t.acc,cursor:"pointer",fontSize:".65rem",fontWeight:700,flexShrink:0}}>↗</button>
          </div>
        </div>
      )}
      {timerLeft===0&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:250,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",background:tn==="light"?"rgba(232,255,235,.95)":"rgba(13,40,18,.95)",borderBottom:`1px solid ${t.gr}44`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"7px 16px"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${t.gr},#43a047)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:".75rem"}}>✓</span>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:t.gr}}>Séance terminée</div>
              <div style={{fontSize:".58rem",color:t.tx3,marginTop:1}}>بارك الله فيك — que Allah bénisse ton effort</div>
            </div>
            <button onClick={resetTimer} style={{background:"none",border:`1px solid ${t.gr}44`,borderRadius:8,padding:"5px 10px",color:t.gr,cursor:"pointer",fontSize:".65rem",fontWeight:700}}>✕</button>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar" style={{marginTop:(timerRunning&&timerLeft!==null&&timerLeft>0)||timerLeft===0?36:0,transition:"margin-top .2s"}}>
        <div className="tb">
          <div className="logo">
            <div style={{display:"flex",flexDirection:"column",lineHeight:1.1}}>
              <div style={{display:"flex",alignItems:"baseline",gap:5}}>
                <span className="logo-h">Al-Hifz</span>
                <span className="logo-ar">القرآن</span>
              </div>
              <span style={{fontSize:".42rem",color:t.tx3,letterSpacing:"1.5px",textTransform:"uppercase",whiteSpace:"nowrap",fontStyle:"italic"}}>Le mémorisateur</span>
            </div>
          </div>
          <div className="tb-r">
            <button className="tbtn" style={{borderColor:t.pu,color:t.pu,fontSize:".6rem"}} onClick={()=>setShowAIPlan(true)}>✦ Mon Parcours</button>
            <button className="tbtn" style={{borderColor:timerRunning?t.acc:t.gr,color:timerRunning?t.acc:t.gr,fontSize:".6rem",fontWeight:timerRunning?800:400}} onClick={()=>setTimerOpen(true)}>{timerRunning&&timerLeft?fmtTime(timerLeft):"⏱"}</button>
            <button className="ib" title={tn==="light"?"Passer en mode nuit":"Passer en mode jour"} onClick={()=>setTn(tn==="light"?"emerald":"light")}>{tn==="light"?<Icons.Moon size={14}/>:<Icons.Sun size={14}/>}</button>
            {memStreak>0&&<div style={{display:"flex",alignItems:"center",gap:2,padding:"3px 7px",background:"rgba(249,115,22,.15)",borderRadius:8,border:"1px solid rgba(249,115,22,.3)",flexShrink:0}}>
              <span style={{fontSize:".85rem",lineHeight:1}}>🔥</span>
              <span style={{fontSize:".65rem",fontWeight:800,color:"#f97316"}}>{memStreak}</span>
            </div>}
            {user&&<button onClick={()=>setPage("settings")} title={user.email} style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${t.acc},${t.acc2})`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".8rem",fontWeight:800,color:"#000",flexShrink:0,boxShadow:`0 0 8px ${t.acc}66`}}>{(user.email||"?")[0].toUpperCase()}</button>}
          </div>
        </div>
      </div>

      {/* Hero — onglet Coran uniquement — version épurée */}
      {page==="quran"&&<div className="hero" style={{padding:"12px 16px"}}>
        {/* Verset du jour */}
        {versetDuJour&&!versetDuJourDismissed&&(
          <div style={{padding:"10px 14px",background:`linear-gradient(135deg,${acc}12,${acc}06)`,borderRadius:10,border:`1px solid ${acc}30`,marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:".58rem",color:acc,textTransform:"uppercase",letterSpacing:"1.5px",fontWeight:700}}>Verset du jour</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:".58rem",color:t.tx3}}>{versetDuJour.surah} · v.{versetDuJour.n}</span>
                <button onClick={e=>{e.stopPropagation();toggleFav(versetDuJour.sn,versetDuJour.n,versetDuJour.ar,versetDuJour.fr,versetDuJour.surah);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:".85rem",padding:"2px",lineHeight:1,color:isFav(versetDuJour.sn,versetDuJour.n)?t.rd:t.tx3}}>
                  {isFav(versetDuJour.sn,versetDuJour.n)?"❤️":"🤍"}
                </button>
                <button onClick={e=>{e.stopPropagation();setVersetDuJourDismissed(true);sv("qvdjdis",today());}} style={{background:"none",border:"none",cursor:"pointer",fontSize:".8rem",padding:"2px",lineHeight:1,color:t.tx3,opacity:.6}}>✕</button>
              </div>
            </div>
            <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.2rem",direction:"rtl",textAlign:"right",lineHeight:2,color:t.tx,cursor:"pointer"}} onClick={()=>{const s=SURAHS.find(x=>x.n===versetDuJour.sn);if(s)doSelect(s);}}>
              {(versetDuJour.ar||"").replace(/<[^>]*>/g,"")}
            </div>
            {versetDuJour.fr&&<div style={{fontSize:".62rem",color:t.tx2,fontStyle:"italic",lineHeight:1.5,marginTop:2,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{versetDuJour.fr}</div>}
          </div>
        )}
        {/* Streak cliquable → Stats */}
        {memStreak>0&&(
          <div onClick={()=>setPage("stats")} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",background:"rgba(249,115,22,.08)",borderRadius:9,border:"1px solid rgba(249,115,22,.2)",cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(249,115,22,.14)";e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(249,115,22,.08)";e.currentTarget.style.transform="";}}>
            <span style={{fontSize:"1.1rem"}}>🔥</span>
            <span style={{fontSize:".72rem",fontWeight:700,color:"#f97316",flex:1}}>{memStreak} jour{memStreak>1?"s":""} de suite</span>
            <span style={{fontSize:".6rem",color:"#f97316",opacity:.7}}>Voir stats →</span>
          </div>
        )}
      </div>}

      <div className={`wrap${pageTransition?" transitioning":""}`}>

        {/* ACCUEIL */}
        {page==="home"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* ── Bloc Al-Hifz exact ── */}
            <div style={{background:`linear-gradient(135deg,${t.s2},${t.s3})`,borderRadius:16,border:`1px solid ${t.b1}`,position:"relative",overflow:"hidden"}}>
              {/* Décoration bordure haut */}
              <svg style={{position:"absolute",top:0,left:0,width:"100%",height:12,display:"block"}} preserveAspectRatio="none" viewBox="0 0 800 12">
                <defs><linearGradient id="bord2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="transparent"/><stop offset=".15" stopColor={acc}/><stop offset=".5" stopColor={acc3}/><stop offset=".85" stopColor={acc}/><stop offset="1" stopColor="transparent"/></linearGradient></defs>
                <rect y="0" width="800" height="1.5" fill="url(#bord2)"/>
              </svg>
              <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 100%,${acc}0e 0%,transparent 70%)`,pointerEvents:"none"}}/>

              <div style={{padding:"18px 16px 14px"}}>
                {/* Title */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:14}}>
                  <svg width="60" height="8" viewBox="0 0 80 10"><line x1="0" y1="5" x2="55" y2="5" stroke={acc} strokeWidth=".8" opacity=".4"/><circle cx="62" cy="5" r="2.5" fill="none" stroke={acc} strokeWidth=".8" opacity=".6"/><circle cx="72" cy="5" r="1.5" fill={acc} opacity=".5"/></svg>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Amiri',serif",fontSize:"1.6rem",fontWeight:700,color:acc,lineHeight:1,letterSpacing:"1px",textShadow:`0 0 30px ${acc}55`}}>Al-Hifz</div>
                    <div style={{fontSize:".46rem",textTransform:"uppercase",letterSpacing:"4px",color:t.tx3,marginTop:2}}>حفظ القرآن الكريم</div>
                  </div>
                  <svg width="60" height="8" viewBox="0 0 80 10" style={{transform:"scaleX(-1)"}}><line x1="0" y1="5" x2="55" y2="5" stroke={acc} strokeWidth=".8" opacity=".4"/><circle cx="62" cy="5" r="2.5" fill="none" stroke={acc} strokeWidth=".8" opacity=".6"/><circle cx="72" cy="5" r="1.5" fill={acc} opacity=".5"/></svg>
                </div>

                {/* Ring + KPIs */}
                <div style={{display:"flex",gap:14,alignItems:"stretch"}}>
                  {/* Circular progress */}
                  <div style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{position:"relative",width:88,height:88}}>
                      <svg width="88" height="88" viewBox="0 0 88 88">
                        <defs><linearGradient id="cg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={acc}/><stop offset="1" stopColor={acc3}/></linearGradient><filter id="glow2h"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                        <circle cx="44" cy="44" r="42" fill="none" stroke={acc} strokeWidth=".4" opacity=".2" strokeDasharray="3,4"/>
                        <circle cx="44" cy="44" r="35" fill="none" stroke={t.b1} strokeWidth="7"/>
                        <circle cx="44" cy="44" r="35" fill="none" stroke="url(#cg2)" strokeWidth="7" strokeDasharray={`${2*Math.PI*35*pct/100} ${2*Math.PI*35*(1-pct/100)}`} strokeLinecap="round" transform="rotate(-90 44 44)" filter="url(#glow2h)" style={{transition:"stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)"}}/>
                        <g transform="translate(44,44)" opacity=".15">{[0,60,120,180,240,300].map(a=>(<line key={a} x1="0" y1="-12" x2="0" y2="-7" stroke={acc} strokeWidth=".8" transform={`rotate(${a})`}/>))}</g>
                      </svg>
                      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                        <div style={{fontSize:"1.55rem",fontWeight:800,color:acc,lineHeight:1,fontVariantNumeric:"tabular-nums"}}>{pct}<span style={{fontSize:".65rem",fontWeight:600}}>%</span></div>
                        <div style={{fontSize:".46rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px"}}>mémorisé</div>
                      </div>
                    </div>
                  </div>

                  {/* KPIs droite */}
                  <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:8}}>
                    {/* Barre progression */}
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                        <span style={{fontSize:".55rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1.5px"}}>Progression</span>
                        <div style={{display:"flex",gap:5}}>
                          <span style={{fontSize:".7rem",color:acc,fontWeight:800,fontVariantNumeric:"tabular-nums"}}>{pct}%</span>
                          <span style={{fontSize:".55rem",color:t.tx3}}>{totalMem.toLocaleString()} / {TOTAL_VERSES}</span>
                        </div>
                      </div>
                      <div style={{position:"relative",height:11,background:t.b1,borderRadius:99,overflow:"hidden",boxShadow:"inset 0 2px 6px rgba(0,0,0,.15)"}}>
                        <div style={{height:"100%",width:`${pct}%`,borderRadius:99,background:`linear-gradient(90deg,${acc},${acc2},${acc3})`,boxShadow:`0 0 10px ${acc}99`,transition:"width 1.2s cubic-bezier(.4,0,.2,1)",position:"relative",minWidth:pct>0?"12px":"0"}}>
                          <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)",backgroundSize:"200% 100%",animation:"shimmer 2.5s infinite",borderRadius:99}}/>
                        </div>
                        {pct>2&&<div style={{position:"absolute",top:"50%",transform:"translateY(-50%)",left:`calc(${pct}% - 6px)`,width:11,height:11,borderRadius:"50%",background:"#fff",boxShadow:`0 0 6px ${acc}`,opacity:.9}}/>}
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                        <span style={{fontSize:".5rem",color:t.tx3}}>0</span>
                        {[25,50,75].map(m=><span key={m} style={{fontSize:".5rem",color:pct>=m?acc:t.tx3,fontWeight:pct>=m?700:400}}>{m}%</span>)}
                        <span style={{fontSize:".5rem",color:pct>=100?t.gr:t.tx3,fontWeight:pct>=100?700:400}}>✓</span>
                      </div>
                    </div>
                    {/* 4 KPIs */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 6px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 7px",background:t.s3,borderRadius:7}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.bl} strokeWidth="1.5" strokeLinecap="round" opacity=".8"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-5 0v-15A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 8A2.5 2.5 0 0 1 17 10.5v9a2.5 2.5 0 0 1-5 0v-9A2.5 2.5 0 0 1 14.5 8Z"/></svg>
                        <div><div style={{fontSize:".8rem",fontWeight:700,color:t.bl,lineHeight:1,fontVariantNumeric:"tabular-nums"}}>{vpd}<span style={{fontSize:".52rem",fontWeight:500}}> v/j</span></div><div style={{fontSize:".44rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",marginTop:1}}>Rythme</div></div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 7px",background:t.s3,borderRadius:7}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" opacity=".8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                        <div><div style={{fontSize:".8rem",fontWeight:700,color:daysLeft<=0?t.gr:"#f97316",lineHeight:1,fontVariantNumeric:"tabular-nums"}}>{daysLeft>0?(daysLeft>365?`~${(daysLeft/365).toFixed(1)}a`:`${daysLeft}j`):"Fini!"}</div><div style={{fontSize:".44rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",marginTop:1}}>Avant fin</div></div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 7px",background:t.s3,borderRadius:7}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.gr} strokeWidth="1.5" strokeLinecap="round" opacity=".8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        <div><div style={{fontSize:".8rem",fontWeight:700,color:t.gr,lineHeight:1}}>{SURAHS.filter(s=>sPct(s)===100).length}</div><div style={{fontSize:".44rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",marginTop:1}}>Sourates</div></div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 7px",background:t.s3,borderRadius:7}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.tx2} strokeWidth="1.5" strokeLinecap="round" opacity=".8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill={t.tx2}/></svg>
                        <div><div style={{fontSize:".8rem",fontWeight:700,color:t.tx2,lineHeight:1,fontVariantNumeric:"tabular-nums"}}>{remaining.toLocaleString()}</div><div style={{fontSize:".44rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",marginTop:1}}>Restants</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ETA */}
                <div style={{marginTop:8,padding:"5px 10px",borderTop:`1px solid ${acc}15`,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:`${acc}04`,borderRadius:"0 0 8px 8px",marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={acc} strokeWidth="1.5" strokeLinecap="round" opacity=".5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                  <span style={{fontSize:".6rem",color:t.tx3,fontStyle:"italic"}}>{remaining>0?`Fin estimée · ${eta}`:"🎉 Coran complet !"}</span>
                </div>

                {/* Rappels */}
                {!(hist[today()]||0)&&(<div style={{marginTop:7,display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:`${t.bl}15`,borderRadius:8,border:`1px solid ${t.bl}30`,cursor:"pointer"}} onClick={()=>{setPage("quran");const s=SURAHS.find(x=>sPct(x)<100);if(s)doSelect(s);}}><div style={{width:6,height:6,borderRadius:"50%",background:t.bl,animation:"pulse 1.5s infinite"}}/><span style={{fontSize:".63rem",color:t.bl,fontWeight:600,flex:1}}>Aucune mémorisation aujourd'hui — on commence ?</span><span style={{fontSize:".58rem",color:t.bl,opacity:.7}}>→</span></div>)}
                {spacedDue.length>0&&(<div style={{marginTop:6,display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:`${t.rd}15`,borderRadius:8,border:`1px solid ${t.rd}30`,cursor:"pointer"}} onClick={()=>setPage("pages")}><div style={{width:6,height:6,borderRadius:"50%",background:t.rd,animation:"pulse 1.5s infinite"}}/><span style={{fontSize:".63rem",color:t.rd,fontWeight:600,flex:1}}>{spacedDue.length} verset{spacedDue.length>1?"s":""} à réviser aujourd'hui</span><span style={{fontSize:".58rem",color:t.rd,opacity:.7}}>Voir →</span></div>)}
                {bookmark&&(<div style={{marginTop:6,display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:`${acc}10`,borderRadius:8,border:`1px solid ${acc}25`,cursor:"pointer"}} onClick={()=>{setPage("quran");const s=SURAHS.find(x=>x.n===bookmark.sn);if(s)doSelect(s);}}><span style={{fontSize:".7rem",color:acc}}>◈</span><span style={{fontSize:".63rem",color:t.tx,fontWeight:600,flex:1}}>Reprendre : {bookmark.name}</span><span style={{fontSize:".58rem",color:t.tx3}}>→</span></div>)}
                {/* Streak */}
                {memStreak>0&&(<div onClick={()=>setPage("stats")} style={{marginTop:6,display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"rgba(249,115,22,.08)",borderRadius:9,border:"1px solid rgba(249,115,22,.2)",cursor:"pointer"}}><span style={{fontSize:"1.1rem"}}>🔥</span><span style={{fontSize:".7rem",fontWeight:700,color:"#f97316",flex:1}}>{memStreak} jour{memStreak>1?"s":""} de suite</span><span style={{fontSize:".58rem",color:"#f97316",opacity:.7}}>Stats →</span></div>)}
              </div>
            </div>

            {/* Verset du jour condensé */}
            {versetDuJour&&!versetDuJourDismissed&&(
              <div style={{background:`linear-gradient(135deg,${t.acc}12,${t.acc}06)`,borderRadius:12,padding:"14px 16px",border:`1px solid ${t.acc}30`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:".6rem",color:t.acc,textTransform:"uppercase",letterSpacing:2,fontWeight:700}}>Verset du jour</span>
                  <div style={{display:"flex",gap:6}}>
                    <span style={{fontSize:".58rem",color:t.tx3}}>{versetDuJour.surah} · v.{versetDuJour.n}</span>
                    <button onClick={()=>toggleFav(versetDuJour.sn,versetDuJour.n,versetDuJour.ar,versetDuJour.fr,versetDuJour.surah)} style={{background:"none",border:"none",cursor:"pointer",fontSize:".85rem",padding:0,color:isFav(versetDuJour.sn,versetDuJour.n)?t.rd:t.tx3}}>{isFav(versetDuJour.sn,versetDuJour.n)?"❤️":"🤍"}</button>
                    <button onClick={()=>{setVersetDuJourDismissed(true);sv("qvdjdis",today());}} style={{background:"none",border:"none",cursor:"pointer",fontSize:".8rem",padding:0,color:t.tx3,opacity:.6}}>✕</button>
                  </div>
                </div>
                <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.3rem",direction:"rtl",textAlign:"right",lineHeight:2,color:t.tx,cursor:"pointer"}} onClick={()=>{const s=SURAHS.find(x=>x.n===versetDuJour.sn);if(s){doSelect(s);setPage("quran");}}}>{(versetDuJour.ar||"").replace(/<[^>]*>/g,"")}</div>
                {versetDuJour.fr&&<div style={{fontSize:".65rem",color:t.tx2,fontStyle:"italic",lineHeight:1.5,marginTop:4}}>{versetDuJour.fr}</div>}
              </div>
            )}

            {/* Actions rapides */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {
                  icon:(
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2" stroke={t.acc} strokeWidth="1.4"/>
                      <line x1="8" y1="7" x2="16" y2="7" stroke={t.acc} strokeWidth="1.4"/>
                      <line x1="8" y1="11" x2="16" y2="11" stroke={t.acc} strokeWidth="1.4"/>
                      <line x1="8" y1="15" x2="13" y2="15" stroke={t.acc} strokeWidth="1.4"/>
                    </svg>
                  ),
                  label:"Coran",sub:"Reprendre la lecture",action:()=>setPage("quran"),c:t.acc
                },
                {
                  icon:(
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3a9 9 0 1 1-9 9" stroke={spacedDue.length>0?t.rd:t.gr} strokeWidth="1.4"/>
                      <polyline points="3 3 3 9 9 9" stroke={spacedDue.length>0?t.rd:t.gr} strokeWidth="1.4"/>
                      <polyline points="9 12 11 14 15 10" stroke={spacedDue.length>0?t.rd:t.gr} strokeWidth="1.6"/>
                    </svg>
                  ),
                  label:"Réviser",sub:spacedDue.length>0?`${spacedDue.length} verset${spacedDue.length>1?"s":""} dus`:"Tout à jour",action:()=>setPage("pages"),c:spacedDue.length>0?t.rd:t.gr,badge:spacedDue.length
                },
                {
                  icon:(
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke={t.bl} strokeWidth="1.4"/>
                      <polyline points="8 12 11 15 16 9" stroke={t.bl} strokeWidth="1.6"/>
                    </svg>
                  ),
                  label:"Quiz",sub:"Teste ta mémoire",action:()=>setPage("quiz"),c:t.bl
                },
                {
                  icon:(
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2 L12 22" stroke={t.pu} strokeWidth="1.4"/>
                      <path d="M4 6 Q12 2 20 6 L20 18 Q12 22 4 18 Z" stroke={t.pu} strokeWidth="1.4" fill={`${t.pu}10`}/>
                      <path d="M4 6 L4 18" stroke={t.pu} strokeWidth="1.4"/>
                    </svg>
                  ),
                  label:"Mushaf",sub:"Lire page par page",action:()=>setPage("mushaf"),c:t.pu
                },
              ].map((a,i)=>(
                <div key={i} onClick={a.action} style={{background:t.cardBg,border:`1px solid ${t.b1}`,borderRadius:16,padding:"18px 14px",cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",gap:6}} onMouseEnter={e=>{e.currentTarget.style.borderColor=a.c;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${a.c}22`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=t.b1;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                  {a.badge>0&&<div style={{position:"absolute",top:10,right:10,background:t.rd,color:"#fff",borderRadius:99,fontSize:".5rem",fontWeight:800,minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{a.badge}</div>}
                  <div style={{width:44,height:44,borderRadius:12,background:`${a.c}10`,display:"flex",alignItems:"center",justifyContent:"center"}}>{a.icon}</div>
                  <div style={{fontSize:".8rem",fontWeight:700,color:t.tx}}>{a.label}</div>
                  <div style={{fontSize:".62rem",color:t.tx3}}>{a.sub}</div>
                </div>
              ))}
            </div>

            {/* Progression juz */}
            <div className="card">
              <div className="ch"><span className="ct">Progression par Juz</span><button className="tbtn" style={{fontSize:".6rem"}} onClick={()=>setPage("stats")}>Voir tout</button></div>
              <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:6}}>
                {[...new Set(SURAHS.map(s=>s.juz))].sort((a,b)=>a-b).slice(0,5).map(juz=>{
                  const p=juzPct(juz);
                  return(
                    <div key={juz} style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:".65rem",color:t.tx3,width:36,flexShrink:0}}>Juz {juz}</span>
                      <div style={{flex:1,height:6,background:t.b1,borderRadius:99,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${p}%`,background:p===100?t.gr:`linear-gradient(90deg,${t.acc},${t.acc2})`,borderRadius:99,transition:"width .6s"}}/>
                      </div>
                      <span style={{fontSize:".65rem",color:p===100?t.gr:t.acc,fontWeight:700,width:32,textAlign:"right",flexShrink:0}}>{p}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badges récents */}
            {badges.length>0&&(
              <div className="card">
                <div className="ch"><span className="ct">Mes badges</span><span style={{fontSize:".65rem",color:t.acc,fontWeight:700}}>{badges.length} / {BADGE_DEFS.length}</span></div>
                <div style={{display:"flex",gap:8,padding:"10px 14px",flexWrap:"wrap"}}>
                  {BADGE_DEFS.filter(b=>badges.includes(b.id)).map(b=>(
                    <div key={b.id} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",background:`${t.acc}12`,borderRadius:99,border:`1px solid ${t.acc}33`}}>
                      <span style={{fontSize:".85rem"}}>{b.icon}</span>
                      <span style={{fontSize:".62rem",fontWeight:600,color:t.acc}}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dernière activité / Reprendre */}
            {readHistory.length>0&&(()=>{
              const last=readHistory[0];
              const s=SURAHS.find(x=>x.n===last.sn);
              return s?(
                <div className="card" onClick={()=>{doSelect(s);setPage("quran");}} style={{cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=t.acc;e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=t.b1;e.currentTarget.style.transform="";}}>
                  <div style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:40,height:40,borderRadius:10,background:`${t.acc}12`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.acc} strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:".6rem",color:t.tx3,marginBottom:2}}>Reprendre là où tu t'es arrêté</div>
                      <div style={{fontSize:".82rem",fontWeight:700,color:t.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
                      <div style={{fontFamily:"'Amiri',serif",fontSize:".8rem",color:t.tx3,direction:"rtl",textAlign:"right"}}>v.{last.vn} · {s.ar}</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.acc} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              ):null;
            })()}

            {/* Hadith / Citation du jour */}
            {(()=>{
              const hadiths=[
                {ar:"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",fr:"Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",src:"Al-Bukhari"},
                {ar:"مَثَلُ الَّذِي يَقْرَأُ الْقُرْآنَ وَهُوَ حَافِظٌ لَهُ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ",fr:"Celui qui récite le Coran en le connaissant par cœur sera avec les nobles et pieux scribes.",src:"Al-Bukhari & Muslim"},
                {ar:"إِنَّ الَّذِي لَيْسَ فِي جَوْفِهِ شَيْءٌ مِنَ الْقُرْآنِ كَالْبَيْتِ الْخَرِبِ",fr:"Celui qui n'a rien du Coran dans son cœur est comme une maison en ruine.",src:"At-Tirmidhi"},
                {ar:"اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",fr:"Récitez le Coran car il sera un intercesseur pour ses compagnons le Jour du Jugement.",src:"Muslim"},
                {ar:"أَهْلُ الْقُرْآنِ هُمْ أَهْلُ اللَّهِ وَخَاصَّتُهُ",fr:"Les gens du Coran sont les gens d'Allah et Ses élus.",src:"An-Nasa'i"},
              ];
              const h=hadiths[new Date().getDate()%hadiths.length];
              return(
                <div style={{padding:"14px 16px",background:`linear-gradient(135deg,${t.acc}08,${t.acc}04)`,borderRadius:14,border:`1px solid ${t.acc}20`}}>
                  <div style={{fontSize:".54rem",color:t.acc,textTransform:"uppercase",letterSpacing:"2px",fontWeight:700,marginBottom:8}}>Hadith du jour</div>
                  <div style={{fontFamily:"'Amiri',serif",fontSize:"1.05rem",direction:"rtl",textAlign:"right",lineHeight:1.8,color:t.tx,marginBottom:8}}>{h.ar}</div>
                  <div style={{fontSize:".68rem",color:t.tx2,fontStyle:"italic",lineHeight:1.5,marginBottom:6}}>{h.fr}</div>
                  <div style={{fontSize:".56rem",color:t.tx3}}>— {h.src}</div>
                </div>
              );
            })()}

            {/* Prochain objectif */}
            {(()=>{
              const nextS=SURAHS.find(s=>sPct(s)>0&&sPct(s)<100);
              const firstUnstarted=SURAHS.find(s=>sPct(s)===0);
              const target=nextS||firstUnstarted;
              if(!target) return null;
              const pctV=sPct(target);
              return(
                <div className="card" onClick={()=>{doSelect(target);setPage("quran");}} style={{cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
                  <div style={{padding:"12px 14px"}}>
                    <div style={{fontSize:".58rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:8}}>
                      {nextS?"En cours de mémorisation":"Prochaine sourate"}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:40,height:40,borderRadius:10,background:`${t.gr}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:800,color:t.gr,border:`1px solid ${t.gr}30`,flexShrink:0}}>{target.n}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <span style={{fontSize:".8rem",fontWeight:700,color:t.tx}}>{target.name}</span>
                          <span style={{fontFamily:"'Amiri',serif",fontSize:".85rem",color:t.tx3}}>{target.ar}</span>
                        </div>
                        <div style={{height:5,background:t.b1,borderRadius:99,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pctV}%`,background:`linear-gradient(90deg,${t.gr},${t.acc})`,borderRadius:99,transition:"width .6s"}}/>
                        </div>
                        <div style={{fontSize:".58rem",color:t.tx3,marginTop:3}}>{sMem(target)}/{target.v} versets · {target.v-sMem(target)} restants</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* CORAN */}
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
                  {/* Mini grid of pages in left panel */}
                  <div style={{padding:"8px",display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3,overflowY:"auto"}}>
                    {Array.from({length:604},(_,i)=>i+1).map(pg=>{
                      const isRead=pageRead[String(pg)];
                      const isCur=(mushafPage||1)===pg;
                      const surahEntry=Object.entries(SURAH_PAGE).find(([_,p])=>p===pg);
                      return (
                        <div key={pg}
                          title={surahEntry?`Sourate ${surahEntry[0]} — page ${pg}`:`Page ${pg}`}
                          style={{height:28,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:".55rem",fontWeight:700,
                            border:`1px solid ${isCur?t.acc:surahEntry?`${t.acc}55`:isRead?t.gr:t.b1}`,
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
                        {/* Hint glissière visible au hover desktop */}
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

            {/* Verse panel */}
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

                  {/* Audio */}
                  <div style={{padding:"10px 14px",background:t.s1,borderBottom:`1px solid ${t.b1}`,display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:"1rem",flexShrink:0}}>🎙️</span>
                      <div style={{flex:1,position:"relative"}}>
                        <select value={rec.id} onChange={e=>setRec(RECITERS.find(r=>r.id===e.target.value)||RECITERS[0])} style={{width:"100%",appearance:"none",WebkitAppearance:"none",background:t.s2,border:`1.5px solid ${t.b1}`,borderRadius:10,padding:"8px 30px 8px 12px",fontSize:".72rem",color:t.tx,fontWeight:500,cursor:"pointer",outline:"none"}}>
                          {RECITERS.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:t.tx3,fontSize:".75rem",pointerEvents:"none"}}>▾</span>
                      </div>
                      <button onClick={()=>{
                        if(!verses.length)return;
                        stopListening();
                        setSpeechScore(null);
                        setContinuousMode(false);
                        setContinuousIdx(0);
                        setRecitModal(true);
                      }} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,background:`${t.acc}18`,border:`1px solid ${t.acc}`,borderRadius:10,padding:"7px 14px",color:t.acc,fontSize:".7rem",fontWeight:700,cursor:"pointer",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.background=`${t.acc}30`;}} onMouseLeave={e=>{e.currentTarget.style.background=`${t.acc}18`;}}>
                        🎤 Récitation
                      </button>
                    <button onClick={()=>{if(playlistActive&&playlist[0]?.sn===selS.n){setPlaylistActive(false);setPlaying(null);if(audioRef.current)audioRef.current.pause();}else if(verses.length>0)startPlaylist(selS.n,verses,1);}} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,background:playlistActive&&playlist[0]?.sn===selS.n?"#e53935":t.acc,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontSize:".72rem",fontWeight:700,cursor:"pointer",boxShadow:`0 2px 8px ${t.acc}44`,transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>{playlistActive&&playlist[0]?.sn===selS.n?"■ Stop":"▶ Sourate"}</button>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:".6rem",color:t.tx3}}>Répét.</span>
                      {[1,3,5,10].map(n=>(<button key={n} className={`tbtn ${loopCount===n&&!loopInfinite?"on":""}`} onClick={()=>{setLoopCount(n);setLoopInfinite(false);}} style={{minWidth:26,padding:"3px 6px"}}>{n}×</button>))}
                      <button className={`tbtn ${loopInfinite?"on":""}`} onClick={()=>setLoopInfinite(p=>!p)} style={{minWidth:26,padding:"3px 8px",fontWeight:700,fontSize:".8rem",borderColor:loopInfinite?t.acc:t.b2,color:loopInfinite?t.acc:t.tx3}}>∞</button>
                      {!loopInfinite&&loopCurrent>1&&<span style={{fontSize:".6rem",color:t.acc,fontWeight:700}}>{loopCurrent}/{loopCount}</span>}
                      {loopInfinite&&playing!==null&&<span style={{fontSize:".6rem",color:t.acc,fontWeight:700,animation:"pulse 1s infinite"}}>∞ en boucle</span>}
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

                  {playing!==null&&(<div className="arow"><button className="vbtn snd" style={{flexShrink:0}} onClick={()=>doPlay(playing)}>{audioPlaying?"⏸":"▶ "+playing}</button><span style={{fontSize:".62rem",color:t.tx2,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selS?.name} · v.{playing} · {rec.name}</span><button className="tbtn" style={{flexShrink:0}} onClick={()=>{setPlaying(null);partialPlayRef.current=null;if(audioRef.current){audioRef.current.pause();audioRef.current.src="";}}}>✕</button></div>)}

                  {/* Banner mode récitation continue */}
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
                                    :(<><TajwidSpan text={v.ar} enabled={showTj} tjc={tjc}/><span className="vmark"> ﴿{v.n}﴾</span></>)                                }
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
                              <button className={`vbtn ${isMem?"mem":""}`} onClick={()=>toggleV(selS.n,v.n,v.ar)}>{isMem?<><Icons.Check size={10}/>Mémorisé</>:<>+ Mémoriser</>}</button>
                              <button className="vbtn snd" onClick={()=>{setLoopCurrent(1);doPlay(v.n);addToHistory(selS.n,v.n);}}><Icons.Play size={10}/>{isPl?"Stop":"Écouter"}</button>
                              <button className={`vbtn ${isFav(selS.n,v.n)?"mem":""}`} onClick={()=>toggleFav(selS.n,v.n,v.ar,v.fr,selS.name)}><Icons.Heart size={10} filled={isFav(selS.n,v.n)}/>{isFav(selS.n,v.n)?"Favori ✓":"Favori"}</button>
                              {(()=>{const words=(v.ar||"").replace(/<[^>]*>/g,"").split(/\s+/).filter(Boolean);return words.length>4&&(<button className="vbtn" style={{borderColor:t.bl,color:t.bl}} onClick={()=>setPartialVerse({sn:selS.n,vn:v.n,words,from:0,to:words.length-1,fr:v.fr})}>✂ Partiel</button>);})()}
                              <button className={`vbtn ${notes[`${selS.n}_${v.n}`]?"on":""}`} style={notes[`${selS.n}_${v.n}`]?{borderColor:t.pu,color:t.pu}:{}} onClick={()=>{setEditingNote(`${selS.n}_${v.n}`);setNoteText(notes[`${selS.n}_${v.n}`]||"");}}>Note{notes[`${selS.n}_${v.n}`]?" ✓":""}</button>
<button className="vbtn" onClick={()=>setShareVerse({sn:selS.n,vn:v.n,ar:v.ar,fr:v.fr,surah:selS.name,surahAr:selS.ar})}><Icons.Share size={10}/>Partager</button><button className="vbtn" onClick={()=>{wbwVerseRef.current={sn:selS.n,vn:v.n};setWbwOpen(true);}}>📖 Mot à mot</button>                              {speechSupported&&(
                              <button
                                className="vbtn"
                                style={{
                                  borderColor: speechListening&&speechVerseTarget?.vn===v.n?"#e91e63":
                                               speechCountdown>0&&speechVerseTarget?.vn===v.n?"#ff9800":
                                               speechScore?.pct>=80&&speechVerseTarget?.vn===v.n?t.gr:
                                               speechScore&&speechVerseTarget?.vn===v.n?t.rd:t.b2,
                                  color: speechListening&&speechVerseTarget?.vn===v.n?"#e91e63":
                                         speechCountdown>0&&speechVerseTarget?.vn===v.n?"#ff9800":
                                         speechScore?.pct>=80&&speechVerseTarget?.vn===v.n?t.gr:
                                         speechScore&&speechVerseTarget?.vn===v.n?t.rd:t.tx3,
                                  background: speechListening&&speechVerseTarget?.vn===v.n?"rgba(233,30,99,.08)":"transparent",
                                  fontWeight:600,
                                  minWidth:80,
                                  position:"relative",
                                  overflow:"hidden",
                                }}
                                onClick={()=>{
                                  if(speechListening&&speechVerseTarget?.vn===v.n) stopListening();
                                  else if(speechCountdown>0) {clearInterval(countdownRef.current);setSpeechCountdown(0);}
                                  else {setSpeechScore(null);startListening(v.ar,v.n);}
                                }}>
                                {/* Cercle countdown SVG */}
                                {speechCountdown>0&&speechVerseTarget?.vn===v.n&&(
                                  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="48" fill="none" stroke="#ff9800" strokeWidth="3" strokeDasharray={`${(3-speechCountdown)/3*301} 301`} strokeLinecap="round" transform="rotate(-90 50 50)" opacity=".6"/>
                                  </svg>
                                )}
                                 {speechListening&&speechVerseTarget?.vn===v.n
                                   ? (<>
                                       {speechResult
                                         ?<span style={{fontFamily:"'Amiri',serif",direction:"rtl",fontSize:".9rem",color:"#e91e63",display:"block",textAlign:"center"}}>{speechResult}</span>
                                         :<><span style={{animation:"pulse .6s infinite",display:"inline-block"}}>●</span> Écoute…</>
                                       }
                                     </>)
                                  : speechCountdown>0&&speechVerseTarget?.vn===v.n
                                    ? `${speechCountdown}…`
                                    : speechScore?.pct>=80&&speechVerseTarget?.vn===v.n
                                      ? `✓ ${speechScore.pct}%`
                                      : speechScore&&speechVerseTarget?.vn===v.n
                                        ? `↺ ${speechScore.pct}%`
                                        : "🎤 Réciter"
                                }
                              </button>
                            )}
                              {/* Feedback inline mot par mot */}
                              {speechScore&&speechVerseTarget?.vn===v.n&&(
                                <div style={{width:"100%",marginTop:8,padding:"12px 14px",background:t.s2,borderRadius:10,border:`1px solid ${speechScore.pct>=80?t.gr:speechScore.pct>=50?`${t.acc}`:t.rd}44`,animation:"fadeIn .25s ease"}}>
                                  {/* Barre de score */}
                                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                                    <div style={{flex:1,height:6,background:t.b1,borderRadius:99,overflow:"hidden"}}>
                                      <div style={{height:"100%",width:`${speechScore.pct}%`,background:speechScore.pct>=80?t.gr:speechScore.pct>=50?t.acc:t.rd,borderRadius:99,transition:"width .5s"}}/>
                                    </div>
                                    <span style={{fontSize:".75rem",fontWeight:800,color:speechScore.pct>=80?t.gr:speechScore.pct>=50?t.acc:t.rd,minWidth:36,textAlign:"right"}}>{speechScore.pct}%</span>
                                    <button style={{background:"none",border:"none",color:t.tx3,cursor:"pointer",fontSize:".85rem",padding:"0 2px"}} onClick={()=>setSpeechScore(null)}>✕</button>
                                  </div>
                                  {/* Texte arabe coloré mot par mot */}
                                  {/* Transcription en direct */}
                                  <div style={{padding:"6px 10px",background:t.s3,borderRadius:7,marginBottom:8,direction:"rtl",textAlign:"right"}}>
                                    <div style={{fontSize:".55rem",color:t.tx3,marginBottom:2,textAlign:"left",direction:"ltr",fontVariantCaps:"all-small-caps",letterSpacing:"1px"}}>Tu as récité</div>
                                    <div style={{fontFamily:"'Amiri',serif",fontSize:"1.05rem",color:t.tx,lineHeight:1.8}}>{speechResult||"—"}</div>
                                  </div>
                                  {speechScore.analysis&&(
                                    <div style={{direction:"rtl",textAlign:"right",fontFamily:"'Amiri Quran',serif",fontSize:"1.3rem",lineHeight:2.2,marginBottom:8}}>
                                      {speechScore.analysis.map((w,wi)=>(
                                        <span key={wi} style={{
                                          color:w.status==="ok"?t.gr:w.status==="wrong"?"#e91e63":"#888",
                                          fontWeight:w.status==="wrong"?700:400,
                                          textDecoration:w.status==="wrong"?"underline":"none",
                                          cursor:w.status==="wrong"?"pointer":"default",
                                          display:"inline",
                                        }}
                                        title={w.status==="wrong"?"Appuie pour écouter":""}
                                        onClick={()=>{ if(w.status==="wrong") doPlay(v.n); }}>
                                          {w.word}{" "}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {/* Actions */}
                                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                                    <button className="vbtn" style={{borderColor:"#e91e63",color:"#e91e63"}} onClick={()=>{setSpeechScore(null);startListening(v.ar,v.n);}}>↺ Réessayer</button>
                                    <button className="vbtn snd" onClick={()=>doPlay(v.n)}>▶ Écouter</button>
                                    {speechScore.pct>=50&&(
                                      <button className="vbtn" style={{borderColor:t.gr,color:t.gr}} onClick={()=>{markSpaced(selS.n,v.n,speechScore.pct>=85?5:speechScore.pct>=70?4:3);setSpeechScore(null);}}>
                                        ✓ Sauvegarder {speechScore.pct>=85?"⭐⭐":"⭐"}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                              {isMem&&(<button className={`vbtn ${isDue?"":"snd"}`} style={isDue?{borderColor:t.rd,color:t.rd}:{}} onClick={()=>markSpaced(selS.n,v.n)}>{isDue?"Révision due":"Révisé"}</button>)}
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

        {/* MUSHAF */}
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
              <div className="ch" style={{flexDirection:"column",gap:8,alignItems:"stretch"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span className="ct">Page {mushafPage||1} / 604</span>
                  <div style={{display:"flex",gap:6}}>
                    <button className="tbtn" onClick={()=>setMushafPage(p=>Math.max(1,(p||1)-1))}>← Précédente</button>
                    <button className={`tbtn ${pageRead[String(mushafPage||1)]?"on":""}`} onClick={()=>togglePage(mushafPage||1)}>{pageRead[String(mushafPage||1)]?"Lue ✓":"Marquer lue"}</button>
                    <button className="tbtn" onClick={()=>setMushafPage(p=>Math.min(604,(p||1)+1))}>Suivante →</button>
                  </div>
                </div>
                <button onClick={()=>{setMushafSurahModal(true);setMushafSurahSearch("");}} style={{width:"100%",padding:"9px 14px",background:t.s2,border:`1px solid ${t.b2}`,borderRadius:10,color:t.tx2,fontSize:".75rem",cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=t.acc;e.currentTarget.style.color=t.tx;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=t.b2;e.currentTarget.style.color=t.tx2;}}>
                  <span style={{fontSize:"1rem"}}>📖</span>
                  <span style={{flex:1,textAlign:"left"}}>Aller à une sourate…</span>
                  <span style={{fontSize:".7rem",opacity:.5}}>▼</span>
                </button>
              </div>
              <MushafPage page={mushafPage||1} t={t} tjc={tjc} arFont={arFont} edition={MUSHAF_EDITIONS.find(e=>e.id===mushafEdition)||MUSHAF_EDITIONS[0]} fullscreen={mushafFullscreen} onToggleFullscreen={()=>setMushafFullscreen(f=>!f)} onNext={()=>goToPage(Math.min(604,(mushafPage||1)+1))} onPrev={()=>goToPage(Math.max(1,(mushafPage||1)-1))}/>
            </div>
          </div>
        )}

        {/* PAGES */}
        {page==="pages"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14,overflow:"hidden"}}>

            {/* Stats rapides */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,width:"100%",boxSizing:"border-box"}}>
              {[
                {l:"En révision",v:Object.values(revFlags).filter(f=>f==="active").length,c:t.acc,icon:"◈"},
                {l:"Maîtrisées",v:Object.values(revFlags).filter(f=>f==="mastered").length,c:t.gr,icon:"✦"},
                {l:"En pause",v:Object.values(revFlags).filter(f=>f==="paused").length,c:t.tx3,icon:"◆"},
              ].map((k,i)=>(
                <div key={i} style={{background:t.cardBg,border:`1px solid ${t.b1}`,borderRadius:12,padding:"10px 6px",textAlign:"center",minWidth:0,overflow:"hidden"}}>
                  <div style={{fontSize:"1rem",color:k.c,marginBottom:2}}>{k.icon}</div>
                  <div style={{fontSize:"1.2rem",fontWeight:800,color:k.c}}>{k.v}</div>
                  <div style={{fontSize:".5rem",color:t.tx3,textTransform:"uppercase",letterSpacing:".5px",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{k.l}</div>
                </div>
              ))}
            </div>

            {/* Sourates en révision active — affichage prioritaire */}
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
                      {/* Progress bar */}
                      <div style={{height:5,background:t.b1,borderRadius:99,overflow:"hidden",marginBottom:8}}>
                        <div style={{height:"100%",width:`${memPct}%`,background:memPct===100?t.gr:`linear-gradient(90deg,${t.acc},${t.acc2})`,borderRadius:99,boxShadow:memPct===100?`0 0 6px ${t.gr}66`:`0 0 4px ${t.acc}44`}}/>
                      </div>
                      {/* Actions */}
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

            {/* Ajouter des sourates à réviser */}
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

            {/* Sourates maîtrisées */}
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

            {/* Heatmap progrès */}
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

        {/* KHATMA */}
        {page==="khatma"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {!activeKhatma?(
              <>
                {/* Hero d'intro */}
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

                {/* Formulaire création */}
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
                            {/* Bullet élégant */}
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

                {/* Khatmas précédentes */}
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
                {/* Header card */}
                <div style={{background:`linear-gradient(135deg,${t.s2},${t.s3})`,borderRadius:16,padding:"20px 18px",border:`1px solid ${t.b1}`,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:`radial-gradient(circle,${t.acc}10,transparent 70%)`,borderRadius:"0 16px 0 0",pointerEvents:"none"}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                    <div>
                      <div style={{fontFamily:"'Amiri',serif",fontSize:"1.6rem",color:t.acc,lineHeight:1,marginBottom:4}}>{activeKhatma.name}</div>
                      <div style={{fontSize:".65rem",color:t.tx3}}>Depuis le {new Date(activeKhatma.startDate).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div>
                    </div>
                    <button onClick={()=>setActiveKhatma(null)} style={{background:"transparent",border:`1px solid ${t.rd}44`,color:t.rd,borderRadius:8,padding:"5px 10px",fontSize:".65rem",cursor:"pointer",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.background=`${t.rd}12`;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>Terminer</button>
                  </div>
                  {/* Big progress */}
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
                  {/* KPIs */}
                  <div className="kh-stats">
                    <div className="khs"><div className="khs-v">{Object.values(activeKhatma.log).filter(Boolean).length}</div><div className="khs-l">Jours ✓</div></div>
                    <div className="khs"><div style={{fontSize:"1.4rem"}}>🔥</div><div className="khs-v">{khatmaStreak(activeKhatma)}j</div><div className="khs-l">Série ◈</div></div>
                    <div className="khs"><div className="khs-v" style={{color:t.rd}}>{Math.max(0,activeKhatma.totalDays-Object.values(activeKhatma.log).filter(Boolean).length)}</div><div className="khs-l">Restants</div></div>
                  </div>
                  {/* Bouton Lire maintenant */}
                  <div style={{marginTop:14,display:"flex",gap:8}}>
                    <button onClick={()=>{
                      // Reprendre à la dernière page lue ou calculer la page du jour
                      const doneCount=Object.values(activeKhatma.log).filter(Boolean).length;
                      const pagesPerDay=Math.ceil(604/activeKhatma.totalDays);
                      const lastPage=activeKhatma.lastPage||Math.min(604,doneCount*pagesPerDay+1);
                      setMushafPage(lastPage);
                      setPage("mushaf");
                    }} style={{flex:1,padding:"10px",background:`linear-gradient(135deg,${t.acc},${t.acc2})`,border:"none",borderRadius:10,color:"#000",fontWeight:700,fontSize:".8rem",cursor:"pointer"}}>
                      📖 Lire maintenant {activeKhatma.lastPage?`(p.${activeKhatma.lastPage})`:""}
                    </button>
                    <button onClick={()=>{
                      const updated={...activeKhatma,log:{...activeKhatma.log,[today()]:true},lastPage:(mushafPage||1)};
                      setKhatmas(p=>p.map(x=>x.id===activeKhatma.id?updated:x));
                      setActiveKhatma(updated);
                      togglePage(mushafPage||1);
                    }} style={{padding:"10px 14px",background:`${t.gr}18`,border:`1px solid ${t.gr}44`,borderRadius:10,color:t.gr,fontWeight:700,fontSize:".8rem",cursor:"pointer"}}>
                      👍 Journée lue
                    </button>
                  </div>
                </div>

                {/* Calendrier */}
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

                {/* Progression Coran */}
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

          {/* ═══ KHATMA COLLECTIVE ═══ */}
          <div className="card" style={{marginTop:4}}>
            <div className="ch">
              <span className="ct">🤝 Khatma collective</span>
              <button className="tbtn" style={{borderColor:t.acc,color:t.acc,fontSize:".6rem"}} onClick={()=>setShowCollective(p=>!p)}>{showCollective?"Fermer":"+ Nouvelle"}</button>
            </div>
            {showCollective&&(
              <div style={{padding:"14px 16px",borderBottom:`1px solid ${t.b1}`,display:"flex",flexDirection:"column",gap:12}}>
                <div>
                  <div style={{fontSize:".65rem",color:t.tx3,marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Créer une khatma de groupe</div>
                  <div style={{display:"flex",gap:8}}>
                    <input className="sinp" style={{flex:1}} placeholder="Nom du groupe…" value={newColKhatmaName} onChange={e=>setNewColKhatmaName(e.target.value)}/>
                    <button className="tbtn" style={{borderColor:t.acc,color:t.acc,flexShrink:0}} onClick={createCollectiveKhatma}>Créer</button>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:1,background:t.b1}}/><span style={{fontSize:".6rem",color:t.tx3}}>ou rejoindre</span><div style={{flex:1,height:1,background:t.b1}}/></div>
                <div style={{display:"flex",gap:8}}>
                  <input className="sinp" style={{flex:1,textTransform:"uppercase",letterSpacing:2}} placeholder="Code du groupe…" value={joinCode} onChange={e=>setJoinCode(e.target.value)} maxLength={6}/>
                  <button className="tbtn" style={{borderColor:t.gr,color:t.gr,flexShrink:0}} onClick={joinCollectiveKhatma}>Rejoindre</button>
                </div>
              </div>
            )}
            {activeColKhatma?(
              <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontWeight:700,color:t.tx,fontSize:".9rem"}}>{activeColKhatma.name}</div>
                    <div style={{fontSize:".62rem",color:t.tx3,marginTop:2}}>{activeColKhatma.members.length} membre{activeColKhatma.members.length>1?"s":""} · Code : <span style={{fontFamily:"monospace",color:t.acc,fontWeight:700,letterSpacing:2}}>{activeColKhatma.code}</span></div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"1.3rem",fontWeight:800,color:colPct===100?t.gr:t.acc}}>{colPct}%</div>
                    <div style={{fontSize:".58rem",color:t.tx3}}>{colJuzCovered.length}/30 juz</div>
                  </div>
                </div>
                <div style={{height:8,background:t.b1,borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${colPct}%`,background:colPct===100?t.gr:`linear-gradient(90deg,${t.acc},${t.acc2})`,borderRadius:99,transition:"width .6s",boxShadow:`0 0 8px ${t.acc}55`}}/>
                </div>
                <div>
                  <div style={{fontSize:".6rem",color:t.tx3,marginBottom:8}}>Coche les juz que TU as lus — les autres membres font de même</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:5}}>
                    {Array.from({length:30},(_,i)=>i+1).map(juz=>{
                      const myUid=user?.id||"local";
                      const myMember=activeColKhatma.members.find(m=>m.uid===myUid);
                      const isMine=myMember?.juzDone.includes(juz);
                      const isCovered=activeColKhatma.members.some(m=>m.juzDone.includes(juz));
                      return(
                        <div key={juz} onClick={()=>markColJuz(juz)} style={{aspectRatio:"1",borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",border:`2px solid ${isMine?t.acc:isCovered?t.gr+"66":t.b2}`,background:isMine?`${t.acc}20`:isCovered?`${t.gr}12`:t.s2,transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
                          <span style={{fontSize:".62rem",fontWeight:700,color:isMine?t.acc:isCovered?t.gr:t.tx3}}>{juz}</span>
                          {isCovered&&!isMine&&<span style={{fontSize:".42rem",color:t.gr,lineHeight:1}}>✓</span>}
                          {isMine&&<span style={{fontSize:".42rem",color:t.acc,lineHeight:1}}>●</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
                    {[[t.acc,"Tes juz"],[t.gr,"Autre membre"],["transparent","Non couvert"]].map(([c,l])=>(
                      <div key={l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:3,background:c,border:`1.5px solid ${c==="transparent"?t.b2:c}`}}/><span style={{fontSize:".58rem",color:t.tx3}}>{l}</span></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{fontSize:".65rem",color:t.tx3,marginBottom:8,textTransform:"uppercase",letterSpacing:"1px"}}>Membres</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {activeColKhatma.members.map((m,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:t.s2,borderRadius:10,border:`1px solid ${t.b1}`}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${t.acc},${t.acc2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",fontWeight:700,color:"#000",flexShrink:0}}>{m.name[0].toUpperCase()}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:".75rem",fontWeight:600,color:t.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}{m.uid===(user?.id||"local")&&" (moi)"}</div>
                          <div style={{fontSize:".58rem",color:t.tx3}}>{m.juzDone.length} juz lus · vu {m.lastSeen===today()?"aujourd'hui":m.lastSeen}</div>
                        </div>
                        <div style={{fontSize:".75rem",fontWeight:700,color:t.acc,flexShrink:0}}>{Math.round(m.juzDone.length/30*100)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
                {colPct===100&&(
                  <div style={{padding:"14px",background:`${t.gr}15`,borderRadius:12,border:`1px solid ${t.gr}44`,textAlign:"center"}}>
                    <div style={{fontSize:"1.5rem",marginBottom:4}}>🌿</div>
                    <div style={{fontFamily:"'Amiri',serif",fontSize:"1rem",color:t.gr}}>Khatma complète !</div>
                    <div style={{fontSize:".7rem",color:t.tx2,marginTop:4}}>بارك الله فيكم جميعاً</div>
                  </div>
                )}
                <button onClick={()=>{const other=collectiveKhatmas.filter(k=>k.id!==activeColKhatma.id);setActiveColKhatma(other[0]||null);}} style={{background:"none",border:`1px solid ${t.b2}`,borderRadius:8,padding:"7px",color:t.tx3,fontSize:".65rem",cursor:"pointer"}}>Voir d'autres khatmas</button>
              </div>
            ):(
              <div style={{padding:"20px 16px",textAlign:"center",color:t.tx3,fontSize:".75rem"}}>
                <div style={{fontSize:"1.8rem",marginBottom:8}}>🤝</div>
                Crée ou rejoins une khatma collective pour lire le Coran à plusieurs. Chaque membre couvre des juz différents jusqu'à la khatma complète.
              </div>
            )}
          </div>
          </div>
        )}

        {/* COMMUNAUTÉ */}
        {page==="communaute"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* Favoris */}
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
            {/* Listes */}
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
            {/* Historique */}
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

        {/* QUIZ */}
        {page==="quiz"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="card">
              <div className="ch">
                <span className="ct">🎯 Quiz de mémorisation</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:".65rem",color:t.tx3}}>{quizScore.correct}/{quizScore.total}</span>
                  <button className="tbtn" onClick={()=>setQuizScore({correct:0,total:0,wrongs:[]})}>Reset</button>
                </div>
              </div>
              <div style={{padding:12}}>
                {/* Mode */}
                <div style={{display:"flex",gap:6,marginBottom:10}}>
                  {[["surah","Quelle sourate ?"],["complete","Complète le verset"]].map(([m,l])=>(
                    <button key={m} onClick={()=>{setQuizMode(m);setQuizQ(null);setQuizAnswer(null);}} style={{flex:1,padding:"8px",borderRadius:10,border:`1.5px solid ${quizMode===m?t.acc:t.b2}`,background:quizMode===m?`${t.acc}15`:t.s2,color:quizMode===m?t.acc:t.tx2,fontSize:".72rem",cursor:"pointer",fontWeight:quizMode===m?700:400}}>{l}</button>
                  ))}
                </div>
                {/* Filtre source */}
                <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
                  <button onClick={()=>{setQuizFilter("memorized");setQuizFilterSurah(null);setQuizQ(null);}} style={{padding:"4px 10px",borderRadius:99,border:`1px solid ${quizFilter==="memorized"&&!quizFilterSurah?t.acc:t.b2}`,background:quizFilter==="memorized"&&!quizFilterSurah?`${t.acc}15`:t.s2,color:quizFilter==="memorized"&&!quizFilterSurah?t.acc:t.tx3,fontSize:".62rem",cursor:"pointer",fontWeight:600}}>Mes mémorisés</button>
                  <button onClick={()=>{setQuizFilter("all");setQuizFilterSurah(null);setQuizQ(null);}} style={{padding:"4px 10px",borderRadius:99,border:`1px solid ${quizFilter==="all"&&!quizFilterSurah?t.acc:t.b2}`,background:quizFilter==="all"&&!quizFilterSurah?`${t.acc}15`:t.s2,color:quizFilter==="all"&&!quizFilterSurah?t.acc:t.tx3,fontSize:".62rem",cursor:"pointer"}}>Tout</button>
                  <select value={quizFilterSurah||""} onChange={e=>{const v=+e.target.value||null;setQuizFilterSurah(v);setQuizFilter(v?"surah":"memorized");setQuizQ(null);}} style={{padding:"4px 8px",borderRadius:99,border:`1px solid ${quizFilterSurah?t.acc:t.b2}`,background:quizFilterSurah?`${t.acc}15`:t.s2,color:quizFilterSurah?t.acc:t.tx3,fontSize:".62rem",cursor:"pointer",outline:"none"}}>
                    <option value="">Par sourate…</option>
                    {SURAHS.filter(s=>Q[s.n]?.length>0).map(s=><option key={s.n} value={s.n}>{s.name}</option>)}
                  </select>
                </div>

                {!quizQ&&(
                  <div style={{textAlign:"center",padding:"24px 20px"}}>
                    <div style={{fontSize:"3rem",marginBottom:12}}>🎯</div>
                    <div style={{fontSize:".85rem",color:t.tx,fontWeight:600,marginBottom:6}}>Teste ta mémorisation</div>
                    <div style={{fontSize:".7rem",color:t.tx3,marginBottom:20}}>{quizFilter==="memorized"&&!quizFilterSurah?"Quiz sur tes versets mémorisés":quizFilterSurah?`Quiz sur ${SURAHS.find(s=>s.n===quizFilterSurah)?.name}`:"Quiz sur tout le Coran embarqué"}</div>
                    <button onClick={()=>generateQuiz(quizFilterSurah,quizFilter)} style={{padding:"12px 28px",background:`linear-gradient(135deg,${t.acc},${t.acc2})`,border:"none",borderRadius:12,color:"#000",fontWeight:800,fontSize:".85rem",cursor:"pointer"}}>▶ Commencer</button>
                  </div>
                )}

                {quizQ&&(
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    {quizMode==="surah"&&(
                      <>
                        <div style={{background:t.s2,borderRadius:12,padding:"16px",border:`1px solid ${t.b1}`}}>
                          <div style={{fontSize:".6rem",color:t.tx3,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Verset {quizQ.n}</div>
                          <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.6rem",direction:"rtl",textAlign:"right",lineHeight:2,color:t.tx}}>{quizQ.ar?.replace(/<[^>]*>/g,"")}</div>
                          {quizAnswer&&quizQ.fr&&<div style={{fontSize:".72rem",color:t.tx2,marginTop:8,fontStyle:"italic"}}>{quizQ.fr}</div>}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          {quizChoices.map(s=>{
                            const isCorrect=s.n===quizQ.sn;
                            const isChosen=quizAnswer===s.n;
                            const bg=quizAnswer?isCorrect?`${t.gr}20`:isChosen?`${t.rd}20`:t.s2:t.s2;
                            const border=quizAnswer?isCorrect?`2px solid ${t.gr}`:isChosen?`2px solid ${t.rd}`:`1px solid ${t.b1}`:`1px solid ${t.b2}`;
                            return(
                              <button key={s.n} onClick={()=>{
                                if(quizAnswer)return;
                                setQuizAnswer(s.n);
                                const correct=s.n===quizQ.sn;
                                setQuizScore(p=>({...p,correct:p.correct+(correct?1:0),total:p.total+1,wrongs:correct?p.wrongs:[...p.wrongs,{q:quizQ,chosen:s.n,correct:quizQ.sn}]}));
                              }} style={{padding:"10px 8px",borderRadius:10,border,background:bg,cursor:quizAnswer?"default":"pointer",transition:"all .2s",textAlign:"left"}}>
                                <div style={{fontSize:".72rem",fontWeight:600,color:quizAnswer?isCorrect?t.gr:isChosen?t.rd:t.tx2:t.tx}}>{s.name}</div>
                                <div style={{fontFamily:"'Amiri',serif",fontSize:".85rem",color:quizAnswer?isCorrect?t.gr:isChosen?t.rd:t.tx3:t.tx3,direction:"rtl",textAlign:"right"}}>{s.ar}</div>
                              </button>
                            );
                          })}
                        </div>
                        {quizAnswer&&(
                          <div style={{display:"flex",flexDirection:"column",gap:8}}>
                            <div style={{textAlign:"center",padding:"10px",background:quizAnswer===quizQ.sn?`${t.gr}15`:`${t.rd}15`,borderRadius:10,border:`1px solid ${quizAnswer===quizQ.sn?t.gr:t.rd}`,color:quizAnswer===quizQ.sn?t.gr:t.rd,fontWeight:700,fontSize:".8rem"}}>
                              {quizAnswer===quizQ.sn?"✓ Bonne réponse ! 🌟":`✗ C'était ${SURAHS.find(s=>s.n===quizQ.sn)?.name} · v.${quizQ.n}`}
                            </div>
                            <button onClick={()=>generateQuiz(quizFilterSurah,quizFilter)} style={{padding:"11px",background:`linear-gradient(135deg,${t.acc},${t.acc2})`,border:"none",borderRadius:10,color:"#000",fontWeight:700,fontSize:".8rem",cursor:"pointer"}}>Question suivante →</button>
                          </div>
                        )}
                      </>
                    )}
                    {quizMode==="complete"&&(
                      <>
                        <div style={{background:t.s2,borderRadius:12,padding:"16px",border:`1px solid ${t.b1}`}}>
                          <div style={{fontSize:".6rem",color:t.tx3,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{SURAHS.find(s=>s.n===quizQ.sn)?.name} · v.{quizQ.n}</div>
                          <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.4rem",direction:"rtl",textAlign:"right",lineHeight:2,color:t.tx}}>
                            {(quizQ.ar?.replace(/<[^>]*>/g,"")||"").split(" ").slice(0,3).join(" ")}
                            <span style={{color:t.tx3}}> …</span>
                          </div>
                          {quizQ.fr&&<div style={{fontSize:".7rem",color:t.tx3,marginTop:6,fontStyle:"italic"}}>{quizQ.fr?.split(" ").slice(0,6).join(" ")}…</div>}
                        </div>
                        {!quizAnswer?(
                          <button onClick={()=>setQuizAnswer("shown")} style={{padding:"11px",background:t.s2,border:`1px solid ${t.b2}`,borderRadius:10,color:t.tx2,fontWeight:600,fontSize:".8rem",cursor:"pointer"}}>👁 Révéler la suite</button>
                        ):(
                          <div style={{display:"flex",flexDirection:"column",gap:8}}>
                            <div style={{background:t.s2,borderRadius:12,padding:"16px",border:`1px solid ${t.acc}44`}}>
                              <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.4rem",direction:"rtl",textAlign:"right",lineHeight:2,color:t.acc}}>{quizQ.ar?.replace(/<[^>]*>/g,"")}</div>
                              {quizQ.fr&&<div style={{fontSize:".72rem",color:t.tx2,marginTop:8,fontStyle:"italic"}}>{quizQ.fr}</div>}
                            </div>
                            <div style={{display:"flex",gap:8}}>
                              <button onClick={()=>{setQuizScore(p=>({...p,correct:p.correct+1,total:p.total+1}));generateQuiz(quizFilterSurah,quizFilter);}} style={{flex:1,padding:"11px",background:`${t.gr}20`,border:`1px solid ${t.gr}`,borderRadius:10,color:t.gr,fontWeight:700,fontSize:".8rem",cursor:"pointer"}}>✓ Je savais</button>
                              <button onClick={()=>{setQuizScore(p=>({...p,total:p.total+1,wrongs:[...p.wrongs,{q:quizQ,chosen:null,correct:quizQ.sn}]}));generateQuiz(quizFilterSurah,quizFilter);}} style={{flex:1,padding:"11px",background:`${t.rd}15`,border:`1px solid ${t.rd}`,borderRadius:10,color:t.rd,fontWeight:700,fontSize:".8rem",cursor:"pointer"}}>✗ À revoir</button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Score card avec détail des erreurs */}
            {quizScore.total>0&&(
              <div className="card">
                <div className="ch"><span className="ct">📊 Session en cours</span></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,padding:"12px 12px 8px",width:"100%",boxSizing:"border-box"}}>
                  {[
                    {v:quizScore.correct,l:"Correctes",c:t.gr},
                    {v:quizScore.total-quizScore.correct,l:"À revoir",c:t.rd},
                    {v:quizScore.total>0?Math.round(quizScore.correct/quizScore.total*100)+"%":"—",l:"Score",c:t.acc},
                  ].map((k,i)=>(
                    <div key={i} style={{textAlign:"center",padding:"10px 4px",background:t.s2,borderRadius:10,border:`1px solid ${t.b1}`,minWidth:0}}>
                      <div style={{fontSize:"1.3rem",fontWeight:800,color:k.c}}>{k.v}</div>
                      <div style={{fontSize:".52rem",color:t.tx3,marginTop:2}}>{k.l}</div>
                    </div>
                  ))}
                </div>
                {/* Erreurs cliquables */}
                {quizScore.wrongs?.length>0&&(
                  <div style={{padding:"0 12px 12px"}}>
                    <div style={{fontSize:".6rem",color:t.tx3,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Mes erreurs — clique pour voir le verset</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {quizScore.wrongs.slice(-5).map((w,i)=>(
                        <div key={i} onClick={()=>setQuizShowWrong(quizShowWrong?.q?.n===w.q.n?null:w)} style={{padding:"8px 12px",background:`${t.rd}10`,borderRadius:8,border:`1px solid ${t.rd}30`,cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.background=`${t.rd}18`} onMouseLeave={e=>e.currentTarget.style.background=`${t.rd}10`}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <span style={{fontSize:".68rem",color:t.rd,fontWeight:600}}>{SURAHS.find(s=>s.n===w.correct)?.name} · v.{w.q.n}</span>
                            {w.chosen&&<span style={{fontSize:".6rem",color:t.tx3}}>Tu as dit : {SURAHS.find(s=>s.n===w.chosen)?.name}</span>}
                            <span style={{fontSize:".7rem",color:t.tx3}}>{quizShowWrong?.q?.n===w.q.n?"▲":"▼"}</span>
                          </div>
                          {quizShowWrong?.q?.n===w.q.n&&(
                            <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${t.rd}20`}}>
                              <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"1.1rem",direction:"rtl",textAlign:"right",lineHeight:2,color:t.tx,marginBottom:4}}>{w.q.ar?.replace(/<[^>]*>/g,"")}</div>
                              {w.q.fr&&<div style={{fontSize:".68rem",color:t.tx2,fontStyle:"italic"}}>{w.q.fr}</div>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STATS */}
        {page==="stats"&&(
          <div className="sp">
            {/* ── Constellation ── */}
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
                  {/* Fond étoilé */}
                  {Array.from({length:40},(_,i)=>(
                    <circle key={`star-${i}`} cx={(i*97+13)%380} cy={(i*61+7)%260} r={0.3+((i*37)%10)*0.05} fill="white" opacity={0.15+((i*23)%30)*0.01}/>
                  ))}
                  {/* Croissant de lune — guide de disposition */}
                  <path d="M 40 200 Q 120 20 200 15 Q 280 10 340 80 Q 370 130 340 190" fill="none" stroke={t.acc} strokeWidth="0.3" strokeDasharray="3,6" opacity="0.2"/>
                  {/* Les 114 sourates disposées en arc */}
                  {SURAHS.map((s,i)=>{
                    const total=114;
                    // Disposition en S-curve élégante
                    const row=Math.floor(i/19);
                    const col=i%19;
                    const x=22+col*18.5+(row%2)*9;
                    const y=25+row*36;
                    const pct2=sPct(s);
                    const isComplete=pct2===100;
                    const hasProgress=pct2>0;
                    const isRevision=revFlags[String(s.n)]==="active";
                    // Taille proportionnelle au nombre de versets
                    const baseR=1.5+Math.min(s.v/20,3);
                    const r=isComplete?baseR+1.5:baseR;
                    return (
                      <g key={s.n} style={{cursor:"pointer"}}
                        onClick={()=>{doSelect(s);setPage("quran");}}>
                        {/* Halo pour les sourates complètes */}
                        {isComplete&&(
                          <circle cx={x} cy={y} r={r+3} fill="url(#starGlow)" opacity="0.4">
                            <animate attributeName="r" values={`${r+2};${r+5};${r+2}`} dur={`${2+i%3}s`} repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.4;0.15;0.4" dur={`${2+i%3}s`} repeatCount="indefinite"/>
                          </circle>
                        )}
                        {/* Point principal */}
                        <circle cx={x} cy={y} r={r}
                          fill={isComplete?"#c9a84c":hasProgress?`rgba(201,168,76,${pct2/100*0.6+0.1})`:"rgba(255,255,255,0.08)"}
                          stroke={isRevision?"#e91e63":isComplete?"#f5dc8c":hasProgress?`rgba(201,168,76,0.5)`:"rgba(255,255,255,0.15)"}
                          strokeWidth={isComplete?0.8:0.4}
                          filter={isComplete?"url(#glow2)":undefined}
                        />
                        {/* Numéro pour les complètes seulement */}
                        {isComplete&&s.v<=10&&(
                          <text x={x} y={y+0.5} textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#0a0800" fontWeight="bold" style={{pointerEvents:"none"}}>{s.n}</text>
                        )}
                      </g>
                    );
                  })}
                </svg>
                {/* Légende */}
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

            {/* ── Stats Tarteel-style ── */}
            {(()=>{
              const fmtDur=s=>{const h=Math.floor(s/3600);const m=Math.floor((s%3600)/60);const sec=s%60;return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`;};
              const hassanat=totalMem*10+versesRecited*3; // estimation : 10/verset mémorisé + 3/récité
              const hassFmt=hassanat>=1000000?`${(hassanat/1000000).toFixed(2)}M`:hassanat>=1000?`${(hassanat/1000).toFixed(1)}k`:String(hassanat);
              const statsItems=[
                {v:fmtDur(engagementTime),l:"Temps d'engagement",icon:"⏱",c:t.acc},
                {v:`${Math.round(pct)}%`,l:"Achèvement du Coran",icon:"📿",c:t.gr},
                {v:versesRecited.toLocaleString(),l:"Versets récités",icon:"🎙️",c:t.bl},
                {v:fmtDur(recitTime),l:"Temps de récitation",icon:"📖",c:t.pu},
                {v:badges.length,l:"Badges reçus",icon:"🏅",c:"#f59e0b"},
                {v:hassFmt,l:"Estimation hassanates",icon:"⭐",c:"#10b981"},
              ];
              return(
                <div className="card">
                  <div className="ch">
                    <span className="ct">Statistiques détaillées</span>
                    <span style={{fontSize:".6rem",color:t.tx3}}>Pour la vie</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,borderTop:`1px solid ${t.b1}`}}>
                    {statsItems.map((s,i)=>(
                      <div key={i} style={{padding:"16px 14px",borderBottom:`1px solid ${t.b1}`,borderRight:i%2===0?`1px solid ${t.b1}`:"none",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:"1.3rem",fontWeight:800,color:s.c,letterSpacing:-.5,fontVariantNumeric:"tabular-nums"}}>{s.v}</div>
                          <div style={{fontSize:".6rem",color:t.tx3,marginTop:2,lineHeight:1.3}}>{s.l}</div>
                        </div>
                        <div style={{width:36,height:36,borderRadius:10,background:`${s.c}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{s.icon}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:"10px 14px",fontSize:".6rem",color:t.tx3,textAlign:"center",borderTop:`1px solid ${t.b1}`}}>
                    ⭐ Les hassanates sont une estimation indicative · Allah seul en connaît la récompense réelle
                  </div>
                </div>
              );
            })()}

            {/* Graphique */}
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

            {/* Badges */}
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

            {/* Top sourates */}
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

            {/* Révision espacée */}
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

            {/* Countdown cards */}
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

        {/* SETTINGS */}
        {page==="settings"&&(
          <div className="settings-wrap" style={{paddingBottom:"env(safe-area-inset-bottom)"}}>

            {/* Compte */}
            <div className="settings-section">
              <div className="ss-hd" style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                Compte
              </div>
              <div style={{padding:"14px 0 4px"}}>
                <div style={{fontSize:".68rem",color:t.tx3,marginBottom:8}}>Connecté en tant que</div>
                <div style={{fontSize:".82rem",color:t.acc,fontWeight:600,marginBottom:14,padding:"10px 14px",background:`${t.acc}10`,borderRadius:10,border:`1px solid ${t.acc}25`}}>{user?.email}</div>
                <button onClick={()=>supabase.auth.signOut()} style={{width:"100%",padding:"13px",background:"transparent",border:`1px solid ${t.rd}55`,borderRadius:12,color:t.rd,fontWeight:700,fontSize:".82rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background=`${t.rd}0a`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Se déconnecter
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="settings-section">
              <div className="ss-hd" style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                Notifications
              </div>
              <div style={{padding:"8px 0",display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${t.b1}`}}>
                  <div>
                    <div style={{fontSize:".8rem",color:t.tx,fontWeight:600}}>Rappel quotidien</div>
                    <div style={{fontSize:".63rem",color:t.tx3,marginTop:2}}>Recevoir un rappel chaque jour</div>
                  </div>
                  <button onClick={notifEnabled?()=>{setNotifEnabled(false);sv("qnotif",false);}:requestNotifications} style={{padding:"6px 16px",borderRadius:20,border:`1.5px solid ${notifEnabled?t.gr:t.b2}`,background:notifEnabled?`${t.gr}18`:t.s2,color:notifEnabled?t.gr:t.tx2,fontSize:".7rem",cursor:"pointer",fontWeight:700,transition:"all .2s"}}>
                    {notifEnabled?"Activé":"Activer"}
                  </button>
                </div>
                <div style={{fontSize:".62rem",color:t.tx3,fontStyle:"italic",padding:"2px 0"}}>
                  {Notification?.permission==="granted"
                    ?<span style={{color:t.gr}}>✓ Permission accordée</span>
                    :Notification?.permission==="denied"
                    ?<span style={{color:t.rd}}>✗ Bloqué — activez dans les réglages iPhone</span>
                    :"En attente de permission"}
                </div>
              </div>
            </div>

            {/* Objectif & Profil */}
            <div className="settings-section">
              <div className="ss-hd" style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>
                Objectif & Profil
              </div>
              <div className="set-row">
                <div><div className="set-lbl">Versets par jour</div><div className="set-sub">Objectif de nouvelles mémorisations</div></div>
                <input className="set-inp" type="number" min="1" max="200" value={settings?.dailyGoal||5} onChange={e=>setSettings(s=>({...s,dailyGoal:parseInt(e.target.value)||5}))}/>
              </div>
              <div className="set-row">
                <div><div className="set-lbl">Versets connus avant Al-Hifz</div><div className="set-sub">Actuellement : {settings?.baselineVerses||0}</div></div>
                <input className="set-inp" type="number" min="0" max="6236" value={settings?.baselineVerses||0} onChange={e=>setSettings(s=>({...s,baselineVerses:parseInt(e.target.value)||0}))}/>
              </div>
              <div className="set-row">
                <div><div className="set-lbl">Date de début</div><div className="set-sub">Depuis quand mémorises-tu ?</div></div>
                <input className="set-inp" type="date" value={settings?.startDate||today()} onChange={e=>setSettings(s=>({...s,startDate:e.target.value}))}/>
              </div>
            </div>

            {/* Apparence */}
            <div className="settings-section">
              <div className="ss-hd" style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                Apparence
              </div>
              <div style={{padding:"10px 0 4px"}}>
                <div style={{fontSize:".62rem",color:t.tx3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>Thème visuel</div>
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
                <div><div className="set-lbl">Mode nuit automatique</div><div className="set-sub">Bascule en émeraude après 20h</div></div>
                <button className={`toggle ${autoNight?"on":""}`} onClick={()=>setAutoNight(v=>!v)}/>
              </div>
              <div className="set-row">
                <div><div className="set-lbl">Thème Ramadan</div><div className="set-sub">Décorations de la nuit bénie</div></div>
                <button className={`toggle ${ramadanTheme?"on":""}`} onClick={()=>setRamadanTheme(v=>!v)}/>
              </div>
            </div>

            {/* Police arabe */}
            <div className="settings-section">
              <div className="ss-hd" style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                Police arabe
              </div>
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

            {/* Récitateurs */}
            <div className="settings-section">
              <div className="ss-hd" style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                Récitateurs
              </div>
              <div style={{padding:"8px 0",display:"flex",flexDirection:"column",gap:6}}>
                {RECITERS.map(r=>(
                  <div key={r.id} style={{padding:"10px 14px",borderRadius:10,border:`1.5px solid ${rec.id===r.id?t.acc:t.b1}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",background:rec.id===r.id?`${t.acc}10`:t.s2,transition:"all .2s"}} onClick={()=>setRec(r)}>
                    <div>
                      <div style={{fontSize:".76rem",fontWeight:600,color:rec.id===r.id?t.acc:t.tx}}>{r.name}</div>
                      <div style={{fontFamily:"'Amiri',serif",fontSize:".85rem",color:t.tx3,marginTop:2}}>{r.ar}</div>
                    </div>
                    {rec.id===r.id&&<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.acc} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                ))}
              </div>
            </div>

            {/* Données */}
            <div className="settings-section">
              <div className="ss-hd" style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                Données
              </div>
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
                <button className="tbtn" style={{borderColor:t.rd,color:t.rd}} onClick={()=>{if(window.confirm("Effacer toutes tes mémorisations ?  Action irréversible.")){setMem({});setHist({});setBadges([]);setSpaced({});setFavorites([]);setNotes({});setKhatmas([]);setActiveKhatma(null);setReadHistory([]);setPageRead({});}}}>Effacer</button>
              </div>
            </div>

            <div style={{textAlign:"center",padding:"16px 0 32px",color:t.tx3,fontSize:".6rem"}}>
              Al-Hifz — Le mémorisateur · v2.0<br/>
              <span style={{fontFamily:"'Amiri',serif",fontSize:".9rem",color:t.acc,marginTop:6,display:"block"}}>رَبِّ زِدْنِي عِلْمًا</span>
            </div>
          </div>
        )}
      </div>{/* end .wrap */}

      {/* Mode Concentration */}
      {focusMode&&selS&&verses.length>0&&(
        <div style={{position:"fixed",inset:0,zIndex:150,background:"#050505",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Header minimal */}
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
          {/* Verset central */}
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",gap:20}}>
            {/* Numéro verset */}
            <div style={{width:40,height:40,borderRadius:"50%",border:"1.5px solid rgba(201,168,76,.3)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(201,168,76,.5)",fontSize:".75rem"}}>
              {verses[focusIdx]?.n}
            </div>
            {/* Texte arabe — grand, centré */}
            <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"clamp(1.6rem,5vw,2.6rem)",direction:"rtl",textAlign:"center",lineHeight:2.5,color:"#f0e8d0",maxWidth:600,transition:"opacity .3s"}}>
              {(verses[focusIdx]?.ar||"").replace(/<[^>]*>/g,"")}
            </div>
            {/* Traduction */}
            {showTr&&verses[focusIdx]?.fr&&(
              <div style={{fontSize:"clamp(.75rem,2.5vw,1rem)",color:"#888",fontStyle:"italic",textAlign:"center",lineHeight:1.8,maxWidth:500}}>
                {verses[focusIdx]?.fr}
              </div>
            )}
            {/* Indicateur mémorisé */}
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {!!(mem[String(selS.n)]||{})[String(verses[focusIdx]?.n)]
                ?<span style={{fontSize:".7rem",color:"#22c55e",background:"rgba(34,197,94,.1)",padding:"3px 10px",borderRadius:99,border:"1px solid rgba(34,197,94,.2)"}}>✓ Mémorisé</span>
                :<button onClick={()=>toggleV(selS.n,verses[focusIdx]?.n,verses[focusIdx]?.ar)} style={{fontSize:".7rem",color:"#c9a84c",background:"rgba(201,168,76,.08)",padding:"4px 12px",borderRadius:99,border:"1px solid rgba(201,168,76,.25)",cursor:"pointer"}}>+ Mémoriser</button>
              }
            </div>
          </div>
          {/* Navigation bottom */}
          <div style={{padding:"16px 24px",borderTop:"1px solid #111",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <button onClick={()=>setFocusIdx(i=>Math.max(0,i-1))} disabled={focusIdx===0} style={{flex:1,padding:"12px",background:"#111",border:"1px solid #222",color:focusIdx===0?"#333":"#888",borderRadius:10,cursor:focusIdx===0?"default":"pointer",fontSize:"1rem",transition:"all .2s"}}>◄</button>
            {/* Barre de progression */}
            <div style={{flex:3,height:4,background:"#1a1a1a",borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(focusIdx+1)/verses.length*100}%`,background:"#c9a84c",borderRadius:99,transition:"width .3s"}}/>
            </div>
            <button onClick={()=>setFocusIdx(i=>Math.min(verses.length-1,i+1))} disabled={focusIdx===verses.length-1} style={{flex:1,padding:"12px",background:"#111",border:"1px solid #222",color:focusIdx===verses.length-1?"#333":"#c9a84c",borderRadius:10,cursor:focusIdx===verses.length-1?"default":"pointer",fontSize:"1rem",transition:"all .2s"}}>►</button>
          </div>
        </div>
      )}

      {/* Immersive mode */}
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

      {/* Mini audio player flottant */}
      {/* Animation calligraphie */}
      {wbwOpen&&wbwVerseRef.current&&(
  <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>{setWbwOpen(false);}}>
    <div style={{width:"100%",maxWidth:600,background:"#111",borderRadius:"20px 20px 0 0",padding:24,maxHeight:"70vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:".8rem",color:t.acc,fontWeight:700}}>📖 Mot à mot — {wbwVerseRef.current.sn}:{wbwVerseRef.current.vn}</div>
        <button onClick={()=>{setWbwOpen(false);}} style={{background:"none",border:"none",color:t.tx3,fontSize:"1.2rem",cursor:"pointer"}}>✕</button>
      </div>
      <WbwModal sn={wbwVerseRef.current.sn} vn={wbwVerseRef.current.vn} t={t}/>
    </div>
  </div>
)}
      {mushafSurahModal&&(
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setMushafSurahModal(false)}>
          <div style={{width:"100%",maxWidth:600,background:t.s1,borderRadius:"20px 20px 0 0",maxHeight:"80vh",display:"flex",flexDirection:"column",overflow:"hidden",border:`1px solid ${t.b2}`}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${t.b1}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:".9rem",fontWeight:700,color:t.tx}}>📖 Choisir une sourate</span>
                <button onClick={()=>setMushafSurahModal(false)} style={{background:"none",border:"none",color:t.tx3,fontSize:"1.2rem",cursor:"pointer"}}>✕</button>
              </div>
              <input
                autoFocus
                value={mushafSurahSearch}
                onChange={e=>setMushafSurahSearch(e.target.value)}
                placeholder="Rechercher une sourate…"
                style={{width:"100%",padding:"10px 14px",background:t.s2,border:`1px solid ${t.b2}`,borderRadius:10,color:t.tx,fontSize:".8rem",outline:"none",boxSizing:"border-box"}}
              />
            </div>
            <div style={{overflowY:"auto",flex:1,padding:"8px 0"}}>
              {SURAHS.filter(s=>
                !mushafSurahSearch||
                s.name.toLowerCase().includes(mushafSurahSearch.toLowerCase())||
                s.ar.includes(mushafSurahSearch)||
                String(s.n).includes(mushafSurahSearch)
              ).map((s,_,arr)=>{
                const origIdx=SURAHS.indexOf(s);
                const pg=SURAH_PDF_PAGES[origIdx]||1;
                const isActive=(mushafPage||1)===pg;
                return(
                  <div key={s.n} onClick={()=>{setMushafPage(pg);setMushafSurahModal(false);}} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 20px",cursor:"pointer",background:isActive?`${t.acc}15`:"transparent",borderLeft:isActive?`3px solid ${t.acc}`:"3px solid transparent",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=`${t.acc}10`} onMouseLeave={e=>e.currentTarget.style.background=isActive?`${t.acc}15`:"transparent"}>
                    <div style={{width:32,height:32,borderRadius:8,background:isActive?t.acc:t.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".65rem",fontWeight:700,color:isActive?"#000":t.tx3,flexShrink:0}}>{s.n}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:".8rem",fontWeight:600,color:isActive?t.acc:t.tx}}>{s.name}</div>
                      <div style={{fontSize:".6rem",color:t.tx3}}>{s.type} · {s.v} versets · Juz {s.juz}</div>
                    </div>
                    <div style={{fontFamily:"'Amiri',serif",fontSize:"1.1rem",color:isActive?t.acc:t.tx2,direction:"rtl"}}>{s.ar}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {calligAnim&&<CalligraphyBurst text={calligAnim} onDone={()=>setCalligAnim(null)}/>}

      {timerOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setTimerOpen(false)}>
          <div style={{background:t.s1,border:`1px solid ${t.acc}33`,borderRadius:20,padding:32,width:"90%",maxWidth:340,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:".7rem",color:t.tx3,textTransform:"uppercase",letterSpacing:2,marginBottom:16}}>⏱ Séance de révision</div>
            <div style={{fontSize:"4rem",fontWeight:800,color:timerLeft===0?t.gr:timerRunning?t.acc:t.tx,fontVariantNumeric:"tabular-nums",letterSpacing:2,marginBottom:24,fontFamily:"monospace"}}>
              {fmtTime(timerLeft)}
            </div>
            {!timerRunning&&timerLeft===null&&(
              <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20,flexWrap:"wrap"}}>
                {[5,10,15,20,30,45,60].map(m=>(
                  <button key={m} onClick={()=>setTimerDuration(m)} style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${timerDuration===m?t.acc:t.b2}`,background:timerDuration===m?`${t.acc}20`:t.s2,color:timerDuration===m?t.acc:t.tx2,fontSize:".75rem",cursor:"pointer",fontWeight:timerDuration===m?700:400}}>{m}min</button>
                ))}
              </div>
            )}
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              {!timerRunning&&timerLeft===null&&(
                <button onClick={startTimer} style={{flex:1,padding:"13px",background:`linear-gradient(135deg,${t.acc},${t.acc2})`,border:"none",borderRadius:12,color:"#000",fontWeight:800,fontSize:".9rem",cursor:"pointer"}}>▶ Démarrer</button>
              )}
              {timerRunning&&(
                <button onClick={pauseTimer} style={{flex:1,padding:"13px",background:t.s2,border:`1px solid ${t.b2}`,borderRadius:12,color:t.tx,fontWeight:700,fontSize:".9rem",cursor:"pointer"}}>⏸ Pause</button>
              )}
              {!timerRunning&&timerLeft!==null&&timerLeft>0&&(
                <button onClick={startTimer} style={{flex:1,padding:"13px",background:`linear-gradient(135deg,${t.acc},${t.acc2})`,border:"none",borderRadius:12,color:"#000",fontWeight:800,fontSize:".9rem",cursor:"pointer"}}>▶ Reprendre</button>
              )}
              {timerLeft!==null&&(
                <button onClick={resetTimer} style={{padding:"13px 16px",background:t.s2,border:`1px solid ${t.b2}`,borderRadius:12,color:t.tx2,fontWeight:700,fontSize:".9rem",cursor:"pointer"}}>↺</button>
              )}
            </div>
            {timerLeft===0&&(
              <div style={{marginTop:16,padding:"10px",background:`${t.gr}15`,borderRadius:10,color:t.gr,fontSize:".8rem",fontWeight:600}}>
                ✓ Séance terminée ! بارك الله فيك
              </div>
            )}
          </div>
        </div>
      )}

      {playing!==null&&selS&&!focusMode&&!immersive&&(
        <div style={{position:"fixed",bottom:"calc(70px + env(safe-area-inset-bottom))",left:12,right:12,zIndex:55,background:t.navBg,border:`1px solid ${t.acc}44`,borderRadius:14,padding:"9px 14px",display:"flex",alignItems:"center",gap:10,boxShadow:`0 -2px 20px rgba(0,0,0,.25)`,backdropFilter:"blur(12px)"}}>
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

      {/* Scroll to top */}
      <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{position:"fixed",bottom:"calc(76px + env(safe-area-inset-bottom))",right:14,zIndex:50,width:38,height:38,borderRadius:"50%",background:t.s2,border:`1px solid ${t.b2}`,color:t.tx2,fontSize:"1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.15)",transition:"all .2s",opacity:0.7}} onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=t.acc;e.currentTarget.style.color=t.acc;}} onMouseLeave={e=>{e.currentTarget.style.opacity="0.7";e.currentTarget.style.transform="";e.currentTarget.style.borderColor=t.b2;e.currentTarget.style.color=t.tx2;}}>↑</button>

      {/* Bottom nav */}
      <div className="bnav">
        {[
          {id:"home",icon:<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,label:"Accueil"},
          {id:"quran",icon:<Icons.Book size={19}/>,label:"Coran"},
          {id:"mushaf",icon:<Icons.Scroll size={19}/>,label:"Mushaf"},
          {id:"pages",icon:<Icons.Brain size={19}/>,label:"Révision",badge:spacedDue.length},
          {id:"khatma",icon:<Icons.Star size={19}/>,label:"Khatma"},
          {id:"quiz",icon:<Icons.Check size={19}/>,label:"Quiz"},
          {id:"stats",icon:<Icons.Chart size={19}/>,label:"Stats"},
          {id:"settings",icon:<Icons.Settings size={19}/>,label:"Réglages"},
        ].map(tab=>(
          <button key={tab.id} className={`bn ${page===tab.id?"on":""}`} onClick={()=>{if(tab.id===page)return;setPageTransition(true);setTimeout(()=>{setPage(tab.id);setPageTransition(false);},120);}}>
            <div style={{position:"relative",display:"inline-flex"}}>
              {tab.icon}
              {tab.badge>0&&<span style={{position:"absolute",top:-4,right:-6,background:t.rd,color:"#fff",borderRadius:99,fontSize:".42rem",fontWeight:800,minWidth:14,height:14,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",lineHeight:1}}>{tab.badge>99?"99+":tab.badge}</span>}
            </div>
            <span className="bn-lbl">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Audio element */}
      <audio ref={audioRef} style={{display:"none"}}
        onPlay={()=>setAudioPlaying(true)}
        onPause={()=>setAudioPlaying(false)}
        onTimeUpdate={e=>{
          const a=e.target;
          if(a.duration>0){
            setAudioPct(Math.round(a.currentTime/a.duration*100));
            // Lecture partielle — stopper à stopAt
            if(partialPlayRef.current&&a.currentTime/a.duration>=partialPlayRef.current.stopAt){
              a.pause();
              // Si loopInfinite ou loopCount > 1 — relancer depuis startAt
              if(loopInfinite||(loopCount>1&&loopCurrent<loopCount)){
                if(!loopInfinite)setLoopCurrent(p=>p+1);
                setTimeout(()=>{a.currentTime=a.duration*partialPlayRef.current.startAt;a.play().catch(()=>{});},200);
              } else {
                partialPlayRef.current=null;
                setLoopCurrent(0);
                setAudioPlaying(false);
              }
            }
          }
        }}
      />
    </>
  );
}