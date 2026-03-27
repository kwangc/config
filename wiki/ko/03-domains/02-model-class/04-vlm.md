# VLM (Vision-Language Model)

로봇이 보는 것을 텍스트 및/또는 구조화된 신호로 바꿔주는 비전-언어 그라운딩(grounding) 모델.

---

## LLM에서 VLM으로

[LLM](./03-llm/)은 토큰 시퀀스를 처리한다. VLM은 여기서 한 걸음 더 나아가 **이미지를 토큰과 유사한 표현으로 변환**하고, 같은 Transformer 디코더가 이를 어텐션할 수 있게 만든다 — 동일한 어텐션 메커니즘, 이제 두 가지 모달리티에 걸쳐 적용된다.

핵심 추가 요소: 이미지 패치를 임베딩 벡터로 매핑하는 **비전 인코더**와, 이를 텍스트 토큰과 결합하는 **퓨전** 단계.

---

## 아키텍처

세 가지 컴포넌트가 순차적으로 작동한다:

1. **비전 인코더** — 이미지를 패치로 분할하고 각 패치를 벡터로 임베딩 (ViT 방식)
2. **프로젝션 / 퓨전** — 시각 임베딩을 텍스트 토큰 공간으로 매핑
3. **언어 디코더** — LLM과 동일한 Transformer 디코더, 단 시각 토큰이 컨텍스트에 포함됨

### 다이어그램: VLM 아키텍처

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 300">
<defs>
<marker id="arrow-ko-vlm-arch" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Title -->
<text x="340" y="20" text-anchor="middle" font-size="12" fill="#6a6a64">VLM: 이미지 토큰과 텍스트 토큰이 동일한 Transformer 디코더를 공유</text>
<!-- Image input box with patch grid -->
<rect x="18" y="36" width="90" height="90" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="1"/>
<text x="63" y="56" text-anchor="middle" font-size="10" fill="#BA7517">이미지 입력</text>
<rect x="24" y="62" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="45" y="62" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="66" y="62" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="87" y="62" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="24" y="83" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="45" y="83" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="66" y="83" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="87" y="83" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="24" y="104" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="45" y="104" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="66" y="104" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<rect x="87" y="104" width="18" height="18" rx="2" fill="#6B3A0F" stroke="#EF9F27" stroke-width="0.5"/>
<text x="63" y="140" text-anchor="middle" font-size="9" fill="#BA7517">패치 분할 (예: 16×16 px)</text>
<!-- Arrow 1 -->
<line x1="110" y1="81" x2="136" y2="81" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-vlm-arch)"/>
<!-- ViT encoder box -->
<rect x="138" y="54" width="108" height="54" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="192" y="76" text-anchor="middle" font-size="12" fill="#CECBF6">비전 인코더</text>
<text x="192" y="92" text-anchor="middle" font-size="10" fill="#9E9AC8">(ViT)</text>
<text x="192" y="120" text-anchor="middle" font-size="10" fill="#6a6a64">이미지 → 패치</text>
<text x="192" y="133" text-anchor="middle" font-size="10" fill="#6a6a64">임베딩 벡터</text>
<!-- Arrow 2 -->
<line x1="248" y1="81" x2="272" y2="81" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-vlm-arch)"/>
<!-- Projection box -->
<rect x="274" y="54" width="108" height="54" rx="6" fill="#085041" stroke="#1D9E75" stroke-width="1"/>
<text x="328" y="76" text-anchor="middle" font-size="12" fill="#9FE1CB">프로젝션</text>
<text x="328" y="92" text-anchor="middle" font-size="10" fill="#5DCAA5">(linear / MLP)</text>
<text x="328" y="120" text-anchor="middle" font-size="10" fill="#6a6a64">시각 벡터를</text>
<text x="328" y="133" text-anchor="middle" font-size="10" fill="#6a6a64">텍스트 토큰 공간으로</text>
<!-- Text tokens -->
<rect x="274" y="160" width="108" height="36" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="328" y="180" text-anchor="middle" font-size="11" fill="#CECBF6">텍스트 토큰</text>
<text x="328" y="194" text-anchor="middle" font-size="10" fill="#9E9AC8">"컵을 집어줘"</text>
<!-- Arrows into concat -->
<line x1="328" y1="108" x2="328" y2="134" stroke="#1D9E75" stroke-width="1" marker-end="url(#arrow-ko-vlm-arch)"/>
<line x1="328" y1="196" x2="328" y2="220" stroke="#7F77DD" stroke-width="1" marker-end="url(#arrow-ko-vlm-arch)"/>
<!-- Concat box -->
<rect x="250" y="222" width="156" height="36" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="328" y="240" text-anchor="middle" font-size="11" fill="#e8e6de">토큰 결합</text>
<text x="328" y="254" text-anchor="middle" font-size="10" fill="#a8a69e">[시각 토큰 | 텍스트 토큰]</text>
<!-- Arrow 3 -->
<line x1="408" y1="81" x2="432" y2="81" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-vlm-arch)"/>
<line x1="406" y1="240" x2="432" y2="200" stroke="#444441" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#arrow-ko-vlm-arch)"/>
<!-- LLM Decoder box -->
<rect x="434" y="54" width="108" height="54" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="488" y="76" text-anchor="middle" font-size="12" fill="#CECBF6">LLM 디코더</text>
<text x="488" y="92" text-anchor="middle" font-size="10" fill="#9E9AC8">(LLM과 동일)</text>
<text x="488" y="120" text-anchor="middle" font-size="10" fill="#6a6a64">시각+텍스트 토큰</text>
<text x="488" y="133" text-anchor="middle" font-size="10" fill="#6a6a64">동시 어텐션</text>
<!-- Arrow 4 -->
<line x1="544" y1="81" x2="568" y2="81" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-vlm-arch)"/>
<!-- Output box -->
<rect x="570" y="54" width="96" height="54" rx="6" fill="#04342C" stroke="#1D9E75" stroke-width="1"/>
<text x="618" y="74" text-anchor="middle" font-size="11" fill="#9FE1CB">출력</text>
<text x="618" y="88" text-anchor="middle" font-size="10" fill="#5DCAA5">캡션 / 답변</text>
<text x="618" y="102" text-anchor="middle" font-size="10" fill="#5DCAA5">bbox / affordance</text>
<!-- Bottom label -->
<text x="340" y="278" text-anchor="middle" font-size="11" fill="#6a6a64">대부분의 오픈소스 VLM(LLaVA, InternVL)은 early fusion 방식: 시각 토큰을 텍스트 토큰 앞에</text>
<text x="340" y="294" text-anchor="middle" font-size="11" fill="#6a6a64">이어붙여 단일 decoder-only Transformer가 함께 처리</text>
</svg>

