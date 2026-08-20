"""
ONNX Model Export Script
==========================
BEGINNER EXPLANATION — WHAT IS ONNX?

PyTorch is great for training, but it's a bit heavy for production use.
ONNX (Open Neural Network Exchange) is a universal model format that allows
us to run our trained model much faster using ONNX Runtime — up to 2-3x
faster than raw PyTorch on CPU, with no GPU required.

The export process:
  1. Load the trained .pt weights from training
  2. Run one dummy "trace" forward pass to record all operations
  3. Save the recorded computation graph as a .onnx file

After exporting, the FastAPI server uses onnxruntime to load the .onnx file
and run inference. It's self-contained — no PyTorch needed at inference time!

HOW TO RUN:
  Make sure you've trained the model first:  python scripts/train.py
  Then:                                       python scripts/export_onnx.py
"""

import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import torch
from app.ml.fusion_model import LumbrScanFusionModel
from app.ml.constants import IMAGE_SIZE

WEIGHTS_DIR   = os.path.join(os.path.dirname(__file__), "..", "app", "ml", "weights")
BEST_MODEL_PT = os.path.join(WEIGHTS_DIR, "lumbrscan_best.pt")
ONNX_PATH     = os.path.join(WEIGHTS_DIR, "lumbrscan.onnx")


def export():
    print("=" * 60)
    print("LumbrScan - ONNX Model Export")
    print("=" * 60)

    if not os.path.exists(BEST_MODEL_PT):
        print(f"\n[ERROR] Trained model not found at: {BEST_MODEL_PT}")
        print("  → Run training first: python scripts/train.py")
        sys.exit(1)

    print(f"Loading trained weights from: {BEST_MODEL_PT}")
    model = LumbrScanFusionModel(pretrained=False)
    model.load_state_dict(torch.load(BEST_MODEL_PT, map_location="cpu", weights_only=True))
    model.eval()

    # Create dummy input tensors (batch_size=1, RGB, 224x224)
    dummy_cross = torch.zeros(1, 3, IMAGE_SIZE, IMAGE_SIZE)
    dummy_grain = torch.zeros(1, 3, IMAGE_SIZE, IMAGE_SIZE)

    print("Exporting to ONNX...")
    torch.onnx.export(
        model,
        (dummy_cross, dummy_grain),
        ONNX_PATH,
        export_params=True,
        opset_version=17,
        input_names=["cross_section", "wood_grain"],
        output_names=["species", "defects", "severity"],
        dynamic_axes={
            "cross_section": {0: "batch_size"},
            "wood_grain":    {0: "batch_size"},
            "species":       {0: "batch_size"},
            "defects":       {0: "batch_size"},
            "severity":      {0: "batch_size"},
        },
    )

    size_mb = os.path.getsize(ONNX_PATH) / (1024 * 1024)
    print(f"\n✓ ONNX model exported successfully!")
    print(f"  Path: {ONNX_PATH}")
    print(f"  Size: {size_mb:.1f} MB")
    print("\nNext step: start the FastAPI server:")
    print("  uvicorn app.main:app --reload")


if __name__ == "__main__":
    export()
