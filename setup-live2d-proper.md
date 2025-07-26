# Cara Setup Live2D yang Benar untuk Bella AI

## Langkah 1: Download Cubism SDK

1. Pergi ke https://www.live2d.com/en/download/cubism-sdk/
2. Download **Cubism SDK for Web**
3. Daftar akun Live2D (gratis)
4. Download file SDK

## Langkah 2: Extract dan Setup

```bash
# Extract SDK
unzip CubismSdkForWeb-4-r.7.zip

# Copy ke folder Bella
cp -r CubismSdkForWeb-4-r.7/Core /mnt/d/AI/Bella/live2d-sdk/
cp -r CubismSdkForWeb-4-r.7/Framework /mnt/d/AI/Bella/live2d-sdk/
```

## Langkah 3: Buat Live2D Viewer yang Proper

File: `live2d-sdk-viewer.html`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bella Live2D SDK Viewer</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }
        #canvas {
            display: block;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    
    <!-- Live2D SDK -->
    <script src="live2d-sdk/Core/live2dcubismcore.js"></script>
    <script src="https://cubism.live2d.com/sdk-web/cubismframework/live2dcubismframework.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>
    
    <script>
        // Initialize Live2D
        window.onload = async function() {
            // Load Cubism Core
            await Live2DCubismCore.initialize();
            
            // Setup canvas
            const canvas = document.getElementById('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const gl = canvas.getContext('webgl');
            
            // Load model
            async function loadModel(modelPath) {
                const response = await fetch(modelPath);
                const modelJson = await response.json();
                
                // Model akan di-load dengan SDK resmi
                // SDK akan handle MOC parsing dengan benar
            }
        };
    </script>
</body>
</html>
```

## Alternatif: Pakai Library Open Source

### 1. Pixi-live2d-display (Recommended)
```bash
npm install pixi-live2d-display
```

### 2. oh-my-live2d
```bash
npm install oh-my-live2d
```

## Kenapa File MOC Susah Di-parse?

1. **Format Proprietary** - Live2D Inc punya format sendiri yang di-protect
2. **Butuh License Key** - Untuk parsing MOC butuh Core library resmi
3. **Rigging Data Complex** - Data skeleton, mesh deformation, physics, dll

## Saran Saya:

1. **Pakai SDK Resmi** - Download gratis dari Live2D untuk non-komersial
2. **Atau Pakai VRM Models** - Format open source, lebih mudah
3. **Atau Convert ke Video/GIF** - Kalau cuma butuh animasi sederhana

## Link Penting:

- SDK Download: https://www.live2d.com/en/download/cubism-sdk/
- Documentation: https://docs.live2d.com/cubism-sdk-tutorials/
- License: https://www.live2d.com/en/terms/live2d-proprietary-software-license-agreement/

## Model VRM sebagai Alternatif:

Kamu sudah punya model VRM di folder yang bisa langsung dipakai:
- Galih Hoodie.vrm
- Galih Hoodie Edmuku.vrm
- dll

VRM lebih mudah karena:
- Format open source
- Tidak perlu SDK khusus
- Bisa pakai Three.js biasa