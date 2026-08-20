from fastapi import APIRouter
from app.ml.constants import SPECIES_CLASSES
from app.core.fprdi_rules import SPECIES_FPRDI_GROUP, FPRDI_GROUP_LABELS
from app.core.denr_rules import SPECIES_DENR_STATUS

router = APIRouter()

@router.get("/species")
async def list_species():
    """Return knowledge base for all 11 target Philippine timber species."""
    species_list = []
    for s in SPECIES_CLASSES:
        denr = SPECIES_DENR_STATUS.get(s, {})
        fprdi_group = SPECIES_FPRDI_GROUP.get(s, 4)
        species_list.append({
            "id":           s,
            "fprdi_group":  fprdi_group,
            "fprdi_label":  FPRDI_GROUP_LABELS[fprdi_group],
            "denr_status":  denr.get("status"),
            "denr_label":   denr.get("label"),
            "permit_type":  denr.get("permit_type"),
        })
    return {"species": species_list, "total": len(species_list)}
