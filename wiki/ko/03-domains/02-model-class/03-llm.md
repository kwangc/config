# LLM (Large Language Model)

---

## Transformer에서 LLM으로

[ML Fundamentals](./02-ml-fundamentals/)에서 핵심 메커니즘을 다뤘다: Transformer + Attention. LLM은 그 구조를 **스케일**에 적용한 것이다.

- **더 많은 파라미터** — 수십억~수천억 개의 가중치를 가진 더 깊고 넓은 Transformer 스택
- **더 많은 데이터** — 웹 규모 텍스트 수천억~수조 개 토큰
- **자기지도 사전학습** — 레이블 없이 학습 가능; 텍스트를 예측하는 것 자체가 학습 신호

이 조합 덕분에 모델은 원시 텍스트만으로 문법, 사실, 추론 패턴, 세계 지식을 학습한다.

---

## 아키텍처 변형

사전학습 목표에 따라 세 가지 계열로 나뉜다:

| 변형 | 대표 모델 | 목표 | 주요 용도 |
|------|----------|------|----------|
| **Decoder-only** | GPT, Claude, LLaMA, Gemini | Causal LM (다음 토큰 예측) | 채팅, 추론, 코드 |
| **Encoder-only** | BERT, RoBERTa | Masked LM (마스크 토큰 예측) | 분류, 임베딩 |
| **Encoder-decoder** | T5, BART | Seq2seq | 번역, 요약 |

최신 프론티어 모델(GPT-4, Claude, Gemini)은 모두 Decoder-only다. Encoder-only 모델은 임베딩·검색에 여전히 널리 쓰인다.

---

## 사전학습 목표

### Causal LM — 다음 토큰 예측

토큰 $t_1, t_2, ..., t_{n-1}$이 주어지면 $t_n$을 예측한다.

- **Causal mask**: 각 토큰은 자신과 이전 토큰에만 어텐션 가능 — 미래 토큰 차단
- **학습**: 모든 위치가 병렬로 예측(효율적); **추론**: 토큰을 하나씩 자기회귀 방식으로 생성
- **Loss**: 예측 로짓과 실제 다음 토큰 간의 크로스 엔트로피

### 다이어그램: Causal mask — 어디서 어디로 어텐션할 수 있는가

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 320">
<defs>
<marker id="arrow-ko-llm-causal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Top label -->
<text x="340" y="22" text-anchor="middle" font-size="12" fill="#6a6a64">다음 토큰 예측: "The robot picked up the" 다음 "cup" 예측</text>
<!-- Input tokens -->
<rect x="18" y="34" width="78" height="34" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="57" y="56" text-anchor="middle" font-size="12" fill="#CECBF6">The</text>
<rect x="108" y="34" width="78" height="34" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="147" y="56" text-anchor="middle" font-size="12" fill="#CECBF6">robot</text>
<rect x="198" y="34" width="78" height="34" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="237" y="56" text-anchor="middle" font-size="12" fill="#CECBF6">picked</text>
<rect x="288" y="34" width="78" height="34" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="327" y="56" text-anchor="middle" font-size="12" fill="#CECBF6">up</text>
<rect x="378" y="34" width="78" height="34" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="417" y="56" text-anchor="middle" font-size="12" fill="#CECBF6">the</text>
<!-- Predicted token -->
<rect x="476" y="34" width="78" height="34" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="1.5"/>
<text x="515" y="50" text-anchor="middle" font-size="12" fill="#FAC775">cup</text>
<text x="515" y="64" text-anchor="middle" font-size="10" fill="#BA7517">← 예측</text>
<!-- Arrow into predicted -->
<line x1="458" y1="51" x2="474" y2="51" stroke="#EF9F27" stroke-width="1.2" marker-end="url(#arrow-ko-llm-causal)"/>
<!-- Causal mask label -->
<text x="340" y="94" text-anchor="middle" font-size="12" fill="#6a6a64">Causal mask: 각 토큰(행)은 표시된 열에만 어텐션 가능</text>
<!-- Grid column labels -->
<text x="57" y="116" text-anchor="middle" font-size="10" fill="#a8a69e">The</text>
<text x="147" y="116" text-anchor="middle" font-size="10" fill="#a8a69e">robot</text>
<text x="237" y="116" text-anchor="middle" font-size="10" fill="#a8a69e">picked</text>
<text x="327" y="116" text-anchor="middle" font-size="10" fill="#a8a69e">up</text>
<text x="417" y="116" text-anchor="middle" font-size="10" fill="#a8a69e">the</text>
<!-- Grid row labels -->
<text x="590" y="140" text-anchor="start" font-size="10" fill="#a8a69e">The →</text>
<text x="590" y="170" text-anchor="start" font-size="10" fill="#a8a69e">robot →</text>
<text x="590" y="200" text-anchor="start" font-size="10" fill="#a8a69e">picked →</text>
<text x="590" y="230" text-anchor="start" font-size="10" fill="#a8a69e">up →</text>
<text x="590" y="260" text-anchor="start" font-size="10" fill="#a8a69e">the →</text>
<!-- Row 1 -->
<rect x="30" y="124" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="120" y="124" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="210" y="124" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="300" y="124" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="390" y="124" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<!-- Row 2 -->
<rect x="30" y="154" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="120" y="154" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="210" y="154" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="300" y="154" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="390" y="154" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<!-- Row 3 -->
<rect x="30" y="184" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="120" y="184" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="210" y="184" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="300" y="184" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<rect x="390" y="184" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<!-- Row 4 -->
<rect x="30" y="214" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="120" y="214" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="210" y="214" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="300" y="214" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="390" y="214" width="54" height="22" rx="3" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<!-- Row 5 -->
<rect x="30" y="244" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="120" y="244" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="210" y="244" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="300" y="244" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<rect x="390" y="244" width="54" height="22" rx="3" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<!-- Diagonal guide -->
<line x1="30" y1="124" x2="444" y2="266" stroke="#1D9E75" stroke-width="0.8" stroke-dasharray="4 3" opacity="0.4"/>
<!-- Legend -->
<rect x="30" y="284" width="14" height="14" rx="2" fill="#085041" stroke="#1D9E75" stroke-width="0.5"/>
<text x="48" y="295" font-size="11" fill="#a8a69e">어텐션 가능 (하삼각)</text>
<rect x="220" y="284" width="14" height="14" rx="2" fill="#1a1a18" stroke="#333331" stroke-width="0.5"/>
<text x="238" y="295" font-size="11" fill="#a8a69e">차단 (미래 토큰)</text>
<text x="340" y="314" text-anchor="middle" font-size="11" fill="#6a6a64">학습 시엔 모든 위치가 동시에 예측 (병렬) → 추론 시엔 토큰을 하나씩 순차 생성</text>
</svg>

