# 로봇 학습의 기본 — RL은 어떻게 진행되는가

ML 기초가 있는 비전공자 관점에서, 로봇·VLA에 맞게 RL 흐름을 정리.

> 이 문서는 기존 RL 문서를 실무 흐름(teleop → BC → RL → VLA)에 맞춰 파일명만 정리한 버전입니다.

---

## 1. RL이란?

**Reinforcement Learning(강화학습)** = 에이전트가 **환경**과 상호작용하며, **보상(reward)**을 최대화하는 행동을 학습하는 방식.

- **Supervised Learning**: 정답 레이블이 있는 데이터로 학습
- **RL**: 정답 대신 "보상"만 주고, 시행착오로 좋은 행동을 찾음

로봇에서는 "이렇게 움직여라" 같은 정답이 없고, "과제를 성공했는지" 같은 보상만 주는 경우가 많아서 RL이 자연스럽다.

---

## 2. RL의 기본 구성요소

| 요소 | 설명 | 로봇 예시 |
|------|------|-----------|
| **State (상태)** | 현재 상황 | 카메라 이미지, 관절 각도, 그리퍼 상태 |
| **Action (행동)** | 에이전트가 할 수 있는 선택 | 관절 토크, 엔드이펙터 이동량 |
| **Reward (보상)** | 행동의 좋고 나쁨 | 물건 잡기 성공 +1, 실패 0 |
| **Policy (정책)** | 상태 → 행동 매핑 | "이 이미지 보면 이렇게 움직인다" |

### Policy vs 지시(instruction) — 헷갈리기 쉬운 부분

**Policy**는 "쓰레기가 있으면 주워라" 같은 **입력(지시)**가 아니다.  
Policy는 **상태를 보고 어떤 행동을 할지 결정하는 학습된 함수**다.

| 구분 | 의미 | 예시 |
|------|------|------|
| **지시** | 무엇을 할지 (목표) | "쓰레기가 있으면 주워라", "공을 골대에 넣어라" |
| **Policy** | 어떻게 할지 (학습된 기술) | 카메라 이미지·센서 값을 보고 팔·그리퍼를 어떻게 움직일지 출력하는 NN |

비유: 지시 = "공을 골대에 넣어라", Policy = 공 위치·각도·거리를 보고 발로 어떻게 차야 할지 결정하는 **배운 기술**.

VLA에서는 NN 전체가 policy 역할을 한다. "쓰레기 줍기 policy" = 쓰레기 줍는 방법을 학습한 NN. "쓰레기가 있으면 주워라" = 그 policy에 주는 **언어 지시**다.

---

## 3. RL 진행 흐름 (한 에피소드)

```
1. 환경 초기화 → 초기 state s₀
2. policy에 따라 action a 선택
3. 환경에 action 적용 → 다음 state s', reward r
4. (s, a, r, s') 저장
5. s ← s' 로 갱신
6. 종료 조건까지 2~5 반복
7. 수집한 (s, a, r, s')로 policy 업데이트
```

로봇 예: "물건 집기" 에피소드  
- state: 카메라 영상 + 로봇 상태  
- action: 그리퍼 열기/닫기, 팔 움직임  
- reward: 물건을 성공적으로 집으면 +1, 그 외 0  
- policy: NN이 이미지→액션 출력

---

## 4. Policy 업데이트 — 왜 "학습"이 되는가?

목표: **누적 보상(return)**을 최대화.

- **Return** = $r_1 + \gamma r_2 + \gamma^2 r_3 + \dots$  ($\gamma$ = 할인율, 미래 보상 비중 조절)
- 좋은 action → 높은 return → 그 action을 더 자주 하도록 policy 조정
- 나쁜 action → 낮은 return → 덜 하도록 조정

