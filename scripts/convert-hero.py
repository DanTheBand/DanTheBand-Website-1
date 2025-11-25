#!/usr/bin/env python3
from PIL import Image
import os

# Input and output paths
input_path = "/Users/danpolicar/DTBWEB/images/dan-hero-banner.png"
output_dir = "/Users/danpolicar/DTBWEB/images/optimized"

# Target widths for hero banner (same aspect ratio as original: 1584x396 = 4:1)
widths = [480, 800, 1200, 1584]

if not os.path.exists(input_path):
    print(f"Error: Input file not found at {input_path}")
    exit(1)

# Open the image
img = Image.open(input_path)
print(f"Original image size: {img.size}")

# Calculate height based on aspect ratio (1584:396 = 4:1)
aspect_ratio = 1584 / 396

for width in widths:
    height = int(width / aspect_ratio)
    
    # Resize image
    resized = img.resize((width, height), Image.Resampling.LANCZOS)
    
    # Save as WebP
    output_path = os.path.join(output_dir, f"hero-{width}.webp")
    resized.save(output_path, "WebP", quality=85)
    print(f"✓ Created {output_path} ({width}x{height})")

print("\nHero banner conversion complete!")
