"""Merge a crop-review recovery CSV after Windows locked the main manifest.

Close Excel and any preview of ``image_metadata.csv`` before running this
command. The merge only promotes rows that the recovery file marks as KEEP or
REJECT; it does not discard metadata already present in the main manifest.
"""

from __future__ import annotations

import argparse
import csv
import os
import tempfile
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = BACKEND_ROOT / "data" / "metadata" / "image_metadata.csv"


def read_rows(path: Path) -> tuple[list[dict[str, str]], list[str]]:
    with path.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        return list(reader), reader.fieldnames or []


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--recovery", type=Path, required=True)
    args = parser.parse_args()

    manifest_path = args.manifest.resolve()
    recovery_path = args.recovery.resolve()
    current_rows, fieldnames = read_rows(manifest_path)
    recovery_rows, recovery_fields = read_rows(recovery_path)
    if fieldnames != recovery_fields:
        raise SystemExit("Recovery CSV columns do not match the current manifest.")

    recovery_by_id = {row["image_id"]: row for row in recovery_rows}
    recovered_count = 0
    for row in current_rows:
        recovered = recovery_by_id.get(row["image_id"])
        if recovered is None or recovered["quality_status"] not in {"KEEP", "REJECT"}:
            continue
        if row["quality_status"] == "REVIEW":
            row.update(recovered)
            recovered_count += 1

    with tempfile.NamedTemporaryFile(
        "w", encoding="utf-8", newline="", delete=False, dir=manifest_path.parent
    ) as temporary:
        writer = csv.DictWriter(temporary, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(current_rows)
        temporary_path = Path(temporary.name)
    os.replace(temporary_path, manifest_path)
    print(f"[OK] Recovered {recovered_count} reviewed row(s) into {manifest_path}", flush=True)


if __name__ == "__main__":
    main()
