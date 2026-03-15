# VLA (Vision-Language-Action)

Vision + Language + **Action** — multimodal model for robot control.

---

## Key concepts (TBD)

- **Input:** image/video + (optional) language instruction
- **Output:** robot actions (joint torque, end-effector commands, etc.)
- **Architecture:** VL model + action head, or end-to-end
- **Data:** sim/real demos, teleop, scripted

---

## Bimanual

- Two-hand coordination → large action space, complex data & policy design
- Config's data infrastructure directly supports VLA training quality

---

## See also

- [Robotics](robotics.md)
- [LLM](llm.md)
- `../research/` — VLA papers (RT-2, OpenVLA, etc.)
