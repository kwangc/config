# Stage 1 — ML Fundamentals (VLA 입문)

> **목표:** Neural Network → Transformer → ViT → LLM 흐름을 잡고, RT-2/OpenVLA를 읽을 수 있는 기반 만들기

---

## 목차

1. [Neural Network 기본 구조](#1-neural-network-기본-구조)
2. [역전파 (Backpropagation)](#2-역전파-backpropagation)
3. [Transformer & Attention](#3-transformer--attention)
4. [Vision Encoder (ViT)](#4-vision-encoder-vit)
5. [LLM — 다음 토큰 예측](#5-llm--다음-토큰-예측)
6. [RNN vs Transformer](#6-rnn-vs-transformer)
7. [Pre-training vs Fine-tuning](#7-pre-training-vs-fine-tuning)
8. [Parameter란 무엇인가](#8-parameter란-무엇인가)
9. [전체 요약 & RT-2 연결고리](#9-전체-요약--rt-2-연결고리)

---

## 1. Neural Network 기본 구조

### 핵심 직관

NN은 **함수 근사기**다. 입력 → 출력을 만드는 함수를 규칙으로 직접 설계하는 대신, 데이터를 보여주면서 스스로 패턴을 찾게 한다.

```
입력 (이미지 픽셀)
      ↓
  [레이어 1] → 가중치(w) 연결
      ↓
  [레이어 2] → 가중치(w) 연결
      ↓
출력 (고양이 94%)
```

### 핵심 구성요소

| 구성요소 | 설명 |
|---|---|
| **레이어** | 입력층 → 은닉층(들) → 출력층 |
| **가중치 (Weight)** | 각 연결선에 부여된 숫자. 학습으로 조정됨 |
| **활성화함수** | 비선형성 부여 (ReLU, Sigmoid 등). 없으면 선형 함수의 연속에 불과 |
| **학습 목표** | 정답 레이블과의 차이(Loss)를 최소화하도록 가중치 조정 |

> **비유:** 요리 레시피를 조정한다고 생각. 처음엔 소금 양을 모르니 아무 양이나 시작 → "너무 짜다" 피드백 → 줄이기 → 반복. NN도 Loss 피드백으로 가중치를 반복 조정한다.

---

## 2. 역전파 (Backpropagation)

### 핵심 직관

"틀린 정도(Loss)를 **뒤에서 앞으로** 전달하면서, 각 가중치가 얼마나 책임이 있는지 계산하고 조정하는 과정"

수학적으로는 **Chain Rule(연쇄법칙)** 을 사용하지만, 지금은 흐름만 이해하면 충분.

### 흐름

```
① 순전파 (Forward pass)
   입력 → 은닉층 → 예측 (강아지 72%)

② Loss 계산
   예측 (강아지 72%)  vs  정답 레이블 (고양이 100%)
   → Loss = 두 값의 차이

③ 역전파 (Backward pass)
   Loss를 거꾸로 전달 → 각 가중치 조정

④ 반복
   수만~수백만 번 반복 → 모델이 점점 정확해짐
```

### 데이터셋 분리

과적합(Overfitting)을 막기 위해 세 가지로 나눈다.

| 종류 | 역할 | 가중치 조정 |
|---|---|---|
| **Train set** | 실제 학습용 | O |
| **Validation set** | 학습 중간 성능 확인 | X |
| **Test set** | 최종 성능 측정 (딱 한 번만) | X |

### 학습률 (Learning Rate)

가중치를 얼마나 크게 조정할지 결정하는 값.
- 너무 크면 정답을 지나쳐버림
- 너무 작으면 학습이 너무 느림

이를 제어하는 알고리즘이 **SGD, Adam** 같은 **옵티마이저(Optimizer)**.

---

## 3. Transformer & Attention

### 핵심 직관

RNN은 단어를 순서대로 하나씩 읽었다. Transformer는 **모든 토큰을 한 번에 보면서 서로의 관계를 동시에 계산**한다.

### Attention 공식

```
Attention(Q, K, V) = softmax(Q·Kᵀ / √d) · V
```

Transformer는 결국 **Q, K를 활용해 V를 반환하는 함수**다.

### Q · K · V 의미

| 역할 | 의미 | 비유 (도서관) |
|---|---|---|
| **Q (Query)** | "나는 무엇을 찾나?" | 검색어 |
| **K (Key)** | "나는 무엇을 갖나?" | 책의 제목 |
| **V (Value)** | "실제로 전달할 정보" | 책의 실제 내용 |

### 계산 흐름

```
① 입력 토큰에 가중치 행렬을 곱해 Q, K, V 생성
② Q · Kᵀ / √d → 유사도 점수 계산
③ Softmax → 합이 1이 되는 확률값(가중치)으로 변환
④ 가중치 × V → 가중 합산 → 최종 출력 벡터
```

> **√d로 나누는 이유:** 차원(d)이 커질수록 내적값이 커져 Softmax가 극단적인 값만 출력. 이를 방지하기 위한 스케일링. (**Scaled Dot-Product Attention**)

### 핵심 개념들

- **Softmax:** 점수 차이를 지수함수로 증폭 → Winner를 두드러지게 만듦
- **Multi-head Attention:** 여러 Attention head가 병렬로 다양한 관점(문법적·의미적)에서 계산
- **Context window:** Attention이 실제로 계산되는 범위 (예: GPT-4는 128,000 토큰)
- **Quadratic scaling:** N개 토큰 → N² 쌍 계산. Context 길어질수록 비용이 제곱으로 증가
- **Transformer 구조:** `[Attention → Feed Forward] × N층`. 층이 깊을수록 추상적 표현 학습

---

## 4. Vision Encoder (ViT)

### 핵심 아이디어

이미지를 **16×16 픽셀 패치**로 쪼개서 토큰처럼 취급하면, Transformer를 그대로 재사용할 수 있다.

### Vision Encoder vs ViT

| 용어 | 의미 |
|---|---|
| **Vision Encoder** | 역할 이름 — 이미지를 벡터로 변환하는 모듈 |
| **ViT** | 그 역할을 Transformer로 구현한 방식 (구현체) |

> CNN(ResNet 등)이 Vision Encoder 역할을 하던 시대(~2020)에서, ViT 등장 이후 최신 VLM들은 대부분 ViT를 Vision Encoder로 사용한다.

### 처리 흐름

```
① 원본 이미지 (224×224 픽셀)
        ↓
② 패치 분할 → 196개 패치 (14×14)
   각 패치를 벡터로 flatten
        ↓
③ Transformer 처리 (텍스트와 완전히 동일)
   패치 간 Attention 계산
        ↓
④ 출력: 이미지 embedding (의미가 담긴 벡터)
```

### [CLS] 토큰

패치들 앞에 특수 토큰을 추가. 모든 패치의 정보를 집약 → 이미지 전체 표현으로 사용.

> **핵심:** 텍스트 Transformer와 ViT의 구조는 완전히 동일하다. **입력만 다를 뿐.**

---

## 5. LLM — 다음 토큰 예측

### 세 가지 Transformer 구조

| 구조 | Attention 방향 | 용도 | 예시 |
|---|---|---|---|
| **Encoder only** | 양방향 (모든 방향) | 이해·분류. 생성 불가 | BERT, ViT |
| **Decoder only** ⭐ | 단방향 (앞만) | 이해 + 생성 모두 | GPT, LLaMA, Claude |
| **Encoder-Decoder** | Enc: 양방향 / Dec: 단방향 | 입출력 분리 태스크 | T5, 번역 모델 |

> GPT 계열 LLM은 Encoder 없이 **Decoder only**로 동작. 입력 이해와 텍스트 생성을 하나의 Decoder가 모두 담당한다.

### Encoder-Decoder가 아닌 이유

"Encoder로 이해 → Decoder로 생성" 흐름은 T5, 번역 모델 같은 Encoder-Decoder 구조에서의 이야기. GPT, LLaMA, Claude 같은 현대 LLM은 **Decoder가 이해와 생성을 혼자 다 처리**한다.

Decoder only가 LLM 주류가 된 이유:
- 입력 이해와 출력 생성을 하나의 구조로 처리 → 구조 단순, 스케일 용이
- 데이터가 많아질수록 Encoder 없이도 충분히 "이해" 가능해짐

### Autoregressive (자기회귀) 생성

```
입력:  "The cat sat"
step1: "The"           → Decoder → 예측: "cat"
step2: "The cat"       → Decoder → 예측: "sat"
step3: "The cat sat"   → Decoder → 예측: "on"
step4: "The cat sat on"→ Decoder → 예측: "the"
  ...
```

매 스텝마다 context window의 **모든 이전 토큰을 다시 참조**해서 다음 하나를 예측한다.

### Decoder가 미래를 가리는 이유 (Masked Self-Attention)

생성할 때 아직 나오지 않은 단어를 미리 볼 수 없기 때문. "The cat ___"에서 다음 단어를 예측할 때 "sat"을 이미 알고 있으면 의미가 없다.

---

## 6. RNN vs Transformer

### 딥러닝과의 관계

Transformer는 딥러닝의 한 종류다. RNN도 마찬가지.

```
딥러닝 (Deep Learning)
├── RNN (Recurrent Neural Network)  ← 순차 처리
├── CNN (Convolutional Neural Network) ← 이미지 처리
└── Transformer ← 병렬 처리, 현재 주류
```

### 본질적 차이 — 시퀀스를 어떻게 처리하느냐

| | RNN | Transformer |
|---|---|---|
| **처리 방식** | 단어를 하나씩 순서대로 | 모든 토큰을 동시에 |
| **정보 전달** | hidden state를 순차 전달 → 뒤로 갈수록 희석 | Attention으로 모든 토큰 직접 참조 |
| **병렬 처리** | 불가 (순서 의존) | 가능 → GPU 활용 극대화 |
| **장거리 의존성** | 약함 | 강함 (거리 무관하게 직접 참조) |

```
RNN:         The → cat → sat → on
                   h1 → h2 → h3 → h4   (순차, 앞 정보 희석)

Transformer: The  cat  sat  on
              ↕    ↕    ↕    ↕          (동시, 모든 쌍 직접 참조)
```

> **Transformer가 주류가 된 핵심 이유:** 병렬화 → GPU 활용 극대화 → 대규모 학습 가능. RNN은 순서 의존성 때문에 병렬화가 근본적으로 어렵다.

---

## 7. Pre-training vs Fine-tuning

### 비유

의대생이 6년간 의학 전반을 공부하는 게 **pre-training**, 졸업 후 흉부외과 전문의 수련을 받는 게 **fine-tuning**.

### 차이

| | Pre-training | Fine-tuning |
|---|---|---|
| **데이터** | 수백억 토큰 (인터넷 전체 규모) | 수만~수백만 건 (특정 도메인) |
| **목표** | 범용 언어 이해 획득 | 특정 태스크 특화 |
| **비용** | 수개월 / 수천억 원 | 상대적으로 저렴 |
| **결과** | Base Model | 특화 모델 |

```
Pre-training (범용 학습)
        ↓
   Base Model
    ↙       ↘
Fine-tuning A    Fine-tuning B
의료 데이터 추가   로봇 액션 데이터 추가
→ 의료 전문 모델   → VLA 모델 (RT-2)
```

### RT-2 맥락에서

PaLM-E 같은 대형 VLM을 pre-trained base로 가져와서, 로봇 액션 데이터로 fine-tuning한 게 RT-2다. 처음부터 로봇 모델을 만드는 게 아니라 **거인의 어깨 위에 서는 방식**.

> Fine-tuning의 변형으로 **LoRA** 같은 기법도 있다. 전체 가중치를 조정하는 대신 일부 레이어만 업데이트해서 비용을 더 줄이는 방법.

---

## 8. Parameter란 무엇인가

### Parameter = Weight, 사실상 같은 말

```
Parameter  =  모델이 학습으로 조정하는 모든 숫자
Weight     =  연결선의 강도를 나타내는 숫자
Bias       =  각 노드의 기본값 오프셋

즉: Weight + Bias = Parameter
실전에서는 거의 같은 의미로 혼용
```

### 왜 70억 개나 필요한가

Transformer 레이어 하나 안에 있는 행렬들의 크기를 보면 이해가 된다.

```
레이어 하나 (hidden dim = 4096 기준):
  Q 가중치 행렬:  4096 × 4096 = 16,777,216개
  K 가중치 행렬:  4096 × 4096 = 16,777,216개
  V 가중치 행렬:  4096 × 4096 = 16,777,216개
  FFN 레이어:     훨씬 더 큼
  ──────────────────────────────────────────
  레이어 하나만으로 이미 수천만 개

  이게 32층 쌓이면 → 수십억 개 (7B)
```

### 파라미터 수와 모델 크기

| 모델 | 파라미터 수 | 메모리 (FP16) |
|---|---|---|
| SmolVLM | 2B | ~4GB |
| LLaMA 7B | 7B | ~14GB |
| GPT-4 (추정) | ~1T | 수TB |

파라미터가 많을수록 더 복잡한 패턴을 표현할 수 있다. 그리고 이 숫자가 곧 메모리 요구량이 되기 때문에, **on-device 배포에서 양자화(Quantization)가 필요한 직접적인 이유**가 된다.

```
FP32 (32bit): 파라미터 1개 = 4 bytes
FP16 (16bit): 파라미터 1개 = 2 bytes
INT8  (8bit): 파라미터 1개 = 1 byte  ← 양자화
INT4  (4bit): 파라미터 1개 = 0.5 bytes ← 더 공격적인 양자화

7B 모델 FP32: 28GB → INT4: 3.5GB (로봇 온디바이스 가능)
```

---

## 9. 전체 요약 & RT-2 연결고리

### 핵심 정리

| 개념 | 한 줄 요약 |
|---|---|
| **NN** | 가중치를 조정하는 함수 근사기. 역전파로 Loss를 최소화하며 학습 |
| **Transformer** | `Attention(Q,K,V)` 함수를 N층 쌓은 구조. 모든 토큰 관계를 동시 계산 |
| **RNN vs Transformer** | 순차 처리 vs 병렬 처리. 병렬화 가능성이 Transformer 주류화의 핵심 |
| **ViT** | 이미지를 패치 토큰으로 쪼개 Transformer에 입력. Vision Encoder의 현재 주류 |
| **LLM** | Decoder only 구조. 이전 토큰들을 보며 다음 토큰을 자기회귀적으로 생성 |
| **Pre-training** | 수백억 토큰으로 범용 언어 이해 학습. 비용 매우 큼 |
| **Fine-tuning** | Pre-trained 모델을 특정 태스크 데이터로 추가 학습. RT-2도 이 방식 |
| **Parameter** | 모델의 모든 학습 가능한 숫자 (≈ Weight). 많을수록 복잡한 패턴 표현 가능 |

### RT-2에서의 조합

```
텍스트 토큰:  "컵을 집어라"  ─┐
이미지 패치:  카메라 영상    ─┤ → 같은 Transformer에 함께 입력
액션 토큰:   관절 각도 값   ─┘

ViT (Encoder)      → 이미지 이해
LLM (Decoder only) → 액션 생성

"이미지를 읽고 → 액션을 쓴다"
```

> **핵심 통찰:** ViT가 이미지를 텍스트처럼 만들어주기 때문에, 텍스트·이미지·로봇 액션 모두 Transformer 입장에선 똑같은 토큰이다. 이것이 VLM → VLA로 이어지는 핵심 아이디어.

---

*다음 단계: Stage 2 — VLM (CLIP, LLaVA, SmolVLM) → Stage 3 — VLA / RT-2 / OpenVLA*
