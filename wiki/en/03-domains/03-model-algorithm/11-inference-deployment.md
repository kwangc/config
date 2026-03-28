# Inference & Real-time Control

Deploying a VLA on physical hardware requires meeting hard real-time latency constraints. This page covers latency sources, optimization techniques, hardware choices, safety integration, and a deployment checklist.

## Control Loop Requirements

Robotic manipulation operates at specific control frequencies. The VLA must produce an action within the control period or the robot's low-level controller will hold the last command.

| Task type | Typical control frequency | Latency budget per step | Notes |
|-----------|--------------------------|--------------------------|-------|
| Slow manipulation (sorting, placing) | 5–10 Hz | 100–200 ms | Generous budget; large models feasible |
| Standard manipulation | 10–25 Hz | 40–100 ms | Typical VLA operating point |
| Contact-rich manipulation | 25–50 Hz | 20–40 ms | Requires fast model or chunking amortization |
| Dynamic manipulation | 50–200 Hz | 5–20 ms | VLA not suitable at full frequency; use residual control |
| Continuous motion | 1 kHz | 1 ms | Not VLA territory; low-level PD control |

**The 10 Hz operating point.** Most current VLA deployments operate at 5–15 Hz for the policy call frequency, even if the low-level controller runs faster. Action chunking allows this: the VLA produces 50 actions at 5 Hz, which the low-level controller executes at 50 Hz.

**Key formula:**

```
effective_latency_per_robot_step = model_latency / chunk_size

Example: model_latency=200ms, chunk_size=20 steps at 50Hz
  effective_latency = 200ms / 20 = 10ms per robot step
  robot can execute at 100 Hz equivalently
```

## Latency Sources

| Component | Typical latency | Notes |
|-----------|-----------------|-------|
| Image capture + transfer | 1–5 ms | USB/ethernet camera; GigE or USB3 |
| Image preprocessing (resize, normalize) | 0.5–2 ms | GPU-accelerated |
| Vision encoder (ViT-B, 224×224) | 5–15 ms | FP16 on GPU |
| Vision encoder (ViT-L, 224×224) | 15–40 ms | FP16 on GPU |
| LLM backbone (7B, single forward pass) | 50–150 ms | FP16 on A100/H100 |
| LLM backbone (7B) | 100–300 ms | FP16 on 3090/4090 |
| MLP action head | <1 ms | Negligible |
| Diffusion head (DDPM, 100 steps) | 100–500 ms | Depends on denoising network size |
| Diffusion head (DDIM, 10 steps) | 10–50 ms | Much more practical |
| Flow matching head (10 steps) | 10–50 ms | Similar to DDIM |
| Autoregressive decoding (7 action tokens) | 50×7 = 350 ms | 7 sequential LLM forward passes |

The two biggest latency sources in modern LLM-backbone VLAs:
1. LLM backbone forward pass
2. Action head generation (especially autoregressive or slow diffusion)

## Inference Optimizations

### Action Chunking (Amortization)

The most impactful optimization. If the model takes 200ms per call and you predict K=20 steps per call, the effective per-step cost is 10ms:

```
effective_cost = model_latency / K
```

No model changes needed; just extend the action head output from 1 step to K steps. See [07 — Action Chunking](./07-action-chunking/) for the full technique.

### Flash Attention

Fused attention computation that processes attention in tiles to avoid materializing the full N×N attention matrix. Provides 2–4× speedup for transformer forward passes with long sequences.

```
Standard attention: O(N^2) memory, O(N^2) time
Flash Attention: O(N) memory, O(N^2) compute but ~2-4x lower wall-clock time
```

Supported in PyTorch 2.0+ and most modern LLM inference frameworks.

### TensorRT / Torch Compile

Compile the model graph into an optimized GPU kernel plan:
- **TensorRT:** NVIDIA's inference optimizer; supports operator fusion, layer calibration for INT8/INT4, and custom kernels
- **torch.compile():** PyTorch's JIT compilation; easier to use; 1.5–3× speedup typical

Most effective for the vision encoder and action head (fixed-size computations). Less benefit for the LLM backbone due to variable sequence lengths.

### CUDA Graph Capture

