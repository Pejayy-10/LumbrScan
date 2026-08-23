"""Export a reviewed three-species, species-only checkpoint to ONNX."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

import torch
import torch.nn as nn

from app.ml.constants import IMAGE_SIZE
from app.ml.fusion_model import LumbrScanFusionModel


class SpeciesOnlyExportModel(nn.Module):
    def __init__(self, model: LumbrScanFusionModel) -> None:
        super().__init__()
        self.model = model

    def forward(self, cross_section: torch.Tensor, wood_grain: torch.Tensor) -> torch.Tensor:
        return self.model(cross_section, wood_grain)["species"]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--checkpoint", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    checkpoint_path = args.checkpoint.resolve()
    checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=True)
    metadata = checkpoint["metadata"]
    if metadata.get("task") != "species_classification_only":
        raise SystemExit("Only a species-classification-only checkpoint can be exported with this script.")

    species_classes = metadata["species_classes"]
    model = LumbrScanFusionModel(pretrained=False, num_species=len(species_classes))
    model.load_state_dict(checkpoint["state_dict"])
    model.eval()
    output_path = args.output.resolve() if args.output else checkpoint_path.with_suffix(".onnx")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    wrapper = SpeciesOnlyExportModel(model)
    dummy_input = torch.zeros(1, 3, IMAGE_SIZE, IMAGE_SIZE)
    torch.onnx.export(
        wrapper,
        (dummy_input, dummy_input),
        output_path,
        opset_version=17,
        input_names=["cross_section", "wood_grain"],
        output_names=["species"],
        dynamic_axes={
            "cross_section": {0: "batch_size"},
            "wood_grain": {0: "batch_size"},
            "species": {0: "batch_size"},
        },
    )
    output_path.with_suffix(".json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    print(f"[OK] Exported species-only ONNX model to {output_path}", flush=True)


if __name__ == "__main__":
    main()
