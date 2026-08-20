# LumbrScan ML Backend

## Overview
FastAPI + PyTorch 2-Modality Fusion Neural Network backend for Philippine timber species identification, defect detection, and construction suitability recommendations.

**Species supported:** Narra, Ipil, Molave, Apitong, White Lauan, Yakal, Gmelina, Coconut, Acacia, Mango, Nangka  
**Regulatory frameworks:** FPRDI Strength Groups I–IV | DENR DAO 2026-20

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
