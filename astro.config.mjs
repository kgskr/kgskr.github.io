import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://kgskr.github.io',

  // ▼ 프로젝트 페이지(예: username.github.io/repository)로 배포할 때만 주석을 해제하고
  //   저장소 이름을 적으세요. 사용자/조직 페이지(username.github.io)면 그대로 두면 됩니다.
  // base: '/repository',

  markdown: {
    shikiConfig: {
      // 라이트/다크 두 테마를 동시에 출력하고 CSS로 전환합니다 (global.css 참고).
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
