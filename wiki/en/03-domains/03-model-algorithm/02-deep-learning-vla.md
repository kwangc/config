# Deep Learning for VLA — Foundations

This page covers the deep learning mechanics that underpin VLA systems: how the mapping problem is framed, what each encoder contributes, which loss functions are used, and how optimization is managed in practice.

## The VLA Mapping Problem

A VLA policy is a function:

```
f(image_t, language, state_t) → action_t
```

At each timestep the policy consumes one or more camera frames, a natural-language task description, and the current robot proprioceptive state, and outputs an action command. This looks superficially like classification or regression, but it is harder in three ways:

**Non-stationarity.** The correct action depends on the current state, which changes as a result of previous actions. The training distribution (demonstrations) reflects a specific trajectory of states; at deployment the policy visits states that diverge from that trajectory as soon as any error is made.

**Continuous, high-dimensional output.** A 6-DOF end-effector action with a gripper state is a 7-dimensional continuous vector. Predicting it requires either regression (with the risk of mode-averaging) or generative decoding (with the cost of slower inference).

**Multi-modality.** For many manipulation tasks, multiple action sequences are correct. A policy trained with naive MSE will average the modes — producing an action that is wrong for all of them. This is the core motivation for diffusion and flow-matching action heads.

**Temporal dependency.** The policy must implicitly track task progress (have I picked up the object? has the drawer opened?). A single-frame, stateless policy struggles with this; action chunking and recurrent architectures are partial mitigations.

## Encoder Roles

### Vision Encoder (ViT)

A Vision Transformer encodes an input image into a sequence of patch tokens plus optionally a CLS token:

```
image (H × W × 3)
  → split into N patches (each patch_size × patch_size × 3)
  → linear projection to embedding dimension d
  → add positional embeddings
  → transformer encoder layers
  → sequence of N patch tokens + CLS token
```

For a 224×224 image with patch size 16, this produces (224/16)^2 = 196 patch tokens. The CLS token or a mean-pool of patch tokens is used as a global image representation; the full patch sequence is used when spatial detail matters for the action head.

**Why pretrained weights matter.** A ViT pretrained on ImageNet or CLIP has learned to recognize objects, textures, spatial relationships, and semantic categories from millions of images. Starting from random weights for robot vision requires orders of magnitude more data to reach similar feature quality. Pretrained encoders provide "free" visual understanding that would otherwise require enormous robot datasets.

### Language Encoder

Text instructions are tokenized and encoded into a sequence of dense embeddings. In LLM-backbone VLAs, the same transformer that processes language also processes visual tokens — the language encoder is the LLM itself. In lighter-weight VLAs, a frozen CLIP text encoder or BERT-style model provides text embeddings separately.

**The language embedding acts as a task conditioning signal.** The same physical manipulation can be described differently ("pick up the cup", "grasp the mug", "get the red object") — a good language encoder should map these to nearly identical representations. Pretrained language models already do this; training from scratch does not.

### State Encoder

Proprioceptive state (joint angles, velocities, end-effector pose, gripper state) is a low-dimensional continuous vector (typically 7–14 floats). It is usually:

1. Normalized to zero mean and unit variance (or clipped to [-1, 1]) using statistics from the training dataset
2. Encoded by a small MLP into a fixed-size embedding
3. Injected into the backbone as a prepended token or summed with CLS

Without proprioception the policy cannot reliably know where the robot's end-effector is relative to the target, especially when occlusions or limited camera coverage make it invisible in images.

## Loss Functions for VLA

The choice of loss function is tightly coupled with the action head design.

### MSE / Huber (Regression)

Used with MLP regression heads.

```
L_MSE = (1/T) * sum_t || a_hat_t - a_t ||^2

L_Huber = { 0.5 * (a_hat - a)^2           if |a_hat - a| < delta
           { delta * (|a_hat - a| - 0.5*delta)  otherwise
```

Huber loss is less sensitive to outlier demonstration actions than MSE. Both suffer from mode averaging: if the training data contains two equally valid actions for a given state, the loss minimum is between them, which may be physically invalid.

### Cross-Entropy (Discrete Tokenization)

Used when actions are quantized into discrete bins.

```
L_CE = -sum_k a_k * log(p_k)
```

Each action dimension is treated as a classification problem over B bins. The full action vector is predicted autoregressively as a sequence of tokens. This fits naturally into an LLM backbone. The cost: precision is limited by bin count, and autoregressive decoding is sequential (slow).

### Denoising Score Matching (Diffusion)

Used with diffusion action heads.

```
L_diffusion = E_{t,eps} [ || eps - eps_theta(a_t + sigma_t * eps, sigma_t, obs) ||^2 ]
```

