# Tutorial Deploy Bella AI di Shared Hosting

## 📋 Persyaratan Shared Hosting

Yang dibutuhkan:
- PHP 5.6+ (hampir semua shared hosting punya)
- Akses cPanel/DirectAdmin/Plesk
- Space minimal 500MB
- SSL Certificate (untuk fitur microphone)

## 🚀 Langkah-Langkah Deploy

### Step 1: Download Bella AI

```bash
# Jika ada SSH access
cd public_html
git clone https://github.com/pendtiumpraz/bella-ai.git

# Atau download ZIP dan extract via File Manager
```

### Step 2: Buat File PHP Runner

Buat file `index.php` di folder bella-ai:

```php
<?php
// Bella AI Runner for Shared Hosting
// No Python or Node.js required!

$requestUri = $_SERVER['REQUEST_URI'];
$basePath = dirname($_SERVER['SCRIPT_NAME']);
$relativePath = substr($requestUri, strlen($basePath));

// Remove query string
$relativePath = explode('?', $relativePath)[0];

// Default to index.html
if ($relativePath === '/' || $relativePath === '') {
    $relativePath = '/index.html';
}

$filePath = __DIR__ . $relativePath;
$filePath = realpath($filePath);

// Security check
if (!$filePath || !str_starts_with($filePath, __DIR__)) {
    http_response_code(404);
    die('404 Not Found');
}

// Check if file exists
if (!file_exists($filePath) || !is_file($filePath)) {
    http_response_code(404);
    die('404 Not Found');
}

// Get file extension
$ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

// Set proper headers
$mimeTypes = [
    'html' => 'text/html',
    'htm' => 'text/html',
    'js' => 'application/javascript',
    'css' => 'text/css',
    'json' => 'application/json',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'webp' => 'image/webp',
    'svg' => 'image/svg+xml',
    'ico' => 'image/x-icon',
    'mp4' => 'video/mp4',
    'webm' => 'video/webm',
    'mp3' => 'audio/mpeg',
    'wav' => 'audio/wav',
    'ogg' => 'audio/ogg',
    'ttf' => 'font/ttf',
    'woff' => 'font/woff',
    'woff2' => 'font/woff2',
    'vrm' => 'model/gltf-binary',
    'glb' => 'model/gltf-binary',
    'gltf' => 'model/gltf+json',
    'bin' => 'application/octet-stream',
    'onnx' => 'application/octet-stream'
];

$contentType = $mimeTypes[$ext] ?? 'application/octet-stream';

// CORS headers for 3D models and API
if (in_array($ext, ['vrm', 'glb', 'gltf', 'json', 'bin', 'onnx'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Set content type
header('Content-Type: ' . $contentType);

// Cache headers for static assets
if (in_array($ext, ['js', 'css', 'png', 'jpg', 'jpeg', 'webp', 'woff', 'woff2'])) {
    header('Cache-Control: public, max-age=31536000');
}

// Output file
readfile($filePath);
?>
```

### Step 3: Setup .htaccess

Buat file `.htaccess`:

```apache
# Bella AI Shared Hosting Configuration

# Redirect all requests to index.php
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# PHP settings (if allowed)
php_value upload_max_filesize 50M
php_value post_max_size 50M
php_value max_execution_time 300
php_value memory_limit 256M

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"

# Enable GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Step 4: Konfigurasi di cPanel

1. **File Manager**:
   - Upload semua file ke `public_html/bella-ai/`
   - Set permission folder `models` dan `vtuber` ke 755

2. **MIME Types** (di cPanel → Advanced → MIME Types):
   ```
   .vrm    model/gltf-binary
   .glb    model/gltf-binary  
   .gltf   model/gltf+json
   .onnx   application/octet-stream
   ```

3. **SSL Certificate**:
   - Pastikan SSL aktif (gratis via Let's Encrypt)
   - Diperlukan untuk fitur microphone

### Step 5: Test & Troubleshooting

1. **Akses website**: `https://yourdomain.com/bella-ai/`

2. **Jika error CORS**:
   Tambahkan di `.htaccess`:
   ```apache
   <FilesMatch "\.(vrm|glb|gltf|json|onnx)$">
       Header set Access-Control-Allow-Origin "*"
   </FilesMatch>
   ```

3. **Jika model tidak load**:
   Check file size limit di hosting, mungkin perlu:
   - Compress VRM files
   - Host di external CDN

### Step 6: Optimasi untuk Shared Hosting

1. **Kurangi ukuran model VRM**:
   ```bash
   # Gunakan tools kompresi VRM
   # Atau host model di CDN gratis seperti:
   # - jsDelivr
   # - Statically
   # - GitHack
   ```

2. **Lazy Loading**:
   Edit `script.js`, load model hanya saat dipilih

3. **CDN untuk library**:
   Sudah menggunakan CDN untuk Three.js

## 🎯 Quick Deploy Script

Buat `deploy.sh` di local:

```bash
#!/bin/bash
# Bella AI Shared Hosting Deploy Script

echo "🚀 Deploying Bella AI to Shared Hosting..."

# Zip files (exclude large/unnecessary files)
zip -r bella-ai.zip . \
  -x "*.git*" \
  -x "node_modules/*" \
  -x "*.md" \
  -x "deploy.sh" \
  -x "models/*" # Upload models separately if too large

echo "📦 Created bella-ai.zip"
echo "📤 Upload this zip to your hosting's File Manager"
echo "📂 Extract to public_html/"
echo "✅ Access: https://yourdomain.com/bella-ai/"
```

## ⚡ One-Click Install untuk Hosting Populer

### Niagahoster/Hostinger:
1. Login cPanel → File Manager
2. Upload `bella-ai.zip` ke public_html
3. Extract
4. Buka `yourdomain.com/bella-ai`

### IDCloudHost:
1. DirectAdmin → File Manager  
2. Upload & extract files
3. Set PHP version ke 7.4+ (jika perlu)

### Rumahweb:
1. cPanel → File Manager
2. Upload semua file
3. Aktifkan SSL gratis

## ✅ Checklist Final

- [ ] Semua file terupload
- [ ] index.php dan .htaccess ada
- [ ] SSL certificate aktif
- [ ] MIME types terkonfigurasi
- [ ] Test avatar load dengan benar
- [ ] Test voice recognition (HTTPS required)
- [ ] API key tersimpan (untuk Cloud AI)

## 🎉 Selesai!

Bella AI sekarang berjalan di shared hosting tanpa perlu:
- ❌ Python
- ❌ Node.js  
- ❌ Root access
- ❌ VPS

Cukup PHP biasa yang ada di semua shared hosting! 🚀