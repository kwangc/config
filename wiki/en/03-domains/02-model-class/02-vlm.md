# VLM (Vision-Language Model)

Vision + language grounding models that turn what the robot sees into text and/or structured signals.

---

## Key concepts (TBD)

- **Input:** image/video + (optional) text prompt/instruction
- **Output:** captions, answers, action-relevant structure (e.g., keypoints, affordances)
- **Core components:** vision encoder + multimodal fusion + language decoder (or structured head)
- **Temporal awareness:** for video, consistent perception over time matters more than single-frame accuracy

---

## What VLM adds vs LLM

- **LLM** is language-only; **VLM** adds perception grounding (what is where, what is changing)
- In robotics, grounding quality directly affects downstream planning and control reliability

---

## Bridge to VLA

- VLA typically uses VLM-style representations for perception, then adds an **action head** (or an action policy layer)
- A practical design goal: keep the perception output shape stable enough that the action interface stays robust

---

## See also

- [Robotics](../../01-robotics/01-robotics.md/)
- [LLM](../02-llm.md/)
- [VLA](../03-vla.md/)
- `../../04-research/` — VLM papers (multimodal perception, grounding, video understanding)

---

## Food for Thought

- VLMs often optimize for caption/QA metrics, but robotics needs action-relevant grounding (pose/affordance consistency); if you reframe training/eval around control-facing signals, VLM becomes a dependable perception surface instead of a demo-only model.
- Video understanding is hard because appearance changes, motion blur, and occlusions break single-frame reasoning; the opportunity is to enforce temporal consistency (tracking, state-aware features, failure attribution) so the perception stream stops “jumping” under motion.
- Multimodal fusion is brittle when prompts, schema, and data preprocessing drift; if we formalize interface contracts (what the model must output, with confidence/failure modes), VLM outputs can feed VLA/VLA operations with predictable reliability.

