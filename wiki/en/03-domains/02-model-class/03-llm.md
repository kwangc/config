# LLM (Large Language Model)

---

## From Transformer to LLM

[ML Fundamentals](./02-ml-fundamentals/) covered the core mechanics: Transformer + attention. LLMs apply that architecture at **scale**:

- **More parameters** — billions to hundreds of billions of weights in deeper, wider Transformer stacks
- **More data** — hundreds of billions to trillions of tokens of web-scale text
- **Self-supervised pretraining** — no human labels needed; the training signal comes from predicting text itself

This combination lets models learn grammar, facts, reasoning patterns, and world knowledge from raw text alone.

---

## Architecture variants

Three families emerged from different pretraining objectives:

| Variant | Example models | Objective | Use cases |
|---------|---------------|-----------|-----------|
| **Decoder-only** | GPT, Claude, LLaMA, Gemini | Causal LM (predict next token) | Chat, reasoning, code |
| **Encoder-only** | BERT, RoBERTa | Masked LM (predict masked tokens) | Classification, embeddings |
| **Encoder-decoder** | T5, BART | Seq2seq | Translation, summarization |

Modern frontier models (GPT-4, Claude, Gemini) are all decoder-only. Encoder-only models are still widely used for embeddings and retrieval.

---

## Pretraining objectives

### Causal LM — next-token prediction

Given tokens $t_1, t_2, ..., t_{n-1}$, predict $t_n$.

- **Causal mask**: each token attends only to itself and previous tokens — future tokens are blocked
- **Training**: all positions predict in parallel (efficient); **inference**: one token at a time (autoregressive)
- **Loss**: cross-entropy between predicted logits and true next token

### Diagram: causal mask — who can attend to whom

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 320">
<defs>
<marker id="arrow-en-llm-causal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Top label -->
<text x="340" y="22" text-anchor="middle" font-size="12" fill="#6a6a64">Next-token prediction: given "The robot picked up the", predict "cup"</text>
<!-- Input tokens -->
<rect x="18" y="34" width="78" height="34" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="57" y="56" text-anchor="middle" font-size="12" fill="#CECBF6">The</text>
<rect x="108" y="34" width="78" height="34" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="147" y="56" text-anchor="middle" font-size="12" fill="#CECBF6">robot</text>
<rect x="198" y="34" width="78" height="34" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="237" y="56" text-anchor="middle" font-size="12" fill="#CECBF6">picked</text>
<rect x="288" y="34" width="78" height="34" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="327" y="56" text-anchor="middle" font-size="12" fill="#CECBF6">up</text>
<rect x="378" y="34" width="78" height="34" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="417" y="56" text-anchor="middle" font-size="12" fill="#CECBF6">the</text>
<!-- Predicted token -->
<rect x="476" y="34" width="78" height="34" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="1.5"/>
<text x="515" y="50" text-anchor="middle" font-size="12" fill="#FAC775">cup</text>
<text x="515" y="64" text-anchor="middle" font-size="10" fill="#BA7517">← predicted</text>
<!-- Arrow into predicted -->
<line x1="458" y1="51" x2="474" y2="51" stroke="#EF9F27" stroke-width="1.2" marker-end="url(#arrow-en-llm-causal)"/>
<!-- Causal mask label -->
<text x="340" y="94" text-anchor="middle" font-size="12" fill="#6a6a64">Causal attention mask: each token (row) can attend to highlighted columns only</text>
<!-- Grid column labels -->
<text x="57" y="116" text-anchor="middle" font-size="10" fill="#a8a69e">The</text>
<text x="147" y="116" text-anchor="middle" font-size="10" fill="#a8a69e">robot</text>
<text x="237" y="116" text-anchor="middle" font-size="10" fill="#a8a69e">picked</text>
<text x="327" y="116" text-anchor="middle" font-size="10" fill="#a8a69e">up</text>
<text x="417" y="116" text-anchor="middle" font-size="10" fill="#a8a69e">the</text>
<!-- Grid row labels (attending token) -->
<text x="590" y="140" text-anchor="start" font-size="10" fill="#a8a69e">The →</text>
<text x="590" y="170" text-anchor="start" font-size="10" fill="#a8a69e">robot →</text>
<text x="590" y="200" text-anchor="start" font-size="10" fill="#a8a69e">picked →</text>
<text x="590" y="230" text-anchor="start" font-size="10" fill="#a8a69e">up →</text>
<text x="590" y="260" text-anchor="start" font-size="10" fill="#a8a69e">the →</text>
<!-- Row 1: "The" attends to "The" only -->
<rect x="30" y="124" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="120" y="124" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="210" y="124" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="300" y="124" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="390" y="124" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<!-- Row 2: "robot" -->
<rect x="30" y="154" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="120" y="154" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="210" y="154" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="300" y="154" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="390" y="154" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<!-- Row 3: "picked" -->
<rect x="30" y="184" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="120" y="184" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="210" y="184" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="300" y="184" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="390" y="184" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<!-- Row 4: "up" -->
<rect x="30" y="214" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="120" y="214" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="210" y="214" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="300" y="214" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="390" y="214" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<!-- Row 5: "the" -->
<rect x="30" y="244" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="120" y="244" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="210" y="244" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="300" y="244" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="390" y="244" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<!-- Diagonal guide -->
<line x1="30" y1="124" x2="444" y2="266" stroke="#1D9E75" stroke-width="0.8" stroke-dasharray="4 3" opacity="0.4"/>
<!-- Legend -->
<rect x="30" y="284" width="14" height="14" rx="2" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<text x="48" y="295" font-size="11" fill="#a8a69e">can attend (lower triangle)</text>
<rect x="220" y="284" width="14" height="14" rx="2" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<text x="238" y="295" font-size="11" fill="#a8a69e">blocked (future tokens)</text>
<text x="340" y="314" text-anchor="middle" font-size="11" fill="#6a6a64">Every token predicts its successor simultaneously during training → efficient parallel computation</text>
</svg>

