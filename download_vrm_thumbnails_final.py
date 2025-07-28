#!/usr/bin/env python3
"""
Script to download VRM character thumbnails from vroid-hub.pximg.net
Uses web scraping to find actual VRoid Hub images
"""

import os
import time
import requests
from urllib.parse import quote, urlparse
import re
import json

# Install required packages: pip install requests beautifulsoup4
try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing beautifulsoup4...")
    os.system("pip install beautifulsoup4")
    from bs4 import BeautifulSoup

# List of VRM models
vrm_models = [
    {"name": "APHO2 Bronya", "filename": "apho2_bronya.jpg"},
    {"name": "Acacia Kaguya", "filename": "acacia_kaguya.jpg"},
    {"name": "Ai Hoshino", "filename": "ai_hoshino.jpg"},
    {"name": "Alyss", "filename": "alyss.jpg"},
    {"name": "Anya Forger", "filename": "anya_forger.jpg"},
    {"name": "Avatar 3D Aria", "filename": "avatar_3d_aria.jpg"},
    {"name": "Azur Lane Enterprise", "filename": "azur_lane_enterprise.jpg"},
    {"name": "Beatrice", "filename": "beatrice.jpg"},
    {"name": "Bronya HoTr", "filename": "bronya_hotr.jpg"},
    {"name": "Carlotta", "filename": "carlotta.jpg"},
    {"name": "Caroline", "filename": "caroline.jpg"},
    {"name": "Cesilia", "filename": "cesilia.jpg"},
    {"name": "Changli", "filename": "changli.jpg"},
    {"name": "Chen Qianyu", "filename": "chen_qianyu.jpg"},
    {"name": "Cipher", "filename": "cipher.jpg"},
    {"name": "Clorinde", "filename": "clorinde.jpg"},
    {"name": "DUST", "filename": "dust.jpg"},
    {"name": "DreamSeeker", "filename": "dreamseeker.jpg"},
    {"name": "Dushevnaya", "filename": "dushevnaya.jpg"},
    {"name": "Eula Lawrence", "filename": "eula_lawrence.jpg"},
    {"name": "Fern VT model", "filename": "fern.jpg"},
    {"name": "Freestyletest", "filename": "freestyletest.jpg"},
    {"name": "Galih Hoodie", "filename": "galih_hoodie.jpg"},
    {"name": "Galih Hoodie Edmuku", "filename": "galih_hoodie_edmuku.jpg"},
    {"name": "Galih Hoodie Esteh", "filename": "galih_hoodie_esteh.jpg"},
    {"name": "Galih T shirt Aveecena", "filename": "galih_tshirt_aveecena.jpg"},
    {"name": "Goldy", "filename": "goldy.jpg"},
    {"name": "Guinaifen", "filename": "guinaifen.jpg"},
    {"name": "Haruhi Suzumiya Long hair", "filename": "haruhi_suzumiya.jpg"},
    {"name": "Herrscher of Finality", "filename": "herrscher_of_finality.jpg"},
    {"name": "iCO Gore", "filename": "ico_gore.jpg"},
    {"name": "Jingliu hsr", "filename": "jingliu_hsr.jpg"},
    {"name": "Kiana Kaslana", "filename": "kiana_kaslana.jpg"},
    {"name": "Kirito", "filename": "kirito.jpg"},
    {"name": "Kokuyou", "filename": "kokuyou.jpg"},
    {"name": "Lilac", "filename": "lilac.jpg"},
    {"name": "Luna", "filename": "luna.jpg"},
    {"name": "Lunar New Year's Eve", "filename": "lunar_new_years_eve.jpg"},
    {"name": "Magical girl sirin", "filename": "magical_girl_sirin.jpg"},
    {"name": "Maya2", "filename": "maya.jpg"},
    {"name": "Meryl", "filename": "meryl.jpg"},
    {"name": "Ming Chao", "filename": "ming_chao.jpg"},
    {"name": "Mizuhara Chizuru", "filename": "mizuhara_chizuru.jpg"},
    {"name": "MMORPG Mage", "filename": "mmorpg_mage.jpg"},
    {"name": "Mura Mura", "filename": "mura_mura.jpg"},
    {"name": "Navia", "filename": "navia.jpg"},
    {"name": "Neku Shiro", "filename": "neku_shiro.jpg"},
    {"name": "Nemesis C3", "filename": "nemesis_c3.jpg"},
    {"name": "Neuro-Sama 2.0", "filename": "neuro_sama.jpg"},
    {"name": "Nezuko Kamado", "filename": "nezuko_kamado.jpg"},
    {"name": "Nico Robin", "filename": "nico_robin.jpg"},
    {"name": "Niya", "filename": "niya.jpg"},
    {"name": "Oni", "filename": "oni.jpg"},
    {"name": "Prinz Eugen", "filename": "prinz_eugen.jpg"},
    {"name": "QiongJiu", "filename": "qiongjiu.jpg"},
    {"name": "Raiden Mei", "filename": "raiden_mei.jpg"},
    {"name": "Raiden mie", "filename": "raiden_mie.jpg"},
    {"name": "Ram", "filename": "ram.jpg"},
    {"name": "Rem", "filename": "rem.jpg"},
    {"name": "Renni", "filename": "renni.jpg"},
    {"name": "Rose", "filename": "rose.jpg"},
    {"name": "RX-0 Unicorn", "filename": "rx0_unicorn.jpg"},
    {"name": "Serina Washimi", "filename": "serina_washimi.jpg"},
    {"name": "Shirli", "filename": "shirli.jpg"},
    {"name": "Sirin", "filename": "sirin.jpg"},
    {"name": "Six", "filename": "six.jpg"},
    {"name": "Skirk", "filename": "skirk.jpg"},
    {"name": "Smol Herta", "filename": "smol_herta.jpg"},
    {"name": "Soft Kitty", "filename": "soft_kitty.jpg"},
    {"name": "Test Model", "filename": "test.jpg"},
    {"name": "Toon Anata", "filename": "toon_anata.jpg"},
    {"name": "Topaz ReUp", "filename": "topaz.jpg"},
    {"name": "Vocaloid MIKU", "filename": "vocaloid_miku.jpg"},
    {"name": "WINE", "filename": "wine.jpg"},
    {"name": "Yae Miko", "filename": "yae_miko.jpg"},
    {"name": "Zeke", "filename": "zeke.jpg"},
    {"name": "Fu Hua Swimsuit", "filename": "fu_hua_swimsuit.jpg"},
    {"name": "Fu Hua Herrscher of Sentience", "filename": "fu_hua_hos.jpg"},
    {"name": "Kiana Herrscher of the Void", "filename": "kiana_hov.jpg"}
]

