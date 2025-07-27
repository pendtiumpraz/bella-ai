# Bella AI - Asisten Virtual dengan Avatar VRM 3D Interaktif 🤖💝

<div align="center">
  <img src="Bellaicon/Generated image.webp" alt="Bella AI" width="200"/>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
  [![VRM Avatar](https://img.shields.io/badge/Avatar-VRM%203D-ff69b4.svg)](https://vrm.dev/)
  [![Three.js](https://img.shields.io/badge/Three.js-r158-blue.svg)](https://threejs.org/)
</div>

## 🌟 Tentang Bella AI

Bella AI adalah asisten virtual berbahasa Indonesia dengan avatar VRM 3D interaktif yang natural. Fork dari proyek open source [bella oleh jackywine](https://github.com/jackywine/bella) dan dikembangkan dengan fitur-fitur tambahan untuk pengguna Indonesia.

### ✨ Fitur Utama

- 🎭 **Avatar VRM 3D Interaktif** - 20+ model VTuber profesional dengan animasi real-time
- 🗣️ **Voice Recognition** - Kenali suara dalam bahasa Indonesia & Inggris  
- 🔊 **Text-to-Speech** - Bella berbicara dengan suara natural + lip sync
- 💬 **Multi-Provider AI** - Support Gemini, OpenAI, DeepSeek, dll
- 😊 **Emotion Detection** - Avatar berubah ekspresi sesuai emosi (mata, mulut, alis)
- 🌐 **100% Bahasa Indonesia** - UI dan respons dalam bahasa Indonesia
- 👁️ **Eye Tracking** - Mata avatar mengikuti cursor mouse
- 🎮 **Body Movement** - Gerakan badan natural saat berbicara
- 🚀 **WebGL Powered** - Performa smooth dengan Three.js

## 📋 Requirements

- Node.js v16+ 
- Browser modern (Chrome, Firefox, Edge)
- Mikrofon (untuk voice recognition)
- Internet (untuk Cloud API) atau model offline

## 🚀 Cara Install & Jalankan

### 1. Clone Repository
```bash
git clone https://github.com/pendtiumpraz/bella-ai.git
cd bella-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Download Model AI (Opsional - untuk mode offline)

#### Opsi A: Download Otomatis (Linux/Mac/WSL)
```bash
chmod +x download_models.sh
./download_models.sh
```

#### Opsi B: Download Manual
Download file-file berikut dan taruh di folder yang sesuai:

**Whisper Tiny (39MB) - Voice Recognition**
- Buat folder: `models/Xenova/whisper-tiny/onnx/`
- Download dari https://huggingface.co/Xenova/whisper-tiny:
  - `config.json`
  - `tokenizer_config.json` 
  - `tokenizer.json`
  - `preprocessor_config.json`
  - `generation_config.json`
  - `onnx/encoder_model.onnx`
  - `onnx/decoder_model_merged.onnx`

**LaMini Flan-T5 (300MB) - Chat Offline**
- Buat folder: `models/Xenova/LaMini-Flan-T5-77M/onnx/`
- Download dari https://huggingface.co/Xenova/LaMini-Flan-T5-77M:
  - `config.json`
  - `tokenizer_config.json`
  - `tokenizer.json`
  - `special_tokens_map.json`
  - `onnx/encoder_model.onnx`
  - `onnx/decoder_model_merged.onnx`

### 4. Jalankan Bella
```bash
npm start
```

Buka browser dan akses: http://localhost:8081

## 🎮 Cara Menggunakan

### Mode Avatar vs Video
- Klik tombol **"Switch to Avatar"** di kanan atas untuk beralih antara:
  - **Avatar Mode**: Avatar 2D/3D interaktif yang mengikuti mouse
  - **Video Mode**: Video pre-recorded Bella

### Pilih Avatar
1. Klik tombol **"Choose Avatar"** di kanan atas
2. Pilih dari galeri 20+ model:
   - **Galih Series**: 4 variasi (default: Galih Hoodie Esteh)
   - **Anime Characters**: Ai Hoshino, Anya Forger, Nezuko, Fern
   - **Original Characters**: Aria, Cesilia, Lilac, Maya, Rose, dll
3. Preview 3D real-time di galeri
4. Klik **"Gunakan Avatar Ini"**

### Voice Chat
1. Klik tombol **mikrofon** di bawah
2. Izinkan akses mikrofon saat diminta
3. Bicara dengan Bella dalam bahasa Indonesia
4. Bella akan menjawab dengan suara dan teks

### Text Chat  
1. Klik tombol **"Chat"** di kiri bawah
2. Ketik pesan kamu
3. Bella akan merespons dengan teks dan suara

### Ganti AI Provider
1. Buka chat window
2. Klik ikon **settings** (⚙️)
3. Pilih provider:
   - **Google Gemini** (default, gratis dengan limit)
   - **Hyperbolic DeepSeek V3** 
   - **OpenRouter**
   - **Model Lokal** (offline, perlu download model)

## 🔧 Konfigurasi API Key

### Gemini (Gratis)
1. Dapatkan API key di: https://makersuite.google.com/app/apikey
2. Masukkan di settings chat

### Hyperbolic
1. Daftar di: https://hyperbolic.xyz
2. Generate API key
3. Masukkan di settings chat

### OpenRouter
1. Daftar di: https://openrouter.ai
2. Top up credit & generate key
3. Masukkan di settings chat

## 🎭 Fitur Avatar

### Avatar VRM 3D System  
- 🎨 **20+ Model VTuber** - Koleksi lengkap avatar profesional
- 🖼️ **Live 3D Preview** - Preview real-time sebelum memilih
- 🔄 **Instant Switch** - Ganti avatar tanpa reload halaman
- ⚡ **WebGL Accelerated** - Performa optimal dengan Three.js

### Model Default: Galih Hoodie Esteh
Avatar default Bella menggunakan model **Galih Hoodie Esteh** dengan fitur:
- 👀 **Eye Tracking** - Mata mengikuti cursor mouse real-time
- 😊 **Auto Blinking** - Kedip natural setiap 3-5 detik
- 🗣️ **Lip Sync** - Sinkronisasi mulut dengan speech
- 🎭 **Full Face Expressions**:
  - 😄 **Happy**: Senyum lebar, mata menyipit, alis naik
  - 😢 **Sad**: Mulut cemberut, mata sayu, alis turun
  - 😠 **Angry**: Mulut ketat, mata melotot, alis cemberut
  - 😮 **Surprised**: Mulut terbuka, mata melebar, alis naik tinggi
- 🫁 **Breathing Animation** - Napas naik-turun natural
- 🎮 **Body Movement** - Gerakan torso, bahu, pinggul saat bicara
- 🎯 **Head Tracking** - Kepala mengikuti arah pandangan

### Koleksi Model VRM
**Galih Series (4 models)**
- Galih Hoodie (casual)
- Galih Hoodie Edmuku 
- Galih Hoodie Esteh ⭐ (default)
- Galih T-shirt Aveecena

**Anime Characters (4 models)**
- Ai Hoshino (Oshi no Ko)
- Anya Forger (Spy x Family)
- Nezuko Kamado (Demon Slayer)
- Fern (Frieren)

**Original Characters (12 models)**
- Aria, Cesilia, DUST, Goldy
- Kokuyou (v0 & v1), Lilac, Maya
- Mura Mura, Niya, Rose, dan lainnya

## 📁 Struktur Project

```
bella-ai/
├── index.html          # Halaman utama
├── script.js           # Logic utama aplikasi
├── core.js             # AI core engine
├── chatInterface.js    # UI chat component
├── videoManager.js     # Emotion video manager
├── vrm-interactive.html # VRM avatar viewer
├── avatarSelector.html # Avatar selection gallery
├── vtuberModels.js     # VRM model database
├── cloudAPI.js         # Cloud AI integration
├── style.css           # Styling utama
├── chatStyles.css      # Styling chat
├── models/             # Model AI offline
├── vtuber/             # 20+ VRM avatar models
├── 视频资源/           # Video resources
└── vendor/             # Dependencies
```

## 🐛 Troubleshooting

### Video/Avatar tidak muncul
- Klik dimana saja di halaman (browser butuh user interaction)
- Pastikan akses via http://localhost:8081, bukan file://

### Error model tidak ditemukan
- Download model sesuai instruksi di atas
- Atau gunakan Cloud API (tidak perlu download)

### Mikrofon error
- Pastikan browser punya izin akses mikrofon
- Klik ikon gembok di address bar untuk setting permission

### Chat tidak merespons
- Cek API key sudah benar
- Cek koneksi internet untuk Cloud API
- Lihat console browser (F12) untuk error detail

## 🤝 Kontribusi

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features  
- Submit pull requests

## 📄 License

Project ini menggunakan MIT License - sama seperti [project original bella](https://github.com/jackywine/bella).

```
MIT License

Copyright (c) 2024 Bella AI Indonesia Contributors
Original Copyright (c) jackywine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Credits

- Original Bella project: [jackywine/bella](https://github.com/jackywine/bella)
- Transformers.js: Xenova
- Live2D concept inspiration
- Indonesian NLP community

## 📞 Contact

- GitHub: [@pendtiumpraz](https://github.com/pendtiumpraz)
- Issues: [GitHub Issues](https://github.com/pendtiumpraz/bella-ai/issues)

---

<div align="center">
  Made with ❤️ for Indonesian AI enthusiasts
  
  ⭐ Star this repo if you find it helpful!
</div>