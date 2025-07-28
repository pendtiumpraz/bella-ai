#!/usr/bin/env python3
"""
Update vtuberModels.js with PNG thumbnail paths
"""

import re

# List of models with their thumbnail filenames
thumbnails = [
    ("Galih Hoodie", "galih_hoodie.png"),
    ("Galih Hoodie Edmuku", "galih_hoodie_edmuku.png"),
    ("Galih Hoodie Esteh", "galih_hoodie_esteh.png"),
    ("Galih T-shirt Aveecena", "galih_t-shirt_aveecena.png"),
    ("Ai Hoshino", "ai_hoshino.png"),
    ("Anya Forger", "anya_forger.png"),
    ("Nezuko Kamado", "nezuko_kamado.png"),
    ("Fern", "fern.png"),
    ("Avatar 3D Aria", "avatar_3d_aria.png"),
    ("Cesilia", "cesilia.png"),
    ("DUST", "dust.png"),
    ("Freestyle Test", "freestyle_test.png"),
    ("Goldy", "goldy.png"),
    ("Kokuyou v0", "kokuyou_v0.png"),
    ("Kokuyou v1", "kokuyou_v1.png"),
    ("Lilac", "lilac.png"),
    ("Maya", "maya.png"),
    ("Mura Mura", "mura_mura.png"),
    ("Niya", "niya.png"),
    ("Rose", "rose.png"),
    ("APHO2 Bronya", "apho2_bronya.png"),
    ("Acacia Kaguya", "acacia_kaguya.png"),
    ("Alyss", "alyss.png"),
    ("Azur Lane Enterprise", "azur_lane_enterprise.png"),
    ("Beatrice", "beatrice.png"),
    ("Bronya HoTr", "bronya_hotr.png"),
    ("Carlotta", "carlotta.png"),
    ("Caroline", "caroline.png"),
    ("Changli", "changli.png"),
    ("Chen Qianyu", "chen_qianyu.png"),
    ("Cipher", "cipher.png"),
    ("Clorinde", "clorinde.png"),
    ("DreamSeeker", "dreamseeker.png"),
    ("Dushevnaya", "dushevnaya.png"),
    ("Eula Lawrence", "eula_lawrence.png"),
    ("Guinaifen", "guinaifen.png"),
    ("Haruhi Suzumiya", "haruhi_suzumiya.png"),
    ("Herrscher of Finality", "herrscher_of_finality.png"),
    ("iCO Gore", "ico_gore.png"),
    ("Jingliu", "jingliu.png"),
    ("Kiana Kaslana", "kiana_kaslana.png"),
    ("Kirito", "kirito.png"),
    ("Luna", "luna.png"),
    ("Lunar New Year's Eve", "lunar_new_year's_eve.png"),
    ("Magical Girl Sirin", "magical_girl_sirin.png"),
    ("Meryl", "meryl.png"),
    ("Ming Chao", "ming_chao.png"),
    ("Mizuhara Chizuru", "mizuhara_chizuru.png"),
    ("MMORPG Mage", "mmorpg_mage.png"),
    ("Navia", "navia.png"),
    ("Neku Shiro", "neku_shiro.png"),
    ("Nemesis C3", "nemesis_c3.png"),
    ("Neuro-Sama 2.0", "neuro-sama_2.0.png"),
    ("Nezuko Kamado", "nezuko_kamado.png"),
    ("Nico Robin", "nico_robin.png"),
    ("Oni", "oni.png"),
    ("Prinz Eugen", "prinz_eugen.png"),
    ("QiongJiu", "qiongjiu.png"),
    ("Raiden Mei", "raiden_mei.png"),
    ("Raiden Mie", "raiden_mie.png"),
    ("Ram", "ram.png"),
    ("Rem", "rem.png"),
    ("Renni", "renni.png"),
    ("RX-0 Unicorn", "rx-0_unicorn.png"),
    ("Serina Washimi", "serina_washimi.png"),
    ("Shirli", "shirli.png"),
    ("Sirin", "sirin.png"),
    ("Six", "six.png"),
    ("Skirk", "skirk.png"),
    ("Smol Herta", "smol_herta.png"),
    ("Soft Kitty", "soft_kitty.png"),
    ("Test Model", "test_model.png"),
    ("Toon Anata", "toon_anata.png"),
    ("Topaz ReUp", "topaz_reup.png"),
    ("Vocaloid MIKU", "vocaloid_miku.png"),
    ("WINE", "wine.png"),
    ("Yae Miko", "yae_miko.png"),
    ("Zeke", "zeke.png"),
    ("Kiana - Herrscher of the Void", "kiana_-_herrscher_of_the_void.png"),
    ("Kiana CN", "kiana_cn.png"),
    ("Fu Hua Swimsuit", "fu_hua_swimsuit.png"),
    ("Fu Hua - Herrscher of Sentience", "fu_hua_-_herrscher_of_sentience.png")
]

def update_thumbnails():
    # Read current file
    with open('vtuberModels.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Backup
    with open('vtuberModels.js.backup2', 'w', encoding='utf-8') as f:
        f.write(content)
    
    updated = 0
    for name, filename in thumbnails:
        # Pattern to find and update thumbnail
        pattern = f'name: "{name}"(.*?)thumbnail: null'
        replacement = f'name: "{name}"\\1thumbnail: "vtuber/thumbnails/{filename}"'
        
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        if new_content != content:
            content = new_content
            updated += 1
            print(f"✓ Updated: {name} -> {filename}")
    
    # Write back
    with open('vtuberModels.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\nTotal updated: {updated} models")
    print("Backup saved as: vtuberModels.js.backup2")

if __name__ == "__main__":
    update_thumbnails()