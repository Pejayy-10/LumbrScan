"""
LumbrScan Multi-Modal Fusion Model
===================================
BEGINNER EXPLANATION — READ THIS FIRST:

This file defines the BRAIN of LumbrScan. Here's how it works in plain English:

WHAT IS A NEURAL NETWORK?
--------------------------
Think of a neural network as a pipeline of math operations. You feed in an image,
and it spits out predictions. We need to TRAIN it by showing it thousands of timber
images so it learns the visual patterns for each species.

WHAT IS TRANSFER LEARNING?
---------------------------
Training a neural network from zero requires millions of images and weeks of time.
Instead, we use EfficientNet-B0, a model that was ALREADY trained on 1.2 million
images. It already knows how to detect shapes, textures, and edges. We just need to
FINE-TUNE it on timber images (which requires far fewer images — as few as 50-100
per class).

WHAT IS A FUSION MODEL?
------------------------
A fusion model uses MULTIPLE inputs (modalities) and combines their knowledge:

  Input 1: Cross-Section Photo  → goes through EfficientNet Backbone 1
  Input 2: Wood Grain Photo     → goes through EfficientNet Backbone 2

Each backbone converts its image into a list of 1,280 numbers called a "feature vector".
Think of it like a fingerprint — those 1,280 numbers encode everything the backbone
noticed about the image (pore sizes, grain direction, texture roughness, etc.)

After both backbones produce their feature vectors, we CONCATENATE them:
  [1280 numbers from cross-section] + [1280 numbers from wood grain]
  = [2560 numbers] describing the timber from BOTH views simultaneously

Then 3 separate "prediction heads" look at those 2,560 numbers and each makes
a different kind of prediction:
  - Head 1: "Which of the 11 species is this?" (softmax — outputs probabilities)
  - Head 2: "Which defects are present?" (sigmoid — can output multiple at once)
  - Head 3: "How severe is the damage?" (softmax — outputs 1 of 4 levels)

WHAT IS DYNAMIC MASKING?
-------------------------
If a user only has 1 modality (e.g. only a cross-section photo with no grain photo),
we fill the missing input with a tensor of zeros. The gating mechanism in the
fusion layer learns to ignore the blank modality and rely only on available data.
This means the model works even with just 1 image uploaded!
"""

import torch
import torch.nn as nn
import torchvision.models as models
from app.ml.constants import (
    NUM_SPECIES,
    NUM_DEFECTS,
    NUM_SEVERITY,
    EFFICIENTNET_FEATURE_DIM,
    FUSION_DIM,
)


