# Domains — Overview (robotics, models, learning, deployment)

This folder maps the technical “stack” behind Config’s general-purpose bimanual robotics.
Use it as an entry point, then dive into each domain’s overview + details.

---

## Quick map

- [Robotics](./01-robotics/01-robotics/) — hardware form factors, kinematics, and manipulation
- [Model Class](./02-model-class/01-overview/) — LLM/VLM/VLA roles and the perception→action bridge
- [Model Algorithm (VLA deepdive)](./03-model-algorithm/01-overview/) — fusion/action heads, training deepdive
- [Model Training](./04-model-training/01-overview/) — teleops, behavior cloning, RL, closed-loop refinement
- [Data & Scaling](./05-data-scaling/01-data-scaling/) — scenario coverage, lineage, quality gates
- [Simulation](./06-simulation-sim2real/01-simulation-sim2real/) — reality gap, domain randomization, sim→real loops
- [Evaluation](./07-evaluation/01-overview/) — how we measure what matters for real robot success
- [Deployment](./08-deployment/01-deployment/) — packaging, on-device inference, rollout/ops basics
- [Safety](./09-safety/01-overview/) — safety principles, supervision, and evaluation signals

---

## How to read this map

- Start with the domain “Overview” pages (linked above).
- Each overview is designed to connect backward to prerequisites (data/training/safety) and forward to deployments.

