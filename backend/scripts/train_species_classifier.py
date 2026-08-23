"""Train the interim three-species fusion classifier from reviewed image metadata.

This intentionally optimises species classification only. It does not train or
report defect/severity predictions because no validated labels exist for them.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import random
import sys
from datetime import datetime, timezone
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

import numpy as np
import torch
import torch.nn as nn
from torch.optim import AdamW
from torch.utils.data import DataLoader

from app.ml.dataset import ManifestPairedDataset, build_manifest_pairs, get_train_transforms, get_val_transforms
from app.ml.fusion_model import LumbrScanFusionModel


DEFAULT_MANIFEST = BACKEND_ROOT / "data" / "metadata" / "image_metadata.csv"
CHECKPOINT_DIR = BACKEND_ROOT / "data" / "checkpoints"
INTERIM_SPECIES = ("coconut", "gmelina", "mango")


def set_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def manifest_digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def evaluate(model: LumbrScanFusionModel, loader: DataLoader, device: torch.device) -> tuple[float, float]:
    model.eval()
    loss_fn = nn.CrossEntropyLoss()
    total_loss = 0.0
    total_correct = 0
    total_samples = 0
    with torch.no_grad():
        for batch in loader:
            outputs = model(batch["cross_section"].to(device), batch["wood_grain"].to(device))
            labels = batch["species_label"].to(device)
            total_loss += loss_fn(outputs["species"], labels).item() * labels.size(0)
            total_correct += (outputs["species"].argmax(dim=1) == labels).sum().item()
            total_samples += labels.size(0)
    return total_loss / total_samples, total_correct / total_samples


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--fold", type=int, required=True, help="held-out specimen fold used for validation")
    parser.add_argument("--epochs", type=int, default=30)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--learning-rate", type=float, default=1e-4)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--output", type=Path, help="checkpoint path; defaults to a fold-specific filename")
    args = parser.parse_args()

    if args.epochs < 1 or args.batch_size < 2:
        raise SystemExit("epochs must be positive and batch-size must be at least 2.")

    manifest = args.manifest.resolve()
    set_seed(args.seed)
    train_samples = build_manifest_pairs(manifest, INTERIM_SPECIES, args.fold, split="train")
    validation_samples = build_manifest_pairs(manifest, INTERIM_SPECIES, args.fold, split="validation")
    if len(train_samples) < args.batch_size:
        raise SystemExit("Not enough reviewed training pairs for the selected batch size.")

    train_loader = DataLoader(
        ManifestPairedDataset(train_samples, transform=get_train_transforms()),
        batch_size=args.batch_size,
        shuffle=True,
        drop_last=True,
        num_workers=0,
    )
    validation_loader = DataLoader(
        ManifestPairedDataset(validation_samples, transform=get_val_transforms()),
        batch_size=args.batch_size,
        shuffle=False,
        num_workers=0,
    )
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = LumbrScanFusionModel(pretrained=True, num_species=len(INTERIM_SPECIES)).to(device)
    optimizer = AdamW(model.parameters(), lr=args.learning_rate, weight_decay=1e-4)
    loss_fn = nn.CrossEntropyLoss()
    best_validation_accuracy = -1.0
    output_path = (
        args.output.resolve()
        if args.output
        else CHECKPOINT_DIR / f"interim_3species_fold{args.fold}_best.pt"
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print(
        f"[INFO] Training species-only profile {INTERIM_SPECIES} on {device}; "
        f"train pairs={len(train_samples)}, validation pairs={len(validation_samples)}, held-out fold={args.fold}",
        flush=True,
    )
    for epoch in range(1, args.epochs + 1):
        model.train()
        for batch in train_loader:
            optimizer.zero_grad()
            outputs = model(batch["cross_section"].to(device), batch["wood_grain"].to(device))
            labels = batch["species_label"].to(device)
            loss = loss_fn(outputs["species"], labels)
            loss.backward()
            optimizer.step()

        validation_loss, validation_accuracy = evaluate(model, validation_loader, device)
        print(
            f"[INFO] epoch={epoch}/{args.epochs} validation_loss={validation_loss:.4f} "
            f"validation_accuracy={validation_accuracy:.4f}",
            flush=True,
        )
        if validation_accuracy > best_validation_accuracy:
            best_validation_accuracy = validation_accuracy
            checkpoint = {
                "state_dict": model.state_dict(),
                "metadata": {
                    "profile": "interim_3species_species_only",
                    "species_classes": list(INTERIM_SPECIES),
                    "task": "species_classification_only",
                    "defect_head_trained": False,
                    "severity_head_trained": False,
                    "manifest_path": str(manifest),
                    "manifest_sha256": manifest_digest(manifest),
                    "held_out_fold": args.fold,
                    "seed": args.seed,
                    "epochs_requested": args.epochs,
                    "batch_size": args.batch_size,
                    "learning_rate": args.learning_rate,
                    "validation_loss": validation_loss,
                    "validation_accuracy": validation_accuracy,
                    "created_at_utc": datetime.now(timezone.utc).isoformat(),
                },
            }
            torch.save(checkpoint, output_path)
            output_path.with_suffix(".json").write_text(
                json.dumps(checkpoint["metadata"], indent=2) + "\n", encoding="utf-8"
            )
            print(f"[OK] Saved best checkpoint to {output_path}", flush=True)


if __name__ == "__main__":
    main()
