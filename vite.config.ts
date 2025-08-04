import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

type DeploymentStage = 'alpha' | 'prod';

const title: Record<DeploymentStage, string> = {
  alpha: '[Alpha] 숭실대 시간표 추천 서비스, 숭피티',
  prod: '숭실대 시간표 추천 서비스, 숭피티',
};

const url: Record<DeploymentStage, string> = {
  alpha: 'https://soongpt-alpha.yourssu.com',
  prod: 'https://soongpt.yourssu.com',
};

const og: Record<DeploymentStage, { image: string; title: string; url: string }> = {
  alpha: {
    image: `${url.alpha}/og-image.png`,
    title: title.alpha,
    url: url.alpha,
  },
  prod: {
    image: `${url.prod}/og-image.png`,
    title: title.prod,
    url: url.prod,
  },
};

const getOpenGraph = (stage: DeploymentStage) => `
    <meta property="og:title" content="${og[stage].title}" />
    <meta property="og:description" content="클릭 몇 번으로 최적의 시간표 완성!" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${og[stage].url}" />
    <meta property="og:image" content="${og[stage].image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
`;

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const getStage = (): DeploymentStage => {
    const viteEnv = loadEnv(mode, process.cwd(), 'VITE_');
    const stage = viteEnv.VITE_STAGE;
    if (!stage) {
      console.warn('환경변수에 stage가 없어요. 기본값으로 프로덕션을 사용해요.');
      return 'prod';
    }
    if (stage !== 'alpha' && stage !== 'prod') {
      console.warn('환경변수에 stage가 잘못됐어요. 기본값으로 프로덕션을 사용해요.');
      return 'prod';
    }
    return stage;
  };

  const stage = getStage();

  return {
    plugins: [
      tsconfigPaths(),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tailwindcss(),
      sentryVitePlugin({
        org: 'yourssu-web',
        project: 'soongpt-web',
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: title[stage],
            injectOpenGraph: getOpenGraph(stage),
          },
        },
      }),
    ],

    build: {
      sourcemap: true,
    },
  };
});
