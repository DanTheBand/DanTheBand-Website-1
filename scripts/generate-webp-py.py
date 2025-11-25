#!/usr/bin/env python3
"""
Generate WebP resized images using Pillow.
Run: python3 scripts/generate-webp-py.py
Requires: Pillow (pip install --user pillow)
Outputs to images/optimized/
"""
from PIL import Image
from pathlib import Path

OUT = Path('images/optimized')
OUT.mkdir(parents=True, exist_ok=True)

def save_webp(src, out_name, width=None, quality=80):
    im = Image.open(src)
    if width:
        w, h = im.size
        new_h = int(h * (width / w))
        im = im.resize((width, new_h), Image.LANCZOS)
    out_path = OUT / out_name
    im.save(out_path, 'WEBP', quality=quality, method=6)
    print('Saved', out_path)

def main():
    save_webp('images/hero-banner.jpg', 'hero-480.webp', width=480)
    save_webp('images/hero-banner.jpg', 'hero-800.webp', width=800)
    save_webp('images/hero-banner.jpg', 'hero-1200.webp', width=1200)
    save_webp('images/hero-banner.jpg', 'hero-1584.webp')

    save_webp('images/dan-headshot.jpg', 'headshot-320.webp', width=320)
    save_webp('images/dan-headshot.jpg', 'headshot-640.webp', width=640)
    save_webp('images/dan-headshot.jpg', 'headshot-1024.webp', width=1024)
    save_webp('images/dan-headshot.jpg', 'headshot-2048.webp')

    save_webp('images/Homestead.jpg', 'homestead-480.webp', width=480)
    save_webp('images/Homestead.jpg', 'homestead-800.webp', width=800)
    save_webp('images/Homestead.jpg', 'homestead-1200.webp', width=1200)
    save_webp('images/Homestead.jpg', 'homestead-2048.webp')

    save_webp('images/EmpireofSin.jpg', 'empire-320.webp', width=320)
    save_webp('images/EmpireofSin.jpg', 'empire-460.webp')

    save_webp('images/TCD.jpg', 'tcd-320.webp', width=320)
    save_webp('images/TCD.jpg', 'tcd-460.webp')

    save_webp('images/MysteryHouse.jpg', 'mystery-320.webp', width=320)
    save_webp('images/MysteryHouse.jpg', 'mystery-460.webp')

    save_webp('images/Ifeyo.jpeg', 'ifeyo-197.webp')
    save_webp('images/Ifeyo.jpeg', 'ifeyo-320.webp', width=320)

if __name__ == '__main__':
    main()
