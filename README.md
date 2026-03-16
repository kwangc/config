# Config — Private Workspace

**Owner:** Tony Lee | **Role:** Head of Product @ [Config Intelligence Inc.](https://config.inc/)

이 폴더는 Config 입사 전·후 **학습, 리서치, 업계 동향 파악, 업무 자동화**를 한곳에서 관리하기 위한 private workspace입니다.

---

## 목적

- **학습:** AI, LLM, VLA, Robotics 등 도메인 지식 체계화
- **리서치:** 논문·기술 블로그·산업 동향 정리 및 실시간 반영
- **Wiki:** 위 내용이 모여 **Config Wiki** 역할 — 팀/자기 참조용 지식베이스
- **자동화:** Claude / Claude Code 활용한 업무 효율화·스크립트·워크플로우

---

## 폴더 구조

```
Config/
├── README.md           ← 지금 문서 (워크스페이스 개요)
├── wiki/               ← Config Wiki — 로케일별 마크다운 (`en/` 영문 원본, `ko/` 한글)
│   ├── en/             ← 영문 문서 (company, product, domains, …)
│   └── ko/             ← 한글 문서 (동일 구조)
├── wiki-site/          ← Wiki 온라인 사이트 (Astro) — GitHub Pages / Vercel 배포
│   └── src/data/news.json  ← News 페이지 데이터 (스크래핑 스크립트로 갱신 가능)
├── study/              ← 개인 학습 노트 (자유 형식)
├── automation/         ← Claude Code·스크립트·워크플로우
│   └── scripts/        ← 뉴스·논문 스크래핑 → wiki-site/src/data/news.json 갱신 등
├── references/         ← 링크, 페이퍼 목록, 북마크
└── templates/          ← Wiki/노트 템플릿 (선택)
```

---

## 사용 방법

- **Wiki:** `wiki/en/` · `wiki/ko/` 에 주제별로 마크다운 작성. 목차는 각 로케일 `README.md` 에 반영.
- **Study:** `study/` 에는 덜 정제된 메모, 요약, 연습 내용 OK. 정리되면 wiki로 옮기기.
- **자동화:** `automation/` 에 스크립트·프롬프트·절차 저장. README에 사용법 명시.
- **참고자료:** `references/` 에 URL, 논문 목록, 키워드 정리.

---

## 채워나가는 방식 (제안)

| 목표 | 어디에 | 어떻게 |
|------|--------|--------|
| 회사/제품 이해 | `wiki/en/company/`, `wiki/ko/company/` | config.inc, 블로그, 미션 문구 정리 |
| 도메인 기초 | `wiki/en/domains/` 등 | 개념 정의, 용어, 아키텍처 다이어그램(텍스트/마크다운) |
| 논문·기술 리뷰 | `wiki/en/research/` 등 | 한 줄 요약 + 핵심 포인트 + 링크 |
| 산업 동향 | `wiki/en/industry/` 등 | 분기별/월별 트렌드, 경쟁사, 뉴스 요약 |
| 일일 학습 | `study/{domain}/` | 자유 형식 노트 → 정리 후 wiki 반영 |
| 반복 업무 자동화 | `automation/scripts/` | 스크립트 + 사용법을 automation/README.md 에 |
| Wiki 웹 사이트 | `wiki-site/` | `npm run dev` / `npm run build`, [wiki-site/DEPLOY.md](wiki-site/DEPLOY.md) 로 GitHub Pages·Vercel 배포 |
| News (뉴스·논문) | `wiki-site/src/data/news.json` | 수동 편집 또는 automation 스크립트로 스크래핑·요약 후 갱신 |

---

## Wiki 웹 사이트 (온라인)

- **실행:** `cd wiki-site && npm install && npm run dev`
- **배포:** GitHub Pages 또는 Vercel 무료 플랜 — 자세한 절차는 [wiki-site/DEPLOY.md](wiki-site/DEPLOY.md) 참고.
- **News** 페이지: 뉴스·논문을 스크래핑·요약해 `wiki-site/src/data/news.json`을 갱신하면 사이트에 반영됩니다.

---

*마지막 업데이트: 2026-03-15*
