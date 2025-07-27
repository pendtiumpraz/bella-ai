const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Set proper MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
  '.vrm': 'model/gltf-binary',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.onnx': 'application/octet-stream',
  '.bin': 'application/octet-stream'
};

// Serve static files with proper MIME types
app.use(express.static('.', {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext];
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
    
    // Add CORS headers for 3D models and AI models
    if (['.vrm', '.glb', '.gltf', '.json', '.onnx', '.bin'].includes(ext)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    // Cache static assets
    if (['.js', '.css', '.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Compression middleware
app.use(require('compression')());

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API endpoint for server info
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Bella AI Server',
    version: '1.0.0',
    node: process.version,
    platform: process.platform,
    memory: process.memoryUsage()
  });
});

// Catch all - serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Bella AI Server Started!
📍 Local: http://localhost:${PORT}
📍 Network: http://${getNetworkIP()}:${PORT}
🎭 Avatar Mode Ready
🎤 Voice Recognition Ready
💬 Chat Interface Ready
  `);
});

// Helper to get network IP
function getNetworkIP() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}