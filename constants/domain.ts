// LumbrScan Core Domain Constants & Regulatory Framework Definitions

export type FprdiGroupCode = 'GROUP_I' | 'GROUP_II' | 'GROUP_III' | 'GROUP_IV';

export type DenrStatusCode =
  | 'REGULATED_PERMIT_REQUIRED'
  | 'CRITICALLY_ENDANGERED_PERMIT_REQUIRED'
  | 'PLANTATION_COMMERCIAL_EXEMPT'
  | 'PALM_FRUIT_WOOD_EXEMPT';

export interface TimberSpecies {
  id: string;
  commonName: string;
  botanicalName: string;
  localName: string;
  category: 'NATIVE_REGULATED_HARDWOOD' | 'PLANTATION_PALM_FRUIT_WOOD';
  fprdiGroup: FprdiGroupCode;
  denrStatus: DenrStatusCode;
  grainCharacteristics: string;
  primaryUses: string[];
  colorHex: string;
}

export interface FprdiRating {
  groupCode: FprdiGroupCode;
  title: string;
  loadCapacity: string;
  bendingStressMpa: string;
  elasticityGpa: string;
  badgeColorHex: string;
  description: string;
}

export interface DenrBadge {
  statusCode: DenrStatusCode;
  title: string;
  requiresCuttingPermit: boolean;
  requiresTransportPermit: boolean;
  badgeColorHex: string;
  legalNotice: string;
}

export interface DefectItem {
  type: 'DECAY_ROT' | 'END_SPLITTING' | 'WARPING' | 'UNSOUND_KNOTS' | 'INSECT_BOREHOLES';
  label: string;
  description: string;
  groupDowngradePenalty: number; // Penalty applied to FPRDI Group (e.g. -1 or -2)
}

export interface ConstructionApplication {
  code: string;
  title: string;
  category: 'HEAVY_STRUCTURAL' | 'LIGHT_FRAMING' | 'JOINERY_FINISHING' | 'TEMPORARY';
  minimumFprdiGroup: FprdiGroupCode;
  description: string;
}

