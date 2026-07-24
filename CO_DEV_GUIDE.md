# LumbrScan Collaboration & Engineering Guide for Human Team Members

> **Welcome to the LumbrScan Engineering Team!**
> This document outlines our team workflow, Git branching model, Conventional Commits protocol, and API-Contract First development lifecycle.

---

## 1. VERSION CONTROL & BRANCHING STRATEGY (GITFLOW)

To maintain a clean, defense-ready codebase, we strictly enforce GitFlow branching rules:

```
[main] ───────────────────────────────────────────────────────────── (Production/Defense Demos)
   ▲
   │ (Pull Request via Code Review)
   │
[develop] ───┬───────────────────────────────┬────────────────────── (Active Integration)
             │                               │
             ├──► [feature/camera-capture]   ├──► [feature/two-way-recommender]
             │                               │
             └──► [fix/crop-aspect-ratio]   └──► [feature/denr-badges]
```

### Branch Types & Naming Standards
* **`main`**: Locked branch. Contains production-tested, defense-ready builds only. Direct pushes forbidden.
* **`develop`**: Primary integration branch for completed modules. All feature branches merge here via Pull Request.
* **`feature/<module-or-feature-name>`**: Dedicated short-lived feature branches.
  * Examples: `feature/camera-preprocessing`, `feature/fprdi-lookup`, `feature/mock-api-service`.
* **`fix/<bug-name>`**: Dedicated bugfix branches.
  * Examples: `fix/condition-slider-range`, `fix/denr-badge-color`.

---

## 2. CONVENTIONAL COMMITS PROTOCOL

Every commit MUST follow the Conventional Commits specification:

```
<type>(<scope>): <short summary in imperative present tense>
```

### Permissible Types:
* `feat`: A new user-facing feature or module addition.
* `fix`: A bug fix in UI or domain logic.
* `docs`: Documentation updates (e.g., `SYSTEM_CONTEXT.md`, `README.md`).
* `style`: Styling edits, theme token adjustments, formatting (no functional code change).
* `refactor`: Code change that neither fixes a bug nor adds a feature.
* `test`: Adding or modifying mock contract schemas or unit tests.
* `chore`: Maintenance tasks (package updates, tsconfig edits).

### Examples:
```bash
git commit -m "feat(capture): integrate 224x224 crop aspect ratio in camera preview"
git commit -m "docs(api): update mock API contract with FPRDI Group IV details"
git commit -m "fix(recommender): resolve defect penalty calculation for end-splitting"
```

---

## 3. API-CONTRACT FIRST DEVELOPMENT WORKFLOW

Our backend AI model (dual-backbone ResNet-50 + EfficientNet-B4 CNN) is trained separately by our ML engineers. To prevent frontend development bottlenecks:

```
Step 1: Define & Lock JSON Schema in /mock/apiContract.json
  │
Step 2: Build Typed Service Adapter (@/services/mockApiClient.ts)
  │
Step 3: Build & Polish 100% of RN Mobile UI with Simulated Latency
  │
Step 4: Swap Mock Client with Live Axios Python REST Endpoint when Backend Ready
```

### How to Toggle Mock Mode vs. Live Backend
In `.env.local`:
```env
# Set to 'true' for UI mock-driven development, 'false' for live Python backend
EXPO_PUBLIC_USE_MOCK_API=true
EXPO_PUBLIC_API_BASE_URL=https://api.lumbrscan.ph/v1
```

---

## 4. CODE REVIEW & PR CHECKLIST

Before opening a Pull Request into `develop`, verify:

- [ ] Code compiles with `npx tsc --noEmit` without TypeScript errors.
- [ ] No `any` types used.
- [ ] No live tree/leaf icons or imagery used in UI.
- [ ] UI tested on both Android and iOS simulators/devices.
- [ ] All 11 target species accurately styled according to `SYSTEM_CONTEXT.md`.
- [ ] Git commit messages strictly follow Conventional Commits.
