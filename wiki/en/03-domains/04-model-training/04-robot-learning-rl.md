# Robot Learning (RL)

How reinforcement learning (RL) is used to train robot policies, especially in VLA and bimanual settings.

---

## Core idea

RL learns a policy by **interacting with an environment** and maximizing **expected reward**.

- **Supervised learning**: learn from labeled examples $(x, y)$
- **RL**: learn from **rewards** $r_t$ obtained after taking actions $a_t$ in states $s_t$

For robots, explicit \"ground-truth actions\" are often unavailable, so reward-based learning is natural.

---

## Basic components

| Concept | Description | Robot example |
|--------|-------------|---------------|
| **State** $s_t$ | current situation | camera image, joint angles, gripper state |
| **Action** $a_t$ | choice the agent makes | joint torques, EE deltas, gripper open/close |
| **Reward** $r_t$ | how good the action was | +1 for successful grasp, 0 otherwise |
| **Policy** $\pi$ | mapping from state to action | NN that outputs actions from images + state |

**Policy vs instruction:**

- Instruction: *what* to do — e.g. \"fill the cup with popcorn\"
- Policy: *how* to do it — mapping from sensor inputs to motor commands

---

## Episode loop

Typical RL episode:

1. Reset environment → initial state $s_0$
2. Sample action $a_t \sim \pi_\theta(\cdot \mid s_t)$
3. Apply $a_t$, observe next state $s_{t+1}$ and reward $r_t$
4. Store $(s_t, a_t, r_t, s_{t+1})$
5. Repeat until done, then update $\pi_\theta$ using collected data

---

## Reward design

Reward is **hand-designed** but computed **automatically** by the environment.

Common patterns:

- **Sparse**: only at the end (success = +1, otherwise 0)
- **Dense / shaped**: small rewards for partial progress, penalties for bad events

Example (cup-filling task):

- $+1$ if cup is filled above target height with little spill
- small positive reward for increasing fill height
- negative reward for spilling or tilting the cup too much

Good reward design is critical: it encodes *what we want the robot to learn*.

---

## Challenges in robot RL

- **Sample inefficiency**: real-world episodes are slow and expensive
- **Sparse rewards**: hard to learn from \"success/fail\" alone
- **Continuous actions**: joint torques/velocities are harder to explore than discrete actions
- **Safety**: bad actions can damage hardware or the environment

Common strategies:

- Learn in **simulation**, then transfer (sim-to-real)
- **Initialize with BC**, then use RL for fine-tuning

---

## PPO (high-level)

PPO (Proximal Policy Optimization) is a popular policy-gradient algorithm:

- Improves the policy to increase expected reward
- But **limits how much the policy can change in one update** (via clipping)

This makes training **more stable**, which is important for robot deployments.

---

## See also

- [Teleoperation](../02-teleops/)
- [Behavior Cloning](../03-behavior-cloning/)
- [VLA](../../02-model-class/05-vla/)

---

## Food for Thought

- Real-world RL is slow/expensive (sample inefficiency) and learning from sparse success signals is hard; if you invest in reward shaping, curricula, and evaluation harnesses, RL becomes a practical product lever instead of a long research cycle.
- Safety constraints severely limit exploration; if you couple RL with supervisor-style safety gating and shielded action spaces (including simulation-first), you can improve policies without unacceptable hardware risk.
- Continuous actions are harder to explore than discrete ones, leading to instability; if you standardize hybrid training (BC initialization + RL fine-tuning) and choose action representations carefully, learning becomes both safer and more efficient.
