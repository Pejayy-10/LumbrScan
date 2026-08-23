"""
LumbrScan PyTorch Dataset Loader
==================================
BEGINNER EXPLANATION:

WHAT IS A DATASET CLASS?
-------------------------
In PyTorch, a Dataset class is a helper that knows:
  1. WHERE to find all your training images on disk
  2. HOW to load and preprocess each image (resize, normalize)
  3. WHAT LABEL to attach to each image (species class, defects, severity)

PyTorch's DataLoader then wraps around it and automatically:
  - Groups images into "batches" (e.g. 16 or 32 images at a time)
  - Shuffles the images randomly each epoch
  - Loads images in parallel to keep the GPU/CPU busy

WHAT IS DATA AUGMENTATION?
---------------------------
When we have limited training images, we artificially increase variety by
randomly transforming each image during training:
  - Random horizontal flip: mirrors the image left-right
  - Random rotation ±15°: slight tilt variation
  - Color jitter: varies brightness/contrast slightly
  - Random crop: zooms in randomly

These augmentations teach the model to recognize timber patterns regardless
of orientation, lighting, or camera angle — making it more robust in real use.

WHAT IS NORMALIZATION?
-----------------------
Before feeding images into EfficientNet, we normalize pixel values from
the [0, 255] range into a standardized range using ImageNet mean/std.
This is required because EfficientNet was originally trained on ImageNet with
this exact normalization. Using the same normalization ensures transfer learning works.
"""

import csv
import os
from pathlib import Path
from typing import Optional, Sequence

import torch
from torch.utils.data import Dataset
from torchvision import transforms
from PIL import Image

from app.ml.constants import SPECIES_CLASSES, IMAGE_SIZE, IMAGENET_MEAN, IMAGENET_STD


# ============================================================
# IMAGE TRANSFORMS
# ============================================================

def get_train_transforms() -> transforms.Compose:
    """
    Training transforms: include augmentation to increase dataset diversity.
    Applied randomly and differently to each image every epoch.
    """
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE + 32, IMAGE_SIZE + 32)),  # Slightly larger first
        transforms.RandomCrop(IMAGE_SIZE),                       # Then random crop to 224
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.15),
        transforms.ToTensor(),                                   # [0,255] → [0.0, 1.0]
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def get_val_transforms() -> transforms.Compose:
    """
    Validation/inference transforms: NO augmentation — just clean preprocessing.
    Used for validation, testing, and real-time inference.
    """
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


# ============================================================
# PAIRED DATASET CLASS
# ============================================================

class TimberPairedDataset(Dataset):
    """
    Paired 2-Modality Dataset for LumbrScan.

    Loads pairs of (cross_section, wood_grain) images for each sample.
    Both images in a pair must belong to the same species.

    Expected directory structure (in data/raw/):
        cross_section/
            narra/    ← images of Narra cross-sections
            ipil/
            ...
        wood_grain/
            narra/    ← images of Narra wood grain surfaces
            ipil/
            ...

    The dataset pairs images from the same species folder using their INDEX
    position. Image narra/narra_001.png is paired with wood_grain/narra/narra_001.png.

    Args:
        root_dir (str): Path to the `data/raw/` folder.
        transform: torchvision transform pipeline (training or validation).
        split (str): 'train' or 'val' (80/20 split applied automatically).
    """

    def __init__(
        self,
        root_dir: str,
        transform: Optional[transforms.Compose] = None,
        split: str = "train",
    ):
        super().__init__()
        self.transform = transform or get_val_transforms()
        self.species_to_idx = {name: idx for idx, name in enumerate(SPECIES_CLASSES)}
        self.samples: list[dict] = []

        root = Path(root_dir)
        cross_root = root / "cross_section"
        grain_root = root / "wood_grain"

        for species in SPECIES_CLASSES:
            cross_dir = cross_root / species
            grain_dir = grain_root / species

            if not cross_dir.exists() or not grain_dir.exists():
                print(f"  [WARNING] Missing directory for species '{species}', skipping.")
                continue

            # Sort so files pair correctly by name/index
            cross_images = sorted(list(cross_dir.glob("*.png")) + list(cross_dir.glob("*.jpg")))
            grain_images = sorted(list(grain_dir.glob("*.png")) + list(grain_dir.glob("*.jpg")))

            # Use the minimum count so pairs are always valid
            n = min(len(cross_images), len(grain_images))
            if n == 0:
                continue

            # 80/20 train/val split
            split_idx = int(n * 0.8)
            if split == "train":
                cross_images = cross_images[:split_idx]
                grain_images = grain_images[:split_idx]
            else:
                cross_images = cross_images[split_idx:]
                grain_images = grain_images[split_idx:]

            label = self.species_to_idx[species]
            for cs, gr in zip(cross_images, grain_images):
                self.samples.append({
                    "cross_section": str(cs),
                    "wood_grain":    str(gr),
                    "species_label": label,
                })

        print(f"[TimberPairedDataset] {split.upper()} split: {len(self.samples)} paired samples loaded.")

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> dict:
        sample = self.samples[idx]

        # Load images from disk
        cross_img = Image.open(sample["cross_section"]).convert("RGB")
        grain_img = Image.open(sample["wood_grain"]).convert("RGB")

        # Apply preprocessing/augmentation transforms
        cross_tensor = self.transform(cross_img)
        grain_tensor = self.transform(grain_img)

        return {
            "cross_section": cross_tensor,          # [3, 224, 224] float tensor
            "wood_grain":    grain_tensor,           # [3, 224, 224] float tensor
            "species_label": torch.tensor(sample["species_label"], dtype=torch.long),
        }