### 비전 인코더 (ViT)

- 이미지를 고정 크기 패치로 분할 (예: 16×16 px)
- 각 패치를 선형 투영으로 임베딩 벡터로 변환
- 위치 임베딩 추가 → 패치 토큰 시퀀스를 Transformer 인코더에 입력
- 결과: 시각 임베딩 시퀀스 (예: 256×256 이미지, 패치 크기 16 → 256개 벡터)

### 멀티모달 퓨전 전략

| 전략 | 작동 방식 | 대표 예시 |
|------|----------|---------|
| **Early fusion** | 시각+텍스트 토큰을 concat → 단일 Transformer 처리 | LLaVA, InternVL |
| **Cross-attention** | 별도 시각 Transformer → 텍스트 디코더가 cross-attn | Flamingo |
| **Prefix / adapter** | 시각 토큰을 prefix로 삽입; 최소한의 구조 변경 | MiniGPT-4 |

---

## 사전학습 전략

VLM은 보통 여러 단계로 학습된다:

1. **대조 사전학습 (CLIP 방식)** — 이미지-텍스트를 공유 임베딩 공간에 정렬; 생성 없이 유사도만 학습
2. **생성 파인튜닝** — 이미지-텍스트 쌍(캡션, VQA, 지시 따르기)으로 훈련해 이미지로부터 텍스트 생성
3. **태스크 특화 파인튜닝** — 로보틱스용: 그라운딩, 공간 관계, affordance 레이블링

---

## 로보틱스를 위한 VLM 출력 유형

프롬프트와 헤드에 따라 다양한 출력이 가능하다:

