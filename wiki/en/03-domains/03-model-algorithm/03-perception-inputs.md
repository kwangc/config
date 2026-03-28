# Perception Inputs for VLA

The quality and diversity of perception inputs is one of the highest-leverage factors in VLA performance. This page covers the sensor types, tokenization strategies, and multi-camera fusion methods used in modern VLA systems.

## Image Inputs

### Camera Types and Placement

| Camera type | Placement | Typical use | Strengths | Weaknesses |
|-------------|-----------|-------------|-----------|------------|
| Third-person (overhead) | Fixed, above workspace | Scene overview, object localization | Wide field of view, stable | Distance from end-effector, occlusion from arm |
| Wrist camera | Mounted on end-effector | Close-range manipulation, contact | High resolution at action site | Moves with arm (unstable view), limited scene context |
| Egocentric (head-mounted) | Robot head / eye-in-hand | Navigation + manipulation combined | Natural human-like view | Parallax with arm; calibration required |
| Side camera | Fixed, lateral | Depth estimation, grasp angle | Complementary angle | Additional calibration, more tokens |

Most manipulation VLAs use **at least two cameras**: one overhead/third-person for scene context and one wrist camera for contact-level precision. The wrist camera is often the single most informative view for determining whether a grasp is succeeding.

### Typical Resolutions

- **224×224**: Standard ViT input; used in most VLA pipelines (RT-2, OpenVLA, π0); fast; sufficient for picking and placing
- **256×256 or 320×240**: Slightly higher; used when fine grasping details matter
- **640×480**: Full webcam resolution; rarely fed directly to ViT — usually downsampled first; used for visualization or non-ViT processing
- **Higher (1280×720)**: Only when subregion cropping is done before the ViT; wrist cameras sometimes use this to crop a 224×224 region around the end-effector

Higher resolution is rarely worth the token count increase unless the task requires reading text on objects or distinguishing fine-grained visual features.

## ViT Patch Tokenization

A Vision Transformer (ViT) converts an image into a sequence of tokens through the following steps:

```
Input: H × W × C image  (e.g., 224 × 224 × 3)

Step 1: Split into non-overlapping patches
  - patch size P × P  (e.g., P=16)
  - number of patches: N = (H/P) * (W/P) = 196  (for 224×224, P=16)

Step 2: Flatten each patch to a vector
  - each patch: P * P * C = 768 values (for P=16, C=3)

Step 3: Linear projection to embedding dimension d
  - patch_embed: (P*P*C,) → (d,)  where d is typically 768 or 1024

Step 4: Add learnable positional embeddings

Step 5: Prepend [CLS] token (optional)

Step 6: Pass through L transformer encoder layers
  - output: N patch tokens + optional CLS token, each of dimension d
```

### Patch Size Tradeoff

| Patch size | Patches (224×224) | Token sequence length | Spatial resolution | Compute |
|------------|-------------------|-----------------------|--------------------|---------|
| 32×32 | 49 | 49 | Coarse | Fast |
| 16×16 | 196 | 196 | Medium | Moderate |
| 8×8 | 784 | 784 | Fine | 4× slower than P=16 |
| 4×4 | 3136 | 3136 | Very fine | Very slow |

For manipulation tasks requiring contact detection or gripper-scale features, P=8 or P=14 (as used in SigLIP) provides meaningfully better spatial resolution at acceptable compute cost. For scene-level understanding (object localization, scene parsing) P=16 or P=32 is usually sufficient.

### CLS Token vs. Pooling

- **CLS token**: a learned token prepended to the sequence; after transformer layers, the CLS representation aggregates global image information; used for image-level tasks (classification, language alignment)
- **Mean pooling**: average all patch token embeddings; similar to CLS but without a dedicated learned token; slightly different inductive bias
- **Full patch sequence**: pass all N patch tokens to the downstream module; necessary when spatial relationships matter for the action head; standard in modern VLAs

For VLA action prediction, the full patch sequence is almost always used — the action head needs spatial information about where objects are, not just a global scene descriptor.

## Depth and Point Clouds

### When Depth Helps

Depth adds explicit 3D geometry: how far away an object is, its 3D shape, surface normals. This is valuable for:

- Precise vertical placement (stacking, insertion)
- Occluded object estimation
- Grasping curved or irregular objects
- Any task where 2D image ambiguity about depth causes failures

### When to Skip Depth

Depth sensors add cost, calibration requirements, and latency. They also produce additional tokens or channels that increase model complexity. Skip depth when:

- Task can be solved with stereo cues from two RGB cameras
- Sensor cost is a constraint
- Depth data is noisy (transparent objects, shiny surfaces cause structured-light / ToF failure)
- The robot's workspace is well-constrained (table height known, object placement range known)

### Representations

- **Dense depth map**: same H×W grid as RGB, each pixel stores distance; concatenated as an extra channel (RGBD input); treated identically to RGB in ViT with minor modification to input projection
- **Point cloud**: 3D coordinates per pixel; typically processed by PointNet or sparse 3D convolutions before being combined with RGB tokens; richer but heavier pipeline
- **Sparse keypoints**: only encode depths at detected object keypoints; lightweight but requires a keypoint detection stage

## Proprioception

Proprioceptive state is the robot's internal sensor reading — it tells the policy the current configuration of the robot's body.

