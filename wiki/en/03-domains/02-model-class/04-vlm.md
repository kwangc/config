# VLM (Vision-Language Model)

Vision + language grounding models that turn what the robot sees into text and/or structured signals.

---

## From LLM to VLM

[LLMs](./03-llm/) process token sequences. VLMs extend this by converting **images into token-like representations** that the same Transformer decoder can attend to — same attention mechanism, now spanning two modalities.

The key addition: a **vision encoder** that maps image patches into embedding vectors, plus a **fusion** step to combine them with text tokens.

---

## Architecture

Three components working in sequence:

1. **Vision encoder** — splits the image into patches, embeds each into a vector (ViT-style)
2. **Projection / fusion** — maps visual embeddings into the same space as text tokens
3. **Language decoder** — same Transformer decoder as an LLM, but visual tokens are in its context

### Diagram: VLM architecture

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 300">
<defs>
<marker id="arrow-en-vlm-arch" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Title -->
<text x="340" y="20" text-anchor="middle" font-size="12" fill="#6a6a64">VLM: image and text tokens share the same Transformer decoder</text>
<!-- Image input box with patch grid -->
<rect x="18" y="36" width="90" height="90" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="1"/>
<text x="63" y="56" text-anchor="middle" font-size="10" fill="#BA7517">Image input</text>
<!-- Patch grid inside image box -->
<rect x="24" y="62" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="45" y="62" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="66" y="62" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="87" y="62" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="24" y="83" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="45" y="83" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="66" y="83" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="87" y="83" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="24" y="104" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="45" y="104" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="66" y="104" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="87" y="104" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<text x="63" y="140" text-anchor="middle" font-size="9" fill="#BA7517">patches (e.g. 16×16 px)</text>
<!-- Arrow 1 -->
<line x1="110" y1="81" x2="136" y2="81" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-vlm-arch)"/>
<!-- ViT encoder box -->
<rect x="138" y="54" width="108" height="54" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="192" y="76" text-anchor="middle" font-size="12" fill="#CECBF6">Vision encoder</text>
<text x="192" y="92" text-anchor="middle" font-size="10" fill="#9E9AC8">(ViT)</text>
<text x="192" y="120" text-anchor="middle" font-size="10" fill="#6a6a64">image → patch</text>
<text x="192" y="133" text-anchor="middle" font-size="10" fill="#6a6a64">embedding vectors</text>
<!-- Arrow 2 -->
<line x1="248" y1="81" x2="272" y2="81" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-vlm-arch)"/>
<!-- Projection box -->
<rect x="274" y="54" width="108" height="54" rx="6" fill="#085041" stroke="#1D9E75" stroke-width="1"/>
<text x="328" y="76" text-anchor="middle" font-size="12" fill="#9FE1CB">Projection</text>
<text x="328" y="92" text-anchor="middle" font-size="10" fill="#5DCAA5">(linear / MLP)</text>
<text x="328" y="120" text-anchor="middle" font-size="10" fill="#6a6a64">map visual vectors</text>
<text x="328" y="133" text-anchor="middle" font-size="10" fill="#6a6a64">into text token space</text>
<!-- Text tokens coming from top -->
<rect x="274" y="160" width="108" height="36" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="328" y="180" text-anchor="middle" font-size="11" fill="#CECBF6">Text tokens</text>
<text x="328" y="194" text-anchor="middle" font-size="10" fill="#9E9AC8">"Pick up the cup"</text>
<!-- Arrows into concat -->
<line x1="328" y1="108" x2="328" y2="134" stroke="#1D9E75" stroke-width="1" marker-end="url(#arrow-en-vlm-arch)"/>
<line x1="328" y1="196" x2="328" y2="220" stroke="#7F77DD" stroke-width="1" marker-end="url(#arrow-en-vlm-arch)"/>
<!-- Concat box -->
<rect x="250" y="222" width="156" height="36" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="328" y="240" text-anchor="middle" font-size="11" fill="#e8e6de">Concatenate tokens</text>
<text x="328" y="254" text-anchor="middle" font-size="10" fill="#a8a69e">[visual tokens | text tokens]</text>
<!-- Arrow 3 -->
<line x1="408" y1="81" x2="432" y2="81" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-vlm-arch)"/>
<line x1="406" y1="240" x2="432" y2="200" stroke="#444441" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#arrow-en-vlm-arch)"/>
<!-- LLM Decoder box -->
<rect x="434" y="54" width="108" height="54" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="488" y="76" text-anchor="middle" font-size="12" fill="#CECBF6">LLM Decoder</text>
<text x="488" y="92" text-anchor="middle" font-size="10" fill="#9E9AC8">(same as LLM)</text>
<text x="488" y="120" text-anchor="middle" font-size="10" fill="#6a6a64">attends to visual +</text>
<text x="488" y="133" text-anchor="middle" font-size="10" fill="#6a6a64">text tokens together</text>
<!-- Arrow 4 -->
<line x1="544" y1="81" x2="568" y2="81" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-vlm-arch)"/>
<!-- Output box -->
<rect x="570" y="54" width="96" height="54" rx="6" fill="#04342C" stroke="#1D9E75" stroke-width="1"/>
<text x="618" y="74" text-anchor="middle" font-size="11" fill="#9FE1CB">Output</text>
<text x="618" y="88" text-anchor="middle" font-size="10" fill="#5DCAA5">caption / answer</text>
<text x="618" y="102" text-anchor="middle" font-size="10" fill="#5DCAA5">bbox / affordance</text>
<!-- Bottom label -->
<text x="340" y="278" text-anchor="middle" font-size="11" fill="#6a6a64">Most open-source VLMs (LLaVA, InternVL) use early fusion: visual tokens are prepended to text tokens</text>
<text x="340" y="294" text-anchor="middle" font-size="11" fill="#6a6a64">and processed together by a single decoder-only Transformer</text>
</svg>

