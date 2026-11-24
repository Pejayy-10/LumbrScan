import { OfflineSpeciesPrediction } from '../types/offlineInference';

export const offlineSpeciesClassifier = {
  classify: async (_imageUri: string): Promise<OfflineSpeciesPrediction> => {
    throw new Error(
      'Browser preview is for interface review only. Run the offline model in the Android development build.'
    );
  },
};
