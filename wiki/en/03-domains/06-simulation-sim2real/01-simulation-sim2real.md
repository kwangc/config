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

- [Robotics](../../01-robotics/01-robotics.md/)
- [Data & Scaling](../../05-data-scaling/01-data-scaling.md/)
- [Data Platform](../../../02-product/01-data-platform.md/)
- [Glossary](../../../06-glossary/README.md/)

---

## Food for Thought

- The reality gap comes from physics, sensors, and appearance mismatch, and it’s why “works in sim” doesn’t ship; if you build a dynamic digital twin + validation loop that keeps sim aligned, the gap becomes measurable and reducible.
- Domain randomization can help but is often a blunt instrument; if you calibrate sim parameters from real logs and use mixed training, you can converge on the true system distribution instead of chasing luck.
- Maintaining sim pipelines is engineering-heavy, and results decay when the world changes; if you productize evaluation that continuously compares sim metrics to real rollouts, the system can self-correct over time.
