// ========== ESMAÜL HÜSNA (99 İSİM) ==========
const esmaUlHusna = [
    { id: 1, arabic: "الرَّحْمَنُ", turkish: "Er-Rahman", meaning: "Sınırsız merhamet sahibi" },
    { id: 2, arabic: "الرَّحِيمُ", turkish: "Er-Rahim", meaning: "Çok merhametli" },
    { id: 3, arabic: "الْمَلِكُ", turkish: "El-Melik", meaning: "Mutlak hükümdar" },
    { id: 4, arabic: "الْقُدُّوسُ", turkish: "El-Kuddüs", meaning: "Her türlü eksiklikten uzak" },
    { id: 5, arabic: "السَّلاَمُ", turkish: "Es-Selam", meaning: "Esenlik veren" },
    { id: 6, arabic: "الْمُؤْمِنُ", turkish: "El-Mü'min", meaning: "Güven veren" },
    { id: 7, arabic: "الْمُهَيْمِنُ", turkish: "El-Müheymin", meaning: "Gözetip koruyan" },
    { id: 8, arabic: "الْعَزِيزُ", turkish: "El-Aziz", meaning: "Üstün ve güçlü" },
    { id: 9, arabic: "الْجَبَّارُ", turkish: "El-Cebbar", meaning: "Mutlak güç sahibi" },
    { id: 10, arabic: "الْمُتَكَبِّرُ", turkish: "El-Mütekebbir", meaning: "Büyüklükte eşsiz" },
    { id: 11, arabic: "الْخَالِقُ", turkish: "El-Halik", meaning: "Yaratan" },
    { id: 12, arabic: "الْبَارِئُ", turkish: "El-Bari", meaning: "Yoktan var eden" },
    { id: 13, arabic: "الْمُصَوِّرُ", turkish: "El-Musavvir", meaning: "Şekil veren" },
    { id: 14, arabic: "الْغَفَّارُ", turkish: "El-Gaffar", meaning: "Çok bağışlayan" },
    { id: 15, arabic: "الْقَهَّارُ", turkish: "El-Kahhar", meaning: "Kahredici" },
    { id: 16, arabic: "الْوَهَّابُ", turkish: "El-Vehhab", meaning: "Çokça bağışlayan" },
    { id: 17, arabic: "الرَّزَّاقُ", turkish: "Er-Rezzak", meaning: "Rızık veren" },
    { id: 18, arabic: "الْفَتَّاحُ", turkish: "El-Fettah", meaning: "Açan, kazandıran" },
    { id: 19, arabic: "اَلْعَلِيْمُ", turkish: "El-Alim", meaning: "Her şeyi bilen" },
    { id: 20, arabic: "الْقَابِضُ", turkish: "El-Kabız", meaning: "Daraltan, tutan" },
    { id: 21, arabic: "الْبَاسِطُ", turkish: "El-Basıt", meaning: "Genişleten" },
    { id: 22, arabic: "الْخَافِضُ", turkish: "El-Hafız", meaning: "Alçaltan" },
    { id: 23, arabic: "الرَّافِعُ", turkish: "Er-Rafi", meaning: "Yükselten" },
    { id: 24, arabic: "الْمُعِزُّ", turkish: "El-Muizz", meaning: "İzzetli kılan" },
    { id: 25, arabic: "المُذِلُّ", turkish: "El-Müzill", meaning: "Alçaltan" },
    { id: 26, arabic: "السَّمِيعُ", turkish: "Es-Semi", meaning: "Her şeyi işiten" },
    { id: 27, arabic: "الْبَصِيرُ", turkish: "El-Basir", meaning: "Her şeyi gören" },
    { id: 28, arabic: "الْحَكَمُ", turkish: "El-Hakem", meaning: "Hüküm veren" },
    { id: 29, arabic: "الْعَدْلُ", turkish: "El-Adl", meaning: "Adalet sahibi" },
    { id: 30, arabic: "اللَّطِيفُ", turkish: "El-Latif", meaning: "Lütuf sahibi" },
    { id: 31, arabic: "الْخَبِيرُ", turkish: "El-Habir", meaning: "Her şeyden haberdar" },
    { id: 32, arabic: "الْحَلِيمُ", turkish: "El-Halim", meaning: "Yumuşak davranan" },
    { id: 33, arabic: "الْعَظِيمُ", turkish: "El-Azim", meaning: "Pek büyük" },
    { id: 34, arabic: "الْغَفُورُ", turkish: "El-Gafur", meaning: "Bağışlayan" },
    { id: 35, arabic: "الشَّكُورُ", turkish: "Eş-Şekur", meaning: "Karşılık veren" },
    { id: 36, arabic: "الْعَلِيُّ", turkish: "El-Aliyy", meaning: "Yüce" },
    { id: 37, arabic: "الْكَبِيرُ", turkish: "El-Kebir", meaning: "Büyük" },
    { id: 38, arabic: "الْحَفِيظُ", turkish: "El-Hafiz", meaning: "Koruyan" },
    { id: 39, arabic: "المُقيِت", turkish: "El-Mukit", meaning: "Rızık veren" },
    { id: 40, arabic: "الْحسِيبُ", turkish: "El-Hasib", meaning: "Hesap gören" },
    { id: 41, arabic: "الْجَلِيلُ", turkish: "El-Celil", meaning: "Şan sahibi" },
    { id: 42, arabic: "الْكَرِيمُ", turkish: "El-Kerim", meaning: "Cömert" },
    { id: 43, arabic: "الرَّقِيبُ", turkish: "Er-Rakib", meaning: "Gözetleyici" },
    { id: 44, arabic: "الْمُجِيبُ", turkish: "El-Mucib", meaning: "Duayı kabul eden" },
    { id: 45, arabic: "الْوَاسِعُ", turkish: "El-Vasi", meaning: "Geniş" },
    { id: 46, arabic: "الْحَكِيمُ", turkish: "El-Hakim", meaning: "Hüküm ve hikmet sahibi" },
    { id: 47, arabic: "الْوَدُودُ", turkish: "El-Vedud", meaning: "Seven ve sevilen" },
    { id: 48, arabic: "الْمَجِيدُ", turkish: "El-Mecid", meaning: "Şanlı" },
    { id: 49, arabic: "الْبَاعِثُ", turkish: "El-Bais", meaning: "Yeniden dirilten" },
    { id: 50, arabic: "الشَّهِيدُ", turkish: "Eş-Şehid", meaning: "Şahit olan" },
    { id: 51, arabic: "الْحَقُّ", turkish: "El-Hakk", meaning: "Gerçek" },
    { id: 52, arabic: "الْوَكِيلُ", turkish: "El-Vekil", meaning: "Vekil, güvenilen" },
    { id: 53, arabic: "الْقَوِيُّ", turkish: "El-Kaviyy", meaning: "Kuvvetli" },
    { id: 54, arabic: "الْمَتِينُ", turkish: "El-Metin", meaning: "Sağlam" },
    { id: 55, arabic: "الْوَلِيُّ", turkish: "El-Veliyy", meaning: "Dost" },
    { id: 56, arabic: "الْحَمِيدُ", turkish: "El-Hamid", meaning: "Övülmeye layık" },
    { id: 57, arabic: "الْمُحْصِي", turkish: "El-Muhsi", meaning: "Her şeyi sayan" },
    { id: 58, arabic: "الْمُبْدِئُ", turkish: "El-Mübdi", meaning: "Başlatan" },
    { id: 59, arabic: "الْمُعِيدُ", turkish: "El-Muid", meaning: "Tekrarlayan" },
    { id: 60, arabic: "الْمُحْيِي", turkish: "El-Muhyi", meaning: "Dirilten" },
    { id: 61, arabic: "اَلْمُمِيتُ", turkish: "El-Mümit", meaning: "Öldüren" },
    { id: 62, arabic: "الْحَيُّ", turkish: "El-Hayy", meaning: "Diri" },
    { id: 63, arabic: "الْقَيُّومُ", turkish: "El-Kayyum", meaning: "Kendi kendine var olan" },
    { id: 64, arabic: "الْوَاجِدُ", turkish: "El-Vacid", meaning: "Bulan" },
    { id: 65, arabic: "الْمَاجِدُ", turkish: "El-Macid", meaning: "Şerefli" },
    { id: 66, arabic: "الْواحِدُ", turkish: "El-Vahid", meaning: "Bir" },
    { id: 67, arabic: "اَلاَحَدُ", turkish: "El-Ahad", meaning: "Tek" },
    { id: 68, arabic: "الصَّمَدُ", turkish: "Es-Samed", meaning: "Hiçbir şeye ihtiyacı olmayan" },
    { id: 69, arabic: "الْقَادِرُ", turkish: "El-Kadir", meaning: "Gücü yeten" },
    { id: 70, arabic: "الْمُقْتَدِرُ", turkish: "El-Muktedir", meaning: "Dilediğini yapan" },
    { id: 71, arabic: "الْمُقَدِّمُ", turkish: "El-Mukaddim", meaning: "Öne geçiren" },
    { id: 72, arabic: "الْمُؤَخِّرُ", turkish: "El-Muahhir", meaning: "Geri bırakan" },
    { id: 73, arabic: "الأوَّلُ", turkish: "El-Evvel", meaning: "İlk" },
    { id: 74, arabic: "الآخِرُ", turkish: "El-Ahir", meaning: "Son" },
    { id: 75, arabic: "الظَّاهِرُ", turkish: "Ez-Zahir", meaning: "Açık" },
    { id: 76, arabic: "الْبَاطِنُ", turkish: "El-Batın", meaning: "Gizli" },
    { id: 77, arabic: "الْوَالِي", turkish: "El-Vali", meaning: "Vali, yöneten" },
    { id: 78, arabic: "الْمُتَعَالِي", turkish: "El-Müteali", meaning: "Yüksekte olan" },
    { id: 79, arabic: "الْبَرُّ", turkish: "El-Berr", meaning: "İyilik eden" },
    { id: 80, arabic: "التَّوَابُ", turkish: "Et-Tevvab", meaning: "Tövbeyi kabul eden" },
    { id: 81, arabic: "الْمُنْتَقِمُ", turkish: "El-Müntakim", meaning: "İntikam alan" },
    { id: 82, arabic: "العَفُوُّ", turkish: "El-Afüvv", meaning: "Affeden" },
    { id: 83, arabic: "الرَّؤُوفُ", turkish: "Er-Rauf", meaning: "Şefkatli" },
    { id: 84, arabic: "مَالِكُ الْمُلْكِ", turkish: "Malikül-Mülk", meaning: "Mülkün sahibi" },
    { id: 85, arabic: "ذُوالْجَلاَلِ وَالإكْرَامِ", turkish: "Zülcelali vel-İkram", meaning: "Celal ve ikram sahibi" },
    { id: 86, arabic: "الْمُقْسِطُ", turkish: "El-Muksıt", meaning: "Adil" },
    { id: 87, arabic: "الْجَامِعُ", turkish: "El-Cami", meaning: "Toplayan" },
    { id: 88, arabic: "الْغَنِيُّ", turkish: "El-Ganiyy", meaning: "Zengin" },
    { id: 89, arabic: "الْمُغْنِي", turkish: "El-Muğni", meaning: "Zengin eden" },
    { id: 90, arabic: "اَلْمَانِعُ", turkish: "El-Mani", meaning: "Engelleyen" },
    { id: 91, arabic: "الضَّارَّ", turkish: "Ed-Darr", meaning: "Zarar veren" },
    { id: 92, arabic: "النَّافِعُ", turkish: "En-Nafi", meaning: "Fayda veren" },
    { id: 93, arabic: "النُّورُ", turkish: "En-Nur", meaning: "Nur" },
    { id: 94, arabic: "الْهَادِي", turkish: "El-Hadi", meaning: "Hidayet veren" },
    { id: 95, arabic: "الْبَدِيعُ", turkish: "El-Bedi", meaning: "Benzersiz yaratan" },
    { id: 96, arabic: "اَلْبَاقِي", turkish: "El-Baki", meaning: "Sonsuz" },
    { id: 97, arabic: "الْوَارِثُ", turkish: "El-Varis", meaning: "Varis" },
    { id: 98, arabic: "الرَّشِيدُ", turkish: "Er-Reşid", meaning: "Doğru yol gösteren" },
    { id: 99, arabic: "الصَّبُورُ", turkish: "Es-Sabur", meaning: "Sabırlı" }
];