For fixed-size computations (same batch size, same sequence length at every call), capture the CUDA kernel sequence as a graph and replay it without re-launching kernels:

```python
# Capture
g = torch.cuda.CUDAGraph()
with torch.cuda.graph(g):
    output = model(static_input)

# Replay (no kernel launch overhead)
g.replay()
```

Reduces per-step overhead by 1–3 ms, significant at high control frequencies.

### vLLM / Continuous Batching

For multiple robots sharing a single inference server: vLLM's continuous batching allows efficient batched inference across requests with variable sequence lengths. Useful for lab setups with multiple arms served by one GPU.

### Speculative Decoding

For autoregressive action token generation: use a smaller draft model to propose K tokens at once, then verify with the full model in a single forward pass. Can reduce effective decoding time by 2–3×.

## Quantization

Reduce numerical precision to decrease memory and compute requirements.

| Precision | Speedup vs FP32 | Memory reduction | Quality impact for VLA |
|-----------|-----------------|------------------|------------------------|
| BF16 / FP16 | ~2× | 2× | Minimal; standard practice |
| INT8 | ~3–4× | 4× | Small; acceptable for most tasks |
| INT4 | ~5–8× | 8× | Moderate; precision loss on fine tasks |
| INT2 | >8× | 16× | High; not recommended for VLA |

**Quantize components separately:**

- **Vision encoder:** ViTs are relatively robust to INT8 quantization; semantic features are preserved
- **LLM backbone:** 7B models in INT4 (bitsandbytes, GPTQ) run at ~4-bit precision with acceptable quality loss for manipulation tasks; INT8 is safer for precision-critical tasks
- **Action head (diffusion/flow):** more sensitive to precision than the backbone; keep at FP16 if possible; INT8 with per-tensor calibration is acceptable; avoid INT4 for continuous action output

**Post-training quantization (PTQ) pipeline:**

```
1. Load FP32/BF16 model weights
2. Calibrate on representative robot observations (100–1000 samples)
3. Apply INT8 or INT4 quantization with calibrated scales
4. Evaluate on manipulation validation set
5. If quality loss > threshold, use mixed precision (INT4 backbone, FP16 action head)
```

## Hardware Choices

| Platform | Inference latency (7B FP16) | Power | Cost | Form factor | Recommendation |
|----------|-----------------------------|-------|------|-------------|----------------|
| On-robot: NVIDIA Jetson AGX Orin | 500–1000 ms | 15–60W | $499–$999 | Small, embedded | Too slow for 7B; use smaller model or heavy quantization |
| On-robot: Jetson AGX Orin (INT4) | 150–300 ms | 15–60W | $499–$999 | Small, embedded | Feasible for 5 Hz with K=5 chunking |
| Workstation GPU (RTX 4090) | 80–150 ms | 450W | $1,500–$2,000 | Desktop | Good for lab; too large/power-hungry for mobile robots |
| Server GPU (A100 80GB) | 30–60 ms | 400W | $10,000+ | Rack | Best latency; suitable for multi-robot lab |
| Server GPU (H100 80GB) | 20–40 ms | 700W | $30,000+ | Rack | State-of-the-art; production at scale |
| Cloud (A100 via API) | 50–200 ms + network | N/A | Per-query | N/A | Not suitable for real-time control (network latency) |

**Practical recommendation for VLA deployment:**

- **Single robot, lab/research:** RTX 4090 workstation near robot (cable or 1 Gbps LAN)
- **Single robot, production:** RTX 4090 or A100 in an adjacent compute cabinet; <5ms network latency to robot
- **Multiple robots:** A100 or H100 server running vLLM-style batched inference; 3–8 robots per GPU at 10 Hz
- **Mobile robot / tight form factor:** INT4 quantized 3B model (PaliGemma 3B) on Jetson AGX Orin; 15 Hz feasible with chunking

## Action Head Latency by Type

