# VLA (Vision-Language-Action)

Vision + Language + **Action** — 로봇 제어를 위한 멀티모달 모델.

---

## 핵심 개념 (채워나가기)

- **입력:** 이미지/비디오 + (선택) 언어 지시
- **출력:** 로봇 액션 (joint 토크, 엔드이펙터 명령 등)
- **아키텍처:** VL 모델 + action head, 또는 end-to-end
- **데이터:** 시뮬레이션/실세계 데모, teleop, scripted

---

## Bimanual과의 관계

- 두 손 협응은 액션 공간이 크고, 데이터·정책 설계가 복잡
- Config의 데이터 인프라가 VLA 학습 품질에 직접 기여하는 영역

---

## 참고

- [Robotics](../../01-robotics/01-robotics.md/) — 로봇 기초
- [LLM](../03-llm.md/) — 언어/계획
- `../../04-research/` — VLA 논문 (RT-2, OpenVLA, 등)

---

## Food for Thought

- VLA는 멀티모달 이해와 연속 제어를 동시에 요구하는데, 보통 action head와 control stack의 “결합”이 병목입니다; 인터미디어트 표현과 액션 제약(가능한 행동/안전 한계)을 명시하면 end-to-end 취약성을 줄이고 제어 품질을 제품화할 수 있습니다.
- 바이매뉴얼은 액션 공간이 커지고 협응이 복잡해져 데이터/정책 설계가 폭발합니다; 기회는 튜플 기반 액션 스키마와 모듈형 supervision을 표준화해서 bimanual을 점진적으로 확장하는 것입니다.
- VLA 배포는 모델 지연과 안전 가정이 실제 로봇과 어긋날 때 무너집니다; 해결하면 VLA를 “명확한 timing budget을 가진 policy layer”로만 취급하고 supervisor로 게이팅하면 롤아웃이 훨씬 안전해집니다.

