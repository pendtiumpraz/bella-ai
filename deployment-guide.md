# Bella AI Deployment Guide - No Python Required

## 🚀 Running Without Python

### Option 1: PHP Server (Most Common on Shared Hosting)

Create `serve.php`:
```php
<?php
// Simple PHP server for Bella AI
$path = $_SERVER['REQUEST_URI'];
$file = __DIR__ . $path;

// Security: prevent directory traversal
$file = realpath($file);
if (!$file || !str_starts_with($file, __DIR__)) {
    http_response_code(404);
    exit;
}

// Serve index.html for root
if ($path === '/' || $path === '') {
    $file = __DIR__ . '/index.html';
}

// Set correct MIME types
$ext = pathinfo($file, PATHINFO_EXTENSION);
$mimeTypes = [
    'html' => 'text/html',
    'js' => 'application/javascript',
    'css' => 'text/css',
    'json' => 'application/json',
    'webp' => 'image/webp',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'mp4' => 'video/mp4',
    'vrm' => 'model/gltf-binary',
    'glb' => 'model/gltf-binary',
    'gltf' => 'model/gltf+json'
];

$contentType = $mimeTypes[$ext] ?? 'application/octet-stream';
header('Content-Type: ' . $contentType);

// Enable CORS for 3D models
if (in_array($ext, ['vrm', 'glb', 'gltf', 'json'])) {
    header('Access-Control-Allow-Origin: *');
}

// Serve file
if (file_exists($file) && is_file($file)) {
    readfile($file);
} else {
    http_response_code(404);
    echo "404 Not Found";
}
?>
```

Then access: `http://yourdomain.com/serve.php`

### Option 2: Using .htaccess (Apache)

Create `.htaccess`:
```apache
# Enable directory listing for models
Options -Indexes

# Set MIME types
AddType application/javascript .js
AddType application/json .json
AddType model/gltf-binary .vrm
AddType model/gltf-binary .glb
AddType model/gltf+json .gltf

# Enable CORS for 3D models
<FilesMatch "\.(vrm|glb|gltf|json)$">
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>

# Redirect to index.html
DirectoryIndex index.html

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>
```

### Option 3: Nginx Configuration

Add to your nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/bella-ai;
    index index.html;

    # MIME types for 3D models
    location ~ \.(vrm|glb)$ {
        add_header Content-Type model/gltf-binary;
        add_header Access-Control-Allow-Origin *;
    }

    location ~ \.gltf$ {
        add_header Content-Type model/gltf+json;
        add_header Access-Control-Allow-Origin *;
    }

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Option 4: Node.js (If Available)

Create `server.js`:
```javascript
const express = require('express');
const path = require('path');
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Serve static files
app.use(express.static('.'));

// Set MIME types
express.static.mime.define({
  'model/gltf-binary': ['vrm', 'glb'],
  'model/gltf+json': ['gltf']
});

app.listen(8000, () => {
  console.log('Bella AI running on http://localhost:8000');
});
```

Run with: `node server.js`

### Option 5: Simple Hosting (No Server Config)

If your hosting doesn't allow server configuration:

1. **Upload all files** to public_html or www folder
2. **Create index.php** wrapper:
```php
<?php
// Redirect to actual index.html
header('Location: index.html');
?>
```

3. **For CORS issues**, use a service like:
   - Cloudflare (add CORS headers in rules)
   - Use CDN for models

## 🔧 Common Issues & Solutions

### CORS Errors with VRM Models

**Solution 1**: Host models on CDN
```javascript
// In avatarSelector.html, change paths to:
{
  name: 'Galih Hoodie Esteh',
  path: 'https://your-cdn.com/vtuber/Galih Hoodie Esteh.vrm',
  // ...
}
```

**Solution 2**: Use base64 encoding (for small models)
```javascript
// Convert VRM to base64 and embed directly
const vrmBase64 = "data:model/gltf-binary;base64,..."
```

### MIME Type Errors

Add to your hosting control panel:
- Extension: `.vrm` → MIME: `model/gltf-binary`
- Extension: `.glb` → MIME: `model/gltf-binary`
- Extension: `.gltf` → MIME: `model/gltf+json`

### File Size Limits

Most shared hosting has upload limits (usually 2-50MB). Solutions:
1. Compress VRM files using gzip
2. Host large files on external storage (Google Drive, Dropbox)
3. Use CDN services

## 📱 Mobile Optimization

For better mobile performance without server-side processing:

1. **Lazy load models**:
```javascript
// Only load model when selected
if (selectedAvatar) {
  loadVRM(selectedAvatar.path);
}
```

2. **Reduce texture sizes** in VRM models
3. **Disable complex animations** on mobile

## 🌐 CDN Deployment

### Cloudflare Pages (Free)
1. Fork repo to your GitHub
2. Connect to Cloudflare Pages
3. Deploy automatically

### Vercel (Free) 
```bash
npm i -g vercel
vercel
```

### Netlify (Free)
1. Drag & drop your folder to Netlify
2. Instant deployment

## ✅ Deployment Checklist

- [ ] All files uploaded
- [ ] CORS headers configured
- [ ] MIME types set correctly
- [ ] SSL certificate active (for microphone access)
- [ ] Test on mobile devices
- [ ] API keys configured (if using cloud AI)

## 🎉 That's It!

Bella AI is designed to work anywhere - from premium cloud servers to basic shared hosting. No Python, no complex setup, just upload and run!