# Product Strategy

Why Config invests in robotics, VLA-based control, bimanual manipulation, and a software-oriented product stack powered by a Data Platform and a Foundation Model.

---

## 1) Why Robotics?

Robotics is where “general intelligence” becomes operational reality: perception must translate into actions that are safe, robust, and timed correctly on real hardware. It also forces a tight loop between data, system design, and deployment constraints. That combination turns abstract research into repeatable product learnings.

---

## 2) Why VLA model? not rules or other types of control?

Rules and hand-tuned controllers can work for narrow setups, but the moment tasks diversify (objects, environments, embodiments, layouts), manual control logic becomes brittle and expensive to scale. VLA models learn the mapping from multimodal inputs (vision + language + robot state) to actions, enabling transfer across variation. In practice, reliability comes from pairing VLA outputs with system-level supervision (timing contracts, safety gating, and action constraints), not from replacing the system.

---

## 3) Why Bimanual?

Many real tasks naturally require two-hand coordination: stabilize + manipulate, hold + align/insert, fold/shape deformables, and regrasp/handover. Bimanual is hard because it combines coordination (role assignment and switching), contact-rich dynamics (compliance + feedback), and partial observability (occlusion). Product-wise, solving bimanual well creates a high-leverage advantage for everyday manipulation workloads.

Beyond “Serving & Organizing”, bimanual is a core primitive for other high-value workflows:

- Assembly & insertion: aligning parts, performing peg/pin insertions, screw/snap-fit-like actions, and reducing misalignment sensitivity
- Deformable handling: folding, bagging, wrapping, and “shape-preserving” manipulation where contact and compliance dominate success
- Handover / regrasp & tool switching: transferring objects between end-effectors (or changing tools mid-task) without losing state
- Packaging & order fulfillment: picking multiple items, sorting into bins, bagging/boxing, and placing with repeatable force/pose control

In industry, bimanual needs are especially strong in:

- Factory automation: fixtures are expensive and parts vary, so robots must be robust to small geometric/pose errors while maintaining safe force behavior and fast recovery
- b2C unmanned sales (unattended retail / “unmanned selling” flows): robots must restock shelves and fulfill orders with minimal supervision, where downtime and failed recoveries directly translate into revenue loss

---

## 4) Why Data Platform & Foundation Model besides other types of products?

The tech preview’s core belief is that the primary bottleneck for general-purpose robot foundation models is **data**—not merely more data, but *data with sufficient richness and diversity* and with the right notion of accuracy/precision for action learning.

Data Platform turns human video into robot-usable training signals by:

- estimating robot-aligned action representations from a **human-operated hand gripper** (so action labels are precise and measurable)
- managing task diversity through **scenario planning** (clustered instruction variation, then guided collection to reduce unnecessary variance)
- enforcing quality via **data lineage/versioning** and quality gates tied to precision + accuracy + diversity + failure attribution

Foundation Model complements this by being the learned policy backbone (CFG-1) that can be adapted quickly:

- **fine-tune within ~24 hours** using a small amount of target task teleoperation data
- then improve via **online rollouts** with human-in-the-loop strategy refinement, typically reaching task deployment within **~48 hours**

Finally, “the right robot” depends on cost and end-effector embodiment. By focusing the representation layer on action interfaces that match target embodiments, the system remains robust under the economics constraint—not only academically capable.

---

## 5) Why software-oriented?

Software is where we can standardize interfaces, encode safety/supervision patterns, and iterate quickly without redesigning hardware each time. A software-first strategy also lets us package deployment (schemas, presets/profiles, quantization pipelines, rollout/rollback) as reusable product artifacts. In other words: software turns engineering work into repeatable systems.

---

## 6) Food for Thought

- **Robotics**: hardware variety + commissioning/safety integration are painful, so productizing selection criteria (hardware taxonomy) and enforcing timing/supervision via a single supervisor makes deployments predictable; bimanual adds contact/coordination failures, so role-based action schemas + recovery templates create incremental reliability.
- **Model Class (LLM/VLA)**: language-centric metrics and free-form commands don’t directly map to safe, timed robot actions, so robotics-first evaluation + structured command/planning constraints turn models into dependable policy components.
- **Model Algorithm (Deep learning for VLA)**: end-to-end non-linear mappings are brittle and edge deployment budgets are tight, so control-relevant fusion/action design + standardized BC→RL protocols + on-device validation reduce failure rates.
- **Model Training (Teleop/BC/RL)**: demo collection, covariate shift, and safety-constrained exploration slow learning, so schema contracts, closed-loop relabeling, and safety-gated training convert research methods into operational growth.
- **Data & Scaling**: scaling without coverage/balance and without label/quality gates keeps long-tail failures alive, so coverage metrics + quality validation + demonstration synthesis make data issues solvable engineering work.
- **Simulation & Sim2Real**: the reality gap prevents “works in sim” from shipping, so dynamic digital twins + sim→real validation gates reduce transfer risk over time.
- **Deployment**: quantization and ops regressions can quietly break action accuracy, so calibrated deployment toolchains + versioned packaging + rollout/rollback practices improve reliability.
- **AI/ML basics**: benchmark success doesn’t guarantee physical-world success, and model capability must be translated into real-time safe action generation, so robotics-first evaluation and interface contracts connect AI progress to robot outcomes.

---

## See also

- [Robotics](../../README.md/#domains)
- [Data & Scaling](../../README.md/#domains)
- [Simulation & Sim2Real](../../README.md/#domains)
- [Deployment](../../README.md/#domains)

