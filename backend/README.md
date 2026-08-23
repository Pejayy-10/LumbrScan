# LumbrScan ML Backend

## Overview
FastAPI + PyTorch 2-Modality Fusion Neural Network backend for Philippine timber species identification, defect detection, and construction suitability recommendations.

**Species supported:** Narra, Ipil, Molave, Apitong, White Lauan, Yakal, Gmelina, Coconut, Acacia, Mango, Nangka  
**Regulatory frameworks:** FPRDI Strength Groups I–IV | DENR DAO 2026-20

> **Current research milestone:** the real-image pipeline is an interim, three-species (Coconut, Gmelina, Mango) **species-classification-only** prototype. It must not report defect/severity results or claim support for all 11 species until validated labels and real images exist for each target class.

---

## Quick Start (Step by Step)

### 1. Activate Virtual Environment
```powershell
cd backend
.venv\Scripts\Activate.ps1
```

### 2. Generate Synthetic Training Dataset
```bash
python scripts/generate_synthetic_dataset.py
```
This creates placeholder timber images for all 11 species in `data/raw/`.  
When DENR images arrive, copy them into `data/raw/cross_section/<species>/` and `data/raw/wood_grain/<species>/`.

## Real-image workflow (use this before training)

The current real source folders remain untouched under `data/raw/COCONUT`, `data/raw/GMELINA`, and `data/raw/MANGO`. Do not replace them with generated images or delete synthetic files.

```powershell
# Build one review row per original photo; no image files are changed.
python scripts/build_dataset_manifest.py

# Manually crop a timber-focused working copy and mark each image KEEP or REJECT.
python scripts/review_and_crop.py

# Assign one whole timber specimen to each validation fold.
python scripts/create_grouped_folds.py

# Train one fold. Repeat for folds 0, 1, and 2 before summarising results.
python scripts/train_species_classifier.py --fold 0 --epochs 30

# Evaluate a fold checkpoint and save per-class metrics plus a confusion matrix.
python scripts/evaluate_species_classifier.py `
  --checkpoint data/checkpoints/interim_3species_fold0_best.pt `
  --fold 0

# Export a specific reviewed species-only checkpoint, if ONNX is needed later.
python scripts/export_species_classifier.py `
  --checkpoint data/checkpoints/interim_3species_fold0_best.pt
```

The reviewer creates only derived files in `data/processed/`; raw photos remain immutable. See `data/README.md` for the workflow and `AGENTS.md` for the research rules.

## Test the interim model locally

The interim model has a dedicated endpoint that requires one cropped **cross-section** image and one cropped **wood-grain** image. It only predicts Coconut, Gmelina, or Mango. It deliberately does **not** provide defect, severity, FPRDI, DENR, or structural results.

Choose one reviewed local checkpoint for a functional test, then start the server from `backend/`:

```powershell
$env:LUMBRSCAN_INTERIM_CHECKPOINT = (Resolve-Path "data\checkpoints\interim_3species_fold2_best.pt").Path
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000/docs`, use `POST /api/v1/interim/species-scan`, and upload both images. The same request can be sent from PowerShell with `curl.exe`:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/v1/interim/species-scan" `
  -F "cross_section=@C:\path\to\cross-section.jpg" `
  -F "wood_grain=@C:\path\to\wood-grain.jpg"
```

Use photos from a new physical timber specimen for a meaningful manual check. Reusing a photo that trained the selected checkpoint verifies the software path only; it does not measure generalisation. The three fold checkpoints are experiment artifacts, not a final deployment model.

### 3. Train the Model
```bash
python scripts/train.py
```
- Runs 30 epochs of training (5–15 minutes on CPU)
- Saves best model weights to `app/ml/weights/lumbrscan_best.pt`

### 4. Export to ONNX
```bash
python scripts/export_onnx.py
```
Converts the trained model to `app/ml/weights/lumbrscan.onnx` for fast inference.

### 5. Start FastAPI Server
```bash
uvicorn app.main:app --reload
```
API will be available at: http://localhost:8000  
Interactive docs (Swagger UI): **http://localhost:8000/docs**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Server health check |
| GET | `/api/v1/species` | List all 11 target species with FPRDI & DENR info |
| POST | `/api/v1/scan` | Upload 1-2 images → get species prediction + defects |
| POST | `/api/v1/interim/species-scan` | Research-only paired scan: Coconut/Gmelina/Mango, no defect outputs |
| POST | `/api/v1/recommend` | Get species recommendations by task & budget |

---

## Dataset Structure (When DENR Images Arrive)

```
data/raw/
├── cross_section/        ← End-grain / transversal cross-section photos
│   ├── narra/            ← Min. 50 images, JPG or PNG
│   ├── ipil/
│   └── ... (all 11 species)
└── wood_grain/           ← Flat surface / longitudinal grain photos
    ├── narra/
    └── ... (all 11 species)
```

**Photo Requirements:**
- Resolution: 300×300 px minimum (phone camera is fine)
- Lighting: Diffuse/natural — no harsh shadows or flash glare
- Background: White or neutral gray surface
- Cross-Section: Shot straight-on at the cut end of the board
- Wood Grain: Shot perpendicular to the flat face of the board
