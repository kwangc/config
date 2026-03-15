# Simulation & Sim2Real

시뮬레이션에서 학습한 정책을 **실세계 로봇**으로 전이하는 방법과, 그 사이의 **reality gap**을 줄이는 기법 정리.

---

## 개요

- **Sim2Real:** 시뮬에서 데이터·정책을 만들고, 실기구에 배포하는 흐름
- **Reality gap (domain gap):** 시뮬과 현실의 차이(물리, 센서, 외관 등)로 인한 성능 저하
- **목적:** 비용·안전·스케일을 위해 시뮬을 쓰되, 실세계에서도 잘 동작하게 하는 것

---

## 핵심 개념 (채워나가기)

- **왜 시뮬을 쓰는가** — 데이터 스케일, 안전한 실험, 반복 속도
- **갭의 원인** — 마찰·백래시·센서 노이즈·렌더링·동역학 근사
- **Domain randomization** — 시뮬 파라미터(광원, 질감, 마찰, 질량 등)를 랜덤화해 전이 강화
- **Dynamic digital twin** — 실세계와 동기화된 시뮬로 정책 개발·평가
- **Mixed training** — 시뮬 + 실세계 데이터를 함께 학습에 활용

---

## Config 맥락에서

- Data Platform에서 시뮬/실세계 데이터 파이프라인·품질이 Sim2Real 성능에 직결
- Closing the loop = 시뮬 학습 → 실세계 검증 → 데이터/모델 개선

---

## 참고

- [Robotics](robotics.md) — 로봇·데이터 수집
- [Data & Scaling](data-scaling.md) — 데이터 스케일·다양성
- [Data Platform](../product/data-platform.md) — 데이터 인프라
- [Glossary](../glossary/README.md) — Sim2Real, domain gap, domain randomization

