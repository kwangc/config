# Action Head Architectures

The action head is the final module of a VLA pipeline. It takes the backbone's output representation (a vector or sequence of tokens) and produces an action. This is not a trivial design choice: the expressivity, training dynamics, and inference speed of the entire VLA depend heavily on the action head.

## What Is an Action Head?

After the backbone (transformer, LLM, or CNN) processes the visual + language + state inputs, it produces a representation — typically a vector of dimension d (e.g., d=2048 for a 7B LLM). The action head converts this representation into an action:

```
backbone_representation: (batch, d)
              |
       [action head]
              |
     action: (batch, action_dim)   (e.g., (batch, 7) for delta EEF)
```

The action head is the only new component added on top of a pretrained backbone for VLA fine-tuning. Its design determines:

- Whether multimodal action distributions can be captured
- How fast inference is
- How much supervision signal is available for training
- Whether the head is compatible with the backbone's training objective

## MLP Regression Head

The simplest action head: one or more fully connected layers mapping from backbone embedding to action vector.

```
backbone_emb: (d,)
   → Linear(d, hidden_dim) + ReLU
   → Linear(hidden_dim, hidden_dim) + ReLU
   → Linear(hidden_dim, action_dim)
   = action_pred: (action_dim,)
```

**Loss:** MSE or Huber loss between predicted and demonstrated actions.

**Strengths:**
- Extremely fast inference (<1 ms)
- Simple to implement and debug
- Works well when the demonstration data has low multimodality (one correct action per state)

**Weakness — mode averaging.** If two equally valid actions exist for a given state (e.g., grasp an object from the left or the right), MSE minimization produces the average — an action that is wrong for both cases. This failure mode is common in any manipulation task with multiple valid strategies.

**Used in:** RT-1, early manipulation policies, and as a baseline head in ablation studies.

## Discrete Tokenization (Autoregressive)

Continuous actions are binned into discrete values, and the action sequence is predicted autoregressively as a series of tokens.

```
For action dimension i with range [a_min_i, a_max_i] and B bins:
  bin = floor((a - a_min_i) / (a_max_i - a_min_i) * B)

Action as token sequence: [bin_1, bin_2, ..., bin_D]
  (D = action_dim, e.g., 7 tokens for delta EEF)

Prediction: softmax over B classes per token, predicted one at a time
Loss: cross-entropy at each token position
```

**Why this fits LLM backbones.** The LLM already produces token logits over a vocabulary. Adding action tokens to the vocabulary and predicting them autoregressively requires no architectural changes — the action is just more text tokens at the end of the sequence.

**Strengths:**
- Natural fit for LLM pipelines
- Cross-entropy loss provides a richer training signal than MSE (per-bin probabilities, not just a point prediction)
- Can express some uncertainty through the token distribution

**Weaknesses:**
- **Precision loss**: with B=256 bins and a 10 cm range, each bin is ~0.4 mm — acceptable, but bin count affects accuracy vs. vocabulary size
- **Sequential decoding**: D tokens decoded one at a time; each decoding step is a full forward pass through the LLM; for D=7 and a 7B model, this is 7× slower than a single forward pass
- **Inter-dimension independence**: each action dimension token is predicted given previous dimensions, but the cross-entropy loss treats each dimension independently — no joint distribution is captured
- **Still mode-averaging**: the expected value under the token distribution is still an average of modes for a given observation

**Used in:** RT-2, OpenVLA.

## Diffusion Head

The action is produced by a reverse diffusion process: start from Gaussian noise, apply a learned denoising network iteratively to recover the clean action.

```
Forward process (training, not needed at inference):
  a_noisy = a_clean + sigma_t * epsilon,  epsilon ~ N(0, I)

Reverse process (inference):
  a_T ~ N(0, I)
  for t = T, T-1, ..., 1:
    epsilon_pred = eps_theta(a_t, t, observation)
    a_{t-1} = a_t - step_size * epsilon_pred   (simplified DDPM update)
  final action = a_0

Training loss (denoising score matching):
  L = E [ || epsilon - eps_theta(a_t, t, obs) ||^2 ]
```

The denoising network eps_theta is typically a small MLP or 1D UNet conditioned on the observation representation.

**Why diffusion captures multimodal distributions.** At each noise level, the denoising network learns which direction to push a noisy action toward the data distribution. A distribution with two modes (two valid grasps) is naturally handled: the network learns to push toward the nearest mode, and different random seeds at inference produce different valid modes.

**Strengths:**
- Captures complex, multimodal action distributions
- Does not average modes — each inference sample is a coherent, valid action
- Flexible denoising network can be any architecture