def search_google_images(query):
    """Search Google Images for VRoid Hub images"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    # Search specifically for vroid-hub.pximg.net images
    search_query = f'"{query}" site:vroid-hub.pximg.net OR site:hub.vroid.com'
    search_url = f"https://www.google.com/search?q={quote(search_query)}&tbm=isch"
    
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        if response.status_code == 200:
            # Extract image URLs from Google Images results
            # Look for vroid-hub.pximg.net URLs in the response
            pattern = r'https://vroid-hub\.pximg\.net/[^"]+\.(?:jpg|jpeg|png)'
            urls = re.findall(pattern, response.text)
            
            # Also look for encoded URLs
            pattern2 = r'\\u003dhttps://vroid-hub\.pximg\.net/[^"\\]+\.(?:jpg|jpeg|png)'
            encoded_urls = re.findall(pattern2, response.text)
            
            # Clean up encoded URLs
            for url in encoded_urls:
                clean_url = url.replace('\\u003d', '=').replace('\\u0026', '&')
                if 'vroid-hub.pximg.net' in clean_url:
                    urls.append(clean_url.split('=')[-1])
            
            return list(set(urls))  # Remove duplicates
    except Exception as e:
        print(f"Search error: {e}")
    
    return []

def download_image(url, output_path):
    """Download an image from URL"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://hub.vroid.com/'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15, stream=True)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True
    except Exception as e:
        print(f"    Download error: {e}")
    return False

