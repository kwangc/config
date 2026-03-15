# Robotics

로봇 공학 기초와 bimanual manipulation 맥락.

---

## 핵심 개념 (채워나가기)

- **Manipulation** — 그랩, 플레이스, 조립
- **Bimanual** — 두 손 협응, 대칭/비대칭 태스크
- **Simulation vs Real** — sim-to-real, domain gap, 데이터 수집
- **Control** — position/velocity/torque, 정책 인터페이스
- **데이터** — teleop, demonstration, reward 설계

---

## Form factors (폼팩터)

- **듀얼 암 / 바이매뉴얼:** 두 개의 6–7 DOF 팔, 그리퍼·엔드이펙터, 작업공간·payload
- **콤팩트 그리퍼 암:** 소형 바이매뉴얼(예: 3+3 DOF), 웨어러블·휴대형, 테이블탑 장착
- **장착 방식:** 테이블탑, 모바일 베이스, 고정 설비 — 배포·전력·연산 제약과 연관

→ on-device 배포·양자화 등은 [Deployment](deployment.md) 참고.

---

## Config 미션과 연결

- General-purpose bimanual robotics를 위한 **데이터 인프라**
- 실세계 검증으로 데이터 무결성 확보

---

## 참고

- [VLA](vla.md) — 비전·언어·액션 모델
- [Deployment](deployment.md) — 폼팩터·on-device·양자화
- [Simulation & Sim2Real](sim2real.md) — 시뮬·전이
- `../research/`, `../industry/` — 로봇 트렌드