// -----------------------------------------------------------------------------
// 1. THE 11 TARGET TIMBER SPECIES DICTIONARY
// -----------------------------------------------------------------------------
export const SPECIES_DICTIONARY: Record<string, TimberSpecies> = {
  narra: {
    id: 'narra',
    commonName: 'Narra',
    botanicalName: 'Pterocarpus indicus',
    localName: 'Narra / Red Narra',
    category: 'NATIVE_REGULATED_HARDWOOD',
    fprdiGroup: 'GROUP_II',
    denrStatus: 'REGULATED_PERMIT_REQUIRED',
    grainCharacteristics: 'Wavy to interlocked grain; golden brown to deep reddish brown with cedar scent.',
    primaryUses: ['High-end Furniture', 'Interior Doors', 'Flooring', 'Decorative Panelling'],
    colorHex: '#B45309',
  },
  ipil: {
    id: 'ipil',
    commonName: 'Ipil',
    botanicalName: 'Intsia bijuga',
    localName: 'Ipil / Kwila',
    category: 'NATIVE_REGULATED_HARDWOOD',
    fprdiGroup: 'GROUP_II',
    denrStatus: 'REGULATED_PERMIT_REQUIRED',
    grainCharacteristics: 'Interlocked grain; dark reddish-brown with yellow sulfur-like pore flecks.',
    primaryUses: ['Heavy Post Construction', 'Bridge Timbers', 'Outdoor Decking', 'Door Jambs'],
    colorHex: '#991B1B',
  },
  molave: {
    id: 'molave',
    commonName: 'Molave',
    botanicalName: 'Vitex parviflora',
    localName: 'Molave / Molawin',
    category: 'NATIVE_REGULATED_HARDWOOD',
    fprdiGroup: 'GROUP_I',
    denrStatus: 'CRITICALLY_ENDANGERED_PERMIT_REQUIRED',
    grainCharacteristics: 'Fine texture, wavy grain; pale yellow turning greenish with water treatment.',
    primaryUses: ['Railroad Ties', 'Bridge Piles', 'Foundation Posts', 'High-Exposure Structures'],
    colorHex: '#D97706',
  },
  apitong: {
    id: 'apitong',
    commonName: 'Apitong',
    botanicalName: 'Dipterocarpus grandiflorus',
    localName: 'Apitong',
    category: 'NATIVE_REGULATED_HARDWOOD',
    fprdiGroup: 'GROUP_II',
    denrStatus: 'REGULATED_PERMIT_REQUIRED',
    grainCharacteristics: 'Straight to coarse interlocked grain; reddish-brown; exudating resin pores.',
    primaryUses: ['Roof Trusses', 'Load-Bearing Rafters', 'Floor Joists', 'Truck Flooring'],
    colorHex: '#C2410C',
  },
  white_lauan: {
    id: 'white_lauan',
    commonName: 'White Lauan',
    botanicalName: 'Shorea contorta',
    localName: 'White Lauan / Philippine Mahogany',
    category: 'NATIVE_REGULATED_HARDWOOD',
    fprdiGroup: 'GROUP_III',
    denrStatus: 'REGULATED_PERMIT_REQUIRED',
    grainCharacteristics: 'Interlocked grain, coarse texture; light grayish-brown to pale pink tint.',
    primaryUses: ['Concrete Formwork', 'Plywood Veneer', 'Interior Framing', 'Cabinet Core'],
    colorHex: '#A16207',
  },
  yakal: {
    id: 'yakal',
    commonName: 'Yakal',
    botanicalName: 'Shorea astylosa',
    localName: 'Yakal',
    category: 'NATIVE_REGULATED_HARDWOOD',
    fprdiGroup: 'GROUP_I',
    denrStatus: 'CRITICALLY_ENDANGERED_PERMIT_REQUIRED',
    grainCharacteristics: 'Fine interlocked grain; golden brown darkening to dark brown; dense and resinous.',
    primaryUses: ['Heavy Structural Beams', 'Wharf Timbers', 'Heavy Duty Roof Trusses'],
    colorHex: '#78350F',
  },
  gmelina: {
    id: 'gmelina',
    commonName: 'Gmelina',
    botanicalName: 'Gmelina arborea',
    localName: 'Yemane / Gmelina',
    category: 'PLANTATION_PALM_FRUIT_WOOD',
    fprdiGroup: 'GROUP_III',
    denrStatus: 'PLANTATION_COMMERCIAL_EXEMPT',
    grainCharacteristics: 'Straight to wavy grain; creamy white to straw yellow.',
    primaryUses: ['Light Carpentry', 'Pallets', 'Ceiling Joists', 'Interior Core Wood'],
    colorHex: '#CA8A04',
  },
  coconut: {
    id: 'coconut',
    commonName: 'Coconut (Coco Lumber)',
    botanicalName: 'Cocos nucifera',
    localName: 'Coco Lumber',
    category: 'PLANTATION_PALM_FRUIT_WOOD',
    fprdiGroup: 'GROUP_IV',
    denrStatus: 'PALM_FRUIT_WOOD_EXEMPT',
    grainCharacteristics: 'Fibrous vascular bundles; dark spots in light shell background.',
    primaryUses: ['Temporary Scaffolding', 'Low-Cost Housing Studs', 'Formwork Bracing'],
    colorHex: '#854D0E',
  },
  acacia: {
    id: 'acacia',
    commonName: 'Acacia',
    botanicalName: 'Samanea saman',
    localName: 'Monkeypod / Rain Tree',
    category: 'PLANTATION_PALM_FRUIT_WOOD',
    fprdiGroup: 'GROUP_III',
    denrStatus: 'PLANTATION_COMMERCIAL_EXEMPT',
    grainCharacteristics: 'Wild figure grain; dark espresso brown heartwood with golden sapwood.',
    primaryUses: ['Live-Edge Tables', 'Decorative Panelling', 'Craft Carvings'],
    colorHex: '#451A03',
  },
  mango: {
    id: 'mango',
    commonName: 'Mango Wood',
    botanicalName: 'Mangifera indica',
    localName: 'Manga',
    category: 'PLANTATION_PALM_FRUIT_WOOD',
    fprdiGroup: 'GROUP_IV',
    denrStatus: 'PALM_FRUIT_WOOD_EXEMPT',
    grainCharacteristics: 'Coarse interlocked grain; golden brown with spalted line streaks.',
    primaryUses: ['Indoor Decorative Furniture', 'Trays & Bowls', 'Accent Panels'],
    colorHex: '#A16207',
  },
  nangka: {
    id: 'nangka',
    commonName: 'Nangka',
    botanicalName: 'Artocarpus heterophyllus',
    localName: 'Jackfruit Wood',
    category: 'PLANTATION_PALM_FRUIT_WOOD',
    fprdiGroup: 'GROUP_III',
    denrStatus: 'PALM_FRUIT_WOOD_EXEMPT',
    grainCharacteristics: 'Bright golden yellow turning deep orange brown upon aging.',
    primaryUses: ['Traditional Musical Instruments', 'Specialty Furniture', 'Interior Trim'],
    colorHex: '#EA580C',
  },
};

