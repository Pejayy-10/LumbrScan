"""
DENR Permit Status Engine
============================
Implements DENR DAO 2026-20 and related legal frameworks for
Philippine timber transport and use permit requirements.
"""

# Permit status constants matching apiContract.json
PERMIT_REQUIRED     = "PERMIT_REQUIRED"
RESTRICTED          = "RESTRICTED"
EXEMPT              = "EXEMPT"
PCA_GOVERNED        = "PCA_GOVERNED"

SPECIES_DENR_STATUS: dict[str, dict] = {
    "narra": {
        "status":      PERMIT_REQUIRED,
        "label":       "NATIONAL TREE / REGULATED",
        "permit_type": "DENR DAO 2026-20 / DAO 2004-15 Transport Permit",
        "authority":   "DENR Regional Office",
        "note":        "National Tree. Transport and cutting strictly regulated.",
    },
    "ipil": {
        "status":      PERMIT_REQUIRED,
        "label":       "PROTECTED HARDWOOD",
        "permit_type": "DENR Protected Species Transport Permit",
        "authority":   "DENR Regional Office",
        "note":        "Protected hardwood. Permit required for any transport or use.",
    },
    "molave": {
        "status":      RESTRICTED,
        "label":       "CRITICALLY REGULATED NATIVE SPECIES",
        "permit_type": "DENR Mandatory Special Clearance",
        "authority":   "DENR Central Office",
        "note":        "Mandatory DENR clearance required. No commercial cutting allowed.",
    },
    "apitong": {
        "status":      PERMIT_REQUIRED,
        "label":       "COMMERCIAL NATIVE HARDWOOD",
        "permit_type": "DENR DAO 2026-20 Transport Permit",
        "authority":   "DENR Regional Office",
        "note":        "Regulated commercial hardwood. Transport permit mandatory.",
    },
    "white_lauan": {
        "status":      PERMIT_REQUIRED,
        "label":       "REGULATED COMMERCIAL SPECIES",
        "permit_type": "DENR Cutting Permit",
        "authority":   "DENR Regional Office",
        "note":        "DENR cutting permit mandatory for all transactions.",
    },
    "yakal": {
        "status":      RESTRICTED,
        "label":       "CRITICALLY ENDANGERED",
        "permit_type": "DENR Special Permit (Very Restricted)",
        "authority":   "DENR Central Office / Protected Areas Management Bureau",
        "note":        "Critically endangered. Restricted cutting. Special permit required.",
    },
    "gmelina": {
        "status":      EXEMPT,
        "label":       "PLANTATION SPECIES",
        "permit_type": "None required",
        "authority":   "N/A",
        "note":        "Plantation species. Exempt from native cutting restrictions.",
    },
    "coconut": {
        "status":      PCA_GOVERNED,
        "label":       "PALM / PCA GOVERNED",
        "permit_type": "Philippine Coconut Authority (PCA) Permit",
        "authority":   "Philippine Coconut Authority",
        "note":        "Governed by PCA. Coconut palm felling requires PCA clearance.",
    },
    "acacia": {
        "status":      EXEMPT,
        "label":       "EXOTIC PLANTATION SPECIES",
        "permit_type": "None required",
        "authority":   "N/A",
        "note":        "Exotic plantation species. Commercially harvested without restriction.",
    },
    "mango": {
        "status":      EXEMPT,
        "label":       "SENILE AGRICULTURAL FRUIT WOOD",
        "permit_type": "None required (Barangay Clearance recommended)",
        "authority":   "Local Barangay",
        "note":        "Exempt from forestry laws. Barangay clearance recommended for senile trees.",
    },
    "nangka": {
        "status":      EXEMPT,
        "label":       "FRUIT TREE WOOD",
        "permit_type": "None required",
        "authority":   "N/A",
        "note":        "Exempt from forestry cutting restrictions. Freely tradeable.",
    },
}


def get_denr_status(species: str) -> dict:
    """Return the DENR legal permit status for a given species."""
    return SPECIES_DENR_STATUS.get(species, {
        "status":      PERMIT_REQUIRED,
        "label":       "UNKNOWN SPECIES",
        "permit_type": "Verify with DENR Regional Office",
        "authority":   "DENR",
        "note":        "Species not in LumbrScan database. Verify permit requirements.",
    })