### Masked LM (MLM)

토큰의 ~15%를 무작위로 마스킹하고, 모델이 마스크된 위치를 예측하도록 훈련한다.

- **양방향**: 각 토큰이 모든 다른 토큰을 어텐션 가능 (Causal mask 없음)
- **자기회귀 불가** — 시퀀스를 직접 생성하기에 적합하지 않음
- **적합 용도**: 텍스트 임베딩, 분류, 검색 (BERT 계열)

### Seq2seq

인코더가 입력 시퀀스를 처리(양방향 어텐션) → 디코더가 출력 시퀀스 생성(causal).

- 디코더는 **크로스 어텐션**으로 인코더 출력을 참조 (Q·K·V에서 K, V가 인코더에서 옴)
- 적합 용도: 번역, 요약, 입출력 시퀀스가 구분된 구조화 생성

---

## 프롬프팅

LLM은 자연어로 작성된 작업 설명을 따를 수 있다 — 추가 학습 없이. 사전학습 과정에서 무수히 많은 지시-응답 예시를 접했기 때문이다.

### 다이어그램: zero-shot vs few-shot vs Chain-of-Thought 비교

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 370">
<defs>
<marker id="arrow-ko-llm-prompt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Column headers -->
<text x="108" y="20" text-anchor="middle" font-size="13" font-weight="500" fill="#e8e6de">Zero-shot</text>
<text x="340" y="20" text-anchor="middle" font-size="13" font-weight="500" fill="#e8e6de">Few-shot</text>
<text x="572" y="20" text-anchor="middle" font-size="13" font-weight="500" fill="#e8e6de">Chain-of-Thought</text>
<!-- Dividers -->
<line x1="228" y1="28" x2="228" y2="360" stroke="#333331" stroke-width="0.5"/>
<line x1="454" y1="28" x2="454" y2="360" stroke="#333331" stroke-width="0.5"/>
<!-- ===== ZERO-SHOT ===== -->
<rect x="20" y="34" width="174" height="52" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="107" y="52" text-anchor="middle" font-size="10" fill="#9E9AC8">지시만 제공</text>
<text x="107" y="66" text-anchor="middle" font-size="11" fill="#CECBF6">감성 분류:</text>
<text x="107" y="80" text-anchor="middle" font-size="11" fill="#CECBF6">"Works great!"</text>
<line x1="107" y1="88" x2="107" y2="114" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-llm-prompt)"/>
<rect x="62" y="116" width="90" height="28" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="107" y="135" text-anchor="middle" font-size="12" fill="#e8e6de">LLM</text>
<line x1="107" y1="146" x2="107" y2="172" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-llm-prompt)"/>
<rect x="30" y="174" width="154" height="28" rx="6" fill="#04342C" stroke="#1D9E75" stroke-width="1"/>
<text x="107" y="193" text-anchor="middle" font-size="12" fill="#9FE1CB">긍정(Positive)</text>
<text x="107" y="230" text-anchor="middle" font-size="10" fill="#6a6a64">예시 없이 작업 설명만.</text>
<text x="107" y="244" text-anchor="middle" font-size="10" fill="#6a6a64">모델이 사전학습 지식으로</text>
<text x="107" y="258" text-anchor="middle" font-size="10" fill="#6a6a64">직접 일반화.</text>
<!-- ===== FEW-SHOT ===== -->
<rect x="244" y="34" width="174" height="30" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="331" y="48" text-anchor="middle" font-size="10" fill="#9E9AC8">지시</text>
<text x="331" y="60" text-anchor="middle" font-size="11" fill="#CECBF6">감성을 분류하세요.</text>
<rect x="244" y="72" width="174" height="46" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="331" y="88" text-anchor="middle" font-size="10" fill="#a8a69e">예시</text>
<text x="331" y="103" text-anchor="middle" font-size="10" fill="#a8a69e">"Amazing!" → 긍정</text>
<text x="331" y="115" text-anchor="middle" font-size="10" fill="#a8a69e">"Terrible." → 부정</text>
<rect x="244" y="126" width="174" height="26" rx="6" fill="#412402" stroke="#EF9F27" stroke-width="0.8" stroke-dasharray="4 2"/>
<text x="331" y="143" text-anchor="middle" font-size="10" fill="#EF9F27">"Works great!" → ?</text>
<line x1="331" y1="154" x2="331" y2="176" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-llm-prompt)"/>
<rect x="286" y="178" width="90" height="28" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="331" y="197" text-anchor="middle" font-size="12" fill="#e8e6de">LLM</text>
<line x1="331" y1="208" x2="331" y2="230" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-llm-prompt)"/>
<rect x="255" y="232" width="152" height="28" rx="6" fill="#04342C" stroke="#1D9E75" stroke-width="1"/>
<text x="331" y="251" text-anchor="middle" font-size="12" fill="#9FE1CB">긍정(Positive)</text>
<text x="331" y="290" text-anchor="middle" font-size="10" fill="#6a6a64">예시로 출력 형식과</text>
<text x="331" y="304" text-anchor="middle" font-size="10" fill="#6a6a64">레이블 공간을 제한.</text>
<text x="331" y="318" text-anchor="middle" font-size="10" fill="#6a6a64">구조화 출력에 효과적.</text>
<!-- ===== CHAIN-OF-THOUGHT ===== -->
<rect x="468" y="34" width="190" height="46" rx="6" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="563" y="52" text-anchor="middle" font-size="10" fill="#9E9AC8">지시 + CoT 트리거</text>
<text x="563" y="65" text-anchor="middle" font-size="11" fill="#CECBF6">감성을 분류하세요.</text>
<text x="563" y="77" text-anchor="middle" font-size="11" fill="#7F77DD">단계별로 생각하세요.</text>
<line x1="563" y1="82" x2="563" y2="104" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-llm-prompt)"/>
<rect x="518" y="106" width="90" height="28" rx="6" fill="#272725" stroke="#444441" stroke-width="1"/>
<text x="563" y="125" text-anchor="middle" font-size="12" fill="#e8e6de">LLM</text>
<line x1="563" y1="136" x2="563" y2="156" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-llm-prompt)"/>
<rect x="468" y="158" width="190" height="68" rx="6" fill="#1a1a18" stroke="#444441" stroke-width="0.5"/>
<text x="563" y="174" text-anchor="middle" font-size="10" fill="#a8a69e">Step 1: "Works great"은</text>
<text x="563" y="188" text-anchor="middle" font-size="10" fill="#a8a69e">긍정적 만족을 나타냄.</text>
<text x="563" y="204" text-anchor="middle" font-size="10" fill="#a8a69e">Step 2: "so far"는 약한</text>
<text x="563" y="218" text-anchor="middle" font-size="10" fill="#a8a69e">유보지만 전체 톤은 긍정.</text>
<line x1="563" y1="228" x2="563" y2="248" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-ko-llm-prompt)"/>
<rect x="487" y="250" width="152" height="28" rx="6" fill="#04342C" stroke="#1D9E75" stroke-width="1"/>
<text x="563" y="269" text-anchor="middle" font-size="12" fill="#9FE1CB">긍정(Positive)</text>
<text x="563" y="308" text-anchor="middle" font-size="10" fill="#6a6a64">추론 단계 외재화로</text>
<text x="563" y="322" text-anchor="middle" font-size="10" fill="#6a6a64">다단계·모호한 작업에서</text>
<text x="563" y="336" text-anchor="middle" font-size="10" fill="#6a6a64">정확도 향상.</text>
<!-- Bottom label -->
<text x="340" y="362" text-anchor="middle" font-size="11" fill="#6a6a64">RAG: 추론 시 관련 문서를 검색해 컨텍스트에 주입 → 학습 데이터 너머의 지식 확장</text>
</svg>

