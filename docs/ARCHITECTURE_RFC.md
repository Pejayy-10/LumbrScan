# RFC 001: LumbrScan Mobile Frontend Architecture & System Topology

> **Status:** APPROVED & PROPOSED (Phase 0 Architectural Specification)
> **Author:** Principal Mobile Architect & Lead Systems Engineer
> **Target Framework:** React Native with Expo (SDK 51+) & TypeScript
> **Navigation:** Expo Router v3 (File-based Routing)
> **State Management:** Zustand 4.x

---

## 1. EXECUTIVE ARCHITECTURE SUMMARY

LumbrScan is designed as an **offline-resilient, API-Contract First mobile decision-support system**. The mobile application operates across 5 discrete software modules that process timber grain/cross-section images and physical condition defects, query legal/engineering knowledge bases, and compute two-way structural recommendations.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            MOBILE SYSTEM TOPOLOGY                                │
└──────────────────────────────────────────────────────────────────────────────────┘

   [UI Layer: Expo Router Pages & Module Components]
       │
       ├──► Module 1: Preprocessing & Crop Modal (224x224 RGB)
       ├──► Module 2: AI Classification & Confidence View
       ├──► Module 3: FPRDI & DENR Legal Knowledge Lookup View
       ├──► Module 4: Two-Way Recommendation Decision Engine View
       └──► Module 5: Condition Defect Assessment & Filter View
       │
       ▼
   [State Management Layer: Zustand Slices]
       │
       ├──► useScanStore (Active image, cropped URI, history)
       ├──► useConditionStore (Defect checklist, severity ratings)
       ├──► useKnowledgeBaseStore (11 species dictionary, FPRDI, DENR)
       └──► useRecommenderStore (Task-to-Material, Material-to-Task filters)
       │
       ▼
   [Service Layer: Abstract API Client]
       │
       ├──► mockApiClient.ts (Simulated latency + mock/apiContract.json)
       └──► pythonApiClient.ts (Axios REST to Dual-Backbone PyTorch/TF Endpoint)
```

---

## 2. EXPO ROUTER NAVIGATION HIERARCHY

LumbrScan utilizes Expo Router's file-based navigation structure for seamless tab and stack transitions:

```
app/
├── _layout.tsx                     # Root Layout (Theme Provider, Query Client, Navigation Container)
├── (tabs)/                         # Main Bottom Tab Navigator
│   ├── _layout.tsx                 # Tab Bar Configuration (Timber Amber Highlights, Dark Slate Theme)
│   ├── index.tsx                   # Dashboard / Home Screen (Recent Scans, Quick Actions)
│   ├── scan.tsx                    # Module 1 & 5: Pre-scan & Condition Assessment Entry
│   ├── knowledge.tsx               # Module 3: FPRDI & DENR Species Catalog Explorer
│   └── recommend.tsx               # Module 4: Standalone Two-Way Recommender Search
├── scan/
│   ├── _layout.tsx                 # Scan Modal Stack Layout
│   ├── camera.tsx                  # Live Camera & Gallery Capture (Expo Image Picker / Camera)
│   ├── crop.tsx                    # Module 1: 224x224 Aspect-Ratio Cropping & Resizing View
│   └── processing.tsx              # Simulated AI Inference Loader with Progress Stepper
├── species/
│   ├── [id].tsx                    # Module 2 & 3: Detailed Species Match, FPRDI Grade, DENR Badge
│   └── denr-info.tsx               # Legal Regulatory Details & Permit Application Guidance Modal
└── recommend/
    ├── task-to-material.tsx        # Path A: Select Structural Task ➔ Filter Species
    └── material-to-task.tsx        # Path B: Select Species + Defects ➔ Permissible Applications
