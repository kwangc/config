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

- [Robotics](robotics.md) — 로봇 기초
- [LLM](llm.md) — 언어/계획
- `../research/` — VLA 논문 (RT-2, OpenVLA, 등)

