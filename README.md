# LumbrScan: Mobile Philippine Timber Species Identification & Decision Support System

[![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-51+-000000?style=flat-square&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/State-Zustand-764ABC?style=flat-square)](https://github.com/pmndrs/zustand)
[![License](https://img.shields.io/badge/License-Academic_Thesis-D97706?style=flat-square)](#)

> **Undergraduate Computer Science Thesis Project**
> **Title:** LumbrScan: A Mobile-Based System for Philippine Timber Species Identification, Condition Assessment, and Construction Suitability Recommendation

---

## 📌 Abstract & System Overview

**LumbrScan** is an intelligent mobile decision-support system engineered to bridge the gap between computer vision-based wood species identification and field construction engineering in the Philippines.

While traditional machine learning models only output botanical predictions, LumbrScan extends the pipeline into an actionable **4-Phase Decision Support Framework**:

```
+-----------------------------------------------------------------------------------+
|                           LUMBRSCAN 4-PHASE PIPELINE                              |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [PHASE 1: INPUT & CONDITION ASSESSMENT]                                         |
|  - 224x224 RGB Grain / Cross-Section Image Capture                                |
|  - Physical Defect Checklist (Decay, Cracks, Warping, Knots)                       |
|  - User Constraints (Budget Tier, Project Requirements)                           |
|                                                                                   |
|                                     │                                             |
|                                     ▼                                             |
|  [PHASE 2: DUAL-BACKBONE AI CLASSIFICATION ENGINE]                                |
|  - ResNet-50 + EfficientNet-B4 Feature Fusion Network                             |
|  - 11 Target Philippine Timber Species Prediction + Confidence Score               |
|                                                                                   |
|                                     │                                             |
|                                     ▼                                             |
|  [PHASE 3: KNOWLEDGE BASE EVALUATION ENGINE]                                      |
|  - FPRDI Strength Groupings (Groups I to IV)                                      |
|  - DENR DAO 2026-20 Legal Status & Permit Badge Generation                        |
|                                                                                   |
|                                     │                                             |
|                                     ▼                                             |
|  [PHASE 4: TWO-WAY DECISION SUPPORT OUTPUT]                                       |
|  - Path A (Task-to-Material): Select Structural Task ➔ Get Best Timber             |
|  - Path B (Material-to-Task): Input Identified Timber ➔ Get Safe Applications      |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 🌲 The 11 Philippine Target Timber Species

LumbrScan strictly focuses on processed timber, sawn lumber, log bark, and transversal cross-sections across 11 key Philippine species:

1. **Narra** (*Pterocarpus indicus*) - Regulated Hardwood (FPRDI Group II)
2. **Ipil** (*Intsia bijuga*) - Protected Hardwood (FPRDI Group II)
3. **Molave** (*Vitex parviflora*) - Critically Regulated (FPRDI Group I)
4. **Apitong** (*Dipterocarpus grandiflorus*) - Structural Commercial Hardwood (FPRDI Group II)
5. **White Lauan** (*Shorea contorta*) - Commercial Philippine Mahogany (FPRDI Group III)
6. **Yakal** (*Shorea astylosa*) - Critically Endangered Structural Grade (FPRDI Group I)
7. **Gmelina** (*Gmelina arborea*) - Commercial Plantation Wood (FPRDI Group III)
8. **Coconut** (*Cocos nucifera*) - Palm / PCA Permit Governed (FPRDI Group IV/III)
9. **Acacia** (*Samanea saman*) - Exotic Plantation Furniture Wood (FPRDI Group III)
10. **Mango** (*Mangifera indica*) - Senile Agricultural Fruit Wood (FPRDI Group IV)
11. **Nangka** (*Artocarpus heterophyllus*) - Fruit Wood / Specialty Joinery (FPRDI Group III)

---

## 🛠️ Software Architecture & Tech Stack

* **Frontend Framework:** React Native with Expo SDK 51+ (TypeScript)
* **Routing:** Expo Router (File-based navigation)
* **State Management:** Zustand (Isolated slices for Scan, Knowledge Base, Recommender, Condition)
* **Styling Engine:** Geometric Minimalist Slate Theme (Custom Tailwind / StyleSheet tokens)
* **Mock API Integration:** API-Contract First Architecture with mock JSON REST client (`@/mock/apiContract.json`)

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.x` or `v20.x`
* **Package Manager**: `npm` or `pnpm`
* **Expo Go / Simulator**: iOS Simulator, Android Studio Emulator, or Expo Go App on physical mobile device.

### Setup Instructions

1. **Clone the Repository & Install Dependencies:**
   ```bash
   git clone https://github.com/your-org/lumbrscan-mobile.git
   cd lumbrscan-mobile
   npm install
   ```

2. **Run in Mock API Mode (Frontend Testing):**
   ```bash
   npx expo start
   ```
   * Press `a` for Android Emulator
   * Press `i` for iOS Simulator
   * Scan QR Code using Expo Go app on physical iOS/Android device

---

## 📁 Repository Structure

```
lumbrscan-mobile/
├── app/                      # Expo Router File-Based Navigation Tree
│   ├── (tabs)/               # Bottom Tab Bar Screens (Home, Scan, Knowledge, Recommend)
│   ├── scan/                 # Image Preprocessing & Pre-capture Modal
│   ├── species/              # Species Detail & DENR/FPRDI Modal Views
│   └── recommend/            # Two-Way Recommendation Engine Views
├── assets/                   # Vector Icons, Structural Visuals, Wood Grain Textures
├── components/               # React Native UI Components
│   ├── ui/                   # Reusable Atomic UI Elements (Badges, Cards, Buttons)
│   └── modules/              # Module 1-5 Domain Feature Components
├── constants/                # Domain Constants (11 Species, FPRDI, DENR, Defects)
├── hooks/                    # Custom React Hooks
├── mock/                     # Mock REST API Schemas & JSON Data
│   └── apiContract.json      # Comprehensive Predict & Recommend Mock Schema
├── services/                 # API Clients & Service Layer
│   ├── apiClient.ts          # Generic API Adapter Contract
│   └── mockApiClient.ts      # Latency-Simulated Mock API Client
├── stores/                   # Zustand Global State Slices
├── types/                    # TypeScript Type Definitions & API Schemas
├── AI_RULES.md               # AI Agent Coding Guidelines & Constraints
├── ARCHITECTURE_RFC.md       # Proactive System Blueprint & RFC
├── CO_DEV_GUIDE.md           # Developer Collaboration & GitFlow Guide
└── SYSTEM_CONTEXT.md         # Domain Reference & Legal Regulatory Manual
```

---

## 🗺️ Project Roadmap & Feature Checklist

For a detailed breakdown of completed modules, active sprint tasks, and upcoming integration milestones for co-developers, see:
* **[Development Roadmap & Feature Checklist](file:///c:/Personal/Development/School/Thesis/docs/ROADMAP.md)**

---

## 📄 License & Academic Attribution

Developed as an Undergraduate Computer Science Thesis Project. All rights reserved. FPRDI structural values derived from Forest Products Research and Development Institute guidelines; DENR regulations derived from DENR Administrative Order No. 2026-20 & DAO 2004-15.
