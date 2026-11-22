#!/usr/bin/env node
// 事前描画: vite build (dist/) と vite build --ssr (dist-ssr/) の後に走る。npm run build の最後の段。
// dist/index.html を型紙にして、ページ (src/lib/routes.ts の ROUTES) ごとに
//   - <!--seo-head--> に title・description・canonical・OGP・JSON-LD (src/lib/seo.ts の headTags)
//   - <div id="root"></div> の中に React で描いた本文
// を入れ、dist/<パス>/index.html に書く。最後に検索に出すページだけの sitemap.xml を書く。
// JS を実行しないクローラー (GPTBot / ClaudeBot など) にも本文と点字の表が読めるようにするため。

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const { ROUTES, SITE_URL, headTags, isIndexable, pageUrl, render, routePath } = await import(
  pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href
);

const HEAD_MARK = '<!--seo-head-->';
const ROOT_MARK = '<div id="root"></div>';
const template = readFileSync(join(distDir, 'index.html'), 'utf8');
for (const mark of [HEAD_MARK, ROOT_MARK]) {
  if (template.split(mark).length !== 2) throw new Error(`dist/index.html に ${mark} がちょうど 1 つではない`);
}

// String.prototype.replace の置換文字列は $& などを解釈するので、split/join で差し込む
const fill = (html, mark, value) => html.split(mark).join(value);

for (const route of ROUTES) {
  const html = fill(fill(template, HEAD_MARK, headTags(route)), ROOT_MARK, `<div id="root">${render(route)}</div>`);
  const out = join(distDir, routePath(route), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`prerender: ${routePath(route) || '(top)'}${isIndexable(route) ? '' : ' [noindex]'}`);
}

const urls = ROUTES.filter(isIndexable).map((r) => `  <url><loc>${pageUrl(r)}</loc></url>`);
writeFileSync(
  join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
);
console.log(`prerender: ${ROUTES.length} ページ、sitemap.xml に ${urls.length} 件 (${SITE_URL}sitemap.xml)`);
