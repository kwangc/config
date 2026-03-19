# Deep Learning — VLA에서의 역할

Neural network, backprop, optimization이 Vision-Language-Action(VLA)에서 어떻게 쓰이는지 요약.

---

## 왜 딥러닝인가?

VLA의 목표:

> (이미지, 언어, 로봇 상태) → (로봇 액션)

이 매핑은 매우 비선형적이기 때문에, 여러 층의 비선형 변환을 쌓은 **딥러닝 모델**이 자연스러운 선택입니다.

---

## VLA에서의 NN 역할

전형적인 구성:

- **Vision encoder**: 이미지 → feature 벡터 (예: ResNet, ViT)
- **Language encoder**: 텍스트 지시 → 텍스트 임베딩
- **Fusion + Action head**: vision + language (+ 로봇 상태) → action

액션 표현:

- joint-space 명령
- 엔드이펙터 위치/자세 변화
- 더 상위의 motion primitive 등

---

## Forward / Backprop 요약

**Forward pass:**

```
입력(이미지, 텍스트, 상태)
  → 인코더 레이어(conv/transformer)
  → fusion 레이어
  → action head(MLP)
  → 예측 액션
```

**Backprop:**

- 예측 액션 vs 데모 액션 사이의 오차(loss)를 계산
- chain rule로 모든 레이어에 gradient를 전파
- optimizer(Adam, AdamW 등)로 파라미터 업데이트

---

## 학습 파이프라인 (imitation 관점)

BC 스타일의 VLA 학습에서는:

1. 데모 수집: $(\text{image}_t, \text{text}, \text{state}_t, a_t)$
2. Forward: 네트워크가 $\hat{a}_t$ 예측
3. Loss: $\hat{a}_t$ vs $a_t$ (MSE, smooth L1 등)
4. Backprop + optimizer step
5. 여러 epoch 반복 → \"이미지+지시 → 행동\" mapping 학습

학습이 끝나면 이 네트워크가 곧 **policy** 역할을 합니다.

---

## RL과의 조합

RL을 함께 쓸 때:

- policy는 여전히 neural network
- loss는 reward로부터 유도(policy gradient, PPO 등)
- backprop은 보상 기반 gradient를 네트워크 파라미터까지 전달

실무에서는:

1. 먼저 imitation(BC)으로 학습
2. 이후 RL로 성능·견고성을 fine-tuning 하는 패턴이 많습니다.

---

## 참고

- [Robot Learning (RL)](../../04-model-training/04-robot-learning-rl.md/)
- [Domains 개요](../README.md/)
- [VLA](../../02-model-class/03-vla.md/)

---

## Food for Thought

- (이미지, 언어, 로봇 상태) → 로봇 액션 매핑은 비선형적이고 representation/아키텍처 선택에 민감합니다; 제어에 중요한 신호 중심으로 fusion/action head를 설계하면 일반화가 “제품 약속”이 될 수 있습니다.
- BC는 사람처럼 행동하게 만들기엔 강하지만 회복/견고성을 자동으로 해결하지는 못합니다; safety-aware 목표와 표준화된 action target을 가진 “BC→RL” 학습 프로토콜을 만들면 학습이 더 안정적으로 운영됩니다.
- 딥러닝 VLA 학습/퓨전 스택은 계산량이 크지만, 결국 엣지에 배포해야 합니다; 압축/양자화와 on-device 검증을 학습 단계에 포함시키면 “훈련되는 모델이 곧 배포되는 모델”이 됩니다.
