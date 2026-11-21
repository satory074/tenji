// 事前描画用の入口。`vite build --ssr src/entry-server.tsx --outDir dist-ssr` でビルドし、
// scripts/prerender.mjs が import して各ページの HTML を書き出す。ブラウザ側の入口は main.tsx。
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { ROUTES, isIndexable, routePath, type Route } from './lib/routes';
import { SITE_URL, headTags, pageUrl } from './lib/seo';

export { ROUTES, SITE_URL, headTags, isIndexable, pageUrl, routePath };

/** main.tsx と同じ木を描く (違うと hydration が食い違う) */
export function render(r: Route): string {
  return renderToString(
    <StrictMode>
      <App initialTab={r.tab} initialCategory={r.category} />
    </StrictMode>,
  );
}