**방법 예시:**
- **Policy Gradient**: policy 출력 확률을 직접 조정 (좋은 trajectory는 높게, 나쁜 건 낮게)
- **Q-learning / DQN**: "이 state에서 이 action의 가치"를 학습 → 가치 최대화하는 action 선택
- **Actor-Critic**: policy(actor) + 가치함수(critic) 둘 다 학습

---

## 5. Reward 설계 — 사람은 어디까지 개입하는가?

Reward 함수는 **사람이 설계**하지만, 학습이 돌고 있을 때 매 action마다 사람이 점수를 매기지는 않습니다.  
환경이 현재 state와 action, 과제 진행 상황을 보고 **자동으로 reward를 계산**하도록 만들어 두는 구조입니다.

### 5.1 Reward 형태

| 형태 | 예시 |
|------|------|
| **이진(sparse)** | 과제 성공 시 +1, 실패 0 |
| **음수 포함** | 충돌 시 -1, 안전한 움직임 0 |
| **연속값(dense)** | 목표까지 거리 감소량에 비례한 reward |
| **조합형** | 중간 보상(거리 감소) + 최종 성공 보상(완료 시 +1) |

보통 **스케일**을 맞추는 것이 중요합니다.  
예를 들어, 중간 보상은 0.01~0.1 정도, 최종 성공 보상은 1 정도로 두어야, 에이전트가 "끝까지 과제를 완수"하는 것에 더 큰 가치를 두게 됩니다.

### 5.2 Sparse vs Dense (Shaped) reward

1. **Sparse reward (희소 보상)**  
   - 과제 **끝에만** 보상을 줍니다.  
   - 예: 물건을 목표 위치에 정확히 내려놓으면 +1, 그 외에는 모두 0.  
   - 장점: 설계가 단순하고, 진짜 목표에 정렬된 학습이 가능합니다.  
   - 단점: 신호가 너무 희소해서 학습이 어렵고 느립니다.

2. **Dense / Shaped reward (밀집·형태화 보상)**  
   - **중간 단계**에도 작은 보상을 줍니다.  
   - 예:  
     - 손/그리퍼가 물체에 가까워지면 +0.01  
     - 그리퍼로 물체를 잡으면 +0.1  
     - 물체를 목표 위치에 정확히 놓으면 +1  
   - 장점: 학습이 빨라지고, 초기 랜덤 policy에서도 신호를 어느 정도 받을 수 있습니다.  
   - 단점: 잘못 설계하면 **reward hacking**이 생길 수 있습니다. (보상만 최대화하고, 사람이 원하는 행동은 안 하는 경우)

실제 로봇에서는 다음 조합이 자주 사용됩니다.

- **Sparse + curriculum**: 처음에는 쉬운 목표(가까운 위치, 넓은 성공 범위)로 시작하고 점점 난이도를 올립니다.  
- **Imitation으로 초기화 + Sparse RL**: 데모 데이터로 policy를 먼저 학습시키고, 이후 RL로 미세 조정할 때는 주로 sparse reward만 사용합니다.

---

## 6. 로봇 RL의 어려움

| 문제 | 설명 |
|------|------|
| **샘플 비효율** | 실제 로봇은 한 에피소드당 시간·비용이 큼 |
| **희소 보상** | "성공/실패"만 주면 학습 신호가 약함 |
| **연속 action** | 관절 토크 등 연속값 → 이산 action보다 탐색이 어려움 |
| **안전** | 잘못된 action이 로봇·환경을 손상시킬 수 있음 |

→ **시뮬레이션**에서 먼저 학습 후 **실제 로봇**으로 이전(sim-to-real), 또는 **데모(imitation)**로 초기 policy를 잡고 RL로 보완하는 방식이 흔함.

---

## 7. Behavior Cloning 요약

실제 로봇/VLA 시스템에서는 순수 RL만으로 학습하기보다는, 보통 아래 순서를 따른다.

