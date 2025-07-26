#!/bin/bash

echo "=== Downloading Small Models for Bella AI ==="
echo "Total size: ~600MB - 1GB"
echo ""

# Create directories
mkdir -p models/Xenova/whisper-tiny
mkdir -p models/Xenova/LaMini-Flan-T5-77M

# Download Whisper Tiny (39MB) - Smallest whisper model
echo "1. Downloading Whisper Tiny model (39MB)..."
cd models/Xenova/whisper-tiny

# Download config files
wget -q https://huggingface.co/Xenova/whisper-tiny/resolve/main/config.json
wget -q https://huggingface.co/Xenova/whisper-tiny/resolve/main/tokenizer_config.json
wget -q https://huggingface.co/Xenova/whisper-tiny/resolve/main/tokenizer.json
wget -q https://huggingface.co/Xenova/whisper-tiny/resolve/main/preprocessor_config.json

# Download model files
wget -q https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/encoder_model.onnx
wget -q https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/decoder_model_merged.onnx

echo "✓ Whisper Tiny downloaded"

# Go back to root
cd ../../..

# Download LaMini-Flan-T5-77M (300MB)
echo ""
echo "2. Downloading LaMini Flan T5 model (300MB)..."
cd models/Xenova/LaMini-Flan-T5-77M

# Download config files
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/config.json
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/tokenizer_config.json
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/tokenizer.json
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/special_tokens_map.json

# Download model files
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/onnx/encoder_model.onnx
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/onnx/decoder_model_merged.onnx

echo "✓ LaMini Flan T5 downloaded"

cd ../../..

echo ""
echo "=== All models downloaded successfully! ==="
echo "Total size used: ~340MB"
echo ""
echo "Now you can:"
echo "1. Use voice recognition with microphone"
echo "2. Use local AI chat (offline mode)"