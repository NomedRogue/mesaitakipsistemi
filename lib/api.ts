import localStorage from "localStorage"

// LocalStorage keys
const STORAGE_KEYS = {
  PERSONEL: "personeller",
  IZINLER: "izinler",
  MTP_PLANLAR: "mtp_planlar",
  MTP_ONAYLAR: "mtp_onaylar",
  AYARLAR: "ayarlar",
  RAPORLAR: "raporlar",
}

// Initial personnel data
const initialPersonelData = [
  {
    id: 1,
    tc: "15263748901",
    ad: "ADEM",
    soyad: "ÇELİK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "002",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 2,
    tc: "98765432109",
    ad: "AHMET",
    soyad: "DİNÇ",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "003",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 3,
    tc: "12345678901",
    ad: "AHMET BUĞRA",
    soyad: "KARADAŞ",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "004",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 4,
    tc: "23456789012",
    ad: "ARİF TUĞRA",
    soyad: "ERDEN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "005",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 5,
    tc: "34567890123",
    ad: "ASLIHAN",
    soyad: "TEKİN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "006",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 6,
    tc: "45678901234",
    ad: "ATAHAN",
    soyad: "NAKİPOĞLU",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "007",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 7,
    tc: "56789012345",
    ad: "AYŞENUR",
    soyad: "MUTLU",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "008",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 8,
    tc: "67890123456",
    ad: "BARAN",
    soyad: "REŞİTOĞLU",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "009",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 9,
    tc: "78901234567",
    ad: "BEYZA",
    soyad: "ÖZER",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "010",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 10,
    tc: "89012345678",
    ad: "BÜŞRA",
    soyad: "KAYHAN ÇELİK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "011",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 11,
    tc: "90123456789",
    ad: "BETÜL",
    soyad: "ÜRE",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "012",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 12,
    tc: "10987654321",
    ad: "CENK",
    soyad: "BALABAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "013",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 13,
    tc: "21098765432",
    ad: "DİLAVER",
    soyad: "TAŞTAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "101",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 14,
    tc: "32109876543",
    ad: "DOĞUKAN BERK",
    soyad: "EROL",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "102",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 15,
    tc: "43210987654",
    ad: "DUYGU",
    soyad: "AKBIYIK KAHRAMAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "103",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 16,
    tc: "54321098765",
    ad: "EFSER",
    soyad: "ZAYIM",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "104",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 17,
    tc: "65432109876",
    ad: "ELİF HİCRET",
    soyad: "ASLAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "105",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 18,
    tc: "76543210987",
    ad: "ELİF",
    soyad: "GEYİK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "106",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 19,
    tc: "87654321098",
    ad: "ELİF BURCU",
    soyad: "ÇELİK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "107",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 20,
    tc: "98765432101",
    ad: "ESRA",
    soyad: "GÜL",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "108",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 21,
    tc: "11223344556",
    ad: "FATİH",
    soyad: "DEMİRTAŞ",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "109",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 22,
    tc: "22334455667",
    ad: "FATMA",
    soyad: "ŞİMŞEK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "110",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 23,
    tc: "33445566778",
    ad: "FERİDE",
    soyad: "ARSLAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "111",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 24,
    tc: "44556677889",
    ad: "GİZEM",
    soyad: "HARMANKAYA",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "112",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 25,
    tc: "55667788990",
    ad: "GÖKÇE",
    soyad: "ÇOLAK ÖZTÜRK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "113",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 26,
    tc: "66778899001",
    ad: "GÖKNUR SENA",
    soyad: "DURSUN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "114",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 27,
    tc: "77889900112",
    ad: "HACI AHMET",
    soyad: "BUDAK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "115",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 28,
    tc: "88990011223",
    ad: "HAZAL",
    soyad: "TOĞAL",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "116",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 29,
    tc: "99001122334",
    ad: "HANİFE",
    soyad: "SUNGU KORUCAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 30,
    tc: "10112233445",
    ad: "HİLAL",
    soyad: "GÜLKANAT",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 31,
    tc: "12131415161",
    ad: "İLAYDA",
    soyad: "GİRGİN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "117",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 32,
    tc: "23242526272",
    ad: "İNCİNUR",
    soyad: "DEMİR GÜLTEK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "201",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 33,
    tc: "34353637383",
    ad: "KAĞAN",
    soyad: "İLHAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "202",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 34,
    tc: "45464748494",
    ad: "KORAY UMUT",
    soyad: "ÖZAY",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "203",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 35,
    tc: "56575859505",
    ad: "KÜBRA",
    soyad: "ARİ",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "204",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 36,
    tc: "67686970616",
    ad: "MEHMET",
    soyad: "ÖZTÜRK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "205",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 37,
    tc: "78797081727",
    ad: "MELTEM",
    soyad: "ÇALIŞKAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "206",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 38,
    tc: "89808192838",
    ad: "MERAL",
    soyad: "ALPER",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "207",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 39,
    tc: "90919203949",
    ad: "MERVE",
    soyad: "ÇAPAR KILIÇKAYA",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 40,
    tc: "10203040506",
    ad: "MERVE",
    soyad: "İKİZ AKTAŞ",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "208",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 41,
    tc: "11121314151",
    ad: "NİLÜFER",
    soyad: "ÖZTÜRK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "209",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 42,
    tc: "16171819202",
    ad: "NİMET",
    soyad: "CORUT",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "210",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 43,
    tc: "21222324252",
    ad: "NURBANU",
    soyad: "TAYFUR BUDAK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "211",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 44,
    tc: "26272829303",
    ad: "NURSEHER",
    soyad: "AKIN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "212",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 45,
    tc: "31323334353",
    ad: "NURSENA",
    soyad: "YÜCE",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "213",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 46,
    tc: "36373839404",
    ad: "OSMAN",
    soyad: "PINARBAŞI",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "214",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 47,
    tc: "41424344454",
    ad: "ÖMER",
    soyad: "YILDIZ",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "215",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 48,
    tc: "46474849505",
    ad: "PINAR",
    soyad: "ÖLMEZ",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "216",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 49,
    tc: "51525354555",
    ad: "RABİA",
    soyad: "BÜYÜKKÖR KÜPDEL",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 50,
    tc: "56575859606",
    ad: "RABİA",
    soyad: "KURU",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "301",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 51,
    tc: "61626364656",
    ad: "ROZERİN",
    soyad: "BULUTTEKİN",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "302",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 52,
    tc: "66676869707",
    ad: "RUMEYSA",
    soyad: "YARAR",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "303",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 53,
    tc: "71727374757",
    ad: "SIDIKA",
    soyad: "GÜNEŞ",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "304",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 54,
    tc: "76777879808",
    ad: "SİNEM EMİNE",
    soyad: "DAYSAL",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "305",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 55,
    tc: "81828384858",
    ad: "ŞEYMANUR",
    soyad: "BAŞĞUT",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "306",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 56,
    tc: "86878889909",
    ad: "ŞUHEDA",
    soyad: "PALA GÜLLÜK",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "307",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 57,
    tc: "91929394959",
    ad: "TUBA",
    soyad: "TAŞLI",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "308",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 58,
    tc: "96979899001",
    ad: "ÜLKÜ TUĞBA",
    soyad: "PER",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "309",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 59,
    tc: "10203040507",
    ad: "YASEMİN",
    soyad: "ÇAĞLAR",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "310",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 60,
    tc: "11213141516",
    ad: "ZEYNEP HAZAL",
    soyad: "MUSTAFA",
    departman: "Tıbbi Hizmetler",
    unvan: "Diş Tabibi",
    klinik: "311",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 61,
    tc: "17181920212",
    ad: "AYŞE BEGÜM",
    soyad: "YİĞİT",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "312",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 62,
    tc: "22232425262",
    ad: "BİLGE",
    soyad: "AKARCA UYGEN",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "313",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 63,
    tc: "27282930313",
    ad: "ÇİĞDEM",
    soyad: "EVREN",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 64,
    tc: "32333435363",
    ad: "EMEL",
    soyad: "ARSLAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "314",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 65,
    tc: "37383940414",
    ad: "ELİF",
    soyad: "ÇELİK",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "315",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 66,
    tc: "42434445464",
    ad: "ESRA",
    soyad: "KOÇ USLUCAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "316",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 67,
    tc: "47484950515",
    ad: "ESMA",
    soyad: "ŞAHİN",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 68,
    tc: "52535455565",
    ad: "ELİF HACER",
    soyad: "HOPUR KILIÇ",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "317",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 69,
    tc: "57585960616",
    ad: "HAMİ",
    soyad: "HAKİKİ",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "318",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 70,
    tc: "62636465666",
    ad: "MEHMET",
    soyad: "DURDU",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "319",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 71,
    tc: "67686970717",
    ad: "ÖZGE NUR",
    soyad: "ÇİFTÇİ",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "320",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 72,
    tc: "72737475767",
    ad: "SEMA",
    soyad: "TUNÇ",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "601",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 73,
    tc: "77787980818",
    ad: "REYHAN",
    soyad: "ŞENKAL",
    departman: "Tıbbi Hizmetler",
    unvan: "Uzm. Diş Tabibi",
    klinik: "602",
    mesaiTamamlama: false,
    mesaiDisiCalisir: true,
  },
  {
    id: 74,
    tc: "82838485868",
    ad: "ADEVİYE",
    soyad: "AYAN",
    departman: "İdari Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 75,
    tc: "87888990919",
    ad: "AHMET",
    soyad: "ASLAN",
    departman: "İdari Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 76,
    tc: "92939495969",
    ad: "BESTE",
    soyad: "AÇIKYÜZ",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "002",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 77,
    tc: "97989900012",
    ad: "BÜŞRA",
    soyad: "KITAY",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "003",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 78,
    tc: "10305070901",
    ad: "DUYGU",
    soyad: "ÇELİK",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "004",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 79,
    tc: "13579246801",
    ad: "EDA",
    soyad: "PEKACARBAY",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "005",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 80,
    tc: "24681357902",
    ad: "FATMA",
    soyad: "EKİNCİ",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "006",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 81,
    tc: "35792468013",
    ad: "FİLİZ",
    soyad: "IŞIK",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "007",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 82,
    tc: "46803579124",
    ad: "HANİFE",
    soyad: "ŞAHİN",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "008",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 83,
    tc: "57914680235",
    ad: "HÜLYA",
    soyad: "ÇANGA",
    departman: "İdari Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 84,
    tc: "68025791346",
    ad: "HÜMEYRA",
    soyad: "ALTINKAYNAK",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "009",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 85,
    tc: "79136802457",
    ad: "HÜSNE",
    soyad: "GÖKMEN",
    departman: "İdari Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 86,
    tc: "80247913568",
    ad: "İBRAHİM",
    soyad: "ŞAHİN",
    departman: "İdari Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 87,
    tc: "91358024679",
    ad: "İSA",
    soyad: "GÜZEL",
    departman: "İdari Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 88,
    tc: "13243546708",
    ad: "KÜBRA",
    soyad: "PEKESEN",
    departman: "İdari Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 89,
    tc: "24354657819",
    ad: "MESUT",
    soyad: "MERCAN",
    departman: "İdari Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 90,
    tc: "35465768920",
    ad: "NEVİN",
    soyad: "YILMAZ",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "201",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 91,
    tc: "46576879031",
    ad: "NURAN",
    soyad: "TURGUT",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "202",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 92,
    tc: "57687980142",
    ad: "SEMANUR",
    soyad: "ÖZDURAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "203",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 93,
    tc: "68798091253",
    ad: "SEMİH",
    soyad: "KIZILKAYA",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "204",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 94,
    tc: "79809102364",
    ad: "SÜNDÜZ",
    soyad: "BURÇAK",
    departman: "İdari Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "205",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 95,
    tc: "80910213475",
    ad: "TUBA",
    soyad: "ÖZDEMİR",
    departman: "İdari Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "Yok",
    mesaiTamamlama: false,
    mesaiDisiCalisir: false,
  },
  {
    id: 96,
    tc: "91021324586",
    ad: "YASİN",
    soyad: "ASLAN",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "302",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 97,
    tc: "10213243697",
    ad: "ZEYNEP",
    soyad: "UZUNTAŞ",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "303",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 98,
    tc: "11223344557",
    ad: "ZEYNEP",
    soyad: "VARDI",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "304",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 99,
    tc: "22334455668",
    ad: "ZÜLEYHA",
    soyad: "SARIYER KURT",
    departman: "Tıbbi Hizmetler",
    unvan: "Veri Giriş Personeli",
    klinik: "305",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 100,
    tc: "33445566779",
    ad: "AKIN KAĞAN",
    soyad: "UYUMAZ",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "201",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 101,
    tc: "44556677880",
    ad: "AYSEL",
    soyad: "İÇÖZ",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "202",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 102,
    tc: "55667788991",
    ad: "AYŞE",
    soyad: "KARADOĞU",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "203",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 103,
    tc: "66778899002",
    ad: "AYŞENUR",
    soyad: "TOKSÖZ",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "204",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 104,
    tc: "77889900113",
    ad: "BEHİCE",
    soyad: "YILMAZ",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "205",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 105,
    tc: "88990011224",
    ad: "EMRAH",
    soyad: "DERE",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "206",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 106,
    tc: "99001122335",
    ad: "ENES",
    soyad: "KARA",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "207",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 107,
    tc: "10112233446",
    ad: "KÜBRA",
    soyad: "KURAL",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "208",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 108,
    tc: "12131415162",
    ad: "KÜBRANUR",
    soyad: "SABANCI",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "209",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 109,
    tc: "23242526273",
    ad: "MELİKE",
    soyad: "BAHAT",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "210",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 110,
    tc: "34353637384",
    ad: "NİHAL",
    soyad: "ALBAYRAK",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "211",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 111,
    tc: "45464748495",
    ad: "NURİ",
    soyad: "OKYAY",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "212",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 112,
    tc: "56575859506",
    ad: "ÖZLEM",
    soyad: "DEMİR",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "213",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 113,
    tc: "67686970617",
    ad: "ÖZLEM",
    soyad: "SEVİNDİRİK",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "214",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 114,
    tc: "78797081728",
    ad: "ÖZLEM",
    soyad: "VARELCİ",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "215",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 115,
    tc: "89808192839",
    ad: "SELMA",
    soyad: "ERŞAHİN",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "216",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
  {
    id: 116,
    tc: "90919203940",
    ad: "SEVDA",
    soyad: "TINKIR",
    departman: "Tıbbi Hizmetler",
    unvan: "Klinik Destek Personeli",
    klinik: "304",
    mesaiTamamlama: true,
    mesaiDisiCalisir: false,
  },
]

// İlk yüklemede personel verilerini kontrol et ve gerekirse yükle
const initializePersonelData = () => {
  if (typeof window === "undefined") return [] // Server-side check

  const existingData = localStorage.getItem(STORAGE_KEYS.PERSONEL)
  if (!existingData) {
    // Eğer veri yoksa, başlangıç verilerini yükle
    localStorage.setItem(STORAGE_KEYS.PERSONEL, JSON.stringify(initialPersonelData))
    return initialPersonelData
  }
  return JSON.parse(existingData)
}

// Personel işlemleri
export function getPersoneller() {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.PERSONEL)
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PERSONEL, JSON.stringify(initialPersonelData))
    return initialPersonelData
  }
  return JSON.parse(data)
}

