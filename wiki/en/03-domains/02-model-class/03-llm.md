# LLM (Large Language Model)

---

## Key concepts (TBD)

- **Transformer** — self-attention, encoder/decoder
- **Pretraining objectives** — MLM, causal LM, seq2seq
- **Prompting** — zero-shot, few-shot, CoT, RAG
- **Evaluation** — perplexity, downstream tasks, human eval
- **Multimodal** — vision-language, link to VLA

---

## Link to robot / VLA

- LLM → policy (code/command generation), planning, the "L" in VLA
- Action sequence accuracy, safety, latency

---

## See also

- `../../04-research/` — LLM papers
- `../../study/llm/` — notes

---

## Food for Thought

- LLMs are often evaluated with language-centric metrics (perplexity), but robot integration depends on action-sequence accuracy, safety, and low latency; if you define robotics-first evaluation + runtime constraints, LLMs become productizable “planning components” instead of demo-only models.
- Language-to-robot command generation is brittle under ambiguity and tool mismatch; product opportunity is a structured command schema + planner layer that enforces constraints (valid actions, safety bounds) rather than relying on free-form text.
- Multimodal/RAG prompting is powerful but adds complexity and unpredictability (retrieval errors, grounding latency); if we turn grounding + retrieval into a deterministic pipeline with measurable failure modes, deployment becomes reliable enough for real use.
