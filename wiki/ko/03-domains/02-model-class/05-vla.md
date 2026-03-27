# VLA (Vision-Language-Action)

Vision + Language + **Action** — 로봇 제어를 위한 멀티모달 모델.

---

## VLM에서 VLA로

[VLM](./04-vlm/)은 지각으로부터 언어(또는 구조화된 토큰)를 생성한다. VLA는 한 걸음 더 나아간다: 텍스트를 생성하는 대신, **로봇 액션** — 관절 각도, 엔드이펙터 자세, 기타 제어 신호 — 을 직접 생성한다.

핵심 추가 요소: 모델의 내부 표현을 실행 가능한 로봇 명령으로 변환하는 **액션 헤드**.

---

## 아키텍처 변형

| 변형 | 작동 방식 | 대표 예시 |
|------|----------|---------|
| **토큰 기반** | 액션을 토큰으로 이산화; VLM 백본이 텍스트처럼 예측 | RT-2, OpenVLA |
| **회귀 헤드** | VLM 임베딩에 MLP를 얹어 연속 액션 벡터 예측 | RT-1 |
| **Diffusion policy** | 확산 과정으로 액션 분포 모델링; 다중 모달 분포에 표현력 강함 | Diffusion Policy, π0 |
| **Action chunking** | 미래 N개 액션을 한 번에 예측; 장기 태스크의 누적 오차 감소 | ACT, π0 |

### 다이어그램: VLA 아키텍처

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 280">
<defs>
<marker id="arrow-ko-vla-arch" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Title -->
<text x="340" y="20" text-anchor="middle" font-size="12" fill="#6a6a64">VLA: VLM 백본 + 액션 헤드 → 로봇 제어</text>
<!-- Camera input -->
<rect x="18" y="34" width="96" height="52" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="1"/>
<text x="66" y="56" text-anchor="middle" font-size="11" fill="#FAC775">카메라 이미지</text>
<text x="66" y="72" text-anchor="middle" font-size="10" fill="#BA7517">RGB / 뎁스</text>
<!-- Language instruction -->
<rect x="18" y="96" width="96" height="52" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="66" y="117" text-anchor="middle" font-size="11" fill="#CECBF6">언어</text>
<text x="66" y="131" text-anchor="middle" font-size="11" fill="#CECBF6">지시</text>
<text x="66" y="145" text-anchor="middle" font-size="10" fill="#9E9AC8">"컵을 집어줘"</text>
<!-- Arrows to backbone -->
<line x1="116" y1="60" x2="168" y2="90" stroke="#EF9F27" stroke-width="1" marker-end="url(#arrow-ko-vla-arch)"/>
<line x1="116" y1="122" x2="168" y2="104" stroke="#7F77DD" stroke-width="1" marker-end="url(#arrow-ko-vla-arch)"/>
<!-- VLM Backbone -->
<rect x="170" y="54" width="160" height="88" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="250" y="80" text-anchor="middle" font-size="12" fill="#e8e6de">VLM 백본</text>
<text x="250" y="98" text-anchor="middle" font-size="10" fill="#a8a69e">비전 인코더 (ViT)</text>
<text x="250" y="112" text-anchor="middle" font-size="10" fill="#a8a69e">+ 언어 Transformer</text>
<text x="250" y="126" text-anchor="middle" font-size="10" fill="#a8a69e">→ 퓨전 표현</text>
<!-- Arrow to action head -->
<line x1="332" y1="98" x2="376" y2="98" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-vla-arch)"/>
<!-- Action head -->
<rect x="378" y="54" width="130" height="88" rx="6" fill="#085041" stroke="#1D9E75" stroke-width="1"/>
<text x="443" y="80" text-anchor="middle" font-size="12" fill="#9FE1CB">액션 헤드</text>
<text x="443" y="98" text-anchor="middle" font-size="10" fill="#5DCAA5">토큰 / MLP /</text>
<text x="443" y="112" text-anchor="middle" font-size="10" fill="#5DCAA5">diffusion / chunking</text>
<text x="443" y="126" text-anchor="middle" font-size="10" fill="#5DCAA5">→ 액션 벡터</text>
<!-- Arrow to robot -->
<line x1="510" y1="98" x2="556" y2="98" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-vla-arch)"/>
<!-- Robot output -->
<rect x="558" y="54" width="108" height="88" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="612" y="80" text-anchor="middle" font-size="11" fill="#CECBF6">로봇 액션</text>
<text x="612" y="98" text-anchor="middle" font-size="10" fill="#9E9AC8">관절 각도</text>
<text x="612" y="112" text-anchor="middle" font-size="10" fill="#9E9AC8">EE 자세 (6-DOF)</text>
<text x="612" y="126" text-anchor="middle" font-size="10" fill="#9E9AC8">그리퍼 상태</text>
<!-- Action chunking label -->
<text x="340" y="172" text-anchor="middle" font-size="12" fill="#6a6a64">단일 스텝 vs 액션 청킹(Action Chunking)</text>
<!-- Single step -->
<rect x="60" y="184" width="240" height="52" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="180" y="204" text-anchor="middle" font-size="11" fill="#e8e6de">단일 스텝</text>
<text x="180" y="220" text-anchor="middle" font-size="10" fill="#a8a69e">1개 액션 예측 → 실행 → 관찰 → 반복</text>
<text x="180" y="234" text-anchor="middle" font-size="10" fill="#a8a69e">지연 높음; 시간이 지나면 오차 누적</text>
<!-- Chunked -->
<rect x="374" y="184" width="240" height="52" rx="6" fill="#04342C" stroke="#1D9E75" stroke-width="0.5"/>
<text x="494" y="204" text-anchor="middle" font-size="11" fill="#9FE1CB">액션 청킹</text>
<text x="494" y="220" text-anchor="middle" font-size="10" fill="#5DCAA5">N개 액션 한 번에 예측 → 모두 실행 → 재계획</text>
<text x="494" y="234" text-anchor="middle" font-size="10" fill="#5DCAA5">더 부드러운 궤적; 장기 태스크에 유리</text>
<!-- Bottom note -->
<text x="340" y="268" text-anchor="middle" font-size="11" fill="#6a6a64">Diffusion 기반 액션 헤드는 다중 모달 액션 분포(예: 두 가지 유효한 파지법)를 더 정확하게 모델링</text>
</svg>

