"""Build a reviewable, non-destructive manifest for the captured timber photos.

Run from ``backend/``. The script only reads ``data/raw`` and creates
``data/metadata/image_metadata.csv``. Existing manifests are never overwritten
unless ``--overwrite`` is supplied, protecting manual crop/review decisions.
"""

from __future__ import annotations

import argparse
import csv
import re
from collections import Counter
from pathlib import Path

from PIL import Image, ImageOps, UnidentifiedImageError


BACKEND_ROOT = Path(__file__).resolve().parents[1]
RAW_ROOT = BACKEND_ROOT / "data" / "raw"
DEFAULT_MANIFEST = BACKEND_ROOT / "data" / "metadata" / "image_metadata.csv"
SUPPORTED_SPECIES = ("coconut", "gmelina", "mango")
IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png"}

FIELDNAMES = [
    "image_id",
    "species",
    "specimen_id",
    "modality",
    "raw_path",
    "processed_path",
    "source_filename",
    "format",
    "width_px",
    "height_px",
    "quality_status",
    "quality_notes",
    "crop_left",
    "crop_top",
    "crop_right",
    "crop_bottom",
    "fold_id",
    "defect_label",
]


def normalise_name(value: str) -> str:
    """Normalise folder labels while retaining the source folders unchanged."""
    return re.sub(r"[^a-z0-9]", "", value.lower())


def get_modality(folder_name: str) -> str | None:
    normalised = normalise_name(folder_name)
    if normalised in {"crosssection", "crosssections", "endgrain"}:
        return "cross_section"
    if normalised in {"woodgrain", "wooodgrain", "surfacegrain"}:
        return "wood_grain"
    return None


def specimen_slug(species: str, folder_name: str) -> str:
    match = re.search(r"(\d+)", folder_name)
    suffix = f"t{int(match.group(1)):02d}" if match else normalise_name(folder_name)
    return f"{species}_{suffix}"


def inspect_image(path: Path) -> tuple[str, int, int]:
    """Return format and display-oriented dimensions without changing the source."""
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image)
        return image.format or path.suffix.removeprefix(".").upper(), image.width, image.height


def discover_records(raw_root: Path) -> list[dict[str, str | int]]:
    records: list[dict[str, str | int]] = []
    for species in SUPPORTED_SPECIES:
        species_dir = raw_root / species.upper()
        if not species_dir.is_dir():
            print(f"[WARN] Missing raw source directory: {species_dir}", flush=True)
            continue

        for modality_dir in sorted(path for path in species_dir.iterdir() if path.is_dir()):
            modality = get_modality(modality_dir.name)
            if modality is None:
                print(f"[WARN] Ignoring unknown modality directory: {modality_dir}", flush=True)
                continue

            for timber_dir in sorted(path for path in modality_dir.iterdir() if path.is_dir()):
                specimen_id = specimen_slug(species, timber_dir.name)
                image_paths = sorted(
                    path for path in timber_dir.iterdir()
                    if path.is_file() and path.suffix.lower() in IMAGE_SUFFIXES
                )
                for sequence, image_path in enumerate(image_paths, start=1):
                    try:
                        image_format, width, height = inspect_image(image_path)
                    except (OSError, UnidentifiedImageError) as error:
                        print(f"[WARN] Cannot read {image_path}: {error}", flush=True)
                        continue

                    relative_raw_path = image_path.relative_to(BACKEND_ROOT).as_posix()
                    output_name = f"{image_path.stem}.jpg"
                    processed_path = (
                        Path("data") / "processed" / species / modality / specimen_id / output_name
                    ).as_posix()
                    records.append({
                        "image_id": f"{species}_{specimen_id.rsplit('_', 1)[-1]}_{modality}_{sequence:03d}",
                        "species": species,
                        "specimen_id": specimen_id,
                        "modality": modality,
                        "raw_path": relative_raw_path,
                        "processed_path": processed_path,
                        "source_filename": image_path.name,
                        "format": image_format,
                        "width_px": width,
                        "height_px": height,
                        "quality_status": "REVIEW",
                        "quality_notes": "",
                        "crop_left": "",
                        "crop_top": "",
                        "crop_right": "",
                        "crop_bottom": "",
                        "fold_id": "",
                        "defect_label": "UNLABELED",
                    })
    return records


def write_manifest(records: list[dict[str, str | int]], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(records)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw-root", type=Path, default=RAW_ROOT)
    parser.add_argument("--output", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--overwrite", action="store_true", help="replace an existing manifest")
    args = parser.parse_args()

    output_path = args.output.resolve()
    if output_path.exists() and not args.overwrite:
        raise SystemExit(
            f"Refusing to overwrite {output_path}. It may contain manual review data; "
            "use --overwrite only before review starts."
        )

    records = discover_records(args.raw_root.resolve())
    if not records:
        raise SystemExit("No supported raw image records were found.")

    write_manifest(records, output_path)
    counts = Counter((record["species"], record["modality"]) for record in records)
    print(f"[OK] Wrote {len(records)} review rows to {output_path}", flush=True)
    for (species, modality), count in sorted(counts.items()):
        print(f"  {species}/{modality}: {count}", flush=True)


if __name__ == "__main__":
    main()
