import csv
from pathlib import Path

from app.ml.dataset import build_manifest_pairs
from app.ml.fusion_model import SpeciesHead


def write_manifest(path: Path) -> None:
    fieldnames = [
        "image_id", "species", "specimen_id", "modality", "processed_path", "quality_status", "fold_id"
    ]
    rows = []
    for species in ("coconut", "gmelina", "mango"):
        for specimen_id, fold_id in ((f"{species}_t01", "0"), (f"{species}_t02", "1")):
            for modality in ("cross_section", "wood_grain"):
                relative = Path("data") / "processed" / species / modality / specimen_id / f"{modality}.jpg"
                absolute = path.parents[2] / relative
                absolute.parent.mkdir(parents=True, exist_ok=True)
                absolute.touch()
                rows.append({
                    "image_id": f"{species}_{specimen_id}_{modality}",
                    "species": species,
                    "specimen_id": specimen_id,
                    "modality": modality,
                    "processed_path": relative.as_posix(),
                    "quality_status": "KEEP",
                    "fold_id": fold_id,
                })
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def test_manifest_pairs_keep_specimens_out_of_the_training_fold(tmp_path: Path) -> None:
    manifest = tmp_path / "backend" / "data" / "metadata" / "image_metadata.csv"
    write_manifest(manifest)

    train = build_manifest_pairs(manifest, ("coconut", "gmelina", "mango"), held_out_fold=0, split="train")
    validation = build_manifest_pairs(manifest, ("coconut", "gmelina", "mango"), held_out_fold=0, split="validation")

    assert {sample["specimen_id"] for sample in train} == {"coconut_t02", "gmelina_t02", "mango_t02"}
    assert {sample["specimen_id"] for sample in validation} == {"coconut_t01", "gmelina_t01", "mango_t01"}


def test_species_head_uses_the_requested_number_of_classes() -> None:
    head = SpeciesHead(num_species=3)
    assert head.classifier[-1].out_features == 3
