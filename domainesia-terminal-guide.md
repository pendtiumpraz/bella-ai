# 🚀 Deploy Bella AI di Domainesia via Terminal

## 📋 Persiapan

1. **Login SSH ke Domainesia**:
```bash
ssh username@domain.com -p 64000
# atau
ssh username@IP_SERVER -p 64000
```

2. **Masuk ke directory public_html**:
```bash
cd ~/public_html
```

## 🔽 Download & Install Bella AI

### Step 1: Clone Repository

```bash
# Clone Bella AI
git clone https://github.com/pendtiumpraz/bella-ai.git

# Masuk ke folder
cd bella-ai
```

### Step 2: Setup Node.js (Jika Tersedia)

```bash
# Check Node.js version
node --version

# Jika ada Node.js, install dependencies
npm install express compression

# Start server
npm start &
```

### Step 3: Setup dengan PHP (Alternatif)

Jika Node.js tidak tersedia, buat file runner PHP:

```bash
# Buat index.php
cat > index.php << 'EOF'
<?php
// Bella AI PHP Runner for Domainesia
$path = $_SERVER['REQUEST_URI'];
$file = __DIR__ . str_replace('/bella-ai', '', $path);

if ($path === '/bella-ai/' || $path === '/bella-ai') {
    $file = __DIR__ . '/index.html';
}

if (!file_exists($file)) {
    http_response_code(404);
    die('404 Not Found');
}

$ext = pathinfo($file, PATHINFO_EXTENSION);
$types = [
    'js' => 'application/javascript',
    'css' => 'text/css',
    'html' => 'text/html',
    'json' => 'application/json',
    'vrm' => 'model/gltf-binary',
    'glb' => 'model/gltf-binary',
    'mp4' => 'video/mp4',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'webp' => 'image/webp'
];

header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
if (in_array($ext, ['vrm', 'glb', 'json'])) {
    header('Access-Control-Allow-Origin: *');
}

readfile($file);
EOF
```

### Step 4: Setup .htaccess

```bash
# Buat .htaccess
cat > .htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# MIME Types
AddType model/gltf-binary .vrm
AddType model/gltf-binary .glb
AddType model/gltf+json .gltf

# Enable CORS
<FilesMatch "\.(vrm|glb|gltf|json)$">
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>

# PHP Memory (jika diizinkan)
php_value memory_limit 256M
php_value upload_max_filesize 50M
php_value post_max_size 50M
EOF
```

## 📥 Download Model AI (Opsional)

### Option A: Skip Download (Recommended)
Gunakan Cloud API saja, tidak perlu download model:

```bash
# Tidak perlu download apa-apa!
# Langsung buka browser dan setup API key
```

### Option B: Download Model via Terminal

Jika tetap mau download model untuk offline mode:

```bash
# Buat folder models
mkdir -p models/Xenova/whisper-tiny/onnx
mkdir -p models/Xenova/LaMini-Flan-T5-77M/onnx

# Download Whisper Tiny (39MB)
cd models/Xenova/whisper-tiny
wget -q https://huggingface.co/Xenova/whisper-tiny/raw/main/config.json
wget -q https://huggingface.co/Xenova/whisper-tiny/raw/main/tokenizer_config.json
wget -q https://huggingface.co/Xenova/whisper-tiny/raw/main/tokenizer.json
wget -q https://huggingface.co/Xenova/whisper-tiny/raw/main/preprocessor_config.json
wget -q https://huggingface.co/Xenova/whisper-tiny/raw/main/generation_config.json

cd onnx
wget -q https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/encoder_model.onnx
wget -q https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/decoder_model_merged.onnx

# Download LaMini (300MB) - OPTIONAL, bisa skip!
cd ../../../LaMini-Flan-T5-77M
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/raw/main/config.json
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/raw/main/tokenizer_config.json
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/raw/main/tokenizer.json
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/raw/main/special_tokens_map.json

cd onnx
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/onnx/encoder_model.onnx
wget -q https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/onnx/decoder_model_merged.onnx

# Kembali ke root
cd ~/public_html/bella-ai
```

### Option C: Download Script Otomatis