1. 사람이 텔레오퍼레이션(teleop)으로 여러 데모를 수집한다.
2. 그 데모를 이용해 **Behavior Cloning(BC)** 으로 초기 policy를 학습한다.
3. 필요하면 그 policy를 RL(PPO 등)로 미세 조정한다.

BC의 기본 아이디어는 다음과 같다.

- 데이터셋: 데모에서 얻은 $(s_t, a_t)$ 쌍들
- 목적: 주어진 state에서 사람이 했던 action $a_t$를 그대로 모사하도록 policy $\pi_\theta$를 학습
- 연속 action인 경우, 전형적인 loss는 다음과 같다.

  $$
  \mathcal{L}_{\text{BC}}(\theta)
    = \mathbb{E}_{(s,a) \sim \mathcal{D}} \big[ \lVert \pi_\theta(s) - a \rVert^2 \big]\,.
  $$

BC는 **"사람이 하던 방식을 빠르게 따라하게 만드는"** 데에 강하고, RL은 그 위에서 **성능을 더 올리거나, 사람이 잘 시연하기 어려운 미세한 부분을 최적화하는 용도**로 쓰이는 경우가 많다.

자세한 내용은 별도 문서([`02-behavior-cloning.md`](02-behavior-cloning.md))에서 정리하고, 여기서는 RL과의 관계만 간단히 남겨 둔다.

---

## 8. VLA와 RL의 관계

**VLA(Vision-Language-Action)**는 보통 **지도학습(imitation)**으로 학습한다.

- 사람이 시연(데모) → (이미지, 언어 지시, 행동) 쌍 수집
- NN이 "이미지+지시 → 행동"을 예측하도록 학습 (supervised)
- RL은 **보조**로 쓰일 수 있음: 데모로 초기화 후, 실제/시뮬에서 보상 기반으로 미세 조정

즉, "RL이 로봇 학습의 전부"는 아니고, **데모 기반 학습 + (선택) RL** 조합이 VLA/로봇에서 많이 쓰인다.

---

## 9. 예시: 팝콘을 컵에 가득 채우는 RL 파이프라인

하나의 구체적인 예시로, **"팝콘을 컵에 가득 채워라"**라는 과제를 양손 로봇이 수행한다고 가정한다.

### 9.1 과제 세팅

- 환경: 테이블 위에 팝콘 통, 빈 컵, 양손 로봇(왼손·오른손)
- 목표(instruction): "팝콘을 컵에 가득 채워라"

상태와 행동을 간단히 정의하면:

- 상태 $s_t$
  - 카메라 이미지: $I_t$
  - 로봇 상태: 왼손·오른손 end-effector 위치/자세 $\mathbf{x}^L_t, \mathbf{x}^R_t$, 그리퍼 상태 $g^L_t, g^R_t$
- 행동 $a_t$
  - 다음 step까지의 이동 $\Delta \mathbf{x}^L_t, \Delta \mathbf{x}^R_t$
  - 그리퍼 open/close 명령 $g^L_t, g^R_t$

### 9.2 Policy 함수 — "어떻게" 움직일지를 담는 NN

Policy $\pi_\theta(a_t \mid s_t, \text{instr})$는 다음과 같은 구조를 가질 수 있다.

$$
\begin{aligned}
\mathbf{v}_t &= \text{VisionEncoder}(I_t) \\
\mathbf{l} &= \text{TextEncoder}(\text{fill the cup with popcorn}) \\
\mathbf{r}_t &= [\mathbf{x}^L_t, \mathbf{x}^R_t, g^L_t, g^R_t] \\
\mathbf{h}_t &= f_\theta(\mathbf{v}_t, \mathbf{l}, \mathbf{r}_t) \\
a_t &= W_o \mathbf{h}_t + b_o
\end{aligned}
$$

- Vision encoder: 카메라 이미지를 feature 벡터 $\mathbf{v}_t$로 변환
- Text encoder: 언어 지시를 임베딩 $\mathbf{l}$으로 변환
- $f_\theta$: 이 둘과 로봇 상태를 합쳐 action을 결정하는 NN (MLP/Transformer 등)
- 전체가 곧 **"팝콘을 컵에 가득 채우는 policy"**가 된다.

