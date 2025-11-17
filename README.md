# Ezan Vakti Pro

Modern ve kullanıcı dostu bir namaz vakitleri uygulaması. Türkiye'deki 10 büyük şehir için günlük namaz vakitlerini gösterir.

## Özellikler

### Ana Özellikler
- **Gerçek Zamanlı Namaz Vakitleri**: Diyanet İşleri Başkanlığı verilerine dayalı güncel namaz vakitleri
- **Geri Sayım**: Bir sonraki namaz vaktine kalan süreyi gösterir
- **Şehir Seçimi**: 10 farklı şehir için namaz vakitleri
- **Otomatik Konum**: GPS ile otomatik şehir tespiti
- **Hicri Takvim**: Güncel Hicri tarih görüntüleme

### İbadet Araçları
- **Kıble Yönü**: Dijital pusula ile Kabe yönünü bulma
- **Dijital Tesbih**: Hedef sayaçlı zikir sayacı (33, 99, 100)
- **Esmâ-ül Hüsnâ**: Allah'ın 99 ismi (Arapça, Türkçe, anlam)
- **Dua Kitabı**: Kategorize edilmiş günlük dualar
- **Kısa Sureler**: 7 sıkça okunan sure (Fatiha, İhlas, Felak, Nas, Nasr, Kevser, Kafirun)
- **Namaz Takibi**: Günlük, haftalık ve aylık namaz istatistikleri

### Bildirim ve Ses
- **Akıllı Bildirimler**: Namaz vakti bildirimleri
- **Ezan Sesi**: Otomatik ezan çalma özelliği
- **Erken Uyarı**: 5-15 dakika önceden bildirim seçeneği

### Görünüm ve Tema
- **Dark/Light Mode**: Karanlık ve aydınlık tema seçeneği
- **Widget Modu**: Sadece bir sonraki namaz vakti gösterimi
- **Modern Tasarım**: Gradient renkler ve glassmorphism efektleri
- **Responsive**: Mobil, tablet ve masaüstü cihazlarda mükemmel görünüm
- **Animasyonlar**: Yumuşak geçişler ve hover efektleri

### PWA Özellikleri
- **Offline Çalışma**: İnternet bağlantısı olmadan kullanım
- **Ana Ekrana Ekleme**: Uygulama gibi kullanım
- **Hızlı Yükleme**: Önbellekleme sistemi
- **Otomatik Güncelleme**: Yeni sürüm bildirimleri
- **Responsive**: Tüm cihazlarda native app deneyimi

## Desteklenen Şehirler

- İstanbul
- Ankara
- İzmir
- Bursa
- Antalya
- Adana
- Konya
- Gaziantep
- Kayseri
- Mersin

## Teknolojiler

- **HTML5**: Semantik ve erişilebilir yapı
  - PWA manifest integration
  - Offline-ready struktur
  - Meta tags for mobile optimization
- **CSS3**: Modern stil özellikleri
  - CSS Grid & Flexbox
  - Gradient arka planlar
  - Glassmorphism efektleri
  - Animasyonlar ve geçişler
  - Dark/Light tema desteği
  - Responsive tasarım
- **JavaScript (Vanilla)**: API entegrasyonu ve dinamik içerik
  - Aladhan API kullanımı
  - LocalStorage & SessionStorage yönetimi
  - Service Worker & Cache API
  - DeviceOrientation API (pusula)
  - Geolocation API (konum)
  - Notification API
  - Audio API (ezan sesi)
  - Gerçek zamanlı güncelleme
  - Geri sayım sayacı
  - Hicri takvim hesaplama
- **PWA (Progressive Web App)**:
  - Service Worker (offline çalışma)
  - Web App Manifest
  - Cache-First stratejisi
  - Background Sync
  - Push Notifications
  - Install prompts

## Kullanım

1. `index.html` dosyasını bir web tarayıcısında açın
2. Dropdown menüden şehrinizi seçin
3. Namaz vakitleri otomatik olarak yüklenecektir
4. Bir sonraki namaz vaktine kalan süreyi takip edebilirsiniz

## API

Uygulama, [Aladhan API](https://aladhan.com/prayer-times-api) kullanarak namaz vakitlerini çeker. Bu API, Diyanet İşleri Başkanlığı hesaplama metodunu (method=13) kullanır.

## Özellikler Detay

### Otomatik Güncelleme
- Saat her saniye güncellenir
- Geri sayım her saniye güncellenir
- Bir sonraki namaz vakti otomatik olarak belirlenir

### Görsel Efektler
- Aktif namaz vakti kartı vurgulanır
- Hover efektleri ile interaktif deneyim
- Pulse animasyonu ile dikkat çekici geri sayım kartı
- Ripple efekti ile tıklama geri bildirimi

### Responsive Tasarım
- Mobil cihazlar için optimize edilmiş düzen
- Tablet boyutlarında uyumlu grid sistemi
- Büyük ekranlarda maksimum 800px genişlik

## Tarayıcı Desteği

- Chrome (önerilen)
- Firefox
- Safari
- Edge
- Opera

## Lisans

Bu proje açık kaynaklıdır ve özgürce kullanılabilir.

## Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.
