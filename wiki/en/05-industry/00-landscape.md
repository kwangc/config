# Competitive Landscape — Robotics & Embodied AI

A map of where the key players sit, how they differ from Config, and what to watch.

*Last updated: 2026-03-27*

---

## 2D Positioning Map

Two axes matter most for understanding where a company sits:

- **X-axis: Model-first ↔ Hardware-first** — does the company derive value primarily from AI/software, or from its own robot hardware?
- **Y-axis: Generalist ↔ Specialist** — does it aim for a policy that works across many tasks/embodiments, or optimize for one specific domain?

```
                        Model-first
                              |
          [Generalist]   [Physical Intelligence]
                |              |
   Generalist --+----[Config]--+--------------------- Specialist
   (multi-task) |              |                     (single-task)
         [Octo] |         [1X Technologies]
                |              |
          [Figure]       [Agility Robotics]
                |              |
          [Unitree]     [Boston Dynamics]
                              |
                        Hardware-first
```

Config sits in the **model-first + generalist** quadrant, differentiated by the **data-to-action-label interface** (bimanual precision + scenario diversity + closed-loop iteration).

---

## Company profiles

| Company | Focus | Funding | Config overlap | Config differentiation |
|---------|-------|---------|----------------|------------------------|
| [Physical Intelligence (π)](./01-physical-intelligence/) | Robotics foundation models | ~$470M | Closest: generalist model strategy | Config: data precision pipeline + bimanual focus |
| [Generalist](./02-generalist/) | Embodied foundation models, dexterity | Undisclosed (2025 seed) | High: model-first, generalist | Config: product pipeline, not pure research |
| [1X Technologies](./03-1x/) | Humanoid robots for home/real environments | ~$100M+ | Medium: real-world deployment focus | Config: software + data stack, not hardware |
| [Figure](./04-figure/) | Autonomous humanoid robots | ~$675M+ | Medium: general-purpose manipulation | Config: bimanual precision + data infrastructure |
| [Agility Robotics / Digit](./05-agility-robotics/) | Humanoid for logistics (Amazon partnership) | ~$150M+ | Low-medium: deployment in real warehouses | Config: data precision, not fixed-task pipeline |
| [Boston Dynamics](./06-boston-dynamics/) | Advanced robot hardware + mobility | Acquired by Hyundai | Low: hardware-first, specific platforms | Config: embodiment-agnostic, data-driven |
| [Unitree Robotics](./07-unitree/) | Low-cost humanoid and quadruped robots | Undisclosed | Low: hardware commoditization | Config: software/data stack, not price war |
| [NVIDIA (GR00T / Isaac)](./08-nvidia-gr00t/) | Sim + foundation model platform | (Public; ~$3T market cap) | Medium: sim-to-real + foundation model infra | Config: real-world data, not sim-first |
| [Apptronik / Apollo](./09-apptronik/) | General-purpose humanoid, Samsung partnership | ~$350M | Low-medium: general manipulation tasks | Config: precision bimanual data, not general humanoid |
| [Machina Labs](./10-machina-labs/) | Robotic sheet metal forming | ~$32M | Low: industrial materials, single domain | Different market; interesting data-loop pattern |

---

## What to watch

### For Config

- **Physical Intelligence**: closest strategy; watch their data pipeline and action representation choices
- **NVIDIA GR00T**: if sim-to-real matures, it could reduce the advantage of real-world data collection — monitor transfer quality gap
- **Unitree**: hardware commoditization lowers robot cost — could expand the addressable market for Config's software/data stack
- **Agility/Figure**: real-world deployment at scale gives them unique feedback loops — watch their failure mode and data diversity strategies

### Market dynamics

- **2025-2026 trend**: capital flowing from hardware-first to model-first/data-first startups
- **Bimanual manipulation**: still an unsolved hard problem at scale; Config's focus area is defensible
- **Sim-to-real gap**: actively closing; how fast matters for everyone in this quadrant

---

## See also

- Individual company pages linked in the table above
- [About Config](../01-company/about/)
- [Product Strategy](../02-product/05-product-strategy/)
