# SmolVLM: Redefining small and efficient multimodal models

*arXiv* (SmolVLM)

---

## 1) 간략한 내용 (공개일, 주요 저자 등)

- **공개일:** 2025-04 (제출일 기준 **2025-04-07**)
- **arXiv:** [2504.05299](https://arxiv.org/abs/2504.05299)
- **제목:** *SmolVLM: Redefining small and efficient multimodal models*
- **주요 저자(대표):** Andrés Marafioti, Orr Zohar, Miquel Farré, Merve Noyan, Elie Bakouch, Pedro Cuenca, Cyril Zakka, Loubna Ben Allal, Anton Lozhkov, Thomas Wolf (+ others)
- **공식 리소스(문서에 명시):**
  - [huggingface/smollm](https://github.com/huggingface/smollm)
  - [SmolVLM blog](https://huggingface.co/blog/smolvlm2)

---

## 2) 상세 내용

### 배경: 작은 VLM도 큰 모델의 비효율을 그대로 물려받는다

대형 VLM은 성능이 뛰어나지만 연산/메모리 비용이 커서 모바일/엣지 배포가 어렵습니다. 반면 작은 VLM은 보통 큰 모델과 유사한 설계를 그대로 가져가며, 특히 이미지 토큰을 많이 만들거나(Oversplitting/inefficient tokenization) GPU 메모리를 비효율적으로 쓰게 됩니다. 그 결과 온디바이스 실사용이 제약됩니다.

### 핵심 아이디어: 자원 효율적 추론에 맞춘 “작은” VLM 제품군

SmolVLM은 **자원 효율적인 inference**를 목표로 설계한 compact multimodal 모델 시리즈입니다. 논문은 다음을 체계적으로 탐색합니다.

- 아키텍처 구성
- 토큰화(tokenization) 전략
- 데이터 큐레이션(data curation)

그리고 이러한 설계 선택이 이미지/비디오 과제 성능을 올리면서도 메모리 풋프린트를 작게 유지하는 “핵심 설계 포인트”가 무엇인지 정리합니다.

### 아키텍처(개요)

큰 흐름은 다음과 같습니다.

- 이미지를 subimage로 분할
- 비디오는 프레임을 샘플링
- 비전 인코더로 시각 특징 추출
- **pixel-shuffle** 방식으로 시각 토큰 수를 줄이는 재배열
- 시각 특징을 LM 입력 토큰 공간으로 투영
- 텍스트 임베딩과 interleave/concatenate 후 출력 생성

### 왜 효율이 나오는가(핵심 발견들)

#### 1) vision encoder vs language model에 compute를 균형 배분

compact VLM에서는 encoder–LM의 파라미터/능력 배분이 비효율이면 성능-비용 비가 크게 악화됩니다. SmolVLM은 작은 LM에서는 큰 비전 인코더보다 **더 작은 비전 인코더 + 균형 배분**이 효율에 유리하다고 보고합니다.

#### 2) context length 확장으로 “고해상도 처리”를 현실화

SmolVLM은 RoPE base를 10k → 27k로 늘리고, long-context + short-context 데이터 혼합으로 파인튜닝합니다. 논문은 주로:

- 메인 변형은 **16k** 컨텍스트
- 작은 변형은 **8k** 컨텍스트

로 채택합니다.

#### 3) 작은 모델에는 더 공격적인 visual token compression이 유리

pixel shuffle은 토큰 수를 줄이지만, 너무 공격적으로 압축하면 OCR처럼 정밀 localization 과제에서 손실이 생길 수 있습니다. SmolVLM은 작은 VLM에서 **shuffle ratio r=4** 같은 더 공격적인 압축이 오히려 성능/효율 균형을 개선한다고 찾습니다.

#### 4) 비디오는 frame averaging 대신 인코더 해상도에 맞춘 리사이징

frame averaging(여러 프레임을 평균내기)은 비디오 벤치마크 성능을 떨어뜨린다고 보고하며, 최종 레시피에서는 프레임을 이미지 인코더 해상도로 rescale하는 방식을 사용합니다.

### Instruction tuning은 “작은 모델 전용 디테일”이 많다

- **learned positional tokens vs string positions:** 문자열 기반 위치 토큰은 학습이 “OCR loss plague”처럼 정상적으로 수렴하지 않는 문제를 만들고, learned positional tokens는 학습 안정성과 OCR 성능/일반화 모두를 개선합니다.
- **structured prompting + media intro/outro 마커:** 시스템 프롬프트와 “이미지/샘플링된 N 프레임 소개/종결” 토큰이 이미지/비디오 모두에서 성능을 올리고, 특히 비디오에서 효과가 큽니다.
- **SFT에서 user prompt masking:** 반복 질문을 마스킹하면 과적합이 줄고 generalization이 좋아집니다(특히 multimodal QA).
- **CoT는 아주 소량만:** 작은 모델에서는 CoT 데이터 비중을 **0.02–0.05%** 정도로 매우 낮게 넣을 때만 이득이 있고, 과하면 비전 표현 품질이 떨어집니다.
- **비디오 길이는 적당히:** 평균 약 **3.5분**까지는 길수록 도움이 되지만, 그 이상은 계산 비용 대비 이득이 줄어듭니다.

### 모델 변형과 핵심 결과

- **SmolVLM-256M:** < **1GB GPU** 메모리로 추론하면서도, **Idefics-80B**보다 좋은 결과를 보이며(개발 격차 18개월 언급).
- **SmolVLM-2.2B:** 더 큰 VLM 대비 메모리를 절반 정도로 쓰면서도 준-최신 성능을 보임.
- 비디오 이해 성능도 여러 벤치마크에서 강하게 보고됩니다(예: Video-MME / WorldSense 등).

### 배포 신호(온디바이스/엣지)

throughput 측정과 함께 **WebGPU 기반 로컬/브라우저 추론** 데모를 제공해서, 에너지 효율적인 온디바이스 배포 가능성을 보여줍니다.

---

## 3) 왜 중요한 논문인가

- “효율”을 토큰화/컨텍스트/데이터 구성까지 포함해 제품 제약으로 다루는 논문입니다.
- 작은 multimodal 모델을 만들 때 무엇을 조정해야 성능과 효율이 동시에 나오는지 레시피 수준으로 제공합니다.
- 멀티모달 이해가 “클라우드 전용”에서 “엣지/에너지 효율”로 이동하는 흐름을 지지합니다.

---

## 4) Config 적용 사례

SmolVLM은 로봇 논문은 아니지만, Config의 로봇/VLA 시스템에서 “온디바이스 멀티모달 구성요소”를 설계할 때 바로 적용 가능한 힌트를 줍니다.

- **성능보다 먼저 메모리/컴퓨트 예산을 명시:** 파라미터 수만 보지 말고 RAM/VRAM 사용량 기준으로 설계/평가.
- **토큰화가 곧 제품 아키텍처:** pixel shuffle 기반 시각 토큰 압축, 이미지 splitting 같은 기법은 inference 비용을 줄이는 실전 레버입니다.
- **작은 모델에서의 데이터 믹스는 섬세해야 함:** text/video 비율, CoT 사용량(소량만), LLM-SFT 텍스트 재사용 같은 선택이 성능에 역효과가 날 수 있음.
- **멀티모달 파이프라인용 프롬프트/마커:** “이미지/프레임 구간을 명확히 구분”하는 구조화된 프롬프트는 하위 제어 스택으로 연결할 때 불확실성을 줄이는 데 도움이 됩니다.
- **비디오에서의 naive frame averaging 회피:** 인코더 해상도/샘플링 가정에 맞는 학습 레시피가 필요합니다.