### Masked LM (MLM)

Randomly mask ~15% of tokens; train model to predict masked positions.

- **Bidirectional**: each token attends to all other tokens (no causal mask)
- **Not autoregressive** — cannot generate sequences natively
- **Best for**: text embeddings, classification, retrieval (e.g., BERT-based encoders)

### Seq2seq

Encoder processes full input (bidirectional attention) → decoder generates output (causal).

- Decoder attends to encoder via **cross-attention** (like Q·K·V where K and V come from encoder)
- Best for: translation, summarization, structured generation from a separate input

---

## Prompting

LLMs can follow task descriptions written in natural language — no additional training required. This works because pretraining exposed the model to countless examples of instructions and responses.

### Diagram: zero-shot vs few-shot vs Chain-of-Thought

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 370">
<defs>
<marker id="arrow-en-llm-prompt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Column headers -->
<text x="108" y="20" text-anchor="middle" font-size="13" font-weight="500" fill="#e8e6de">Zero-shot</text>
<text x="340" y="20" text-anchor="middle" font-size="13" font-weight="500" fill="#e8e6de">Few-shot</text>
<text x="572" y="20" text-anchor="middle" font-size="13" font-weight="500" fill="#e8e6de">Chain-of-Thought</text>
<!-- Dividers -->
<line x1="228" y1="28" x2="228" y2="360" stroke="#333331" stroke-width="0.5"/>
<line x1="454" y1="28" x2="454" y2="360" stroke="#333331" stroke-width="0.5"/>
<!-- ===== ZERO-SHOT ===== -->
<!-- Instruction -->
<rect x="20" y="34" width="174" height="52" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="107" y="52" text-anchor="middle" font-size="10" fill="#9E9AC8">Instruction only</text>
<text x="107" y="66" text-anchor="middle" font-size="11" fill="#CECBF6">Classify sentiment</text>
<text x="107" y="80" text-anchor="middle" font-size="11" fill="#CECBF6">of: "Works great!"</text>
<!-- Arrow -->
<line x1="107" y1="88" x2="107" y2="114" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-llm-prompt)"/>
<!-- Model -->
<rect x="62" y="116" width="90" height="28" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="107" y="135" text-anchor="middle" font-size="12" fill="#e8e6de">LLM</text>
<!-- Arrow -->
<line x1="107" y1="146" x2="107" y2="172" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-llm-prompt)"/>
<!-- Output -->
<rect x="30" y="174" width="154" height="28" rx="6" fill="#04342C" stroke="#1D9E75" stroke-width="1"/>
<text x="107" y="193" text-anchor="middle" font-size="12" fill="#9FE1CB">Positive</text>
<!-- Note -->
<text x="107" y="230" text-anchor="middle" font-size="10" fill="#6a6a64">No examples given.</text>
<text x="107" y="244" text-anchor="middle" font-size="10" fill="#6a6a64">Model relies entirely</text>
<text x="107" y="258" text-anchor="middle" font-size="10" fill="#6a6a64">on pretrained knowledge.</text>
<!-- ===== FEW-SHOT ===== -->
<!-- Instruction -->
<rect x="244" y="34" width="174" height="30" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="331" y="48" text-anchor="middle" font-size="10" fill="#9E9AC8">Instruction</text>
<text x="331" y="60" text-anchor="middle" font-size="11" fill="#CECBF6">Classify sentiment.</text>
<!-- Examples -->
<rect x="244" y="72" width="174" height="46" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="331" y="88" text-anchor="middle" font-size="10" fill="#a8a69e">Examples</text>
<text x="331" y="103" text-anchor="middle" font-size="10" fill="#a8a69e">"Amazing!" → Positive</text>
<text x="331" y="115" text-anchor="middle" font-size="10" fill="#a8a69e">"Terrible." → Negative</text>
<!-- Query -->
<rect x="244" y="126" width="174" height="26" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="0.8" stroke-dasharray="4 2"/>
<text x="331" y="143" text-anchor="middle" font-size="10" fill="#EF9F27">"Works great!" → ?</text>
<!-- Arrow -->
<line x1="331" y1="154" x2="331" y2="176" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-llm-prompt)"/>
<!-- Model -->
<rect x="286" y="178" width="90" height="28" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="331" y="197" text-anchor="middle" font-size="12" fill="#e8e6de">LLM</text>
<!-- Arrow -->
<line x1="331" y1="208" x2="331" y2="230" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-llm-prompt)"/>
<!-- Output -->
<rect x="255" y="232" width="152" height="28" rx="6" fill="#04342C" stroke="#1D9E75" stroke-width="1"/>
<text x="331" y="251" text-anchor="middle" font-size="12" fill="#9FE1CB">Positive</text>
<!-- Note -->
<text x="331" y="290" text-anchor="middle" font-size="10" fill="#6a6a64">Examples constrain format</text>
<text x="331" y="304" text-anchor="middle" font-size="10" fill="#6a6a64">and label space — effective</text>
<text x="331" y="318" text-anchor="middle" font-size="10" fill="#6a6a64">for structured output tasks.</text>
<!-- ===== CHAIN-OF-THOUGHT ===== -->
<!-- Instruction + CoT trigger -->
<rect x="468" y="34" width="190" height="46" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="563" y="52" text-anchor="middle" font-size="10" fill="#9E9AC8">Instruction + CoT trigger</text>
<text x="563" y="65" text-anchor="middle" font-size="11" fill="#CECBF6">Classify sentiment.</text>
<text x="563" y="77" text-anchor="middle" font-size="11" fill="#7F77DD">Think step by step.</text>
<!-- Arrow -->
<line x1="563" y1="82" x2="563" y2="104" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-llm-prompt)"/>
<!-- Model -->
<rect x="518" y="106" width="90" height="28" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="563" y="125" text-anchor="middle" font-size="12" fill="#e8e6de">LLM</text>
<!-- Arrow -->
<line x1="563" y1="136" x2="563" y2="156" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-llm-prompt)"/>
<!-- Reasoning chain -->
<rect x="468" y="158" width="190" height="68" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="563" y="174" text-anchor="middle" font-size="10" fill="#a8a69e">Step 1: "Works great" signals</text>
<text x="563" y="188" text-anchor="middle" font-size="10" fill="#a8a69e">positive satisfaction.</text>
<text x="563" y="204" text-anchor="middle" font-size="10" fill="#a8a69e">Step 2: "so far" is mild hedge</text>
<text x="563" y="218" text-anchor="middle" font-size="10" fill="#a8a69e">but overall tone is positive.</text>
<!-- Arrow -->
<line x1="563" y1="228" x2="563" y2="248" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-llm-prompt)"/>
<!-- Output -->
<rect x="487" y="250" width="152" height="28" rx="6" fill="#04342C" stroke="#1D9E75" stroke-width="1"/>
<text x="563" y="269" text-anchor="middle" font-size="12" fill="#9FE1CB">Positive</text>
<!-- Note -->
<text x="563" y="308" text-anchor="middle" font-size="10" fill="#6a6a64">Reasoning steps improve</text>
<text x="563" y="322" text-anchor="middle" font-size="10" fill="#6a6a64">accuracy on multi-step</text>
<text x="563" y="336" text-anchor="middle" font-size="10" fill="#6a6a64">and ambiguous tasks.</text>
<!-- Bottom label -->
<text x="340" y="362" text-anchor="middle" font-size="11" fill="#6a6a64">RAG (Retrieval-Augmented Generation) extends any of these by injecting retrieved documents into the context</text>
</svg>

