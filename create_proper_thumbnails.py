#!/usr/bin/env python3
"""
Create proper placeholder thumbnails for each character
"""

import os
from PIL import Image, ImageDraw, ImageFont
import hashlib

def create_character_thumbnail(name, output_path):
    """Create a nice placeholder thumbnail for a character"""
    # Create 400x400 image
    width, height = 400, 400
    
    # Generate color from name
    name_hash = hashlib.md5(name.encode()).hexdigest()
    r = int(name_hash[:2], 16)
    g = int(name_hash[2:4], 16) 
    b = int(name_hash[4:6], 16)
    
    # Create gradient background
    img = Image.new('RGB', (width, height), color=(r, g, b))
    draw = ImageDraw.Draw(img)
    
    # Add gradient effect
    for i in range(height):
        alpha = i / height
        color = (
            int(r * (1 - alpha * 0.3)),
            int(g * (1 - alpha * 0.3)),
            int(b * (1 - alpha * 0.3))
        )
        draw.line([(0, i), (width, i)], fill=color)
    
    # Add character initial in center
    initial = name[0].upper()
    
    # Try to use a font, fallback to default if not available
    try:
        font = ImageFont.truetype("arial.ttf", 120)
    except:
        font = ImageFont.load_default()
    
    # Draw white circle background for initial
    circle_radius = 100
    center_x, center_y = width // 2, height // 2
    draw.ellipse(
        [center_x - circle_radius, center_y - circle_radius,
         center_x + circle_radius, center_y + circle_radius],
        fill='white'
    )
    
    # Draw initial
    text_bbox = draw.textbbox((0, 0), initial, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = center_x - text_width // 2
    text_y = center_y - text_height // 2 - text_bbox[1]
    draw.text((text_x, text_y), initial, fill=(r, g, b), font=font)
    
    # Add character name at bottom
    name_font = ImageFont.load_default()
    name_bbox = draw.textbbox((0, 0), name, font=name_font)
    name_width = name_bbox[2] - name_bbox[0]
    name_x = center_x - name_width // 2
    draw.text((name_x, height - 40), name, fill='white', font=name_font)
    
    # Save image
    img.save(output_path, 'PNG')

# Character list
characters = [
    "APHO2 Bronya", "Acacia Kaguya", "Ai Hoshino", "Alyss", "Anya Forger",
    "Avatar 3D Aria", "Azur Lane Enterprise", "Beatrice", "Bronya HoTr",
    "Carlotta", "Caroline", "Cesilia", "Changli", "Chen Qianyu", "Cipher",
    "Clorinde", "DUST", "DreamSeeker", "Dushevnaya", "Eula Lawrence",
    "Fern VT model", "Freestyletest", "Goldy", "Guinaifen", 
    "Haruhi Suzumiya", "Herrscher of Finality", "iCO Gore", "Jingliu",
    "Kiana Kaslana", "Kirito", "Kokuyou", "Lilac", "Luna",
    "Lunar New Year's Eve", "Magical girl sirin", "Maya2", "Meryl",
    "Ming Chao", "Mizuhara Chizuru", "MMORPG Mage", "Mura Mura", "Navia",
    "Neku Shiro", "Nemesis C3", "Neuro-Sama 2.0", "Nezuko Kamado",
    "Nico Robin", "Niya", "Oni", "Prinz Eugen", "QiongJiu", "Raiden Mei",
    "Raiden mie", "Ram", "Rem", "Renni", "Rose", "RX-0 Unicorn",
    "Serina Washimi", "Shirli", "Sirin", "Six", "Skirk", "Smol Herta",
    "Soft Kitty", "Test Model", "Toon Anata", "Topaz", "Vocaloid MIKU",
    "WINE", "Yae Miko", "Zeke", "Fu Hua Swimsuit", 
    "Fu Hua Herrscher", "Kiana HoV"
]

def main():
    # Create thumbnails directory
    thumbnails_dir = "vtuber/thumbnails"
    os.makedirs(thumbnails_dir, exist_ok=True)
    
    print("Creating proper placeholder thumbnails...")
    
    for char in characters:
        filename = char.lower().replace(" ", "_").replace("-", "_") + ".png"
        filepath = os.path.join(thumbnails_dir, filename)
        
        try:
            create_character_thumbnail(char, filepath)
            print(f"✓ Created: {filename}")
        except Exception as e:
            print(f"✗ Failed {char}: {e}")
    
    print("\nDone! Placeholder thumbnails created.")
    print("These can be replaced with actual VRoid Hub images later.")

if __name__ == "__main__":
    # Check if PIL is installed
    try:
        from PIL import Image, ImageDraw, ImageFont
        main()
    except ImportError:
        print("Installing Pillow...")
        os.system("pip install Pillow")
        print("\nPlease run this script again after installation.")