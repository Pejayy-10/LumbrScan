# ============================================================
# LumbrScan ML Backend - Domain Constants
# All 11 Philippine Timber Target Species & Defect Classes
# ============================================================

# --- Target Species ---
# These are the 11 exact species the neural network will learn to identify.
# Each string here must match the apiContract.json species IDs.
SPECIES_CLASSES = [
    "narra",        # Pterocarpus indicus - FPRDI Group II
    "ipil",         # Intsia bijuga       - FPRDI Group II
    "molave",       # Vitex parviflora    - FPRDI Group I
    "apitong",      # Dipterocarpus grandiflorus - FPRDI Group II
    "white_lauan",  # Shorea contorta     - FPRDI Group III
    "yakal",        # Shorea astylosa     - FPRDI Group I
    "gmelina",      # Gmelina arborea     - FPRDI Group III
    "coconut",      # Cocos nucifera      - FPRDI Group IV
    "acacia",       # Samanea saman       - FPRDI Group III
    "mango",        # Mangifera indica    - FPRDI Group IV
    "nangka",       # Artocarpus heterophyllus - FPRDI Group III
]

NUM_SPECIES = len(SPECIES_CLASSES)  # = 11

# --- Defect Classes (Multi-Label) ---
# The model can detect multiple defects on the same piece of timber at once.
DEFECT_CLASSES = [
    "decay_rot",         # Fungal wood decay - structural compromise
    "end_splitting",     # Longitudinal cracks at board ends
    "warping",           # Cupping, bowing, or twisting deformation
    "unsound_knots",     # Dead knots causing strength loss
    "insect_boreholes",  # Beetle or termite borehole evidence
]

NUM_DEFECTS = len(DEFECT_CLASSES)  # = 5

# --- Severity Levels ---
SEVERITY_CLASSES = ["none", "low", "moderate", "severe"]
NUM_SEVERITY = len(SEVERITY_CLASSES)  # = 4

# --- Image Preprocessing Constants ---
# EfficientNet-B0 was originally trained on 224x224 images
# We normalize using the same mean/std as ImageNet for best transfer learning
IMAGE_SIZE = 224
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

# --- Feature Extractor Output Size ---
# EfficientNet-B0's final feature map before classification is 1,280 numbers
EFFICIENTNET_FEATURE_DIM = 1280

# --- Fusion Layer Size ---
# We concatenate both modality feature vectors: 1280 + 1280 = 2560
FUSION_DIM = EFFICIENTNET_FEATURE_DIM * 2  # = 2560