**Weaknesses:**
- **Slow inference**: T denoising steps × forward pass cost; T=100 is standard DDPM; T=10-20 with DDIM or few-step methods
- **Training complexity**: choosing the noise schedule, number of diffusion steps, network architecture requires careful tuning
- **Not natively compatible with LLM autoregressive decoding**

**Inference speedup techniques:**
- DDIM (Denoising Diffusion Implicit Models): reduces steps from 100 to 10-20 without retraining
- Consistency models: one-step generation; some quality loss
- Few-step distillation: train a student to produce good actions in fewer steps

**Used in:** Diffusion Policy, Octo (diffusion variant), π0.

## Flow Matching Head

Flow matching frames action generation as learning a continuous normalizing flow from a simple noise distribution to the action distribution.

```
Data: a_0 ~ p_data (target action), a_noise ~ N(0, I)
Interpolation: a_t = (1-t) * a_noise + t * a_0,  t in [0, 1]
Target velocity: v_t = a_0 - a_noise  (constant over t, i.e., straight-line path)

Training loss:
  L = E_t [ || v_theta(a_t, t, obs) - v_t ||^2 ]

Inference (ODE solver, e.g., Euler):
  a_0 = a_noise
  for t = 0 to 1 with step dt:
    a += v_theta(a, t, obs) * dt
  final action = a
```

**Key advantages over diffusion:**
- **Simpler training objective**: a single regression to the velocity field (not a score function with noise schedule)
- **Straighter trajectories**: the paths from noise to data are approximately straight lines (in expectation), so fewer ODE solver steps are needed
- **Faster inference**: typically 10 steps is sufficient; sometimes as few as 1-3 steps with step-size tuning

**Practical considerations:**
- Still slower than MLP regression (10 steps vs 1 step)
- Like diffusion, expressive enough to capture multimodal distributions
- Preferred over diffusion in most new VLA architectures (π0, etc.) due to training simplicity

**Used in:** π0 (Physical Intelligence), several recent research VLAs.

## Comparison

| Head type | Expressivity | Inference speed | Training complexity | Mode capture | Best suited for |
|-----------|-------------|-----------------|---------------------|--------------|-----------------|
| MLP regression | Low | Very fast (<1 ms) | Low | No | Simple, unimodal tasks; ablation baselines |
| Discrete tokenization | Medium | Slow (sequential decode) | Low (CE loss) | Partial | LLM-native pipelines; language-rich tasks |
| Diffusion (DDPM) | Very high | Slow (50-100 steps) | High | Yes | Multi-modal manipulation; research benchmarks |
| Diffusion (DDIM few-step) | High | Medium (10-20 steps) | High (then fast at inference) | Yes | Practical deployment with diffusion benefits |
| Flow matching | Very high | Medium (5-10 steps) | Medium | Yes | New VLAs; best speed-expressivity tradeoff |

## Choosing a Head

**Choose MLP when:**
- Task has one dominant correct action per state
- Inference latency is critical (<2 ms)
- You need a fast baseline to validate the rest of the pipeline

**Choose discrete tokenization when:**
- You are building on an LLM backbone and want architectural simplicity
- Language generalization is more important than manipulation precision
- You can tolerate slower decoding or use action chunking to amortize it

**Choose diffusion when:**
- The task has genuine multimodality (multiple valid grasps, approach angles)
- Manipulation precision is critical
- You can afford 10-20 denoising steps at inference

**Choose flow matching when:**
- You want diffusion-level expressivity with simpler training and faster inference
- You are starting a new VLA architecture from scratch
- You are using π0 or a π0-inspired pipeline

## See Also

- [01 — Overview](./01-overview/)
- [05 — Action Space](./05-action-space/)
- [07 — Action Chunking](./07-action-chunking/)
- [08 — Policy Architectures](./08-policy-architectures/)
- [11 — Inference & Deployment](./11-inference-deployment/)

## Food for Thought

- If you benchmark a diffusion head and an MLP head on a simple pick-and-place task and they perform similarly, do not conclude that MLP is sufficient — add a task with multiple valid grasp orientations and the MLP will immediately reveal its mode-averaging failure while diffusion will not.
- If your diffusion head's inference is too slow for real-time control, switch to DDIM with 10 steps before considering a different head entirely — the quality loss from 100 to 10 steps is usually small, and 10× latency reduction often brings diffusion into the real-time budget.
- If you are fine-tuning a flow matching head on a new task after pre-training on large cross-embodiment data, the training is usually stable in under 1,000 gradient steps — if it is not converging, the action normalization statistics are wrong, not the head architecture.
- If you are using discrete tokenization with B=256 bins and the robot overshoots targets by a constant offset, the bin boundaries are not centered on the actual range of demonstrated actions — recompute bin edges from dataset quantiles rather than min/max to handle outliers.
