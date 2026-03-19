# Glossary

One-line definitions of key terms for robot, VLA, and data infrastructure.

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

---

## Models, perception, and action

| Term | Definition |
|------|------------|
| **VLM** | Vision-Language Model that grounds visual inputs into text/structured signals |
| **VLA** | Vision-Language-Action — an action policy that combines vision, language, and robot state |
| **Action representation (7DoF)** | Encoding an action as a 7-dimensional pose-like signal for robust downstream control |
| **Trajectory consistency** | Keeping generated plans/actions aligned across time so rollouts do not “drift” (often measured with DTW) |

---

## Data, scaling, and usability

| Term | Definition |
|------|------------|
| **Scenario-based coverage planning** | Using embeddings/clustering (e.g., UMAP + HDBSCAN) to decide what scenarios to collect next |
| **Data lineage / versioning** | Tracking dataset versions, labels, schemas, and preprocessing so models can be reproduced and compared |
| **Label noise** | Mistakes in human/labeled action targets that can stall learning unless quality gates isolate them |
| **Schema consistency** | Enforcing stable input/output contracts across operators, tools, and model versions |
| **Calibration drift** | Sensor→robot coordinate misalignment that breaks training labels if not re-calibrated |
| **Synchronization** | Aligning timestamps and sensor streams so multimodal cues describe the same physical moment |

---

## Training, adaptation, and operations

| Term | Definition |
|------|------------|
| **Behavior cloning (BC)** | Supervised imitation learning from demonstrations (often as a warm start) |
| **Reinforcement learning (RL)** | Reward-driven optimization (e.g., PPO) for improving policies beyond pure imitation |
| **Closed-loop refinement** | Online human-in-the-loop rollouts where failures expand visited states and generate new training data |
| **Recovery loop** | The operator’s structured process to regain control after failures, producing useful data for iteration |
| **Human-operated gripper** | A human-controlled end-effector used to estimate action labels aligned to the target robot |

---

## Evaluation and safety signals

| Term | Definition |
|------|------------|
| **DTW (Dynamic Time Warping)** | A trajectory similarity metric that tolerates timing differences while measuring consistency |
| **E-stop** | Emergency stop mechanism to cut off motion immediately when safety constraints are violated |
| **Torque limits** | Actuator limits used as a safety bound during deployment and testing |
| **Rollout modes (shadow/canary)** | Staged deployment patterns that limit blast radius while validating improvements in the real world |
