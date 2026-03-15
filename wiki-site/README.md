# Config Wiki — 웹 사이트

`wiki/` 폴더 내용을 메뉴로 정리한 **온라인 Wiki** + **News** 페이지입니다.

- **Wiki**: Company, Domains, Research, Industry (마크다운 → 자동 메뉴)
- **News**: `src/data/news.json` 기반 — 스크래핑·요약 스크립트로 갱신 가능

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:4321` (base가 `/Config`면 `http://localhost:4321/Config`).

## 빌드

```bash
npm run build
```

출력: `dist/`

## 배포

- **GitHub Pages** / **Vercel**: [DEPLOY.md](./DEPLOY.md) 참고.
- GitHub Pages 사용 시 저장소 **Settings → Pages → Source: GitHub Actions** 선택 후 푸시하면 자동 배포됩니다.

## 콘텐츠 소스

- Wiki 문서: **상위 폴더의 `wiki/`** — 빌드 시 `scripts/copy-wiki.js`가 `src/content/wiki/`로 복사합니다. 원본은 항상 `wiki/`만 수정하세요.
- News: `src/data/news.json` — 수동 편집 또는 `automation/scripts/`의 스크립트로 갱신.