---

## 액션 표현

"액션"의 의미는 제어 수준에 따라 다르다:

| 표현 | 설명 | 용도 |
|------|------|------|
| **관절 각도** | 서보/모터 직접 타겟 | 저수준, 정밀 제어 |
| **엔드이펙터 자세** | 6-DOF 목표 위치+방향 | 고수준, 태스크 공간 제어 |
| **델타 액션** | 현재 상태 대비 변화량 | 다양한 구성에 일반화 용이 |
| **그리퍼 상태** | 이진 개폐 또는 연속 파지력 | 파지와 조작 |

**바이매뉴얼** 로봇에선 액션 공간이 두 배가 되고(팔 두 개), 양팔 간 협응 제약이 추가된다.

---

## 학습 데이터

VLA는 데이터 의존도가 높다; 데모의 다양성과 품질이 핵심이다:

| 데이터 소스 | 장점 | 단점 |
|------------|------|------|
| **Teleoperation** | 고품질, 실세계 정답 | 수집이 느리고 비쌈 |
| **시뮬레이션** | 확장 가능, 안전, 무한 다양성 | 시각·물리 sim-to-real 갭 |
| **스크립트 데모** | 빠르고 일관성 있음 | 행동 다양성 낮음 |
| **인간 영상** | 풍부하고 자연스러운 행동 | 액션 레이블 없음, 직접 활용 어려움 |

**Sim-to-real 전이**는 여전히 미해결 문제: 시뮬레이션에서 학습한 모델이 시각적 도메인 갭과 물리 불일치로 실제 로봇에서 실패하는 경우가 많다.

---

## 핵심 설계 과제

- **지연(Latency)** — 로봇 제어는 실시간 피드백이 필요; 대형 VLM 백본은 추론 지연을 추가 (100–500ms가 너무 느릴 수 있음)
- **분포 이동(Distribution shift)** — 학습 분포 밖의 상태를 만나면 실패; 환경의 작은 변화가 연쇄 실패를 유발
- **안전성** — 잘못된 액션 출력은 로봇이나 환경을 손상시킬 수 있음; 모델 환각(hallucination)은 위험
- **액션 정밀도** — 이산 토큰 기반 예측은 연속 공간 정밀도를 잃음; 회귀/diffusion 헤드가 이를 해결하지만 복잡도 증가