// -----------------------------------------------------------------------------
// 2. FPRDI STRENGTH GROUPINGS
// -----------------------------------------------------------------------------
export const FPRDI_RATINGS: Record<FprdiGroupCode, FprdiRating> = {
  GROUP_I: {
    groupCode: 'GROUP_I',
    title: 'Group I (Very High Strength)',
    loadCapacity: 'Extreme Load (>80 MPa)',
    bendingStressMpa: '> 85.0 MPa',
    elasticityGpa: '> 13.5 GPa',
    badgeColorHex: '#059669',
    description: 'Premier structural grade timber suitable for heavy posts, bridge piles, and railway sleepers.',
  },
  GROUP_II: {
    groupCode: 'GROUP_II',
    title: 'Group II (High Strength)',
    loadCapacity: 'High Load (60-80 MPa)',
    bendingStressMpa: '65.0 - 85.0 MPa',
    elasticityGpa: '11.0 - 13.5 GPa',
    badgeColorHex: '#0284C7',
    description: 'High-strength structural timber ideal for roof trusses, rafters, joists, and door jambs.',
  },
  GROUP_III: {
    groupCode: 'GROUP_III',
    title: 'Group III (Medium Strength)',
    loadCapacity: 'Medium Load (40-60 MPa)',
    bendingStressMpa: '45.0 - 65.0 MPa',
    elasticityGpa: '8.5 - 11.0 GPa',
    badgeColorHex: '#D97706',
    description: 'Medium structural grade suitable for light wall studs, ceiling joists, and concrete formwork.',
  },
  GROUP_IV: {
    groupCode: 'GROUP_IV',
    title: 'Group IV (Low Strength)',
    loadCapacity: 'Low Load (<40 MPa)',
    bendingStressMpa: '< 45.0 MPa',
    elasticityGpa: '< 8.5 GPa',
    badgeColorHex: '#DC2626',
    description: 'Non-structural or light utility wood reserved for scaffolding, temporary bracing, or trim.',
  },
};

// -----------------------------------------------------------------------------
// 3. DENR DAO 2026-20 REGULATORY STATUS BADGES
// -----------------------------------------------------------------------------
export const DENR_BADGES: Record<DenrStatusCode, DenrBadge> = {
  REGULATED_PERMIT_REQUIRED: {
    statusCode: 'REGULATED_PERMIT_REQUIRED',
    title: 'NATIVE REGULATED - PERMIT REQUIRED',
    requiresCuttingPermit: true,
    requiresTransportPermit: true,
    badgeColorHex: '#DC2626',
    legalNotice:
      'Mandatory DENR Tree Cutting Permit, CTO (Certificate of Timber Origin), and Transport Clearance required under PD 705.',
  },
  CRITICALLY_ENDANGERED_PERMIT_REQUIRED: {
    statusCode: 'CRITICALLY_ENDANGERED_PERMIT_REQUIRED',
    title: 'CRITICALLY ENDANGERED - SPECIAL PERMIT',
    requiresCuttingPermit: true,
    requiresTransportPermit: true,
    badgeColorHex: '#991B1B',
    legalNotice:
      'Restricted species. Requires special DENR Central Office Clearance and authenticated CTO. Illegal transport is a criminal offense under PD 705.',
  },
  PLANTATION_COMMERCIAL_EXEMPT: {
    statusCode: 'PLANTATION_COMMERCIAL_EXEMPT',
    title: 'PLANTATION SPECIES - EXEMPT FROM CUTTING RESTRICTIONS',
    requiresCuttingPermit: false,
    requiresTransportPermit: true,
    badgeColorHex: '#059669',
    legalNotice:
      'Commercial plantation timber. Exempt from native cutting bans; requires Certificate of Log Origin (CLO) for transport.',
  },
  PALM_FRUIT_WOOD_EXEMPT: {
    statusCode: 'PALM_FRUIT_WOOD_EXEMPT',
    title: 'FRUIT WOOD / PALM - EXEMPT FROM DENR FORESTRY DAO',
    requiresCuttingPermit: false,
    requiresTransportPermit: false,
    badgeColorHex: '#CA8A04',
    legalNotice:
      'Agricultural fruit wood or palm stem. Coconut lumber harvesting governed by Philippine Coconut Authority (PCA) permit regulations.',
  },
};