### Vision encoder (ViT)

- Image is divided into fixed-size patches (e.g. 16×16 px per patch)
- Each patch is linearly projected to an embedding vector
- Positional embeddings are added → a sequence of patch tokens, fed into a Transformer encoder
- Result: sequence of visual embeddings (e.g. 256 vectors for a 256×256 image at patch size 16)

### Multimodal fusion strategies

| Strategy | How it works | Examples |
|----------|-------------|---------|
| **Early fusion** | Concat visual + text tokens; single Transformer processes both | LLaVA, InternVL |
| **Cross-attention** | Separate visual Transformer; text decoder cross-attends to it | Flamingo |
| **Prefix / adapter** | Visual tokens inserted as prefix; minimal architecture change | MiniGPT-4 |

---

## Pretraining strategies

VLMs are typically trained in stages:

1. **Contrastive pretraining (CLIP-style)** — align image and text in a shared embedding space; learn similarity without generation
2. **Generative fine-tuning** — train on image-text pairs (captions, VQA, instruction following) to produce grounded text from images
3. **Task-specific fine-tuning** — for robotics: grounding tasks, spatial relationships, affordance labeling

---

## Output types for robotics

Depending on the head and prompt, a VLM can produce:

### Diagram: VLM output types

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 220">
<defs>
<marker id="arrow-en-vlm-out" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Shared input label -->
<text x="340" y="18" text-anchor="middle" font-size="12" fill="#6a6a64">Same image, different outputs depending on prompt / head</text>
<!-- Dividers -->
<line x1="170" y1="24" x2="170" y2="210" stroke="#333331" stroke-width="0.5"/>
<line x1="340" y1="24" x2="340" y2="210" stroke="#333331" stroke-width="0.5"/>
<line x1="510" y1="24" x2="510" y2="210" stroke="#333331" stroke-width="0.5"/>
<!-- Column headers -->
<text x="85" y="42" text-anchor="middle" font-size="12" font-weight="500" fill="#e8e6de">Caption</text>
<text x="255" y="42" text-anchor="middle" font-size="12" font-weight="500" fill="#e8e6de">VQA</text>
<text x="425" y="42" text-anchor="middle" font-size="12" font-weight="500" fill="#e8e6de">Spatial grounding</text>
<text x="595" y="42" text-anchor="middle" font-size="12" font-weight="500" fill="#e8e6de">Affordance</text>
<!-- Caption column -->
<rect x="16" y="52" width="136" height="80" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="84" y="72" text-anchor="middle" font-size="10" fill="#a8a69e">Prompt: "Describe"</text>
<text x="84" y="90" text-anchor="middle" font-size="11" fill="#e8e6de">"A robot arm is</text>
<text x="84" y="106" text-anchor="middle" font-size="11" fill="#e8e6de">picking up a red</text>
<text x="84" y="122" text-anchor="middle" font-size="11" fill="#e8e6de">cup from a table."</text>
<text x="84" y="152" text-anchor="middle" font-size="10" fill="#6a6a64">Free-text description.</text>
<text x="84" y="166" text-anchor="middle" font-size="10" fill="#6a6a64">Useful for logging,</text>
<text x="84" y="180" text-anchor="middle" font-size="10" fill="#6a6a64">scene understanding.</text>
<!-- VQA column -->
<rect x="186" y="52" width="136" height="80" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="254" y="72" text-anchor="middle" font-size="10" fill="#a8a69e">Q: "Is the cup empty?"</text>
<text x="254" y="93" text-anchor="middle" font-size="11" fill="#9FE1CB">"No, it appears to</text>
<text x="254" y="109" text-anchor="middle" font-size="11" fill="#9FE1CB">contain liquid."</text>
<text x="254" y="152" text-anchor="middle" font-size="10" fill="#6a6a64">Targeted Q&A about</text>
<text x="254" y="166" text-anchor="middle" font-size="10" fill="#6a6a64">scene contents.</text>
<!-- Spatial grounding column -->
<rect x="356" y="52" width="136" height="80" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="424" y="72" text-anchor="middle" font-size="10" fill="#a8a69e">Q: "Where is the cup?"</text>
<text x="424" y="93" text-anchor="middle" font-size="11" fill="#FAC775">bbox: [142, 87,</text>
<text x="424" y="109" text-anchor="middle" font-size="11" fill="#FAC775">198, 143]</text>
<text x="424" y="152" text-anchor="middle" font-size="10" fill="#6a6a64">Localization: pixel</text>
<text x="424" y="166" text-anchor="middle" font-size="10" fill="#6a6a64">coords for planning.</text>
<!-- Affordance column -->
<rect x="526" y="52" width="136" height="80" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="594" y="72" text-anchor="middle" font-size="10" fill="#a8a69e">Q: "How to grasp?"</text>
<text x="594" y="90" text-anchor="middle" font-size="11" fill="#9FE1CB">grasp_center:</text>
<text x="594" y="106" text-anchor="middle" font-size="11" fill="#9FE1CB">[170, 115]</text>
<text x="594" y="122" text-anchor="middle" font-size="11" fill="#9FE1CB">angle: 90°</text>
<text x="594" y="152" text-anchor="middle" font-size="10" fill="#6a6a64">Where/how to interact</text>
<text x="594" y="166" text-anchor="middle" font-size="10" fill="#6a6a64">with the object.</text>
<text x="340" y="204" text-anchor="middle" font-size="11" fill="#6a6a64">Spatial grounding and affordance outputs are most directly useful for robot control</text>
</svg>

