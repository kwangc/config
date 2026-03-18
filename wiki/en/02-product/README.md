# Product overview

Config's product stack for **general-purpose bimanual robotics** is built to “close the loop” between training data and real-world deployment.

At a high level, the flow is:

**Human two-handed manipulation data → robot-aligned action labels → CFG-1 foundation policy → rapid task adaptation with human-in-the-loop operations → validated deployment.**

---

## Mission context

We build the data infrastructure and technology that enable robots to perform diverse bimanual tasks reliably, not just in demos.

- **Data integrity via closing the loop:** collect → validate in the physical world → feed back into training so improvements accumulate across iterations.
- **Partner-ready deployment:** make data and policies usable for real hardware constraints (latency, safety, calibration drift, schema consistency).

---

## How the products connect (end-to-end)

1. **Data Platform** turns raw human video into **robot-aligned action representations** (precision/accuracy matters).
   - Human-operated hand gripper to estimate action labels aligned to the target robot end-effector.
   - Scenario-based diversity planning to manage coverage (UMAP + HDBSCAN).
   - Data lineage/versioning + quality gates so “data remains usable” as sensors, calibration, and operators change.
2. **Foundation Model (CFG-1)** is the learned policy backbone trained on large-scale human action data.
   - Autoregressive long-horizon memory + a short sliding window for high-precision action prediction.
   - Pretrain once, then adapt fast with small task teleoperation data.
3. **Operations / Human-in-the-loop** connects online rollouts back into both strategy and data.
   - Typical fine-tuning timeline: **~24 hours**
   - Typical deploy/improvement timeline: **~48 hours**
   - Humans recover from failures and expand visited state space so the system learns where it actually struggles.

---

## Product structure

| Product | Description | Doc |
|---------|-------------|-----|
| **Data Platform** | Data infrastructure for general-purpose bimanipulation — action labeling, scenario mining/coverage, quality gates, real-world validation | [Data Platform](../01-data-platform.md/) |
| **Foundation Model** | CFG-1 foundation policy for bimanual / general-purpose manipulation — encoding, training, evaluation loop | [Foundation Model](../02-foundation-model.md/) |

---

## See also

- [Company — About](../../01-company/about.md/)
- [Domains](../../README.md/#3-domains) — AI/ML, VLA, Robotics, Sim2Real, Data & Scaling, Deployment
