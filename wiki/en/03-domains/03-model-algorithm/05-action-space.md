# Action Space Design

The action space defines what the policy outputs at each timestep. This is a foundational design decision: it constrains what behaviors are expressible, determines how the policy generalizes across robot morphologies, and affects training stability.

## What Is an Action?

An action is the output vector the policy produces at each timestep, which is then sent as a command to the robot hardware (directly or via an intermediate controller). Actions can be:

- **Low-level**: joint torques or velocities; require fast control loops (1 kHz); rarely used in VLAs
- **Joint angle targets**: desired joint positions; a lower-level controller handles the execution (PD/PID)
- **End-effector pose targets**: desired Cartesian pose (position + orientation); an IK solver converts to joint targets
- **High-level waypoints**: via-points along a planned trajectory; executed by a motion planner
- **Semantic actions**: "grasp", "place", "push"; require a library of primitives to execute

Most manipulation VLAs operate at the **joint angle** or **end-effector pose** level at 5–50 Hz.

## Joint Space

Direct joint angle targets: the policy outputs desired joint positions in radians, one per controllable joint.

```
action = [q1_target, q2_target, ..., q7_target, gripper_target]
```

| Property | Detail |
|----------|--------|
| Dimensionality | 7 per arm (6 rotation + 1 gripper) |
| Transferability | Low — specific to robot morphology |
| Precision | High — direct hardware command |
| Interpretability | Low — hard to reason about in task space |
| Control frequency | 10–50 Hz typical for VLAs |

**When to use:** When you have a single robot platform and do not need cross-embodiment transfer; when sub-centimeter precision is needed at the joint level; when you want to avoid IK runtime cost.

**When to avoid:** For multi-robot training or datasets that span different arm models — joint angle ranges and semantics differ across robot families.

## End-Effector (Task) Space

The policy outputs a 6-DOF pose for the robot's end-effector: position (x, y, z) in meters and orientation as Euler angles or quaternion.

```
action = [dx, dy, dz, rx, ry, rz, gripper]   # delta end-effector
     or = [x, y, z, qx, qy, qz, qw, gripper]  # absolute end-effector
```

| Property | Detail |
|----------|--------|
| Dimensionality | 6–7 DOF + gripper |
| Transferability | Medium-high — position/orientation is robot-agnostic |
| Precision | Medium — depends on IK accuracy |
| Interpretability | High — directly maps to task geometry |
| Control frequency | 10–30 Hz typical for VLAs |

**Why task space transfers better.** Moving 5 cm forward is the same regardless of which arm model executes it. Joint-space commands encode arm-specific kinematics; end-effector commands encode task geometry. Cross-embodiment datasets (like OXE) typically normalize to end-effector space to enable training across robots.

**IK runtime cost.** The IK solver adds 1–5 ms per step. For real-time control this is acceptable; for very high-frequency (>200 Hz) loops it may be a bottleneck.

## Delta vs. Absolute Actions

### Delta (Relative) Actions

The policy outputs the change from the current state:

```
delta_action = [Δx, Δy, Δz, Δrx, Δry, Δrz, gripper_state]
new_pose = current_pose + delta_action
```

**Advantages:**
- Naturally generalizable: "move 2 cm forward" is the same behavior regardless of where the arm currently is
- Smaller output range (small deltas), easier to learn
- Errors are local: a bad delta at one step doesn't cause the arm to jump to a distant wrong position

**Disadvantages:**
- Long-horizon goals require many accumulated steps; drift accumulates
- Hard to specify distant goals efficiently; requires many small steps

### Absolute Actions

The policy outputs a target pose directly:

```
absolute_action = [x_target, y_target, z_target, rx_target, ry_target, rz_target, gripper]
```

**Advantages:**
- Efficient for long-range moves: one step can command a large motion
- Easier to interpret: the target is a specific world-frame location

**Disadvantages:**
- Requires the policy to know the robot's workspace bounds
- A wrong absolute target sends the arm to a potentially dangerous position
- Harder to generalize across different starting configurations

**Common practice:** Use **delta end-effector actions** for contact-rich manipulation tasks. Use **absolute actions** for coarse positioning phases or when working with a waypoint-based motion planner.

## Gripper State

The gripper state is typically treated as a separate output alongside the arm action:

