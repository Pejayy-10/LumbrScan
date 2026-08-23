"""Assign deterministic, specimen-disjoint folds to reviewed image metadata."""

from __future__ import annotations

import argparse
import csv
from collections import defaultdict
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = BACKEND_ROOT / "data" / "metadata" / "image_metadata.csv"


def load_rows(path: Path) -> tuple[list[dict[str, str]], list[str]]:
    with path.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        return list(reader), reader.fieldnames or []


def assign_folds(rows: list[dict[str, str]], fold_count: int) -> None:
    groups_by_species: dict[str, set[str]] = defaultdict(set)
    for row in rows:
        if row["quality_status"] == "KEEP":
            groups_by_species[row["species"]].add(row["specimen_id"])

    if not groups_by_species:
        raise ValueError("No KEEP rows found. Review and crop images before assigning folds.")

    for species, groups in groups_by_species.items():
        if len(groups) < fold_count:
            raise ValueError(
                f"{species} has {len(groups)} kept specimens, fewer than the requested {fold_count} folds."
            )
        for fold_id, specimen_id in enumerate(sorted(groups)):
            for row in rows:
                if row["specimen_id"] == specimen_id:
                    row["fold_id"] = str(fold_id % fold_count)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--fold-count", type=int, default=3)
    args = parser.parse_args()

    if args.fold_count < 2:
        raise SystemExit("fold-count must be at least 2")

    manifest = args.manifest.resolve()
    rows, fieldnames = load_rows(manifest)
    if "fold_id" not in fieldnames:
        raise SystemExit("Manifest is missing the fold_id column.")
    assign_folds(rows, args.fold_count)

    with manifest.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"[OK] Assigned {args.fold_count} specimen-disjoint folds in {manifest}", flush=True)


if __name__ == "__main__":
    main()