def build_manifest_pairs(
    manifest_path: str | Path,
    species_classes: Sequence[str],
    held_out_fold: int | None = None,
    split: str = "train",
) -> list[dict[str, str | int]]:
    """Build paired samples from reviewed metadata without specimen leakage.

    The manifest contains one row per camera photo. Photos are paired only within
    the same species and physical timber specimen. A held-out fold therefore
    excludes every photo of that specimen from the training samples.
    """
    manifest = Path(manifest_path).resolve()
    backend_root = manifest.parents[2]
    species_to_idx = {species: index for index, species in enumerate(species_classes)}
    grouped: dict[tuple[str, str], dict[str, list[dict[str, str]]]] = {}

    with manifest.open("r", encoding="utf-8", newline="") as file:
        for row in csv.DictReader(file):
            if row.get("quality_status") != "KEEP":
                continue
            species = row.get("species", "")
            if species not in species_to_idx:
                continue
            fold_value = row.get("fold_id", "")
            if held_out_fold is not None:
                if not fold_value:
                    raise ValueError("Manifest has no fold assignments. Run create_grouped_folds.py first.")
                is_held_out = int(fold_value) == held_out_fold
                if split == "train" and is_held_out:
                    continue
                if split == "validation" and not is_held_out:
                    continue
            processed_path = backend_root / row["processed_path"]
            if not processed_path.is_file():
                raise FileNotFoundError(
                    f"Missing processed image {processed_path}. Review and crop the manifest row first."
                )
            key = (species, row["specimen_id"])
            grouped.setdefault(key, {"cross_section": [], "wood_grain": []})
            modality = row.get("modality", "")
            if modality in grouped[key]:
                grouped[key][modality].append(row)

    samples: list[dict[str, str | int]] = []
    for (species, specimen_id), modalities in sorted(grouped.items()):
        cross_sections = sorted(modalities["cross_section"], key=lambda item: item["image_id"])
        wood_grains = sorted(modalities["wood_grain"], key=lambda item: item["image_id"])
        pair_count = min(len(cross_sections), len(wood_grains))
        if pair_count == 0:
            continue
        for index in range(pair_count):
            samples.append({
                "cross_section": str(backend_root / cross_sections[index]["processed_path"]),
                "wood_grain": str(backend_root / wood_grains[index]["processed_path"]),
                "species_label": species_to_idx[species],
                "species": species,
                "specimen_id": specimen_id,
            })

    if not samples:
        raise ValueError(f"No {split} pairs were built from {manifest}.")
    return samples


class ManifestPairedDataset(Dataset):
    """A reviewed, pre-split paired dataset built from ``image_metadata.csv``."""

    def __init__(self, samples: Sequence[dict[str, str | int]], transform: Optional[transforms.Compose] = None):
        self.samples = list(samples)
        self.transform = transform or get_val_transforms()

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> dict:
        sample = self.samples[idx]
        cross_img = Image.open(str(sample["cross_section"])).convert("RGB")
        grain_img = Image.open(str(sample["wood_grain"])).convert("RGB")
        return {
            "cross_section": self.transform(cross_img),
            "wood_grain": self.transform(grain_img),
            "species_label": torch.tensor(int(sample["species_label"]), dtype=torch.long),
            "specimen_id": str(sample["specimen_id"]),
        }