### 다이어그램: 안전 게이팅이 있는 배포 파이프라인

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 200">
<defs>
<marker id="arrow-ko-vla-safety" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Observation -->
<rect x="16" y="68" width="96" height="52" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="1"/>
<text x="64" y="90" text-anchor="middle" font-size="11" fill="#FAC775">관찰</text>
<text x="64" y="106" text-anchor="middle" font-size="10" fill="#BA7517">이미지 + 상태</text>
<!-- Arrow -->
<line x1="114" y1="94" x2="138" y2="94" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-vla-safety)"/>
<!-- VLA model -->
<rect x="140" y="68" width="110" height="52" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="195" y="90" text-anchor="middle" font-size="11" fill="#e8e6de">VLA 모델</text>
<text x="195" y="106" text-anchor="middle" font-size="10" fill="#a8a69e">policy layer</text>
<!-- Arrow -->
<line x1="252" y1="94" x2="276" y2="94" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-vla-safety)"/>
<!-- Safety gate -->
<rect x="278" y="56" width="120" height="76" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="1.5"/>
<text x="338" y="80" text-anchor="middle" font-size="11" fill="#FAC775">안전 게이트</text>
<text x="338" y="96" text-anchor="middle" font-size="10" fill="#BA7517">액션 범위 검사</text>
<text x="338" y="110" text-anchor="middle" font-size="10" fill="#BA7517">타이밍 버짓</text>
<text x="338" y="124" text-anchor="middle" font-size="10" fill="#BA7517">충돌 검사</text>
<!-- PASS arrow -->
<line x1="400" y1="94" x2="426" y2="94" stroke="#1D9E75" stroke-width="1" marker-end="url(#arrow-ko-vla-safety)"/>
<text x="413" y="88" text-anchor="middle" font-size="10" fill="#1D9E75">통과</text>
<!-- Execute box -->
<rect x="428" y="68" width="110" height="52" rx="6" fill="#085041" stroke="#1D9E75" stroke-width="1"/>
<text x="483" y="90" text-anchor="middle" font-size="11" fill="#9FE1CB">액션 실행</text>
<text x="483" y="106" text-anchor="middle" font-size="10" fill="#5DCAA5">로봇으로 전송</text>
<!-- Arrow to robot -->
<line x1="540" y1="94" x2="562" y2="94" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-vla-safety)"/>
<!-- Robot box -->
<rect x="564" y="68" width="96" height="52" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="612" y="94" text-anchor="middle" font-size="11" fill="#CECBF6">로봇</text>
<!-- FAIL path -->
<line x1="338" y1="134" x2="338" y2="168" stroke="#EF9F27" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="338" y1="168" x2="195" y2="168" stroke="#EF9F27" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#arrow-ko-vla-safety)"/>
<text x="338" y="162" text-anchor="middle" font-size="10" fill="#EF9F27">실패 → 폴백 / 정지</text>
<!-- Bottom note -->
<text x="340" y="192" text-anchor="middle" font-size="11" fill="#6a6a64">VLA를 명확한 타이밍 버짓을 가진 supervisor 게이팅 policy layer로 취급하면 롤아웃이 안전해짐</text>
</svg>

---

## Bimanual과의 관계

- 두 손 협응은 액션 공간이 크고, 데이터·정책 설계가 복잡
- Config의 데이터 인프라가 VLA 학습 품질에 직접 기여하는 영역

---

## 참고

- [Robotics](../../01-robotics/01-robotics/)
- [VLM](./04-vlm/)
- [LLM](./03-llm/)
- `../../04-research/` — VLA 논문 (RT-2, OpenVLA, 등)

---

## Food for Thought

- VLA는 멀티모달 이해와 연속 제어를 동시에 요구하는데, 보통 action head와 control stack의 "결합"이 병목입니다; 인터미디어트 표현과 액션 제약(가능한 행동/안전 한계)을 명시하면 end-to-end 취약성을 줄이고 제어 품질을 제품화할 수 있습니다.
- 바이매뉴얼은 액션 공간이 커지고 협응이 복잡해져 데이터/정책 설계가 폭발합니다; 기회는 튜플 기반 액션 스키마와 모듈형 supervision을 표준화해서 bimanual을 점진적으로 확장하는 것입니다.
- VLA 배포는 모델 지연과 안전 가정이 실제 로봇과 어긋날 때 무너집니다; VLA를 "명확한 timing budget을 가진 policy layer"로만 취급하고 supervisor로 게이팅하면 롤아웃이 훨씬 안전해집니다.
