// Structural grading reference data for the three supported species.
// Source of every value: "Philippine Timber Strength Analysis and Construction
// Suitability Assessment" (13 Nov 2026), built on FPRDI Trade Bulletin Series
// No. 4 (Alipon & Bondad) plus the additional research listed in its Section 8.
// A null value means no value is printed in the source; it is never estimated.

import { SupportedSpeciesId } from "./supportedSpecies";

export type FprdiGroupId = "I" | "II" | "III" | "IV" | "V";

export const FPRDI_GROUP_SCALE: { id: FprdiGroupId; name: string }[] = [
  { id: "I", name: "High Strength" },
  { id: "II", name: "Moderately High Strength" },
  { id: "III", name: "Medium Strength" },
  { id: "IV", name: "Moderately Low Strength" },
  { id: "V", name: "Low Strength" },
];

// D = documented, V = verify, N = outside documented end-uses, I = insufficient data
export type SuitabilityStatus = "D" | "V" | "N" | "I";

export const SUITABILITY_CATEGORIES = [
  "Structural framing",
  "Beams & girders",
  "Columns & posts",
  "Roof rafters & trusses",
  "Flooring",
  "Doors & window frames",
  "Wall paneling",
  "Furniture & cabinetry",
  "Exterior construction",
  "Heavy-duty construction",
] as const;

export type SuitabilityCategory = (typeof SUITABILITY_CATEGORIES)[number];

export interface GradingProperty {
  label: string;
  unit: string;
  green: number | null;
  mc12: number | null;
}

export interface ResearchEntry {
  heading: string;
  values: { label: string; value: string }[];
  note?: string;
}

export interface ResearchBlock {
  title: string;
  source: string;
  entries: ResearchEntry[];
}

export interface SpeciesGrading {
  speciesId: SupportedSpeciesId;
  /** FPRDI group copied from the bulletin. null = no group available. */
  grade: { group: FprdiGroupId; detail: string } | null;
  /** Sample size and bulletin pages, e.g. "10 trees · bulletin pp. 40–41". */
  sampleNote: string | null;
  groupingProperties: GradingProperty[];
  additionalProperties: GradingProperty[];
  suitability: Record<SuitabilityCategory, SuitabilityStatus> | null;
  research: ResearchBlock[];
  dataNotes: string[];
}

