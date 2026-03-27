# Research — 논문·기술 리뷰 인덱스

논문, 기술 블로그, 아티클 요약을 모아두는 곳.
각 항목은 한 줄 요약 + 핵심 포인트 + 링크 형태로 정리하면 나중에 검색·참조하기 좋습니다.

---

## 논문 목록

| 논문 | 연도 | 한 줄 요약 | 키워드 |
|------|------|-----------|-------|
| [Attention Is All You Need](./attention-is-all-you-need.md/) | 2017 | Transformer: 순환을 없애고 self-attention만으로 병렬·장거리 시퀀스 모델링 | #transformer #attention #foundation-model #LLM |
| [CLIP](./clip.md/) | 2021 | 4억 쌍 웹 이미지-텍스트 대조 사전학습으로 제로샷 이미지 분류 구현 — VLM 시대의 시초 | #VLM #contrastive-learning #zero-shot #foundation-model |
| [Diffusion Policy](./diffusion-policy.md/) | 2023 | 디노이징 확산 모델을 비주모터 정책 학습에 적용 — 단일 액션 대신 액션 청크를 예측해 다중 모달 분포를 처리 | #policy-learning #diffusion #bimanual #imitation-learning |
| [ACT](./act.md/) | 2023 | Action Chunking with Transformers + ALOHA 하드웨어 — 멀티스텝 예측이 정밀 양손 조작에 필수임을 처음으로 입증한 논문 | #bimanual #imitation-learning #action-chunking #manipulation |
| [BridgeData V2 & DROID](./bridge-droid.md/) | 2023-24 | 두 가지 보완적인 대규모 로봇 조작 데이터셋 — BridgeV2는 태스크 다양성(60k 궤적, 단일 로봇), DROID는 환경 다양성(76k 궤적, 현실) | #dataset #benchmark #multi-embodiment |
| [OXE](./oxe.md/) | 2023 | 22개 에구디먼트의 100만 궤적을 22개 기관에서 수집; RT-X 모델이 다양성이 전문화보다 낫다는 것을 입증 | #dataset #cross-embodiment #foundation-model #data |
| [RT-2](./rt-2.md/) | 2023 | 웹 스케일 VLM을 공동 파인튜닝해 로봇 액션을 언어 토큰으로 출력하는 VLA | #VLA #foundation-model #data #sim2real |
| [Octo](./octo.md/) | 2024 | OXE에서 학습한 오픈소스 범용 로봇 정책, 새 로봇에서 빠른 파인튜닝 최적화; 확산 기반 액션 헤드로 부드러운 궤적 생성 | #VLA #open-source #foundation-model #diffusion |
| [OpenVLA](./openvla.md/) | 2024 | 970k 로봇 궤적으로 학습한 오픈소스 7B VLA — 55B 클로즈드 모델에 필적 | #VLA #open-source #foundation-model #data |
| [π0](./pi0.md/) | 2024 | PaliGemma VLM 백본과 플로우 매칭 액션 전문가를 결합한 VLA 파운데이션 모델 — 정교한 연속 조작을 위해 설계 | #VLA #flow-matching #foundation-model #dexterous |
| [SmolVLM](./smolvlm.md/) | 2025 | 자원 효율적인 토큰화로 온디바이스가 가능한 소형 VLM | #VLM #efficient #on-device |

---

## 키워드별 분류

- **#VLA** — Vision-Language-Action
- **#VLM** — Vision-Language Model
- **#LLM** — Large Language Model
- **#transformer** — Transformer 아키텍처
- **#attention** — 어텐션 메커니즘
- **#foundation-model** — 대규모 사전학습 모델
- **#data** — 데이터 파이프라인, 품질, 규모
- **#sim2real** — 시뮬레이션→실세계 전이
- **#open-source** — 공개 가중치 및 코드
- **#efficient** — 연산/메모리 효율
- **#on-device** — 엣지/온디바이스 배포
- **#contrastive-learning** — 대조 학습 (예: CLIP)
- **#zero-shot** — 태스크별 레이블 없이 제로샷 전이
- **#policy-learning** — 로봇 정책 표현 및 학습
- **#diffusion** — 디노이징 확산 확률 모델
- **#bimanual** — 양팔 로봇 조작
- **#imitation-learning** — 시연으로부터의 학습
- **#action-chunking** — 단일 질의로 멀티스텝 액션 시퀀스 예측
- **#manipulation** — 오브젝트 조작 태스크
- **#flow-matching** — 플로우 매칭 / 연속 정규화 흐름 기반 생성 모델링
- **#dexterous** — 정교하고 접촉이 많은 조작
