# Multimodal Fusion in VLA

Multimodal fusion is the process of combining vision tokens, language tokens, and robot state into a unified representation that the backbone can reason over. The choice of fusion strategy affects model expressivity, parameter count, training difficulty, and inference latency.

## The Fusion Problem

Vision tokens from a ViT live in a learned visual embedding space. Language tokens from an LLM live in a language embedding space. These two spaces are trained independently on different data distributions and do not naturally align. To produce a good action, the model must:

1. Identify which visual regions are relevant given the language instruction (e.g., "pick up the red cup" → attend to the red cup)
2. Understand the relationship between current state (proprio) and the instruction's goal
3. Produce an action grounded in both modalities simultaneously

The three high-level fusion strategies are:

| Strategy | When fusion happens | Description |
|----------|---------------------|-------------|
| Early fusion | Before the backbone | Modalities combined into a single token sequence at input |
| Mid fusion | Inside the backbone | Cross-attention between modality streams within intermediate layers |
| Late fusion | After the backbone | Modalities processed separately, merged only at the action head |

Modern VLAs almost exclusively use early fusion (concatenation with projection) or mid fusion (cross-attention). Late fusion discards cross-modal interaction too early.

## Projection Layer (LLaVA-Style)

The simplest and most widely used approach: project visual tokens into the LLM's embedding space using a learned linear layer or small MLP, then concatenate with language tokens.

```
vision tokens: N × d_vision    (from ViT)
projection W: d_vision → d_llm  (learned linear or 2-layer MLP)
projected tokens: N × d_llm

input to LLM: [projected vision tokens | language tokens]
```

**Why it works.** The projection layer is the only new component. The ViT backbone and LLM backbone can remain frozen; only the projection weights need to be trained (plus the action head). This makes it extremely parameter-efficient and easy to train.

**Used in:** LLaVA, RT-2, OpenVLA, and most open-source VLAs.

**Limitation.** The projection is a fixed linear map — it is not conditioned on the language instruction. The LLM must do all cross-modal reasoning internally through self-attention. This requires a large LLM to be effective.

## Cross-Attention Fusion

Cross-attention allows language representations to directly attend over visual representations (or vice versa) in a structured way:

```
Flamingo-style:
  language hidden states → queries Q
  visual patch tokens → keys K, values V
  fused = softmax(Q K^T / sqrt(d)) V

Insert cross-attention layers between frozen LLM self-attention layers
```

This is more expressive than a projection layer: each language token can selectively extract the visual information it needs. Cross-attention layers add parameters and training complexity, but they allow the visual information to be modulated by the language query — useful when different instructions require attention to different visual regions.

**Used in:** Flamingo, IDEFICS, Otter.

**Trade-off.** More parameters, more hyperparameters (number of cross-attention layers, where to insert them). The frozen LLM + cross-attention pattern requires careful optimization to avoid degrading either modality's representations.

## Concatenation + Causal Transformer

The most common approach in recent VLAs: simply prepend vision tokens to the language token sequence, and let the causal transformer attend over the mixed sequence.

```
input sequence = [vis_1, ..., vis_N, lang_1, ..., lang_L, state_1, action_1, ...]

causal attention mask: each token attends to all previous tokens
```

This is the simplest possible implementation and requires no architectural changes to the backbone transformer. The LLM processes vision tokens as if they were text tokens at the beginning of the sequence.

**Strengths:**
- No extra parameters beyond the vision projection
- Fully compatible with existing LLM infrastructure (flash attention, vLLM, etc.)
- The full causal context of visual + language is available at every layer

**Limitation.** The causal mask means language tokens cannot attend to vision tokens that come after them in the sequence. Standard practice is to put vision tokens first; language tokens second — so language tokens always have access to visual context.

## Q-Former (BLIP-2 Style)

Q-Former (Query-Former) introduces a set of learned query tokens that cross-attend to the image feature map to produce a fixed-length visual summary:

