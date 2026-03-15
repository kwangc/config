# Deployment

Putting robots & VLAs on **real hardware** and into production — **form factors**, **on-device deployment**, **quantization**, **rollout**.

---

## Overview

- **Form factor:** physical shape and mounting of robot/gripper arms
- **On-device:** run models on edge (robot, Jetson, etc.) for low latency and offline operation
- **Quantization:** reduce precision to save memory and compute; essential for real-time inference

---

## Form factors

- See [Robotics](robotics.md#form-factors) for hardware overview. Here: deployment angle only.
- **Dual arm / bimanual:** two arms/grippers, workspace, DOF, payload
- **Compact gripper arm:** small bimanual, wearable, tabletop
- **Mounting:** tabletop, mobile base, fixed — affects latency, power, compute

---

## On-device deployment

- **Goal:** inference on robot/edge without cloud; low latency, stable operation
- **Hardware:** NVIDIA Jetson, Raspberry Pi, etc. — memory & compute limits
- **Software:** inference engine (ONNX, TensorRT, llama.cpp, etc.), ROS/pipeline integration
- **Example:** LiteVLA-Edge — 4-bit quantization on Jetson Orin, 6.6 Hz closed-loop control

---

## Quantization

- **What:** reduce weight/activation precision (8bit, 4bit) to save memory and compute
- **Robot/VLA:** action space is sensitive; selective quantization and calibration matter (e.g. QuantVLA)
- **Methods:** post-training quantization (PTQ), quantization-aware training (QAT)
- **Tradeoff:** accuracy vs speed, energy, cost

---

## Rollout & ops (TBD)

- **Shadow mode** — collect predictions without controlling
- **Canary / A/B** — small rollout, then metrics & safety checks
- **Rollback & versioning** — policy/model versions, emergency rollback

---

## See also

- [Robotics](robotics.md)
- [VLA](vla.md)
- [Foundation Model](../product/foundation-model.md)
- [Safety & Evaluation](../safety-eval/README.md)
