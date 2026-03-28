# Policy Architecture Patterns

This page compares the major VLA policy architectures side by side: their backbone choices, action heads, training data strategies, and key tradeoffs. Use this page when choosing an architecture or understanding what each system is built for.

## RT-2 (Robotics Transformer 2)

**Core idea:** Treat robot actions as text tokens. Fine-tune a large vision-language model to predict action token sequences the same way it predicts text.

**Architecture:**
- Backbone: PaLM-E (562B params) or PaLI (55B params) VLM
- Vision encoder: ViT-based image encoder
- Action representation: Discretized bin tokens appended to the text output
- Decoding: Standard autoregressive token prediction (same as text generation)

**Training:**
- Co-training: mix robot demonstration data with internet-scale VQA, captioning, and instruction-following data
- Robot data fraction: small (~5% of total training examples)
- Robot dataset: proprietary Google data; diverse manipulation tasks
- Loss: cross-entropy on all tokens (language + action tokens treated identically)

**Key insight:** Because action tokens are predicted by the same mechanism as text tokens, the model can leverage its language understanding to generalize to new instructions never seen in robot data. If the model understands "place the object to the left of the marker" from internet text, it can execute this instruction on the robot even without direct training data for it.

**Inference:**
- Autoregressive token decoding: one token per forward pass
- For 7 action dimensions × 1 token each = 7 LLM forward passes per action step
- At 7B–562B scale: 200ms–2s per action step depending on hardware

**Weaknesses:**
- Slow decoding due to sequential token generation
- Precision limited by bin count (typically 256 bins)
- Very large model (562B) not practical for on-robot deployment
- Requires proprietary Google infrastructure for full-scale training

## OpenVLA

**Core idea:** An open-source reproduction and improvement of RT-2, trained on publicly available data and releasable weights.

**Architecture:**
- Backbone: Llama-2 7B (language) + SigLIP ViT (vision)
- Fusion: visual tokens projected into LLM embedding space via linear projection (LLaVA-style)
- Action representation: discretized bin tokens (same as RT-2)
- Decoding: autoregressive

**Training:**
- Dataset: Open X-Embodiment (OXE) — publicly available cross-robot dataset (~22 robot types, 1M+ trajectories)
- Fine-tuning from LLaVA-style VLM checkpoint
- LoRA adapters for parameter-efficient fine-tuning

**Key insight:** 7B scale is sufficient for strong language generalization and manipulation performance on OXE benchmarks. Open weights enable community research that was previously gated behind proprietary models.

**Inference:** Same sequential decoding as RT-2; 7B model is feasible on a single consumer GPU (RTX 3090/4090) with 4-bit quantization at ~100ms per action step.

**Weaknesses:**
- Same precision and speed limitations as RT-2
- Action tokenization doesn't capture multimodal distributions
- Less manipulation precision than diffusion-based approaches on fine tasks

## ACT (Action Chunking with Transformers)

**Core idea:** Predict chunks of 100 future actions at once using a CVAE + transformer architecture. No LLM backbone required.

**Architecture:**
- Observation encoder: ResNet-18 or ViT for each camera
- Language conditioning: simple task embedding (BERT or fixed encoding); not a full LLM
- Backbone: small transformer (6 encoder + 6 decoder layers, d=256)
- Action head: CVAE (Conditional Variational Autoencoder)
  - Encoder: takes full action chunk → latent z
  - Decoder: transformer decodes z + observations → chunk of K=100 actions
- Chunk size: K=100 at 50 Hz (2 seconds of actions per call)
- Temporal ensemble: yes (K overlapping predictions blended with exp weights)

**Training:**
- Dataset: small, high-quality human teleop demonstrations (50–200 demos per task)
- Loss: MSE on action chunk + CVAE KL divergence term
- Training scale: hours on a single GPU; no massive pretraining needed

**Key insight:** CVAE latent variable z allows the model to handle multimodal demonstrations — the latent encodes which mode to execute. Action chunking handles temporal consistency. These two techniques together make ACT highly effective for bimanual manipulation.

**Performance:** State-of-art on bimanual manipulation benchmarks (ALOHA tasks) with minimal data. Trained new tasks in under 200 demos.

**Weaknesses:**
- Limited language generalization (small language encoder, no LLM)
- Does not benefit from internet-scale pretraining
- Performance drops significantly on tasks requiring broad semantic understanding

## Diffusion Policy

**Core idea:** Use a diffusion model as the action head, with a CNN or ViT observation encoder. No LLM.

**Architecture:**
- Observation encoder: CNN (ResNet-18) or ViT
- Action head: DDPM diffusion model
  - Denoising network: 1D temporal UNet or MLP
  - Action prediction: K-step chunk (K=16–32 typical)
  - Diffusion steps: 100 (or 16–20 with DDIM)
- Action representation: continuous (no binning)

**Training:**
- Dataset: teleop demonstrations; works well with <100 demos
- Loss: denoising score matching (MSE on predicted noise)

**Key insight:** Diffusion captures multimodal action distributions that single-step MSE policies cannot. For tasks with multiple valid grasp configurations or ambiguous approach directions, Diffusion Policy reliably converges to a valid mode rather than averaging them.