- **Zero-shot** — 작업 설명만 제공; 모델이 사전학습 지식으로 일반화
- **Few-shot** — 작업 + 2–5개 예시; 모델이 원하는 형식과 레이블 공간을 추론
- **Chain-of-Thought (CoT)** — "단계별로 생각하세요"; 모델이 답변 전에 추론 과정을 외재화; 다단계 작업에서 정확도 향상
- **RAG (검색 증강 생성)** — 추론 시 관련 문서를 검색해 컨텍스트에 주입; 재학습 없이 학습 데이터 너머의 지식 확장

---

## 파인튜닝 & 정렬(Alignment)

사전학습이 일반 능력을 부여한다면, 파인튜닝은 행동과 안전성을 다듬는다:

- **SFT (지도 파인튜닝)** — (지시, 응답) 쌍으로 훈련해 지시 따르기를 학습
- **RLHF (인간 피드백 강화학습)** — 인간 선호 쌍으로 보상 모델 훈련 → PPO로 LLM 정책 업데이트
- **DPO (Direct Preference Optimization)** — RLHF의 간소화 버전; 별도 보상 모델·RL 루프 없이 선호를 직접 최적화

이 과정이 원시 사전학습 "베이스 모델"을 실용적인 어시스턴트(ChatGPT, Claude 등)로 변환한다.

