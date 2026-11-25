import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';
import * as ort from 'onnxruntime-react-native';
import {
  OFFLINE_SPECIES_IDS,
  OfflineSpeciesPrediction,
  OfflineSpeciesRanking,
} from '../types/offlineInference';

const MODEL_SOURCE = require('../assets/models/paired_fusion_prototype_2026_11_25.onnx') as number;
const MODEL_DATA_SOURCE = require('../assets/models/paired_fusion_prototype_2026_11_25.onnx.data') as number;
const MODEL_FILE_NAME = 'paired_fusion_prototype_2026_11_25.onnx';
const IMAGE_SIZE = 224;
const MINIMUM_CONFIDENCE = 0.9;
const IMAGENET_MEAN = [0.485, 0.456, 0.406] as const;
const IMAGENET_STD = [0.229, 0.224, 0.225] as const;

let sessionPromise: Promise<ort.InferenceSession> | null = null;

const softmax = (logits: Float32Array): number[] => {
  const largest = Math.max(...logits);
  const exponentials = Array.from(logits, (value) => Math.exp(value - largest));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
};

const loadSession = async (): Promise<ort.InferenceSession> => {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      const asset = Asset.fromModule(MODEL_SOURCE);
      const externalDataAsset = Asset.fromModule(MODEL_DATA_SOURCE);
      await Promise.all([asset.downloadAsync(), externalDataAsset.downloadAsync()]);
      if (!asset.localUri || !externalDataAsset.localUri) {
        throw new Error('The bundled LumbrScan model could not be loaded from the app assets.');
      }

      // This ONNX export stores weights in a companion `.onnx.data` file.
      // ONNX Runtime resolves it by its original filename, so place both
      // bundled files under stable matching names instead of relying on Expo's
      // hashed asset-cache paths.
      const deployedModel = new File(Paths.document, MODEL_FILE_NAME);
      const deployedExternalData = new File(Paths.document, `${MODEL_FILE_NAME}.data`);
      if (!deployedModel.exists) {
        new File(asset.localUri).copy(deployedModel);
      }
      if (!deployedExternalData.exists) {
        new File(externalDataAsset.localUri).copy(deployedExternalData);
      }
      if (!deployedModel.exists || !deployedExternalData.exists) {
        throw new Error('The offline model files could not be prepared on this device.');
      }
      return ort.InferenceSession.create(deployedModel.uri, {
        executionProviders: ['cpu'],
        graphOptimizationLevel: 'all',
      });
    })().catch((error: unknown) => {
      sessionPromise = null;
      throw error;
    });
  }
  return sessionPromise;
};

const createInputTensor = async (imageUri: string): Promise<ort.Tensor> => {
  const resized = await manipulateAsync(
    imageUri,
    [{ resize: { width: IMAGE_SIZE, height: IMAGE_SIZE } }],
    { compress: 1, format: SaveFormat.JPEG }
  );
  const imageBytes = new Uint8Array(await new File(resized.uri).arrayBuffer());
  const decoded = jpeg.decode(imageBytes, { useTArray: true, formatAsRGBA: true });
  if (decoded.width !== IMAGE_SIZE || decoded.height !== IMAGE_SIZE) {
    throw new Error('The captured image could not be prepared at 224 × 224 pixels.');
  }

  const pixelCount = IMAGE_SIZE * IMAGE_SIZE;
  const tensorData = new Float32Array(3 * pixelCount);
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const rgbaOffset = pixel * 4;
    for (let channel = 0; channel < 3; channel += 1) {
      const normalized = decoded.data[rgbaOffset + channel] / 255;
      tensorData[channel * pixelCount + pixel] =
        (normalized - IMAGENET_MEAN[channel]) / IMAGENET_STD[channel];
    }
  }
  return new ort.Tensor('float32', tensorData, [1, 3, IMAGE_SIZE, IMAGE_SIZE]);
};

export const offlineSpeciesClassifier = {
  classify: async (crossSectionUri: string, woodGrainUri: string): Promise<OfflineSpeciesPrediction> => {
    const startedAt = Date.now();
    const [session, crossSection, woodGrain] = await Promise.all([loadSession(), createInputTensor(crossSectionUri), createInputTensor(woodGrainUri)]);
    const outputs = await session.run({ cross_section: crossSection, wood_grain: woodGrain });
    const logits = outputs.species?.data;
    if (!(logits instanceof Float32Array) || logits.length !== OFFLINE_SPECIES_IDS.length) {
      throw new Error('The on-device model returned an unexpected species output.');
    }

    const ranking: OfflineSpeciesRanking[] = softmax(logits)
      .map((confidence, index) => ({ speciesId: OFFLINE_SPECIES_IDS[index], confidence }))
      .sort((left, right) => right.confidence - left.confidence);
    const primary = ranking[0];
    return {
      status: primary.confidence >= MINIMUM_CONFIDENCE ? 'accepted' : 'retake_required',
      predictedSpeciesId: primary.speciesId,
      confidence: primary.confidence,
      ranking,
      threshold: MINIMUM_CONFIDENCE,
      processingTimeMs: Date.now() - startedAt,
      modelId: 'paired_fusion_prototype_2026_11_25',
    };
  },
};