// ========== DUALAR ==========
const prayers = {
    daily: [
        {
            id: 1,
            category: "Sabah-Akşam",
            name: "Sabah Duası",
            arabic: "اَللّٰهُمَّ بِكَ اَصْبَحْنَا وَبِكَ اَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَاِلَيْكَ النُّشُورُ",
            turkish: "Allah'ım! Senin izninle sabahladık, senin izninle akşamladık, seninle yaşıyor, seninle ölüyor ve hesap için sana dönüyoruz.",
            latin: "Allahümme bike asbahnâ ve bike emseynâ ve bike nahyâ ve bike nemûtü ve ileyke'n-nüşûr"
        },
        {
            id: 2,
            category: "Sabah-Akşam",
            name: "Akşam Duası",
            arabic: "اَللّٰهُمَّ بِكَ اَمْسَيْنَا وَبِكَ اَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَاِلَيْكَ الْمَصِيرُ",
            turkish: "Allah'ım! Senin izninle akşamladık, senin izninle sabahladık, seninle yaşıyor, seninle ölüyor ve sonunda sana dönüyoruz.",
            latin: "Allahümme bike emseynâ ve bike asbahnâ ve bike nahyâ ve bike nemûtü ve ileyke'l-masîr"
        },
        {
            id: 3,
            category: "Yemek",
            name: "Yemek Öncesi Duası",
            arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ",
            turkish: "Rahman ve Rahim olan Allah'ın adıyla",
            latin: "Bismillahirrahmanirrahim"
        },
        {
            id: 4,
            category: "Yemek",
            name: "Yemek Sonrası Duası",
            arabic: "اَلْحَمْدُ لِلّٰهِ الَّذِي اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ",
            turkish: "Bizi yedirip içiren ve müslümanlardan kılan Allah'a hamdolsun.",
            latin: "Elhamdülillahillezi at'amena ve sekana ve cealena minel müslimin"
        }
    ],
    namaz: [
        {
            id: 5,
            category: "Namaz Sonrası",
            name: "Ayetel Kürsi",
            arabic: "اَللّٰهُ لاَ اِلٰهَ اِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَهُ مَا فِي السَّمٰوَاتِ وَمَا فِي الْاَرْضِ",
            turkish: "Allah, kendisinden başka ilah olmayan, Hayy (diri) ve Kayyum'dur (kâinatın varlığını devam ettirendir). Onu ne uyuklama tutar, ne de uyku. Göklerdeki her şey, yerdeki her şey onundur.",
            latin: "Allahu la ilahe illa hüvel hayyül kayyum. La te'huzuhu sinetün ve la nevm. Lehu ma fis semavati ve ma fil ard."
        },
        {
            id: 6,
            category: "Namaz Sonrası",
            name: "Tesbih",
            arabic: "سُبْحَانَ اللهِ ٣٣ - اَلْحَمْدُ لِلّٰهِ ٣٣ - اَللّٰهُ اَكْبَرُ ٣٣",
            turkish: "Subhanallah (33 defa), Elhamdülillah (33 defa), Allahu Ekber (33 defa)",
            latin: "Subhanallah (33), Elhamdülillah (33), Allahu Ekber (33)"
        }
    ],
    travel: [
        {
            id: 7,
            category: "Yolculuk",
            name: "Yolculuk Duası",
            arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَاِنَّا اِلٰى رَبِّنَا لَمُنْقَلِبُونَ",
            turkish: "Bunu emrimiz altına koyan Allah'ın şanı yücedir. Yoksa bizim buna gücümüz yetmezdi. Şüphesiz ki biz Rabbimize döneceğiz.",
            latin: "Sübhanellezi sehhara lena haza ve ma künna lehu mukrinin ve inna ila rabbina lemünkalibun"
        }
    ],
    other: [
        {
            id: 8,
            category: "Çeşitli",
            name: "Hasta Ziyareti Duası",
            arabic: "لاَ بَأْسَ طَهُورٌ اِنْ شَاءَ اللهُ",
            turkish: "Allah'ın izniyle bu hastalık seni günahlardan temizler. Zararı olmaz inşallah.",
            latin: "La be'se tahûrun inşâallah"
        },
        {
            id: 9,
            category: "Çeşitli",
            name: "Uykudan Önce Duası",
            arabic: "بِاسْمِكَ اللّٰهُمَّ اَمُوتُ وَاَحْيَا",
            turkish: "Ey Allah'ım! Senin adınla ölüyor ve senin adınla diriliyor (uyanıyor)um.",
            latin: "Bismike Allahumme emutu ve ahya"
        },
        {
            id: 10,
            category: "Çeşitli",
            name: "Uyandıktan Sonra Duası",
            arabic: "اَلْحَمْدُ لِلّٰهِ الَّذِي اَحْيَانَا بَعْدَ مَا اَمَاتَنَا وَاِلَيْهِ النُّشُورُ",
            turkish: "Bizi öldükten (uyuduktan) sonra dirilten (uyandıran) Allah'a hamdolsun. Dönüş ancak O'nadır.",
            latin: "Elhamdülillahillezi ahyana ba'de ma ematena ve ileyhin-nüşûr"
        }
    ]
};