// -----------------------------------------------------------------------------
// 4. PHYSICAL CONDITION DEFECT INDEX
// -----------------------------------------------------------------------------
export const DEFECT_INDEX: DefectItem[] = [
  {
    type: 'DECAY_ROT',
    label: 'Decay / Fungal Rot',
    description: 'Fungal degradation softening wood fibers and reducing shear strength.',
    groupDowngradePenalty: 2,
  },
  {
    type: 'END_SPLITTING',
    label: 'End Splitting / Longitudinal Cracks',
    description: 'Separation of wood fibers along grain ends caused by rapid moisture loss.',
    groupDowngradePenalty: 1,
  },
  {
    type: 'WARPING',
    label: 'Warping / Bowing / Cupping',
    description: 'Dimensional distortion hindering flush alignment in door jambs and panelling.',
    groupDowngradePenalty: 1,
  },
  {
    type: 'UNSOUND_KNOTS',
    label: 'Unsound Loose Knots',
    description: 'Decayed or missing knot holes compromising tension load capacity.',
    groupDowngradePenalty: 1,
  },
  {
    type: 'INSECT_BOREHOLES',
    label: 'Insect Boreholes (Termites / Beetles)',
    description: 'Internal galleries created by wood-boring insects requiring chemical treatment.',
    groupDowngradePenalty: 1,
  },
];

// -----------------------------------------------------------------------------
// 5. CONSTRUCTION APPLICATIONS FOR RECOVERY MATRIX
// -----------------------------------------------------------------------------
export const CONSTRUCTION_APPLICATIONS: ConstructionApplication[] = [
  {
    code: 'HEAVY_STRUCTURAL_BEAM',
    title: 'Heavy Structural Beams & Foundation Posts',
    category: 'HEAVY_STRUCTURAL',
    minimumFprdiGroup: 'GROUP_I',
    description: 'High-bending & compression load members for building foundations, posts, and bridge piles.',
  },
  {
    code: 'ROOF_TRUSS_RAFTER',
    title: 'Roof Trusses & Primary Load Rafters',
    category: 'HEAVY_STRUCTURAL',
    minimumFprdiGroup: 'GROUP_II',
    description: 'Load-bearing roof framing members resisting wind shear and roof tile dead loads.',
  },
  {
    code: 'DOOR_WINDOW_JAMB',
    title: 'Exterior Door & Window Jambs',
    category: 'JOINERY_FINISHING',
    minimumFprdiGroup: 'GROUP_II',
    description: 'Precision joinery requiring high dimensional stability and weather durability.',
  },
  {
    code: 'INTERIOR_WALL_STUDS',
    title: 'Interior Wall Studs & Ceiling Joists',
    category: 'LIGHT_FRAMING',
    minimumFprdiGroup: 'GROUP_III',
    description: 'Light non-load bearing wall framing, drywall studs, and ceiling purlins.',
  },
  {
    code: 'TEMPORARY_FORMWORK',
    title: 'Concrete Formwork & Temporary Scaffolding',
    category: 'TEMPORARY',
    minimumFprdiGroup: 'GROUP_IV',
    description: 'Temporary shuttering, concrete molds, and non-permanent scaffold staging.',
  },
];
