# Glossary

One-line definitions of key terms for robot, VLA, and data infrastructure. (TBD)

---

## Robot & control

| Term | Definition |
|------|------------|
| **Bimanual** | Manipulation using two hands (dual arm/end-effector) in coordination |
| **Teleoperation (teleop)** | Human remotely operating a robot to collect demonstrations |
| **Proprioception** | Robot's sense of its own state (joints, position, velocity, etc.) |
| **Manipulation** | Grasp, place, assemble, and other object-handling behaviors |

---

## Simulation & transfer

| Term | Definition |
|------|------------|
| **Sim2Real** | Transferring policies/models trained in simulation to real-world robots |
| **Reality gap / Domain gap** | Performance drop from sim–real mismatch (physics, sensors, appearance) |
| **Domain randomization** | Randomizing sim parameters (lighting, texture, friction, etc.) to improve transfer |

---

## Model & learning

| Term | Definition |
|------|------------|
| **VLA** | Vision-Language-Action — robot policy combining vision, language, and action |
| **Foundation model** | Model pretrained on broad tasks/data, then fine-tuned for specific tasks |
| **Closing the loop** | Iterate: train → test in real world → improve data/model |

---

## Deployment & infrastructure

| Term | Definition |
|------|------------|
| **On-device deployment** | Running the model on robot/edge device for inference without cloud |
| **Quantization** | Reducing weight/activation precision (e.g. 4bit, 8bit) for speed & memory |
