# Product Strategy

로봇공학, VLA 기반 제어, 바이매뉴얼 조작, 그리고 Data Platform + Foundation Model 위에서 돌아가는 소프트웨어 지향 제품 전략에 대해 Config가 왜 이 길을 택하는지 정리합니다.

---

## 1) Why Robotics?

Robotics는 “일반 지능”이 실제 현업에서 동작하는 형태로 구현되는 영역입니다. 지각은 반드시 안전하고 견고하며, 실기구에서 정확한 타이밍으로 실행되는 행동으로 이어져야 합니다. 이 과정은 데이터, 시스템 설계, 배포 제약이 촘촘히 맞물리도록 강제해서, 추상적인 연구를 반복 가능한 제품 학습으로 전환하게 만듭니다.

---

## 2) Why VLA model? not rules or other types of control?

룰 기반 제어나 수작업 컨트롤러는 특정 좁은 조건에서는 잘 작동할 수 있지만, 태스크가 다양해지기 시작하면(오브젝트/환경/형상/레이아웃) 수동 로직은 깨지기 쉽고 확장 비용이 급격히 올라갑니다. VLA는 멀티모달 입력(비전 + 언어 + 로봇 상태)을 통해 액션을 직접 학습해 변동성에 대한 전이를 가능하게 합니다. 다만 신뢰성은 VLA 출력만으로 생기기보다, 시스템 레벨에서 타이밍 계약과 안전 게이팅, 액션 제약을 함께 설계해 “모델을 시스템에 맞게 쓰는 방식”으로 완성됩니다.

---

## 3) Why Bimanual?

많은 실세계 작업은 자연스럽게 두 손 협응을 요구합니다: 지지 + 조작, 잡기 + 정렬/삽입, deformable의 접기/형상 변화, 그립을 바꿔가며 이어가기(handover / regrasp). 바이매뉴얼은 협응(역할 분담/전환), contact-rich 다이내믹스(컴플라이언스 + 피드백), 부분 관측(occlusion)이 동시에 걸려서 어렵습니다. 그래서 바이매뉴얼을 잘 푼 제품은 일상적인 조작 워크로드에서 큰 레버리지가 됩니다.

Serving & Organizing 외에도 바이매뉴얼은 여러 “현업 고가치” 워크플로우의 핵심 프리미티브가 됩니다:

- 조립 & 정렬/삽입: 부품을 맞춰 끼우고(핀/페그 삽입), 나사/스냅핏처럼 미스얼라인에 민감한 동작을 안정화
- 변형물(Deformable) 핸들링: 접기, 봉지/포장, 감싸기 같은 “형상 보존” 조작에서 접촉과 컴플라이언스가 성패를 좌우
- handover / regrasp & 툴 스위칭: 엔드이펙터 간 물체 상태를 유지한 채 넘겨주거나(넘김), 작업 중 툴을 바꿔도 흐름을 끊지 않기
- 포장 & 오더 풀필먼트: 다품종 선별 후 빈/박스에 담고 봉투/박싱까지 반복 가능한 힘/자세 제어로 수행

특히 현업에서는 바이매뉴얼 니즈가 아래 vertical에서 강하게 나타납니다:

- 공장 자동화(Factory automation): 지그/고정장치가 비싸고 부품 편차가 있으므로, 작은 기구학/자세 오차에도 안전한 힘 동작을 유지하면서 “빠르게 복구”해야 합니다
- b2C 무인영업/무인판매(unattended retail): 로봇이 선반 보충과 주문 처리를 최소 감독으로 수행해야 하고, 실패/복구 지연이 곧 매출·운영 비용으로 직결됩니다

---

## 4) Why Data Platform & Foundation Model besides other types of products?

Data Platform은 “학습을 운영 가능한 형태로 만드는 곳”인데, 현업에서 가장 힘든 부분은 데이터 양이 아니라 데이터가 *쓸 수 있는 상태*로 유지되는지입니다. 센서/캘리브레이션 드리프트, perception과 action의 동기화 불일치, 스키마/단위의 불일치, 라벨 노이즈, 실패 원인 추적과 재현의 어려움이 반복되면, “closing the loop”는 느린 수동 분석과 긴 반복 주기로 바뀌어서 배포 타임라인을 못 따라갑니다. 그래서 데이터 lineage/버전관리와 품질 게이트가 필수 니즈가 됩니다.

Foundation Model은 지시/컨텍스트를 로봇 액션 스페이스로 연결해주는 표현 계층이지만, 실제 배포에서는 grounding 모호함, 신규 오브젝트/환경에서의 분포 이동, 그리고 안전/타이밍 제약과 호환되는 액션 생성이 필요합니다. Data Platform이 피드백을 신뢰 가능하게 만들고, Foundation Model이 멀티모달 표현을 안정적으로 제공하며 액션 인터페이스를 일관되게 유지한다면, 같은 커미셔닝을 반복하지 않고도 개선이 태스크와 하드웨어에 걸쳐 누적될 수 있습니다.