```

---

## 3. ZUSTAND STATE TOPOLOGY & STORE CONTRACTS

### 3.1 `useScanStore` (Scan & Image Preprocessing)
```typescript
export interface ScanState {
  imageUri: string | null;
  croppedUri: string | null;
  modalityType: 'TRANSVERSAL_CROSS_SECTION' | 'WOOD_GRAIN' | 'LOG_BARK';
  isProcessing: boolean;
  activeResult: PredictionResponse | null;
  scanHistory: PredictionResponse[];
  setImageUri: (uri: string) => void;
  setCroppedUri: (uri: string) => void;
  setModalityType: (type: ScanState['modalityType']) => void;
  runInference: () => Promise<void>;
  resetScan: () => void;
}
```

### 3.2 `useConditionStore` (Physical Defect Checklist)
```typescript
export interface ConditionState {
  hasDecayOrRot: boolean;
  hasEndSplitting: boolean;
  hasWarping: boolean;
  hasUnsoundKnots: boolean;
  hasInsectBoreholes: boolean;
  defectSeverity: 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE';
  toggleDefect: (defect: keyof Omit<ConditionState, 'defectSeverity' | 'toggleDefect' | 'setSeverity' | 'resetCondition'>) => void;
  setSeverity: (severity: ConditionState['defectSeverity']) => void;
  resetCondition: () => void;
}
```

### 3.3 `useRecommenderStore` (Two-Way Recommendation Engine)
```typescript
export interface RecommenderState {
  mode: 'TASK_TO_MATERIAL' | 'MATERIAL_TO_TASK';
  selectedTask: string | null;
  selectedSpeciesId: string | null;
  budgetFilter: 'LOW' | 'MEDIUM' | 'HIGH' | 'ALL';
  denrExemptOnly: boolean;
  recommendationOutput: RecommendationResponse | null;
  setMode: (mode: RecommenderState['mode']) => void;
  setTask: (task: string | null) => void;
  setSpeciesId: (id: string | null) => void;
  setBudgetFilter: (budget: RecommenderState['budgetFilter']) => void;
  setDenrExemptOnly: (exempt: boolean) => void;
  fetchRecommendation: () => Promise<void>;
}
```

---

## 4. SOFTWARE MODULE MAPPING & COMPONENT HIERARCHY

```
+-----------------------------------------------------------------------------------+
|                        MODULE TO COMPONENT MAPPING                                |
+-----------------------------------------------------------------------------------+

[Module 1: Image Preprocessing]
  └── components/modules/preprocessing/
      ├── ImageCaptureFrame.tsx     # 224x224 Grid Overlay Guide
      ├── CropZoomControl.tsx       # Aspect Ratio & Pinch-to-Zoom Handler
      └── ModalitySelector.tsx      # Grain vs. Cross-Section vs. Bark Selector

[Module 2: Classification View]
  └── components/modules/classification/
      ├── PrimaryMatchCard.tsx      # Top Species Prediction + Confidence Gauge
      ├── MatchConfidenceBar.tsx    # Animated Confidence Percentage Bar
      └── AlternativeMatches.tsx    # Top-3 Alternative Candidate List

[Module 3: Knowledge Base Lookup View]
  └── components/modules/knowledge/
      ├── FprdiGradeBadge.tsx       # FPRDI Groups I-IV Color-coded Shield
      ├── DenrPermitAlert.tsx       # DENR DAO 2026-20 Legal Warning Banner
      └── SpeciesPropertySheet.tsx  # Mechanical Properties (Bending, Elasticity)

[Module 4: Construction Suitability Recommendation View]
  └── components/modules/recommendation/
      ├── SuitabilityCard.tsx       # Application Suitability Status (Safe vs Prohibited)
      ├── PathASwitcher.tsx         # Task-to-Material Interface
      └── PathBSwitcher.tsx         # Material-to-Task Interface

[Module 5: Condition Assessment & Preference Filter View]
  └── components/modules/condition/
      ├── DefectChecklist.tsx       # Interactive Defect Toggle Grid
      ├── SeveritySlider.tsx        # Defect Severity Rating Selector
      └── BudgetFilterPill.tsx      # Low / Medium / High Budget Selector
```

---

## 5. SYSTEM STATE TRANSITION MACHINE

```
 [ Idle / Home ]
        │
        ▼  (User tap "New Timber Scan")
 [ Camera / Gallery Modal ]
        │
        ▼  (Image Captured)
 [ Module 1: Preprocessing & 224x224 Crop ]
        │
        ▼  (Confirm Crop)
 [ Module 5: Condition Defect Checklist ]
        │
        ▼  (Submit Assessment)
 [ Module 2: AI Dual-Backbone Inference ]  ◄── (Simulated or Real Async REST Call)
        │
        ▼
 [ Module 3: FPRDI & DENR Legal Lookup ]
        │
        ▼
 [ Module 4: Two-Way Decision Support Output ]
        │
        ├──► Path A: Task-to-Material Recommendation List
        └──► Path B: Material-to-Task Permissible Application Matrix
```

---

## 6. DESIGN SYSTEM & ATOMIC COMPONENT TOKENS

* **Primary Background:** `#0F172A` (Slate 900)
* **Card Container:** `#1E293B` (Slate 800)
* **Accent Brand:** `#D97706` (Timber Amber)
* **FPRDI Safe Badge:** `#059669` (Safety Emerald)
* **DENR Alert Badge:** `#DC2626` (Legal Crimson)
* **Border Radii:** `rounded-xl` (12px), `rounded-2xl` (16px) for sleek, modern geometric touch targets.
* **Icon Library:** `@expo/vector-icons` (`Feather`, `MaterialCommunityIcons` - strictly filtering out foliage/leaves).
