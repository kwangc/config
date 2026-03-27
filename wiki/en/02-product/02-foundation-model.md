# Product — Foundation Model

Config's foundation model (CFG-1) for bimanual manipulation: a learned policy backbone trained on large-scale human action data, adapted quickly to a target robot/task using small task-specific teleoperation data.

---

## Overview

- **Role:** Foundation model for bimanual / general-purpose manipulation.
- **Model family:** CFG-1 (first-generation robot foundation model).
- **I/O (conceptual):** Vision + (optional) Language + Proprioception → Action/policy.

---

## 1) CFG-1: autoregressive policy with long-horizon memory

The tech preview describes CFG-1 as:

- **Autoregressive architecture** that maintains **long-horizon memory** to capture holistic task context.
- a **short sliding window** of recent frames to ensure **high-precision action prediction**.

This division lets the model “remember” the overall task state while still reacting precisely to the near-term visual/proprio signals needed for stable two-handed manipulation.

---

## 2) Encoding (how modalities become model inputs)

CFG-1’s inputs are designed to match the action representation produced by the Data Platform:

- **Vision:** image/video encoding for end-effector-relative cues and scene understanding.
- **Proprioception / state:** robot state and sensor encoding (including bimanual arm states).
- **Language (optional):** instruction/task encoding for instruction-following and semantic grounding.
- **Action representation:** the output space used by the system (joint/Cartesian/continuous representation), aligned with robot control needs.

---

## 3) Training: pretrain once, adapt fast

Training is guided by the tech preview’s “rapid adaptation” loop:

- **Pretraining:** trained on large-scale human action datasets produced by the Data Platform (and aligned action representations).
- **Task adaptation (fine-tuning):** for a new target robot/task, we fine-tune with a small amount of target-task teleop data.
- **Online improvement (closed loop):** after initial fine-tuning, we improve via online rollouts with human-in-the-loop intervention and strategy refinement.

The practical result: task-specific policy deployment is typically completed within **~48 hours**.

---

## 4) Evaluation & closing the loop

Evaluation is not only “offline success.” In this product approach:

- we validate generalization and safety requirements with benchmarks
- we validate usability via “closing the loop” in the physical world
- we measure how quickly the system improves with each iteration (timeline matters)

---

## 5) Key design tradeoffs

### Autoregressive vs. diffusion action head

CFG-1 uses an autoregressive action decoder (predicting action tokens sequentially, similar to RT-2). An alternative is a diffusion-based action head (e.g., Diffusion Policy), which models the action distribution as a denoising process.

| Aspect | Autoregressive | Diffusion head |
|--------|---------------|----------------|
| Multimodality | Via temperature/sampling | Natural (models full distribution) |
| Speed | Fast (1-2 forward passes) | Slower (10–100 denoising steps) |
| Training complexity | Standard cross-entropy | Score matching / DDPM objective |
| Long-horizon | Strong (memory baked into AR) | Weaker without explicit memory |

CFG-1's long-horizon memory requirement favors the autoregressive approach; diffusion heads are strong for contact-rich precision tasks (e.g., ACT-style action chunking).

### Action chunking

Predicting a chunk of future actions (e.g., 10 steps ahead) rather than one action at a time reduces the compounding error problem in behavior cloning. CFG-1 uses a sliding window of recent frames to stabilize high-precision prediction — a related idea.

### Embodiment generalization

CFG-1 is designed around Config's target embodiment (bimanual, hand-gripper-style end-effectors). The action representation is aligned to this embodiment. Generalizing to new embodiments requires re-estimating the action representation space and fine-tuning with target-robot teleop data.

---

## See also

- [About](../../01-company/about/)
- [Data Platform](../01-data-platform/)
- [VLA](../../03-domains/02-model-class/05-vla/)
- [Deployment](../../03-domains/08-deployment/01-deployment/)
