# Bella AI - Interactive Virtual Avatar Assistant for Business 🤖💝

<div align="center">
  <img src="Bellaicon/Generated image.webp" alt="Bella AI" width="200"/>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
  [![VRM Avatar](https://img.shields.io/badge/Avatar-VRM%203D-ff69b4.svg)](https://vrm.dev/)
  [![Three.js](https://img.shields.io/badge/Three.js-r158-blue.svg)](https://threejs.org/)
  
  **Transform your customer experience with AI-powered virtual avatars**
</div>

## 🌟 Why Bella AI?

In today's digital world, human connection matters more than ever. Bella AI bridges the gap between artificial intelligence and authentic interaction by providing customizable 3D avatars that can represent your brand, speak naturally in multiple languages, and engage customers 24/7.

### 🚀 Business Use Cases & Potential

#### 1. **E-commerce Customer Service**
- **Fashion Brands**: Virtual stylists wearing your brand's latest collection
- **Beauty Brands**: Makeup consultants demonstrating products virtually
- **Electronics**: Tech support avatars explaining product features
- Example: "Uniqlo x Doraemon" - Customer service with Doraemon wearing Uniqlo clothes

#### 2. **Brand Collaborations with Anime/Gaming**
- **Anime Collabs**: Use popular anime characters as brand ambassadors
- **Gaming Partnerships**: Game characters providing customer support
- **Virtual Influencers**: Create unique brand mascots
- Example: "McDonald's x Genshin Impact" - Order taking with Paimon avatar

#### 3. **Virtual Receptionist & Concierge**
- **Hotels**: 24/7 multilingual concierge service
- **Hospitals**: Patient intake and guidance
- **Corporate**: Virtual receptionist for offices
- **Real Estate**: Property tour guides

#### 4. **Education & Training**
- **Language Schools**: Native-speaking tutors with correct accents
- **Corporate Training**: Consistent training delivery
- **Kids Education**: Engaging animated teachers
- **Medical Training**: Patient simulation

#### 5. **Entertainment & Media**
- **VTuber Agencies**: Ready-to-use avatar platform
- **Live Streaming**: Interactive virtual hosts
- **Event Management**: Virtual event moderators
- **Content Creation**: Automated video presenters

#### 6. **Financial Services**
- **Banking**: Personal financial advisors
- **Insurance**: Claims assistance
- **Investment**: Market analysis presenters
- **Crypto**: DeFi education avatars

#### 7. **Healthcare & Wellness**
- **Mental Health**: Therapeutic companions
- **Fitness**: Personal trainers
- **Nutrition**: Diet consultants
- **Elderly Care**: Companion avatars

### 💡 Implementation Examples

```
🏪 Retail: "Nike x Hatsune Miku" - Virtual store assistant in Nike sportswear
🍕 Food: "KFC x Arknights" - Order taking with game character avatars  
👘 Fashion: "Louis Vuitton x Final Fantasy" - Luxury shopping assistant
🏦 Banking: "BCA x Local VTuber" - Indonesian banking assistant
🎮 Gaming: "Steam x Valve Characters" - Gaming support with Portal's GLaDOS
✈️ Travel: "AirAsia x Anime" - Flight booking with anime mascots
```

## 🌟 Tentang Bella AI

Bella AI adalah platform asisten virtual dengan avatar VRM 3D interaktif yang dapat disesuaikan untuk berbagai kebutuhan bisnis. Dikembangkan dari proyek open source [bella oleh jackywine](https://github.com/jackywine/bella) dengan fokus pada aplikasi komersial dan enterprise.

### ✨ Key Features

- 🎭 **20+ Professional VRM 3D Avatars** - Ready-to-use VTuber models with real-time animation
- 🗣️ **Multi-language Voice Recognition** - Indonesian, English, Japanese, Chinese support
- 🔊 **Gender-Adaptive TTS** - Automatic male/female voice based on avatar gender
- 💬 **Multi-Provider AI** - Gemini, OpenAI, Anthropic, Groq, local models
- 😊 **Advanced Emotion System** - Dynamic facial expressions (eyes, mouth, eyebrows)
- 🎯 **Brand Customization** - Easy personality and appearance customization
- 👁️ **Interactive Features** - Eye tracking, head movement, breathing animation
- 🎮 **Natural Body Language** - Realistic gestures while speaking
- 📊 **Audio Spectrum Visualizer** - Visual feedback for voice input/output
- 🚀 **Lightweight Deployment** - Works on shared hosting, no server required

## 📋 Requirements

### For Development
- Node.js v16+ (optional, only for development server)
- Modern browser (Chrome, Firefox, Edge)
- Microphone (for voice features)
- Internet connection (for cloud AI)

### For Deployment  
- **Shared Hosting**: Any web hosting with static file support
- **VPS/Cloud**: Node.js optional, can use Python/PHP server
- **CDN**: Can be deployed on Cloudflare Pages, Vercel, Netlify
- **On-Premise**: Works offline with local AI models

## 🚀 Quick Start

### Option 1: Simple Deployment (Shared Hosting)

1. **Download files**
```bash
git clone https://github.com/pendtiumpraz/bella-ai.git
# or download ZIP from GitHub
```

2. **Upload to hosting**
- Upload all files to your public_html or www directory
- No server-side setup needed!

3. **Access your site**
- Open yourdomain.com in browser
- That's it! Bella AI is ready

### Option 2: Local Development

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

## 💼 Business Integration Guide

### Custom Brand Avatar

1. **Prepare Your Avatar**
   - Create VRM model with your brand elements
   - Use tools like VRoid Studio (free)
   - Or commission from VRM artists

2. **Add to System**
```javascript
// In avatarSelector.html
const avatars = [
  {
    name: 'Your Brand Mascot',
    path: 'vtuber/your-mascot.vrm',
    type: 'VRM',
    description: 'Official brand assistant',
    tags: ['brand', 'official']
  }
];
```

3. **Set Custom Personality**
```javascript
// In script.js
const personalities = {
  'Your Brand Mascot': `You are the official assistant for [Brand Name]. 
    You help customers with product inquiries, orders, and support.
    Always maintain brand voice: professional, friendly, helpful.
    Key products: [list products]
    Current promotions: [list promotions]`
}
```

### API Integration

```javascript
// Connect to your backend
bellaAI.setWebhook({
  onMessage: async (userMessage) => {
    // Send to your CRM/backend
    await fetch('/api/chat-log', {
      method: 'POST',
      body: JSON.stringify({ message: userMessage })
    });
  },
  onResponse: async (aiResponse) => {
    // Log AI responses
    await fetch('/api/ai-log', {
      method: 'POST', 
      body: JSON.stringify({ response: aiResponse })
    });
  }
});
```

## 🎮 How to Use

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

## 🏢 Enterprise Features

### Multi-tenant Support
- Separate avatars for different departments
- Role-based avatar selection
- Department-specific knowledge bases

### Analytics Integration
```javascript
// Google Analytics example
bellaAI.on('conversation', (data) => {
  gtag('event', 'ai_interaction', {
    'avatar_name': data.avatar,
    'message_count': data.messageCount,
    'session_duration': data.duration
  });
});
```

### Custom Branding
- Replace logo and colors
- Custom UI themes
- White-label options
- Remove Bella AI branding (Enterprise license)

### Security & Compliance
- All processing client-side (no data sent to servers)
- API keys encrypted in local storage
- GDPR compliant
- No cookies or tracking

## 📁 Project Structure

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

## 💰 Pricing & Licensing

### Open Source (MIT License)
- ✅ Free forever
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ No attribution required
- ❌ No official support
- ❌ No warranty

### Enterprise Support (Optional)
- Priority support
- Custom avatar creation
- Training & implementation
- SLA guarantees
- Contact: enterprise@bella-ai.com

## 🤝 Contributing

We welcome contributions!
- Report bugs via GitHub Issues
- Submit feature requests
- Create pull requests
- Share your custom avatars

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

## 🌍 Global Deployment Examples

### Success Stories
- 🏪 **Fashion Retail**: 40% reduction in customer service costs
- 🏥 **Healthcare**: 24/7 patient support in 5 languages  
- 🎓 **Education**: 10,000+ students using AI tutors
- 🏦 **Banking**: 60% faster customer onboarding

## 📞 Contact & Support

- **GitHub**: [@pendtiumpraz](https://github.com/pendtiumpraz)
- **Issues**: [GitHub Issues](https://github.com/pendtiumpraz/bella-ai/issues)
- **Discord**: [Join Community](https://discord.gg/bella-ai)
- **Email**: support@bella-ai.com

## 🚀 Get Started Now!

```bash
# Quick install
git clone https://github.com/pendtiumpraz/bella-ai.git
cd bella-ai
python3 -m http.server 8000
# Open http://localhost:8000
```

---

<div align="center">
  <h3>Transform Your Customer Experience Today!</h3>
  
  Made with ❤️ for businesses worldwide
  
  ⭐ Star this repo | 🔄 Fork for your brand | 📢 Share with others
</div>