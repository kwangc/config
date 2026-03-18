# Product — Data Platform

Config's Data Platform turns human two-handed manipulation into robot-aligned training signals, and provides the “closing the loop” foundation for CFG-1 and rapid task adaptation.

---

## Overview

- **Role:** Data infrastructure for general-purpose bimanipulation, including high-precision action labeling, scenario diversity planning, and closed-loop iteration.
- **Start with humans to scale action data:** Instead of relying only on expensive robot teleoperation, we use humans as the primary source of training signals (to scale action data quickly and economically).
- **Closing the loop:** Collect → preprocess/label → quality validation → (train/fine-tune) → validate in the physical world.

---

## 1) From human video to robot-aligned action representations

In practice, raw human video lacks structured control signals. For high-quality model training, we need action labels that are compatible with the target robot’s control/action space.

Config’s approach:

- **Human-operated hand gripper:** we design and fabricate a human-operated gripper that mimics the target robot’s end-effector.
- **Robot-aligned action estimation:** from human gripper trajectories, we estimate robot-aligned action representations (e.g., a 7-DoF-style action representation aligned to the robot end-effector).
- **Why it matters:** this is what makes “human video” usable for training—without it, action labeling becomes ambiguous, and model performance stalls.

Practical outcomes (from the tech preview):

- we have collected on the order of **~100k hours** of human action data to date
- our in-house pipeline currently collects around **~20k hours per month**

---

## 2) Scenario-based diversity planning (coverage management)

To ensure generalization, diversity can’t be “hope-based.” We explicitly manage it at the scenario level.

- **Scenario definition:** each scenario corresponds to a distinct variation of a task (environment/object/action style).
- **Scenario mining:** for each task, we embed scenario instructions (e.g., with a text embedding model), then cluster scenarios to form coverage groups.
- **UMAP + HDBSCAN clustering:** the tech preview reports:
  - UMAP to project instruction embeddings into 3D
  - HDBSCAN to identify clusters
  - cluster marker size reflecting total data collection duration
- **Collector guidance:** once scenario coverage is identified, we provide a visual guideline (e.g., reference video) to reduce unnecessary variance in collected trajectories.

---

## 3) Data pipelines, lineage & quality gates

“Closing the loop” only works if data quality is measured and reproducible.

Core requirements:

- **Data lineage/versioning:** every dataset version must preserve the mapping from raw captures → estimated action representation → labels/metadata.
- **Quality defined by precision + accuracy + diversity:**
  - precision/accuracy of the estimated action representations
  - diversity across scenarios (long-tail coverage)
  - failure reason attribution (so we can fix the right thing next)
- **Quality gates:** automated checks to ensure data remains usable as calibration, sensors, and operators change over time.

---

## 4) Inputs for rapid task adaptation (24h fine-tune, ~48h closed loop)

When adapting to a new target robot/task:

1. **Design acquisition strategy** using the target robot’s physical characteristics and sensing constraints.
2. **Collect a small amount of target task teleoperation data.**
3. **Fine-tune CFG-1** into a task-specific model using an automated end-to-end pipeline, typically completed within **~24 hours**.
4. **Improve via online rollouts** (human-in-the-loop) and refine both the strategy and the data plan until deployment, typically within **~48 hours**.

The tech preview provides concrete examples:

- an initial strategy (scoop-holding approach) underperformed when wrist-view fine control was not enabled and when the teleoperator’s pose injected spurious instability
- after strategy refinement, success improved to **43% (±9%)**
- after two rounds of online closed-loop improvement, success reached **76% (±7%)**

---

## Tech stack (TBD)


| Area                                | Tech / tools                                    | Notes                               |
| ----------------------------------- | ----------------------------------------------- | ----------------------------------- |
| Storage & versioning                | Dataset manifests, lineage tracking             | (to fill with real tooling)         |
| Action estimation & labeling        | Human gripper → robot-aligned action estimation | precision/accuracy critical         |
| Scenario mining & coverage tracking | embeddings + UMAP/HDBSCAN                       | scenario-level diversity management |
| Quality scoring & gates             | automated checks + failure attribution          | keep “data usable”                  |
| Online closed-loop iteration        | rollout logging + strategy refinement           | impacts deployment timeline         |


---

## See also

- [About](../../01-company/about.md/)
- [Foundation Model](../02-foundation-model.md/)
- [Simulation & Sim2Real](../../03-domains/06-simulation-sim2real/01-simulation-sim2real.md/), [Data & Scaling](../../03-domains/05-data-scaling/01-data-scaling.md/)

