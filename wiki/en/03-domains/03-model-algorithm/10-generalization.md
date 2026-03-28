# Generalization & Robustness

A VLA that works in the lab but fails in the field is not a research artifact — it is the default outcome if generalization is not deliberately engineered. This page covers the taxonomy of distribution shifts that VLAs encounter, how they fail, and what to do about it.

## Distribution Shift Taxonomy

A VLA policy is trained on a dataset with a specific distribution over observations, instructions, and robot states. At deployment, any mismatch between this training distribution and the deployment environment is a distribution shift. There are four distinct shift types:

| Shift type | What changes | Typical failure | Detection |
|------------|-------------|-----------------|-----------|
| Visual shift | Lighting, backgrounds, object appearances | Policy ignores or misidentifies objects | Compare image statistics between train and deploy |
| Physical shift | Object mass, surface friction, joint wear | Actions physically correct but insufficient force | Force/torque sensor anomalies |
| Task shift | New instruction phrasing, novel task combinations | Policy misinterprets instruction or ignores it | Language embedding distance |
| Embodiment shift | Different robot, different camera mounting | Completely wrong actions | N/A (architecture level) |

**VLA policies fail silently.** Unlike a classifier that can output low confidence, a regression or diffusion action head always produces an action. The policy executes confidently even when completely wrong. This is the fundamental robustness challenge: the model does not know what it does not know.

## Visual Distribution Shift

The most common failure mode in deployment. The ViT encoder has learned features from the training set's lighting conditions, background appearances, and object textures. A new setting — different ambient lighting, a different table surface, a new object color variant — shifts the patch token distribution enough that the policy produces wrong actions.

**Why it is invisible during lab evaluation.** If you evaluate on the same physical setup as training, visual shift is zero. The policy can look excellent. Deploy to a customer's facility (different lighting, different table, different surrounding objects) and performance collapses.

### Mitigations

**Diverse training environments.** The most reliable mitigation. If the training data covers many different lighting conditions, backgrounds, and object color variants, the policy learns to be invariant to them. Requires collecting or generating diverse demonstrations.

**Domain randomization.** In simulation: randomize lighting color, intensity, background textures, object colors, camera positions during training. In real data: collect demos in multiple rooms, times of day, with varied backgrounds. Sim-to-real transfer: apply extreme domain randomization in sim to bridge the sim-to-real visual gap.

**Image augmentation during training.** Random color jitter, Gaussian noise, and random crop during training teaches the ViT to be invariant to small visual perturbations. Does not substitute for genuine scene diversity but reduces sensitivity to illumination changes.

**Wrist camera as invariant view.** The wrist camera provides a close-range view that is highly correlated with the robot's own state rather than the global scene. It is more invariant to background changes than fixed overhead cameras. Including a wrist camera improves visual robustness.

## Physical Distribution Shift

The robot's dynamics change. A motor ages, an object is heavier than expected, a surface is more slippery, a gripper pad wears down. The policy's action commands — trained to work with nominal dynamics — are no longer effective.

**Mitigation strategies:**

- **Proprioception normalization with live statistics.** Periodically update proprio normalization to account for motor drift (joint position offsets).
- **Force/torque sensing as input.** Add wrist F/T sensor readings to the observation. The policy can learn to adjust grip force or approach angle based on contact feedback. This requires F/T sensor data in training demos.
- **Residual policy.** Train a small residual policy that predicts corrections to the base policy's output, conditioned on recent error signals (e.g., grip force divergence from expected). The base policy provides nominal behavior; the residual adapts.
- **System identification in the loop.** Before each task, run a brief ID trajectory to estimate current system dynamics; condition the policy on estimated parameters.

## Compounding Errors in Deployment

Even without distribution shift, a deterministic policy accumulates small errors over a long trajectory. The state after K steps is the result of K imperfect actions applied sequentially; the deviation from the intended trajectory grows.

**Compounding error rate depends on:**
- Task length (more steps = more error accumulation)
- Policy error magnitude (small errors × many steps = large deviation)
- State feedback frequency (action chunking reduces feedback, potentially increasing per-chunk error)

**Mitigations:**

- **Action chunking + temporal ensemble:** reduces model query frequency while maintaining responsiveness; see [07 — Action Chunking](./07-action-chunking/)
- **Recovery behaviors:** explicitly train on failed states and recovery demonstrations; the policy learns to detect failure and replan
- **Closed-loop contact control:** for contact-rich phases (insertion, peg-in-hole), hand off from VLA to a reactive controller (impedance control, force control) that can handle fine contact dynamics with higher frequency
- **Re-grasping primitives:** for grasping failures, trigger a pre-programmed re-grasp routine rather than relying on the VLA to recover