### 9.3 Teleop 데이터 수집 (Human op)

사람 오퍼레이터가 VR 컨트롤러/핸드 트래킹으로 로봇을 텔레오퍼레이션 한다고 하자.

- 매 step 로그:

$$
(s_t, a_t) = (\text{instr}, I_t, \mathbf{r}_t, a_t)
$$

- episode 기준 데이터셋:

$$
\mathcal{D} = \{(s_t^{(i)}, a_t^{(i)})\}_{t,i}
$$

여기서 episode $i$는 "한 번 팝콘을 채운 시도"(성공/실패 모두 포함)이다.

### 9.4 Behavior Cloning (BC) — 지도학습으로 초기 policy 만들기

Teleop 데이터로 **사람의 행동을 모사**하는 policy를 학습한다.

$$
\mathcal{L}_{\text{BC}}(\theta)
  = \mathbb{E}_{(s,a) \sim \mathcal{D}} \big[ \lVert \pi_\theta(s) - a \rVert^2 \big]
$$

- 연속 action이면 보통 MSE loss를 사용
- 직관: "이 state에서 사람이 했던 action을 그대로 내도록 NN을 맞춘다"
- 이 단계까지는 RL이 아니라 **pure supervised learning**

### 9.5 Reward 함수 예시

과제를 다음처럼 정의해 보자.

> 왼손에 든 컵 안에, 목표 높이 이상으로 팝콘이 담겨 있고, 주변에 과하게 흘리지 않았다.

이를 위해 상태에서 측정 가능한 값들을 둔다.

- $h_t$: 컵 안 팝콘 높이 (센서/3D reconstruction 등으로 추정)
- $h_{\text{target}}$: 목표 높이
- $s_t^{\text{spill}}$: 테이블 위에 튄 팝콘 양
- $c_t$: 컵이 안정적으로 잡혀 있는지 (기울기/충돌 등)

#### Sparse reward (에피소드 마지막에만)

에피소드 마지막 시점 $T$에서:

$$
R_T =
\begin{cases}
 +1 & \text{if } h_T \ge h_{\text{target}} \text{ and } s_T^{\text{spill}} \le \epsilon \\
 0 & \text{otherwise}
\end{cases}
$$

- 나머지 step은 $r_t = 0$ → 매우 희소한 보상

#### Dense / shaped reward (중간 단계 보상 포함)

매 step마다:

$$
\begin{aligned}
r_t^{\text{height}} &= \alpha \cdot (h_t - h_{t-1}) \\
r_t^{\text{spill}} &= -\beta \cdot (s_t^{\text{spill}} - s_{t-1}^{\text{spill}})_+ \\
r_t^{\text{stability}} &= -\gamma \cdot \mathbf{1}[\text{컵이 심하게 기울었거나 충돌 발생}] \\
r_t^{\text{final}} &=
\begin{cases}
 +1 & \text{if } t = T \text{ and } h_T \ge h_{\text{target}} \\
 0 & \text{otherwise}
\end{cases}
\end{aligned}
$$

총 reward:

$$
r_t = r_t^{\text{height}} + r_t^{\text{spill}} + r_t^{\text{stability}} + r_t^{\text{final}}
$$

- $\alpha, \beta, \gamma$: 보상 스케일을 조절하는 하이퍼파라미터
- 해석:
  - 팝콘 높이가 늘어나면 $r^{\text{height}}>0$
  - spill이 늘어나면 $r^{\text{spill}}<0$
  - 컵이 너무 기울거나 부딪히면 $r^{\text{stability}}<0$
  - 최종적으로 컵이 가득 차 있으면 $r^{\text{final}}=+1$