### What Is Included

| Signal | Symbol | Typical dim | Description |
|--------|--------|-------------|-------------|
| Joint angles | q | 6–7 per arm | Current joint positions in radians |
| Joint velocities | dq | 6–7 per arm | Current joint angular velocities |
| End-effector position | xyz | 3 | Cartesian position of end-effector |
| End-effector orientation | quat or euler | 4 or 3 | Rotation of end-effector |
| Gripper state | g | 1–2 | Gripper open/close position or force |
| Tactile / force-torque | ft | 6 | Wrist force-torque sensor (when available) |

For a typical 6-DOF arm with a parallel gripper, the full proprioceptive vector is around 20 floats.

### Why Proprioception Is Critical

The robot does not reliably "see" itself from cameras alone. The arm frequently occludes itself or the target object. Camera calibration errors compound over arm configurations. Even with no occlusion, predicting fine motor movements from pixels is extremely data-hungry.

Proprioception is zero-noise ground truth about the robot's own state. Policies that have access to proprioception converge faster, achieve better precision, and generalize better across lighting and background changes — because the action can be conditioned on exact joint positions rather than visually estimated ones.

### How to Encode Proprioception

**Normalization first:**

```
q_norm = (q - q_mean) / q_std    # using training set statistics
```

Or hard clip to [-1, 1] using joint limits:

```
q_norm = 2 * (q - q_min) / (q_max - q_min) - 1
```

**Injection strategies:**

1. **Concatenate as extra tokens**: MLP(proprio) → embedding of dimension d, prepend to token sequence; the transformer attends to proprio as part of the input context
2. **Add to CLS token**: MLP(proprio) → added to CLS embedding; lightweight but loses fine-grained control information
3. **Append to observation vector**: Flatten all tokens, concatenate proprio, feed to action head MLP; only works for small models where flattening is feasible

Strategy 1 (prepend as token) is the most common in modern VLAs.

## Wrist Camera Special Case

The wrist camera is mounted on or near the robot's end-effector. It provides a close-range, gripper-centric view of the manipulation scene. Key properties:

- **Moves with the arm**: unlike fixed cameras, the view changes as the arm moves; the image directly reflects the end-effector's approach trajectory
- **High correlation with gripper state**: what is visible in the wrist camera is exactly what the gripper is interacting with; this makes it the most informative view for contact-level tasks (inserting a plug, grasping a small object)
- **Close-range detail**: can resolve millimeter-scale features invisible to overhead cameras
- **Latency sensitivity**: because the camera moves, motion blur at high arm speeds can degrade image quality; this is a practical consideration for control frequency

For bimanual setups, each arm typically has its own wrist camera — doubling the token count from close-range views.

## Multi-Camera Fusion

### Token Concatenation

The simplest approach: run each camera through its own ViT, collect the token sequences, concatenate them all, and feed the combined sequence to the backbone transformer.

```
tokens_cam1: N1 tokens  (e.g., 196 for 224×224 P=16)
tokens_cam2: N2 tokens
tokens_lang: L tokens
tokens_prop: 1 token

combined: N1 + N2 + L + 1 tokens
```

This works but token count grows linearly with camera count, increasing self-attention compute quadratically. With 3 cameras and a language sequence of 50 tokens, the combined sequence is ~650 tokens — manageable.

### Separate ViTs vs. Shared Weights

| Approach | Parameters | When to use |
|----------|------------|-------------|
| Separate ViT per camera | 3× ViT params | Cameras have very different statistical properties (e.g., wrist vs overhead) |
| Shared ViT weights | 1× ViT params | Cameras have similar image distributions; reduces overfitting; more common |

In practice, sharing ViT weights across all cameras (with different positional embeddings or a camera-ID embedding) reduces parameters, enables more data-efficient training, and often performs as well or better than separate ViTs.

### Positional/Camera Embedding

When using shared ViT weights for multiple cameras, differentiate them with a **camera ID embedding**: a learned vector added to all tokens from that camera before the backbone. This lets the backbone know which camera the tokens came from without requiring separate weights.

## See Also

- [01 — Overview](./01-overview/)
- [02 — Deep Learning for VLA](./02-deep-learning-vla/)
- [04 — Multimodal Fusion](./04-multimodal-fusion/)
- [05 — Action Space](./05-action-space/)
- [VLM](../../02-model-class/04-vlm/)

## Food for Thought

- If your VLA generalizes well in lab environments but fails at customer sites, the first thing to check is not the model — it is whether the new lighting, backgrounds, and object appearances fall within the ViT's visual distribution; adding a wrist camera often provides an invariant close-range view that compensates for distant scene variation.
- If you add a depth channel and performance does not improve, the likely reason is that the ViT patch tokenizer was not adapted to handle the RGBD input properly — depth values have a very different magnitude and distribution than RGB and must be normalized separately before projection.
- If token count is your deployment bottleneck, switching from P=16 to P=32 halves the sequence length with minimal performance loss on coarse manipulation tasks; wrist-camera resolution is where spatial detail matters most, so keep P small there.
- If proprioception is missing from your training pipeline and your policy fails at fine placement, it is because the policy is trying to infer the end-effector's exact position from pixels alone — this requires far more data than providing it directly; add proprio before adding more cameras.
