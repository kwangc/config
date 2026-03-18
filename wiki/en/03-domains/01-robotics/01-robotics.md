# Robotics

Basics and bimanual manipulation context — focusing on **hardware taxonomy** and **system architecture**.

---

## What this page covers

- **Hardware taxonomy**: form factors, DOF, end-effectors, sensors, actuation, compute constraints
- **System architecture**: control stack, policy interfaces, runtime modes, safety/supervision

## Key concepts (TBD)

- **Manipulation** — grasp, place, assemble
- **Bimanual** — two-hand coordination, symmetric/asymmetric tasks → see [Bimanual manipulation](../04-bimanual.md/)
- **Simulation vs real** — sim-to-real, domain gap, data collection
- **Control** — position/velocity/torque, policy interface
- **Data** — teleop, demonstration, reward design

---

## Form factors

- **Dual arm / bimanual:** two 6–7 DOF arms, grippers, workspace, payload
- **Compact gripper arm:** small bimanual (e.g. 3+3 DOF), wearable, tabletop
- **Mounting:** tabletop, mobile base, fixed — affects deployment & compute

→ On-device deployment & quantization: [Deployment](../../08-deployment/01-deployment.md/).

---

## Config mission

- Data infrastructure for general-purpose bimanual robotics
- Real-world validation for data integrity

---

## See also

- [VLA](../../02-model-class/03-vla.md/)
- [Deployment](../../08-deployment/01-deployment.md/)
- [Simulation & Sim2Real](../../06-simulation-sim2real/01-simulation-sim2real.md/)
- `../../04-research/`, `../../05-industry/`
