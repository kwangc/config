# Product 개요

Config의 제품 스택은 **general-purpose 바이매뉴얼 로보틱스**에서 “closing the loop”가 실제 배포로 이어지도록 설계되었습니다.

큰 그림 흐름은 다음과 같습니다.

**인간(두 손) 조작 데이터 → 로봇-얼라인 액션 라벨 → CFG-1 파운데이션 정책 → human-in-the-loop 오퍼레이션으로 빠른 태스크 적응 → 실세계 검증 배포.**

---

## 미션 맥락

우리는 데모를 넘어, 다양한 바이매뉴얼 태스크를 로봇이 **신뢰성 있게 수행**하도록 만드는 데이터 인프라와 기술을 만듭니다.

- **closing the loop로 데이터 무결성 확보:** 수집 → 실세계 검증 → 피드백을 학습/운영에 반영해 반복마다 개선이 누적되게 만듭니다.
- **고객/현업 배포 준비성:** 데이터와 정책이 실제 하드웨어 제약(지연, 안전, 캘리브레이션 드리프트, 스키마 일관성)까지 고려해 “바로 쓰일 수 있게” 만듭니다.

---

## 제품들이 연결되는 방식(End-to-end)

1. **Data Platform**은 raw human video를 **로봇-얼라인 액션 표현**(precision/accuracy가 핵심)으로 바꿉니다.
  - 인간이 조작하는 hand gripper로, 타깃 로봇 엔드이펙터에 얼라인된 액션 라벨을 추정
  - scenario 기반 다양성 계획으로 coverage를 관리(UMAP + HDBSCAN)
  - 데이터 lineage/버전관리 + 품질 게이트로 센서/캘리브레이션/운영자가 바뀌어도 “데이터가 쓸 수 있는 상태”를 유지
2. **Foundation Model (CFG-1)**은 대규모 인간 액션 데이터로 학습하는 learned policy backbone입니다.
  - autoregressive long-horizon memory + 고정밀 액션 예측을 위한 short sliding window
  - 한 번 pretrain 후, 소량의 태스크 텔레옵 데이터로 빠르게 적응
3. **Operations / Human-in-the-loop**는 온라인 롤아웃의 결과를 다시 전략과 데이터로 연결합니다.
  - 일반적인 파인튜닝 타임라인: **~24시간**
  - 일반적인 배포/개선 타임라인: **~48시간**
  - 인간이 실패에서 복구하고, 실제로 시스템이 어려워하는 상태 공간을 확장하면서 어디서 막히는지 학습이 진행되게 만듭니다.

---

## 제품 구성


| 제품                                 | 설명                                                                                         | 상세 문서                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| **Data Platform**                  | general-purpose bimanipulation을 위한 데이터 인프라 — 액션 라벨링, scenario 마이닝/coverage, 품질 게이트, 실세계 검증 | [Data Platform](../01-data-platform.md/)       |
| **Foundation Model**               | bimanual / general-purpose manipulation을 위한 CFG-1 파운데이션 정책 — 인코딩, 학습, 평가 루프                | [Foundation Model](../02-foundation-model.md/) |
 

---

## 참고

- [Company — About](../../01-company/about.md/) — 회사 소개·미션
- [Domains](../../README.md/#3-domains-도메인-지식) — AI/ML, VLA, Robotics, Sim2Real, Data & Scaling, Deployment