# ===========================================================================
# STEP 1: BACKBONE FEATURE EXTRACTOR
# ===========================================================================
class ModalityBackbone(nn.Module):
    """
    A single EfficientNet-B0 feature extractor for one image modality.

    It loads the pretrained EfficientNet-B0, removes its original
    classification head (which classified 1000 ImageNet categories),
    and replaces it with a plain feature extractor that outputs a
    1,280-dimensional feature vector.

    Parameters:
        pretrained (bool): Load ImageNet weights. Set False only for unit tests.
    """

    def __init__(self, pretrained: bool = True):
        super().__init__()

        # Load EfficientNet-B0 with ImageNet pre-trained weights
        weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
        efficientnet = models.efficientnet_b0(weights=weights)

        # Remove the final classifier layer (keeps only the feature extractor)
        # efficientnet.classifier is: [Dropout, Linear(1280 → 1000)]
        # We replace it with an Identity (no-op) to expose raw 1280 features
        self.features = efficientnet.features   # Convolutional layers
        self.pool = efficientnet.avgpool         # Global average pooling → [B, 1280, 1, 1]
        self.flatten = nn.Flatten()              # Reshape to [B, 1280]

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass: image tensor → 1280-dimensional feature vector.
        x shape: [batch_size, 3, 224, 224]  (3=RGB channels)
        output:  [batch_size, 1280]
        """
        x = self.features(x)   # Convolutional feature maps
        x = self.pool(x)       # Pool to [batch, 1280, 1, 1]
        x = self.flatten(x)    # Flatten to [batch, 1280]
        return x


# ===========================================================================
# STEP 2: ATTENTION GATE (Dynamic Modality Masking)
# ===========================================================================
class ModalityAttentionGate(nn.Module):
    """
    A small learnable gate that decides how much weight to give to each
    modality's feature vector.

    Why this matters: if one modality image is missing (all zeros), the gate
    will learn to give it ~0 weight and rely entirely on the available modality.
    This makes the model robust to single-modality inputs.
    """

    def __init__(self, feature_dim: int = EFFICIENTNET_FEATURE_DIM):
        super().__init__()
        # A small MLP that takes BOTH feature vectors and outputs 2 attention scalars
        self.gate = nn.Sequential(
            nn.Linear(feature_dim * 2, 128),
            nn.ReLU(),
            nn.Linear(128, 2),
            nn.Softmax(dim=1),   # Outputs [w1, w2] where w1 + w2 = 1.0
        )

    def forward(self, feat1: torch.Tensor, feat2: torch.Tensor) -> tuple:
        combined = torch.cat([feat1, feat2], dim=1)   # [B, 2560]
        weights = self.gate(combined)                  # [B, 2]
        w1 = weights[:, 0:1]   # Weight for modality 1
        w2 = weights[:, 1:2]   # Weight for modality 2
        # Scale each feature vector by its learned weight
        return feat1 * w1, feat2 * w2


# ===========================================================================
# STEP 3: PREDICTION HEADS
# ===========================================================================
class SpeciesHead(nn.Module):
    """Head 1: Predicts which of the 11 Philippine timber species this is."""
    def __init__(self):
        super().__init__()
        self.classifier = nn.Sequential(
            nn.Linear(FUSION_DIM, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, NUM_SPECIES),
            # NOTE: No softmax here — PyTorch's CrossEntropyLoss expects raw logits
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.classifier(x)   # [B, 11]


class DefectHead(nn.Module):
    """
    Head 2: Detects which defects are present (Multi-Label).

    Unlike species (exactly 1 answer), timber can have MULTIPLE defects at once
    (e.g. decay_rot AND unsound_knots simultaneously). We use sigmoid instead of
    softmax so each defect outputs an independent 0–1 probability.
    """
    def __init__(self):
        super().__init__()
        self.classifier = nn.Sequential(
            nn.Linear(FUSION_DIM, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, NUM_DEFECTS),
            nn.Sigmoid(),   # Independent 0–1 probability per defect class
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.classifier(x)   # [B, 5]  (one score per defect)


class SeverityHead(nn.Module):
    """Head 3: Predicts overall defect severity: none / low / moderate / severe."""
    def __init__(self):
        super().__init__()
        self.classifier = nn.Sequential(
            nn.Linear(FUSION_DIM, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, NUM_SEVERITY),
            # No softmax — CrossEntropyLoss handles it
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.classifier(x)   # [B, 4]


# ===========================================================================
# STEP 4: THE FULL FUSION MODEL (Puts It All Together)
# ===========================================================================
class LumbrScanFusionModel(nn.Module):
    """
    The complete LumbrScan 2-Modality Late Fusion Neural Network.

    Architecture:
        Cross-Section Image → Backbone 1 → Feature Vector 1 (1280)  ─┐
                                                                       ├→ Attention Gate → Concatenate (2560) → [Head 1, Head 2, Head 3]
        Wood Grain Image    → Backbone 2 → Feature Vector 2 (1280)  ─┘

    Outputs (all in a single forward pass):
        - species_logits:  [B, 11] — raw scores for 11 species
        - defect_probs:    [B, 5]  — independent probability per defect (0.0–1.0)
        - severity_logits: [B, 4]  — raw scores for 4 severity levels
    """

    def __init__(self, pretrained: bool = True):
        super().__init__()

        # Two separate backbones — one per modality
        self.backbone_cross = ModalityBackbone(pretrained=pretrained)
        self.backbone_grain = ModalityBackbone(pretrained=pretrained)

        # Dynamic attention gating
        self.attention_gate = ModalityAttentionGate()

        # Shared dense fusion layer (applied BEFORE the heads)
        self.fusion_fc = nn.Sequential(
            nn.Linear(FUSION_DIM, FUSION_DIM),
            nn.BatchNorm1d(FUSION_DIM),
            nn.GELU(),
            nn.Dropout(0.4),
        )

        # Three task-specific prediction heads
        self.species_head  = SpeciesHead()
        self.defect_head   = DefectHead()
        self.severity_head = SeverityHead()

    def forward(
        self,
        cross_section: torch.Tensor,
        wood_grain: torch.Tensor,
    ) -> dict[str, torch.Tensor]:
        """
        Forward pass through the complete fusion network.

        Args:
            cross_section: Tensor [B, 3, 224, 224] — end-grain image(s)
            wood_grain:    Tensor [B, 3, 224, 224] — surface grain image(s)
                           (if missing, pass a zero tensor of the same shape)

        Returns:
            dict with keys: 'species', 'defects', 'severity'
        """
        # --- Extract features from each modality ---
        feat_cross = self.backbone_cross(cross_section)   # [B, 1280]
        feat_grain = self.backbone_grain(wood_grain)      # [B, 1280]

        # --- Apply attention gating ---
        feat_cross, feat_grain = self.attention_gate(feat_cross, feat_grain)

        # --- Concatenate features from both modalities ---
        fused = torch.cat([feat_cross, feat_grain], dim=1)   # [B, 2560]

        # --- Shared dense fusion layer ---
        fused = self.fusion_fc(fused)   # [B, 2560]

        # --- Three prediction heads ---
        return {
            "species":  self.species_head(fused),    # [B, 11]
            "defects":  self.defect_head(fused),     # [B, 5]
            "severity": self.severity_head(fused),   # [B, 4]
        }