| Action head | Typical inference time | Optimization path | Notes |
|-------------|----------------------|-------------------|-------|
| MLP (1–2 layers) | <1 ms | torch.compile | Negligible vs. backbone |
| Autoregressive tokens (7 tokens, 7B) | 350–700 ms | Speculative decode, smaller model | Often the bottleneck |
| Autoregressive tokens (7 tokens, 3B) | 150–300 ms | Speculative decode | More practical |
| DDPM diffusion (100 steps) | 100–500 ms | DDIM reduction | Use DDIM |
| DDIM diffusion (10 steps) | 10–50 ms | torch.compile, TensorRT | Practical for real-time |
| Flow matching (10 steps) | 10–50 ms | torch.compile | Preferred new architecture |
| Flow matching (1-3 steps) | 2–15 ms | torch.compile | Emerging; some quality loss |

## Safety Gate Integration

**Never connect VLA output directly to robot hardware.**

All VLA deployments should have a safety gate between the model output and the hardware command:

```
VLA output: raw_action_vector
             |
     [Safety Gate]
             |
     safe_action_vector → Robot hardware

Safety Gate checks (in order):
  1. Workspace bounds: clip EEF target to workspace envelope
  2. Joint limits: clip joint targets to hardware limits
  3. Velocity limits: clip per-joint velocity to max_velocity
  4. Acceleration limits: clip delta-action to max_acceleration
  5. Collision check (if workspace model available): reject actions that intersect known obstacles
  6. Timeout: if model hasn't responded in budget_ms → hold_position command
  7. Watchdog: if robot hasn't received command in 2× control_period → emergency stop
```

**The timeout check is critical.** If the model takes 500ms but the control period is 100ms, the robot must do something for the 400ms before the next action arrives. Options:
- **Hold position:** repeat the last commanded position; safe but static
- **Decay to zero velocity:** slowly decelerate; smooth but may not be safe if mid-contact
- **Execute next chunk step:** if using chunking, the next chunk step is already available; execute it

## Deployment Checklist

Before running a VLA on physical hardware:

**Latency:**
- [ ] Measure end-to-end latency (camera → action) on target hardware
- [ ] Verify model_latency / chunk_size meets control frequency requirement
- [ ] Apply quantization and TorchCompile; re-measure latency

**Accuracy:**
- [ ] Validate action normalization: apply norm → unnorm roundtrip and verify identity
- [ ] Run 10–20 short trials; measure success rate against lab baseline
- [ ] Test with novel object positions and confirm expected generalization behavior

**Safety:**
- [ ] Safety gate implemented and tested with synthetic adversarial action inputs
- [ ] Workspace bounds configured and verified for current robot setup
- [ ] Emergency stop accessible and tested
- [ ] Timeout behavior verified: model hangs → hold position triggered correctly

**Monitoring:**
- [ ] Log all observations, predicted actions, and executed actions with timestamps
- [ ] Log safety gate interventions (how often and why)
- [ ] Log success/failure outcome per trial for post-deployment analysis
- [ ] Set up alerts for anomaly detection (unusual action magnitudes, high uncertainty)

**Rollback:**
- [ ] Previous policy checkpoint retained and deployable within 5 minutes
- [ ] Fallback behavior defined for categories of failure (e.g., grasp failure → return to home pose)

## See Also

- [01 — Overview](./01-overview/)
- [06 — Action Heads](./06-action-heads/)
- [07 — Action Chunking](./07-action-chunking/)
- [08 — Policy Architectures](./08-policy-architectures/)
- [10 — Generalization](./10-generalization/)

## Food for Thought

- If your VLA's end-to-end latency passes the theoretical budget but the robot still behaves jerkily, the issue is often jitter (variance in latency), not mean latency — measure p99 latency, not p50, and add a small action buffer to absorb the worst-case spikes.
- If INT4 quantization produces a 6× speedup but the robot starts overshooting targets, the action head is the culprit (continuous output is more precision-sensitive than token classification) — quantize the backbone to INT4 but keep the action head at FP16 for the best speed-precision tradeoff.
- If the safety gate is triggering workspace bound violations on more than 5% of steps, the policy was trained with a different workspace coordinate frame than the deployment robot — this is an action normalization / coordinate system mismatch, not a safety gate misconfiguration.
- If deploying the same VLA on a new robot at a customer site requires more than one day of engineering work, the deployment pipeline is not productionized — a well-designed deployment stack (with normalization configs, safety gate templates, and hardware-specific calibration scripts) should reduce new-site setup to under 2 hours.
