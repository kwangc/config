# Product — Foundation Model

CFG-1: 바이매뉴얼 조작을 위한 Config의 파운데이션 모델입니다. 대규모 인간 액션 데이터로 사전학습한 뒤, 소량의 태스크별 텔레옵 데이터로 빠르게 타깃 로봇/태스크에 적응합니다.

---

## 개요

- **역할:** bimanual / general-purpose manipulation을 위한 파운데이션 모델
- **모델 패밀리:** CFG-1 (첫 세대 로봇 파운데이션 모델)
- **개념적 I/O:** Vision + (optional) Language + Proprioception → Action/policy

---

## 1) CFG-1: autoregressive policy + long-horizon memory

tech preview에서는 CFG-1을 다음처럼 설명합니다.

- **Autoregressive architecture**로 **long-horizon memory**를 유지해 태스크의 전체 컨텍스트를 학습
- 최근 프레임을 다루는 **short sliding window**를 사용해 **고정밀 action prediction**을 유지

이 분리는 “태스크를 기억”하면서도, 두 손 조작에 필요한 근접 시점의 비전/프로프리오 신호에는 정확하게 반응하도록 돕습니다.

---

## 2) 인코딩(모달리티 → 입력으로 만드는 방식)

CFG-1의 입력은 Data Platform에서 생성되는 action representation과 연결되도록 설계됩니다.

- **Vision:** 엔드이펙터 주변 단서 및 장면 이해
- **Proprioception / state:** 로봇 상태/센서 인코딩(바이매뉴얼 암 상태 포함)
- **Language (선택):** instruction/task 인코딩(지시 따르기 + 의미 grounding)
- **Action representation:** 시스템에서 쓰는 출력 공간(조인트/카르테시안/연속 표현 등) — 로봇 컨트롤 요구에 얼라인

---

## 3) 학습: 한 번 사전학습, 빠르게 적응

학습은 tech preview의 “rapid adaptation” 루프를 따릅니다.

- **사전학습:** Data Platform이 만든 대규모 인간 액션 데이터(얼라인된 액션 표현 포함)로 학습
- **태스크 적응(파인튜닝):** 새 타깃 로봇/태스크에 대해 소량의 타깃 태스크 텔레옵 데이터로 파인튜닝
- **온라인 개선(closed loop):** 초기 파인튜닝 이후 온라인 롤아웃에서 human-in-the-loop로 보정하고, 전략/데이터 계획을 리파인

결과적으로 태스크별 정책 배포는 보통 **~48시간** 내에 이루어집니다.

---

## 4) 평가 & closing the loop

이 제품 관점에서의 평가는 “오프라인 성공률”만 보지 않습니다.

- 벤치마크로 일반화/안전 요구를 확인
- 실세계에서 closing the loop로 “현업에서 쓰이는지”를 검증
- 반복마다 얼마나 빠르게 개선되는지(타임라인)를 함께 측정

---

## 참고

- [About](../../01-company/about.md/)
- [Data Platform](../01-data-platform.md/)
- [VLA](../../03-domains/02-model-class/05-vla.md/)
- [Deployment](../../03-domains/08-deployment/01-deployment.md/)