export function addPersonel(newPersonel: Partial<Personel>) {
  const personelList = getPersoneller()
  const newPersonelWithId = { ...newPersonel, id: Date.now() }
  personelList.push(newPersonelWithId as Personel)
  localStorage.setItem(STORAGE_KEYS.PERSONEL, JSON.stringify(personelList))
  return personelList
}

export function updatePersonel(updatedPersonel: Partial<Personel>) {
  const personelList = getPersoneller()
  const index = personelList.findIndex((p) => p.id === updatedPersonel.id)
  if (index !== -1) {
    personelList[index] = { ...personelList[index], ...updatedPersonel }
    localStorage.setItem(STORAGE_KEYS.PERSONEL, JSON.stringify(personelList))
  }
  return personelList
}

export function deletePersonel(id: number) {
  const personelList = getPersoneller()
  const updatedList = personelList.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEYS.PERSONEL, JSON.stringify(updatedList))
  return updatedList
}

// İzin işlemleri
export function getIzinler() {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.IZINLER)
  return data ? JSON.parse(data) : []
}

export function addIzin(newIzin: any) {
  const izinList = getIzinler()
  const newIzinWithId = { ...newIzin, id: Date.now() }
  izinList.push(newIzinWithId)
  localStorage.setItem(STORAGE_KEYS.IZINLER, JSON.stringify(izinList))
  return izinList
}

