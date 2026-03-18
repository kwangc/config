# Operations / Human-in-the-loop

Operations는 human-in-the-loop 데이터 획득, 라벨링, 품질 게이팅을 “빠른 태스크별 모델 배포”로 연결해줍니다.

---

## 핵심 목표: 타깃 로봇/태스크에 빠르게 적응

tech preview에서 설명한 전형적인 적응 흐름은:

1. **타깃 로봇의 물리 특성과 센싱 제약**을 기준으로 acquisition strategy를 설계
2. **소량의 타깃 태스크 텔레옵 데이터** 수집
3. **CFG-1을 태스크별로 파인튜닝**(보통 **~24시간** 내 완료)
4. 온라인 롤아웃에서 **human-in-the-loop 개입**으로 전략과 데이터 계획을 동시에 개선
5. **~48시간** 내 배포까지 도달(필요하면 반복)

---

## 온라인 개선에서 인간이 하는 일

롤아웃 초반에는 정책이 아직 서툴 수 있습니다. 인간은 다음을 위해 개입합니다.

- 실패에서 복구
- 방문한 상태 공간을 확장(초기 trajectory에 편향된 데이터를 줄임)
- 수집 가이드/전략을 리파인해서 불필요한 분산을 줄임

tech preview에서는 라운드 간 **trajectory consistency**와 **workspace coverage 확장**으로 측정 가능한 것으로 제시됩니다.

---

## 라벨링 & 품질 운영

또한 operations는 데이터가 계속 “쓸 수 있는 상태”로 유지되게 돕습니다.

- 데이터 lineage/버전 관리 유지
- 품질을 precision + accuracy + diversity 관점에서 추적
- 실패 원인 attribution을 남겨 다음 데이터 배치가 “맞는 간격”을 채우도록 설계

---

## 참고

- [Data Platform](../01-data-platform.md/)
- [Foundation Model](../02-foundation-model.md/)
