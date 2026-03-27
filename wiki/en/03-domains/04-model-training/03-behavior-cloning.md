# Behavior Cloning (BC)

Learning a policy that **imitates human demonstrations** collected via teleop or scripts.

---

## Problem setup

- Dataset $\mathcal{D}$: sequences of $(s_t, a_t)$ from demos
  - $s_t$: images, robot state, language instruction, …
  - $a_t$: human actions (EE deltas, gripper commands, joint commands, …)
- Goal: learn a policy $\pi_\theta$ that reproduces the human behavior:
  - Given $s_t$, output $a_t$ as closely as possible.

---

## Supervised learning view

BC is **just supervised learning**:

- Input: $s_t$
- Label: $a_t$
- Model: $\pi_\theta(s_t)$

For continuous actions, a common loss:

$$
\mathcal{L}_{\text{BC}}(\theta)
  = \mathbb{E}_{(s,a) \sim \mathcal{D}} \big[ \lVert \pi_\theta(s) - a \rVert^2 \big]\,.
$$

Intuition:

- For the same state $s_t$, we want $\pi_\theta(s_t)$ to be as close as possible to the human action $a_t$.

---

## Relation to teleop and RL

Typical practical flow:

1. **Teleop**: log many $(s_t, a_t)$ demos for target tasks.
2. **BC**: train an initial policy with the loss above.
3. **RL**: (optional) fine-tune this policy with rewards for better robustness or performance.

BC is strong at:

- Quickly getting \"human-like\" behavior
- Bootstrapping policies in complex spaces (VLA, bimanual robotics, …)

RL is strong at:

- Improving beyond human demos
- Learning recovery behaviors and optimizing detailed performance.

---

## Covariate shift (distribution shift)

Main challenge:

- During training: the policy only sees **states from human trajectories**.
- During deployment: the policy visits **its own states** — which can drift away quickly.

This mismatch is known as **covariate shift / distribution shift**.

Mitigation strategies:

- **DAgger-like methods**:
  - Let the policy act, then have a human relabel the trajectory.
  - Aggregate new data into $\mathcal{D}$ and retrain.
- **Demo diversity**:
  - Vary initial states, task conditions, and demonstration styles.
- **Combine with RL**:
  - Use BC to initialize, then RL to learn recovery and robustness.

---

## See also

- [Teleoperation](../02-teleops/)
- [Robot Learning (RL)](../04-robot-learning-rl/)
- [VLA](../../02-model-class/05-vla/)

---

## Food for Thought

- BC suffers from covariate shift: training sees human-trajectory states, deployment sees policy-generated states; if you add closed-loop data collection (dagger-like relabeling) and retraining automation, compounding errors become containable.
- Supervised loss alone doesn’t guarantee task success under contact-rich dynamics; if you enrich targets with outcome/safety signals (success labels, contact events, failure reasons) you turn “imitate” into “survive real execution.”
- Demo diversity is limited by labeling cost; if you productize balanced scenario selection and active coverage (initial states, styles, environments), generalization improves without linear increases in data budget.
