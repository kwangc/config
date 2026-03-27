# NVIDIA GR00T

> NVIDIA's foundation model for embodied AI and robot intelligence

---

## Quick facts

- **Announced:** 2024 (GTC keynote)
- **Organization:** NVIDIA AI Foundation Models team
- **Model base:** NVIDIA's proprietary LLM + multimodal backbone
- **Key angle:** Cloud-based pretrained model service for robot companies

---

## Company direction & strengths

NVIDIA GR00T is not a robot company, but a **model-as-a-service** offering. NVIDIA positions GR00T (General Robotics 00 Transformer) as a foundation model that any robot manufacturer can use as a starting point.

Key strengths:
- **Computational leverage:** NVIDIA's CUDA ecosystem and inference optimization (TensorRT)
- **Scale:** Training on diverse robot data at hyperscaler scale
- **Integration with robotics SDKs:** Building JAX/PyTorch integrations, simulation tools (Isaac)
- **Enterprise positioning:** Targets OEMs (robot manufacturers) selling enterprise robot solutions

---

## Config vs NVIDIA GR00T

### Main differences

- **Model vs data+deployment:** GR00T is a pretrained model service; Config builds data collection + deployment pipelines
- **Generalist vs specialist:** GR00T targets general-purpose robot control; Config focuses on bimanual dexterity
- **Business model:** GR00T is cloud-based subscription; Config is embedded policy deployment

### Potential overlap

- **Competitive risk:** If GR00T achieves strong zero-shot performance on dexterous tasks, it could reduce demand for Config's specialized models
- **Complementary use case:** Config's data could be used to fine-tune GR00T for specific domains

### Config's differentiation

- **Data ownership:** Config owns high-quality, scenario-rich bimanual demonstrations; GR00T uses data aggregated across multiple sources
- **Domain focus:** Config specializes in bimanual dexterity; GR00T is generic across embodiments
- **Real-world feedback loop:** Config's closed-loop operations (human recovery, online labeling, failure attribution) allow continuous improvement; GR00T is pretrained at fixed points

---

## Sources

- [NVIDIA Robotics](https://www.nvidia.com/en-us/robotics/)
- [GTC 2024](https://www.nvidia.com/en-us/gtc/)
