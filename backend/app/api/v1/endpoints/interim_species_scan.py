"""Research-only endpoint for the three-species classifier."""

from __future__ import annotations

import io

from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from app.ml.interim_species_predictor import (
    InterimModelUnavailableError,
    get_interim_species_predictor,
)


router = APIRouter()
MAX_UPLOAD_BYTES = 10 * 1024 * 1024


async def read_uploaded_image(upload: UploadFile, field_name: str) -> Image.Image:
    """Decode one bounded image upload without trusting the filename or MIME type."""
    if upload.content_type and not upload.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail=f"{field_name} must be an image upload.")

    content = await upload.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail=f"{field_name} exceeds the 10 MiB limit.")
    try:
        with Image.open(io.BytesIO(content)) as decoded:
            decoded.load()
            return decoded.convert("RGB")
    except (UnidentifiedImageError, OSError, ValueError) as error:
        raise HTTPException(status_code=400, detail=f"{field_name} is not a valid image.") from error


@router.post("/interim/species-scan")
async def scan_interim_species(
    cross_section: UploadFile = File(description="Required cropped cross-section image"),
    wood_grain: UploadFile = File(description="Required cropped wood-grain image"),
):
    """Classify one paired timber sample as coconut, gmelina, or mango only.

    This research endpoint intentionally has no defect, severity, structural,
    FPRDI, or DENR output. It is not the final eleven-species model.
    """
    cross_image = await read_uploaded_image(cross_section, "cross_section")
    grain_image = await read_uploaded_image(wood_grain, "wood_grain")
    try:
        result = get_interim_species_predictor().predict(cross_image, grain_image)
    except InterimModelUnavailableError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

    return {
        "research_status": "interim_species_only",
        "supported_species": ["coconut", "gmelina", "mango"],
        "limitations": [
            "Defect detection and severity estimation are unavailable because they were not trained.",
            "This model is not validated for the final eleven-species thesis scope.",
        ],
        "species": {
            "predicted": result["predicted_species"],
            "confidence": result["species_confidence"],
            "ranking": result["species_ranking"],
        },
        "modalities_used": {"cross_section": True, "wood_grain": True},
        "model_profile": result["model_profile"],
    }
