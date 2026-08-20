from fastapi import APIRouter
from pydantic import BaseModel
from app.core.fprdi_rules import SPECIES_FPRDI_GROUP, FPRDI_GROUP_LABELS
from app.core.denr_rules import get_denr_status

router = APIRouter()


class RecommendRequest(BaseModel):
    construction_task: str   # e.g. "structural_beam", "flooring", "formwork"
    budget_php:        float # Maximum budget in Philippine Peso
    quantity_bdft:     float # Required board feet


# Price ranges per species (PHP/bd.ft) — midpoint of SYSTEM_CONTEXT ranges
SPECIES_PRICE_MID = {
    "narra":       270.0,
    "ipil":        240.0,
    "molave":      425.0,
    "apitong":     155.0,
    "white_lauan": 102.5,
    "yakal":       375.0,
    "gmelina":      57.5,
    "coconut":      32.5,
    "acacia":      140.0,
    "mango":        52.5,
    "nangka":      115.0,
}

# Minimum FPRDI group required per construction task
TASK_MIN_GROUP = {
    "structural_beam":   1,
    "roof_truss":        2,
    "floor_joist":       2,
    "wall_stud":         3,
    "formwork":          3,
    "furniture":         4,
    "decking":           2,
    "door_frame":        2,
    "general":           3,
}


@router.post("/recommend")
async def recommend_species(req: RecommendRequest):
    """
    Recommend suitable Philippine timber species for a construction task based on
    FPRDI minimum strength requirements and budget constraints.
    """
    min_group = TASK_MIN_GROUP.get(req.construction_task, 3)
    total_budget = req.budget_php
    qty = req.quantity_bdft

    recommendations = []
    for species, group in SPECIES_FPRDI_GROUP.items():
        if group > min_group:
            continue   # Does not meet minimum strength requirement

        price_per_bdft = SPECIES_PRICE_MID[species]
        total_cost = price_per_bdft * qty

        if total_cost > total_budget:
            continue   # Exceeds budget

        denr = get_denr_status(species)
        recommendations.append({
            "species":         species,
            "fprdi_group":     group,
            "fprdi_label":     FPRDI_GROUP_LABELS[group],
            "price_per_bdft":  price_per_bdft,
            "estimated_cost":  round(total_cost, 2),
            "budget_remaining": round(total_budget - total_cost, 2),
            "denr_status":     denr["status"],
            "denr_note":       denr["note"],
        })

    # Sort by strength group (strongest first), then by cost (cheapest first)
    recommendations.sort(key=lambda x: (x["fprdi_group"], x["estimated_cost"]))

    return {
        "construction_task":  req.construction_task,
        "minimum_fprdi_group": min_group,
        "budget_php":          total_budget,
        "quantity_bdft":       qty,
        "recommendations":     recommendations,
        "total_options":       len(recommendations),
    }