Reward 함수 $R(s_t, a_t, s_{t+1})$를 코드로 구현해 두고, **환경이 매 step 자동으로 계산**하게 만든다.

### 9.6 RL fine-tuning (예: PPO류)

BC로 학습한 초기 policy $\pi_{\theta_0}$ 위에 RL로 미세 조정을 한다고 하자.

1. rollout: 환경에서 episode를 실행해 trajectory $\tau$ 수집  
   $$
   \tau = (s_1, a_1, r_1, \dots, s_T, a_T, r_T)
   $$
2. return/advantage 계산:  
   $$
   G_t = \sum_{k=t}^T \gamma^{k-t} r_k,\quad
   A_t = G_t - V_\phi(s_t)
   $$
3. policy gradient 업데이트 (개념적인 형태):  
   $$
   \nabla_\theta J(\theta) \approx
     \mathbb{E}\left[ A_t \nabla_\theta \log \pi_\theta(a_t \mid s_t, \text{instr}) \right]
   $$

- $A_t > 0$인 step의 action은 더 자주 나오도록, $A_t < 0$인 action은 덜 나오도록 policy를 수정
- reward 설계를 잘 해 두면, 곧 **"팝콘을 잘 담는 행동"을 강화**하는 방향의 업데이트가 된다.

#### PPO는 무엇을 하는가?

PPO(Proximal Policy Optimization)는 위와 같은 policy gradient를 사용할 때,
**"policy를 한 번에 너무 많이 바꾸지 않도록"** 제어하는 알고리즘이다.

- 기존 policy $\pi_{\text{old}}$와 새 policy $\pi_\theta$가 있을 때,
  $\dfrac{\pi_\theta(a_t \mid s_t)}{\pi_{\text{old}}(a_t \mid s_t)}$ (확률 비율)을 계산하고,
- 이 비율이 어떤 범위(예: 0.8~1.2)를 크게 벗어나지 않도록 **clip**하여,
- "좋은 행동은 강화하되, 한 번의 업데이트로 policy를 과하게 바꾸지 않도록" 만드는 것이 핵심 아이디어이다.

실무 관점에서 정리하면:

- PPO는 **policy gradient 기반 RL을 더 안정적으로 만드는 기법**이다.
- 로봇·게임 등에서 튜닝 난이도가 상대적으로 낮고 성능이 좋아서,
  "policy를 RL로 미세 조정한다"는 문맥에서 **가장 자주 선택되는 기본 알고리즘 중 하나**라고 이해하면 된다.

### 9.7 전체 그림 정리

1. 사람이 텔레오퍼레이션으로 여러 번 "팝콘 담기"를 수행 → (상태, 행동) 시퀀스 수집  
2. Behavior Cloning으로 초기 policy 학습 → 사람이 하던 방식과 비슷하게 두 손을 쓰는 policy 확보  
3. 사람이 reward 함수를 설계 → "정말 잘 담은 에피소드"에 높은 점수, 나쁜 행동(쏟기, 기울기)에 패널티  
4. RL(PPO 등)로 fine-tuning → reward를 최대화하도록 policy 파라미터 최적화  
5. 최종 policy $\pi_\theta$는 "팝콘을 컵에 가득 채워라" 지시 하에서,  
   **어떤 trajectory가 좋은지**를 암묵적으로 내재한 함수가 된다.

이 예시는 결국 다음 두 가지를 강조한다.

- Reward와 Policy는 모두 함수이지만, **Reward는 사람이 설계해서 고정**, **Policy는 그 Reward를 많이 받도록 학습**을 통해 최적화
- VLA/로봇에서는 **데모 기반 학습(BC) + RL fine-tuning** 조합이 실무에서 자주 쓰이는 패턴

---

## 참고

- [VLA 개요](../../wiki/en/domains/vla.md)
- [Robotics](../../wiki/en/domains/robotics.md)
- Sutton & Barto, *Reinforcement Learning: An Introduction* (기초 RL 교재)

