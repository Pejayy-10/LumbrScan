"""
ONNX Runtime Inference Manager
=================================
This module handles loading the trained .onnx model and running
real-time inference on uploaded timber images.

BEGINNER EXPLANATION:
After training, we exported our model to ONNX format.
This predictor loads that ONNX file and runs it fast on any input image
using ONNX Runtime — no PyTorch needed at inference time.
"""

import os
from typing import Optional

import numpy as np
import onnxruntime as ort
from PIL import Image
from torchvision import transforms

from app.ml.constants import (
    SPECIES_CLASSES, DEFECT_CLASSES, SEVERITY_CLASSES,
    IMAGE_SIZE, IMAGENET_MEAN, IMAGENET_STD,
)

ONNX_MODEL_PATH = os.path.join(
    os.path.dirname(__file__), "weights", "lumbrscan.onnx"
)

# Preprocessing pipeline (same as val_transforms in dataset.py)
_preprocess = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])


def _to_numpy(image: Image.Image) -> np.ndarray:
    """Convert a PIL image to a normalized numpy array for ONNX input."""
    tensor = _preprocess(image.convert("RGB"))
    return tensor.unsqueeze(0).numpy()  # [1, 3, 224, 224]


def _zeros_input() -> np.ndarray:
    """Return a blank (all-zero) tensor for a missing modality."""
    return np.zeros((1, 3, IMAGE_SIZE, IMAGE_SIZE), dtype=np.float32)


class LumbrScanPredictor:
    """
    Singleton ONNX Runtime inference session for LumbrScan.

    Loaded once at FastAPI startup and reused for all requests.
    Supports single-modality input (cross_section only or wood_grain only).
    """

    def __init__(self, model_path: str = ONNX_MODEL_PATH):
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"ONNX model not found at: {model_path}\n"
                "Run training first: python scripts/train.py\n"
                "Then export:         python scripts/export_onnx.py"
            )

        # Use CPU execution provider (works on all machines)
        self.session = ort.InferenceSession(
            model_path,
            providers=["CPUExecutionProvider"],
        )
        print(f"[LumbrScanPredictor] ONNX model loaded from: {model_path}")

    def predict(
        self,
        cross_section_image: Optional[Image.Image] = None,
        wood_grain_image: Optional[Image.Image] = None,
    ) -> dict:
        """
        Run inference on one or two timber images.

        At least one image must be provided.
        If one modality is missing, zeros are used for that input.

        Returns:
            dict with species, defects, severity predictions and confidence scores.
        """
        if cross_section_image is None and wood_grain_image is None:
            raise ValueError("At least one image (cross_section or wood_grain) is required.")

        cross_np = _to_numpy(cross_section_image) if cross_section_image else _zeros_input()
        grain_np  = _to_numpy(wood_grain_image)   if wood_grain_image   else _zeros_input()

        # Run ONNX inference
        outputs = self.session.run(
            output_names=["species", "defects", "severity"],
            input_feed={"cross_section": cross_np, "wood_grain": grain_np},
        )

        species_logits  = outputs[0][0]   # Shape: [11]
        defect_probs    = outputs[1][0]   # Shape: [5]  — already sigmoid
        severity_logits = outputs[2][0]   # Shape: [4]

        # Convert species logits to softmax probabilities
        species_exp    = np.exp(species_logits - species_logits.max())
        species_probs  = species_exp / species_exp.sum()

        # Convert severity logits to softmax probabilities
        sev_exp    = np.exp(severity_logits - severity_logits.max())
        sev_probs  = sev_exp / sev_exp.sum()

        # Top prediction
        top_species_idx = int(np.argmax(species_probs))
        top_species     = SPECIES_CLASSES[top_species_idx]
        top_confidence  = float(species_probs[top_species_idx])

        # Detected defects (threshold 0.5)
        detected_defects = [
            DEFECT_CLASSES[i]
            for i, p in enumerate(defect_probs)
            if p >= 0.5
        ]

        # Severity
        top_severity_idx = int(np.argmax(sev_probs))
        top_severity     = SEVERITY_CLASSES[top_severity_idx]

        # Full species ranking
        species_ranking = sorted(
            [
                {"species": SPECIES_CLASSES[i], "confidence": float(species_probs[i])}
                for i in range(len(SPECIES_CLASSES))
            ],
            key=lambda x: x["confidence"],
            reverse=True,
        )

        return {
            "predicted_species":    top_species,
            "species_confidence":   round(top_confidence, 4),
            "species_ranking":      species_ranking,
            "detected_defects":     detected_defects,
            "defect_probabilities": {
                DEFECT_CLASSES[i]: round(float(defect_probs[i]), 4)
                for i in range(len(DEFECT_CLASSES))
            },
            "severity":             top_severity,
            "severity_confidence":  round(float(sev_probs[top_severity_idx]), 4),
        }


# Module-level singleton — initialized at FastAPI startup
_predictor_instance: Optional[LumbrScanPredictor] = None


def get_predictor() -> LumbrScanPredictor:
    """Return the global predictor singleton."""
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = LumbrScanPredictor()
    return _predictor_instance
