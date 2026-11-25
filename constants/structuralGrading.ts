// Structural grading reference data for every species covered by the report.
// Source: "Philippine Timber Strength Analysis and Construction Suitability
// Assessment" (13 Nov 2026), built on FPRDI Trade Bulletin Series No. 4
// (Alipon & Bondad) plus the additional research listed in its Section 8.
// A null value means no value is printed in the source; it is never estimated.

export type FprdiGroupId = "I" | "II" | "III" | "IV" | "V";

export const FPRDI_GROUP_SCALE: {
  id: FprdiGroupId;
  name: string;
  short: string;
}[] = [
  { id: "I", name: "High Strength", short: "High" },
  { id: "II", name: "Moderately High Strength", short: "Mod. high" },
  { id: "III", name: "Medium Strength", short: "Medium" },
  { id: "IV", name: "Moderately Low Strength", short: "Mod. low" },
  { id: "V", name: "Low Strength", short: "Low" },
];

// D = documented, D* = documented for the group only, V = verify,
// N = outside documented end-uses, I = insufficient data
export type SuitabilityStatus = "D" | "D*" | "V" | "N" | "I";

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
  id: string;
  commonName: string;
  botanicalName: string;
  colorHex: string;
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

// ---------------------------------------------------------------------------
// Helpers (keep the data below readable). Each pair is [green, 12% MC].
// ---------------------------------------------------------------------------
type Pair = [number | null, number | null];
const N = null;

const grouping = (
  mor: Pair,
  moe: Pair,
  mcs: Pair,
  splPerp: Pair,
  shear: Pair,
  rd: Pair,
): GradingProperty[] => [
  { label: "MOR (bending)", unit: "MPa", green: mor[0], mc12: mor[1] },
  { label: "MOE (stiffness)", unit: "GPa", green: moe[0], mc12: moe[1] },
  {
    label: "Crushing strength (MCS)",
    unit: "MPa",
    green: mcs[0],
    mc12: mcs[1],
  },
  { label: "SPL ⟂ to grain", unit: "MPa", green: splPerp[0], mc12: splPerp[1] },
  { label: "Shear", unit: "MPa", green: shear[0], mc12: shear[1] },
  { label: "Relative density", unit: "", green: rd[0], mc12: rd[1] },
];

const additional = (
  splBend: Pair,
  splComp: Pair,
  moeComp: Pair,
  hardSide: Pair,
  hardEnd: Pair,
  tough: Pair,
): GradingProperty[] => [
  { label: "SPL in bending", unit: "MPa", green: splBend[0], mc12: splBend[1] },
  {
    label: "SPL compression ∥",
    unit: "MPa",
    green: splComp[0],
    mc12: splComp[1],
  },
  {
    label: "MOE compression ∥",
    unit: "GPa",
    green: moeComp[0],
    mc12: moeComp[1],
  },
  {
    label: "Hardness (side)",
    unit: "kN",
    green: hardSide[0],
    mc12: hardSide[1],
  },
  { label: "Hardness (end)", unit: "kN", green: hardEnd[0], mc12: hardEnd[1] },
  { label: "Toughness", unit: "J/spec.", green: tough[0], mc12: tough[1] },
];

const suitability = (values: SuitabilityStatus[]) =>
  Object.fromEntries(
    SUITABILITY_CATEGORIES.map((category, index) => [category, values[index]]),
  ) as Record<SuitabilityCategory, SuitabilityStatus>;

// Report Table 5.2, in the order of SUITABILITY_CATEGORIES.
const GROUP_I_USES = suitability([
  "V",
  "D",
  "D",
  "D",
  "V",
  "V",
  "I",
  "I",
  "D*",
  "D",
]);
const GROUP_II_USES = suitability([
  "V",
  "D",
  "V",
  "D",
  "D",
  "D",
  "V",
  "D",
  "I",
  "N",
]);
const GROUP_III_USES = suitability([
  "D",
  "D",
  "N",
  "D",
  "V",
  "V",
  "D",
  "D",
  "I",
  "N",
]);

const BULLETIN_NOTE_GREEN_ONLY =
  "Green-condition values only. All 12% moisture values are printed as “-” in the bulletin.";
const ACACIA_NOTE =
  "The bulletin lists three different Acacia species in different strength groups. Always identify which Acacia you mean.";

