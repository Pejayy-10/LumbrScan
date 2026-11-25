export const OFFLINE_SPECIES_IDS = ['coconut', 'gmelina', 'mango'] as const;

export type OfflineSpeciesId = (typeof OFFLINE_SPECIES_IDS)[number];

export interface OfflineSpeciesRanking {
  speciesId: OfflineSpeciesId;
  confidence: number;
}

export interface OfflineSpeciesPrediction {
  status: 'accepted' | 'retake_required';
  predictedSpeciesId: OfflineSpeciesId;
  confidence: number;
  ranking: OfflineSpeciesRanking[];
  threshold: number;
  processingTimeMs: number;
  modelId: 'paired_fusion_prototype_2026_11_25';
}

export interface OfflineScanLog {
  id: string;
  timestamp: string;
  imageUri: string;
  speciesId: OfflineSpeciesId;
  confidence: number;
  processingTimeMs: number;
}
