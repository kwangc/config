# RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control

*arXiv / Google DeepMind* (RT-2)

---

## 1) 간략한 내용 (공개일, 주요 저자 등)

- **공개일:** 2023-07 (arXiv v1 **2023-07-28** 공개)
- **메인 링크:** [robotics-transformer2.github.io](https://robotics-transformer2.github.io)
- **arXiv:** [2307.15818](https://arxiv.org/abs/2307.15818)
- **주요 저자(대표):** Anthony Brohan, Noah Brown, Justice Carbajal, Yevgen Chebotar, Chelsea Finn, Sergey Levine, Tianhe Yu, Karol Hausman (+ 다수 공저자)

---

## 2) 상세 내용

### 핵심 아이디어: 로봇 액션을 “언어 토큰”처럼 취급

RT-2는 VLM(vision-language model)을 **웹스케일 데이터에서 이미 잘 학습된 백본**으로 두고, 그 모델이 **로봇의 저수준(low-level) 액션을 직접 출력**하도록 co-fine-tuning(동시/혼합 미세조정)하는 레시피를 제안합니다.

핵심 포인트:

- 로봇 액션을 **텍스트 토큰 형태로 인코딩**합니다.
- 추론 시 생성된 액션 토큰을 **디토큰화(de-tokenize)** 해서 연속 제어값으로 바꿔 로봇을 닫힌 루프로 제어합니다.
- 즉, “보기/지시 → 액션 토큰 생성 → 로봇이 실행”이 하나의 정책(policy) 안에서 돌아갑니다.

### 액션 표현(Action representation)

RT-2의 액션은 대략 아래 구성입니다.

- **6-DoF 엔드이펙터 델타**(위치/회전 변화)
- **그리퍼 확장(extension) 레벨**
- **에피소드 종료**를 알리는 이산 명령

연속 변수는 **256 bins**로 이산화되어 토큰/오디널(ordinal) 형태로 모델 출력에 들어갑니다.

### 학습 레시피: 웹 VLM 데이터 + 로봇 궤적 데이터를 co-fine-tuning

가장 중요한 기술적 선택은 **co-fine-tuning**입니다.

- 웹스케일 비전-언어 과제(VQA/caption 스타일 데이터)는 모델이 넓은 시각/의미 지식을 잃지 않게 해줍니다.
- 로봇 궤적 데모는 instruction(자연어 지시)과 관측(image)을 액션으로 매핑하는 능력을 학습시킵니다.
- 학습 배치에서 웹 데이터와 로봇 데모 데이터 비중/가중치를 조절해, 의미적 grounding은 유지하면서 로봇 액션을 배웁니다.

### RT-2의 두 가지 모델 계열

RT-2는 다음 VLM 백본을 사용해 두 계열을 제안/실험합니다.

- **RT-2-PaLI-X**
- **RT-2-PaLM-E**

보고된 스케일은 최대 **55B 파라미터**까지 확장됩니다.

### 안전을 위한 출력 제약

로봇 제어에서는 “원래 텍스트처럼 아무 문장을 생성”하면 안 됩니다.

RT-2는 로봇 액션 태스크일 때 디코딩 과정에서 **유효한 액션 토큰만** 선택되도록 출력 어휘/디코딩을 제약합니다.

### 실시간 추론(inference) 전략

VLA 모델은 온로봇(on-robot)에서 즉시 돌리기 어렵기 때문에,

- **multi-TPU cloud service**에 모델을 올리고
- 로봇은 네트워크로 해당 서비스를 질의하는 형태로 운영합니다.

제어 주파수는 대략:

- **55B 모델:** ~**1–3 Hz**
- **5B 모델:** ~**5 Hz**

### 평가 및 emergent(전이로 생긴) 능력

평가는 “일반화”를 중심으로:

- **unseen objects**
- **unseen backgrounds**
- **unseen environments**

또한 웹 사전학습에서 전이되어 생기는 emergent 능력을 다음처럼 측정합니다.

- **Symbol understanding** (예: “move apple to 3”)
- **Reasoning** (수학, 멀티링구얼 등 구조화된 지시 패턴)
- **Human recognition** (사람/정체성을 지시로 참조하는 경우)

여기에 chain-of-thought/plan 프롬프팅을 더하면, multi-stage semantic inference(계단식 의미 추론)가 더 잘 보인다고 보고합니다.

### 한계(Limitations)

- 물리 “동작 스킬”은 로봇 데이터에 있는 **스킬 분포** 안에서만 크게 좋아집니다(새 동작 프리미티브를 자동으로 획득하진 못함).
- 고속 제어가 필요한 상황에서는 계산 비용이 병목이 될 수 있습니다.

---

## 3) 왜 중요한 논문인가

- 웹스케일 VLM이 **고수준(state machine/planner) 삽입 없이도** 닫힌 루프 저수준 제어로 직접 연결될 수 있음을 보여줍니다.
- VLA를 “언어 토큰/액션 토큰을 같은 방식으로 모델링하는 통합 토큰 공간”으로 정리해, 설계 방향을 명확히 합니다.
- 의미/추론 능력이 사전학습에서 전이되어 로봇 액션 실행에서 실제로 드러날 수 있음을 실험적으로 증명합니다.

---

## 4) Config 적용 사례

- **액션 토큰 유효성 제약**: RT-2의 “액션 어휘 마스킹(유효 토큰만 디코딩)”은 제품화 가능한 아이디어입니다. Config에서도 policy ↔ supervisor 경계에서 action masking + safety gating으로 안정성을 만들 수 있습니다.
- **co-fine-tuning 레시피**: 의미적 grounding(웹 지식)과 로봇 액션 학습을 함께 가져가며, “의미 이해를 잃지 않고 로봇을 배운다”는 관점이 Config의 학습/데이터 전략과 잘 맞습니다.
- **emergent skill 평가 설계**: unseen objects/backgrounds/environments 분리와, symbol/reasoning/human recognition 같은 축은 Config의 evaluation harness 설계 템플릿으로 쓸 수 있습니다.
- **배포/서빙 인식**: RT-2는 throughput과 serving architecture를 제약으로 명시합니다. Config는 latency budget, quantization/distillation, fallback/safety behavior를 포함한 배포 파이프라인을 같이 설계해야 합니다.
- **bimanual 확장 관점**: serving/organizing을 넘어서는 vertical은 역할 분담이 있는 액션 스키마와 multi-effector tokenization이 필요합니다. “단일팔 pick/place”를 넘는 설계 체크리스트로 활용할 수 있습니다.

