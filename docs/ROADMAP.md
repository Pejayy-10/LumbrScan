# LumbrScan Development Roadmap & Feature Checklist

> **Project:** LumbrScan Mobile Frontend
> **Current Version:** Phase 2 Completed (100% Interactive Mock-Driven Frontend)
> **Maintainer Note:** This document tracks completed modules, active work, and upcoming sprint items for all co-developers.

---

## 📊 DEVELOPMENT ROADMAP SUMMARY

```
[Phase 0: Architecture & Mock Schema]  ──►  [Phase 1: UI Shell & Stores]  ──►  [Phase 2: Live Hardware & Interactive Polish]  ──►  [Phase 3: Defense Demo & Mock-Driven Presentation]
          ✅ COMPLETED                              ✅ COMPLETED                            ✅ COMPLETED                                        🟡 IN PROGRESS
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
- [x] **Mock Service Adapter:** `services/mockApiClient.ts` (Simulates network delay & contract responses).
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

## ✅ PHASE 2: LIVE HARDWARE & INTERACTIVE POLISH (COMPLETED)

- [x] **Sprint 1 (Hardware Capture & Image Preprocessing):** Integrated `expo-image-picker` in `app/(tabs)/scan.tsx` for real camera capture and gallery photo selection with 1:1 tensor aspect ratio.
- [x] **Sprint 2 (Dynamic Defect & FPRDI Downgrade Calculator):** Real-time visual feedback banner showing structural downgrade (Group II ➔ Effective Group IV) as defect checkboxes are toggled.
- [x] **Sprint 3 (Micro-Animations & DENR Permit Application Guide):** Animated confidence score percentage gauge (`components/ui/ConfidenceGauge.tsx`) & 4-step DENR legal permit application workflow modal (`components/modules/knowledge/DenrPermitModal.tsx`).
- [x] **Sprint 4 (Exportable Decision Support Report):** Shareable decision support certificate summarizing species prediction, FPRDI grade, condition penalties, DENR legal status, and bidirectional recommendations with native share sheet (`components/modules/recommendation/InspectionReportModal.tsx`).

---

## 🟡 PHASE 3: DEFENSE DEMO & 100% INTERACTIVE FRONTEND POLISH (CURRENT IN PROGRESS)

> **Goal:** Ensure 100% of all UI buttons, tabs, modals, sliders, and navigation flows are fully interactive, clickable, and responsive for defense presentation using our standalone mock engine—without requiring a live Python backend.

- [x] **Mock Engine Latency Simulation:** Standalone local mock client returning contract responses in 750ms.
- [x] **Native Sharing & Exporting:** Test native device Share sheet on physical devices / simulators.
- [x] **Search & Filter Interactivity:** Real-time species search bar and native vs. plantation category toggles.
- [x] **Bidirectional Recommender Interactivity:** Live switching between Path A (Task-to-Material) and Path B (Material-to-Task) with species chip selectors.
- [ ] **Interactive Demo Walkthrough Prep:** Defense presentation walkthrough script for panel Q&A.

---

## ⏳ PHASE 4: FUTURE PYTHON CNN BACKEND INTEGRATION (POST-TRAINING)

- [ ] **Environment API URL Toggle:** Set `EXPO_PUBLIC_USE_MOCK_API=false` in `.env.local`.
- [ ] **Axios Live REST Client:** Connect to live dual-backbone CNN (ResNet-50 + EfficientNet-B4) PyTorch/TensorFlow server once model training completes.
- [ ] **Offline Fallback Handler:** Fallback to mock/cached predictions if field connection drops.
