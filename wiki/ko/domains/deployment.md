# Deployment

로봇·VLA를 **실제 하드웨어에 올리고 서비스하는** 과정 — **form factors**, **on-device 배포**, **quantization**, **롤아웃** 정리.

---

## 개요

- **Form factor:** 로봇/그리퍼 암의 물리적 형태·장착 방식(테이블탑, 그리퍼 암 등)
- **On-device:** 모델을 엣지(로봇, Jetson 등)에서 실행해 지연·오프라인 동작 확보
- **Quantization:** 정밀도 축소로 메모리·연산 절약, 실시간 추론에 필수

---

## Form factors (폼팩터)

- **Robotics** 도메인에서 로봇·그리퍼 형태를 개괄하고, 여기서는 **배포 관점**만 정리.
- **듀얼 암 / 바이매뉴얼:** 두 개의 팔·그리퍼, 작업공간·DOF·payload
- **콤팩트 그리퍼 암:** 소형 바이매뉴얼·웨어러블·휴대형 등 (예: MiniBEE 스타일)
- **장착 위치:** 테이블탑, 모바일 베이스, 고정 설비 — 지연·전력·연산 자원에 영향

→ 상세 폼팩터 설명은 [Robotics](robotics.md#form-factors-폼팩터) 참고.

---

## On-device deployment

- **목표:** 로봇/엣지 디바이스에서 **클라우드 없이** 추론, 낮은 지연·안정적 동작
- **하드웨어:** NVIDIA Jetson, 라즈베리파이 등 — 메모리·연산 제약
- **소프트웨어:** 추론 엔진(ONNX, TensorRT, llama.cpp 등), ROS/파이프라인 연동
- **실제 사례:** LiteVLA-Edge — Jetson Orin에서 4bit 양자화로 6.6Hz closed-loop 제어

---

## Quantization (양자화)

- **의미:** 가중치·활성화를 8bit/4bit 등 저정밀도로 줄여 메모리·연산 절감
- **로봇/VLA 맥락:** 액션 공간이 민감해, 선택적 양자화·calibration이 중요 (예: QuantVLA)
- **방식:** Post-training quantization (PTQ), quantization-aware training (QAT)
- **트레이드오프:** 정확도 vs 속도·에너지·비용

---

## 롤아웃·운영 (채워나가기)

- **Shadow mode** — 실제 제어 없이 예측만 수집·평가
- **Canary / A/B** — 소규모 배포 후 메트릭·안전 확인
- **롤백·버저닝** — 정책/모델 버전 관리, 긴급 롤백 절차

---

## 참고

- [Robotics](robotics.md) — form factors, 하드웨어
- [VLA](vla.md) — 모델·액션 공간
- [Foundation Model](../product/foundation-model.md) — 인코딩·학습
- [Safety & Evaluation](../safety-eval/README.md) — 안전·평가