**Performance:** Outperforms MLP regression and implicit energy-based models on contact-rich manipulation benchmarks. The CNN-based version (not ViT) is fast enough for real-time control with DDIM inference.

**Weaknesses:**
- No language generalization (no LLM or large language encoder)
- DDPM inference: 100 steps × ~1ms = ~100ms per action; too slow without DDIM
- Does not benefit from VLM pretraining; limited visual generalization

## π0 (Physical Intelligence)

**Core idea:** Combine a large pretrained VLM backbone (PaliGemma) with a flow-matching action head; pre-train on massive cross-embodiment data; fine-tune per task.

**Architecture:**
- Backbone: PaliGemma (3B VLM: SigLIP + Gemma LLM)
- Fusion: vision tokens projected to LLM space via linear projection; robot state as prepended token
- Action head: flow matching over K-step action chunks (K=50)
- Inference: flow matching ODE with ~10 steps; fast enough for real-time

**Training:**
- Pre-training: large proprietary cross-embodiment robot dataset (multiple robot types, diverse tasks); possibly the largest VLA training dataset to date
- Fine-tuning: task-specific fine-tuning on target robot with small dataset (hours of demonstrations)
- Loss: flow matching velocity regression

**Key insight:** The combination of a large VLM backbone (for language and visual generalization) with a flow matching head (for precise, multimodal action generation) achieves both language generalization and manipulation precision — the two capabilities that have been in tension in prior systems.

**Performance:** Current state-of-the-art on many robotic manipulation benchmarks as of early 2025. Demonstrates strong zero-shot generalization to novel objects and instructions.

**Weaknesses:**
- Large VLM backbone (3B) requires substantial compute for fine-tuning and inference
- Proprietary pre-training data limits reproducibility
- Fine-tuning procedure is non-trivial (correct learning rates, LoRA config, data mixing)

## Comparison Table

| Architecture | Backbone | Action head | Training data scale | Inference speed | Language generalization | Manipulation precision |
|--------------|----------|-------------|---------------------|-----------------|-------------------------|------------------------|
| RT-2 | PaLM-E 562B | Discrete tokens | Very large (proprietary) | Very slow (~2s) | Excellent | Medium |
| OpenVLA | Llama-2 7B + SigLIP | Discrete tokens | Large (OXE, public) | Slow (~100ms) | Good | Medium |
| ACT | Small transformer | CVAE chunks | Small (~50-200 demos) | Fast (~20ms) | Poor | Excellent |
| Diffusion Policy | ResNet/ViT | DDPM diffusion | Small (~50-100 demos) | Medium (DDIM ~50ms) | None | Excellent |
| π0 | PaliGemma 3B | Flow matching | Very large (proprietary) | Medium (~30ms) | Excellent | Excellent |

## Key Design Axes

Every VLA architecture sits somewhere on four axes:

**Axis 1: LLM backbone vs. lightweight encoder**
- LLM backbone: strong language generalization, expensive compute, requires pretrained weights
- Lightweight encoder: fast, task-specific, no language generalization

**Axis 2: Tokenization vs. continuous action head**
- Tokenization: integrates naturally with LLM, limited precision, slow decoding
- Continuous (MLP/diffusion/flow): better precision, does not require LLM token prediction

**Axis 3: Single-step vs. chunked prediction**
- Single-step: maximally reactive, compounding error problem
- Chunked: temporally coherent, less reactive to mid-chunk surprises

**Axis 4: Task-specific training vs. cross-embodiment pretraining**
- Task-specific: fewer data requirements, limited generalization
- Cross-embodiment: requires massive data infrastructure, strong generalization payoff

The trend since 2023 is toward the combination of LLM backbone + continuous action head + chunking + cross-embodiment pretraining — exemplified by π0.

## See Also

- [01 — Overview](./01-overview/)
- [06 — Action Heads](./06-action-heads/)
- [07 — Action Chunking](./07-action-chunking/)
- [09 — Training Strategies](./09-training-strategies/)
- [VLA Overview](../../02-model-class/05-vla/)

## Food for Thought

- If you need to choose between RT-2/OpenVLA and ACT for a new task, the deciding factor is whether language generalization matters more than manipulation precision — ACT is nearly always more precise on a specific task with limited data, but OpenVLA can handle instruction variations that ACT cannot.
- If you are building a new VLA and π0 is the target to beat, note that the performance gap between π0 and prior systems is primarily due to pre-training data scale, not architecture — a π0-style architecture trained on only task-specific data will not outperform ACT on narrow benchmarks.
- If deployment compute is a hard constraint (e.g., on-robot inference on a Jetson AGX), the practical architecture space reduces to: ACT (fast, small), quantized OpenVLA (medium), or a distilled/pruned flow-matching head — the full π0 at 3B is borderline at real-time control rates.
- If your manipulation task requires both robust language understanding AND millimeter-level precision (e.g., language-conditioned assembly), no current open-source architecture fully solves this — π0's flow-matching head with PaliGemma is the closest, but you will likely still need task-specific fine-tuning to bridge the precision gap.
