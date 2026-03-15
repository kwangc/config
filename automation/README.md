# Automation — Claude Code & 업무 자동화

Claude / Claude Code로 반복 업무를 줄이기 위한 스크립트·워크플로우·프롬프트를 두는 폴더입니다.

---

## 폴더 구조

```
automation/
├── README.md     ← 이 문서 (사용법·목록)
└── scripts/      ← 실행 가능한 스크립트, 셸·파이썬 등
```

---

## 스크립트 목록 (채워나가기)

| 스크립트 | 목적 | 사용법 |
|----------|------|--------|
| (예) fetch_papers.sh | arXiv 특정 키워드 논문 목록 가져오기 | `./scripts/fetch_papers.sh "VLA"` |
| (예) update_wiki_news.js | 뉴스·논문 스크래핑 후 요약 → `wiki-site/src/data/news.json` 갱신 | Wiki 사이트 News 페이지에 자동 반영 |

---

## 워크플로우 아이디어 (PM 관점)

- **리서치 수집:** 주간/일일 논문·뉴스 크롤링 → `references/` 또는 wiki에 정리
- **Wiki 갱신:** 새 문서 추가 시 `wiki/en/README.md` / `wiki/ko/README.md` 목차 반영 (스크립트 가능)
- **회의·문서:** 노트 요약, 액션 아이템 추출
- **메트릭·대시보드:** (내부 도구 연동 시) 데이터 요약 스크립트

---

## 사용 시 유의

- API 키·비밀은 스크립트에 하드코딩하지 말고 환경 변수 또는 로컬 설정 파일 사용
- 실행 전 `scripts/` 내 스크립트 권한 확인: `chmod +x scripts/*.sh` (필요 시)

---

*마지막 업데이트: 2026-03-15*
