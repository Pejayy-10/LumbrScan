// LumbrScan Mock API Client Implementation (Consumes mock/apiContract.json & Domain Rules)

import {
  LumbrScanApiClient,
  PredictionPayload,
  PredictionResponse,
  TaskToMaterialResult,
  FprdiGroupCode,
  SeverityLevel,
} from '../types';
import {
  SPECIES_DICTIONARY,
  FPRDI_RATINGS,
  DENR_BADGES,
  DEFECT_INDEX,
  CONSTRUCTION_APPLICATIONS,
} from '../constants/domain';

// Import raw JSON mock contract
import mockContractData from '../mock/apiContract.json';

/**
 * Simulates network latency (400ms to 1000ms) for realistic UX testing
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApiClient: LumbrScanApiClient = {
  predictSpecies: async (payload: PredictionPayload): Promise<PredictionResponse> => {
    // Simulate network delay
    await delay(750);

    // Pick species based on image or payload, default to Apitong or Narra
    const targetSpeciesKey = 'apitong';
    const species = SPECIES_DICTIONARY[targetSpeciesKey];
    const fprdi = FPRDI_RATINGS[species.fprdiGroup];
    const denr = DENR_BADGES[species.denrStatus];

    // Compute condition evaluation based on input flags
    const { conditionAssessment } = payload;
    let downgradeCount = 0;
    const assessedDefects = [];

    if (conditionAssessment.hasDecayOrRot) {
      downgradeCount += 2;
      assessedDefects.push({
        defectType: 'DECAY_ROT' as const,
        label: 'Decay / Fungal Rot Present',
        severity: conditionAssessment.defectSeverity || ('MODERATE' as SeverityLevel),
        strengthDowngradePenalty: 2,
      });
    }

    if (conditionAssessment.hasEndSplitting) {
      downgradeCount += 1;
      assessedDefects.push({
        defectType: 'END_SPLITTING' as const,
        label: 'End Splitting / Cracks',
        severity: conditionAssessment.defectSeverity || ('LOW' as SeverityLevel),
        strengthDowngradePenalty: 1,
      });
    }

    if (conditionAssessment.hasUnsoundKnots) {
      downgradeCount += 1;
      assessedDefects.push({
        defectType: 'UNSOUND_KNOTS' as const,
        label: 'Unsound Loose Knots',
        severity: conditionAssessment.defectSeverity || ('LOW' as SeverityLevel),
        strengthDowngradePenalty: 1,
      });
    }

    // Determine effective FPRDI Group
    const groupOrder: FprdiGroupCode[] = ['GROUP_I', 'GROUP_II', 'GROUP_III', 'GROUP_IV'];
    const originalIndex = groupOrder.indexOf(species.fprdiGroup);
    const effectiveIndex = Math.min(originalIndex + downgradeCount, groupOrder.length - 1);
    const effectiveFprdiGroup: FprdiGroupCode = groupOrder[effectiveIndex];

    const warningSummary =
      downgradeCount > 0
        ? `Physical defects detected. Structural capacity downgraded from ${fprdi.title} to ${FPRDI_RATINGS[effectiveFprdiGroup].title}.`
        : 'Material shows no severe structural defects. Full FPRDI strength rating retained.';

    return {
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      processingTimeMs: 680,
      prediction: {
        primaryMatch: {
          id: species.id,
          commonName: species.commonName,
          botanicalName: species.botanicalName,
          localName: species.localName,
          category: species.category,
          confidenceScore: 0.942,
          grainCharacteristics: species.grainCharacteristics,
          visualTexture: 'COARSE_INTERLOCKED',
        },
        alternativeMatches: [
          {
            id: SPECIES_DICTIONARY.white_lauan.id,
            commonName: SPECIES_DICTIONARY.white_lauan.commonName,
            botanicalName: SPECIES_DICTIONARY.white_lauan.botanicalName,
            confidenceScore: 0.043,
          },
          {
            id: SPECIES_DICTIONARY.ipil.id,
            commonName: SPECIES_DICTIONARY.ipil.commonName,
            botanicalName: SPECIES_DICTIONARY.ipil.botanicalName,
            confidenceScore: 0.012,
          },
        ],
      },
      knowledgeBase: {
        fprdiStrengthGroup: fprdi,
        denrRegulatoryStatus: denr,
        speciesInfo: species,
      },
      conditionEvaluation: {
        assessedDefects,
        originalFprdiGroup: species.fprdiGroup,
        effectiveFprdiGroup,
        conditionWarningSummary: warningSummary,
      },
      twoWayRecommendation: {
        materialToTask: {
          speciesName: `${species.commonName} (${downgradeCount > 0 ? 'Defect Downgraded' : 'Sound Condition'})`,
          permissibleApplications: [
            {
              applicationCode: 'INTERIOR_WALL_STUDS',
              title: 'Interior Light Wall Framing & Drywall Studs',
              safetyRating: 'SAFE',
              rationale: `Sufficient bending capacity for interior non-load bearing wall framing under ${effectiveFprdiGroup} rating.`,
            },
            {
              applicationCode: 'TEMPORARY_FORMWORK',
              title: 'Concrete Formwork & Temporary Bracing',
              safetyRating: 'PERMISSIBLE_WITH_CAUTION',
              rationale: 'Permissible for temporary shuttering; inspect localized rot zones before pouring concrete.',
            },
          ],
          prohibitedApplications: [
            {
              applicationCode: 'HEAVY_STRUCTURAL_BEAM',
              title: 'Heavy Foundation Beams & Bridge Posts',
              safetyRating: 'PROHIBITED_UNSAFE',
              rationale:
                'UNSAFE: High structural compression loads require defect-free Group I timber. Downgraded material risks structural failure.',
            },
            {
              applicationCode: 'ROOF_TRUSS_RAFTER',
              title: 'Primary Roof Trusses & Load-Bearing Rafters',
              safetyRating: 'HIGH_RISK_NOT_RECOMMENDED',
              rationale:
                'HIGH RISK: Roof trusses under tension require sound Group II structural grade without fungal decay.',
            },
          ],
        },
      },
    };
  },

  getRecommendationForTask: async (
    applicationCode: string,
    budgetFilter?: string
  ): Promise<TaskToMaterialResult> => {
    await delay(500);

    const app =
      CONSTRUCTION_APPLICATIONS.find((a) => a.code === applicationCode) ||
      CONSTRUCTION_APPLICATIONS[0];

    return {
      targetApplicationCode: app.code,
      targetApplicationTitle: app.title,
      requiredFprdiGroup: app.minimumFprdiGroup,
      recommendedSpeciesList: [
        {
          rank: 1,
          id: SPECIES_DICTIONARY.molave.id,
          commonName: SPECIES_DICTIONARY.molave.commonName,
          botanicalName: SPECIES_DICTIONARY.molave.botanicalName,
          fprdiGroup: SPECIES_DICTIONARY.molave.fprdiGroup,
          denrStatus: SPECIES_DICTIONARY.molave.denrStatus,
          suitabilityScore: 0.98,
          keyAdvantages:
            'Exceptional durability against ground moisture, soil decay, and severe structural loads.',
          estimatedCostTier: 'HIGH',
        },
        {
          rank: 2,
          id: SPECIES_DICTIONARY.yakal.id,
          commonName: SPECIES_DICTIONARY.yakal.commonName,
          botanicalName: SPECIES_DICTIONARY.yakal.botanicalName,
          fprdiGroup: SPECIES_DICTIONARY.yakal.fprdiGroup,
          denrStatus: SPECIES_DICTIONARY.yakal.denrStatus,
          suitabilityScore: 0.95,
          keyAdvantages:
            'Extreme bending stress tolerance (>85 MPa); premier choice for heavy roof trusses and bridge piles.',
          estimatedCostTier: 'VERY_HIGH',
        },
        {
          rank: 3,
          id: SPECIES_DICTIONARY.apitong.id,
          commonName: SPECIES_DICTIONARY.apitong.commonName,
          botanicalName: SPECIES_DICTIONARY.apitong.botanicalName,
          fprdiGroup: SPECIES_DICTIONARY.apitong.fprdiGroup,
          denrStatus: SPECIES_DICTIONARY.apitong.denrStatus,
          suitabilityScore: 0.88,
          keyAdvantages:
            'Standard commercial structural hardwood with excellent truss tension capacity.',
          estimatedCostTier: 'MEDIUM',
        },
      ],
    };
  },
};
