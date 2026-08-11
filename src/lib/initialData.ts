import { KuzenProfile, SharedPhoto, MonopolyProperty } from '@/types';

export const INITIAL_PROFILES: Record<'duru' | 'omer' | 'cinar', KuzenProfile> = {
  duru: {
    id: 'duru',
    name: 'Duru',
    title: '👑 Zeka & Sanat Kraliçesi',
    age: 12,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    themeColor: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-950/40 via-purple-950/30 to-slate-950',
    bio: 'Resim yapmayı, kitap okumayı ve strateji oyunlarında rakiplerimi yenmeyi çok seviyorum! Monopoly\'de Türkiye\'nin en kıymetli yerlerini toplamak benim işim.',
    hobbies: ['🎨 Dijital & Kara Kalem Çizim', '📚 Fantastik Kitaplar', '🧩 1000 Parçalık Puzzle', '🎹 Piyano Vuruşları'],
    favoriteGames: ['🎲 Monopoly (Elak Lideri)', '🃏 Bol Cezalı UNO', '🎮 Roblox', '♟️ Satranç'],
    quote: '"Zekanı ve stratejini kullanırsan, en zor Monopoly tahtasını bile fethedersin!"',
    badges: [
      { icon: '👑', label: 'Monopoly Ustası' },
      { icon: '🎨', label: 'Süper Ressam' },
      { icon: '⭐', label: 'En Akılcı Hamle' }
    ]
  },
  omer: {
    id: 'omer',
    name: 'Ömer',
    title: '⚡ Strateji Dehası & Kod Kaptanı',
    age: 10,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    themeColor: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-950/40 via-cyan-950/30 to-slate-950',
    bio: 'Teknoloji, hız ve akıl oyunları tutkunuyum! UNO oynarken ceza kartlarını üst üste dizip rakiplerime kart çektirmeye bayılırım.',
    hobbies: ['🎮 E-Spor & Oyun Tasarımı', '⚽ Futbol & Maç Analizleri', '🤖 Robotik Kodlama', '🚲 Dağ Bisikleti'],
    favoriteGames: ['🃏 UNO (Bol Cezalı Krallığı)', '🎲 Monopoly Dünya Şehirleri', '⚽ FC 25 / FIFA', '🧱 Minecraft Redstone'],
    quote: '"Cezası bol olan UNO oyununda bana meydan okumak mı? Tekrar düşün derim!"',
    badges: [
      { icon: '🃏', label: 'UNO Cezalandırıcı' },
      { icon: '⚡', label: 'Işık Hızında Hamle' },
      { icon: '🏆', label: 'Oyun Birincisi' }
    ]
  },
  cinar: {
    id: 'cinar',
    name: 'Çınar',
    title: '🚀 Neşe Kasırgası & Hız Şampiyonu',
    age: 8,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    themeColor: 'from-amber-500 to-emerald-600',
    bgGradient: 'from-amber-950/40 via-emerald-950/30 to-slate-950',
    bio: 'Enerjim hiç bitmez! Kuzenlerin en hızlısı ve en eğlencelisiyim. Zar atarken şansıma çok güvenirim, 6-6 atmadan durmam!',
    hobbies: ['🛹 Kaykay & Paten', '🧱 Lego Şehir İnşası', '🏃 Macera Koşusu', '🎬 Çizgi Film Kurguları'],
    favoriteGames: ['🎲 Monopoly Kapadokya Avcısı', '🃏 UNO Çılgın Renkler', '🏎️ Mario Kart', '🕹️ Brawl Stars'],
    quote: '"Gülümse ve zarı salla! Şans her zaman neşeli olanın yanındadır!"',
    badges: [
      { icon: '🚀', label: 'Enerji Bombası' },
      { icon: '🎲', label: 'Şanslı Zarcı' },
      { icon: '🌟', label: 'Kuzen Yıldızı' }
    ]
  }
};

export const INITIAL_SHARED_PHOTOS: SharedPhoto[] = [
  {
    id: 'photo_1',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    title: 'Kuzenler Birlikte Tatilde! 🏖️',
    uploadedBy: 'Duru',
    date: '2026-07-15'
  },
  {
    id: 'photo_2',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
    title: 'Monopoly Zafer Kutlaması 🏆',
    uploadedBy: 'Ömer',
    date: '2026-08-01'
  },
  {
    id: 'photo_3',
    url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
    title: 'Eğlenceli Oyun Gecesi 🎲',
    uploadedBy: 'Çınar',
    date: '2026-08-10'
  }
];

