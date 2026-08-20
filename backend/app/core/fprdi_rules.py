"""
FPRDI Strength Group Downgrade Engine
========================================
This module implements the Philippine Forest Products Research &
Development Institute (FPRDI) Strength Group assessment rules.

WHAT IS FPRDI STRENGTH GROUP?
-------------------------------
FPRDI classifies Philippine timber into 4 structural strength groups:
  - Group I:   Very High Strength (e.g. Molave, Yakal)
  - Group II:  High Strength      (e.g. Narra, Ipil, Apitong)
  - Group III: Medium Strength    (e.g. White Lauan, Gmelina, Acacia, Nangka)
  - Group IV:  Low Strength       (e.g. Coconut, Mango)

WHAT IS STRENGTH DOWNGRADE?
-----------------------------
When a piece of timber has defects, its effective strength is REDUCED.
A severely decayed Narra (normally Group II) might only perform like Group III.
Engineers and inspectors must account for this downgrade in their calculations.

This engine computes:
  1. The base FPRDI group for the identified species
  2. The downgrade based on detected defects and their severity
  3. The effective final strength group used for suitability recommendations
"""

from app.ml.constants import SPECIES_CLASSES

# === Base FPRDI Strength Group Per Species ===
SPECIES_FPRDI_GROUP: dict[str, int] = {
    "narra":       2,   # High Strength
    "ipil":        2,   # High Strength / Heavy Duty
    "molave":      1,   # Very High Strength
    "apitong":     2,   # High Structural Strength
    "white_lauan": 3,   # Medium Strength
    "yakal":       1,   # Very High Strength / Premier Structural Grade
    "gmelina":     3,   # Medium-Low Strength
    "coconut":     4,   # Low Strength (outer bark = 3, but core = 4)
    "acacia":      3,   # Medium Strength
    "mango":       4,   # Low Strength / Non-Structural
    "nangka":      3,   # Medium Strength
}

# Group descriptions for display
FPRDI_GROUP_LABELS: dict[int, str] = {
    1: "Group I — Very High Strength",
    2: "Group II — High Strength",
    3: "Group III — Medium Strength",
    4: "Group IV — Low Strength",
}

# Defect penalty table: (defect_class, severity) → number of groups to downgrade
# Rules derived from FPRDI timber grading standards
DEFECT_DOWNGRADE_RULES: dict[tuple[str, str], int] = {
    ("decay_rot",        "low"):      1,
    ("decay_rot",        "moderate"): 2,
    ("decay_rot",        "severe"):   3,  # Effectively renders timber unsafe
    ("end_splitting",    "low"):      0,
    ("end_splitting",    "moderate"): 1,
    ("end_splitting",    "severe"):   2,
    ("warping",          "low"):      0,
    ("warping",          "moderate"): 1,
    ("warping",          "severe"):   1,
    ("unsound_knots",    "low"):      0,
    ("unsound_knots",    "moderate"): 1,
    ("unsound_knots",    "severe"):   2,
    ("insect_boreholes", "low"):      1,
    ("insect_boreholes", "moderate"): 2,
    ("insect_boreholes", "severe"):   3,
}


def compute_effective_strength_group(
    species: str,
    detected_defects: list[str],
    severity: str,
) -> dict:
    """
    Compute the effective FPRDI strength group after applying defect downgrades.

    Args:
        species:          Identified species key (e.g. "narra")
        detected_defects: List of detected defect class names (e.g. ["decay_rot"])
        severity:         Overall severity level ("none", "low", "moderate", "severe")

    Returns:
        dict with keys: base_group, effective_group, downgrade_steps, label, is_structural
    """
    base_group = SPECIES_FPRDI_GROUP.get(species, 4)

    # Calculate maximum downgrade from all detected defects
    max_downgrade = 0
    for defect in detected_defects:
        key = (defect, severity)
        penalty = DEFECT_DOWNGRADE_RULES.get(key, 0)
        max_downgrade = max(max_downgrade, penalty)

    # Apply downgrade (cannot exceed Group IV = 4)
    effective_group = min(base_group + max_downgrade, 4)

    # Structural suitability: Group IV timber is non-structural only
    is_structural = effective_group <= 3

    return {
        "base_fprdi_group":      base_group,
        "effective_fprdi_group": effective_group,
        "downgrade_steps":       max_downgrade,
        "base_label":            FPRDI_GROUP_LABELS[base_group],
        "effective_label":       FPRDI_GROUP_LABELS[effective_group],
        "is_structural":         is_structural,
    }
