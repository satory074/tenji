import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pagesでリポジトリ名がパスに入るため base を設定する。
// 環境変数 VITE_BASE で上書き可能（カスタムドメイン利用時は '/' に）。
const base = process.env.VITE_BASE ?? '/tenji/';

// canonical・og:url・サイトマップに書く公開 URL。配信パス (VITE_BASE) とは別に持つ。
// VITE_BASE を変えて別の場所に置くときは、SITE_URL もその公開 URL に合わせる。
const siteUrl = process.env.SITE_URL ?? 'https://satory074.github.io/tenji/';
if (!siteUrl.endsWith('/')) throw new Error(`SITE_URL は末尾を / にしてください: ${siteUrl}`);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
  define: {
    __SITE_URL__: JSON.stringify(siteUrl),
  },
});
