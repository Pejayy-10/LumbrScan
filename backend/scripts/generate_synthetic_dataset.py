"""
Synthetic Dataset Generator for LumbrScan
==========================================
PURPOSE: Generate placeholder timber training images for ALL 11 species
before official DENR images arrive.

HOW IT WORKS:
Each "synthetic image" is a procedurally-generated texture that mimics the
visual appearance of timber macro-photography:
 - Cross-Section: Concentric ring patterns + pore noise (like a real end-grain photo)
 - Wood Grain:    Parallel vertical line patterns + grain noise (like real sawn surface)

WHY IS THIS USEFUL?
1. Lets us fully verify our PyTorch training pipeline (data loading, loss calculation,
   backpropagation, accuracy tracking) without needing real images.
2. Once DENR provides real photos, just run: python scripts/train.py again.
   Everything works identically — no code changes needed.

DATASET STRUCTURE CREATED:
data/
└── raw/
    ├── cross_section/
    │   ├── narra/        ← 80 synthetic images
    │   ├── ipil/         ← 80 synthetic images
    │   ├── molave/       ← 80 synthetic images
    │   └── ... (all 11 species)
    └── wood_grain/
        ├── narra/        ← 80 synthetic images
        ├── ipil/         ← 80 synthetic images
        └── ... (all 11 species)

REAL DATASET REQUIREMENTS (When DENR Images Arrive):
------------------------------------------------------
Replace the synthetic images with real photos following this structure:
  - Per species, per modality: minimum 50 images (100+ recommended)
  - Image requirements:
      * Resolution: at least 300×300 pixels (bigger is fine, we resize to 224×224)
      * Format: JPEG or PNG
      * Lighting: Uniform, diffuse lighting (no harsh shadows)
      * Background: Neutral (white/gray board preferred)
      * Cross-Section view: photo of the END of the cut timber piece
      * Wood Grain view: photo of the FLAT SURFACE (tangential or radial face)
"""

import os
import random
import numpy as np
from PIL import Image, ImageFilter
import sys

# Add the parent backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app.ml.constants import SPECIES_CLASSES

# --- Configuration ---
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
IMAGES_PER_CLASS = 80    # Synthetic images per species per modality
IMAGE_SIZE = (224, 224)  # EfficientNet-B0 input size

# Approximate RGB color ranges for each timber species
# These are rough approximations based on published timber color references
SPECIES_COLORS = {
    "narra":       {"cross": (145, 85,  50),  "grain": (160, 100, 60)},
    "ipil":        {"cross": (110, 70,  40),  "grain": (120, 80,  45)},
    "molave":      {"cross": (180, 130, 80),  "grain": (190, 140, 90)},
    "apitong":     {"cross": (130, 90,  55),  "grain": (140, 100, 60)},
    "white_lauan": {"cross": (190, 150, 110), "grain": (200, 160, 120)},
    "yakal":       {"cross": (100, 65,  35),  "grain": (110, 75,  40)},
    "gmelina":     {"cross": (215, 185, 145), "grain": (220, 190, 150)},
    "coconut":     {"cross": (170, 120, 75),  "grain": (175, 130, 80)},
    "acacia":      {"cross": (155, 105, 60),  "grain": (160, 115, 65)},
    "mango":       {"cross": (200, 165, 120), "grain": (205, 170, 125)},
    "nangka":      {"cross": (185, 140, 80),  "grain": (190, 150, 85)},
}


