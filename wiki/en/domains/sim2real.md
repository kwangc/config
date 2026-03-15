# Simulation & Sim2Real

Transferring policies trained in simulation to **real-world robots** and reducing the **reality gap**.

---

## Overview

- **Sim2Real:** build data & policies in sim, deploy on real hardware
- **Reality gap (domain gap):** performance drop due to sim–real mismatch (physics, sensors, appearance)
- **Goal:** use sim for scale/safety while maintaining real-world performance

---

## Key concepts (TBD)

- **Why sim** — data scale, safe iteration, speed
- **Gap causes** — friction, backlash, sensor noise, rendering, dynamics approximation
- **Domain randomization** — randomize sim params (lighting, texture, friction, mass) to improve transfer
- **Dynamic digital twin** — sim synchronized with real for policy dev & eval
- **Mixed training** — sim + real data together

---

## Config context

- Data Platform's sim/real pipeline and quality directly affect Sim2Real performance
- Closing the loop = sim training → real validation → improve data/model

---

## See also

- [Robotics](robotics.md)
- [Data & Scaling](data-scaling.md)
- [Data Platform](../product/data-platform.md)
- [Glossary](../glossary/README.md)
