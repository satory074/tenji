# 点字を学ぼう - Tenji Trainer

晴眼者向けの点字学習Webアプリ。React + TypeScript + Vite + Tailwind v4。

## 機能

- **一覧（Reference）**: 五十音・濁音・半濁音・拗音・拗濁音・拗半濁音・数字・英字・記号を点番号付きで表示
- **書き取り（Write Drill）**: 出題された文字を6点クリックで打つ練習
- **読み取り（Read Drill）**: 表示された点字パターンに対応する文字を4択で選ぶ
- **点訳（Translator）**: ひらがな/カタカナ/数字/英字を点字Unicode文字に変換

データ準拠: 日本点字委員会『日本点字表記法 2018年版』、文部科学省『点字学習指導の手引（令和5年改訂）』。

## ローカル開発

```bash
npm install
npm run dev      # http://localhost:5173/tenji/
npm run build    # dist/ に静的ファイルを生成
npm run preview
```

## GitHub Pages へのデプロイ

### 1. リポジトリ作成

このディレクトリを `tenji` という名前のGitHubリポジトリとして公開する。
（リポジトリ名を変える場合は `vite.config.ts` の `base` を `/<repo-name>/` に変更する）

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<your-username>/tenji.git
git push -u origin main
```

### 2. GitHub Pages を有効化

1. リポジトリの **Settings → Pages** を開く
2. **Source** を **GitHub Actions** に設定

これだけで `.github/workflows/deploy.yml` が `main` ブランチへのpush時に自動的にビルド＆デプロイする。

公開URL: `https://<your-username>.github.io/tenji/`

### カスタムドメインを使う場合

`vite.config.ts` の base を上書き:

```bash
VITE_BASE=/ npm run build
```

または `vite.config.ts` の `base` 既定値を `'/'` に変更。

## ディレクトリ構成

```
src/
├── App.tsx                 # タブナビゲーション
├── main.tsx
├── index.css               # Tailwind import
├── data/
│   └── braille.ts          # 点字データ（五十音〜記号）+ 点訳ロジック
└── components/
    ├── BrailleCell.tsx     # 6点表示コンポーネント（インタラクティブ可）
    ├── Reference.tsx       # 一覧
    ├── WriteDrill.tsx      # 書き取りドリル
    ├── ReadDrill.tsx       # 読み取りドリル
    └── Translator.tsx      # 点訳ツール
```

## 制限事項

- 漢字には対応しません（実際の点訳でも漢字は読み（ひらがな）に変換します）
- **分かち書き**は自動推定しません。点訳ツールはユーザー入力のスペースをそのまま反映します。本格的な点訳には『点訳のてびき 第4版』『点字表記辞典 第7版』に基づく分かち書き判定が必要です
- 触読練習は含みません（晴眼者の視覚学習が対象）
