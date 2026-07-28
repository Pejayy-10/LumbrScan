// LumbrScan Core TypeScript Type Definitions

import {
  FprdiGroupCode,
  DenrStatusCode,
  TimberSpecies,
  FprdiRating,
  DenrBadge,
} from '../constants/domain';

export type {
  FprdiGroupCode,
  DenrStatusCode,
  TimberSpecies,
  FprdiRating,
  DenrBadge,
};

export type ModalityType = 'TRANSVERSAL_CROSS_SECTION' | 'WOOD_GRAIN' | 'LOG_BARK';

export type DefectType =
  | 'DECAY_ROT'
  | 'END_SPLITTING'
  | 'WARPING'
  | 'UNSOUND_KNOTS'
  | 'INSECT_BOREHOLES';

export type SeverityLevel = 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE';

export type SafetyRating =
  | 'SAFE'
  | 'PERMISSIBLE_WITH_CAUTION'
  | 'HIGH_RISK_NOT_RECOMMENDED'
  | 'PROHIBITED_UNSAFE';

// -----------------------------------------------------------------------------
// 1. AUTOMATED AI DEFECT DETECTION & REMEDIATION
// -----------------------------------------------------------------------------
export interface AutomatedDefectItem {
  defectType: DefectType;
  label: string;
  severity: SeverityLevel;
  confidenceScore: number;
  penaltyPoints: number;
}

export interface AutomatedDefectDetection {
  hasDefects: boolean;
  overallSeverity: SeverityLevel;
  detectedDefects: AutomatedDefectItem[];
  remediationRecommendations: string[];
}

export interface SevereDefectFallback {
  warningBadgeTitle: 'UNSAFE FOR STRUCTURAL USE';
  warningMessage: string;
  suggestedAlternativeSpecies: {
    id: string;
    commonName: string;
    botanicalName: string;
    fprdiGroup: FprdiGroupCode;
    reason: string;
  }[];
}

// -----------------------------------------------------------------------------
// 2. CONDITION ASSESSMENT INPUT & EVALUATION
// -----------------------------------------------------------------------------
export interface ConditionAssessmentInput {
  hasDecayOrRot: boolean;
  hasEndSplitting: boolean;
  hasWarping: boolean;
  hasUnsoundKnots: boolean;
  hasInsectBoreholes: boolean;
  defectSeverity: SeverityLevel;
}

export interface AssessedDefectDetail {
  defectType: DefectType;
  label: string;
  severity: SeverityLevel;
  strengthDowngradePenalty: number;
}

export interface ConditionEvaluationResult {
  assessedDefects: AssessedDefectDetail[];
  originalFprdiGroup: FprdiGroupCode;
  effectiveFprdiGroup: FprdiGroupCode;
  conditionWarningSummary: string;
}

// -----------------------------------------------------------------------------
// 3. AI PREDICTION RESPONSE & SPECIES MATCH
// -----------------------------------------------------------------------------
export interface SpeciesMatch {
  id: string;
  commonName: string;
  botanicalName: string;
  localName: string;
  category: string;
  confidenceScore: number;
  grainCharacteristics: string;
  visualTexture: string;
}

export interface AlternativeMatch {
  id: string;
  commonName: string;
  botanicalName: string;
  confidenceScore: number;
}

export interface PredictionPayload {
  imageUri: string;
  croppedUri?: string;
  modalityType: ModalityType;
  conditionAssessment?: ConditionAssessmentInput;
  intendedApplication?: string;
}