---

## Grounding for robotics

Standard VLM benchmarks (BLEU, CIDEr, VQA accuracy) don't capture what robots need:

- **Spatial accuracy** — "pick up the cup on the left" requires precise localization, not just object recognition
- **Affordance prediction** — where and how to grasp, not just what the object is
- **Temporal consistency** — for video, perception must be stable across frames; single-frame jumps break downstream control

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

- [ML Fundamentals](./02-ml-fundamentals/) — Transformer, attention, Q·K·V
- [LLM](./03-llm/)
- [VLA](./05-vla/)
- `../../04-research/` — VLM papers (multimodal perception, grounding, video understanding)

---

## Food for Thought

- VLMs often optimize for caption/QA metrics, but robotics needs action-relevant grounding (pose/affordance consistency); if you reframe training/eval around control-facing signals, VLM becomes a dependable perception surface instead of a demo-only model.
- Video understanding is hard because appearance changes, motion blur, and occlusions break single-frame reasoning; the opportunity is to enforce temporal consistency (tracking, state-aware features, failure attribution) so the perception stream stops "jumping" under motion.
- Multimodal fusion is brittle when prompts, schema, and data preprocessing drift; if we formalize interface contracts (what the model must output, with confidence/failure modes), VLM outputs can feed VLA/VLA operations with predictable reliability.