// ========== KISA SURELER ==========
const shortSurahs = [
    {
        id: 1,
        number: 1,
        name: "Fatiha",
        arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\nاَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ\nاَلرَّحْمٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nاِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِينُ\nاِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ اَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلاَ الضَّالِّينَ",
        turkish: "Rahman ve Rahim olan Allah'ın adıyla. Hamd, âlemlerin Rabbi Allah'a mahsustur. O, Rahman'dır, Rahim'dir. Din (ceza ve mükâfat) gününün sahibidir. Yalnız sana kulluk eder ve yalnız senden yardım dileriz. Bizi doğru yola, kendilerine nimet verdiklerinin yoluna ilet; gazaba uğrayanların ve sapıtanların yoluna değil.",
        ayah_count: 7
    },
    {
        id: 2,
        number: 112,
        name: "İhlas",
        arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\nقُلْ هُوَ اللّٰهُ اَحَدٌ\nاَللّٰهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُنْ لَهُ كُفُواً اَحَدٌ",
        turkish: "Rahman ve Rahim olan Allah'ın adıyla. De ki: O, Allah, birdir. Allah Samed'dir (her şey O'na muhtaçtır). O, doğurmamış ve doğmamıştır. Hiçbir şey O'na denk değildir.",
        ayah_count: 4
    },
    {
        id: 3,
        number: 113,
        name: "Felak",
        arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\nقُلْ اَعُوذُ بِرَبِّ الْفَلَقِ\nمِنْ شَرِّ مَا خَلَقَ\nوَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَ\nوَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ\nوَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ",
        turkish: "Rahman ve Rahim olan Allah'ın adıyla. De ki: Sabahın Rabbi'ne sığınırım. O'nun yarattıklarının şerrinden; karanlığı çöktüğü zaman, gecenin şerrinden; düğümlere üfleyenlerin şerrinden ve haset ettiği zaman, hasetçinin şerrinden.",
        ayah_count: 5
    },
    {
        id: 4,
        number: 114,
        name: "Nas",
        arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\nقُلْ اَعُوذُ بِرَبِّ النَّاسِ\nمَلِكِ النَّاسِ\nاِلٰهِ النَّاسِ\nمِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ\nاَلَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ\nمِنَ الْجِنَّةِ وَالنَّاسِ",
        turkish: "Rahman ve Rahim olan Allah'ın adıyla. De ki: İnsanların Rabbi'ne, insanların gerçek sahibi ve hükümdarı'na, insanların ilahı'na sığınırım. Sinsi vesvesecinin şerrinden ki, insanların göğüslerine vesvese sokar. O, cinlerden de insanlardan da olabilir.",
        ayah_count: 6
    },
    {
        id: 5,
        number: 110,
        name: "Nasr",
        arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\nاِذَا جَاءَ نَصْرُ اللّٰهِ وَالْفَتْحُ\nوَرَاَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللّٰهِ اَفْوَاجاً\nفَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ اِنَّهُ كَانَ تَوَّاباً",
        turkish: "Rahman ve Rahim olan Allah'ın adıyla. Allah'ın yardımı ve fetih geldiği ve insanların bölük bölük Allah'ın dinine girdiklerini gördüğün zaman, Rabbini hamd ile tesbih et ve O'ndan mağfiret dile. Çünkü O, tövbeleri çok kabul edendir.",
        ayah_count: 3
    },
    {
        id: 6,
        number: 108,
        name: "Kevser",
        arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\nاِنَّا اَعْطَيْنَاكَ الْكَوْثَرَ\nفَصَلِّ لِرَبِّكَ وَانْحَرْ\nاِنَّ شَانِئَكَ هُوَ الْاَبْتَرُ",
        turkish: "Rahman ve Rahim olan Allah'ın adıyla. Şüphesiz biz sana Kevser'i verdik. O halde Rabbin için namaz kıl ve kurban kes. Doğrusu sana kin besleyen kimse, kendisi soyu kesik olandır.",
        ayah_count: 3
    },
    {
        id: 7,
        number: 109,
        name: "Kafirun",
        arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\nقُلْ يَا اَيُّهَا الْكَافِرُونَ\nلاَ اَعْبُدُ مَا تَعْبُدُونَ\nوَلاَ اَنْتُمْ عَابِدُونَ مَا اَعْبُدُ\nوَلاَ اَنَا عَابِدٌ مَا عَبَدْتُمْ\nوَلاَ اَنْتُمْ عَابِدُونَ مَا اَعْبُدُ\nلَكُمْ دِينُكُمْ وَلِيَ دِينِ",
        turkish: "Rahman ve Rahim olan Allah'ın adıyla. De ki: Ey kafirler! Ben sizin taptıklarınıza tapmam. Siz de benim taptığıma tapmazsınız. Ben de sizin taptıklarınıza tapacak değilim. Siz de benim taptığıma tapacak değilsiniz. Sizin dininiz size, benim dinim banadır.",
        ayah_count: 6
    }
];

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { esmaUlHusna, prayers, shortSurahs };
}
