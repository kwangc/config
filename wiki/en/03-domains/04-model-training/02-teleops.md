# Teleoperation (teleop)

Collecting high-quality robot demonstrations by **having humans control the robot**.

---

## Why teleop?

For robot & VLA training:

- **Random RL in the real world is expensive and risky.**
- Human demos give a strong prior about *how* to solve tasks.

Typical pipeline:

1. Collect demos with teleop
2. Train an initial policy with Behavior Cloning (BC)
3. Optionally fine-tune with RL (PPO, etc.)

---

## What to log (minimum schema)

Per timestep $t$:

- **State** $s_t$
  - Observations: image/video $I_t$ (single/multi-view)
  - Robot proprioception: joint positions $q_t$, velocities $\dot{q}_t$, gripper state
  - (Optional) end-effector pose $\mathbf{x}_t$ (position + orientation)
  - (Optional) forces/torques, tactile, depth/point cloud
  - (Optional) language instruction $u$ (often per-episode)
- **Action** $a_t$
  - Joint command (torque/velocity), or
  - End-effector delta $\Delta \mathbf{x}_t$ + gripper command
- **Timestamp** $t$ or $\Delta t$ (critical for sync)

Conceptually:

$$
(u,\; I_t,\; \mathbf{r}_t)\;\rightarrow\; a_t
$$

where $\mathbf{r}_t$ bundles robot state (joints, grippers, EE pose, …).

---

## Data quality checklist

- **Sync**: images and actions aligned in time (low control lag)
- **Action representation**: joint-space vs EE-space — consistent with control stack
- **Noise / jitter**: hand tremor in actions — smooth where needed
- **Success / failure labels**: per-episode outcome and failure reasons
- **Reset / initial state diversity**: avoid overfitting to a single start configuration

---

## Bimanual teleop gotchas

For two-handed tasks (e.g., filling a cup with popcorn):

- Left hand: stabilize (hold cup, maintain pose)
- Right hand: manipulate (scoop, move, pour)

This role split should be reflected in:

- How actions are logged (`action_left`, `action_right`)
- How the policy/action heads are structured later

---

## Online closed-loop refinement (strategy + data)

The tech preview emphasizes that collecting demos is only the start: the bottleneck is improving strategy and data *iteratively* while the model is already interacting with the world.

Typical pattern:

- **Fine-tune within ~24 hours** using a small amount of task-specific teleoperation data.
- Run **online rollouts** with human-in-the-loop intervention to:
  - recover from suboptimal actions
  - expand visited state space (so new data is less biased toward early failures)
  - refine the data acquisition strategy to reduce unnecessary variance.

How to measure strategy refinement (example metric from the preview):

- **DTW-based trajectory consistency:** compute pairwise Dynamic Time Warping (DTW) between end-effector Cartesian trajectories (e.g., x/y/z) across episode pairs; lower DTW indicates the refined strategy produces more consistent spatial trajectories.

In the popcorn-serving example, an initial scoop-holding strategy underperformed, and a refined strategy improved success to **43% (±9%)**; after two online rounds, success reached **76% (±7%)**.

---

## See also

- [Behavior Cloning](../03-behavior-cloning/)
- [Robotics](../../01-robotics/01-robotics/)
- [Data & Scaling](../../05-data-scaling/01-data-scaling/)

---

## Food for Thought

- Teleop is expensive and risky, and data quality depends on tight synchronization and stable action logging; if we build teleop tools with latency-aware capture + automatic quality scoring, collecting demos becomes a predictable, repeatable product workflow.
- Teleop data is only useful when action representation matches the control stack (joint-space vs EE-space); if you enforce schema contracts and automated validation/conversion, “log it” turns into “train it reliably.”
- For bimanual tasks, role splits (support vs acting) must be reflected in logging and later policy/action head design; if we productize left/right action capture schemas and scenario templates, coverage becomes systematic instead of ad-hoc.
