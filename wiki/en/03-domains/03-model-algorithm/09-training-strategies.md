# Training Strategies for VLA

How you train a VLA is as important as how you design its architecture. This page covers the full training spectrum: from basic behavior cloning through VLM fine-tuning, co-training, and cross-embodiment pretraining.

## Behavior Cloning (BC) Baseline

Behavior cloning is the simplest form of imitation learning: train the policy to reproduce demonstrated actions.

```
Dataset: D = {(obs_i, action_i)}  collected from human demonstrations

Training loop:
  for each (obs, a_demo) in D:
    a_pred = policy(obs)
    loss = L(a_pred, a_demo)   # MSE, cross-entropy, or score matching
    loss.backward()
    optimizer.step()
```

**What BC gives you:**
- A policy that imitates the style and quality of the demonstrator
- Fast to train (supervised learning; no RL reward needed)
- Performance scales with demonstration quality and diversity

**What BC does not give you:**
- Recovery behaviors (the demonstrator never made mistakes, so the policy never learned to recover)
- Generalization beyond the demonstration distribution (new objects, backgrounds, instructions)
- Optimality (the demonstrator may not have executed the optimal strategy)

**Data requirements for BC.** As a rough empirical rule:
- 10–50 demos: sufficient for a single, narrow task with a fixed scene
- 100–500 demos: generalizes across minor scene variations (object placement, color)
- 1,000+ demos: needed for robust generalization across multiple object types and backgrounds
- 10,000+ demos: needed for multi-task generalization across diverse instructions

## Data Collection: Teleop vs. Scripted vs. Simulation

| Method | Data quality | Diversity | Cost | Scalability | Sim2real gap |
|--------|-------------|-----------|------|-------------|--------------|
| Human teleoperation | High (natural motion) | High | Expensive (human hours) | Limited | None |
| Scripted policy | Medium (clean) | Low (designed scenarios) | Cheap | High | None |
| Simulation + scripted | Medium | High (randomizable) | Cheap | Very high | Yes (must bridge) |
| Simulation + RL | High (optimal) | High | Moderate compute | Very high | Yes |
| Semi-autonomous (human + robot) | Medium-high | Medium | Moderate | Moderate | None |

**Typical data collection pipeline for a production VLA:**
1. Collect 50–200 human teleop demos in target environment (seed data)
2. Train initial policy on seed data
3. Run policy with human correction / intervention to generate more data
4. Iterate

The "intervention loop" (also called DAgger or its variants) is key to reaching beyond the initial demonstration distribution.

## Fine-Tuning from VLM

Starting from a pretrained VLM (LLaVA, PaliGemma, InstructBLIP, etc.) is the standard approach for building a language-capable VLA.

### Phase 1: Frozen backbone, train action head only

```
LR schedule:
  vision encoder: frozen (LR = 0)
  LLM backbone: frozen (LR = 0)
  projection layer: LR = 1e-4
  action head: LR = 1e-3

Duration: 10–50k steps on robot data
Goal: initialize action head to reasonable outputs without destroying backbone
```

This phase is fast and cheap: only the small action head is updated.

### Phase 2: Full fine-tuning with small LR

```
LR schedule (cosine with warmup):
  vision encoder: LR = 1e-5 to 5e-6
  LLM backbone: LR = 1e-5 to 5e-6
  action head: LR = 1e-4

Warmup: 500-2000 steps
Duration: 50k-200k steps on mixed data (robot + internet)
```

Small LR on the backbone prevents **catastrophic forgetting** — the overwriting of pretrained language and visual features by robot-specific patterns. If the LR on the backbone exceeds 5e-5, the model will typically lose most of its language generalization within a few thousand steps.

### LoRA Fine-Tuning

Instead of updating all backbone weights, add low-rank adapter matrices to the attention layers:

```
Original weight: W (d_in × d_out)
LoRA decomposition: W' = W + A @ B
  A: (d_in × r),  B: (r × d_out),  r << d_in, d_out

Only A and B are trained. W is frozen.

Typical r: 8 to 64
Parameter reduction: from d_in*d_out to r*(d_in+d_out)
  For d_in=d_out=4096, r=16: 16.7M → 131k parameters per layer (128× reduction)
```

LoRA significantly reduces:
- Memory required for gradient computation (only A and B get gradients)
- Risk of catastrophic forgetting (frozen W preserves pretrained features)
- Training time (fewer parameters to optimize)

LoRA is the recommended approach for fine-tuning 7B+ models on robot data. Use rank r=16-32 for single-task fine-tuning; r=64 for multi-task.

## Co-Training with Web Data

Mixing robot data with internet vision-language data prevents the backbone from losing general visual and language understanding during fine-tuning.

**Mechanism:**
- Add image captioning, VQA, instruction-following examples to the training batch
- These examples do not have robot action targets — the loss is computed only on the language output
- The backbone's weights are constrained to remain close to their pretrained values (implicitly, through the internet data loss)

**Data ratio.** Empirically, robot data should be 5–20% of the training batch:
- Too low: robot task performance stays low
- Too high: catastrophic forgetting of language understanding

**Co-training improves generalization to novel instructions.** RT-2's key finding: a policy co-trained with VQA data can execute instructions like "place the bottle on the napkin that is the same color as the cup" without any direct training examples for this instruction phrasing — because it has seen similar compositional language in VQA data.

