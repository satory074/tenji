# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173/tenji/
npm run build      # tsc -b && vite build → dist/
npm run typecheck  # tsc -b --noEmit (pure type check, faster)
npm run preview    # Serve dist/ locally
```

No test runner is configured. Type errors caught by `tsc -b` (strict mode + noUnusedLocals/Parameters) gate the build.

## Deployment

`main` branch push → `.github/workflows/deploy.yml` → GitHub Pages at `https://satory074.github.io/tenji/`. Pages source must be set to **GitHub Actions** in repo settings.

`vite.config.ts` reads `VITE_BASE` (default `/tenji/`). To deploy under a different repo name or custom domain, set `VITE_BASE=/newpath/` or `VITE_BASE=/`. Forgetting this breaks all asset URLs.

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

If you change a vowel/consonant pattern, it propagates through every category that uses it. Tests are visual: rebuild and check the Reference tab.

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
