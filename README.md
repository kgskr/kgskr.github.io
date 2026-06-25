# 기록실 — Astro 블로그

미니멀·텍스트 중심의 개발 블로그입니다. 마크다운으로 글을 쓰고, GitHub Pages에 자동 배포됩니다.

- 라이트/다크 테마 토글 (시스템 설정 따름 · 선택값 저장 · 깜빡임 없음)
- 마크다운 콘텐츠 컬렉션 + 코드 하이라이팅(라이트/다크 동시 지원)
- 홈(글 목록) · 글 상세(이전/다음 글) · 소개 페이지

## 빠른 시작

```bash
npm install
npm run dev      # http://localhost:4321
```

| 명령어             | 동작                                  |
| ------------------ | ------------------------------------- |
| `npm run dev`      | 개발 서버 실행                        |
| `npm run build`    | `./dist` 로 정적 빌드                 |
| `npm run preview`  | 빌드 결과 로컬 미리보기               |

## 글 쓰기

`src/content/blog/` 에 `.md` 파일을 추가하면 끝입니다. 파일 이름이 곧 URL(slug)이 됩니다.

```markdown
---
title: '글 제목'
description: '목록과 메타 설명에 쓰이는 한 줄 요약'
pubDate: 2026-06-18
tags: ['React', 'TypeScript']
readingTime: '8분'
draft: false # true면 빌드에서 제외
---

본문은 여기서부터. 첫 문단은 자동으로 조금 크게(리드 문단) 표시됩니다.
```

스키마는 `src/content.config.ts` 에서 검증합니다. 필드를 추가하려면 이 파일을 수정하세요.

## 배포 (GitHub Pages)

1. 이 폴더의 내용을 GitHub 저장소에 push 합니다.
2. `astro.config.mjs` 를 본인 환경에 맞게 수정합니다.
   - **사용자/조직 페이지** (`kgskr.github.io` 저장소): `site` 는 `https://kgskr.github.io` 로 두고 `base` 는 그대로 둡니다.
   - **프로젝트 페이지** (`your-username.github.io/저장소이름`): `site` 를 바꾸고 `base: '/저장소이름'` 주석을 해제합니다.
3. 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 설정합니다.
4. `main` 브랜치에 push 하면 `.github/workflows/deploy.yml` 가 자동으로 빌드·배포합니다.

## 커스터마이즈

- **색·타이포·간격**: `src/styles/global.css` 상단의 `--bg`, `--ink`, `--accent` 등 토큰을 바꾸면 전체에 반영됩니다. (강조색 기본값: 인디고 `#4f46e5`)
- **블로그 이름/푸터**: `src/components/Header.astro`, `Footer.astro`
- **소개 페이지**: `src/pages/about.astro`
- **폰트**: 본문 Pretendard, 코드 JetBrains Mono — `src/layouts/BaseLayout.astro` 에서 로드합니다.

## 구조

```
src/
├─ components/   Header · Footer · ThemeToggle · PostCard
├─ content/blog/ 마크다운 글
├─ layouts/      BaseLayout.astro
├─ pages/        index.astro · about.astro · blog/[...slug].astro
├─ styles/       global.css
├─ utils/        format.ts (날짜 포맷)
└─ content.config.ts  콘텐츠 컬렉션 스키마
```
