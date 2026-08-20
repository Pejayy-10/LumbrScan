"""
LumbrScan Model Training Script
==================================
BEGINNER EXPLANATION — WHAT IS TRAINING?

Training is the process of showing the model thousands of labeled timber images
and letting it ADJUST its internal weights (numbers) until its predictions match
the true labels. Here is the step-by-step flow:

  EPOCH: One full pass through the entire training dataset.
  BATCH: A group of images processed together (e.g. 16 at a time).

For each batch during training:
  1. FORWARD PASS:
     - Feed the cross-section + wood-grain image tensors into the model.
     - The model predicts species, defects, and severity (raw numbers).

  2. CALCULATE LOSS:
     - A "loss function" measures how WRONG the predictions were compared
       to the true labels (lower = better).
     - Loss function for species: CrossEntropyLoss (standard for classification)
     - Loss function for defects: BCELoss (binary cross entropy, for multi-label)

  3. BACKPROPAGATION (Backprop):
     - The optimizer calculates the GRADIENT — i.e. how to nudge each weight
       in the model to slightly reduce the loss.
     - This is done automatically by PyTorch's autograd engine.

  4. OPTIMIZER STEP:
     - The optimizer (AdamW) applies those nudges to update all model weights.
     - Learning Rate controls HOW BIG those nudges are (0.0001 is a safe start).

  5. REPEAT for all batches, then repeat for all epochs.

After training, we SAVE the model weights to disk as a .pt (PyTorch) file,
then EXPORT to .onnx (ONNX Runtime) for fast deployment in the FastAPI server.

WHAT ACCURACY MEANS:
 - Species Accuracy 45% on synthetic data = EXPECTED (random patterns)
 - Species Accuracy 85%+ on real DENR data = TARGET for thesis acceptance

HOW TO RUN:
  cd backend
  python scripts/train.py
"""

import os
import sys
import time

# Ensure the backend/ directory is on the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR

from app.ml.fusion_model import LumbrScanFusionModel
from app.ml.dataset import TimberPairedDataset, get_train_transforms, get_val_transforms
from app.ml.constants import SPECIES_CLASSES

# ============================================================
# TRAINING CONFIGURATION
# ============================================================
DATA_DIR        = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
CHECKPOINT_DIR  = os.path.join(os.path.dirname(__file__), "..", "app", "ml", "weights")
BEST_MODEL_PATH = os.path.join(CHECKPOINT_DIR, "lumbrscan_best.pt")

EPOCHS        = 3       # Set to 3 for pipeline verification; increase to 30+ for real training
BATCH_SIZE    = 16      # Images per batch (reduce to 8 if you get memory errors)
LEARNING_RATE = 1e-4    # How fast the model learns (0.0001 is a safe starting point)
NUM_WORKERS   = 0       # Set to 0 on Windows (multiprocessing limitations)

os.makedirs(CHECKPOINT_DIR, exist_ok=True)


# ============================================================
# LOSS FUNCTIONS
# ============================================================
# Species: exactly 1 correct species per image → CrossEntropyLoss
species_loss_fn = nn.CrossEntropyLoss()

# Severity: exactly 1 severity level per image → CrossEntropyLoss
severity_loss_fn = nn.CrossEntropyLoss()

# Note: defect detection requires per-sample defect label data (multi-label)
# For the synthetic dataset we train only species & severity to keep it simple.
# When real DENR data arrives with defect annotations, defect_loss_fn will be activated.


# ============================================================
# TRAINING LOOP
# ============================================================

def train_one_epoch(model, loader, optimizer, device, epoch):
    model.train()
    total_loss = 0.0
    correct_species = 0
    total_samples = 0

    for batch_idx, batch in enumerate(loader):
        cross   = batch["cross_section"].to(device)
        grain   = batch["wood_grain"].to(device)
        species = batch["species_label"].to(device)

        optimizer.zero_grad()

        # Forward pass through the fusion model
        outputs = model(cross, grain)

        # Calculate species classification loss
        loss = species_loss_fn(outputs["species"], species)

        # Backpropagation + weight update
        loss.backward()
        optimizer.step()

        # Accumulate metrics
        total_loss += loss.item()
        preds = outputs["species"].argmax(dim=1)
        correct_species += (preds == species).sum().item()
        total_samples += species.size(0)

        if (batch_idx + 1) % 5 == 0:
            print(f"  Epoch {epoch} | Batch {batch_idx+1}/{len(loader)} | "
                  f"Loss: {loss.item():.4f}", flush=True)

    avg_loss = total_loss / len(loader)
    accuracy = correct_species / total_samples * 100
    return avg_loss, accuracy


