// LumbrScan Core Domain Constants & Regulatory Framework Definitions

export type FprdiGroupCode = 'GROUP_I' | 'GROUP_II' | 'GROUP_III' | 'GROUP_IV';

export type DenrStatusCode =
  | 'REGULATED_PERMIT_REQUIRED'
  | 'CRITICALLY_ENDANGERED_PERMIT_REQUIRED'
  | 'PLANTATION_COMMERCIAL_EXEMPT'
  | 'PALM_FRUIT_WOOD_EXEMPT';

export interface MechanicalProperties {
  staticBendingMpa: string;
  compressionParallelMpa: string;
  hardnessKn: string;
}

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
  permissibleCraftedProducts: string[];
  pricePerBoardFootPhp: {
    min: number;
    max: number;
    priceTier: 'ECONOMY' | 'MID_RANGE' | 'PREMIUM' | 'LUXURY';
  };
  basicRelativeDensity: string;
  mechanicalProperties: MechanicalProperties;
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
  groupDowngradePenalty: number;
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
    permissibleCraftedProducts: [
      'Executive Solid Doors & Frames',
      'Handcrafted Dining Tables',
      'Parquet & Strip Flooring',
      'Architectural Wall Veneers',
      'Custom Cabinetry & Wardrobes',
    ],
    pricePerBoardFootPhp: { min: 220, max: 320, priceTier: 'PREMIUM' },
    basicRelativeDensity: '0.52 - 0.68',
    mechanicalProperties: {
      staticBendingMpa: '78.5 MPa',
      compressionParallelMpa: '44.2 MPa',
      hardnessKn: '5.8 kN',
    },
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
    permissibleCraftedProducts: [
      'Heavy Load Posts & Beams',
      'Outdoor Deck Planks & Joists',
      'Exterior Door Jambs',
      'Wharf & Pier Decking',
      'Heavy Stair Treads',
    ],
    pricePerBoardFootPhp: { min: 200, max: 280, priceTier: 'PREMIUM' },
    basicRelativeDensity: '0.65 - 0.78',
    mechanicalProperties: {
      staticBendingMpa: '82.1 MPa',
      compressionParallelMpa: '48.6 MPa',
      hardnessKn: '6.4 kN',
    },
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
    permissibleCraftedProducts: [
      'Foundation Piles & Water Posts',
      'Railroad Sleepers',
      'Heavy Structural Framing',
      'High-Durability Sculptures',
      'Shipbuilding Frames',
    ],
    pricePerBoardFootPhp: { min: 350, max: 500, priceTier: 'LUXURY' },
    basicRelativeDensity: '0.75 - 0.88',
    mechanicalProperties: {
      staticBendingMpa: '92.4 MPa',
      compressionParallelMpa: '54.1 MPa',
      hardnessKn: '7.8 kN',
    },
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
    permissibleCraftedProducts: [
      'Heavy Roof Trusses & Rafters',
      'Commercial Floor Joists',
      'Flatbed Truck & Wagon Flooring',
      'Structural Purlins',
      'Scaffold Staging Beams',
    ],
    pricePerBoardFootPhp: { min: 130, max: 180, priceTier: 'MID_RANGE' },
    basicRelativeDensity: '0.58 - 0.72',
    mechanicalProperties: {
      staticBendingMpa: '74.0 MPa',
      compressionParallelMpa: '42.8 MPa',
      hardnessKn: '5.1 kN',
    },
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
    permissibleCraftedProducts: [
      'Commercial Construction Plywood',
      'Concrete Formwork Shuttering',
      'Interior Wall Studs',
      'Cabinet Shell Core Wood',
      'Drawer Sides & Backs',
    ],
    pricePerBoardFootPhp: { min: 85, max: 120, priceTier: 'MID_RANGE' },
    basicRelativeDensity: '0.45 - 0.56',
    mechanicalProperties: {
      staticBendingMpa: '58.2 MPa',
      compressionParallelMpa: '33.4 MPa',
      hardnessKn: '3.9 kN',
    },
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
    permissibleCraftedProducts: [
      'Primary Structural Roof Trusses',
      'Wharf & Dock Foundation Beams',
      'Heavy Industrial Flooring',
      'High-Load Bridge Rafters',
      'Heavy Column Posts',
    ],
    pricePerBoardFootPhp: { min: 300, max: 450, priceTier: 'LUXURY' },
    basicRelativeDensity: '0.80 - 0.95',
    mechanicalProperties: {
      staticBendingMpa: '98.0 MPa',
      compressionParallelMpa: '57.8 MPa',
      hardnessKn: '8.4 kN',
    },
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
    permissibleCraftedProducts: [
      'Shipping Pallets & Crate Boxes',
      'Light Ceiling Joists & Purlins',
      'Furniture Core Blocks',
      'Pulp & Utility Boards',
      'Interior Partition Framing',
    ],
    pricePerBoardFootPhp: { min: 45, max: 70, priceTier: 'ECONOMY' },
    basicRelativeDensity: '0.40 - 0.50',
    mechanicalProperties: {
      staticBendingMpa: '52.0 MPa',
      compressionParallelMpa: '29.5 MPa',
      hardnessKn: '3.2 kN',
    },
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
    permissibleCraftedProducts: [
      'Temporary Construction Scaffolding',
      'Concrete Formwork Bracing',
      'Low-Cost Housing Wall Studs',
      'Perimeter Fence Stakes',
      'Temporary Site Shed Framing',
    ],
    pricePerBoardFootPhp: { min: 25, max: 40, priceTier: 'ECONOMY' },
    basicRelativeDensity: '0.30 - 0.45',
    mechanicalProperties: {
      staticBendingMpa: '38.0 MPa',
      compressionParallelMpa: '21.0 MPa',
      hardnessKn: '2.5 kN',
    },
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
    permissibleCraftedProducts: [
      'Live-Edge Dining Slab Tables',
      'Hand-Carved Wooden Bowls',
      'Accent Wall Panelling',
      'Bespoke Coffee Tables',
      'Decorative Cutting Boards',
    ],
    pricePerBoardFootPhp: { min: 110, max: 170, priceTier: 'MID_RANGE' },
    basicRelativeDensity: '0.48 - 0.60',
    mechanicalProperties: {
      staticBendingMpa: '61.5 MPa',
      compressionParallelMpa: '35.0 MPa',
      hardnessKn: '4.2 kN',
    },
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
    permissibleCraftedProducts: [
      'Spalted Decorative Serving Trays',
      'Rustic Bookshelves & Credenzas',
      'Indoor Accent Side Tables',
      'Ornamental Wall Art Planks',
      'Novelty Turnery Items',
    ],
    pricePerBoardFootPhp: { min: 40, max: 65, priceTier: 'ECONOMY' },
    basicRelativeDensity: '0.42 - 0.52',
    mechanicalProperties: {
      staticBendingMpa: '42.0 MPa',
      compressionParallelMpa: '24.5 MPa',
      hardnessKn: '3.0 kN',
    },
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
    permissibleCraftedProducts: [
      'Filipino Kutiyapi & Guitar Bodies',
      'Golden Accent Cabinetry',
      'Traditional Marquetry',
      'High-Vibrancy Interior Moldings',
      'Custom Wood Turning',
    ],
    pricePerBoardFootPhp: { min: 90, max: 140, priceTier: 'MID_RANGE' },
    basicRelativeDensity: '0.50 - 0.62',
    mechanicalProperties: {
      staticBendingMpa: '64.0 MPa',
      compressionParallelMpa: '36.8 MPa',
      hardnessKn: '4.5 kN',
    },
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
// 4. PHYSICAL CONDITION DEFECT INDEX & REMEDIATION
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

