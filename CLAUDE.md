# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173/tenji/ (SPA のまま。事前描画なし)
npm run build      # tsc -b → vite build (dist/) → vite build --ssr (dist-ssr/) → scripts/prerender.mjs
npm run seo-check  # dist/ を検査 (scripts/seo-check.mjs、deploy でも同じものが走る)
npm run typecheck  # tsc -b --noEmit (pure type check, faster)
npm run preview    # Serve dist/ locally
```

No test runner is configured. Type errors caught by `tsc -b` (strict mode + noUnusedLocals/Parameters) gate the build. The only invariant check is `scripts/seo-check.mjs` (copied verbatim from `basecamp/scripts/seo-check.mjs` — don't edit it here; re-copy from the original when it changes).

本番と同じパスで確かめるとき: 一時ディレクトリに `tenji/` を作って `dist/` の中身を置き、その親で `python3 -m http.server` → `curl http://127.0.0.1:8000/tenji/reference/eiji/` で JS なしの HTML に表が入っていること、ブラウザの console に React #418 (hydration) が出ないことを見る。

## Deployment

`main` branch push → `.github/workflows/deploy.yml` → GitHub Pages at `https://satory074.github.io/tenji/`. Pages source must be set to **GitHub Actions** in repo settings.

`vite.config.ts` reads `VITE_BASE` (default `/tenji/`). To deploy under a different repo name or custom domain, set `VITE_BASE=/newpath/` or `VITE_BASE=/`. Forgetting this breaks all asset URLs.

canonical・og:url・sitemap.xml の絶対 URL は **`SITE_URL`** (default `https://satory074.github.io/tenji/`, 末尾 `/` 必須) から作る (`vite.config.ts` の `define` → `__SITE_URL__` → `src/lib/seo.ts`)。`VITE_BASE` を変えたら `SITE_URL` も合わせること (別々の値なので片方だけ変えると canonical が食い違う)。deploy workflow はビルド直後に `seo-check` を走らせ、破ったら deploy しない。

## URL and prerendering (crawlable pages)

Each tab and each 一覧 category has its own URL (13 pages). The table is `src/lib/routes.ts` (`ROUTES`, `routePath`, `routeFromPathname`):

| URL (under `/tenji/`) | Page |
|---|---|
| `/` | ルール (Lesson) |
| `/reference/` | 一覧・五十音 |
| `/reference/{dakuon,handakuon,youon,youdakuon,youhandakuon,suuji,eiji,kigou}/` | 一覧・各分類 |
| `/write/` `/read/` `/translate/` | 書き取り・読み取り・点訳 |

