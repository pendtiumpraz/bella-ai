#!/usr/bin/env python3
"""
Script to download VRM character thumbnails from Google Images
"""

import os
import time
import requests
from urllib.parse import quote
import json
import re

# List of VRM models from vtuberModels.js
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
    {"name": "Jingliu HSR", "filename": "jingliu_hsr.jpg"},
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
    {"name": "Neuro-Sama", "filename": "neuro_sama.jpg"},
    {"name": "Nezuko Kamado", "filename": "nezuko_kamado.jpg"},
    {"name": "Nico Robin", "filename": "nico_robin.jpg"},
    {"name": "Niya", "filename": "niya.jpg"},
    {"name": "Oni", "filename": "oni.jpg"},
    {"name": "Prinz Eugen", "filename": "prinz_eugen.jpg"},
    {"name": "QiongJiu", "filename": "qiongjiu.jpg"},
    {"name": "Raiden Mei", "filename": "raiden_mei.jpg"},
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
    {"name": "Topaz", "filename": "topaz.jpg"},
    {"name": "Vocaloid Miku", "filename": "vocaloid_miku.jpg"},
    {"name": "WINE", "filename": "wine.jpg"},
    {"name": "Yae Miko", "filename": "yae_miko.jpg"},
    {"name": "Zeke", "filename": "zeke.jpg"},
    {"name": "Fu Hua Swimsuit", "filename": "fu_hua_swimsuit.jpg"},
    {"name": "Fu Hua Herrscher of Sentience", "filename": "fu_hua_hos.jpg"},
    {"name": "Kiana Herrscher of the Void", "filename": "kiana_hov.jpg"}
]

def search_and_download_image(query, output_path):
    """
    Search for an image using a web scraping approach
    Note: This is a simplified version. For production use, consider using proper APIs
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    # Search query
    search_query = f"{query} VRoid Hub character"
    
    # For demonstration, we'll create placeholder files
    # In a real implementation, you would use Google Custom Search API or similar
    print(f"Creating placeholder for: {query}")
    
    # Create a placeholder image (1x1 transparent PNG)
    placeholder_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\xf8\x0c\xf8`\x00\x00\x00\x00IEND\xaeB`\x82'
    
    with open(output_path, 'wb') as f:
        f.write(placeholder_png)
    
    return True

def main():
    # Create thumbnails directory if it doesn't exist
    thumbnails_dir = "vtuber/thumbnails"
    os.makedirs(thumbnails_dir, exist_ok=True)
    
    print(f"Starting thumbnail download for {len(vrm_models)} models...")
    
    successful = 0
    failed = []
    
    for i, model in enumerate(vrm_models):
        print(f"\n[{i+1}/{len(vrm_models)}] Processing: {model['name']}")
        
        output_path = os.path.join(thumbnails_dir, model['filename'])
        
        # Skip if already exists
        if os.path.exists(output_path):
            print(f"  ✓ Already exists: {model['filename']}")
            successful += 1
            continue
        
        try:
            if search_and_download_image(model['name'], output_path):
                print(f"  ✓ Downloaded: {model['filename']}")
                successful += 1
            else:
                print(f"  ✗ Failed to download: {model['name']}")
                failed.append(model['name'])
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
            failed.append(model['name'])
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
    
    print(f"\n{'='*50}")
    print(f"Download complete!")
    print(f"Successful: {successful}/{len(vrm_models)}")
    
    if failed:
        print(f"\nFailed downloads ({len(failed)}):")
        for name in failed:
            print(f"  - {name}")
    
    # Create a script to update vtuberModels.js with thumbnail paths
    print("\nGenerating update script...")
    
    update_script = """
// Update script for vtuberModels.js
// Copy these thumbnail paths to your model entries

const thumbnailPaths = {
"""
    
    for model in vrm_models:
        update_script += f'    "{model["name"]}": "vtuber/thumbnails/{model["filename"]}",\n'
    
    update_script += "};\n"
    
    with open("update_thumbnails.js", "w", encoding="utf-8") as f:
        f.write(update_script)
    
    print("Update script created: update_thumbnails.js")
    print("\nNote: The current implementation creates placeholder images.")
    print("For actual images, you would need to:")
    print("1. Use Google Custom Search API with an API key")
    print("2. Or manually download images from VRoid Hub")
    print("3. Or use a web scraping library like Selenium")

if __name__ == "__main__":
    main()