// ---------------------------------------------------------------------------
// Data, ordered by strength group, then name. Species without a group last.
// ---------------------------------------------------------------------------
export const STRUCTURAL_GRADING: SpeciesGrading[] = [
  {
    id: "yakal",
    commonName: "Yakal",
    botanicalName: "Shorea astylosa Foxw.",
    colorHex: "#78350F",
    grade: { group: "I", detail: "The only Group I species in this dataset" },
    sampleNote: "7 trees · FPRDI bulletin pp. 12–13",
    groupingProperties: grouping(
      [90.5, N],
      [16.53, N],
      [48.07, N],
      [13.77, N],
      [9.64, N],
      [0.76, N],
    ),
    additionalProperties: additional(
      [52.9, N],
      [31.7, N],
      [20.37, N],
      [7.15, N],
      [5.74, N],
      [47.23, N],
    ),
    suitability: GROUP_I_USES,
    research: [],
    dataNotes: [
      BULLETIN_NOTE_GREEN_ONLY,
      "Highest documented green stiffness (MOE 16.53 GPa) of the bulletin species listed here.",
      "No durability test exists for the species, so exterior and heavy-duty uses rest on the group description only.",
    ],
  },
  {
    id: "ipil",
    commonName: "Ipil",
    botanicalName: "Intsia bijuga (Colebr.) O. Ktze.",
    colorHex: "#991B1B",
    grade: { group: "II", detail: "Moderately high strength" },
    sampleNote: "1 tree · FPRDI bulletin pp. 16–17",
    groupingProperties: grouping(
      [90.4, 105.0],
      [12.4, 13.9],
      [N, N],
      [11.0, 13.4],
      [N, N],
      [0.68, 0.7],
    ),
    additionalProperties: additional(
      [57.2, 72.2],
      [N, N],
      [N, N],
      [N, N],
      [5.9, 7.76],
      [30.0, 41.3],
    ),
    suitability: GROUP_II_USES,
    research: [],
    dataNotes: [
      "One tree only, so the averages are weak evidence.",
      "Compression parallel (SPL, MCS, MOE), shear and side hardness are printed “-” in both conditions, so column and support-shear checks cannot be assessed.",
    ],
  },
  {
    id: "molave",
    commonName: "Molave",
    botanicalName: "Vitex parviflora Juss.",
    colorHex: "#D97706",
    grade: { group: "II", detail: "Moderately high strength" },
    sampleNote: "4 trees · FPRDI bulletin pp. 20–21",
    groupingProperties: grouping(
      [92.9, 117.0],
      [10.95, 16.65],
      [48.0, 66.25],
      [15.6, 17.05],
      [11.5, 13.05],
      [0.71, 0.77],
    ),
    additionalProperties: additional(
      [58.4, 70.75],
      [31.9, 41.8],
      [12.8, 15.1],
      [8.05, N],
      [7.03, 7.45],
      [63.4, 35.0],
    ),
    suitability: GROUP_II_USES,
    research: [],
    dataNotes: [
      "Complete data except 12% side hardness (printed “-”).",
      "Highest documented green MOR (92.90 MPa) of the bulletin species listed here.",
      "Heavy-duty and exterior use is not documented for Group II.",
    ],
  },
  {
    id: "narra",
    commonName: "Narra",
    botanicalName: "Pterocarpus indicus Willd. forma indicus",
    colorHex: "#B45309",
    grade: { group: "II", detail: "Moderately high strength" },
    sampleNote: "8 trees · FPRDI bulletin pp. 20–21",
    groupingProperties: grouping(
      [67.27, 88.03],
      [9.7, 11.4],
      [35.75, 52.95],
      [6.74, 10.25],
      [8.27, 10.87],
      [0.53, 0.55],
    ),
    additionalProperties: additional(
      [44.93, 58.0],
      [24.6, 32.85],
      [11.35, 13.0],
      [4.15, 4.66],
      [4.37, 5.73],
      [36.07, 29.53],
    ),
    suitability: GROUP_II_USES,
    research: [],
    dataNotes: [
      "Complete data for both green and 12% conditions.",
      "Lower density means lower shear and bearing strength than Molave, which matters for connections and floor bearing.",
    ],
  },
  {
    id: "acacia_crassicarpa",
    commonName: "Acacia (A. crassicarpa)",
    botanicalName: "Acacia crassicarpa A. Cunn. ex Benth.",
    colorHex: "#451A03",
    grade: { group: "II", detail: "Plantation species" },
    sampleNote: "1 tree · FPRDI bulletin pp. 26–27",
    groupingProperties: grouping(
      [74.4, N],
      [11.3, N],
      [23.8, N],
      [5.4, N],
      [8.42, N],
      [0.62, N],
    ),
    additionalProperties: additional(
      [42.4, N],
      [16.6, N],
      [7.68, N],
      [4.52, N],
      [5.63, N],
      [N, N],
    ),
    suitability: GROUP_II_USES,
    research: [],
    dataNotes: [
      BULLETIN_NOTE_GREEN_ONLY,
      "One tree only. Toughness is not printed.",
      ACACIA_NOTE,
    ],
  },
  {
    id: "acacia_cincinnata",
    commonName: "Acacia (A. cincinnata)",
    botanicalName: "Acacia cincinnata (author not printed)",
    colorHex: "#451A03",
    grade: { group: "II", detail: "Plantation species" },
    sampleNote: "1 tree · FPRDI bulletin pp. 26–27",
    groupingProperties: grouping(
      [60.2, N],
      [9.62, N],
      [27.2, N],
      [6.09, N],
      [9.42, N],
      [0.64, N],
    ),
    additionalProperties: additional(
      [32.2, N],
      [20.2, N],
      [10.18, N],
      [4.3, N],
      [4.52, N],
      [N, N],
    ),
    suitability: GROUP_II_USES,
    research: [],
    dataNotes: [
      BULLETIN_NOTE_GREEN_ONLY,
      "One tree only. Toughness is not printed.",
      ACACIA_NOTE,
    ],
  },
  {
    id: "apitong",
    commonName: "Apitong",
    botanicalName: "Dipterocarpus grandiflorus Blanco",
    colorHex: "#C2410C",
    grade: { group: "III", detail: "Medium strength" },
    sampleNote: "21 trees · FPRDI bulletin pp. 26–27",
    groupingProperties: grouping(
      [64.03, 123.57],
      [13.36, 18.09],
      [31.27, 66.34],
      [4.95, 8.76],
      [8.29, 12.28],
      [0.63, 0.75],
    ),
    additionalProperties: additional(
      [37.31, N],
      [19.56, 38.96],
      [18.14, 23.79],
      [4.09, 7.2],
      [3.99, 8.34],
      [27.39, 34.49],
    ),
    suitability: GROUP_III_USES,
    research: [],
    dataNotes: [
      "12% SPL in bending is left blank: the printed 5.73 is implausible next to the green value 37.31 and is treated as a probable printing error, not corrected.",
      "Group III even though its 12% MOR and MOE are higher than Narra (Group II). FPRDI grouping uses several properties and class limits that are not printed, so never regroup from a single value.",
    ],
  },
  {
    id: "gmelina",
    commonName: "Gmelina (Yemane)",
    botanicalName: "Gmelina arborea R.Br.",
    colorHex: "#CA8A04",
    grade: {
      group: "III",
      detail: "Plantation species (printed as Yemane in the bulletin)",
    },
    sampleNote: "10 trees · FPRDI bulletin pp. 40–41",
    groupingProperties: grouping(
      [47.75, N],
      [6.81, N],
      [24.55, N],
      [6.97, N],
      [8.12, N],
      [0.42, N],
    ),
    additionalProperties: additional(
      [29.8, N],
      [16.5, N],
      [8.23, N],
      [3.79, N],
      [3.71, N],
      [30.65, N],
    ),
    suitability: GROUP_III_USES,
    research: [],
    dataNotes: [
      BULLETIN_NOTE_GREEN_ONLY,
      "Lowest stiffness of the bulletin species listed here (MOE 6.81 GPa), so deflection-controlled members such as long-span beams deserve caution. This is an inference from MOE, not a bulletin statement.",
      "No durability or dimensional-stability data, so exterior use cannot be assessed.",
    ],
  },
  {
    id: "nangka",
    commonName: "Nangka (Jackfruit)",
    botanicalName: "Artocarpus heterophyllus Lamk.",
    colorHex: "#EA580C",
    grade: { group: "III", detail: "Plantation species" },
    sampleNote: "2 trees · FPRDI bulletin pp. 40–41",
    groupingProperties: grouping(
      [62.2, N],
      [8.76, N],
      [29.9, N],
      [4.18, N],
      [7.96, N],
      [0.53, N],
    ),
    additionalProperties: additional(
      [43.4, N],
      [22.0, N],
      [14.4, N],
      [3.26, N],
      [3.59, N],
      [29.2, N],
    ),
    suitability: GROUP_III_USES,
    research: [
      {
        title: "Additional research (not the FPRDI bulletin)",
        source:
          "Marasigan et al. (2024), Journal of Tropical Forest Science 36(1): 91–104",
        entries: [
          {
            heading: "Green · 3 senile trees, Butuan City · ASTM D143",
            values: [
              { label: "MOR", value: "60.68 MPa" },
              { label: "MOE", value: "6.56 GPa" },
              { label: "Compression ∥", value: "21.24 MPa" },
              { label: "SPL bending", value: "19.50 MPa" },
              { label: "Compression ⟂", value: "4.50 MPa" },
              { label: "Hardness side / end", value: "3.51 / 3.93 kN" },
              { label: "Toughness", value: "26.88 J/spec." },
            ],
            note: "The authors class nangka “medium” in this paper. These values come from a different site than the bulletin and are never averaged with it.",
          },
        ],
      },
      {
        title: "Classification study",
        source:
          "Alipon et al. (2022), Philippine Journal of Science 151(1): 341–356",
        entries: [
          {
            heading: "Samples from Bislig, Surigao del Sur · abstract only",
            values: [
              { label: "Relative density", value: "0.49" },
              { label: "Class (authors)", value: "Moderately low" },
            ],
            note: "Only the abstract was retrieved; the full tables were not.",
          },
        ],
      },
    ],
    dataNotes: [
      BULLETIN_NOTE_GREEN_ONLY,
      "Two trees from one site, so the averages are weak evidence.",
      "The class is unstable across sources: Group III in the bulletin, “moderately low” in 2022 and “medium” in 2024. The bulletin group is shown as primary.",
    ],
  },
  {
    id: "white_lauan",
    commonName: "White Lauan",
    botanicalName: "Shorea contorta Vidal",
    colorHex: "#A16207",
    grade: { group: "III", detail: "Medium strength" },
    sampleNote: "20 trees · FPRDI bulletin pp. 32–33",
    groupingProperties: grouping(
      [51.27, 79.99],
      [9.41, 11.77],
      [25.07, 42.06],
      [3.35, 5.13],
      [6.27, 8.06],
      [0.42, 0.45],
    ),
    additionalProperties: additional(
      [31.29, 49.96],
      [16.94, 25.74],
      [12.12, 14.49],
      [2.57, 3.17],
      [2.83, 3.56],
      [34.68, 25.35],
    ),
    suitability: GROUP_III_USES,
    research: [],
    dataNotes: [
      "Complete data for both green and 12% conditions.",
      "Low density and low hardness (2.57–3.56 kN) are relevant to flooring and heavy-contact uses, which are not documented for Group III.",
    ],
  },
  {
    id: "acacia_mangium",
    commonName: "Acacia (A. mangium)",
    botanicalName: "Acacia mangium Willd.",
    colorHex: "#451A03",
    grade: { group: "III", detail: "Plantation species" },
    sampleNote: "1 tree · FPRDI bulletin pp. 38–39",
    groupingProperties: grouping(
      [64.6, N],
      [10.8, N],
      [30.2, N],
      [5.66, N],
      [8.62, N],
      [0.61, N],
    ),
    additionalProperties: additional(
      [39.2, N],
      [23.0, N],
      [11.2, N],
      [5.44, N],
      [4.68, N],
      [N, N],
    ),
    suitability: GROUP_III_USES,
    research: [],
    dataNotes: [
      BULLETIN_NOTE_GREEN_ONLY,
      "One tree only. Toughness is not printed.",
      ACACIA_NOTE,
    ],
  },
  {
    id: "coconut",
    commonName: "Coconut",
    botanicalName: "Cocos nucifera L.",
    colorHex: "#854D0E",
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
      "Values are from 80-year-old Mindanao stems and were split into the three density groups from table text that lost its column breaks.",
    ],
  },
  {
    id: "mango",
    commonName: "Mango",
    botanicalName: "Mangifera indica L.",
    colorHex: "#A16207",
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
              { label: "SPL bending", value: "20.39 MPa" },
              { label: "Compression ⟂", value: "4.81 MPa" },
              { label: "Hardness side / end", value: "4.21 / 3.98 kN" },
              { label: "Toughness", value: "4.02 J/spec." },
            ],
            note: "The authors place Mangifera indica in a “moderately low” class using the FPRDI scheme. This is a research placement, not a bulletin group, and the app has not recalculated it. Documented uses for that class are light: furniture, crates, pallets, carving and drafting boards.",
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
      "Mango is not listed in the FPRDI bulletin (Pahutan, M. altissima, is a different species), so no strength group is available.",
      "Genus-level sources rate machang wood non-durable in exposed or ground contact.",
    ],
  },
];

export const getGrading = (
  id: string | undefined,
): SpeciesGrading | undefined =>
  STRUCTURAL_GRADING.find((item) => item.id === id);
