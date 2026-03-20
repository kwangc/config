# Behavior Cloning — 데모를 따라 하는 정책 학습

텔레오퍼레이션(teleop) 등으로 수집한 **데모 데이터**를 이용해,  
로봇이 사람의 행동을 그대로 따라 하도록 policy를 학습하는 방법.

---

## 1. 문제 설정

- 데이터셋 $\mathcal{D}$: 데모에서 얻은 $(s_t, a_t)$ 시퀀스들
  - $s_t$: 이미지, 로봇 상태, 언어 지시 등
  - $a_t$: 사람이 실제로 준 action (엔드이펙터 이동, 그리퍼 명령 등)
- 목표: 주어진 state에서 사람이 했던 action을 **최대한 잘 모사하는** policy $\pi_\theta$ 학습

---

## 2. 기본 아이디어 (Supervised Learning)

Behavior Cloning(BC)은 본질적으로 **지도학습**이다.

- 입력: $s_t$
- 정답 레이블: $a_t$
- 모델: $\pi_\theta(s_t)$

연속 action일 때 전형적인 loss는 다음과 같다.

$$
\mathcal{L}_{\text{BC}}(\theta)
  = \mathbb{E}_{(s,a) \sim \mathcal{D}} \big[ \lVert \pi_\theta(s) - a \rVert^2 \big]\,.
$$

직관:

- 같은 state $s_t$가 들어왔을 때,
- 사람이 선택한 action $a_t$와 가능한 한 비슷한 출력을 내도록 $\theta$를 조정한다.

---

## 3. Teleop 데이터 수집과의 연결

BC는 보통 다음 흐름으로 사용된다.

1. **Teleop**:
   - 사람이 VR 컨트롤러, 조이스틱, 핸드 트래킹으로 로봇을 조작
   - 매 step 마다 $(s_t, a_t)$를 로그로 저장
2. **BC 학습**:
   - 수집한 데이터셋 $\mathcal{D}$로 위의 BC loss를 최소화하도록 NN을 학습
3. **결과**:
   - 로봇이 \"사람이 하던 방식\"을 기본적으로 따라 할 수 있는 초기 policy 확보

이후에 RL(PPO 등)을 추가로 사용하면,
**사람 데모를 기반으로 한 policy를 더 미세 조정**하는 단계로 이어질 수 있다.

---

## 4. 한계와 실무 이슈 (covariate shift)

BC에는 다음과 같은 전형적인 문제가 있다.

- 학습 시에는 **사람이 만든 trajectory 상의 state 분포**에서만 본다.
- 실행 시에는 **로봇이 스스로 만든 trajectory 상의 state 분포**를 만나게 된다.
  - 작은 오차들이 쌓이면서, 사람이 가보지 않은 state로 빠르게 벗어나 버릴 수 있다.

이를 **covariate shift / distribution shift** 문제라고 한다.

해결/완화 아이디어:

- **DAgger**류 알고리즘:
  - 로봇이 정책대로 행동을 해 보고, 사람이 그 trajectory를 다시 레이블링해 주는 방식으로
  - 데이터셋을 점진적으로 보강
- **데모 다양성 증가**:
  - 여러 초기 상태, 다양한 스타일의 데모를 수집해 분포를 넓힘
- **RL과의 조합**:
  - BC로 초기화 후, RL로 \"실패에서 회복하는 행동\"을 추가로 학습

---

## 5. 이 문서와의 관계

- `01-teleops.md`:
  - 데모 데이터 수집(teleop) 실무
- `02-behavior-cloning.md` (지금 문서):
  - RL 이전 단계에서, **데모로 policy를 만드는 방법**을 정리
- `03-robot-learning-rl.md`:
  - RL 관점에서 reward, policy, 예시(Popcorn task)를 다룸
- `04-deep-learning-vla.md`:
  - NN/backprop/optimization이 VLA policy 학습에 어떻게 쓰이는지 설명

실무에서는 대략 다음 순서를 따르는 경우가 많다.

1. Teleop/스크립트로 데모를 많이 모은다.
2. BC로 초기 VLA/로봇 policy를 학습한다.
3. 필요하면 RL로 fine-tuning하여 성능·안정성을 올린다.

