# Action Chunking & Temporal Consistency

Action chunking is a technique for improving the temporal coherence of robot policies by predicting multiple future actions in a single model call. It addresses the fundamental problem of compounding errors that plagues single-step imitation learning policies.

## The Compounding Error Problem

A standard single-step policy is queried at every timestep:

```
For each t:
  a_t = policy(obs_t)
  execute a_t
  observe obs_{t+1}
```

The problem: the policy was trained on demonstration data where the state trajectory follows the human demonstrator's natural path. As soon as the policy makes any small error at step t, the resulting state obs_{t+1} is slightly different from anything in the training data. The policy is now in a slightly out-of-distribution state. It makes another small error. The state diverges further. After enough steps, the robot is in a state far from the training distribution and the policy produces garbage actions.

**This is not a model quality problem — it is a structural property of single-step behavior cloning.** Even a perfect policy (zero training loss) will compound errors when deployed, because demonstrations did not cover every possible state the robot might visit during execution.

The severity grows with:
- Task length (more steps = more opportunities to diverge)
- Task precision (small positional errors matter more for fine manipulation)
- Observation noise (camera jitter or proprioception delay amplifies state estimation error)

## Action Chunking

Action chunking predicts a sequence of K future actions at once:

```
chunk = policy(obs_t) = [a_t, a_{t+1}, a_{t+2}, ..., a_{t+K-1}]
execute a_t, a_{t+1}, ..., a_{t+K-1}   (open-loop for K steps)
then re-query: chunk = policy(obs_{t+K})
```

The policy is only called once every K steps. Within a chunk, execution is open-loop (no new observation is used).

**Why this helps:**

1. **Temporal coherence within chunks.** A single prediction covering K steps must be internally consistent — the predicted a_{t+1} is designed to follow from a_t, and so on. This produces smoother trajectories than K independent single-step predictions.

2. **Reduced query frequency.** Calling the policy K times less often reduces the rate at which the policy visits out-of-distribution states. The error accumulates only at chunk boundaries, not every step.

3. **Better multimodal action handling.** Predicting an entire trajectory (chunk) allows the model to commit to one mode of the distribution for that duration, rather than averaging modes at each individual step.

4. **Amortized compute cost.** If the policy is an LLM with slow inference (100ms per call), executing K=10 actions per call turns 10 Hz control into 1 Hz policy call with 10 Hz execution — manageable.

## Chunk Size Tradeoff

| K (chunk size) | Query frequency | Open-loop duration | Ability to react | Compounding error |
|----------------|-----------------|---------------------|------------------|-------------------|
| 1 (no chunking) | Every step | 0 | Full | High |
| 5–10 | Every 5–10 steps | 0.1–0.2s at 50Hz | Good | Medium |
| 20–50 | Every 20–50 steps | 0.4–1s at 50Hz | Moderate | Low |
| 100+ | Every 100+ steps | 2s+ at 50Hz | Poor | Very low |

**Too small (K=1-3):** Effectively still single-step. Compounding errors persist. Chunking provides little benefit.

**Too large (K=100+):** The chunk covers several seconds of execution open-loop. If the environment changes (an object falls, a human moves something), the policy cannot react. High precision tasks with fine contact dynamics fail because the pre-planned chunk cannot adapt to physical surprises.

**Practical range:** K=10-50 at 50 Hz control (0.2–1 second lookahead) works well for table-top manipulation. ACT uses K=100 at ~30 Hz.

## Temporal Ensemble (Overlapping Chunks)

Temporal ensemble is a refinement that queries the policy at every step but uses a sliding buffer of overlapping chunk predictions:

```
At each step t:
  query policy: chunk_t = [a_t, a_{t+1}, ..., a_{t+K-1}]
  buffer[t:t+K] += chunk_t  (accumulate with weights)

Execute the weighted average of all predictions covering step t:
  action_t = sum_k w_k * chunk_{t-k}[k]   for k in 0..K-1
```

**Exponential weighting.** More recent predictions are given higher weight:

```
w_k = exp(-m * k)   where k is the "age" of the prediction (steps ago)
```

