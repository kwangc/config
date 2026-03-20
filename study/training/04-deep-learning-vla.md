# Deep Learning — NN, backprop, optimization이 VLA에 어떻게 적용되는가

ML 기초가 있는 비전공자 관점. NN·역전파·최적화가 로봇 VLA에서 어떻게 쓰이는지 정리.

---

## 1. Neural Network (NN) — 왜 로봇에 쓰나?

**입력(이미지, 언어) → 출력(로봇 행동)**을 **비선형 함수**로 근사.

- 선형 모델: 표현력 제한
- NN: 여러 층의 비선형 변환으로 복잡한 입력→출력 관계 학습 가능
- 로봇: "이 장면에서 이 지시일 때 이렇게 움직인다" 같은 패턴을 NN이 학습

**VLA에서의 NN 역할:**

- **Vision encoder**: 이미지 → 특징 벡터 (ResNet, ViT 등)
- **Language encoder**: "컵을 들어 올려" → 텍스트 특징
- **Fusion + Action head**: vision + language → 로봇 action (토크, 위치 등)

---

## 2. Forward pass — 입력에서 출력까지

```
입력(이미지, 텍스트)
  → Encoder layers (conv, attention, …)
  → Fusion (concat, cross-attention 등)
  → Action head (MLP)
  → 출력(행동)
```

각 층: `y = f(Wx + b)`  

- W: 가중치, b: 편향, f: 활성화 함수(ReLU, GELU 등)
- 여러 층을 거치며 점점 "고수준" 표현으로 변환

---

## 3. Backpropagation (역전파) — 학습의 핵심

**목표:** 예측 출력과 정답(데모 행동)의 **오차(loss)**를 줄이기.

**방법:**

1. Forward: 입력 → 출력 계산
2. Loss 계산: 예측 action vs 실제 action (MSE, L1 등)
3. **Backward**: loss를 각 파라미터(W, b)에 대해 미분
4. **Chain rule**로 gradient 전파 — 출력 쪽에서 입력 쪽으로

**직관:**  
“이 출력이 틀렸다” → “어느 뉴런이 잘못 기여했나?” → “그 뉴런의 가중치를 어떻게 바꿔야 하나?”를 역방향으로 계산.

---

## 4. Optimization — 파라미터 업데이트

**Gradient descent:**  
`W_new = W_old - η × gradient`  

- η(learning rate): 한 번에 얼마나 업데이트할지

**실제로 많이 쓰는 옵티마이저:**

- **SGD**: 단순 gradient descent
- **Adam**: momentum + adaptive learning rate → 수렴 빠르고 튜닝 쉬움
- **AdamW**: Adam + weight decay (과적합 완화)

VLA 학습에서도 Adam/AdamW가 기본으로 많이 쓰인다.

---

## 5. VLA 학습 파이프라인 요약

| 단계 | 내용 |
|------|------|
| **데이터** | (이미지, 언어 지시, 행동) 쌍 수집 (데모, 텔레오퍼레이션) |
| **Forward** | 이미지+지시 → NN → 예측 행동 |
| **Loss** | 예측 vs 실제 행동 차이 (MSE, smooth L1 등) |
| **Backward** | loss → gradient (backprop) |
| **Update** | optimizer로 파라미터 갱신 |

**반복** (수만~수백만 스텝) → NN이 "이미지+지시 → 행동"을 잘 예측하도록 수렴.

---

## 6. VLA 특유의 고려사항

| 이슈 | 설명 |
|------|------|
| **다중 모달** | Vision + Language를 어떻게 합칠지 (early/late fusion, cross-attention) |
| **Action 공간** | 이산 vs 연속, 정규화(스케일 맞추기) |
| **시퀀스** | 단일 이미지 vs 비디오, action history |
| **데이터 품질** | 데모 정확도, 노이즈, 분포 편향이 성능에 직결 |

Config처럼 **데이터 인프라**가 중요한 이유: VLA는 데이터 품질·양에 매우 민감하다.

---

## 7. RL + DL 조합 (선택)

RL을 쓸 때:

- **Policy** = NN (위와 같은 구조)
- **Loss** = 보상 기반 (policy gradient, PPO 등)
- **Backprop** = 보상 신호를 policy 파라미터까지 전파

즉, "정답 레이블" 대신 "보상"이 gradient를 만드는 역할. VLA는 보통 먼저 imitation으로 학습하고, RL은 fine-tuning 단계에서 선택적으로 사용.

---

## 참고

- [`03-robot-learning-rl.md`](03-robot-learning-rl.md) — RL 기본
- [VLA 개요](../../wiki/en/domains/vla.md)
- [AI/ML basics](../../wiki/en/domains/ai-ml.md)