def validate(model, loader, device):
    model.eval()
    total_loss = 0.0
    correct_species = 0
    total_samples = 0

    with torch.no_grad():
        for batch in loader:
            cross   = batch["cross_section"].to(device)
            grain   = batch["wood_grain"].to(device)
            species = batch["species_label"].to(device)

            outputs = model(cross, grain)
            loss = species_loss_fn(outputs["species"], species)

            total_loss += loss.item()
            preds = outputs["species"].argmax(dim=1)
            correct_species += (preds == species).sum().item()
            total_samples += species.size(0)

    avg_loss = total_loss / len(loader)
    accuracy = correct_species / total_samples * 100
    return avg_loss, accuracy


# ============================================================
# MAIN TRAINING ENTRY POINT
# ============================================================

def main():
    print("=" * 60)
    print("LumbrScan - Model Training")
    print("=" * 60)

    # Detect hardware (GPU if available, otherwise CPU)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training device: {device}", flush=True)
    if device.type == "cpu":
        print("  [INFO] No GPU detected. Training on CPU is slower but works fine.", flush=True)
        print(f"  [INFO] Expected training time: ~1-2 minutes on CPU for {EPOCHS} epochs.", flush=True)

    # Load datasets
    print(f"\nLoading dataset from: {os.path.abspath(DATA_DIR)}")
    train_dataset = TimberPairedDataset(DATA_DIR, transform=get_train_transforms(), split="train")
    val_dataset   = TimberPairedDataset(DATA_DIR, transform=get_val_transforms(),   split="val")

    if len(train_dataset) == 0:
        print("\n[ERROR] No training images found!")
        print("  → First run: python scripts/generate_synthetic_dataset.py")
        sys.exit(1)

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True,  num_workers=NUM_WORKERS)
    val_loader   = DataLoader(val_dataset,   batch_size=BATCH_SIZE, shuffle=False, num_workers=NUM_WORKERS)

    # Instantiate model
    print("\nBuilding LumbrScan Fusion Model (EfficientNet-B0 pretrained)...")
    model = LumbrScanFusionModel(pretrained=True).to(device)
    print(f"  Parameters: {sum(p.numel() for p in model.parameters()):,}")

    # Optimizer & scheduler
    optimizer = AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=1e-4)
    scheduler = CosineAnnealingLR(optimizer, T_max=EPOCHS, eta_min=1e-6)

    # Training loop
    print(f"\nStarting training: {EPOCHS} epochs, batch size {BATCH_SIZE}\n", flush=True)
    best_val_acc = 0.0

    for epoch in range(1, EPOCHS + 1):
        start = time.time()
        train_loss, train_acc = train_one_epoch(model, train_loader, optimizer, device, epoch)
        val_loss,   val_acc   = validate(model, val_loader, device)
        scheduler.step()
        elapsed = time.time() - start

        print(f"\nEpoch {epoch:03d}/{EPOCHS} | "
              f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.1f}% | "
              f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.1f}% | "
              f"Time: {elapsed:.1f}s", flush=True)

        # Save the best model weights
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), BEST_MODEL_PATH)
            print(f"  ★ New best model saved! Val Acc: {best_val_acc:.1f}%", flush=True)

    print(f"\nTraining complete! Best Validation Accuracy: {best_val_acc:.1f}%")
    print(f"Best model saved to: {BEST_MODEL_PATH}")
    print("\nNext step: export to ONNX for fast inference:")
    print("  python scripts/export_onnx.py")


if __name__ == "__main__":
    main()
