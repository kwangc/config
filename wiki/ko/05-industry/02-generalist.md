# Generalist

> Dexterity(정교 조작) 중심 embodied foundation models / 범용 로봇

---

## Quick facts

- **설립:** 2024
- **창립멤버(대표):** Andy Zeng, Pete Florence, Andrew Barry
- **누적투자금액(공개 보도 기준):** Seed 라운드는 공개(2025년 3월 진행)되었지만 **정확한 금액은 비공개**로 알려져 있음

---

## 회사 방향성 & 강점 (모델 vs 하드웨어)

Generalist는 주로 **모델 중심/embodied AI** 회사로 포지셔닝되어 있습니다.

핵심 방향:

- 고정밀 physical interaction을 바탕으로 **embodied foundation models**를 만들고,
- 초기에는 **dexterity**를 강하게 밀고, 이후 더 범용적인 로보틱스로 확장하는 흐름입니다.

강점으로 강조되는 지점:

- 대규모 AI + 로보틱스의 “스케일링”을 한 덩어리 DNA로 가져감
- dexterous manipulation에서 필요한 data/model/hardware co-design
- 비구조 환경에서의 sensorimotor policy를 보여주는 초기 데모/평가

---

## Config vs Generalist

### 핵심 차이

- **강조점:** Generalist는 “embodied foundation model”을 전면에 둔 포지션(특히 dexterity/interaction scaling)인 반면,
- Config는 바이매뉴얼 작업에 대해 더 직접적으로 **데이터→배포**를 연결하는 파이프라인과 빠른 적응 운영에 집중합니다.

### 겹칠 수 있는 지점

- Generalist가 전이 가능한 action policy로 강해질수록, Config는 결국 “모델을 로봇에 신뢰 가능하게 붙이는 통합 레이어”에서 차별화해야 합니다.

---

## Config의 차별성

Config의 차별성은 다음 쪽에서 더 선명합니다.

- **human-operated hand gripper**로 action-label의 precision/accuracy를 측정 가능하게 만듦
- **scenario-level diversity/coverage 관리**로 “데이터가 쓸 수 있는 상태”를 유지
- **human-in-the-loop 온라인 개선**으로 실세계에서 빠르게 수렴(파인튜닝 ~24h, 개선/배포 ~48h)

결과적으로 Config는 모델이 진화하더라도 바이매뉴얼 워크셀에 **바로 적용되게** 만드는 쪽에 초점이 있습니다.

---

## Sources

- [Generalist — Company description](https://www.generalistai.com/)
- [웹 검색 요약: Generalist founded 2024 by Andy Zeng / Pete Florence / Andrew Barry, Seed(2025-03) 금액은 undisclosed](https://www.generalistai.com/)

