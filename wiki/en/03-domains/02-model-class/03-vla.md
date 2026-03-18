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

- [Robotics](../../01-robotics/01-robotics.md/)
- [LLM](../02-llm.md/)
- `../../04-research/` — VLA papers (RT-2, OpenVLA, etc.)

---

## Food for Thought

- VLA must simultaneously do multimodal understanding and continuous control, and the “action head + control-stack” integration is usually the bottleneck; if you expose intermediate representations and enforce action constraints, you can turn fragile end-to-end learning into reliable control quality.
- Two-hand (bimanual) expands the action space and coordination requirements, so naive scaling explodes data/policy complexity; if you productize tuple-based action schemas and modular supervision, bimanual becomes an incremental upgrade path instead of a rewrite.
- VLA deployment fails when model latency and safety assumptions drift from real robots; if you treat VLA strictly as a policy layer gated by a supervisor with a clear timing budget, rollout becomes safer and more predictable.
