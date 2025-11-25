#!/usr/bin/env bash
# Generate WebP resized images used by index.html
# Requires: cwebp (part of libwebp). Install on macOS: `brew install webp`

set -euo pipefail

OUT_DIR="images/optimized"
mkdir -p "$OUT_DIR"

echo "Generating WebP images into $OUT_DIR (quality=80)"

# Hero banner (multiple widths)
cwebp -q 80 -resize 480 0 images/hero-banner.jpg -o "$OUT_DIR/hero-480.webp"
cwebp -q 80 -resize 800 0 images/hero-banner.jpg -o "$OUT_DIR/hero-800.webp"
cwebp -q 80 -resize 1200 0 images/hero-banner.jpg -o "$OUT_DIR/hero-1200.webp"
cwebp -q 80 images/hero-banner.jpg -o "$OUT_DIR/hero-1584.webp"

# Headshot / profile
cwebp -q 80 -resize 320 0 images/dan-headshot.jpg -o "$OUT_DIR/headshot-320.webp"
cwebp -q 80 -resize 640 0 images/dan-headshot.jpg -o "$OUT_DIR/headshot-640.webp"
cwebp -q 80 -resize 1024 0 images/dan-headshot.jpg -o "$OUT_DIR/headshot-1024.webp"
cwebp -q 80 images/dan-headshot.jpg -o "$OUT_DIR/headshot-2048.webp"

# Homestead release artwork
cwebp -q 80 -resize 480 0 images/Homestead.jpg -o "$OUT_DIR/homestead-480.webp"
cwebp -q 80 -resize 800 0 images/Homestead.jpg -o "$OUT_DIR/homestead-800.webp"
cwebp -q 80 -resize 1200 0 images/Homestead.jpg -o "$OUT_DIR/homestead-1200.webp"
cwebp -q 80 images/Homestead.jpg -o "$OUT_DIR/homestead-2048.webp"

# Thumbnails (Empire, TCD, MysteryHouse)
cwebp -q 80 -resize 320 0 images/EmpireofSin.jpg -o "$OUT_DIR/empire-320.webp"
cwebp -q 80 images/EmpireofSin.jpg -o "$OUT_DIR/empire-460.webp"

cwebp -q 80 -resize 320 0 images/TCD.jpg -o "$OUT_DIR/tcd-320.webp"
cwebp -q 80 images/TCD.jpg -o "$OUT_DIR/tcd-460.webp"

cwebp -q 80 -resize 320 0 images/MysteryHouse.jpg -o "$OUT_DIR/mystery-320.webp"
cwebp -q 80 images/MysteryHouse.jpg -o "$OUT_DIR/mystery-460.webp"

# Ifeyo (small original) - keep original size and a 320px upscaled version
cwebp -q 80 images/Ifeyo.jpeg -o "$OUT_DIR/ifeyo-197.webp"
cwebp -q 80 -resize 320 0 images/Ifeyo.jpeg -o "$OUT_DIR/ifeyo-320.webp"

echo "Done. Add the generated files to git (images/optimized) if you want them committed."