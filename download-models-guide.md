# 📥 Cara Download Model AI untuk Bella AI

## ⚠️ PENTING: Model AI adalah OPSIONAL!

**Bella AI bisa jalan TANPA download model** dengan menggunakan:
- ✅ Google Gemini API (gratis dengan limit)
- ✅ OpenAI API
- ✅ Anthropic Claude API
- ✅ Groq API

Download model hanya perlu jika mau **mode offline** tanpa internet.

## 🎯 Model yang Dibutuhkan (Jika Mau Offline)

### 1. Whisper Tiny (39MB) - Voice Recognition
### 2. LaMini Flan-T5 (300MB) - Chat AI

Total: ~340MB

## 📥 Cara Download

### Option 1: Download Otomatis dengan Script

```bash
# Di terminal/SSH
cd bella-ai
chmod +x download_models.sh
./download_models.sh
```

### Option 2: Download Manual via Browser

#### A. Download Whisper Tiny (Voice Recognition)

1. Buka: https://huggingface.co/Xenova/whisper-tiny/tree/main
2. Buat folder: `models/Xenova/whisper-tiny/`
3. Download file-file ini:
   - `config.json`
   - `tokenizer_config.json`
   - `tokenizer.json`
   - `preprocessor_config.json`
   - `generation_config.json`

4. Buka: https://huggingface.co/Xenova/whisper-tiny/tree/main/onnx
5. Buat folder: `models/Xenova/whisper-tiny/onnx/`
6. Download:
   - `encoder_model.onnx` (31MB)
   - `decoder_model_merged.onnx` (7.5MB)

#### B. Download LaMini Flan-T5 (Chat AI)

1. Buka: https://huggingface.co/Xenova/LaMini-Flan-T5-77M/tree/main
2. Buat folder: `models/Xenova/LaMini-Flan-T5-77M/`
3. Download:
   - `config.json`
   - `tokenizer_config.json`
   - `tokenizer.json`
   - `special_tokens_map.json`

4. Buka: https://huggingface.co/Xenova/LaMini-Flan-T5-77M/tree/main/onnx
5. Buat folder: `models/Xenova/LaMini-Flan-T5-77M/onnx/`
6. Download:
   - `encoder_model.onnx` (148MB)
   - `decoder_model_merged.onnx` (147MB)

### Option 3: Download dengan wget/curl

```bash
# Create directories
mkdir -p models/Xenova/whisper-tiny/onnx
mkdir -p models/Xenova/LaMini-Flan-T5-77M/onnx

# Download Whisper config files
cd models/Xenova/whisper-tiny
wget https://huggingface.co/Xenova/whisper-tiny/raw/main/config.json
wget https://huggingface.co/Xenova/whisper-tiny/raw/main/tokenizer_config.json
wget https://huggingface.co/Xenova/whisper-tiny/raw/main/tokenizer.json
wget https://huggingface.co/Xenova/whisper-tiny/raw/main/preprocessor_config.json
wget https://huggingface.co/Xenova/whisper-tiny/raw/main/generation_config.json

# Download Whisper models
cd onnx
wget https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/encoder_model.onnx
wget https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/decoder_model_merged.onnx

# Download LaMini config files
cd ../../LaMini-Flan-T5-77M
wget https://huggingface.co/Xenova/LaMini-Flan-T5-77M/raw/main/config.json
wget https://huggingface.co/Xenova/LaMini-Flan-T5-77M/raw/main/tokenizer_config.json
wget https://huggingface.co/Xenova/LaMini-Flan-T5-77M/raw/main/tokenizer.json
wget https://huggingface.co/Xenova/LaMini-Flan-T5-77M/raw/main/special_tokens_map.json

# Download LaMini models
cd onnx
wget https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/onnx/encoder_model.onnx
wget https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/onnx/decoder_model_merged.onnx
```

### Option 4: Download ZIP Bundle (Easiest!)

Saya sudah siapkan bundle lengkap:

1. Download: [bella-ai-models.zip](https://drive.google.com/file/d/xxx) (340MB)
2. Extract ke folder `bella-ai/models/`
3. Selesai!

*Note: Link Google Drive akan dibuat jika diperlukan*

## 🌐 Alternatif: Gunakan Cloud API (Recommended!)

**Lebih mudah dan powerful**, tidak perlu download apa-apa:

### 1. Google Gemini (Gratis)
```javascript
// Di chat settings, pilih "Google Gemini"
// Masukkan API key dari https://makersuite.google.com/app/apikey
```

### 2. OpenAI GPT
```javascript
// Pilih "OpenAI"
// Masukkan API key dari https://platform.openai.com/api-keys
```

### 3. Anthropic Claude
```javascript
// Pilih "Anthropic"
// Masukkan API key dari https://console.anthropic.com/
```

## 📁 Struktur Folder Model

Setelah download, struktur folder harus seperti ini:

```
bella-ai/
└── models/
    └── Xenova/
        ├── whisper-tiny/
        │   ├── config.json
        │   ├── tokenizer_config.json
        │   ├── tokenizer.json
        │   ├── preprocessor_config.json
        │   ├── generation_config.json
        │   └── onnx/
        │       ├── encoder_model.onnx
        │       └── decoder_model_merged.onnx
        └── LaMini-Flan-T5-77M/
            ├── config.json
            ├── tokenizer_config.json
            ├── tokenizer.json
            ├── special_tokens_map.json
            └── onnx/
                ├── encoder_model.onnx
                └── decoder_model_merged.onnx
```

## ❓ FAQ

### Q: Apakah wajib download model?
**A: TIDAK!** Bella AI bisa jalan dengan Cloud API tanpa download model.

### Q: Model mana yang lebih bagus?
**A: Cloud API (Gemini, GPT, Claude) JAUH lebih pintar** daripada model offline.

### Q: Kenapa ada opsi model offline?
**A: Untuk use case khusus**:
- Tidak ada internet
- Privacy concern (semua di device)
- Development/testing

### Q: Upload model ke shared hosting?
**A: Bisa, tapi**:
- Check limit upload (biasanya 50-100MB per file)
- Bisa di-zip dan extract via File Manager
- Atau host di CDN external

### Q: Model tidak ke-load?
**A: Check**:
1. Path folder sudah benar
2. Semua file sudah lengkap
3. Permission folder 755
4. Atau switch ke Cloud API saja (lebih mudah)

## 🎯 Rekomendasi

1. **Untuk production**: Gunakan Cloud API (Gemini/GPT/Claude)
2. **Untuk testing**: Download model kecil (Whisper Tiny)
3. **Untuk offline**: Download semua model

## 💡 Tips

- Model offline **TIDAK sebaik** Cloud API
- Response lebih lambat dan kurang akurat
- Cocok untuk demo/testing saja
- Untuk customer service serius, gunakan Cloud API

---

**Bottom line**: Skip download model, langsung pakai Cloud API! 🚀