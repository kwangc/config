# Safety

**Safety principles** for robot and VLA deployment — physical, decision-level, and operational.

---

## Why safety is a product requirement, not a research topic

In a lab setting, a robot failure means a reset and a lost trial. In a real deployment (warehouse, kitchen, retail), a failure can mean:
- Damaged product, property, or the robot itself
- Injury risk if humans are in the workspace
- Downtime that directly translates to revenue loss

Safety is not a post-hoc filter — it needs to be designed into the data collection, training, evaluation, and deployment pipeline from the start.

---

## Physical safety

Constraints that prevent the robot from causing harm regardless of what the policy predicts.

### Force and torque limits

Every joint and end-effector has maximum allowable force/torque. Exceeding these limits risks:
- Mechanical damage to the robot or object being manipulated
- Injury if a human is in contact

Enforcement mechanism: hardware-level torque limits (cannot be overridden by software) + software-level safety monitors that stop motion before limits are reached.

### Collision avoidance

- **Workspace bounding:** define a 3D workspace envelope; motion planning rejects trajectories that exit it
- **Self-collision:** planner checks for arm-to-arm and arm-to-body collisions (critical for bimanual)
- **External object detection:** use depth/tactile sensors to detect unexpected objects in the path

### Bimanual-specific concerns

Two arms create coordination safety requirements that single-arm systems don't have:
- **Arm-to-arm collision**: when left and right arms reach across each other, collision risk increases
- **Object transfer safety**: during handover, both arms grip the same object; force synchronization must prevent crushing or dropping
- **Role switching**: when arms swap between "stabilize" and "manipulate" roles mid-task, there's a transition window where coordination is undefined — needs explicit state tracking

### Emergency stop (E-stop)

- Hardware E-stop button accessible to any operator within arm's reach
- Software watchdog: if policy inference latency exceeds a threshold (e.g. 200ms), the robot holds position and alerts
- Defined safe "park" configuration the robot returns to after any safety-triggered stop

---

## Decision safety

The policy's predictions should avoid unsafe actions even when the environment looks unusual.

### Uncertainty-aware behavior

A policy trained on a limited data distribution will encounter unfamiliar situations in deployment. Safe behavior under uncertainty:
- **Slow down**: reduce action magnitude when confidence is low (high prediction variance)
- **Hold or retreat**: prefer holding current position over committing to a potentially unsafe action
- **Request intervention**: flag low-confidence states for human review (human-in-the-loop)

### Hazard detection signals

Input signals that should trigger conservative behavior:
- Unexpected objects in the workspace (detected via depth sensor or vision model)
- Object out of expected pose range (the target is in an unexpected location or orientation)
- Sensor anomaly (proprioception values outside normal range)

### Safe action representation

The action space itself can encode safety constraints:
- Joint velocity limits per timestep
- End-effector force limits baked into the action decoder
- Action smoothness regularization during training (prevents jerky motions)

---

## Deployment safety

Safe practices for rolling out a policy to real hardware.

### Shadow mode

Before granting the policy control, run it in **shadow mode**: the policy generates actions but the robot does not execute them. A human operator executes manually while the policy's intended actions are logged.

- Use shadow mode to verify that the policy's predicted actions are reasonable before handing over control
- Compare shadow-mode action predictions against human operator actions as a sanity check

### Canary rollout

Do not deploy to all robots simultaneously:
1. Deploy to 1 robot (canary) and run a fixed evaluation set (20–50 trials)
2. Monitor: safe success rate, failure mode distribution, any safety stops triggered
3. If metrics pass the gate, expand rollout to the full fleet

This limits blast radius if the new policy has a regression.

### Rollback and versioning

- Every deployed policy is tagged with a version identifier
- The previous version is kept warm (ready to serve) for at least one deployment cycle
- Rollback procedure: switch the active policy pointer; takes < 1 minute; does not require hardware restart
- Rollback trigger criteria: safe success rate drops > 10% from baseline, or any novel injury/damage event

### Audit logging

Every deployment session should log:
- Policy version and commit hash
- Per-trial: success/failure, failure mode, any safety-stop events
- Operator interventions and their timing
- Environmental metadata (time of day, object SKU, operator ID)

This log is required for failure attribution and for satisfying any regulatory or customer audit requirements.

---

## Safety in the data pipeline

Safety starts before training:
- **Teleop data quality**: unsafe demonstrations (excessive speed, near-collision trajectories) should be filtered before entering the training set
- **Action representation bounds**: the estimated action labels should be validated against the target robot's joint limits
- **Scenario coverage for safety**: the data strategy should include edge cases (unexpected objects, unusual poses) not just the ideal-path scenarios

---

## See also

- [Evaluation](../../07-evaluation/01-overview/)
- [Deployment](../../08-deployment/01-deployment/)
- [Data & Scaling](../../05-data-scaling/01-data-scaling/)
- [Research](../../../04-research/README/)
