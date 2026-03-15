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

---

## Config 맥락에서

- Data Platform이 데이터 수집·파이프라인·품질 검증을 담당
- Closing the loop로 스케일한 데이터의 실세계 효과 검증

---

## 참고

- [Simulation & Sim2Real](sim2real.md) — 시뮬·전이
- [Robotics](robotics.md) — teleop, 데모 수집
- [Data Platform](../product/data-platform.md) — 구성·기술 스택
- [Research](../research/README.md) — 데이터 스케일링 논문

