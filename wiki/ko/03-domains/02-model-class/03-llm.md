# LLM (Large Language Model)

---

## 핵심 개념 (채워나가기)

- **Transformer** — Self-attention, 인코더/디코더
- **사전학습 목표** — MLM, causal LM, seq2seq
- **프롬프팅** — zero-shot, few-shot, CoT, RAG
- **평가** — perplexity, downstream tasks, human eval
- **멀티모달 확장** — vision-language, VLA로의 연결

---

## 로봇·VLA와의 연결

- LLM → policy (코드/명령 생성), planning, VLA의 "L" 부분
- 정확한 액션 시퀀스 생성, 안전성, 지연 이슈

---

## 참고

- `../../04-research/` — LLM 논문 요약
- `../../study/llm/` — 학습 노트

---

## Food for Thought

- LLM은 보통 perplexity 같은 언어 중심 평가로 맞추지만, 로봇에선 액션 시퀀스 정확도·안전성·지연이 본질입니다; 로보틱스 기준의 평가 + 런타임 제약을 같이 정의하면 LLM이 “데모용”을 넘어 제품화 가능한 계획 구성요소가 됩니다.
- 언어→로봇 명령 생성은 모호함이나 툴/스키마 불일치에서 쉽게 깨집니다; 기회는 구조화된 커맨드 스키마 + 플래너 레이어로 “가능한 행동만” 생성되게 제약을 강제하는 것입니다.
- RAG/멀티모달 확장은 성능을 올리지만 근거(grounding) 실패, 검색 지연 같은 불확실성을 함께 만듭니다; 검색+근거를 결정론적 파이프라인과 실패 모드(지표)로 만들면 배포가 안정화됩니다.

