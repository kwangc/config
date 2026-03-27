# VLA (Vision-Language-Action)

Vision + Language + **Action** — multimodal model for robot control.

---

## From VLM to VLA

[VLMs](./04-vlm/) produce language (or structured tokens) from perception. VLAs take this further: instead of generating text, they generate **robot actions** — joint angles, end-effector poses, or other control signals.

The key addition: an **action head** (or action-output layer) that converts the model's internal representations into executable robot commands.

---

## Architecture variants

| Variant | How it works | Examples |
|---------|-------------|---------|
| **Token-based** | Actions are discretized into tokens; VLM backbone predicts action tokens like text | RT-2, OpenVLA |
| **Regression head** | Continuous action vectors predicted by MLP on VLM embeddings | RT-1 |
| **Diffusion policy** | Action distribution modeled with diffusion; higher expressivity for multi-modal distributions | Diffusion Policy, π0 |
| **Action chunking** | Predict N future actions at once; reduces compounding error in long-horizon tasks | ACT, π0 |

### Diagram: VLA architecture

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 280">
<defs>
<marker id="arrow-en-vla-arch" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Title -->
<text x="340" y="20" text-anchor="middle" font-size="12" fill="#6a6a64">VLA: VLM backbone + action head → robot control</text>
<!-- Camera / image input -->
<rect x="18" y="34" width="96" height="52" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="1"/>
<text x="66" y="56" text-anchor="middle" font-size="11" fill="#FAC775">Camera image</text>
<text x="66" y="72" text-anchor="middle" font-size="10" fill="#BA7517">RGB / depth</text>
<!-- Language instruction -->
<rect x="18" y="96" width="96" height="52" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="66" y="117" text-anchor="middle" font-size="11" fill="#CECBF6">Language</text>
<text x="66" y="131" text-anchor="middle" font-size="11" fill="#CECBF6">instruction</text>
<text x="66" y="145" text-anchor="middle" font-size="10" fill="#9E9AC8">"Pick up the cup"</text>
<!-- Arrows to backbone -->
<line x1="116" y1="60" x2="168" y2="90" stroke="#EF9F27" stroke-width="1" marker-end="url(#arrow-en-vla-arch)"/>
<line x1="116" y1="122" x2="168" y2="104" stroke="#7F77DD" stroke-width="1" marker-end="url(#arrow-en-vla-arch)"/>
<!-- VLM Backbone box -->
<rect x="170" y="54" width="160" height="88" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="250" y="80" text-anchor="middle" font-size="12" fill="#e8e6de">VLM Backbone</text>
<text x="250" y="98" text-anchor="middle" font-size="10" fill="#a8a69e">Vision encoder (ViT)</text>
<text x="250" y="112" text-anchor="middle" font-size="10" fill="#a8a69e">+ Language Transformer</text>
<text x="250" y="126" text-anchor="middle" font-size="10" fill="#a8a69e">→ fused representation</text>
<!-- Arrow to action head -->
<line x1="332" y1="98" x2="376" y2="98" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-vla-arch)"/>
<!-- Action head box -->
<rect x="378" y="54" width="130" height="88" rx="6" fill="#085041" stroke="#1D9E75" stroke-width="1"/>
<text x="443" y="80" text-anchor="middle" font-size="12" fill="#9FE1CB">Action head</text>
<text x="443" y="98" text-anchor="middle" font-size="10" fill="#5DCAA5">token / MLP /</text>
<text x="443" y="112" text-anchor="middle" font-size="10" fill="#5DCAA5">diffusion / chunking</text>
<text x="443" y="126" text-anchor="middle" font-size="10" fill="#5DCAA5">→ action vector</text>
<!-- Arrow to robot -->
<line x1="510" y1="98" x2="556" y2="98" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-vla-arch)"/>
<!-- Robot output box -->
<rect x="558" y="54" width="108" height="88" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="612" y="80" text-anchor="middle" font-size="11" fill="#CECBF6">Robot actions</text>
<text x="612" y="98" text-anchor="middle" font-size="10" fill="#9E9AC8">joint angles</text>
<text x="612" y="112" text-anchor="middle" font-size="10" fill="#9E9AC8">EE pose (6-DOF)</text>
<text x="612" y="126" text-anchor="middle" font-size="10" fill="#9E9AC8">gripper state</text>
<!-- Action chunking label -->
<text x="340" y="172" text-anchor="middle" font-size="12" fill="#6a6a64">Single-step vs action chunking</text>
<!-- Single step -->
<rect x="60" y="184" width="240" height="52" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="180" y="204" text-anchor="middle" font-size="11" fill="#e8e6de">Single-step</text>
<text x="180" y="220" text-anchor="middle" font-size="10" fill="#a8a69e">Predict 1 action → execute → observe → repeat</text>
<text x="180" y="234" text-anchor="middle" font-size="10" fill="#a8a69e">Higher latency; compounding errors over time</text>
<!-- Chunked -->
<rect x="374" y="184" width="240" height="52" rx="6" fill="#04342C" stroke="#1D9E75" stroke-width="0.5"/>
<text x="494" y="204" text-anchor="middle" font-size="11" fill="#9FE1CB">Action chunking</text>
<text x="494" y="220" text-anchor="middle" font-size="10" fill="#5DCAA5">Predict N actions → execute all → re-plan</text>
<text x="494" y="234" text-anchor="middle" font-size="10" fill="#5DCAA5">Smoother trajectories; better long-horizon tasks</text>
<!-- Bottom note -->
<text x="340" y="268" text-anchor="middle" font-size="11" fill="#6a6a64">Diffusion-based action heads model multi-modal action distributions (e.g. two valid grasps) more accurately</text>
</svg>

