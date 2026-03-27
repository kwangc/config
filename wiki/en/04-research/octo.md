# Octo: An Open-Source Generalist Robot Policy

*arXiv / ICML 2024 Workshop* (Octo)

---

## 1) Brief summary (public date, authors)

- **Public date:** 2024-05 (arXiv v1 posted **2024-05-20**)
- **arXiv:** [2405.12213](https://arxiv.org/abs/2405.12213)
- **Authors (representative):** Dibya Ghosh, Homer Walke, Karl Pertsch, Kevin Black, Oier Mees, Sudeep Dasari, Joey Hejna, Tobias Kreiman, Charles Xu, Jianlan Luo, You Liang Tan, Lawrence Yunliang Chen, Lerrel Pinto, Sergey Levine, Chelsea Finn, Dorsa Sadigh (UC Berkeley, Stanford, NYU, CMU, and others)
- **GitHub:** [github.com/octo-models/octo](https://github.com/octo-models/octo)
- **HuggingFace:** [rail-berkeley/octo-small](https://huggingface.co/rail-berkeley/octo-small), [rail-berkeley/octo-base](https://huggingface.co/rail-berkeley/octo-base)

---

## 2) Detailed summary

### From Pretrained VLA to Practical Deployment

Octo is a fully open-source generalist robot policy designed to be easily adapted to new robots. It addresses the practical gap between large-scale pretrained models (like RT-2, OpenVLA) and real-world usability for researchers with limited hardware.

**Philosophy:** provide a strong, open-source foundation that works reasonably well out-of-the-box, but is deliberately designed for fast fine-tuning on new robot setups.

### Architecture: Transformer + Diffusion Head

- **Observation tokenization:** Visual observations are tokenized as image patches (ViT-style), language goals as text tokens — both fed to a shared transformer
- **Readout tokens:** Special learnable tokens whose final representations are decoded for action prediction (not all tokens, just readout tokens → computational efficiency)
- **Action head:** **diffusion-based** — outputs action distributions via denoising (similar to Diffusion Policy), not discrete tokens like RT-2/OpenVLA
  - More expressive for multi-modal action distributions
  - Smoother trajectories than token-based approaches
- **Modular design:** Easy to swap observation inputs (add/remove cameras) and action representations (different robot DoF)

### Training Strategy: OXE Foundation + Efficient Fine-tuning

- **Pretrained on OXE:** 800k+ trajectories from 9 robot embodiments (UR, Franka, WidowX, etc.)
- **Two model sizes:** Octo-Small (27M params) and Octo-Base (93M params)
- **Fully open:** weights, code, training data, training recipe all public

### Fine-tuning for New Robots

**Core strength:** designed for rapid adaptation. Empirically:
- With only **50-100 demonstrations** on a new robot, Octo matches or beats policies trained from scratch
- With **500-1000 demonstrations**, Octo significantly outperforms from-scratch training
- Supports fine-tuning with new observation types (different camera viewpoints, wrist cameras, etc.)

### Results

| Task / Setup | Octo-Base | RT-2-X (55B) | Specialist baseline |
|-------------|-----------|-------------|-------------------|
| BridgeV2 (zero-shot) | 56.9% | 67.3% | ~75%+ |
| Fine-tuned (WidowX, 500 demos) | **78%** | not evaluated | ~75% |
| Fine-tuned (UR5, 500 demos) | competitive | not evaluated | baseline |

**Key insight:** Octo achieves parity with or exceeds task-specific policies, but only after fine-tuning. Zero-shot performance is weaker than RT-2-X, but the fine-tuning delta is massive.

### Limitations

- Zero-shot performance lags behind RT-2-X and π0 on unseen tasks
- Diffusion action head requires ~10 denoising steps (slower inference than single-step token prediction, but faster than DDPM's ~100 steps)
- Limited evaluation on dexterous / contact-rich tasks compared to ACT, π0
- No language understanding beyond task-level goals

---

## 3) Why this is an important paper

- **Shifted the paradigm from pretraining-only to pretraining + efficient fine-tuning:** RT-2, OpenVLA focused on zero-shot; Octo proved that foundation models for robots should be optimized for *adaptation*, not just zero-shot performance
- **Made open-source generalist policies practical:** Octo's architecture (modular, efficient readout tokens, diffusion head) is deliberately lightweight enough to fine-tune on academic clusters, not just Google-scale hardware
- **Diffusion action heads entered the mainstream:** Showed that diffusion-based action generation (vs token-based) is viable and produces smoother, more expressive trajectories
- **Established the gold standard for open-source robot policies:** Octo with full training recipe is the most reproducible, easy-to-adapt generalist policy available; it became the reference point for follow-up work

---

## 4) What Config can apply

- **Fine-tuning as the primary path:** Config's model strategy should not aim for perfect zero-shot; instead, assume strong foundation (OXE/OpenVLA/Octo) + aggressive fine-tuning on Config-specific bimanual data. This beats building from scratch
- **Benchmark against Octo fine-tuned:** Octo-Base fine-tuned on 500-1k WidowX demos is the key external baseline. Config should exceed this on bimanual dexterous tasks
- **Diffusion action heads for bimanual:** Octo's diffusion-based action generation suits high-DoF, contact-rich bimanual tasks better than token-based approaches; Config should adopt a diffusion or flow-based action head
- **Modular architecture for hardware changes:** Octo's design (easy to add/remove cameras, change action dim) ensures that if Config's robot morphology evolves, the policy architecture adapts gracefully
- **Data format alignment:** Octo uses RLDS format and is trained on OXE; Config's data pipeline should remain RLDS-compatible so Octo becomes a practical baseline/fine-tuning starting point