A chunk predicted at the current step gets weight 1. A chunk predicted K-1 steps ago gets weight exp(-m*(K-1)), which is small.

**Why this works.** The exponentially weighted average of K overlapping predictions gives a trajectory that:
- Is dominated by the most recent prediction (always reflects current observations)
- Carries smoothed information from earlier predictions (doesn't jerk to a new mode at each step)
- Produces physically smooth joint/EEF trajectories even when individual predictions have noise

**Cost:** The policy is called every step (not amortized over K steps). This means inference must be fast enough for the control frequency. If the model takes 100ms per call and control is at 50 Hz (20ms budget), temporal ensemble is only feasible with a fast model or at lower control frequencies.

**Used in:** ACT (both chunking with K=100 and temporal ensemble).

## Recurrent Architectures

An alternative to chunking for handling temporal dependency: use a recurrent network (LSTM, GRU) that maintains a hidden state across timesteps.

```
h_0 = 0
For each t:
  a_t, h_{t+1} = policy(obs_t, h_t)
  execute a_t
```

The hidden state h carries information from past observations and actions, allowing the policy to track task progress without explicit history in the input.

**Comparison with chunking:**

| Property | Chunking | Recurrence |
|----------|----------|------------|
| Temporal context | Open-loop K-step lookahead | Unbounded (growing hidden state) |
| Reaction to surprises | Only at chunk boundaries | Every step |
| Architecture change | Prediction head extension | Recurrent backbone required |
| Training complexity | Standard BC loss | Needs sequential training, BPTT |
| Inference complexity | Full forward pass every K steps | Small hidden state update per step |
| Common in modern VLAs | Yes (dominant approach) | Less common |

Recurrent architectures are less common in modern LLM-backbone VLAs because transformer-based models are not naturally recurrent — adding recurrence to a transformer requires architectural modifications. Chunking, by contrast, works with any frozen backbone by extending the output head.

## Hybrid: Chunking + Temporal Ensemble

The combination used in ACT and related systems:

1. **Chunk prediction:** predict K actions at once per policy call
2. **Temporal ensemble:** query at every step but blend K overlapping predictions

This gives:
- The temporal coherence benefits of chunking (each call produces an internally consistent trajectory)
- The smoothness and responsiveness benefits of ensemble (the executed action is always a blend of recent predictions)

**Compute cost:** K× inference budget per step (the policy is called every step), but each call produces K actions. If K=100 and inference is 20ms, this requires running the policy at the control frequency with 20ms latency — feasible on a dedicated GPU.

## Summary: Control Strategies

| Strategy | Model calls per second (at 50 Hz) | Reacts to obs changes | Smoothness |
|----------|-----------------------------------|-----------------------|------------|
| Single-step BC | 50 | Every step | Low (jittery) |
| Chunking only (K=50) | 1 | Every 50 steps (1s) | Medium |
| Temporal ensemble only | 50 | Every step | High |
| Chunking + ensemble | 50 | Every step | High |

## See Also

- [01 — Overview](./01-overview/)
- [05 — Action Space](./05-action-space/)
- [06 — Action Heads](./06-action-heads/)
- [08 — Policy Architectures](./08-policy-architectures/)
- [11 — Inference & Deployment](./11-inference-deployment/)

## Food for Thought

- If your single-step policy succeeds on short tasks (under 5 seconds) but fails reliably on longer tasks, you are seeing compounding error in practice — this is the primary signal that action chunking will help, not a sign that you need more data.
- If you add temporal ensemble and your robot trajectories become smoother but occasionally get "stuck" at task boundaries (e.g., hesitates after picking before starting to place), the exponential decay weight m is too low — the stale old-chunk predictions are dragging the blended action away from the current correct motion.
- If your chunk size K is tuned for one control frequency and you change the robot's control loop rate, K must be retuned (or the chunk duration changes proportionally) — a K that produces 1-second lookahead at 50 Hz produces 0.2-second lookahead at 10 Hz and may be too short.
- If a bimanual task requires both arms to simultaneously contact an object at the same instant, single-step prediction almost never achieves this — action chunking over the entire contact sequence (K large enough to cover approach + contact) lets the model plan simultaneous contact as a coherent chunk.
