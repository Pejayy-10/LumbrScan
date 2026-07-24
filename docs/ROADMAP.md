# LumbrScan Development Roadmap & Feature Checklist

> **Project:** LumbrScan Mobile Frontend
> **Current Version:** Phase 1 Completed (Mock API UI Foundation Ready)
> **Maintainer Note:** This document tracks completed modules, active work, and upcoming sprint items for all co-developers.

---

## 📊 DEVELOPMENT ROADMAP SUMMARY

```
[Phase 0: Architecture & Mock API]  ──►  [Phase 1: UI Shell & Stores]  ──►  [Phase 2: Live Hardware & Interactive Polish]  ──►  [Phase 3: Python CNN Backend Integration]
          ✅ COMPLETED                              ✅ COMPLETED                            🟡 IN PROGRESS (Sprint 1)                            ⏳ UPCOMING
```

---

## ✅ PHASE 0: ARCHITECTURAL FOUNDATION (COMPLETED)

- [x] **Git Isolation & Workspace Directives:** `.gitignore`, `.agents/AGENTS.md`, `AI_RULES.md`, `SYSTEM_CONTEXT.md`.
- [x] **API Contract Specification:** `mock/apiContract.json` (/predict and /recommend REST contracts).
- [x] **Engineering RFC & Topology:** `docs/ARCHITECTURE_RFC.md` (Expo Router file navigation & Zustand store topologies).
- [x] **Developer Onboarding Guide:** `CO_DEV_GUIDE.md` & `README.md`.

---

## ✅ PHASE 1: UI SHELL & CORE MODULES (COMPLETED)

- [x] **Project Setup:** Expo SDK 57 + TypeScript + Expo Router v3 + Zustand.
- [x] **Domain Constants & Types:** `constants/domain.ts` (11 species dictionary, FPRDI Groups I-IV, DENR DAO 2026-20 badges, physical defect index).
- [x] **Mock Service Adapter:** `services/mockApiClient.ts` (Simulates 750ms network delay & contract responses).
- [x] **Atomic UI Component System:**
  - [x] `components/ui/FprdiBadge.tsx` (Color-coded structural strength badge).
  - [x] `components/ui/DenrBadge.tsx` (DENR DAO 2026-20 legal warning badge & notice banner).
  - [x] `components/ui/SafetyCard.tsx` (Construction suitability status card).
- [x] **Screen Router Structure:**
  - [x] `app/(tabs)/index.tsx`: Dashboard with 4-phase system pipeline card & quick actions.
  - [x] `app/(tabs)/scan.tsx`: Module 1 (Preprocessing UI) & Module 5 (Defect checklist & severity rating).
  - [x] `app/(tabs)/knowledge.tsx`: Module 3 (FPRDI & DENR Species Catalog lookup with category filters & search).
  - [x] `app/(tabs)/recommend.tsx`: Module 4 (Two-Way Decision Engine: Path A Task-to-Material & Path B Material-to-Task).
  - [x] `app/species/[id].tsx`: Detailed species match view, FPRDI mechanical property sheet, & DENR legal warning modal.

---

## 🟡 PHASE 2: LIVE HARDWARE & INTERACTIVE POLISH (IN PROGRESS)

### 📌 Sprint 1: Hardware Capture & Image Preprocessing (NEXT STEP)
- [ ] **Camera & Gallery Picker:** Integrate `expo-image-picker` in `app/(tabs)/scan.tsx` for real camera capture and gallery selection.
- [ ] **Aspect Ratio Cropper:** Integrate `expo-image-manipulator` to crop and resize captured images to exact 224x224 RGB tensor input format.
- [ ] **Modality Switcher:** Visual indicator for Transversal Cross-Section vs. Wood Grain vs. Log Bark.

### 📌 Sprint 2: Dynamic Defect & FPRDI Downgrade Calculator
- [ ] **Live Downgrade Computation:** Real-time visual feedback showing structural downgrade (e.g. Group II ➔ Group III) as user checks defect boxes.
- [ ] **Photo Defect Annotator:** Interactive bounding box overlay on captured wood image to mark rot/crack regions.

### 📌 Sprint 3: Micro-Animations & DENR Permit Application Guide (COMPLETED)
- [x] **Confidence Score Gauge:** Animated confidence percentage bar on species match cards (`components/ui/ConfidenceGauge.tsx`).
- [x] **DENR Permit Step-by-Step Modal:** Interactive guide explaining how contractors apply for Tree Cutting Permits & CTOs under DENR DAO 2026-20 (`components/modules/knowledge/DenrPermitModal.tsx`).

### 📌 Sprint 4: Exportable Decision Support Report
- [ ] **Field PDF/Print Summary:** Generate downloadable/shareable summary report of structural timber recommendations for construction clients.

---

## ⏳ PHASE 3: LIVE PYTHON CNN BACKEND INTEGRATION (FUTURE)

- [ ] **Environment API URL Toggle:** Set `EXPO_PUBLIC_USE_MOCK_API=false` in `.env.local`.
- [ ] **Axios Live REST Client:** Create `services/pythonApiClient.ts` connecting to dual-backbone CNN (ResNet-50 + EfficientNet-B4).
- [ ] **Offline Fallback Handler:** Fallback to mock/cached predictions if field connection drops.