## Out-of-Distribution (OOD) Detection

Because VLAs fail silently, explicit OOD detection is valuable for safe deployment.

### Confidence Scoring on Action Output

For diffusion or flow-matching heads: run N inference samples and compute the variance of the predicted actions. High variance indicates the model is uncertain about the correct action — a signal to pause and request human intervention.

```
actions = [sample_action(policy, obs) for _ in range(N)]
uncertainty = std(actions)   # per-dimension or aggregate
if uncertainty > threshold:
    trigger_recovery()
```

For discrete tokenization heads: softmax entropy over action token logits. Low entropy = confident; high entropy = uncertain.

### Ensemble Disagreement

Train N policies (different random seeds or different data subsets) and measure their disagreement at each step:

```
disagreement = std([policy_i(obs) for i in range(N)])
```

High disagreement = OOD state. Expensive (N× inference cost) but reliable.

### Heuristic Bounds

Simple and practical for deployment:
- **Velocity bounds:** if the predicted action commands a joint velocity exceeding a safety limit, it is likely wrong
- **Workspace bounds:** if the predicted end-effector target is outside the workspace envelope, reject and hold
- **Action smoothness:** if the predicted action jumps more than delta_max from the previous action, clip or reject

These do not detect all failures but catch the most dangerous ones (unsafe commands).

## Evaluation vs. Generalization

A common mistake: evaluating VLA performance only on the training setup and reporting high success rates. This conflates memorization with generalization.

**What good evaluation should include:**

| Evaluation type | What it tests | Example |
|-----------------|---------------|---------|
| In-distribution | Memorization / interpolation | Objects at positions seen in training |
| Novel object positions | Spatial generalization | Objects at new positions in the same workspace |
| Novel object instances | Visual generalization | Same category, different appearance (new cup color) |
| Novel object categories | Semantic generalization | Object never seen in training at all |
| Novel lighting | Visual invariance | Evaluated under different ambient light |
| Novel instruction phrasing | Language generalization | "Grab the mug" vs "pick up the cup" |
| Long-horizon | Temporal robustness | 10+ step tasks requiring sequential subtasks |

**Zero-shot vs. few-shot generalization.** Zero-shot: the policy is evaluated on novel conditions without any fine-tuning. Few-shot: 1–10 new demonstrations are provided before evaluation. Most production deployments will use some amount of fine-tuning on the deployment environment; pure zero-shot is aspirational.

**Generalization metric.** Report success rate as a function of the number of distribution shifts applied simultaneously. A policy that handles one shift (new lighting) but fails at two simultaneous shifts (new lighting + new object) is informative about robustness limits.

## Data Diversity as the Core Lever

The single most reliable predictor of generalization is training data diversity. More distinct scenes, object instances, lighting conditions, instruction phrasings, and demonstrator styles in training → better generalization.

**Data collection strategies for diversity:**
- Collect demonstrations in multiple rooms / lighting conditions from day one
- Use varied objects per category (not just one mug — use 10-20 different mugs)
- Include multiple demonstrators (different motion styles regularize the policy)
- Deliberately place objects at unusual positions and angles
- Randomize workspace clutter (irrelevant objects in the scene)

**Hardware-in-the-loop diversity.** The most data-efficient diversity strategy: deploy a partially trained policy, let it attempt tasks, collect failures, add failure recovery demonstrations. The policy's own failure distribution is exactly the distribution it needs to be trained on.

## See Also

- [01 — Overview](./01-overview/)
- [03 — Perception Inputs](./03-perception-inputs/)
- [07 — Action Chunking](./07-action-chunking/)
- [09 — Training Strategies](./09-training-strategies/)
- [11 — Inference & Deployment](./11-inference-deployment/)

## Food for Thought

- If your policy achieves 90%+ success in your lab and under 50% at a customer site, the gap is almost always visual distribution shift — before retraining with customer data, add a brightness/white-balance normalization step in the image preprocessing to reduce the impact of lighting differences as a diagnostic.
- If you are planning to benchmark a new VLA architecture, run evaluations on novel object instances and novel instruction phrasings in addition to in-distribution conditions — a 5-point improvement on in-distribution benchmarks that disappears on novel conditions is an architecture that memorizes better, not one that generalizes better.
- If your policy recovers well from grasping failures in lab tests but not in production, the recovery demonstrations in training were collected in the same scene setup as the primary task — recovery behaviors need to be trained across as many scene variations as the primary task.
- If ensemble disagreement correctly predicts failure on a held-out test set, the model already "knows" internally that some states are uncertain — this means the training data distribution already captures the boundary, and adding more diverse data near that boundary will improve performance faster than any architecture change.