export function updateIzin(updatedIzin: any) {
  const izinList = getIzinler()
  const updatedList = izinList.map((izin: any) => (izin.id === updatedIzin.id ? updatedIzin : izin))
  localStorage.setItem(STORAGE_KEYS.IZINLER, JSON.stringify(updatedList))
  return updatedList
}

export function deleteIzin(id: number) {
  const izinList = getIzinler()
  const updatedList = izinList.filter((izin: any) => izin.id !== id)
  localStorage.setItem(STORAGE_KEYS.IZINLER, JSON.stringify(updatedList))
  return updatedList
}

// MTP Plan işlemleri
export function getMTPPlanlar() {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.MTP_PLANLAR)
  return data ? JSON.parse(data) : []
}

export function addMTPPlan(newPlan: any) {
  const planList = getMTPPlanlar()
  const newPlanWithId = { ...newPlan, id: Date.now() }
  planList.push(newPlanWithId)
  localStorage.setItem(STORAGE_KEYS.MTP_PLANLAR, JSON.stringify(planList))
  return planList
}

export function updateMTPPlan(updatedPlan: any) {
  const planList = getMTPPlanlar()
  const updatedList = planList.map((plan: any) => (plan.id === updatedPlan.id ? updatedPlan : plan))
  localStorage.setItem(STORAGE_KEYS.MTP_PLANLAR, JSON.stringify(updatedList))
  return updatedList
}

