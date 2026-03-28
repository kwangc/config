# Model Algorithm — VLA Deepdive

This section is a structured deepdive into how Vision-Language-Action (VLA) models work at the algorithmic level. It covers everything from perception inputs and multimodal fusion through action representation, policy architecture, training strategies, generalization, and real-time deployment.

## Prerequisites

Before reading this section, make sure you are comfortable with:

- [ML Fundamentals](../../02-model-class/02-ml-fundamentals/) — NN layers, backprop, transformer overview, attention
- [LLM](../../02-model-class/03-llm/) — language model training, tokenization, prompting
- [VLM](../../02-model-class/04-vlm/) — visual grounding, CLIP-style encoders, vision-language alignment
- [VLA Overview](../../02-model-class/05-vla/) — VLA architecture variants, action representations, key challenges

## What This Section Covers

A VLA system is more than a model class — it is an engineering system with many interacting design decisions. This section unpacks each decision point: how images and language are encoded and fused, how actions are represented and predicted, how policies are trained at scale, and how they are deployed on physical hardware under real-time constraints. The pages here go deeper than the VLA overview page; they assume you know what a VLA is and want to understand how to build one correctly.

## Learning Path

Work through the pages in order. Each page builds on the previous one.

| Step | Page | What You Will Learn |
|------|------|---------------------|
| 1 | [02 — Deep Learning for VLA](./02-deep-learning-vla/) | The VLA mapping problem, encoder roles, loss functions, optimization in practice, overfitting |
| 2 | [03 — Perception Inputs](./03-perception-inputs/) | Camera types, ViT patch tokenization, depth/point clouds, proprioception, multi-camera fusion |
| 3 | [04 — Multimodal Fusion](./04-multimodal-fusion/) | How vision tokens and language tokens are aligned and combined |
| 4 | [05 — Action Space](./05-action-space/) | Joint vs end-effector space, delta vs absolute, bimanual, normalization |
| 5 | [06 — Action Heads](./06-action-heads/) | MLP regression, discrete tokenization, diffusion, flow matching — tradeoffs |
| 6 | [07 — Action Chunking](./07-action-chunking/) | Compounding error, chunk prediction, temporal ensemble, recurrence |
| 7 | [08 — Policy Architectures](./08-policy-architectures/) | RT-2, OpenVLA, ACT, Diffusion Policy, π0 — side-by-side comparison |
| 8 | [09 — Training Strategies](./09-training-strategies/) | BC, fine-tuning from VLM, co-training, cross-embodiment pre-training, data augmentation |
| 9 | [10 — Generalization](./10-generalization/) | Distribution shift taxonomy, failure modes, OOD detection, evaluation methodology |
| 10 | [11 — Inference & Deployment](./11-inference-deployment/) | Latency budgets, quantization, hardware choices, safety gates, deployment checklist |

## Key Concepts at a Glance

**The core VLA loop:**

```
camera frames + language instruction + proprioceptive state
        |
   [vision encoder] [language encoder] [state encoder]
        |
   [fusion: projection / cross-attention / concatenation]
        |
   [backbone: transformer / LLM]
        |
   [action head: MLP / tokenizer / diffusion / flow]
        |
   action vector (delta pose, joint targets, gripper state)
        |
   [safety gate]
        |
   robot hardware
```

**Three big design decisions** every VLA practitioner must make:

1. What backbone to use (pretrained LLM vs lightweight transformer vs CNN)
2. How to represent and decode actions (tokenization vs continuous regression vs generative)
3. How to train (behavior cloning only vs co-training vs RL fine-tuning)

Each of the pages in this section unpacks the tradeoffs for one of these decisions or a related sub-problem.

## See Also

- [02 — Deep Learning for VLA](./02-deep-learning-vla/)
- [03 — Perception Inputs](./03-perception-inputs/)
- [04 — Multimodal Fusion](./04-multimodal-fusion/)
- [05 — Action Space](./05-action-space/)
- [06 — Action Heads](./06-action-heads/)
- [07 — Action Chunking](./07-action-chunking/)
- [08 — Policy Architectures](./08-policy-architectures/)
- [09 — Training Strategies](./09-training-strategies/)
- [10 — Generalization](./10-generalization/)
- [11 — Inference & Deployment](./11-inference-deployment/)
- [VLA Overview](../../02-model-class/05-vla/)

## Food for Thought

- If you find yourself choosing an action head before settling on your control frequency and acceptable latency budget, you have reversed the design order — hardware constraints should drive architecture choices, not the other way around.
- If a VLA policy performs well in evaluation but fails on the first physical robot trial, the gap is almost always in perception inputs or action space normalization, not in the backbone — start debugging there.
- If the training dataset for your VLA contains fewer than 1,000 unique scenes, no amount of architecture sophistication will produce generalizable behavior; data diversity is the first multiplier.
- If you are building a VLA for a new robot morphology, the single highest-leverage investment is a well-designed action space (normalized, delta, end-effector) — everything else can be adapted from existing open-source architectures.
