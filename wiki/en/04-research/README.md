# Research — Papers & technical reviews

Summaries of papers, technical blogs, and articles. One-line summary + key points + link.

---

## Papers

| Paper | Year | One-line summary | Keywords |
|-------|------|-----------------|---------|
| [Attention Is All You Need](./attention-is-all-you-need.md) | 2017 | Transformer architecture: replace recurrence with self-attention for parallel, long-range sequence modeling | #transformer #attention #foundation-model #LLM |
| [CLIP](./clip.md) | 2021 | Contrastive image-text pretraining on 400M web pairs enabling zero-shot visual classification — the foundation of the VLM era | #VLM #contrastive-learning #zero-shot #foundation-model |
| [Diffusion Policy](./diffusion-policy.md) | 2023 | Applies denoising diffusion models to visuomotor policy learning — predicts action chunks rather than single actions, handling multi-modal distributions | #policy-learning #diffusion #bimanual #imitation-learning |
| [ACT](./act.md) | 2023 | Action Chunking with Transformers + ALOHA hardware — first paper to show multi-step prediction is necessary for fine-grained bimanual manipulation | #bimanual #imitation-learning #action-chunking #manipulation |
| [BridgeData V2 & DROID](./bridge-droid.md) | 2023-24 | Two complementary large-scale robot manipulation datasets — BridgeV2 for task diversity (60k trajectories, single robot), DROID for environmental diversity (76k trajectories, real-world) | #dataset #benchmark #multi-embodiment |
| [OXE](./oxe.md) | 2023 | Cross-embodiment dataset aggregating 1M robot trajectories from 22 embodiments across 21 institutions; RT-X models show that diversity > specialization | #dataset #cross-embodiment #foundation-model #data |
| [RT-2](./rt-2.md) | 2023 | VLA that co-fine-tunes a web-scale VLM to output robot actions as language tokens | #VLA #foundation-model #data #sim2real |
| [Octo](./octo.md) | 2024 | Open-source generalist robot policy trained on OXE, optimized for fast fine-tuning on new robots; diffusion-based action head for smooth trajectories | #VLA #open-source #foundation-model #diffusion |
| [OpenVLA](./openvla.md) | 2024 | Open-source 7B VLA trained on 970k robot trajectories that matches or exceeds 55B closed models | #VLA #open-source #foundation-model #data |
| [π0](./pi0.md) | 2024 | VLA foundation model combining a PaliGemma VLM backbone with a flow matching action expert for dexterous, continuous manipulation | #VLA #flow-matching #foundation-model #dexterous |
| [SmolVLM](./smolvlm.md) | 2025 | Small & efficient multimodal models with resource-efficient tokenization for on-device inference | #VLM #efficient #on-device |

---

## Keywords

- **#VLA** — Vision-Language-Action
- **#VLM** — Vision-Language Model
- **#LLM** — Large Language Model
- **#transformer** — Transformer architecture
- **#attention** — attention mechanism
- **#foundation-model** — large pretrained model
- **#data** — data pipeline, quality, scale
- **#sim2real** — simulation–real world transfer
- **#open-source** — publicly available weights & code
- **#efficient** — compute/memory efficiency
- **#on-device** — edge / on-device deployment
- **#contrastive-learning** — contrastive objective (e.g. CLIP)
- **#zero-shot** — zero-shot transfer without task-specific labels
- **#policy-learning** — robot policy representation and learning
- **#diffusion** — denoising diffusion probabilistic models
- **#bimanual** — two-arm / bimanual robot manipulation
- **#imitation-learning** — learning from demonstrations
- **#action-chunking** — predicting multi-step action sequences in a single query
- **#manipulation** — object manipulation tasks
- **#flow-matching** — flow matching / continuous normalizing flows for generative modeling
- **#dexterous** — dexterous, contact-rich manipulation