export interface PredictionResponse {
  status: 'SUCCESS' | 'ERROR';
  timestamp: string;
  processingTimeMs: number;
  prediction: {
    primaryMatch: SpeciesMatch;
    alternativeMatches: AlternativeMatch[];
  };
  knowledgeBase: {
    fprdiStrengthGroup: FprdiRating;
    denrRegulatoryStatus: DenrBadge;
    speciesInfo: TimberSpecies;
  };
  automatedDefectDetection: AutomatedDefectDetection;
  structuralAssessment: {
    nominalFprdiGroup: FprdiGroupCode;
    effectiveFprdiGroup: FprdiGroupCode;
    totalPenaltyPoints: number;
    safetyRating: SafetyRating;
    isSafeForIntendedUse: boolean;
    severeDefectFallback?: SevereDefectFallback | null;
  };
  conditionEvaluation?: ConditionEvaluationResult;
  twoWayRecommendation: TwoWayRecommendationResult;
}

// -----------------------------------------------------------------------------
// 4. TWO-WAY RECOMMENDATION ENGINE & TIMBER ESTIMATOR
// -----------------------------------------------------------------------------
export interface PermissibleApplication {
  applicationCode: string;
  title: string;
  safetyRating: SafetyRating;
  rationale: string;
}

export interface ProhibitedApplication {
  applicationCode: string;
  title: string;
  safetyRating: SafetyRating;
  rationale: string;
}

export interface MaterialToTaskResult {
  speciesName: string;
  permissibleApplications: PermissibleApplication[];
  prohibitedApplications: ProhibitedApplication[];
}

export interface RankedSpeciesRecommendation {
  rank: number;
  id: string;
  commonName: string;
  botanicalName: string;
  fprdiGroup: FprdiGroupCode;
  denrStatus: DenrStatusCode;
  suitabilityScore: number;
  keyAdvantages: string;
  estimatedCostTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
}

export interface TaskToMaterialResult {
  targetApplicationCode: string;
  targetApplicationTitle: string;
  requiredFprdiGroup: FprdiGroupCode;
  recommendedSpeciesList: RankedSpeciesRecommendation[];
}

export interface TwoWayRecommendationResult {
  materialToTask: MaterialToTaskResult;
  taskToMaterial?: TaskToMaterialResult;
}

export interface EstimatorSpeciesOption {
  speciesId: string;
  commonName: string;
  botanicalName: string;
  fprdiGroup: FprdiGroupCode;
  pricePerBoardFootPhp: number;
  totalEstimatedCostPhp: number;
  withinBudget: boolean;
  priceTier: 'ECONOMY' | 'MID_RANGE' | 'PREMIUM' | 'LUXURY';
  suitabilityRank: number;
  recommendationReason: string;
}

export interface EstimatorRequestPayload {
  constructionTask: string;
  estimatedBoardFeet: number;
  maxBudgetPhp: number;
}

export interface EstimatorResponsePayload {
  status: 'SUCCESS' | 'ERROR';
  userTask: string;
  requiredFprdiGroup: FprdiGroupCode;
  estimatedBoardFeet: number;
  maxBudgetPhp: number;
  suitableSpeciesOptions: EstimatorSpeciesOption[];
}

// -----------------------------------------------------------------------------
// 5. LOCAL HISTORY LOG RECORD
// -----------------------------------------------------------------------------
export interface HistoryLogRecord {
  id: string; // Unique scan UUID / timestamp string
  timestamp: string; // ISO 8601 string
  imageUri: string;
  speciesId: string;
  commonName: string;
  botanicalName: string;
  confidenceScore: number;
  detectedDefectsSummary: string;
  overallDefectSeverity: SeverityLevel;
  effectiveFprdiGroup: FprdiGroupCode;
  safetyRating: SafetyRating;
  remediationCount: number;
}

// -----------------------------------------------------------------------------
// 6. API CLIENT INTERFACE CONTRACT
// -----------------------------------------------------------------------------
export interface LumbrScanApiClient {
  predictSpecies: (payload: PredictionPayload) => Promise<PredictionResponse>;
  getRecommendationForTask: (
    applicationCode: string,
    budgetFilter?: string
  ) => Promise<TaskToMaterialResult>;
  calculateBudgetEstimate: (
    payload: EstimatorRequestPayload
  ) => Promise<EstimatorResponsePayload>;
}
