"""Inference support for the three-species, research-only classifier.

This module is deliberately separate from ``predictor.py``.  The established
predictor serves the legacy eleven-species, multi-head model; the interim model
supports only coconut, gmelina, and mango, and has no trained defect or
severity heads.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import torch
from PIL import Image

from app.ml.dataset import get_val_transforms
from app.ml.fusion_model import LumbrScanFusionModel


INTERIM_SPECIES_CLASSES = ("coconut", "gmelina", "mango")
INTERIM_CHECKPOINT_ENV = "LUMBRSCAN_INTERIM_CHECKPOINT"


class InterimModelUnavailableError(RuntimeError):
    """Raised when the local interim checkpoint has not been configured."""


class InterimSpeciesPredictor:
    """Load and run a reviewed, species-only interim checkpoint on CPU."""

    def __init__(self, checkpoint_path: str | Path) -> None:
        self.checkpoint_path = Path(checkpoint_path).expanduser().resolve()
        if not self.checkpoint_path.is_file():
            raise InterimModelUnavailableError(
                f"Interim checkpoint not found: {self.checkpoint_path}. "
                f"Set {INTERIM_CHECKPOINT_ENV} to a reviewed local .pt checkpoint."
            )

        try:
            checkpoint: dict[str, Any] = torch.load(
                self.checkpoint_path, map_location="cpu", weights_only=True
            )
        except Exception as error:  # torch raises several error types for malformed files.
            raise InterimModelUnavailableError(
                f"Could not load interim checkpoint {self.checkpoint_path}: {error}"
            ) from error

        metadata = checkpoint.get("metadata")
        state_dict = checkpoint.get("state_dict")
        if not isinstance(metadata, dict) or not isinstance(state_dict, dict):
            raise InterimModelUnavailableError("Interim checkpoint has an invalid structure.")
        if metadata.get("task") != "species_classification_only":
            raise InterimModelUnavailableError("Checkpoint is not a species-classification-only model.")
        if tuple(metadata.get("species_classes", ())) != INTERIM_SPECIES_CLASSES:
            raise InterimModelUnavailableError(
                "Checkpoint classes must be exactly coconut, gmelina, mango in that order."
            )

        self.metadata = metadata
        self.model = LumbrScanFusionModel(pretrained=False, num_species=len(INTERIM_SPECIES_CLASSES))
        self.model.load_state_dict(state_dict)
        self.model.eval()
        self.transform = get_val_transforms()

    def predict(self, cross_section: Image.Image, wood_grain: Image.Image) -> dict[str, object]:
        """Return species probabilities for a required cross-section/grain pair."""
        cross_tensor = self.transform(cross_section.convert("RGB")).unsqueeze(0)
        grain_tensor = self.transform(wood_grain.convert("RGB")).unsqueeze(0)
        with torch.inference_mode():
            logits = self.model(cross_tensor, grain_tensor)["species"][0]
            probabilities = torch.softmax(logits, dim=0).tolist()

        ranking = sorted(
            (
                {"species": species, "confidence": round(float(probability), 4)}
                for species, probability in zip(INTERIM_SPECIES_CLASSES, probabilities)
            ),
            key=lambda item: float(item["confidence"]),
            reverse=True,
        )
        return {
            "predicted_species": ranking[0]["species"],
            "species_confidence": ranking[0]["confidence"],
            "species_ranking": ranking,
            "model_profile": self.metadata["profile"],
        }


_predictor_instance: InterimSpeciesPredictor | None = None


def get_interim_species_predictor() -> InterimSpeciesPredictor:
    """Return the configured local interim predictor singleton."""
    global _predictor_instance
    if _predictor_instance is None:
        checkpoint_path = os.environ.get(INTERIM_CHECKPOINT_ENV)
        if not checkpoint_path:
            raise InterimModelUnavailableError(
                f"{INTERIM_CHECKPOINT_ENV} is not set. Point it at a reviewed local .pt checkpoint."
            )
        _predictor_instance = InterimSpeciesPredictor(checkpoint_path)
    return _predictor_instance
