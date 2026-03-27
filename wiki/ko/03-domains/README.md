# 도메인 — 개요 (로보틱스, 모델, 학습, 배포)

이 폴더는 Config의 “general-purpose bimanual robotics”를 구성하는 기술 스택을 구조화합니다.
각 도메인의 Overview 페이지부터 읽고, 필요한 상세 페이지로 확장하는 것을 권장합니다.

---

## 빠른 지도(Quick map)

- [Robotics](./01-robotics/01-robotics/) — 하드웨어 폼팩터, 킨매틱스, 조작
- [Model Class](./02-model-class/01-overview/) — LLM/VLM/VLA 역할과 지각→행동 연결
- [Model Algorithm (VLA deepdive)](./03-model-algorithm/01-overview/) — fusion/action head, 학습 딥다이브
- [Model Training](./04-model-training/01-overview/) — teleops, behavior cloning, RL, closed-loop refinement
- [Data & Scaling](./05-data-scaling/01-data-scaling/) — 시나리오 커버리지, 라인리지, 품질 게이트
- [Simulation](./06-simulation-sim2real/01-simulation-sim2real/) — reality gap, domain randomization, sim→real 루프
- [Evaluation](./07-evaluation/01-overview/) — 로봇 성공에 중요한 것을 측정하는 방식
- [Deployment](./08-deployment/01-deployment/) — 패키징, on-device 추론, 롤아웃/운영 기초
- [Safety](./09-safety/01-overview/) — 안전 원칙, supervision, 평가 신호

---

## 읽는 방법

- 위 링크된 각 도메인의 “Overview” 페이지부터 시작하세요.
- Overview 문서는 필요한 전제(데이터/학습/안전)와 다음 단계(배포)까지 연결되도록 구성했습니다.

