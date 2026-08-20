from typing import Optional
from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
import io

from app.ml.predictor import get_predictor
from app.core.fprdi_rules import compute_effective_strength_group
from app.core.denr_rules import get_denr_status

router = APIRouter()


@router.post("/scan")
async def scan_timber(
    cross_section: Optional[UploadFile] = File(default=None, description="End-grain / transversal cross-section photo"),
    wood_grain:    Optional[UploadFile] = File(default=None, description="Surface / wood grain photo"),
):
    """
    Identify Philippine timber species and detect defects from uploaded images.

    - Upload **cross_section** and/or **wood_grain** images.
    - At least one image is required.
    - Returns species prediction, confidence, detected defects, severity, FPRDI group, and DENR permit status.
    """
    if cross_section is None and wood_grain is None:
        raise HTTPException(
            status_code=400,
            detail="At least one image (cross_section or wood_grain) must be uploaded.",
        )

    # Load PIL images from uploaded files
    cs_img = None
    gr_img = None

    if cross_section:
        cs_bytes = await cross_section.read()
        cs_img = Image.open(io.BytesIO(cs_bytes)).convert("RGB")

    if wood_grain:
        gr_bytes = await wood_grain.read()
        gr_img = Image.open(io.BytesIO(gr_bytes)).convert("RGB")

    # Run ML inference
    try:
        predictor = get_predictor()
        result = predictor.predict(
            cross_section_image=cs_img,
            wood_grain_image=gr_img,
        )
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Model not ready: {str(e)}. Run training and ONNX export first.",
        )

    species          = result["predicted_species"]
    detected_defects = result["detected_defects"]
    severity         = result["severity"]

    # Compute FPRDI strength group with defect downgrade
    fprdi = compute_effective_strength_group(species, detected_defects, severity)

    # Get DENR legal permit status
    denr = get_denr_status(species)

    # Structural warning for severe defects
    structural_warning = None
    if not fprdi["is_structural"]:
        structural_warning = "⚠️ UNSAFE FOR STRUCTURAL USE — timber has been downgraded to Group IV due to detected defects."

    return {
        "species": {
            "predicted":   species,
            "confidence":  result["species_confidence"],
            "ranking":     result["species_ranking"][:5],   # Top 5 candidates
        },
        "defects": {
            "detected":      detected_defects,
            "probabilities": result["defect_probabilities"],
            "severity":      severity,
            "severity_confidence": result["severity_confidence"],
        },
        "fprdi": {
            "base_group":       fprdi["base_fprdi_group"],
            "effective_group":  fprdi["effective_fprdi_group"],
            "base_label":       fprdi["base_label"],
            "effective_label":  fprdi["effective_label"],
            "downgrade_steps":  fprdi["downgrade_steps"],
            "is_structural":    fprdi["is_structural"],
        },
        "denr": {
            "status":      denr["status"],
            "label":       denr["label"],
            "permit_type": denr["permit_type"],
            "authority":   denr["authority"],
            "note":        denr["note"],
        },
        "structural_warning": structural_warning,
        "modalities_used": {
            "cross_section": cross_section is not None,
            "wood_grain":    wood_grain is not None,
        },
    }
