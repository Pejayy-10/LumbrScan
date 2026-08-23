"""Evaluate one interim species-only checkpoint on its held-out specimen fold.

This command evaluates the reviewed, cropped paired images described by a
manifest.  It is intentionally limited to the three-class species prediction;
the checkpoint's defect and severity heads are not evaluated or reported.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Sequence

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

import torch
from torch.utils.data import DataLoader

from app.ml.dataset import ManifestPairedDataset, build_manifest_pairs, get_val_transforms
from app.ml.fusion_model import LumbrScanFusionModel


INTERIM_SPECIES = ("coconut", "gmelina", "mango")
DEFAULT_MANIFEST = BACKEND_ROOT / "data" / "metadata" / "image_metadata.csv"


def sha256(path: Path) -> str:
    """Return the digest used to tie a result to its exact input artifact."""
    return hashlib.sha256(path.read_bytes()).hexdigest()


def safe_divide(numerator: int, denominator: int) -> float:
    return numerator / denominator if denominator else 0.0


def classification_metrics(
    targets: Sequence[int], predictions: Sequence[int], class_names: Sequence[str]
) -> dict[str, Any]:
    """Calculate deterministic single-label classification metrics without sklearn."""
    if len(targets) != len(predictions):
        raise ValueError("targets and predictions must have the same length.")
    class_count = len(class_names)
    confusion_matrix = [[0 for _ in range(class_count)] for _ in range(class_count)]
    for target, prediction in zip(targets, predictions):
        if not 0 <= target < class_count or not 0 <= prediction < class_count:
            raise ValueError("Encountered a label outside the declared class list.")
        confusion_matrix[target][prediction] += 1

    per_class: dict[str, dict[str, float | int]] = {}
    precision_values: list[float] = []
    recall_values: list[float] = []
    f1_values: list[float] = []
    for index, class_name in enumerate(class_names):
        true_positive = confusion_matrix[index][index]
        false_positive = sum(confusion_matrix[row][index] for row in range(class_count)) - true_positive
        false_negative = sum(confusion_matrix[index]) - true_positive
        support = sum(confusion_matrix[index])
        precision = safe_divide(true_positive, true_positive + false_positive)
        recall = safe_divide(true_positive, true_positive + false_negative)
        f1 = safe_divide(2 * precision * recall, precision + recall)
        per_class[class_name] = {
            "precision": precision,
            "recall": recall,
            "f1": f1,
            "support": support,
        }
        precision_values.append(precision)
        recall_values.append(recall)
        f1_values.append(f1)

    correct = sum(confusion_matrix[index][index] for index in range(class_count))
    sample_count = len(targets)
    return {
        "sample_count": sample_count,
        "accuracy": safe_divide(correct, sample_count),
        "macro_avg": {
            "precision": safe_divide(sum(precision_values), class_count),
            "recall": safe_divide(sum(recall_values), class_count),
            "f1": safe_divide(sum(f1_values), class_count),
        },
        "per_class": per_class,
        "confusion_matrix": confusion_matrix,
        "confusion_matrix_rows": "true labels",
        "confusion_matrix_columns": "predicted labels",
    }


def load_checkpoint(checkpoint_path: Path, expected_fold: int, manifest_path: Path) -> tuple[dict[str, torch.Tensor], dict[str, Any]]:
    """Load and validate a local interim species-only checkpoint."""
    checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=True)
    if not isinstance(checkpoint, dict):
        raise ValueError("Checkpoint must be a dictionary produced by train_species_classifier.py.")
    state_dict = checkpoint.get("state_dict")
    metadata = checkpoint.get("metadata")
    if not isinstance(state_dict, dict) or not isinstance(metadata, dict):
        raise ValueError("Checkpoint is missing its state_dict or metadata.")
    if metadata.get("profile") != "interim_3species_species_only":
        raise ValueError("Checkpoint is not the supported interim three-species profile.")
    if tuple(metadata.get("species_classes", ())) != INTERIM_SPECIES:
        raise ValueError(f"Checkpoint classes must be {INTERIM_SPECIES} in that order.")
    if metadata.get("task") != "species_classification_only":
        raise ValueError("Checkpoint is not marked as species-classification-only.")
    if metadata.get("defect_head_trained") or metadata.get("severity_head_trained"):
        raise ValueError("This evaluator only accepts checkpoints with untrained defect/severity heads.")
    if metadata.get("held_out_fold") != expected_fold:
        raise ValueError("--fold must match the checkpoint's recorded held-out fold.")
    current_manifest_digest = sha256(manifest_path)
    if metadata.get("manifest_sha256") != current_manifest_digest:
        raise ValueError(
            "Manifest digest differs from the checkpoint metadata. Evaluate the original manifest or retrain first."
        )
    return state_dict, metadata


def evaluate(
    checkpoint_path: Path, manifest_path: Path, held_out_fold: int, batch_size: int, device: torch.device
) -> dict[str, Any]:
    state_dict, checkpoint_metadata = load_checkpoint(checkpoint_path, held_out_fold, manifest_path)
    samples = build_manifest_pairs(manifest_path, INTERIM_SPECIES, held_out_fold, split="validation")
    loader = DataLoader(
        ManifestPairedDataset(samples, transform=get_val_transforms()),
        batch_size=batch_size,
        shuffle=False,
        num_workers=0,
    )
    model = LumbrScanFusionModel(pretrained=False, num_species=len(INTERIM_SPECIES)).to(device)
    model.load_state_dict(state_dict)
    model.eval()
    targets: list[int] = []
    predictions: list[int] = []
    with torch.no_grad():
        for batch in loader:
            outputs = model(batch["cross_section"].to(device), batch["wood_grain"].to(device))
            targets.extend(batch["species_label"].tolist())
            predictions.extend(outputs["species"].argmax(dim=1).cpu().tolist())

    return {
        "evaluation_profile": "interim_3species_species_only",
        "task": "species_classification_only",
        "defect_detection_available": False,
        "severity_detection_available": False,
        "evaluated_at_utc": datetime.now(timezone.utc).isoformat(),
        "checkpoint": {
            "path": str(checkpoint_path),
            "sha256": sha256(checkpoint_path),
            "metadata": checkpoint_metadata,
        },
        "manifest": {
            "path": str(manifest_path),
            "sha256": sha256(manifest_path),
            "held_out_fold": held_out_fold,
        },
        "class_list": list(INTERIM_SPECIES),
        "metrics": classification_metrics(targets, predictions, INTERIM_SPECIES),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--checkpoint", type=Path, required=True, help="species-only .pt checkpoint to evaluate")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST, help="reviewed metadata CSV")
    parser.add_argument("--fold", type=int, required=True, help="checkpoint's held-out specimen fold")
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--output", type=Path, help="result JSON; defaults beside the checkpoint")
    args = parser.parse_args()
    if args.batch_size < 1:
        raise SystemExit("batch-size must be at least 1.")

    checkpoint_path = args.checkpoint.resolve()
    manifest_path = args.manifest.resolve()
    if not checkpoint_path.is_file():
        raise SystemExit(f"Checkpoint does not exist: {checkpoint_path}")
    if not manifest_path.is_file():
        raise SystemExit(f"Manifest does not exist: {manifest_path}")
    output_path = args.output.resolve() if args.output else checkpoint_path.with_suffix(".evaluation.json")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Evaluating {checkpoint_path.name} on fold {args.fold} with {device}.", flush=True)
    result = evaluate(checkpoint_path, manifest_path, args.fold, args.batch_size, device)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    metrics = result["metrics"]
    print(
        f"[OK] samples={metrics['sample_count']} accuracy={metrics['accuracy']:.4f} "
        f"macro_f1={metrics['macro_avg']['f1']:.4f} result={output_path}",
        flush=True,
    )


if __name__ == "__main__":
    main()
