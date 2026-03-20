# Teleoperation(teleop) — 로봇 데모 데이터 수집의 실무

Behavior Cloning(BC)과 RL fine-tuning의 출발점은 대부분 **좋은 데모 데이터**입니다.  
이 문서는 \"사람이 로봇을 조작해서\" 데이터를 모으는 teleop을 실무 관점에서 정리합니다.

---

## 1. Teleop이 필요한 이유

로봇 학습(특히 VLA/양손 조작)은 다음 특성이 있습니다.

- 실패 비용이 큼: 실제 로봇에서 무작위 탐색(RL)만으로는 시간이 오래 걸리고 위험합니다.
- 데모가 강력한 priors: 사람의 시연은 \"어떻게 해야 하는지\"를 정책에 빠르게 주입합니다.

그래서 흔한 전체 흐름은 다음과 같습니다.

1. Teleop으로 데모 수집
2. BC로 초기 policy 학습
3. 필요 시 RL(PPO 등)로 미세 조정

---

## 2. 무엇을 기록해야 하나? (최소 로그 스키마)

데이터는 보통 step 단위로 저장합니다.

- 상태 $s_t$
  - 관측: 이미지/비디오 $I_t$ (single/multi-view)
  - 로봇 proprioception: 관절각 $q_t$, 속도 $\dot{q}_t$, 그리퍼 상태
  - (가능하면) end-effector pose $\mathbf{x}_t$ (position+orientation)
  - (선택) 힘/토크, 촉각, depth/point cloud
  - (선택) 언어 지시(instruction) $u$ (episode 단위로 붙이는 경우가 많음)
- 행동 $a_t$
  - joint command (토크/속도) 또는
  - end-effector delta $\Delta \mathbf{x}_t$ + gripper command
- 타임스탬프
  - $t$ 또는 $\Delta t$ (동기화의 핵심)

실무적으로는 다음 형태가 가장 흔합니다.

$$
(u,\; I_t,\; \mathbf{r}_t)\;\rightarrow\; a_t
$$

여기서 $\mathbf{r}_t$는 로봇 상태(관절/그리퍼/EE pose 등)를 묶은 벡터입니다.

---

## 3. 데이터 품질 체크리스트

Teleop은 \"얼마나 많이\"보다 \"얼마나 일관되게\"가 중요해지는 경우가 많습니다.

- **동기화(sync)**: 이미지와 action이 시간상 맞는가? (지연이 크면 학습이 흔들림)
- **액션 표현**: joint-space vs EE-space 중 무엇이 학습/제어에 적합한가?
- **노이즈/떨림**: 사람 손떨림이 action에 그대로 들어가는가? (필요 시 smoothing)
- **성공/실패 라벨링**: 에피소드별 성공 여부, 실패 원인(쏟음/충돌 등) 메타데이터
- **리셋/초기 상태 다양성**: 같은 초기 조건만 반복하면 정책이 특정 분포에 과적합

---

## 4. 양손(바이매뉴얼) teleop에서 자주 생기는 문제

- **좌/우 손의 역할 분리**: 한 손은 \"안정화\"(컵 잡기), 다른 손은 \"조작\"(퍼 담기)
- **협응 타이밍**: 두 손이 독립적으로 움직이면 오히려 충돌/간섭이 늘어날 수 있음
- **데이터 표현**: action을 두 손으로 분리해 저장하되, episode 단위 목표와 함께 묶어야 함

예: 팝콘 담기 같은 태스크라면

- 왼손: 컵을 안정적으로 유지 (pose 유지 + 그리퍼 유지)
- 오른손: 스쿱/이동/붓기 동작 수행

이 역할 분리가 데이터와 학습 구조(예: action head 구성)에도 영향을 줍니다.

---

## 5. 실무적인 “데이터 포맷” 예시 (개념)

예를 들어 episode를 JSONL/Parquet 등으로 관리한다고 하면, 대략 다음처럼 생각할 수 있습니다.

- episode-level:
  - `instruction: string`
  - `camera_calibration`, `robot_kinematics`
  - `success: bool`, `notes: string`
- step-level (t마다):
  - `rgb_front`, `rgb_wrist_left`, `rgb_wrist_right`
  - `q`, `qdot`, `gripper`
  - `ee_pose_left`, `ee_pose_right`
  - `action_left`, `action_right`
  - `timestamp`

핵심은 \"학습 시 그대로 batch로 읽을 수 있는 형태\"로 정리하는 것입니다.

---

## 6. 다음 문서와의 연결

- 다음: [`02-behavior-cloning.md`](02-behavior-cloning.md) — teleop 데모로 정책을 학습(BC)
- 이후: [`03-robot-learning-rl.md`](03-robot-learning-rl.md) — reward 기반으로 정책을 미세 조정(RL)
- 이후: [`04-deep-learning-vla.md`](04-deep-learning-vla.md) — NN/backprop/optimization이 VLA에 적용되는 방식

