#!/usr/bin/env python3
"""
Fix thumbnails - set back to null for now
"""

import re

def fix_thumbnails():
    # Read the current vtuberModels.js file
    with open('vtuberModels.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace all dummy thumbnail URLs back to null
    # Keep only Galih series thumbnails as null
    pattern = r'thumbnail: "https://vroid-hub\.pximg\.net/[^"]+\.(?:png|jpg)"'
    content = re.sub(pattern, 'thumbnail: null', content)
    
    # Write back
    with open('vtuberModels.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Reset all thumbnails back to null")
    print("The system will now use 3D preview instead of broken thumbnail URLs")

if __name__ == "__main__":
    fix_thumbnails()