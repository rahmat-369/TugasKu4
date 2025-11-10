# TugasKu v1.3.0

Aplikasi manajemen tugas sederhana dengan fitur push notifikasi pengingat deadline.

## Fitur Baru v1.3.0

### 🔔 Push Notification System
- **Pengingat Otomatis**: Notifikasi dikirim 3/2/1 hari sebelum deadline tugas
- **Smart Scheduling**: Notifikasi dijadwalkan otomatis saat menambah tugas baru
- **Permission Management**: Banner dan pengaturan untuk mengatur izin notifikasi
- **Test Functionality**: Tombol uji notifikasi untuk memastikan sistem berfungsi
- **Notification Actions**: Tombol "Lihat Tugas" dan "Tutup" pada notifikasi

### Perbaikan & Peningkatan
- ✅ Perbaikan badge notifikasi yang lebih akurat
- ✅ Peningkatan service worker dengan caching yang lebih baik
- ✅ Pengaturan notifikasi terintegrasi di menu settings
- ✅ Tips & panduan yang diperbaharui
- ✅ Manifest PWA yang lebih lengkap
- ✅ Penanganan klik notifikasi dengan highlight tugas

## Cara Kerja Notifikasi

1. **Aktivasi**: Pengguna mengklik "Aktifkan" pada banner atau di pengaturan
2. **Penjadwalan**: Saat tugas baru ditambahkan, notifikasi dijadwalkan otomatis
3. **Pengiriman**: Browser mengirim notifikasi pada waktu yang tepat
4. **Interaksi**: Klik notifikasi membuka aplikasi dan highlight tugas terkait

## Fitur Utama

- 📝 **Manajemen Tugas**: Tambah, edit, hapus tugas dengan deadline
- 🏷️ **Sistem Prioritas**: Indikator visual untuk prioritas tinggi/sedang/rendah
- 📅 **Jadwal Pelajaran**: Kelola jadwal harian per mata pelajaran
- 📝 **Catatan Pribadi**: Sistem catatan dengan timestamp
- 🎨 **Multi Tema**: 9 tema berbeda (terang/gelap + variasi warna)
- 📊 **Statistik**: Chart dan ringkasan tugas dengan Chart.js
- 💾 **Offline Ready**: PWA dengan service worker dan localStorage
- 📱 **Responsive**: Optimized untuk mobile dan desktop

## Teknologi

- **Frontend**: HTML5, CSS3 (Custom Properties), Vanilla JavaScript
- **Charts**: Chart.js untuk visualisasi statistik
- **PWA**: Service Worker, Web App Manifest
- **Notifications**: Web Notifications API
- **Storage**: localStorage untuk persistensi data
- **Icons**: Custom icon set dengan SVG fallbacks

## Browser Support

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

**Catatan**: Fitur notifikasi memerlukan browser yang mendukung Web Notifications API dan Service Workers.

## Instalasi & Usage

1. Buka aplikasi di browser
2. Klik "Aktifkan" pada banner notifikasi (opsional)
3. Mulai menambahkan tugas dengan deadline
4. Nikmati pengingat otomatis untuk deadline yang akan datang!

## Pengembangan

Aplikasi ini dikembangkan sepenuhnya menggunakan mobile device (Oppo A3s) tanpa framework external yang berat, mengutamakan performa dan kesederhanaan.

---

**Developer**: Rahmat | **Contact**: rohmatulloh.3609@gmail.com  
**Version**: 1.3.0 | **Release**: November 2025