export function deleteMTPPlan(id: number) {
  const planList = getMTPPlanlar()
  const updatedList = planList.filter((plan: any) => plan.id !== id)
  localStorage.setItem(STORAGE_KEYS.MTP_PLANLAR, JSON.stringify(updatedList))
  return updatedList
}

// MTP Onay işlemleri
export function getMTPOnaylar() {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.MTP_ONAYLAR)
  return data ? JSON.parse(data) : []
}

export function updateMTPOnay(updatedApproval: any) {
  const approvalList = getMTPOnaylar()
  const updatedList = approvalList.map((onay: any) => (onay.id === updatedApproval.id ? updatedApproval : onay))
  localStorage.setItem(STORAGE_KEYS.MTP_ONAYLAR, JSON.stringify(updatedList))
  return updatedList
}

// Ayarlar işlemleri
export function getAyarlar() {
  if (typeof window === "undefined") return {}
  const data = localStorage.getItem(STORAGE_KEYS.AYARLAR)
  return data
    ? JSON.parse(data)
    : {
        mesaiDisiCalismaGunleri: [],
        mesaiDisiCalismaSaatleri: {
          baslangic: "17:00",
          bitis: "08:00",
        },
        uyumsuzPersonel: [],
      }
}

export function updateAyarlar(updatedSettings: any) {
  localStorage.setItem(STORAGE_KEYS.AYARLAR, JSON.stringify(updatedSettings))
  return updatedSettings
}

// Raporlar işlemleri
export function getRaporlar() {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.RAPORLAR)
  return data ? JSON.parse(data) : []
}

export function addRapor(newReport: any) {
  const reportList = getRaporlar()
  const newReportWithId = { ...newReport, id: Date.now() }
  reportList.push(newReportWithId)
  localStorage.setItem(STORAGE_KEYS.RAPORLAR, JSON.stringify(reportList))
  return reportList
}

// Dönem işlemleri
export function savePeriodData(year: string, month: string, data: any) {
  const key = `mtp_plan_${year}_${month}`
  localStorage.setItem(key, JSON.stringify(data))
}

export function getPeriodData(year: string, month: string) {
  if (typeof window === "undefined") return null
  const key = `mtp_plan_${year}_${month}`
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

export function deletePeriodData(year: string, month: string) {
  const key = `mtp_plan_${year}_${month}`
  localStorage.removeItem(key)
}

interface Personel {
  id: number
  tc: string
  ad: string
  soyad: string
  departman: string
  unvan: string
  klinik: string
  mesaiTamamlama: boolean
  mesaiDisiCalisir: boolean
}

