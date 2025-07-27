# Deploy Bella AI dengan Node.js di Shared Hosting

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# SSH ke hosting Anda
cd public_html/bella-ai

# Install minimal dependencies
npm install express compression
```

### 2. Jalankan Server

```bash
# Start server
npm start

# Atau dengan PM2 (recommended)
npm run pm2
```

### 3. Akses Website

```
http://yourdomain.com:8000
```

## 📋 Konfigurasi untuk Hosting Populer

### A. cPanel dengan Node.js Selector

1. **Login cPanel** → **Setup Node.js App**
2. **Create Application**:
   - Node.js version: 14.x atau lebih tinggi
   - Application mode: Production
   - Application root: bella-ai
   - Application URL: yourdomain.com
   - Application startup file: server.js

3. **Run NPM Install** dari cPanel
4. **Start App**

### B. DirectAdmin dengan Node.js

1. **Node.js** → **Create Node.js Application**
2. Set:
   - Application root: /domains/yourdomain.com/public_html/bella-ai
   - Application URL: http://yourdomain.com
   - Startup file: server.js

3. **Install dependencies** → **Start**

### C. Plesk dengan Node.js

1. **Websites & Domains** → **Node.js**
2. **Add Application**:
   - Document Root: /bella-ai
   - Application Startup File: server.js
   - Node.js Version: 14+

3. **NPM Install** → **Run**

## 🔧 Setup dengan PM2 (Process Manager)

PM2 membuat aplikasi tetap jalan 24/7:

```bash
# Install PM2 global (jika belum ada)
npm install -g pm2

# Start Bella AI
pm2 start server.js --name bella-ai

# Auto restart jika crash
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs bella-ai
```

## 🌐 Reverse Proxy Setup (Apache)

Jika port 8000 diblokir, gunakan reverse proxy.

Edit `.htaccess` di root domain:

```apache
RewriteEngine On

# Proxy untuk Bella AI
RewriteCond %{REQUEST_URI} ^/bella-ai [NC]
RewriteRule ^bella-ai/(.*)$ http://localhost:8000/$1 [P,L]

# Enable proxy modules
<IfModule mod_proxy.c>
    ProxyPass /bella-ai http://localhost:8000/
    ProxyPassReverse /bella-ai http://localhost:8000/
</IfModule>
```

Atau di VirtualHost config:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    
    # Bella AI proxy
    ProxyPass /bella-ai http://localhost:8000/
    ProxyPassReverse /bella-ai http://localhost:8000/
    
    # WebSocket support untuk real-time features
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:8000/$1" [P,L]
</VirtualHost>
```

## 🔒 Environment Variables

Buat `.env` file:

```bash
# Server Config
PORT=8000
NODE_ENV=production

# API Keys (optional)
OPENAI_API_KEY=your_key
GOOGLE_API_KEY=your_key

# Security
CORS_ORIGIN=https://yourdomain.com
```

Update `server.js` untuk baca .env:

```javascript
require('dotenv').config();
const PORT = process.env.PORT || 8000;
```

## ⚡ Optimasi Performance

### 1. Enable Compression

Sudah included di server.js:
```javascript
app.use(require('compression')());
```

### 2. Static File Caching

Sudah diset di server.js dengan header Cache-Control

### 3. CDN untuk Assets Besar

Edit paths di `avatarSelector.html`:
```javascript
// Ganti local path
path: 'vtuber/Galih Hoodie Esteh.vrm'

// Dengan CDN
path: 'https://cdn.yourdomain.com/vtuber/Galih Hoodie Esteh.vrm'
```

## 🐛 Troubleshooting

### Port 8000 Blocked

Beberapa hosting block port non-standard. Solusi:

1. **Gunakan port 3000** (lebih umum diizinkan):
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

2. **Atau gunakan reverse proxy** (lihat di atas)

### Memory Limit Exceeded

Tambahkan di start command:
```bash
node --max-old-space-size=512 server.js
```

### Permission Denied

```bash
chmod +x server.js
chmod -R 755 .
```

## 📊 Monitoring & Logs

### Dengan PM2

```bash
# Real-time logs
pm2 logs bella-ai

# Monitor CPU & Memory
pm2 monit

# Web dashboard
pm2 install pm2-web
```

### Manual Logging

Tambahkan di server.js:
```javascript
const fs = require('fs');
const logFile = fs.createWriteStream('./logs/app.log', {flags: 'a'});

app.use((req, res, next) => {
  logFile.write(`${new Date().toISOString()} - ${req.method} ${req.url}\n`);
  next();
});
```

## 🚀 One-Command Deploy

Buat `deploy.sh`:

```bash
#!/bin/bash
echo "🚀 Deploying Bella AI..."

# Pull latest changes
git pull

# Install/update dependencies
npm install --production

# Restart with PM2
pm2 restart bella-ai || pm2 start server.js --name bella-ai

echo "✅ Bella AI deployed successfully!"
echo "🌐 Access at: http://yourdomain.com:8000"
```

## ✅ Checklist Deployment

- [ ] Node.js 14+ terinstall di hosting
- [ ] Dependencies terinstall (`npm install`)
- [ ] Port 8000/3000 accessible
- [ ] SSL certificate aktif (untuk HTTPS)
- [ ] PM2 running (optional tapi recommended)
- [ ] Reverse proxy configured (jika perlu)

## 🎉 Selesai!

Bella AI sekarang running dengan Node.js! Keuntungan pakai Node.js:

✅ Performance lebih baik
✅ Real-time features support
✅ WebSocket ready
✅ Better error handling
✅ Production-ready dengan PM2

Akses di: `http://yourdomain.com:8000` atau `http://yourdomain.com/bella-ai` (jika pakai reverse proxy)