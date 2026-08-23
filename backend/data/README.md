# LumbrScan research-image workflow

## Directory roles

- `raw/` — original camera captures. This directory is immutable.
- `metadata/` — CSV manifests, review decisions, and group-fold assignments.
- `processed/` — cropped working copies generated from approved review rows. It can be regenerated from `raw/` plus `metadata/`.
- `checkpoints/` — local model checkpoints and their JSON metadata. Do not commit them.

## Three-species prototype

The current source captures are in `raw/COCONUT`, `raw/GMELINA`, and `raw/MANGO`. The manifest builder recognizes the existing `CROSS SECTION`, `WOOD GRAIN`, and `WOOOD GRAIN` folder names without modifying them.

1. Run `python scripts/build_dataset_manifest.py`.
2. Review every row with `python scripts/review_and_crop.py`. Draw a crop around the timber subject, then save it as `KEEP`; use `REJECT` only for unusable images.
3. Run `python scripts/create_grouped_folds.py` after review. All photos from one `TIMBER n` directory remain in the same fold.
4. Train one held-out specimen fold at a time with `train_species_classifier.py`.

The raw photos remain untouched. Do not use the existing synthetic images for reported three-species accuracy.