- **noindex**: `handakuon` (5 文字)・`youhandakuon` (3)・`kigou` (6) は単独ページとしては薄いので `<meta name="robots" content="noindex">` を付けてサイトマップから外す (`NOINDEX_CATEGORIES` in `routes.ts`)。一覧タブの中では普通に見られる
- Tabs and category chips are real `<a href>` (`src/components/RouteLink.tsx`); plain clicks use `history.pushState`, `popstate` restores the route. No router library. `App` takes `initialTab` / `initialCategory`
- **Title / description / heading / intro / JSON-LD all come from `src/lib/seo.ts`** (`pageMeta`, `headTags`, `jsonLd`). The on-screen intro under each page heading and the meta description are the same string. `applyHead()` updates `document.title` + canonical + og:url on client navigation
- **Prerender** (`scripts/prerender.mjs`): uses `dist/index.html` as the template, fills `<!--seo-head-->` with `headTags()` and `<div id="root">` with `renderToString` from `dist-ssr/entry-server.js` (`src/entry-server.tsx`), writes `dist/<path>/index.html` and `dist/sitemap.xml` (indexable pages only). No 404.html (unknown URLs stay GitHub Pages' 404)
- `src/main.tsx` uses `hydrateRoot` only when the URL is a known route and `#root` has prerendered children; otherwise `createRoot` (e.g. `npm run dev`)
- JSON-LD: top = `WebSite` (`@id` `<SITE_URL>#website`), others = `WebPage` with `isPartOf` → that `@id`. `author` is always `{"@id":"https://satory074.com/#person"}` (defined on satory074.com)
- The reference page also renders a `<details>` table (文字 / Unicode 点字 / 点番号) so the dot numbers exist as text for screen readers and non-JS crawlers

### Hydration gotchas (actually hit)

- **No randomness or browser-only values in the first render.** `WriteDrill` / `ReadDrill` start with `null` and pick the first question in the `[mode]` effect; the server renders only the controls/instructions with invisible placeholders of the same size
- **`BrailleCell`'s root is a `<span>` (display `inline-grid`), not `<div>`.** Lesson §7 puts a cell inside `<p>`; a `<div>` there makes the HTML parser close the `<p>` early and React reports #418. Don't put block elements (`div`, `table`, `ul`…) inside `<p>` anywhere
- `entry-server.tsx` must stay under `src/` so `tsc -b` (tsconfig.app.json `include: ["src"]`) type-checks it

## Architecture: the `Mas[]` abstraction

Everything in this app revolves around one data shape, defined in `src/data/braille.ts`:

```ts
interface BrailleItem {
  display: string;   // "あ" | "が" | "きゃ" | "1" | "a"
  mas: Mas[];        // sequence of cells (each Dots = number[] of {1..6})
  category: Category;
  reading: string;
  row?: string;
}
```

A single character can require **multiple cells**:
- 五十音 (`あ`): 1 cell
- 濁音 (`が`): 2 cells = `[DAKUON_MARK, baseKanaCell]`
- 拗音 (`きゃ`): 2 cells = `[YOUON_MARK, kanaA-row-cell]` (uses **あ/う/お段**, not イ段 — see Lesson §6)
- 数字 (`1`): 2 cells = `[SUUJI_MARK, a-pattern]`
- 英字 (`a`): 2 cells = `[GAIJI_MARK, letter-pattern]`

The `WriteDrill` and `ReadDrill` components iterate `current.mas` and render one `BrailleCell` per mas. When adding a new character category, you must produce `BrailleItem`s with the right prefix sequence — never bake the prefix into the category list as a single concatenated cell.

## Data module structure

`src/data/braille.ts` is generator-based, not hand-listed:

- `V` (vowels) and `C` (consonant adders) are the primitives
- `GOJUON` is built by looping `ROWS` and applying `combo(vowel, consonant)`
- `DAKUON`/`HANDAKUON` look up the base kana in `GOJUON` and prepend `DAKUON_MARK`/`HANDAKUON_MARK`
- `YOUON`/`YOUDAKUON`/`YOUHANDAKUON` use `buildYouon(rows, prefix, category)` with `VOWELS_AUO = [a, u, o]`
- `SUUJI`, `EIJI` are simpler: array+map with their respective prefix
- `ALL_ITEMS` concatenates everything; `KANA_TO_ITEM` is a Map for translator lookup

If you change a vowel/consonant pattern, it propagates through every category that uses it. Tests are visual: rebuild and check the Reference tab. Item counts in page titles/intros are computed from the data (`count()` in `seo.ts`), but the intro sentences describe the rules in words — update them if a category's rule changes.

## Unicode rendering

`dotsToChar(dots)` maps `Dots` → Unicode Braille Patterns (U+2800–U+28FF). Bit `i` of the codepoint offset = dot `i+1` set. Only lower 6 bits used (Japanese braille is 6-dot, not 8-dot). The Translator tab outputs raw braille Unicode strings using this mapping.

## UI conventions

- All drill modes (`WriteDrill`, `ReadDrill`) share an identical `MODES` dictionary structure mapping label → `BrailleItem[]`. Adding a new category to one means duplicating the entry into the other for parity.
- `BrailleCell` is the only component that renders dots. Three modes: read-only, interactive (toggle dots), and highlighted (correct/incorrect feedback). Sizes: `xs` | `sm` | `md` | `lg`.
- `Lesson.tsx` is a long static tutorial component. Inline braille demos use `BrailleCell` directly with `showNumbers` prop.

## Tailwind v4

Uses the new v4 plugin-based setup (`@tailwindcss/vite` + `@import "tailwindcss"` in `index.css`). No `tailwind.config.js`, no `postcss.config.js`. Class API is unchanged from v3 but configuration patterns are different — don't reach for v3-era config files.

## Out of scope

- **漢字 (kanji)**: never supported. Real Japanese braille converts kanji to hiragana before encoding; the translator surfaces unsupported characters with a red "未対応" badge.
- **分かち書き (word-spacing)**: the translator preserves user-entered spaces verbatim. Automatic word boundary detection per『点訳のてびき 第4版』is intentionally not implemented.
- **Touch reading drills**: app targets sighted learners only.