| Representation | Description | Pros | Cons |
|----------------|-------------|------|------|
| Binary (0/1) | Open or closed | Simple, no ambiguity | Cannot control grip force |
| Continuous [0,1] | Fractional grip width | Expressive for varied objects | Requires more precise supervision |
| Discrete token | Binned grip position | Fits LLM tokenization | Precision loss |

Binary gripper is sufficient for most pick-and-place tasks. Continuous grip becomes important for delicate objects (fruit, foam) or tasks requiring specific grip widths (pen grasping, fine assembly).

## Bimanual Action Space

For bimanual robots (e.g., ALOHA, bi-arm setups), the action space is doubled:

```
bimanual_action = [arm_left (7D), gripper_left (1D), arm_right (7D), gripper_right (1D)]
                = 16D total
```

### Coordination Constraint

Bimanual actions are not independent: both arms share the same workspace and must not collide. A policy that outputs each arm's action independently (treating bimanual as two parallel unimanual policies) will produce physically incompatible actions.

Approaches to enforce coordination:
- **Joint training on bimanual demonstrations**: the policy learns coordinated behavior from human teleop data; no explicit constraint is added, but the data distribution implicitly enforces feasibility
- **Shared attention across arms**: transformer-based action head with attention between left and right arm tokens; allows explicit cross-arm interaction
- **Sequential prediction**: predict left arm first, then right arm conditioned on left; autoregressive coordination

ACT was one of the first architectures to demonstrate robust bimanual manipulation, primarily because action chunking with K=100 allows the policy to plan coherent two-arm trajectories within a single chunk.

## Normalized Action Space

All action dimensions must be normalized before training. Without normalization:

- Dimensions with large raw values (e.g., x position in millimeters: 0–500 mm) will dominate the loss
- Dimensions with small raw values (e.g., joint angles in radians: 0–3 rad) will be underfit
- The action head's MLP or diffusion model cannot efficiently learn across heterogeneous scales

**Standard normalization:**

```
# Method 1: normalize to [-1, 1] using dataset statistics
a_norm = 2 * (a - a_min) / (a_max - a_min) - 1

# Method 2: z-score normalization
a_norm = (a - a_mean) / a_std
```

Clip to [-1, 1] after normalization to handle outliers. At inference, apply the inverse transform to recover physical units.

**Separate normalization per dimension**: each action dimension gets its own normalization statistics. Do not normalize all dimensions jointly.

## Action Space Dimensionality and Policy Complexity

| Action representation | Dimensionality | Transferability | Learning difficulty |
|-----------------------|----------------|-----------------|---------------------|
| Joint torques | 6–7 per arm | Very low | Very high |
| Joint angles | 6–7 per arm | Low | High |
| Delta EEF (Euler) | 7 (xyz + rpy + grip) | Medium | Medium |
| Delta EEF (quaternion) | 8 (xyz + quat + grip) | Medium | Medium-high (unit constraint) |
| Bimanual delta EEF | 14–16 | Medium | High |
| Chunked (K steps) | K × 7 | Medium | High (long sequence) |

Higher dimensionality makes learning harder because the policy must produce consistent values across more output dimensions simultaneously. Action chunking extends the effective output dimension from 7 to K×7 (e.g., 700 for K=100). This is why chunked architectures need expressive action heads (CVAE in ACT, diffusion in π0) rather than simple MLP regressors.

## See Also

- [01 — Overview](./01-overview/)
- [06 — Action Heads](./06-action-heads/)
- [07 — Action Chunking](./07-action-chunking/)
- [08 — Policy Architectures](./08-policy-architectures/)
- [VLA Overview](../../02-model-class/05-vla/)

## Food for Thought

- If your single-robot policy fails to transfer to a second robot of the same type after retraining, check whether the action space normalization statistics were recomputed from the new robot's data — stale normalization from the first robot will produce shifted outputs even if the model is otherwise identical.
- If you are designing a bimanual policy and naively stack left-arm and right-arm outputs in an MLP, the policy will treat the two arms as independent — the first failure on a task requiring simultaneous contact will reveal this; use a shared transformer over both arm tokens from the start.
- If your policy produces smooth trajectories in simulation but jerky commands on the physical robot, you are using absolute actions where delta actions are more appropriate — each predicted absolute target is a new jump rather than a small smooth increment.
- If the gripper state output oscillates between open and closed during a grasp, the continuous gripper output is being trained without temporal consistency constraints — either discretize the gripper or add a temporal smoothing constraint in the action head.