## Cross-Embodiment Pre-Training

Training a single policy on diverse robots, then fine-tuning on the target robot.

**Datasets:**
- **Open X-Embodiment (OXE):** 22 robot types, 1M+ trajectories, diverse manipulation tasks; publicly available
- **BridgeData V2:** 60k+ demonstrations across a single robot in 24 environments
- **RT-X:** Google's internal large-scale cross-robot dataset

**Why it works.** Despite differences in morphology, many manipulation subtasks share structure: approaching an object, grasping, placing. A policy trained across robots learns these shared representations. Fine-tuning adapts the robot-specific parts (action space, observation characteristics) while preserving the shared visual-motor features.

**Key challenge: action space heterogeneity.** Different robots have different joint configurations, workspace sizes, and control interfaces. Normalizing to a common action space (end-effector delta with normalized coordinates) is essential for cross-robot training.

**Fine-tuning from cross-embodiment checkpoint:**
- Use Phase 1 and Phase 2 fine-tuning as described above
- The action head may need reinitialization if the action space dimensionality changes
- Backbone fine-tuning LR: 1e-5 or lower (the cross-embodiment checkpoint is a better prior than a pure VLM checkpoint, so preserve it more carefully)

## Multi-Task Training

Training a single policy on multiple tasks simultaneously, conditioned on language instruction.

**Requirements:**
- Instruction diversity in dataset: each demo labeled with a natural language description
- Task balance: roughly equal representation of each task in training batches (otherwise the policy over-specializes)
- Instruction coverage: include paraphrases and synonyms so the policy generalizes across instruction phrasing

**Benefits:**
- Shared representations across tasks improve generalization
- Reduced total data requirements (tasks can share learned visual features)
- Single deployed model for many tasks

**Challenges:**
- Harder optimization: tasks may have conflicting gradients
- Task interference: improvements on one task can degrade another
- Instruction specificity: vague instructions ("pick up an object") lead to ambiguous training signal

**Mitigation: task gradient weighting.** Assign higher training weight to underperforming tasks; this is analogous to curriculum learning and helps balance multi-task training.

## Data Augmentation

### Image Augmentation

```
RandomCrop:      crop to 90-95% of original size, then resize back
ColorJitter:     randomly perturb brightness (±30%), contrast (±30%), saturation (±30%), hue (±10%)
GaussianBlur:    blur with random kernel size (applied 20-50% of the time)
GaussianNoise:   add N(0, sigma) noise with sigma=0.01-0.05
RandomFlip:      horizontal flip (only valid if action sign is correspondingly flipped)
```

**Important:** if you flip the image, you must also flip the action (e.g., negate the y-component of a delta end-effector action). Failing to do this corrupts the action-observation pairing.

### Proprioceptive Augmentation

Add small Gaussian noise to demonstrated joint angles:

```
q_aug = q_demo + N(0, sigma_q),  sigma_q ~ 0.01-0.03 radians
```

This forces the policy to be robust to slight deviations from the demonstrated trajectory — exactly the distribution it will face during deployment due to execution error.

### Camera Pose Perturbation

For fixed cameras: add small random perturbations to the camera extrinsics in simulation or to the rendered image (perspective warp). Teaches the policy to be invariant to small camera misalignments across sessions.

## Training Recipe Summary

| Strategy | Dataset requirement | Compute | Generalization | Typical use case |
|----------|---------------------|---------|----------------|------------------|
| BC from scratch | Small (50-500 demos) | Low | Low (in-distribution) | Single robot, fixed task |
| VLM fine-tuning (Phase 1+2) | Medium (500-5000 demos) | Medium | Medium (instruction variation) | Language-conditioned single robot |
| LoRA fine-tuning | Medium | Low-medium | Medium | Resource-constrained VLM adaptation |
| Co-training with web data | Medium robot + large web | High | High (novel instructions) | Production VLA with language generalization |
| Cross-embodiment pretraining | Very large (OXE or larger) | Very high | High (new robots, new tasks) | General-purpose manipulation system |
| Multi-task training | Large, diverse | High | High | Single deployed model, many tasks |

## See Also

- [01 — Overview](./01-overview/)
- [02 — Deep Learning for VLA](./02-deep-learning-vla/)
- [06 — Action Heads](./06-action-heads/)
- [08 — Policy Architectures](./08-policy-architectures/)
- [10 — Generalization](./10-generalization/)

## Food for Thought

- If your VLA fine-tuning runs show rapidly falling training loss but flat validation loss, you do not need a better architecture — you need more diverse demonstration data; the model is memorizing scene-specific appearance cues rather than learning task-relevant behavior.
- If co-training with web VQA data slows your training without obvious generalization benefit, the robot data fraction is too low (below 5%) — the backbone never has a chance to encode robot-relevant features; increase robot data proportion until the manipulation validation metric starts improving.
- If you try LoRA fine-tuning with r=8 and see lower performance than full fine-tuning, do not immediately increase rank — first check whether the action head (which should be fully fine-tuned, not LoRA) has sufficient capacity; LoRA rank matters less than full action head updates for most manipulation tasks.
- If cross-embodiment pre-training does not improve performance on your target robot compared to pure VLM fine-tuning, the likely cause is action space mismatch — verify that your robot's action space is normalized into the same coordinate frame and scale as the pretraining dataset.