---

## Action representations

What "action" means depends on the control level:

| Representation | Description | Use case |
|---------------|-------------|---------|
| **Joint angles** | Direct servo/motor targets | Low-level, precise control |
| **End-effector pose** | 6-DOF target position + orientation | Higher-level, task-space control |
| **Delta actions** | Change from current state, not absolute | More generalizable across configs |
| **Gripper state** | Binary open/close or continuous grip force | Grasping and manipulation |

For **bimanual** robots, the action space doubles (two full arm action vectors) and adds coordination constraints between the two arms.

---

## Training data

VLAs are data-hungry; diversity and quality of demonstrations are critical:

| Data source | Strengths | Weaknesses |
|-------------|-----------|-----------|
| **Teleoperation** | High quality, real-world ground truth | Slow and expensive to collect |
| **Simulation** | Scalable, safe, infinite variety | Sim-to-real gap in visuals and physics |
| **Scripted demos** | Fast, consistent, easy to generate | Low behavioral diversity |
| **Human video** | Abundant, natural behavior | No action labels — hard to use directly |

**Sim-to-real transfer** remains an open problem: visual domain gap and physics mismatch cause models trained in simulation to fail on real robots.

---

## Key design challenges

- **Latency** — robot control requires real-time feedback; large VLM backbones add inference delay (100–500ms is often too slow)
- **Distribution shift** — robot fails when it encounters states outside the training distribution; small environment changes can cause cascading failures
- **Safety** — incorrect action outputs can damage the robot or the environment; model hallucinations are dangerous
- **Action precision** — discrete token-based action prediction loses continuous-space precision; regression or diffusion heads address this but add complexity

### Diagram: deployment pipeline with safety gating

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 200">
<defs>
<marker id="arrow-en-vla-safety" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Observation -->
<rect x="16" y="68" width="96" height="52" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="1"/>
<text x="64" y="90" text-anchor="middle" font-size="11" fill="#FAC775">Observation</text>
<text x="64" y="106" text-anchor="middle" font-size="10" fill="#BA7517">image + state</text>
<!-- Arrow -->
<line x1="114" y1="94" x2="138" y2="94" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-vla-safety)"/>
<!-- VLA model -->
<rect x="140" y="68" width="110" height="52" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="195" y="90" text-anchor="middle" font-size="11" fill="#e8e6de">VLA model</text>
<text x="195" y="106" text-anchor="middle" font-size="10" fill="#a8a69e">policy layer</text>
<!-- Arrow -->
<line x1="252" y1="94" x2="276" y2="94" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-vla-safety)"/>
<!-- Safety gate -->
<rect x="278" y="56" width="120" height="76" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="1.5"/>
<text x="338" y="80" text-anchor="middle" font-size="11" fill="#FAC775">Safety gate</text>
<text x="338" y="96" text-anchor="middle" font-size="10" fill="#BA7517">action bounds check</text>
<text x="338" y="110" text-anchor="middle" font-size="10" fill="#BA7517">timing budget</text>
<text x="338" y="124" text-anchor="middle" font-size="10" fill="#BA7517">collision check</text>
<!-- PASS arrow -->
<line x1="400" y1="94" x2="426" y2="94" stroke="#1D9E75" stroke-width="1" marker-end="url(#arrow-en-vla-safety)"/>
<text x="413" y="88" text-anchor="middle" font-size="10" fill="#1D9E75">pass</text>
<!-- Execute box -->
<rect x="428" y="68" width="110" height="52" rx="6" fill="#085041" stroke="#1D9E75" stroke-width="1"/>
<text x="483" y="90" text-anchor="middle" font-size="11" fill="#9FE1CB">Execute action</text>
<text x="483" y="106" text-anchor="middle" font-size="10" fill="#5DCAA5">send to robot</text>
<!-- Arrow to robot -->
<line x1="540" y1="94" x2="562" y2="94" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-vla-safety)"/>
<!-- Robot box -->
<rect x="564" y="68" width="96" height="52" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="612" y="94" text-anchor="middle" font-size="11" fill="#CECBF6">Robot</text>
<!-- FAIL path -->
<line x1="338" y1="134" x2="338" y2="168" stroke="#EF9F27" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="338" y1="168" x2="195" y2="168" stroke="#EF9F27" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#arrow-en-vla-safety)"/>
<text x="338" y="162" text-anchor="middle" font-size="10" fill="#EF9F27">fail → fallback / stop</text>
<!-- Bottom note -->
<text x="340" y="192" text-anchor="middle" font-size="11" fill="#6a6a64">Treating VLA as a policy layer gated by a supervisor makes rollout safer and more predictable</text>
</svg>

---

## Bimanual

- Two-hand coordination → large action space, complex data & policy design
- Config's data infrastructure directly supports VLA training quality

---

## See also

- [Robotics](../../01-robotics/01-robotics/)
- [VLM](./04-vlm/)
- [LLM](./03-llm/)
- `../../04-research/` — VLA papers (RT-2, OpenVLA, etc.)

---

## Food for Thought

- VLA must simultaneously do multimodal understanding and continuous control, and the "action head + control-stack" integration is usually the bottleneck; if you expose intermediate representations and enforce action constraints, you can turn fragile end-to-end learning into reliable control quality.
- Two-hand (bimanual) expands the action space and coordination requirements, so naive scaling explodes data/policy complexity; if you productize tuple-based action schemas and modular supervision, bimanual becomes an incremental upgrade path instead of a rewrite.
- VLA deployment fails when model latency and safety assumptions drift from real robots; if you treat VLA strictly as a policy layer gated by a supervisor with a clear timing budget, rollout becomes safer and more predictable.