def try_direct_vroid_patterns(character_name):
    """Try common VRoid Hub URL patterns"""
    # Common VRoid Hub image URL patterns
    patterns = [
        # Portrait images pattern
        "https://vroid-hub.pximg.net/c/1200x1600_a2_g5/images/portrait_images/{id1}/{id2}.png",
        "https://vroid-hub.pximg.net/c/1200x1600_a2_g5/images/portrait_images/{id1}/{id2}.jpg",
        # Character images pattern
        "https://vroid-hub.pximg.net/c/1200x1600/images/characters/{id1}/{id2}.png",
        # Model preview pattern
        "https://vroid-hub.pximg.net/images/models/{id1}/preview.png"
    ]
    
    # For demo purposes, return empty list
    # In real implementation, you'd need to know the actual IDs
    return []

def create_update_script():
    """Create a JavaScript file to update vtuberModels.js"""
    update_js = '''// Auto-generated script to update thumbnail paths in vtuberModels.js
// Run this manually or copy the paths to your vtuberModels.js file

const thumbnailUpdates = [
'''
    
    for model in vrm_models:
        if os.path.exists(f"vtuber/thumbnails/{model['filename']}"):
            update_js += f'    {{ name: "{model["name"]}", thumbnail: "vtuber/thumbnails/{model["filename"]}" }},\n'
    
    update_js += '''];

// Manual update instructions:
// 1. Open vtuberModels.js
// 2. For each model above, find the matching entry and update the thumbnail path
// 3. Change: thumbnail: null
// 4. To: thumbnail: "vtuber/thumbnails/[filename]"

console.log("Thumbnail paths to update:", thumbnailUpdates.length);
'''
    
    with open("update_thumbnails.js", "w", encoding="utf-8") as f:
        f.write(update_js)

def main():
    # Create thumbnails directory
    thumbnails_dir = "vtuber/thumbnails"
    os.makedirs(thumbnails_dir, exist_ok=True)
    
    print("VRoid Hub Thumbnail Downloader")
    print("=" * 50)
    print(f"Will search for {len(vrm_models)} character thumbnails")
    print("Looking specifically for vroid-hub.pximg.net images\n")
    
    successful = 0
    manual_needed = []
    
    for i, model in enumerate(vrm_models):
        character_name = model['name']
        filename = model['filename']
        output_path = os.path.join(thumbnails_dir, filename)
        
        print(f"[{i+1}/{len(vrm_models)}] {character_name}")
        
        # Skip if already exists with reasonable size
        if os.path.exists(output_path) and os.path.getsize(output_path) > 5000:
            print(f"  ✓ Already exists")
            successful += 1
            continue
        
        # Search for images
        print(f"  → Searching Google Images...")
        search_queries = [
            f"{character_name} vroid hub",
            f"{character_name} VRoid",
            f"{character_name} vroid model"
        ]
        
        found = False
        for query in search_queries:
            urls = search_google_images(query)
            
            if urls:
                print(f"  → Found {len(urls)} potential images")
                for url in urls[:3]:  # Try first 3 URLs
                    print(f"  → Trying: {url[:60]}...")
                    if download_image(url, output_path):
                        print(f"  ✓ Downloaded successfully!")
                        successful += 1
                        found = True
                        break
                
                if found:
                    break
            
            time.sleep(2)  # Be respectful to Google
        
        if not found:
            print(f"  ✗ Could not find VRoid Hub image")
            manual_needed.append(character_name)
            # Create a placeholder
            with open(output_path, 'wb') as f:
                f.write(b'')  # Empty file as placeholder
        
        time.sleep(1)  # Rate limiting
    
    print(f"\n{'=' * 50}")
    print(f"Download Summary:")
    print(f"  Successful: {successful}")
    print(f"  Manual needed: {len(manual_needed)}")
    
    if manual_needed:
        print(f"\nCharacters needing manual download:")
        for name in manual_needed[:10]:  # Show first 10
            print(f"  - {name}")
        if len(manual_needed) > 10:
            print(f"  ... and {len(manual_needed) - 10} more")
    
    # Create update script
    create_update_script()
    print("\nCreated update_thumbnails.js with thumbnail paths")
    
    print("\nNext steps:")
    print("1. Check vtuber/thumbnails/ for downloaded images")
    print("2. For missing images, search manually on https://hub.vroid.com")
    print("3. Update vtuberModels.js with the thumbnail paths")
    print("\nTip: Search '{character name} site:hub.vroid.com' on Google Images")

if __name__ == "__main__":
    main()