# Product — Foundation Model

Config의 **Foundation Model** — 인코딩 방식, 학습(training) 방식 등을 채워나가는 문서입니다.  
(입사 후 실제 아키텍처·학습 파이프라인으로 보완하면 됩니다.)

---

## 개요

- **역할:** bimanual / general-purpose manipulation을 위한 파운데이션 모델
- **입출력:** (추정) Vision + (선택) Language → Action 또는 policy

---

## 인코딩 방식 (채워나가기)

- **Vision:** 이미지/비디오 인코딩 (백본, 해상도, temporal 처리 등)
- **Proprioception / State:** 로봇 상태·센서 인코딩
- **Language:** 지시/태스크 인코딩 (선택)
- **Action:** 출력 공간 (joint, Cartesian, primitive 등), discretization 여부

---

## 학습(Training) 방식 (채워나가기)

- **사전학습:** 데이터 소스 (시뮬/실세계), 목표 함수, 스케일
- **파인튜닝·정책 학습:** RL, imitation, hybrid
- **평가:** 시뮬/실세계 벤치마크, closing the loop

---

## 참고

- [About](../company/about.md) — 회사·미션
- [Data Platform](data-platform.md) — 데이터 파이프라인·기술
- [VLA](../domains/vla.md) — Vision-Language-Action 도메인
- [Deployment](../domains/deployment.md) — on-device·양자화