export const DEFECT_REMEDIATION_GUIDE: Record<string, string[]> = {
  DECAY_ROT: [
    'Chisel out localized surface decay back to sound, healthy wood fiber.',
    'Apply boron-based wood fungicide or glycol preservatives to neutralize active spores.',
    'Fill voids with two-part structural epoxy compound before non-critical installation.',
  ],
  END_SPLITTING: [
    'Apply high-penetration epoxy or polyurethane wood filler along end split lines.',
    'Seal log/lumber cut ends with paraffin wax or acrylic end-grain sealer.',
    'Install corrugated metal fasteners or S-dogs across splits to prevent propagation.',
  ],
  WARPING: [
    'Perform controlled steam heating or kiln re-drying under flat mechanical weights.',
    'Rip warped planks into narrow strips and re-glue (edge-gluing) to balance grain stresses.',
    'Use only in non-load bearing interior framing where mechanical fasteners hold alignment.',
  ],
  UNSOUND_KNOTS: [
    'Bore out loose knot core using a Forstner bit.',
    'Glue matching solid wood plug or epoxy dowel flush with the surface.',
    'Sand flush and coat with knotting sealer to prevent resin bleeding through paint.',
  ],
  INSECT_BOREHOLES: [
    'Inject permethrin or bifenthrin insecticidal solvent directly into borehole entries.',
    'Expose timber to heat treatment (56°C core temperature for 30 mins) to eradicate larvae.',
    'Pack galleries with epoxy filler and seal surfaces with clear polyurethane.',
  ],
};

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
