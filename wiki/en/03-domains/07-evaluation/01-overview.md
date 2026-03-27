# Evaluation

**Evaluation methods** and **benchmarks** for robot and VLA systems — how we measure whether a policy actually works.

---

## Why evaluation is hard in robotics

Unlike image classification (one right answer), robot tasks have:
- **Continuous action spaces** — the policy must produce the right force, speed, and pose at every timestep
- **Compounding errors** — a 2% error per step becomes catastrophic over 100 steps
- **Environment variance** — lighting, object placement, and surface friction vary; offline results rarely match real-world performance
- **Safety as a first-class metric** — a policy that completes a task dangerously is not a success

The central challenge: **offline evals are fast and cheap but misleading; real-world evals are slow, expensive, and the only ground truth.**

---

## Evaluation methods

### 1. Offline evaluation (sim / log-based)

Run the policy against pre-recorded trajectories or inside a simulator without hardware.

| Method | What it measures | When to use |
|--------|-----------------|-------------|
| Log-replay | Action prediction error vs recorded reference | Regression check during training |
| Sim rollout | Task completion rate in a physics simulator | Fast iteration, hyperparameter tuning |
| Behavior cloning loss | Average L1/L2 loss on held-out demos | Sanity check; does not predict real success |

**Limitations**: distribution shift between logged data and live execution, physics sim gaps (contact, friction, deformables), and no feedback from actual hardware.

### 2. Real-world evaluation

Deploy the trained policy on physical hardware and measure outcomes.

| Method | What it measures | Notes |
|--------|-----------------|-------|
| Task success rate | Did the robot complete the full task? | Primary metric; binary or partial-credit |
| Human-in-the-loop validation | Is the trajectory safe and acceptable to a human observer? | Critical for bimanual, high-contact tasks |
| Closed-loop rollout | How does success change over multiple improvement rounds? | Captures learning rate, not just snapshot |
| Failure attribution | Which failure mode caused a failed attempt? | Feeds back into data strategy |

### 3. Safety-integrated evaluation

Success alone is not sufficient. Every evaluation should also track:

- **Safety rate** — fraction of trials without unsafe events (collision, excessive force, dropped object causing damage)
- **Safe success rate** — task completed AND safely (the product metric that actually matters)
- **Recovery rate** — fraction of near-failures the policy self-corrects without human intervention

---

## Key metrics

| Metric | Definition | Range |
|--------|-----------|-------|
| Task success rate | % of trials where the full task goal is achieved | 0–100% |
| Safe success rate | % of trials with success AND no safety violation | 0–100% |
| Trajectory error | Average distance between predicted and reference end-effector path | mm (lower is better) |
| Action prediction error | Mean L1 error on action dimensions (offline) | lower is better |
| Steps to success | Median number of steps to complete the task | lower is better |
| Failure mode distribution | Breakdown: grasp fail / placement fail / coordination fail / safety stop | — |

---

## Benchmark suite

Major benchmarks used in the VLA and robot learning community:

| Benchmark | Year | Focus | Scale | Env | Notes |
|-----------|------|-------|-------|-----|-------|
| **RLBench** | 2020 | 100 tabletop tasks, multi-view | 100 tasks, 200 demos each | Sim (CoppeliaSim) | Standard baseline; purely sim |
| **LIBERO** | 2023 | Lifelong robot learning, 4 suites | 10 tasks/suite, ~50 demos each | Sim + real transfer | Tests continual adaptation; bimanual-compatible |
| **BridgeV2** | 2023 | Kitchen / tabletop real-world diversity | 13k+ episodes, 24 environments | Real-world | Multi-task, multi-scene; strong transfer benchmark |
| **DROID** | 2024 | Large-scale cross-embodiment | 76k demos, 86 robots, 564 tasks | Real-world | Largest real-world manipulation dataset; OXE superset |
| **Open X-Embodiment (OXE)** | 2023 | Cross-embodiment generalization | 970k+ trajectories, 22 robots | Mixed | Foundation for OpenVLA training |

### How to use these benchmarks

- **During model development**: RLBench and LIBERO for fast iteration (no hardware needed)
- **Before real-world deployment**: BridgeV2-style out-of-distribution evaluation for generalization
- **Reporting research results**: LIBERO and BridgeV2 are the most commonly cited; include both for comparability
- **Data strategy decisions**: DROID and OXE show what data diversity looks like at scale

### Offline vs. real-world performance gap

A common trap: a model that achieves 90% on LIBERO sim may achieve 40–60% in the real world. Sources of the gap:

1. **Physics fidelity** — sim contact models differ from real friction/compliance
2. **Visual distribution shift** — real lighting, reflections, and clutter differ from sim textures
3. **Deformable objects** — cloth, bags, and food do not simulate well
4. **Temporal precision** — real hardware has latency and jitter that sim ignores

Config's approach: prioritize real-world closed-loop evaluation over sim benchmarks. Sim is used for fast iteration, but deployment decisions are made from physical rollouts.

---

## Config's evaluation approach

Aligned with the tech preview's "closing the loop" strategy:

1. **Offline regression** during training (action prediction loss, sim rollout)
2. **Initial hardware test** with 10–20 trials to establish a baseline success rate
3. **Failure attribution** — categorize each failure (grasp, placement, coordination, safety) to inform data strategy changes
4. **Iterative closed-loop** — after each round of data collection and fine-tuning, re-evaluate on hardware; track the improvement curve
5. **Safe success rate** as the final deployment gate — not just task success

---

## See also

- [Deployment](../../08-deployment/01-deployment.md/)
- [Safety](../../09-safety/01-overview.md/)
- [Data & Scaling](../../05-data-scaling/01-data-scaling.md/)
- [Research](../../../04-research/README.md/)
