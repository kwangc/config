# Deployment

Putting robots & VLAs on **real hardware** and into production — **form factors**, **on-device deployment**, **quantization**, **rollout**.

---

## Overview

- **Form factor:** physical shape and mounting of robot/gripper arms
- **On-device:** run models on edge (robot, Jetson, etc.) for low latency and offline operation
- **Quantization:** reduce precision to save memory and compute; essential for real-time inference

---

## Form factors

- See [Robotics](../../01-robotics/01-robotics/#form-factors) for hardware overview. Here: deployment angle only.
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

## Rollout & ops

### Policy versioning

Every deployed policy is a versioned artifact: model weights + config + action representation schema. Version identifiers link the deployed policy to the exact training run, dataset version, and evaluation results. This makes rollback and audit possible.

```
Policy version structure:
  cfg1-v1.3.2-task-scoop-2026Q1
  ├── model weights (quantized or full precision)
  ├── action schema (7-DoF end-effector delta)
  ├── inference config (sliding window size, temperature)
  └── eval results (success rate, safe success rate, benchmark)
```

### Shadow mode

Before handing control to the policy, run in **shadow mode**: the policy generates action predictions, but the robot does not execute them. The operator controls manually while policy outputs are logged side-by-side.

- **Purpose**: verify that policy predictions are sane before granting control
- **Duration**: typically 5–10 trials or until predicted actions consistently match operator behavior
- **Gate**: shadow-mode action distribution should overlap with operator action distribution (KL divergence check or visual inspection)

### Canary rollout

1. Deploy new policy version to 1 robot (canary) in a controlled evaluation set
2. Run 20–50 trials; monitor: success rate, safe success rate, safety-stop count, failure mode breakdown
3. Compare against baseline (previous version) — look for regressions
4. Pass gate → expand to full fleet; fail gate → rollback

### Rollback

- Previous policy version stays warm (loaded, ready to serve) for the duration of one deployment cycle
- Rollback = switch the active policy pointer; takes < 1 minute; no hardware restart required
- Automatic rollback triggers: safe success rate drops > 10% from baseline, or any safety-stop event outside expected range
- All rollback events are logged with timestamp, version, and triggering metric

### Monitoring during deployment

Track per-session:
- Success rate and safe success rate (rolling 10-trial window)
- Failure mode distribution (grasp / placement / coordination / safety-stop)
- Inference latency p50/p95 (target: < 150ms per action step)
- Any operator interventions (frequency and type)

---

## See also

- [Robotics](../../01-robotics/01-robotics/)
- [VLA](../../02-model-class/05-vla/)
- [Foundation Model](../../../02-product/02-foundation-model/)
- [Evaluation](../../07-evaluation/01-overview/), [Safety](../../09-safety/01-overview/)

---

## Food for Thought

- On-device deployment is constrained by latency/memory, and quantization can quietly damage action accuracy; if you treat quantization as a controlled product toolchain (calibration + validation + fallback controllers), edge deployment becomes reliable.
- Form factors and mounting details create integration variance that’s hard to debug; if you standardize deployment packaging (model + presets + schemas) with compatibility checks, rollout becomes faster across hardware SKUs.
- Rollout/ops isn’t just “launch code”: safety checks, metrics, shadow/canary, and rollback must be built in; if you productize that ops surface, you can ship policies continuously without fearing regressions.