- **Zero-shot** — task description only; model generalizes from pretraining
- **Few-shot** — task + 2–5 examples; model infers the expected format and label space
- **Chain-of-Thought (CoT)** — "think step by step"; model externalizes reasoning before answering; improves multi-step tasks
- **RAG** — retrieve relevant documents at inference time; inject into context; extends knowledge beyond training data without retraining

---

## Fine-tuning & Alignment

Pretraining gives general capability; fine-tuning shapes behavior and safety:

- **SFT (Supervised Fine-tuning)** — train on (instruction, response) pairs to follow instructions
- **RLHF (Reinforcement Learning from Human Feedback)** — a reward model is trained on human preference pairs, then PPO updates the LLM to maximize reward
- **DPO (Direct Preference Optimization)** — simpler alternative to RLHF; optimizes preferences directly without a separate reward model or RL loop

These steps convert a raw pretrained "base model" into a usable assistant (ChatGPT, Claude, Gemini Chat, etc.).

---

## Evaluation

| Metric | What it measures | Limitation |
|--------|-----------------|-----------|
| **Perplexity** | Language model fit (lower = better) | Does not reflect task performance |
| **Benchmarks** (MMLU, HumanEval, GSM8K) | Task-specific accuracy | Benchmark saturation, data contamination risk |
| **Human eval** | Preference, helpfulness, safety | Expensive and subjective |

No single metric is sufficient. For robotics use, **action-sequence accuracy**, **safety**, and **latency** matter far more than perplexity.

---

## Link to robot / VLA

- LLM → policy (code/command generation), planning, the "L" in VLA
- Action sequence accuracy, safety, latency

---

## See also

- [ML Fundamentals](./02-ml-fundamentals/) — Transformer, attention, Q·K·V
- [VLM](./04-vlm/)
- [VLA](./05-vla/)
- `../../04-research/` — LLM papers
- `../../study/llm/` — notes

---

## Food for Thought

- LLMs are often evaluated with language-centric metrics (perplexity), but robot integration depends on action-sequence accuracy, safety, and low latency; if you define robotics-first evaluation + runtime constraints, LLMs become productizable "planning components" instead of demo-only models.
- Language-to-robot command generation is brittle under ambiguity and tool mismatch; product opportunity is a structured command schema + planner layer that enforces constraints (valid actions, safety bounds) rather than relying on free-form text.
- Multimodal/RAG prompting is powerful but adds complexity and unpredictability (retrieval errors, grounding latency); if we turn grounding + retrieval into a deterministic pipeline with measurable failure modes, deployment becomes reliable enough for real use.
