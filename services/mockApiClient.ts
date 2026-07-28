// LumbrScan Mock API Client Implementation (Consumes mock/apiContract.json & Domain Rules)

import {
  LumbrScanApiClient,
  PredictionPayload,
  PredictionResponse,
  TaskToMaterialResult,
  EstimatorRequestPayload,
  EstimatorResponsePayload,
  FprdiGroupCode,
  SeverityLevel,
  AutomatedDefectItem,
} from '../types';
import {
  SPECIES_DICTIONARY,
  FPRDI_RATINGS,
  DENR_BADGES,
  CONSTRUCTION_APPLICATIONS,
  DEFECT_REMEDIATION_GUIDE,
} from '../constants/domain';

/**
 * Simulates network latency (400ms to 900ms) for realistic UX testing
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApiClient: LumbrScanApiClient = {
  predictSpecies: async (payload: PredictionPayload): Promise<PredictionResponse> => {
    await delay(750);

    const targetSpeciesKey = 'apitong';
    const species = SPECIES_DICTIONARY[targetSpeciesKey];
    const fprdi = FPRDI_RATINGS[species.fprdiGroup];
    const denr = DENR_BADGES[species.denrStatus];

    // Compute or parse condition evaluation
    const conditionAssessment = payload.conditionAssessment || {
      hasDecayOrRot: false,
      hasEndSplitting: true,
      hasWarping: false,
      hasUnsoundKnots: false,
      hasInsectBoreholes: false,
      defectSeverity: 'LOW' as SeverityLevel,
    };

    let downgradeCount = 0;
    const detectedDefects: AutomatedDefectItem[] = [];
    const remediationRecommendations: string[] = [];

    if (conditionAssessment.hasDecayOrRot) {
      downgradeCount += 2;
      detectedDefects.push({
        defectType: 'DECAY_ROT',
        label: 'Decay / Fungal Rot',
        severity: conditionAssessment.defectSeverity || 'MODERATE',
        confidenceScore: 0.89,
        penaltyPoints: 2,
      });
      remediationRecommendations.push(...DEFECT_REMEDIATION_GUIDE.DECAY_ROT);
    }

    if (conditionAssessment.hasEndSplitting) {
      downgradeCount += 1;
      detectedDefects.push({
        defectType: 'END_SPLITTING',
        label: 'End Splitting / Cracks',
        severity: conditionAssessment.defectSeverity || 'LOW',
        confidenceScore: 0.94,
        penaltyPoints: 1,
      });
      remediationRecommendations.push(...DEFECT_REMEDIATION_GUIDE.END_SPLITTING);
    }

    if (conditionAssessment.hasUnsoundKnots) {
      downgradeCount += 1;
      detectedDefects.push({
        defectType: 'UNSOUND_KNOTS',
        label: 'Unsound Loose Knots',
        severity: conditionAssessment.defectSeverity || 'LOW',
        confidenceScore: 0.82,
        penaltyPoints: 1,
      });
      remediationRecommendations.push(...DEFECT_REMEDIATION_GUIDE.UNSOUND_KNOTS);
    }

    // Determine effective FPRDI Group
    const groupOrder: FprdiGroupCode[] = ['GROUP_I', 'GROUP_II', 'GROUP_III', 'GROUP_IV'];
    const originalIndex = groupOrder.indexOf(species.fprdiGroup);
    const effectiveIndex = Math.min(originalIndex + downgradeCount, groupOrder.length - 1);
    const effectiveFprdiGroup: FprdiGroupCode = groupOrder[effectiveIndex];

    const hasSevereDefects = conditionAssessment.defectSeverity === 'SEVERE' || downgradeCount >= 2;
    const isSafe = !hasSevereDefects;

    const severeDefectFallback = hasSevereDefects
      ? {
          warningBadgeTitle: 'UNSAFE FOR STRUCTURAL USE' as const,
          warningMessage:
            'Critical defect penalty reduces load capacity below structural safety limits for heavy beams or roof trusses.',
          suggestedAlternativeSpecies: [
            {
              id: SPECIES_DICTIONARY.molave.id,
              commonName: SPECIES_DICTIONARY.molave.commonName,
              botanicalName: SPECIES_DICTIONARY.molave.botanicalName,
              fprdiGroup: SPECIES_DICTIONARY.molave.fprdiGroup,
              reason: 'Group I sound timber with superior bending and decay resistance.',
            },
            {
              id: SPECIES_DICTIONARY.yakal.id,
              commonName: SPECIES_DICTIONARY.yakal.commonName,
              botanicalName: SPECIES_DICTIONARY.yakal.botanicalName,
              fprdiGroup: SPECIES_DICTIONARY.yakal.fprdiGroup,
              reason: 'Group I resinous structural hardwood capable of enduring extreme loads.',
            },
          ],
        }
      : null;

    const warningSummary =
      downgradeCount > 0
        ? `Defects auto-detected. Capacity downgraded from ${fprdi.title} to ${FPRDI_RATINGS[effectiveFprdiGroup].title}.`
        : 'No structural defects detected. Full FPRDI strength rating retained.';

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
      automatedDefectDetection: {
        hasDefects: detectedDefects.length > 0,
        overallSeverity: conditionAssessment.defectSeverity || (detectedDefects.length > 0 ? 'LOW' : 'NONE'),
        detectedDefects,
        remediationRecommendations: Array.from(new Set(remediationRecommendations)),
      },
      structuralAssessment: {
        nominalFprdiGroup: species.fprdiGroup,
        effectiveFprdiGroup,
        totalPenaltyPoints: downgradeCount,
        safetyRating: isSafe ? 'SAFE' : 'PROHIBITED_UNSAFE',
        isSafeForIntendedUse: isSafe,
        severeDefectFallback,
      },
      conditionEvaluation: {
        assessedDefects: detectedDefects.map((d) => ({
          defectType: d.defectType,
          label: d.label,
          severity: d.severity,
          strengthDowngradePenalty: d.penaltyPoints,
        })),
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
              rationale: `Sufficient bending capacity for interior framing under ${effectiveFprdiGroup} rating.`,
            },
            {
              applicationCode: 'TEMPORARY_FORMWORK',
              title: 'Concrete Formwork & Temporary Bracing',
              safetyRating: 'PERMISSIBLE_WITH_CAUTION',
              rationale: 'Permissible for temporary shuttering; inspect localized defect zones prior to load.',
            },
          ],
          prohibitedApplications: [
            {
              applicationCode: 'HEAVY_STRUCTURAL_BEAM',
              title: 'Heavy Foundation Beams & Bridge Posts',
              safetyRating: isSafe ? 'SAFE' : 'PROHIBITED_UNSAFE',
              rationale: isSafe
                ? 'High compression load capacity suitable for structural beams.'
                : 'UNSAFE: Defect penalty reduces shear resistance below safety limits for heavy structural loads.',
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

  calculateBudgetEstimate: async (
    payload: EstimatorRequestPayload
  ): Promise<EstimatorResponsePayload> => {
    await delay(600);

    const { constructionTask, estimatedBoardFeet, maxBudgetPhp } = payload;
    const app =
      CONSTRUCTION_APPLICATIONS.find((a) => a.code === constructionTask) ||
      CONSTRUCTION_APPLICATIONS[0];

    const speciesList = Object.values(SPECIES_DICTIONARY);

    const suitableOptions = speciesList
      .map((sp) => {
        const avgPrice = Math.round(
          (sp.pricePerBoardFootPhp.min + sp.pricePerBoardFootPhp.max) / 2
        );
        const totalEstimatedCostPhp = avgPrice * estimatedBoardFeet;
        const withinBudget = totalEstimatedCostPhp <= maxBudgetPhp;

        // Determine FPRDI adequacy
        const groupOrder: FprdiGroupCode[] = ['GROUP_I', 'GROUP_II', 'GROUP_III', 'GROUP_IV'];
        const reqIdx = groupOrder.indexOf(app.minimumFprdiGroup);
        const spIdx = groupOrder.indexOf(sp.fprdiGroup);

        const meetsFprdi = spIdx <= reqIdx;

        let suitabilityRank = 99;
        if (meetsFprdi && withinBudget) suitabilityRank = 1;
        else if (meetsFprdi && !withinBudget) suitabilityRank = 2;
        else if (!meetsFprdi && withinBudget) suitabilityRank = 3;

        let reason = '';
        if (meetsFprdi && withinBudget) {
          reason = `Excellent fit! Meets ${sp.fprdiGroup} requirement and fits within PHP ${maxBudgetPhp.toLocaleString()} budget envelope.`;
        } else if (meetsFprdi && !withinBudget) {
          reason = `Meets ${sp.fprdiGroup} structural requirement but exceeds budget by PHP ${(totalEstimatedCostPhp - maxBudgetPhp).toLocaleString()}.`;
        } else {
          reason = `Within budget, but ${sp.fprdiGroup} rating is below minimum ${app.minimumFprdiGroup} required.`;
        }

        return {
          speciesId: sp.id,
          commonName: sp.commonName,
          botanicalName: sp.botanicalName,
          fprdiGroup: sp.fprdiGroup,
          pricePerBoardFootPhp: avgPrice,
          totalEstimatedCostPhp,
          withinBudget,
          priceTier: sp.pricePerBoardFootPhp.priceTier,
          suitabilityRank,
          recommendationReason: reason,
        };
      })
      .sort((a, b) => a.suitabilityRank - b.suitabilityRank);

    return {
      status: 'SUCCESS',
      userTask: app.title,
      requiredFprdiGroup: app.minimumFprdiGroup,
      estimatedBoardFeet,
      maxBudgetPhp,
      suitableSpeciesOptions: suitableOptions,
    };
  },
};
