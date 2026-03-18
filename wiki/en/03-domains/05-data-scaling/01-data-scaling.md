# Data & Scaling

**Data scale**, **coverage**, **diversity**, and **data strategy** for robot & VLA training.

---

## Overview

- **Data scale:** increase volume & quality for generalization and long-tail
- **Coverage & diversity:** tasks, environments, objects, embodiments
- **Strategy:** real-world collection vs sim vs synthetic augmentation, demonstration synthesis

---

## Key concepts (TBD)

- **Robot data traits** — multimodal (vision, proprioception), sequential, action-conditioned
- **Real vs sim** — cost/quality/transfer tradeoffs
- **Synthetic / augmentation** — sim data generation, object/background diversity
- **Demonstration synthesis** — expand few real demos into large sim/real datasets
- **Quality & balance** — label noise, task/environment balance, long-tail
- **Scenario-based coverage planning** — cluster scenario instructions (e.g., via embeddings + UMAP/HDBSCAN) and collect to cover long-tail variation with explicit budgets per scenario
- **Action representation quality** — precision/accuracy of robot-aligned action estimates (from human-operated gripper trajectories or other estimators) and explicit failure reason attribution

---

## Config context

- Data Platform owns collection, pipeline, quality validation
- Closing the loop validates impact of scaled data in the real world

---

## See also

- [Simulation & Sim2Real](../../06-simulation-sim2real/01-simulation-sim2real.md/)
- [Robotics](../../01-robotics/01-robotics.md/)
- [Data Platform](../../../02-product/01-data-platform.md/)
- [Research](../../../04-research/README.md/)

---

## Food for Thought

- Scaling data without coverage/balance often leaves long-tail failures untouched; if you productize scenario coverage metrics (UMAP/HDBSCAN cluster coverage) and enforce data collection budgets per cluster, “data scale” becomes an operational lever.
- Real vs sim vs synthetic augmentation changes transfer in non-obvious ways; if you add sim→real validation gates that decide which source to trust, the system can converge toward better-performing mixtures automatically.
- Label noise (including errors in estimated action representations) and long-tail task coverage are expensive to fix manually; if you build precision/accuracy quality gates + failure reason attribution, data problems become solvable engineering work rather than recurring surprises.
