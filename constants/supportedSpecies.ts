import { SPECIES_DICTIONARY, TimberSpecies } from './domain';

export const SUPPORTED_SPECIES_IDS = ['coconut', 'gmelina', 'mango'] as const;

export type SupportedSpeciesId = (typeof SUPPORTED_SPECIES_IDS)[number];

export const SUPPORTED_SPECIES: TimberSpecies[] = SUPPORTED_SPECIES_IDS.map(
  (id) => SPECIES_DICTIONARY[id]
);