기술 프리뷰 기준으로 요약하면, 일반지능 로봇 파운데이션 모델의 병목은 “데이터”입니다. 단순히 양이 아니라, (1) 충분히 풍부하고 다양한 데이터, (2) 액션 학습에 맞는 precision/accuracy 개념이 명확한 라벨, (3) 그리고 scenario 수준 커버리지를 관리하는 운영이 필요합니다. Data Platform은 human-operated hand gripper로 로봇-얼라인 액션 표현을 추정하고, scenario planning(클러스터 기반 수집 + 수집 가이드)으로 불필요한 분산을 줄이면서 data lineage/품질 게이트로 “closing the loop”를 빠르게 만듭니다. Foundation Model(CFG-1)은 소량의 타깃 태스크 텔레옵 데이터로 보통 ~24시간 내 파인튜닝한 뒤, 온라인 롤아웃에서 human-in-the-loop 전략 리파인으로 ~48시간 내 배포까지 도달하는 것을 목표로 합니다. 또한 “정답 로봇”은 경제성과 end-effector embodiment(그리퍼/핸드) 제약에 의해 결정되므로, 표현 계층이 타깃 embodiment의 액션 인터페이스와 일치하도록 설계하는 것이 핵심입니다.

---

## 5) Why software-oriented?

소프트웨어는 인터페이스를 표준화하고 안전/감시(supervision) 패턴을 패키징하며, 하드웨어를 매번 갈아엎지 않고도 빠르게 반복할 수 있게 해줍니다. 또한 소프트웨어 지향은 배포를 스키마/프리셋·프로파일/양자화 파이프라인/롤아웃·롤백처럼 재사용 가능한 제품 아티팩트로 만들 수 있다는 뜻이기도 합니다. 요약하면, 소프트웨어가 반복 가능한 시스템으로 바꿔줍니다.

---

## 6) Food for Thought

- **Robotics**: 하드웨어/커미셔닝/안전 통합이 고통스럽기 때문에, hardware taxonomy로 선택 기준을 제품화하고 단일 supervisor로 타이밍/감시를 강제하면 배포가 예측 가능해집니다; 바이매뉴얼은 contact/협응 실패가 비용이 커서, 역할 기반 액션 스키마 + recovery 템플릿으로 점진적 신뢰성을 확보합니다.
- **Model Class (LLM/VLA)**: 언어 중심 지표와 자유 형식 명령은 안전하고 타이밍 있는 로봇 액션으로 바로 매핑되지 않기 때문에, robotics-first 평가 + 구조화된 커맨드/플래닝 제약이 모델을 “제품 가능한 policy component”로 바꿉니다.
- **Model Algorithm (VLA용 딥러닝)**: end-to-end 비선형 매핑이 취약하고, 엣지 배포 예산이 빡빡하기 때문에 제어에 중요한 fusion/액션 디자인 + 표준화된 BC→RL 프로토콜 + on-device 검증으로 실패율을 줄일 수 있습니다.
- **Model Training (Teleop/BC/RL)**: 데모 수집, covariate shift, 안전 제약이 학습 속도를 느리게 만들기 때문에 스키마 계약, closed-loop relabeling, 안전 게이팅 학습을 운영적으로 만들면 “성장”이 누적됩니다.
- **Data & Scaling**: 스케일만 키우면 long-tail 실패가 남기 쉽고, 라벨/품질 게이트가 없으면 문제가 반복되기 때문에 coverage 지표 + 품질 검증 + 데모 합성(synthesis)을 툴링화하면 데이터 문제를 공학 작업으로 흡수할 수 있습니다.
- **Simulation & Sim2Real**: reality gap 때문에 시뮬에서만 되는 결과가 현장으로 바로 이어지지 않기 때문에, dynamic digital twin + sim→real 검증 게이트로 전이를 시간에 따라 줄입니다.
- **Deployment**: 양자화와 ops 회귀가 액션 정확도를 조용히 깨뜨릴 수 있어서, calibrated deployment toolchain + 버전화된 패키징 + 롤아웃/롤백 관행으로 신뢰성을 높입니다.
- **AI/ML basics**: 벤치마크 성공이 물리 세계 성공을 보장하지 않고, 모델 능력을 실시간 안전 액션 생성으로 번역해야 하므로 robotics-first 평가와 인터페이스 계약으로 AI 진척을 로봇 성과에 연결합니다.

---

## 참고

- [Robotics](../../README.md/#domains)
- [Data & Scaling](../../README.md/#domains)
- [Simulation & Sim2Real](../../README.md/#domains)
- [Deployment](../../README.md/#domains)