```bash
# Buat download script
cat > download_models_domainesia.sh << 'EOF'
#!/bin/bash
echo "📥 Downloading Bella AI Models..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Whisper Tiny
echo -e "${YELLOW}Downloading Whisper Tiny (Voice Recognition)...${NC}"
mkdir -p models/Xenova/whisper-tiny/onnx
cd models/Xenova/whisper-tiny

# Download configs
for file in config.json tokenizer_config.json tokenizer.json preprocessor_config.json generation_config.json; do
    wget -q --show-progress https://huggingface.co/Xenova/whisper-tiny/raw/main/$file
done

# Download models
cd onnx
wget -q --show-progress https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/encoder_model.onnx
wget -q --show-progress https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/decoder_model_merged.onnx

echo -e "${GREEN}✓ Whisper Tiny downloaded!${NC}"

# Ask for LaMini
echo -e "${YELLOW}Download LaMini Chat Model (300MB)? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Downloading LaMini...${NC}"
    cd ../../../
    mkdir -p LaMini-Flan-T5-77M/onnx
    cd LaMini-Flan-T5-77M
    
    for file in config.json tokenizer_config.json tokenizer.json special_tokens_map.json; do
        wget -q --show-progress https://huggingface.co/Xenova/LaMini-Flan-T5-77M/raw/main/$file
    done
    
    cd onnx
    wget -q --show-progress https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/onnx/encoder_model.onnx
    wget -q --show-progress https://huggingface.co/Xenova/LaMini-Flan-T5-77M/resolve/main/onnx/decoder_model_merged.onnx
    
    echo -e "${GREEN}✓ LaMini downloaded!${NC}"
else
    echo -e "${YELLOW}Skipping LaMini. You can use Cloud API instead.${NC}"
fi

cd ~/public_html/bella-ai
echo -e "${GREEN}✅ Download complete!${NC}"
EOF

# Make executable and run
chmod +x download_models_domainesia.sh
./download_models_domainesia.sh
```

## 🔧 Set Permissions

```bash
# Set proper permissions
chmod -R 755 .
chmod -R 777 models/  # Untuk cache model
```

## 🌐 Setup Domain/Subdomain

### Option 1: Subdomain (Recommended)
1. Login Domainesia Client Area
2. Kelola Hosting → Subdomain
3. Buat: `bella.domain.com` → `/public_html/bella-ai`

### Option 2: Subfolder
Akses via: `https://domain.com/bella-ai/`

## ✅ Test Installation

```bash
# Check files
ls -la

# Test PHP runner
curl -I http://domain.com/bella-ai/

# Check logs if error
tail -f ~/logs/error_log
```

## 🚀 Quick One-Liner Install

Copy paste ini ke terminal Domainesia:

```bash
cd ~/public_html && git clone https://github.com/pendtiumpraz/bella-ai.git && cd bella-ai && cat > index.php << 'EOF'
<?php
$p=$_SERVER['REQUEST_URI'];$f=__DIR__.str_replace('/bella-ai','',$p);
if($p=='/bella-ai/'||$p=='/bella-ai')$f=__DIR__.'/index.html';
if(!file_exists($f)){http_response_code(404);die('404');}
$e=pathinfo($f,PATHINFO_EXTENSION);
$t=['js'=>'application/javascript','css'=>'text/css','html'=>'text/html',
'json'=>'application/json','vrm'=>'model/gltf-binary','glb'=>'model/gltf-binary',
'mp4'=>'video/mp4','png'=>'image/png','jpg'=>'image/jpeg','webp'=>'image/webp'];
header('Content-Type:'.($t[$e]??'application/octet-stream'));
if(in_array($e,['vrm','glb','json']))header('Access-Control-Allow-Origin:*');
readfile($f);
EOF
```

## 🎯 Tips Khusus Domainesia

1. **SSL sudah aktif** - Domainesia kasih SSL gratis
2. **Node.js kadang tersedia** - Check dulu dengan `node --version`
3. **Memory limit** - Default 256MB, cukup untuk Bella AI
4. **Support bagus** - Chat support jika ada masalah

## ❓ Troubleshooting

### Error 500
```bash
# Check error log
tail -f ~/logs/domain.com/http/error.log

# Fix permission
chmod 755 index.php
chmod 755 .htaccess
```

### Model tidak load
- Skip saja! Pakai Cloud API
- Atau host model di Google Drive

### Memory exhausted
```bash
# Add to .htaccess
php_value memory_limit 512M
```

## 🎉 Selesai!

Akses Bella AI di:
- Subdomain: `https://bella.domain.com`
- Subfolder: `https://domain.com/bella-ai/`

**Pro tip**: Tidak perlu download model, langsung pakai Google Gemini API gratis! 🚀