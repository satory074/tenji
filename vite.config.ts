import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pagesでリポジトリ名がパスに入るため base を設定する。
// 環境変数 VITE_BASE で上書き可能（カスタムドメイン利用時は '/' に）。
const base = process.env.VITE_BASE ?? '/tenji/';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
});