---

## 평가

| 지표 | 측정 대상 | 한계 |
|------|----------|------|
| **Perplexity** | 언어 모델 적합도 (낮을수록 좋음) | 태스크 성능과 무관 |
| **벤치마크** (MMLU, HumanEval, GSM8K) | 태스크별 정확도 | 벤치마크 포화, 데이터 오염 위험 |
| **Human eval** | 선호도, 유용성, 안전성 | 비용 높고 주관적 |

단일 지표로는 부족하다. 로보틱스 적용 시엔 **액션 시퀀스 정확도**, **안전성**, **지연 시간**이 perplexity보다 훨씬 중요하다.

---

## 로봇·VLA와의 연결

- LLM → policy (코드/명령 생성), planning, VLA의 "L" 부분
- 정확한 액션 시퀀스 생성, 안전성, 지연 이슈

---

## 참고

- [ML Fundamentals](./02-ml-fundamentals/) — Transformer, Attention, Q·K·V
- [VLM](./04-vlm/)
- [VLA](./05-vla/)
- `../../04-research/` — LLM 논문 요약
- `../../study/llm/` — 학습 노트

---

## Food for Thought

- LLM은 보통 perplexity 같은 언어 중심 평가로 맞추지만, 로봇에선 액션 시퀀스 정확도·안전성·지연이 본질입니다; 로보틱스 기준의 평가 + 런타임 제약을 같이 정의하면 LLM이 "데모용"을 넘어 제품화 가능한 계획 구성요소가 됩니다.
- 언어→로봇 명령 생성은 모호함이나 툴/스키마 불일치에서 쉽게 깨집니다; 기회는 구조화된 커맨드 스키마 + 플래너 레이어로 "가능한 행동만" 생성되게 제약을 강제하는 것입니다.
- RAG/멀티모달 확장은 성능을 올리지만 근거(grounding) 실패, 검색 지연 같은 불확실성을 함께 만듭니다; 검색+근거를 결정론적 파이프라인과 실패 모드(지표)로 만들면 배포가 안정화됩니다.
