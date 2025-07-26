# Debug Video Bella

## Cara Cek Video

1. Buka browser console (F12)
2. Ketik:
```javascript
// Cek video status
const video1 = document.getElementById('video1');
console.log('Video paused:', video1.paused);
console.log('Video src:', video1.src);
console.log('Video readyState:', video1.readyState);
console.log('Video error:', video1.error);

// Force play
video1.play();
```

## Kemungkinan Masalah

1. **Browser Auto-play Policy**
   - Chrome/Edge memerlukan user interaction pertama
   - Klik dimana saja di halaman untuk start video

2. **Video File Path**
   - Pastikan folder `视频资源/` ada
   - Cek file video tidak corrupt

3. **CORS/Server Issue**
   - Video harus di-serve dari http://localhost:8081
   - Tidak bisa buka file:// langsung

## Quick Fix

Jika video tidak jalan:
1. Klik dimana saja di halaman
2. Atau refresh dengan Ctrl+F5
3. Cek console untuk error detail