def generate_cross_section_image(species: str, seed: int) -> Image.Image:
    """
    Generate a synthetic end-grain / cross-section image.

    Simulates: concentric growth rings + diffuse pore dots + natural noise.
    Each species has a distinct base color derived from real timber color references.
    """
    rng = random.Random(seed)
    np.random.seed(seed)

    base_color = SPECIES_COLORS[species]["cross"]
    w, h = IMAGE_SIZE

    # Create base canvas with species color + noise
    noise = np.random.randint(-25, 25, (h, w, 3), dtype=np.int16)
    canvas = np.clip(
        np.array(base_color, dtype=np.int16) + noise, 0, 255
    ).astype(np.uint8)

    img = Image.fromarray(canvas, "RGB")

    # Draw concentric growth rings (simulated with PIL)
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2 + rng.randint(-20, 20), h // 2 + rng.randint(-20, 20)
    num_rings = rng.randint(4, 12)
    for i in range(num_rings, 0, -1):
        r = int((i / num_rings) * min(w, h) * 0.48)
        ring_color = tuple(
            max(0, min(255, c + rng.randint(-20, 20))) for c in base_color
        )
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=ring_color, width=rng.randint(1, 3))

    # Add pore-like noise dots
    for _ in range(rng.randint(30, 100)):
        px = rng.randint(0, w - 1)
        py = rng.randint(0, h - 1)
        pr = rng.randint(1, 4)
        draw.ellipse([px - pr, py - pr, px + pr, py + pr],
                     fill=(max(0, base_color[0] - 40), max(0, base_color[1] - 40), max(0, base_color[2] - 40)))

    img = img.filter(ImageFilter.GaussianBlur(radius=0.8))
    return img


def generate_wood_grain_image(species: str, seed: int) -> Image.Image:
    """
    Generate a synthetic wood grain / surface texture image.

    Simulates: parallel longitudinal grain lines + ray flecks + surface variation.
    """
    rng = random.Random(seed + 10000)
    np.random.seed(seed + 10000)

    base_color = SPECIES_COLORS[species]["grain"]
    w, h = IMAGE_SIZE

    # Base canvas
    noise = np.random.randint(-20, 20, (h, w, 3), dtype=np.int16)
    canvas = np.clip(
        np.array(base_color, dtype=np.int16) + noise, 0, 255
    ).astype(np.uint8)

    img = Image.fromarray(canvas, "RGB")

    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)

    # Draw parallel grain lines (vertical direction)
    num_lines = rng.randint(12, 28)
    for i in range(num_lines):
        x = rng.randint(0, w - 1)
        line_color = tuple(
            max(0, min(255, c + rng.randint(-35, 15))) for c in base_color
        )
        thickness = rng.randint(1, 4)
        # Slightly wavy grain lines
        points = []
        for y in range(0, h, 5):
            wave_x = x + rng.randint(-3, 3)
            points.append((wave_x, y))
        if len(points) > 1:
            draw.line(points, fill=line_color, width=thickness)

    # Add ray flecks (horizontal bright spots characteristic of quarter-sawn timber)
    for _ in range(rng.randint(5, 20)):
        rx = rng.randint(0, w - 20)
        ry = rng.randint(0, h - 5)
        rw = rng.randint(10, 40)
        draw.rectangle([rx, ry, rx + rw, ry + rng.randint(2, 5)],
                       fill=tuple(min(255, c + 30) for c in base_color))

    img = img.filter(ImageFilter.GaussianBlur(radius=0.6))
    return img


def generate_dataset():
    """Main function: generate the full synthetic dataset for all 11 species."""
    print("=" * 60)
    print("LumbrScan Synthetic Dataset Generator")
    print("=" * 60)
    print(f"Species: {len(SPECIES_CLASSES)} classes")
    print(f"Images per class per modality: {IMAGES_PER_CLASS}")
    print(f"Total images to generate: {len(SPECIES_CLASSES) * 2 * IMAGES_PER_CLASS}")
    print(f"Output directory: {os.path.abspath(OUTPUT_DIR)}")
    print()

    total_generated = 0

    for modality in ["cross_section", "wood_grain"]:
        for species in SPECIES_CLASSES:
            species_dir = os.path.join(OUTPUT_DIR, modality, species)
            os.makedirs(species_dir, exist_ok=True)

            for i in range(IMAGES_PER_CLASS):
                seed = hash(f"{species}_{modality}_{i}") % (2**31)

                if modality == "cross_section":
                    img = generate_cross_section_image(species, seed)
                else:
                    img = generate_wood_grain_image(species, seed)

                filename = f"{species}_{modality}_{i:03d}.png"
                filepath = os.path.join(species_dir, filename)
                img.save(filepath)
                total_generated += 1

            print(f"  [OK] {modality}/{species}: {IMAGES_PER_CLASS} images generated")

    print()
    print(f"Dataset generation complete! {total_generated} images created.")
    print(f"Location: {os.path.abspath(OUTPUT_DIR)}")
    print()
    print("Next step: run the training script:")
    print("  python scripts/train.py")


if __name__ == "__main__":
    generate_dataset()
