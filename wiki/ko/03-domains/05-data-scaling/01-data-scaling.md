# Data & Scaling

로봇·VLA 학습을 위한 **데이터 스케일**, **커버리지**, **다양성**, **데이터 전략** 정리.

---

## 개요

- **데이터 스케일:** 양·질을 키워 모델 일반화와 long-tail 대응
- **커버리지·다양성:** 태스크, 환경, 오브젝트, embodiment 다양화
- **전략:** 실세계 수집 vs 시뮬 vs synthetic augmentation, demonstration synthesis 등

---

## 핵심 개념 (채워나가기)

- **로봇 데이터 특성** — 멀티모달(vision, proprioception), 시퀀스, action-conditioned
- **실세계 vs 시뮬** — 비용·품질·전이 트레이드오프
- **Synthetic / augmentation** — 시뮬 데이터 생성, object/background 다양화
- **Demonstration synthesis** — 소수 실세계 데모를 확장해 대량 시뮬/실사 데이터 생성
- **품질·밸런스** — 라벨 노이즈, 태스크/환경 밸런스, long-tail
- **Scenario 기반 커버리지 계획** — 시나리오 instruction을 임베딩 + UMAP/HDBSCAN으로 클러스터링하고, 클러스터별 수집 예산으로 long-tail 다양성을 의도적으로 채움
- **액션 표현 품질** — 로봇-얼라인 액션 추정의 precision/accuracy(예: human-operated gripper 기반 추정 등) + 실패 원인 추적

---

## Config 맥락에서

- Data Platform이 데이터 수집·파이프라인·품질 검증을 담당
- Closing the loop로 스케일한 데이터의 실세계 효과 검증

---

## 참고

- [Simulation & Sim2Real](../../06-simulation-sim2real/01-simulation-sim2real.md/) — 시뮬·전이
- [Robotics](../../01-robotics/01-robotics.md/) — teleop, 데모 수집
- [Data Platform](../../../02-product/01-data-platform.md/) — 구성·기술 스택
- [Research](../../../04-research/README.md/) — 데이터 스케일링 논문

---

## Food for Thought

- 스케일만 키우면 long-tail 실패가 그대로 남을 수 있고, 커버리지/밸런스가 깨지면 일반화가 무너집니다; 커버리지 지표와 데이터 불균형 감지를 자동화하면 “데이터 규모”가 제품 의사결정 레버가 됩니다.
- 실세계 수집 vs 시뮬/ synthetic augmentation의 조합은 전이를 좌우하지만, 어떤 소스가 실패를 줄이는지 매번 감으로 판단하기 쉽습니다; sim→real 검증 게이트를 제품 파이프라인으로 만들면 더 좋은 조합으로 수렴할 수 있습니다.
- 라벨 노이즈(추정된 액션 표현의 오류 포함)와 long-tail 태스크는 사람이 수동으로 고치기엔 비용이 큽니다; precision/accuracy 품질 게이트 + 실패 원인 attribution을 넣으면 데이터 문제를 “해결 가능한 공학 작업”으로 바꿀 수 있습니다.

