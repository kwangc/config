# 경쟁사 맵 — 로보틱스 & 엠보디드 AI

주요 플레이어의 위치, Config와의 차이점, 그리고 주목할 사항.

*마지막 업데이트: 2026-03-27*

---

## 2D 포지셔닝 맵

회사의 포지션을 이해하는 데 가장 중요한 두 축:

- **X축: Model-first ↔ Hardware-first** — AI/소프트웨어에서 주로 가치를 창출하는가, 아니면 자체 로봇 하드웨어에서 창출하는가?
- **Y축: Generalist ↔ Specialist** — 다양한 태스크/엠보디먼트에 작동하는 정책을 목표로 하는가, 아니면 하나의 특정 도메인에 최적화하는가?

```
                        Model-first
                              |
          [Generalist]   [Physical Intelligence]
                |              |
   범용태스크 --+----[Config]--+--------------------- 특화태스크
               |              |
         [Octo] |         [1X Technologies]
                |              |
          [Figure]       [Agility Robotics]
                |              |
          [Unitree]     [Boston Dynamics]
                              |
                        Hardware-first
```

Config는 **Model-first + Generalist** 사분면에 위치하며, **데이터-to-액션 라벨 인터페이스** (바이매뉴얼 정밀도 + 시나리오 다양성 + closed-loop 반복)로 차별화됩니다.

---

## 회사 프로파일

| 회사 | 초점 | 자금 조달 | Config 겹침 | Config 차별성 |
|------|------|-----------|-------------|---------------|
| [Physical Intelligence (π)](./01-physical-intelligence/) | 로보틱스 파운데이션 모델 | ~$470M | 가장 높음: 범용 모델 전략 | Config: 데이터 정밀도 파이프라인 + 바이매뉴얼 집중 |
| [Generalist](./02-generalist/) | 엠보디드 파운데이션 모델, dexterity | 미공개 (2025 시드) | 높음: 모델 우선, 범용 | Config: 순수 연구가 아닌 제품 파이프라인 |
| [1X Technologies](./03-1x/) | 가정/실환경용 휴머노이드 | ~$100M+ | 중간: 실세계 배포 집중 | Config: 하드웨어가 아닌 소프트웨어 + 데이터 스택 |
| [Figure](./04-figure/) | 자율 휴머노이드 로봇 | ~$675M+ | 중간: 범용 조작 | Config: 바이매뉴얼 정밀도 + 데이터 인프라 |
| [Agility Robotics / Digit](./05-agility-robotics/) | 물류용 휴머노이드 (Amazon 파트너십) | ~$150M+ | 낮음-중간: 실제 창고 배포 | Config: 데이터 정밀도, 고정 태스크 파이프라인 아님 |
| [Boston Dynamics](./06-boston-dynamics/) | 고급 로봇 하드웨어 + 이동성 | 현대자동차 인수 | 낮음: 하드웨어 우선, 특정 플랫폼 | Config: 엠보디먼트 무관, 데이터 주도 |
| [Unitree Robotics](./07-unitree/) | 저가 휴머노이드·쿼드러페드 | 미공개 | 낮음: 하드웨어 상품화 | Config: 소프트웨어/데이터 스택, 가격 경쟁 아님 |
| [NVIDIA (GR00T / Isaac)](./08-nvidia-gr00t/) | 시뮬 + 파운데이션 모델 플랫폼 | (상장; ~$3T 시가총액) | 중간: sim-to-real + 파운데이션 모델 인프라 | Config: 실세계 데이터, 시뮬 우선 아님 |
| [Apptronik / Apollo](./09-apptronik/) | 범용 휴머노이드, Samsung 투자 | ~$350M | 낮음-중간: 범용 조작 태스크 | Config: 정밀 바이매뉴얼 데이터, 범용 휴머노이드 아님 |
| [Machina Labs](./10-machina-labs/) | 로봇 시트 메탈 성형 | ~$32M | 낮음: 산업용 소재, 단일 도메인 | 다른 시장; 흥미로운 데이터 루프 패턴 |

---

## 주목할 사항

### Config 입장에서

- **Physical Intelligence**: 가장 유사한 전략; 그들의 데이터 파이프라인과 액션 표현 선택 주시
- **NVIDIA GR00T**: sim-to-real이 성숙하면 실세계 데이터 수집의 이점이 줄어들 수 있음 — 전이 품질 격차 모니터링
- **Unitree**: 하드웨어 상품화로 로봇 비용 하락 — Config 소프트웨어/데이터 스택의 시장 확대로 이어질 수 있음
- **Agility/Figure**: 대규모 실세계 배포로 고유한 피드백 루프 확보 — 그들의 실패 유형 및 데이터 다양성 전략 주시

### 시장 동향

- **2025-2026 트렌드**: 하드웨어 우선에서 모델 우선/데이터 우선 스타트업으로 자본 이동
- **바이매뉴얼 조작**: 대규모에서 아직 미해결된 어려운 문제; Config의 집중 영역은 방어 가능
- **Sim-to-real 격차**: 빠르게 좁혀지는 중; 속도가 이 사분면의 모든 플레이어에게 중요

---

## 참고

- 위 표에 링크된 개별 회사 페이지들
- [Config 소개](../01-company/about/)
- [제품 전략](../02-product/05-product-strategy/)