```
learnable queries: K × d  (K << N, e.g., K=32, N=196)
image features: N × d_vision
Q-Former cross-attention: queries attend to image features
output: K summary tokens  (same K regardless of image resolution)
```

**Key property:** the output size is fixed at K tokens regardless of image resolution or patch size. This decouples the ViT's token count from the LLM's context window, making it possible to use very high-resolution images or many cameras without blowing up the LLM's sequence length.

**Trade-off.** The K query tokens are a bottleneck: information lost in the compression cannot be recovered downstream. If K is too small, fine spatial detail is lost. Choosing K requires empirical tuning.

**Used in:** BLIP-2, InstructBLIP, some robotic manipulation works that use high-resolution inputs.

## Conditioning on Robot State

Proprioceptive state must also be fused into the backbone's context. Two main strategies:

### Prepend as Token

```
stato_emb = MLP(proprio)  → shape: (d,)
prepend to token sequence: [state_token | vis_tokens | lang_tokens]
```

The backbone attends to the state token as part of the input context. This is the most expressive approach and the most common in modern VLAs (π0, ACT). The state token is placed first so that all subsequent tokens can attend to it.

### Add to CLS Embedding

```
cls_emb = cls_emb + MLP(proprio)
```

Simple, adds no tokens to the sequence. Works if the CLS token is used as the backbone's readout for the action head. Less expressive — the proprio information is mixed with the global visual summary rather than exposed as an independent context element.

### Interleaved State Tokens

For recurrent or history-conditioned architectures: include a state token at each timestep in a multi-step observation window. This lets the backbone reason about how state has changed over time. More expensive but necessary for tasks requiring progress tracking.

## Tradeoffs Summary

| Fusion method | Expressivity | Parameter overhead | Training complexity | Common use |
|---------------|-------------|---------------------|---------------------|------------|
| Projection (LLaVA) | Medium | Very low (one linear layer) | Low | RT-2, OpenVLA, most open-source VLAs |
| Cross-attention | High | Medium (new attn layers) | Medium | Flamingo-style; less common in VLA |
| Concatenation + causal | Medium-high | None extra | Very low | π0, most modern VLAs |
| Q-Former | High (with compression) | Medium (query tokens) | Medium | High-res or multi-camera scenarios |

## Practical Recommendations

- **Start with projection + concatenation.** It works well, requires minimal changes to the backbone, and is well-supported by existing training frameworks.
- **Use Q-Former when context length is a constraint.** If you have 4+ cameras or want to use 448×448+ resolution, Q-Former can compress visual tokens before they hit the LLM.
- **Cross-attention is rarely needed for standard manipulation tasks.** The expressivity gain is real but typically not the bottleneck; data diversity and action head design matter more.
- **Always prepend state as a token, not summed with CLS.** It is more expressive and adds only one token to the sequence.

## See Also

- [01 — Overview](./01-overview/)
- [03 — Perception Inputs](./03-perception-inputs/)
- [05 — Action Space](./05-action-space/)
- [08 — Policy Architectures](./08-policy-architectures/)
- [VLM](../../02-model-class/04-vlm/)

## Food for Thought

- If a VLA policy performs differently on visually similar scenes that have different language instructions, the projection layer is not doing enough cross-modal alignment — consider cross-attention layers or check whether the vision tokens are seeing language-relevant regions of the image.
- If adding more cameras degrades performance (despite providing more information), the combined token sequence is likely too long for the backbone to attend to effectively — Q-Former compression or patch size increase will recover the budget before the information overload becomes a problem.
- If you freeze both the ViT and LLM during fine-tuning and only train the projection and action head, you will see fast convergence on in-distribution tasks but poor generalization to new object appearances — partial unfreeze of the ViT's last two layers with a very small LR is often the right balance.
- If your robot state conditioning is producing actions that ignore the current arm configuration, the state is being added (summed) rather than prepended as a token — the sum loses the state's independent signal in the presence of strong visual and language features.
