import { SupportedSpeciesId } from './supportedSpecies';

// These are documented historical uses, not board-level engineering approvals.
export const REFERENCE_USES = [
  { id: 'furniture', label: 'Furniture' },
  { id: 'interior', label: 'Interior building uses' },
  { id: 'packaging', label: 'Boxes and packaging' },
] as const;

export type ReferenceUseId = (typeof REFERENCE_USES)[number]['id'];
export type UseReference = {
  speciesId: SupportedSpeciesId;
  useId: ReferenceUseId;
  detail: string;
  source: string;
  url: string;
};

export const USE_REFERENCES: readonly UseReference[] = [
  { speciesId: 'coconut', useId: 'furniture', detail: 'FAO describes coconut wood used for furniture. The material varies in density within the stem.', source: 'FAO, Coconut wood: uses and markets, section 3', url: 'https://www.fao.org/4/w7731e/w7731e04.htm' },
  { speciesId: 'coconut', useId: 'interior', detail: 'FAO describes interior wall and ceiling lining; use depends on material density and intended application.', source: 'FAO, Coconut wood: uses and markets, section 3', url: 'https://www.fao.org/4/w7731e/w7731e04.htm' },
  { speciesId: 'gmelina', useId: 'furniture', detail: 'FAO lists furniture among the uses of Gmelina arborea timber.', source: 'FAO Ecocrop, Gmelina arborea, Uses', url: 'https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1152' },
  { speciesId: 'gmelina', useId: 'interior', detail: 'FAO lists general carpentry and light construction. This does not establish suitability for a particular structural application.', source: 'FAO Ecocrop, Gmelina arborea, Uses', url: 'https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1152' },
  { speciesId: 'gmelina', useId: 'packaging', detail: 'FAO lists boxes among the uses of Gmelina arborea timber.', source: 'FAO Ecocrop, Gmelina arborea, Uses', url: 'https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1152' },
  { speciesId: 'mango', useId: 'interior', detail: 'PROSEA describes Mangifera indica wood being used for indoor construction; this is not a structural grade.', source: 'PROSEA, Mangifera indica, Uses', url: 'https://prosea.prota4u.org/view.aspx?id=4408' },
];
