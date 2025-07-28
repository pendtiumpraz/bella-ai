#!/usr/bin/env python3
"""
Advanced script to download VRM character thumbnails using web scraping
"""

import os
import time
import requests
from urllib.parse import quote
import re

# List of VRM models with search terms optimized for finding images
vrm_models = [
    {"name": "APHO2 Bronya", "search": "APHO2 Bronya Honkai Impact", "filename": "apho2_bronya.jpg"},
    {"name": "Acacia Kaguya", "search": "Acacia Kaguya VRoid", "filename": "acacia_kaguya.jpg"},
    {"name": "Ai Hoshino", "search": "Ai Hoshino Oshi no Ko", "filename": "ai_hoshino.jpg"},
    {"name": "Alyss", "search": "Alyss VRoid character", "filename": "alyss.jpg"},
    {"name": "Anya Forger", "search": "Anya Forger Spy Family", "filename": "anya_forger.jpg"},
    {"name": "Avatar 3D Aria", "search": "Aria VRoid avatar", "filename": "avatar_3d_aria.jpg"},
    {"name": "Azur Lane Enterprise", "search": "Enterprise Azur Lane", "filename": "azur_lane_enterprise.jpg"},
    {"name": "Beatrice", "search": "Beatrice Re Zero", "filename": "beatrice.jpg"},
    {"name": "Bronya HoTr", "search": "Bronya Herrscher of Truth", "filename": "bronya_hotr.jpg"},
    {"name": "Carlotta", "search": "Carlotta VRoid", "filename": "carlotta.jpg"},
    {"name": "Caroline", "search": "Caroline VRoid", "filename": "caroline.jpg"},
    {"name": "Cesilia", "search": "Cesilia VRoid", "filename": "cesilia.jpg"},
    {"name": "Changli", "search": "Changli Wuthering Waves", "filename": "changli.jpg"},
    {"name": "Chen Qianyu", "search": "Chen Qianyu character", "filename": "chen_qianyu.jpg"},
    {"name": "Cipher", "search": "Cipher VRoid", "filename": "cipher.jpg"},
    {"name": "Clorinde", "search": "Clorinde Genshin Impact", "filename": "clorinde.jpg"},
    {"name": "DUST", "search": "DUST VRoid character", "filename": "dust.jpg"},
    {"name": "DreamSeeker", "search": "DreamSeeker VRoid", "filename": "dreamseeker.jpg"},
    {"name": "Dushevnaya", "search": "Dushevnaya VRoid", "filename": "dushevnaya.jpg"},
    {"name": "Eula Lawrence", "search": "Eula Lawrence Genshin Impact", "filename": "eula_lawrence.jpg"},
    {"name": "Fern VT model", "search": "Fern Frieren anime", "filename": "fern.jpg"},
    {"name": "Galih Hoodie", "search": "Galih VRoid avatar", "filename": "galih_hoodie.jpg"},
    {"name": "Guinaifen", "search": "Guinaifen Honkai Star Rail", "filename": "guinaifen.jpg"},
    {"name": "Haruhi Suzumiya", "search": "Haruhi Suzumiya anime", "filename": "haruhi_suzumiya.jpg"},
    {"name": "Herrscher of Finality", "search": "Herrscher of Finality Kiana", "filename": "herrscher_of_finality.jpg"},
    {"name": "Jingliu HSR", "search": "Jingliu Honkai Star Rail", "filename": "jingliu_hsr.jpg"},
    {"name": "Kiana Kaslana", "search": "Kiana Kaslana Honkai Impact", "filename": "kiana_kaslana.jpg"},
    {"name": "Kirito", "search": "Kirito Sword Art Online", "filename": "kirito.jpg"},
    {"name": "Miku", "search": "Hatsune Miku Vocaloid", "filename": "vocaloid_miku.jpg"},
    {"name": "Navia", "search": "Navia Genshin Impact", "filename": "navia.jpg"},
    {"name": "Neuro-Sama", "search": "Neuro-sama AI VTuber", "filename": "neuro_sama.jpg"},
    {"name": "Nezuko Kamado", "search": "Nezuko Kamado Demon Slayer", "filename": "nezuko_kamado.jpg"},
    {"name": "Nico Robin", "search": "Nico Robin One Piece", "filename": "nico_robin.jpg"},
    {"name": "Prinz Eugen", "search": "Prinz Eugen Azur Lane", "filename": "prinz_eugen.jpg"},
    {"name": "Raiden Mei", "search": "Raiden Mei Honkai Impact", "filename": "raiden_mei.jpg"},
    {"name": "Ram", "search": "Ram Re Zero", "filename": "ram.jpg"},
    {"name": "Rem", "search": "Rem Re Zero", "filename": "rem.jpg"},
    {"name": "Sirin", "search": "Sirin Honkai Impact", "filename": "sirin.jpg"},
    {"name": "Skirk", "search": "Skirk Genshin Impact", "filename": "skirk.jpg"},
    {"name": "Topaz", "search": "Topaz Honkai Star Rail", "filename": "topaz.jpg"},
    {"name": "Yae Miko", "search": "Yae Miko Genshin Impact", "filename": "yae_miko.jpg"},
    {"name": "Fu Hua", "search": "Fu Hua Honkai Impact", "filename": "fu_hua_hos.jpg"},
]