The network learns to predict the noise added to an action at a given noise level. At inference, the network is run iteratively (typically 10–100 steps) starting from Gaussian noise to recover the clean action. Captures multimodal distributions; slower at inference.

### Flow Matching

Used with flow-matching action heads (e.g., π0).

```
L_flow = E_{t, a_0, a_1} [ || v_theta(a_t, t, obs) - (a_1 - a_0) ||^2 ]
```

Where a_0 ~ N(0,I), a_1 is the target action, and a_t = (1-t)*a_0 + t*a_1. The network learns the velocity field of a straight-line flow from noise to action. Simpler than diffusion; fewer inference steps needed (typically 10).

## Optimization in Practice

### AdamW

The standard optimizer for VLA fine-tuning. AdamW applies weight decay directly to weights (not to the adaptive gradient terms), which prevents large weights from accumulating and stabilizes fine-tuning of pretrained models.

```
theta_t = theta_{t-1} - lr * m_hat / (sqrt(v_hat) + eps) - lr * lambda * theta_{t-1}
```

Where lambda is the weight decay coefficient (typically 0.01–0.1 for VLA fine-tuning).

### Learning Rate Scheduling

**Cosine decay** is the standard schedule:

```
lr_t = lr_min + 0.5 * (lr_max - lr_min) * (1 + cos(pi * t / T))
```

Warm up linearly for the first 1–5% of steps (to avoid large gradient updates from the randomly initialized action head), then cosine decay to a small floor (lr_min ≈ 1e-6).

**Why VLA fine-tuning needs a small learning rate.** The backbone (LLM or VLM) contains pretrained weights encoding general visual and language understanding. A large learning rate (e.g., 1e-4 on the backbone) will overwrite these features within a few thousand steps — a phenomenon called **catastrophic forgetting**. Typical backbone LR during VLA fine-tuning: 1e-5 to 5e-6. The action head (randomly initialized) can use a larger LR (1e-4 to 1e-3) for the first phase of training.

### Gradient Clipping

```
if ||grad|| > max_norm:
    grad = grad * max_norm / ||grad||
```

Clips the global gradient norm to prevent exploding gradients, especially during early training when the randomly initialized action head produces large gradient magnitudes. Typical max_norm: 1.0.

### Mixed Precision Training

Use FP16 (or BF16) for forward and backward passes, with FP32 master weights for the optimizer update. BF16 is preferred for LLM-backbone VLAs because it has wider dynamic range (same exponent bits as FP32), reducing the risk of gradient underflow that can occur with FP16 during long training runs.

## Overfitting vs. Generalization

### The Small Robot Dataset Problem

Robot demonstration datasets are small relative to internet-scale vision-language datasets. A typical high-quality teleop dataset contains 100–10,000 demonstrations per task. The VLA backbone has millions to billions of parameters. Without regularization the model will memorize demonstrations rather than generalize to new scenes.

**Mitigations:**

- **Freeze the backbone** — only train the action head initially; the backbone's pretrained features act as a strong prior
- **LoRA fine-tuning** — train low-rank adapter matrices (r=8 to 64) instead of full backbone weights; far fewer parameters to overfit
- **Early stopping** — monitor validation loss on held-out demonstrations; stop before the action head starts fitting training-set artifacts

### Co-Training as a Regularizer

Mixing robot data with internet vision-language data (image captioning, VQA, etc.) during training prevents the backbone from forgetting its general visual features. The internet data acts as a constraint that keeps the backbone representations broad. RT-2 showed this significantly improves generalization to novel instructions.

### Data Augmentation

For visual inputs: random crop, color jitter (hue, saturation, brightness), Gaussian blur, random horizontal flip (with corresponding action sign flip). The goal is to prevent the policy from relying on spurious correlations between background appearance and action.

For proprioceptive inputs: small Gaussian noise on joint angles in demonstrations forces the policy to produce robust actions near the demonstrated trajectory.

## See Also

- [01 — Overview](./01-overview/)
- [03 — Perception Inputs](./03-perception-inputs/)
- [04 — Multimodal Fusion](./04-multimodal-fusion/)
- [06 — Action Heads](./06-action-heads/)
- [09 — Training Strategies](./09-training-strategies/)
- [VLA Overview](../../02-model-class/05-vla/)

## Food for Thought

- If your VLA's training loss converges quickly but deployment performance is poor, the model has memorized background appearance cues in the training environments — aggressive image augmentation and environment diversity are the fix, not a larger model.
- If you are fine-tuning an LLM backbone on robot data and the robot's language generalization degrades, your learning rate on the backbone is too high — 5e-6 or lower with cosine warmup almost always preserves language understanding.
- If your action head uses MSE loss and the robot hesitates between two grasp orientations, the multimodality of the demonstration data is being averaged to a wrong middle value — switch to a diffusion or flow-matching head before adding more data.