export const MONOPOLY_PROPERTIES: MonopolyProperty[] = [
  { id: 0, name: 'BAŞLANGIÇ', subtitle: '+200₺ Al', type: 'special', price: 0, rent: 0 },
  { id: 1, name: 'Kapadokya', subtitle: 'Nevşehir', type: 'turkey', price: 100, rent: 15, colorGroup: '#ec4899', flag: '🇹🇷', housePrice: 50, houseRent: [15, 35, 90, 200, 350] },
  { id: 2, name: 'ŞANS KARTU', subtitle: 'Kuzen Sürprizi', type: 'special', price: 0, rent: 0 },
  { id: 3, name: 'Ölüdeniz', subtitle: 'Muğla', type: 'turkey', price: 120, rent: 18, colorGroup: '#ec4899', flag: '🇹🇷', housePrice: 50, houseRent: [18, 40, 100, 220, 400] },
  { id: 4, name: 'VERGİ', subtitle: '-100₺ Öde', type: 'special', price: 0, rent: 0 },
  { id: 5, name: 'TCDD Hızlı Tren', subtitle: 'İstasyon', type: 'station', price: 200, rent: 25 },
  { id: 6, name: 'Atina', subtitle: 'Yunanistan', type: 'world', price: 140, rent: 20, colorGroup: '#3b82f6', flag: '🇬🇷', housePrice: 75, houseRent: [20, 50, 120, 260, 450] },
  { id: 7, name: 'KADER ÇARKI', subtitle: 'Rastgele Ödül', type: 'special', price: 0, rent: 0 },
  { id: 8, name: 'Roma', subtitle: 'İtalya', type: 'world', price: 160, rent: 25, colorGroup: '#3b82f6', flag: '🇮🇹', housePrice: 75, houseRent: [25, 60, 140, 300, 500] },
  { id: 9, name: 'Boğaz Köprüsü', subtitle: 'İstanbul', type: 'turkey', price: 180, rent: 28, colorGroup: '#ec4899', flag: '🇹🇷', housePrice: 100, houseRent: [28, 70, 160, 340, 550] },
  { id: 10, name: 'HAPİSHANE', subtitle: 'Ziyaretçi', type: 'special', price: 0, rent: 0 },
  { id: 11, name: 'Berlin', subtitle: 'Almanya', type: 'world', price: 200, rent: 30, colorGroup: '#10b981', flag: '🇩🇪', housePrice: 100, houseRent: [30, 80, 180, 380, 600] },
  { id: 12, name: 'TOGG Elektrik', subtitle: 'Enerji Santrali', type: 'utility', price: 150, rent: 20 },
  { id: 13, name: 'Paris', subtitle: 'Fransa', type: 'world', price: 220, rent: 35, colorGroup: '#10b981', flag: '🇫🇷', housePrice: 110, houseRent: [35, 90, 200, 420, 650] },
  { id: 14, name: 'Efes Antik', subtitle: 'İzmir', type: 'turkey', price: 240, rent: 40, colorGroup: '#ec4899', flag: '🇹🇷', housePrice: 120, houseRent: [40, 100, 220, 460, 700] },
  { id: 15, name: 'THY Uçak', subtitle: 'İstasyon', type: 'station', price: 200, rent: 25 },
  { id: 16, name: 'Palandöken', subtitle: 'Erzurum', type: 'turkey', price: 260, rent: 42, colorGroup: '#f59e0b', flag: '🇹🇷', housePrice: 130, houseRent: [42, 110, 240, 500, 750] },
  { id: 17, name: 'ŞANS KARTU', subtitle: 'Kuzen Sürprizi', type: 'special', price: 0, rent: 0 },
  { id: 18, name: 'Londra', subtitle: 'İngiltere', type: 'world', price: 280, rent: 45, colorGroup: '#f59e0b', flag: '🇬🇧', housePrice: 140, houseRent: [45, 120, 260, 540, 800] },
  { id: 19, name: 'Pamukkale', subtitle: 'Denizli', type: 'turkey', price: 300, rent: 50, colorGroup: '#f59e0b', flag: '🇹🇷', housePrice: 150, houseRent: [50, 130, 280, 580, 850] },
  { id: 20, name: 'ÜCRETSİZ OTOPARK', subtitle: 'Dinlenme Alanı', type: 'special', price: 0, rent: 0 },
  { id: 21, name: 'Sidney', subtitle: 'Avustralya', type: 'world', price: 320, rent: 55, colorGroup: '#8b5cf6', flag: '🇦🇺', housePrice: 160, houseRent: [55, 140, 300, 620, 900] },
  { id: 22, name: 'KADER ÇARKI', subtitle: 'Rastgele Ödül', type: 'special', price: 0, rent: 0 },
  { id: 23, name: 'Tokyo', subtitle: 'Japonya', type: 'world', price: 350, rent: 60, colorGroup: '#8b5cf6', flag: '🇯🇵', housePrice: 175, houseRent: [60, 150, 330, 680, 980] },
  { id: 24, name: 'Türksat 6A', subtitle: 'Uydu İstasyonu', type: 'utility', price: 150, rent: 20 },
  { id: 25, name: 'Göcek Koyları', subtitle: 'Muğla', type: 'turkey', price: 380, rent: 65, colorGroup: '#ec4899', flag: '🇹🇷', housePrice: 180, houseRent: [65, 160, 360, 720, 1050] },
  { id: 26, name: 'Singapur', subtitle: 'Asya Metropolü', type: 'world', price: 400, rent: 70, colorGroup: '#8b5cf6', flag: '🇸🇬', housePrice: 200, houseRent: [70, 175, 400, 800, 1150] },
  { id: 27, name: 'Ayasofya', subtitle: 'İstanbul', type: 'turkey', price: 420, rent: 75, colorGroup: '#ec4899', flag: '🇹🇷', housePrice: 210, houseRent: [75, 190, 420, 850, 1200] },
  { id: 28, name: 'LÜKS VERGİSİ', subtitle: '-150₺ Öde', type: 'special', price: 0, rent: 0 },
  { id: 29, name: 'New York', subtitle: 'ABD', type: 'world', price: 450, rent: 80, colorGroup: '#ef4444', flag: '🇺🇸', housePrice: 225, houseRent: [80, 200, 450, 900, 1300] },
  { id: 30, name: 'KODESE GİT', subtitle: 'Hapishaneye!', type: 'special', price: 0, rent: 0 },
  { id: 31, name: 'Dubai', subtitle: 'BAE (Elmas Kule)', type: 'world', price: 500, rent: 100, colorGroup: '#ef4444', flag: '🇦🇪', housePrice: 250, houseRent: [100, 250, 500, 1000, 1500] }
];
