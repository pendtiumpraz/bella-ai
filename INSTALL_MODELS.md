# Cara Install Model Kecil untuk Bella AI

## Opsi 1: Menggunakan Script (Linux/Mac/WSL)

1. Buka terminal di folder Bella
2. Jalankan:
```bash
./download_models.sh
```

## Opsi 2: Download Manual

### 1. Whisper Tiny (39MB) - Voice Recognition

Download semua file berikut dan taruh di folder `models/Xenova/whisper-tiny/`:

**Config files:**
- https://huggingface.co/Xenova/whisper-tiny/resolve/main/config.json
- https://huggingface.co/Xenova/whisper-tiny/resolve/main/tokenizer_config.json
- https://huggingface.co/Xenova/whisper-tiny/resolve/main/tokenizer.json
- https://huggingface.co/Xenova/whisper-tiny/resolve/main/preprocessor_config.json

**Model files (dalam folder onnx/):**
- https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/encoder_model.onnx
- https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/decoder_model_merged.onnx

### 2. LaMini-Flan-T5-77M (300MB) - Local Chat

Download semua file berikut dan taruh di folder `models/Xenova/LaMini-Flan-T5-77M/`:

**Config files:**
- https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/config.json
- https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/tokenizer_config.json
- https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/tokenizer.json
- https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/special_tokens_map.json

**Model files (dalam folder onnx/):**
- https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/onnx/encoder_model.onnx
- https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/onnx/decoder_model_merged.onnx

## Struktur Folder Setelah Download

```
bella-ai/
├── models/
│   └── Xenova/
│       ├── whisper-tiny/
│       │   ├── config.json
│       │   ├── tokenizer_config.json
│       │   ├── tokenizer.json
│       │   ├── preprocessor_config.json
│       │   └── onnx/
│       │       ├── encoder_model.onnx
│       │       └── decoder_model_merged.onnx
│       └── LaMini-Flan-T5-77M/
│           ├── config.json
│           ├── tokenizer_config.json
│           ├── tokenizer.json
│           ├── special_tokens_map.json
│           └── onnx/
│               ├── encoder_model.onnx
│               └── decoder_model_merged.onnx
```

## Total Size
- Whisper Tiny: ~39MB
- LaMini Flan-T5: ~300MB
- **Total: ~340MB**

## Testing
Setelah download, refresh browser dan:
1. Klik tombol mikrofon untuk test voice recognition
2. Pilih "Model Lokal" di settings untuk test offline chat