export const STRUCTURAL_GRADING: Record<SupportedSpeciesId, SpeciesGrading> = {
  gmelina: {
    speciesId: "gmelina",
    grade: {
      group: "III",
      detail: "Plantation species (printed as Yemane in the bulletin)",
    },
    sampleNote: "10 trees · FPRDI bulletin pp. 40–41",
    groupingProperties: [
      { label: "MOR (bending)", unit: "MPa", green: 47.75, mc12: null },
      { label: "MOE (stiffness)", unit: "GPa", green: 6.81, mc12: null },
      {
        label: "Crushing strength (MCS)",
        unit: "MPa",
        green: 24.55,
        mc12: null,
      },
      { label: "SPL ⟂ to grain", unit: "MPa", green: 6.97, mc12: null },
      { label: "Shear", unit: "MPa", green: 8.12, mc12: null },
      { label: "Relative density", unit: "", green: 0.42, mc12: null },
    ],
    additionalProperties: [
      { label: "SPL in bending", unit: "MPa", green: 29.8, mc12: null },
      { label: "SPL compression ∥", unit: "MPa", green: 16.5, mc12: null },
      { label: "MOE compression ∥", unit: "GPa", green: 8.23, mc12: null },
      { label: "Hardness (side)", unit: "kN", green: 3.79, mc12: null },
      { label: "Hardness (end)", unit: "kN", green: 3.71, mc12: null },
      { label: "Toughness", unit: "J/spec.", green: 30.65, mc12: null },
    ],
    suitability: {
      "Structural framing": "D",
      "Beams & girders": "D",
      "Columns & posts": "N",
      "Roof rafters & trusses": "D",
      Flooring: "V",
      "Doors & window frames": "V",
      "Wall paneling": "D",
      "Furniture & cabinetry": "D",
      "Exterior construction": "I",
      "Heavy-duty construction": "N",
    },
    research: [],
    dataNotes: [
      "Green-condition values only. All 12% moisture values are printed as “-” in the bulletin.",
      "No durability, shrinkage or dimensional-stability data exists in the bulletin, so exterior use cannot be assessed.",
      "Beams, rafters and framing are documented for low-grade (Group III) use only.",
    ],
  },

  mango: {
    speciesId: "mango",
    grade: null,
    sampleNote: null,
    groupingProperties: [],
    additionalProperties: [],
    suitability: null,
    research: [
      {
        title: "Additional research (not the FPRDI bulletin)",
        source:
          "Marasigan et al. (2024), Journal of Tropical Forest Science 36(1): 91–104",
        entries: [
          {
            heading: "Green · 3 senile trees, Laguna · ASTM D143",
            values: [
              { label: "MOR", value: "40.44 MPa" },
              { label: "MOE", value: "4.60 GPa" },
              { label: "Compression ∥", value: "19.30 MPa" },
            ],
            note: "The authors place Mangifera indica in a “moderately low” class using the FPRDI scheme. This is a research placement, not a bulletin group, and the app has not recalculated it.",
          },
        ],
      },
      {
        title: "Genus-level reference",
        source: "PROSEA (Boer et al., 1995), “machang” group",
        entries: [
          {
            heading: "12% moisture · Mangifera genus ranges",
            values: [
              { label: "MOR", value: "88.5–90 (–110) N/mm²" },
              { label: "MOE", value: "10,900–14,300 (–15,400) N/mm²" },
              { label: "Compression ∥", value: "43–51.5 (–55) N/mm²" },
            ],
            note: "Genus-level ranges in a different moisture condition. Not specific to M. indica and not comparable with the green values above, so they cannot upgrade the species.",
          },
        ],
      },
    ],
    dataNotes: [
      "Mango is not listed in the FPRDI bulletin, so no strength group is available.",
      "Genus-level sources rate machang wood non-durable in exposed or ground contact.",
    ],
  },

  coconut: {
    speciesId: "coconut",
    grade: null,
    sampleNote: null,
    groupingProperties: [],
    additionalProperties: [],
    suitability: null,
    research: [
      {
        title: "Additional research (not the FPRDI bulletin)",
        source:
          "Killmann & Fink, FAO/GTZ Coconut Palm Stem Processing handbook (data attributed to Sulc, 1983)",
        entries: [
          {
            heading: "High-density wood (> 0.6 g/cm³) · 12% moisture",
            values: [
              { label: "MOR", value: "104 MPa" },
              { label: "MOE", value: "11,414 MPa" },
              { label: "Compression ∥", value: "57 MPa" },
              { label: "Shear", value: "13 MPa" },
            ],
            note: "Source describes this zone as suitable for load-bearing structural use, framing, flooring, stairs and furniture.",
          },
          {
            heading: "Medium-density wood (0.4–0.59 g/cm³) · 12% moisture",
            values: [
              { label: "MOR", value: "63 MPa" },
              { label: "MOE", value: "7,116 MPa" },
              { label: "Compression ∥", value: "38 MPa" },
              { label: "Shear", value: "8 MPa" },
            ],
            note: "Source describes this zone as suitable for limited load-bearing use, furniture and wall paneling.",
          },
          {
            heading: "Low-density wood (0.25–0.39 g/cm³) · 12% moisture",
            values: [
              { label: "MOR", value: "33 MPa" },
              { label: "MOE", value: "3,633 MPa" },
              { label: "Compression ∥", value: "19 MPa" },
              { label: "Shear", value: "Not reported" },
            ],
            note: "Source describes this zone as suitable for indoor, non-load use only.",
          },
        ],
      },
    ],
    dataNotes: [
      "Coconut is not listed in the FPRDI bulletin, so no strength group is available.",
      "Coconut is a palm stem, not true timber. Properties depend on the density zone of the stem, so the zone must be known before any value is used.",
      "Eighty-year-old Mindanao stems; values were split into the three density groups from table text that lost its column breaks.",
    ],
  },
};