### 다이어그램: VLM 출력 유형

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 220">
<defs>
<marker id="arrow-ko-vlm-out" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<text x="340" y="18" text-anchor="middle" font-size="12" fill="#6a6a64">동일한 이미지, 프롬프트/헤드에 따라 다른 출력</text>
<line x1="170" y1="24" x2="170" y2="210" stroke="#333331" stroke-width="0.5"/>
<line x1="340" y1="24" x2="340" y2="210" stroke="#333331" stroke-width="0.5"/>
<line x1="510" y1="24" x2="510" y2="210" stroke="#333331" stroke-width="0.5"/>
<text x="85" y="42" text-anchor="middle" font-size="12" font-weight="500" fill="#e8e6de">캡션</text>
<text x="255" y="42" text-anchor="middle" font-size="12" font-weight="500" fill="#e8e6de">VQA</text>
<text x="425" y="42" text-anchor="middle" font-size="12" font-weight="500" fill="#e8e6de">공간 그라운딩</text>
<text x="595" y="42" text-anchor="middle" font-size="12" font-weight="500" fill="#e8e6de">Affordance</text>
<!-- Caption -->
<rect x="16" y="52" width="136" height="80" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="84" y="72" text-anchor="middle" font-size="10" fill="#a8a69e">프롬프트: "설명해줘"</text>
<text x="84" y="90" text-anchor="middle" font-size="11" fill="#e8e6de">"로봇 팔이 테이블</text>
<text x="84" y="106" text-anchor="middle" font-size="11" fill="#e8e6de">위의 빨간 컵을</text>
<text x="84" y="122" text-anchor="middle" font-size="11" fill="#e8e6de">집으려 하고 있다."</text>
<text x="84" y="152" text-anchor="middle" font-size="10" fill="#6a6a64">자유 텍스트 묘사.</text>
<text x="84" y="166" text-anchor="middle" font-size="10" fill="#6a6a64">로깅, 장면 이해에 유용.</text>
<!-- VQA -->
<rect x="186" y="52" width="136" height="80" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="254" y="72" text-anchor="middle" font-size="10" fill="#a8a69e">Q: "컵이 비어있나요?"</text>
<text x="254" y="93" text-anchor="middle" font-size="11" fill="#9FE1CB">"아니요, 액체가</text>
<text x="254" y="109" text-anchor="middle" font-size="11" fill="#9FE1CB">담겨있습니다."</text>
<text x="254" y="152" text-anchor="middle" font-size="10" fill="#6a6a64">장면 내용에 대한</text>
<text x="254" y="166" text-anchor="middle" font-size="10" fill="#6a6a64">타겟 질의응답.</text>
<!-- Spatial grounding -->
<rect x="356" y="52" width="136" height="80" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="424" y="72" text-anchor="middle" font-size="10" fill="#a8a69e">Q: "컵이 어디에?"</text>
<text x="424" y="93" text-anchor="middle" font-size="11" fill="#FAC775">bbox: [142, 87,</text>
<text x="424" y="109" text-anchor="middle" font-size="11" fill="#FAC775">198, 143]</text>
<text x="424" y="152" text-anchor="middle" font-size="10" fill="#6a6a64">위치 특정: 플래닝을</text>
<text x="424" y="166" text-anchor="middle" font-size="10" fill="#6a6a64">위한 픽셀 좌표.</text>
<!-- Affordance -->
<rect x="526" y="52" width="136" height="80" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="594" y="72" text-anchor="middle" font-size="10" fill="#a8a69e">Q: "어떻게 잡을까?"</text>
<text x="594" y="90" text-anchor="middle" font-size="11" fill="#9FE1CB">grasp_center:</text>
<text x="594" y="106" text-anchor="middle" font-size="11" fill="#9FE1CB">[170, 115]</text>
<text x="594" y="122" text-anchor="middle" font-size="11" fill="#9FE1CB">angle: 90°</text>
<text x="594" y="152" text-anchor="middle" font-size="10" fill="#6a6a64">물체와 어떻게 상호작용</text>
<text x="594" y="166" text-anchor="middle" font-size="10" fill="#6a6a64">할지 예측.</text>
<text x="340" y="204" text-anchor="middle" font-size="11" fill="#6a6a64">공간 그라운딩과 affordance 출력이 로봇 제어에 가장 직접적으로 활용 가능</text>
</svg>

---

## 로보틱스를 위한 그라운딩

표준 VLM 벤치마크(BLEU, CIDEr, VQA 정확도)는 로봇이 실제로 필요한 것을 측정하지 않는다:

- **공간 정확도** — "왼쪽 컵을 집어"는 단순 객체 인식이 아닌 정밀한 위치 파악이 필요
- **Affordance 예측** — 무엇인지가 아니라, 어디서 어떻게 잡을지
- **시간적 일관성** — 비디오에서 지각은 프레임 간 안정적이어야 한다; 단일 프레임 점프는 하위 제어를 망침

---

## LLM 대비 VLM의 역할

- **LLM**은 언어 전용; **VLM**은 지각적 그라운딩(무엇이 어디에 있고, 무엇이 어떻게 변하는지)을 추가합니다
- 로보틱스에서는 그라운딩 품질이 바로 후속 플래닝/컨트롤의 신뢰도로 이어집니다

---

## VLA로의 연결고리

- VLA는 보통 VLM 스타일의 지각 표현을 사용하고, 그 위에 **action head**(또는 action policy layer)를 얹습니다
- 목표는 간단합니다: 지각 출력 shape이 충분히 안정적이어야 액션 인터페이스가 견고해집니다

---

## 참고

- [ML Fundamentals](./02-ml-fundamentals/) — Transformer, Attention, Q·K·V
- [LLM](./03-llm/)
- [VLA](./05-vla/)
- `../../04-research/` — VLM 논문(멀티모달 지각, 그라운딩, 비디오 이해)

---

## Food for Thought

- VLM은 보통 캡션/QA 중심 지표로 최적화되지만, 로보틱스는 액션에 필요한 그라운딩(포즈/어포던스 일관성)이 핵심입니다; 학습/평가를 control-facing 신호로 재정의하면 VLM은 데모용을 넘어 신뢰 가능한 지각 표면이 됩니다.
- 비디오 이해는 외형 변화, 모션 블러, 가림(occlusion) 때문에 단일 프레임 추론이 쉽게 깨집니다; 기회는 시간적 일관성(트래킹, 상태 인지 feature, 실패 원인 분리)을 강제해서 지각 스트림이 "점프"하지 않게 만드는 것입니다.
- 멀티모달 융합은 프롬프트/스키마/전처리 데이터가 조금만 달라도 취약해집니다; 인터페이스 계약(무엇을 어떤 형식으로, 실패/불확실성은 어떻게 내야 하는지)을 명문화하면 VLM 출력이 VLA/VLA 운영으로 예측 가능하게 이어질 수 있습니다.
