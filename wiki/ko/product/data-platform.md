# Product — Data Platform

Config의 **Data Platform**이 어떤 식으로 구성되어 있고, 어떤 기술로 이뤄져 있는지 정리하는 문서입니다.  
(입사 후 실제 아키텍처·기술 스택으로 채워나가면 됩니다.)

---

## 개요

- **역할:** general-purpose bimanipulation을 위한 데이터 인프라
- **Closing the loop:** 수집 → 파이프라인 → 품질 검증 → (모델 학습) → 실세계 검증

---

## 구성 (채워나가기)

- **데이터 수집:** 시뮬레이션 / 실세계, teleop, 멀티모달 (vision, proprioception, …)
- **파이프라인:** 수집 → 전처리 → 라벨/어노테이션 → 스토리지·버저닝
- **품질·검증:** 데이터 무결성, 실세계 테스트 연동
- **고객 연동:** 파트너/고객 데이터 통합, 배포 지원

---

## 기술 스택 (채워나가기)

| 영역 | 기술/도구 | 비고 |
|------|-----------|------|
| 스토리지·버저닝 | (추가) | |
| 전처리·파이프라인 | (추가) | |
| 시뮬레이션 | (추가) | |
| 실세계 로봇·센서 | (추가) | |

---

## 참고

- [About](../company/about.md) — 회사·미션
- [Foundation Model](foundation-model.md) — 인코딩·학습 방식
- [Simulation & Sim2Real](../domains/sim2real.md), [Data & Scaling](../domains/data-scaling.md) — 도메인 지식

