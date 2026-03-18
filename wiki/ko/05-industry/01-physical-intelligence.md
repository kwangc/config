# Physical Intelligence

> 로보틱스 foundation model / 범용 physical AI 소프트웨어

---

## Quick facts

- **설립:** 2024 (stealth emerged가 2024년 3월 전후로 알려짐; seed 발표 시점과 맞물림)
- **창립멤버(대표):** Karol Hausman (CEO), Sergey Levine, Lachy Groom, Brian Ichter, Chelsea Finn (그 외 Adnan Esmail, Quan Vuong 등 핵심 리더 포함)
- **누적투자금액(공개 보도 기준):** 2024년 말 라운드 시점에 **약 \$470M**(seed **\$70M** + 보도된 **\$400M** 라운드)

---

## 회사 방향성 & 강점 (모델 vs 하드웨어)

Physical Intelligence는 주로 **모델 중심(model-centric)**입니다. 특정 작업에만 최적화된 로봇을 파는 방식보다는, **로봇을 위한 foundation AI 모델**을 만들고 물리 환경/태스크 전반에서 **일반화**되도록 만드는 것을 목표로 합니다.

핵심 메시지는 “물리 세계의 혼돈(chaos)을 학습해 일반화한다”입니다. 즉, foundation model 원리로 다양한 물리 조건에서 통하는 지능을 만든 뒤, 실제 적용으로 이어가려는 관점입니다.

---

## Config vs Physical Intelligence

### 핵심 차이

- **강조점:** 두 회사 모두 범용 로보틱스 지능을 지향하지만, Physical Intelligence는 특히 **로봇 foundation model(모델) 자체**를 전면에 둔 포지셔닝입니다.
- **제품화 루트:** foundation 모델 학습/적응에 의해 주도되며, 하드웨어가 주 deliverable은 아닙니다.

### 잠재적 겹침/경쟁 지점

- Physical Intelligence가 “로봇에 바로 쓰일 수 있는” 지각/액션 표현을 만든다면, Config의 차별점은 **데이터→액션 라벨 인터페이스(precision/accuracy + scenario coverage + quality gate)**에서 더 분명하게 드러납니다.

---

## Config의 차별성

Config의 핵심은 **바이매뉴얼(bimanual) 제품 파이프라인**입니다.

- **human-operated hand gripper**로 액션 라벨을 측정 가능하고 로봇 얼라인되게 만듭니다.
- **scenario 기반 다양성 계획**으로 coverage를 관리합니다(예: UMAP + HDBSCAN 클러스터링).
- **closed-loop operations**로 실세계에서 빠르게 개선이 누적되도록 합니다(인간 recovery + 라벨링/품질 운영).

다른 회사가 모델 규모로 경쟁하더라도, Config는 “데이터의 usableness → 배포 가능성”을 예측 가능한 제품 과정으로 만든다는 점에서 다릅니다.

---

## Sources

- [CapitalG — Physical Intelligence: Bringing AI Into the Physical World](https://capitalg.com/insights/physical-intelligence-bringing-general-purpose-ai-into-the-physical-world)
- [Reuters (via search snippet): Physical Intelligence raises \$400M led by Bezos/OpenAI/Thrive (2024-11-04)](https://www.reuters.com/technology/artificial-intelligence/robot-ai-startup-physical-intelligence-raises-400-mln-bezos-openai-2024-11-04/)