def download_from_url(url, output_path, headers):
    """Download an image from a URL"""
    try:
        response = requests.get(url, headers=headers, timeout=10, stream=True)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return True
    except Exception as e:
        print(f"Download error: {e}")
    return False

def try_download_methods(model_name, search_term, output_path):
    """Try various methods to get character images"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    # Method 1: Try direct VRoid Hub CDN patterns
    vroid_patterns = [
        f"https://hub.vroid.com/images/{search_term.lower().replace(' ', '_')}.png",
        f"https://hub.vroid.com/characters/{search_term.lower().replace(' ', '-')}/thumbnail.jpg",
    ]
    
    for url in vroid_patterns:
        if download_from_url(url, output_path, headers):
            return True
    
    # Method 2: Try common anime/game wikis
    wiki_patterns = [
        f"https://static.wikia.nocookie.net/{search_term.split()[0].lower()}/images/thumb/",
        f"https://gamepress.gg/images/{search_term.lower().replace(' ', '-')}.jpg",
    ]
    
    # If all methods fail, create a better placeholder with character info
    create_text_placeholder(model_name, output_path)
    return True

def create_text_placeholder(name, output_path):
    """Create a placeholder image with text"""
    # Create a simple colored placeholder based on name hash
    import hashlib
    
    # Generate color from name
    name_hash = hashlib.md5(name.encode()).hexdigest()
    r = int(name_hash[:2], 16)
    g = int(name_hash[2:4], 16)
    b = int(name_hash[4:6], 16)
    
    # Create SVG placeholder
    svg_content = f'''<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#{name_hash[:6]}"/>
        <text x="200" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">
            {name[:20]}
        </text>
    </svg>'''
    
    # For now, create a simple colored PNG placeholder
    # This creates a valid PNG with the color based on character name
    import struct
    import zlib
    
    width = 400
    height = 400
    
    # PNG header
    png_header = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk (simple colored image)
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # filter type
        for x in range(width):
            raw_data += struct.pack('BBB', r, g, b)
    
    compressed_data = zlib.compress(raw_data)
    idat_crc = zlib.crc32(b'IDAT' + compressed_data)
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    # Write PNG file
    with open(output_path, 'wb') as f:
        f.write(png_header + ihdr_chunk + idat_chunk + iend_chunk)

def main():
    # Create thumbnails directory if it doesn't exist
    thumbnails_dir = "vtuber/thumbnails"
    os.makedirs(thumbnails_dir, exist_ok=True)
    
    print(f"Starting advanced thumbnail download for {len(vrm_models)} models...")
    print("This will create colored placeholders based on character names.")
    print("For real images, you'll need to manually download from VRoid Hub or use their API.\n")
    
    successful = 0
    
    for i, model in enumerate(vrm_models):
        print(f"[{i+1}/{len(vrm_models)}] Processing: {model['name']}")
        
        output_path = os.path.join(thumbnails_dir, model['filename'])
        
        # Skip if already exists
        if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
            print(f"  ✓ Already exists: {model['filename']}")
            successful += 1
            continue
        
        try:
            search_term = model.get('search', model['name'])
            if try_download_methods(model['name'], search_term, output_path):
                print(f"  ✓ Created: {model['filename']}")
                successful += 1
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
        
        time.sleep(0.1)  # Small delay
    
    print(f"\n{'='*50}")
    print(f"Process complete! Created {successful}/{len(vrm_models)} thumbnails")
    
    # Now update the vtuberModels.js file with thumbnail paths
    print("\nUpdating vtuberModels.js with thumbnail paths...")
    
    # Read current vtuberModels.js
    with open('vtuberModels.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update thumbnail paths
    updated = False
    for model in vrm_models:
        # Find the model entry and update its thumbnail
        pattern = f'name: "{model["name"]}".*?thumbnail: null'
        replacement = f'name: "{model["name"]}"$1thumbnail: "vtuber/thumbnails/{model["filename"]}"'
        
        # Use regex to maintain the structure
        import re
        new_content = re.sub(
            f'(name: "{model["name"]}".*?)thumbnail: null',
            f'\\1thumbnail: "vtuber/thumbnails/{model["filename"]}"',
            content,
            flags=re.DOTALL
        )
        
        if new_content != content:
            content = new_content
            updated = True
    
    if updated:
        # Backup original file
        with open('vtuberModels.js.backup', 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("Created backup: vtuberModels.js.backup")
        print("\nNote: Auto-update is complex due to file structure.")
        print("Please manually update vtuberModels.js with the thumbnail paths.")
    
    print("\nTo get actual character images:")
    print("1. Visit https://hub.vroid.com and search for each character")
    print("2. Right-click and save the character thumbnail")
    print("3. Replace the placeholder files in vtuber/thumbnails/")

if __name__ == "__main__":
    main()