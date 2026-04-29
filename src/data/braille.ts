// 日本語点字データモジュール
// 出典: 日本点字委員会『日本点字表記法 2018年版』、日本点字図書館『点字のしくみ』
//
// 点番号:  1 4
//          2 5
//          3 6
//
// Unicode 点字パターン: U+2800 + (bit0=点1, bit1=点2, ..., bit5=点6)

export type Dots = readonly number[];
export type Mas = Dots;

export type Category =
  | 'gojuon'
  | 'dakuon'
  | 'handakuon'
  | 'youon'
  | 'youdakuon'
  | 'youhandakuon'
  | 'kigou'
  | 'suuji'
  | 'eiji';

export interface BrailleItem {
  display: string;
  reading: string;
  mas: Mas[];
  category: Category;
  row?: string;
}

// ────── ヘルパ ──────

export function dotsToBits(dots: Dots): number {
  let b = 0;
  for (const d of dots) b |= 1 << (d - 1);
  return b;
}

export function dotsToChar(dots: Dots): string {
  return String.fromCodePoint(0x2800 + dotsToBits(dots));
}

export function masToString(mas: Mas[]): string {
  return mas.map(dotsToChar).join('');
}

export function dotsEqual(a: Dots, b: Dots): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y).join(',');
  const sb = [...b].sort((x, y) => x - y).join(',');
  return sa === sb;
}

export function masEqual(a: Mas[], b: Mas[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((m, i) => dotsEqual(m, b[i]));
}

function combo(...sets: Dots[]): Dots {
  const s = new Set<number>();
  for (const arr of sets) for (const d of arr) s.add(d);
  return [...s].sort((x, y) => x - y);
}

// ────── 制御符号 ──────

export const DAKUON_MARK: Dots = [5];
export const HANDAKUON_MARK: Dots = [6];
export const YOUON_MARK: Dots = [4];
export const YOUDAKUON_MARK: Dots = [4, 5];
export const YOUHANDAKUON_MARK: Dots = [4, 6];
export const SUUJI_MARK: Dots = [3, 4, 5, 6];
export const GAIJI_MARK: Dots = [5, 6];
export const CAPITAL_MARK: Dots = [6];

// ────── 母音・子音 ──────

const V = {
  a: [1] as Dots,
  i: [1, 2] as Dots,
  u: [1, 4] as Dots,
  e: [1, 2, 4] as Dots,
  o: [2, 4] as Dots,
};

const C = {
  k: [6] as Dots,
  s: [5, 6] as Dots,
  t: [3, 5] as Dots,
  n: [3] as Dots,
  h: [3, 6] as Dots,
  m: [3, 5, 6] as Dots,
  r: [5] as Dots,
};

// ────── 五十音 ──────

const ROWS: Array<{ row: string; cons: keyof typeof C | ''; kana: [string, string, string, string, string] }> = [
  { row: 'あ行', cons: '', kana: ['あ', 'い', 'う', 'え', 'お'] },
  { row: 'か行', cons: 'k', kana: ['か', 'き', 'く', 'け', 'こ'] },
  { row: 'さ行', cons: 's', kana: ['さ', 'し', 'す', 'せ', 'そ'] },
  { row: 'た行', cons: 't', kana: ['た', 'ち', 'つ', 'て', 'と'] },
  { row: 'な行', cons: 'n', kana: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { row: 'は行', cons: 'h', kana: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { row: 'ま行', cons: 'm', kana: ['ま', 'み', 'む', 'め', 'も'] },
  { row: 'ら行', cons: 'r', kana: ['ら', 'り', 'る', 'れ', 'ろ'] },
];

const VOWELS_ORDER: Dots[] = [V.a, V.i, V.u, V.e, V.o];
const VOWEL_NAMES = ['a', 'i', 'u', 'e', 'o'];

export const GOJUON: BrailleItem[] = (() => {
  const items: BrailleItem[] = [];
  for (const r of ROWS) {
    r.kana.forEach((k, i) => {
      const dots = r.cons ? combo(VOWELS_ORDER[i], C[r.cons]) : VOWELS_ORDER[i];
      items.push({
        display: k,
        reading: (r.cons || '') + VOWEL_NAMES[i],
        mas: [dots],
        category: 'gojuon',
        row: r.row,
      });
    });
  }
  // や行
  items.push({ display: 'や', reading: 'ya', mas: [[3, 4]], category: 'gojuon', row: 'や行' });
  items.push({ display: 'ゆ', reading: 'yu', mas: [[3, 4, 6]], category: 'gojuon', row: 'や行' });
  items.push({ display: 'よ', reading: 'yo', mas: [[3, 4, 5]], category: 'gojuon', row: 'や行' });
  // わ行
  items.push({ display: 'わ', reading: 'wa', mas: [[3]], category: 'gojuon', row: 'わ行' });
  items.push({ display: 'を', reading: 'wo', mas: [[3, 5]], category: 'gojuon', row: 'わ行' });
  items.push({ display: 'ん', reading: 'n', mas: [[3, 5, 6]], category: 'gojuon', row: 'ん' });
  return items;
})();

// ────── 濁音・半濁音 ──────

const VOICED_PAIRS: Array<[string, string, keyof typeof C]> = [
  ['か', 'が', 'k'], ['き', 'ぎ', 'k'], ['く', 'ぐ', 'k'], ['け', 'げ', 'k'], ['こ', 'ご', 'k'],
  ['さ', 'ざ', 's'], ['し', 'じ', 's'], ['す', 'ず', 's'], ['せ', 'ぜ', 's'], ['そ', 'ぞ', 's'],
  ['た', 'だ', 't'], ['ち', 'ぢ', 't'], ['つ', 'づ', 't'], ['て', 'で', 't'], ['と', 'ど', 't'],
  ['は', 'ば', 'h'], ['ひ', 'び', 'h'], ['ふ', 'ぶ', 'h'], ['へ', 'べ', 'h'], ['ほ', 'ぼ', 'h'],
];

export const DAKUON: BrailleItem[] = VOICED_PAIRS.map(([base, voiced, cons]) => {
  const baseItem = GOJUON.find((g) => g.display === base)!;
  return {
    display: voiced,
    reading: 'd-' + base,
    mas: [DAKUON_MARK, baseItem.mas[0]],
    category: 'dakuon',
    row: cons + '行(濁)',
  };
});

const SEMI_PAIRS: Array<[string, string]> = [
  ['は', 'ぱ'], ['ひ', 'ぴ'], ['ふ', 'ぷ'], ['へ', 'ぺ'], ['ほ', 'ぽ'],
];

export const HANDAKUON: BrailleItem[] = SEMI_PAIRS.map(([base, semi]) => {
  const baseItem = GOJUON.find((g) => g.display === base)!;
  return {
    display: semi,
    reading: 'p-' + base,
    mas: [HANDAKUON_MARK, baseItem.mas[0]],
    category: 'handakuon',
    row: 'は行(半濁)',
  };
});

// ────── 拗音 ──────
// 拗音マーク [4] + 子音の あ段/う段/お段 → ゃ/ゅ/ょ

interface YouonRow {
  cons: keyof typeof C;
  display: [string, string, string]; // [Cya, Cyu, Cyo]
  row: string;
}

const YOUON_ROWS: YouonRow[] = [
  { cons: 'k', display: ['きゃ', 'きゅ', 'きょ'], row: 'き行(拗)' },
  { cons: 's', display: ['しゃ', 'しゅ', 'しょ'], row: 'し行(拗)' },
  { cons: 't', display: ['ちゃ', 'ちゅ', 'ちょ'], row: 'ち行(拗)' },
  { cons: 'n', display: ['にゃ', 'にゅ', 'にょ'], row: 'に行(拗)' },
  { cons: 'h', display: ['ひゃ', 'ひゅ', 'ひょ'], row: 'ひ行(拗)' },
  { cons: 'm', display: ['みゃ', 'みゅ', 'みょ'], row: 'み行(拗)' },
  { cons: 'r', display: ['りゃ', 'りゅ', 'りょ'], row: 'り行(拗)' },
];

const YOUDAKUON_ROWS: YouonRow[] = [
  { cons: 'k', display: ['ぎゃ', 'ぎゅ', 'ぎょ'], row: 'ぎ行(拗濁)' },
  { cons: 's', display: ['じゃ', 'じゅ', 'じょ'], row: 'じ行(拗濁)' },
  { cons: 't', display: ['ぢゃ', 'ぢゅ', 'ぢょ'], row: 'ぢ行(拗濁)' },
  { cons: 'h', display: ['びゃ', 'びゅ', 'びょ'], row: 'び行(拗濁)' },
];

const YOUHANDAKUON_ROWS: YouonRow[] = [
  { cons: 'h', display: ['ぴゃ', 'ぴゅ', 'ぴょ'], row: 'ぴ行(拗半濁)' },
];

const VOWELS_AUO: Dots[] = [V.a, V.u, V.o];
const VOWEL_AUO_NAMES = ['ya', 'yu', 'yo'];

function buildYouon(rows: YouonRow[], prefix: Dots, cat: Category): BrailleItem[] {
  const out: BrailleItem[] = [];
  for (const r of rows) {
    const cd = C[r.cons];
    r.display.forEach((kana, i) => {
      const base = combo(VOWELS_AUO[i], cd);
      out.push({
        display: kana,
        reading: r.cons + VOWEL_AUO_NAMES[i],
        mas: [prefix, base],
        category: cat,
        row: r.row,
      });
    });
  }
  return out;
}

export const YOUON: BrailleItem[] = buildYouon(YOUON_ROWS, YOUON_MARK, 'youon');
export const YOUDAKUON: BrailleItem[] = buildYouon(YOUDAKUON_ROWS, YOUDAKUON_MARK, 'youdakuon');
export const YOUHANDAKUON: BrailleItem[] = buildYouon(YOUHANDAKUON_ROWS, YOUHANDAKUON_MARK, 'youhandakuon');

// ────── 記号 ──────

export const KIGOU: BrailleItem[] = [
  { display: '。', reading: '句点', mas: [[2, 5, 6]], category: 'kigou' },
  { display: '、', reading: '読点', mas: [[5, 6]], category: 'kigou' },
  { display: '？', reading: '疑問符', mas: [[2, 3, 6]], category: 'kigou' },
  { display: '！', reading: '感嘆符', mas: [[2, 3, 5]], category: 'kigou' },
  { display: 'っ', reading: '促音', mas: [[2]], category: 'kigou' },
  { display: 'ー', reading: '長音', mas: [[2, 5]], category: 'kigou' },
];

// ────── 数字 ──────
// 数符 [3,4,5,6] + a-j パターン

const DIGIT_BASES: Dots[] = [
  [2, 4, 5],     // 0 = j
  [1],           // 1 = a
  [1, 2],        // 2 = b
  [1, 4],        // 3 = c
  [1, 4, 5],     // 4 = d
  [1, 5],        // 5 = e
  [1, 2, 4],     // 6 = f
  [1, 2, 4, 5],  // 7 = g
  [1, 2, 5],     // 8 = h
  [2, 4],        // 9 = i
];

export const SUUJI: BrailleItem[] = DIGIT_BASES.map((dots, n) => ({
  display: String(n),
  reading: 'digit-' + n,
  mas: [SUUJI_MARK, dots],
  category: 'suuji',
}));

// ────── 英字 ──────
// 外字符 [5,6] + a-z パターン

const LETTER_DOTS: Record<string, Dots> = {
  a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5],
  f: [1, 2, 4], g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5],
  k: [1, 3], l: [1, 2, 3], m: [1, 3, 4], n: [1, 3, 4, 5], o: [1, 3, 5],
  p: [1, 2, 3, 4], q: [1, 2, 3, 4, 5], r: [1, 2, 3, 5], s: [2, 3, 4], t: [2, 3, 4, 5],
  u: [1, 3, 6], v: [1, 2, 3, 6], w: [2, 4, 5, 6], x: [1, 3, 4, 6], y: [1, 3, 4, 5, 6], z: [1, 3, 5, 6],
};

export const EIJI: BrailleItem[] = Object.entries(LETTER_DOTS).map(([letter, dots]) => ({
  display: letter,
  reading: 'letter-' + letter,
  mas: [GAIJI_MARK, dots],
  category: 'eiji',
}));

// ────── 全件 ──────

export const ALL_ITEMS: BrailleItem[] = [
  ...GOJUON,
  ...DAKUON,
  ...HANDAKUON,
  ...YOUON,
  ...YOUDAKUON,
  ...YOUHANDAKUON,
  ...KIGOU,
  ...SUUJI,
  ...EIJI,
];

export const CATEGORY_LABELS: Record<Category, string> = {
  gojuon: '五十音',
  dakuon: '濁音',
  handakuon: '半濁音',
  youon: '拗音',
  youdakuon: '拗濁音',
  youhandakuon: '拗半濁音',
  kigou: '記号',
  suuji: '数字',
  eiji: '英字',
};

// ────── 点訳ユーティリティ ──────
// ひらがな入力を点字パターンの並びに変換する（簡易・分かち書きはユーザー任せ）

const KANA_TO_ITEM: Map<string, BrailleItem> = (() => {
  const m = new Map<string, BrailleItem>();
  for (const it of ALL_ITEMS) m.set(it.display, it);
  return m;
})();

// カタカナ→ひらがな
function kataToHira(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60),
  );
}

// 拗音検出: き/し/ち/に/ひ/み/り/ぎ/じ/ぢ/び/ぴ + ゃ/ゅ/ょ
const YOUON_HEAD = new Set(['き', 'し', 'ち', 'に', 'ひ', 'み', 'り', 'ぎ', 'じ', 'ぢ', 'び', 'ぴ']);
const YOUON_TAIL: Record<string, 'ya' | 'yu' | 'yo'> = { 'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo' };
const YOUON_DISPLAY: Record<string, Record<string, string>> = {
  'き': { ya: 'きゃ', yu: 'きゅ', yo: 'きょ' },
  'し': { ya: 'しゃ', yu: 'しゅ', yo: 'しょ' },
  'ち': { ya: 'ちゃ', yu: 'ちゅ', yo: 'ちょ' },
  'に': { ya: 'にゃ', yu: 'にゅ', yo: 'にょ' },
  'ひ': { ya: 'ひゃ', yu: 'ひゅ', yo: 'ひょ' },
  'み': { ya: 'みゃ', yu: 'みゅ', yo: 'みょ' },
  'り': { ya: 'りゃ', yu: 'りゅ', yo: 'りょ' },
  'ぎ': { ya: 'ぎゃ', yu: 'ぎゅ', yo: 'ぎょ' },
  'じ': { ya: 'じゃ', yu: 'じゅ', yo: 'じょ' },
  'ぢ': { ya: 'ぢゃ', yu: 'ぢゅ', yo: 'ぢょ' },
  'び': { ya: 'びゃ', yu: 'びゅ', yo: 'びょ' },
  'ぴ': { ya: 'ぴゃ', yu: 'ぴゅ', yo: 'ぴょ' },
};

export interface TranslationToken {
  source: string;
  mas: Mas[] | null; // null = 未対応
}

export function translate(input: string): TranslationToken[] {
  const out: TranslationToken[] = [];
  const text = kataToHira(input);
  let i = 0;
  let inDigit = false;
  while (i < text.length) {
    const c = text[i];
    // 拗音
    if (i + 1 < text.length && YOUON_HEAD.has(c) && YOUON_TAIL[text[i + 1]]) {
      const tail = YOUON_TAIL[text[i + 1]];
      const disp = YOUON_DISPLAY[c][tail];
      const it = KANA_TO_ITEM.get(disp);
      if (it) {
        inDigit = false;
        out.push({ source: c + text[i + 1], mas: [...it.mas] });
        i += 2;
        continue;
      }
    }
    // 数字（連続する数字は数符を1回だけ）
    if (/[0-9]/.test(c)) {
      const it = KANA_TO_ITEM.get(c);
      if (it) {
        if (inDigit) {
          out.push({ source: c, mas: [it.mas[1]] });
        } else {
          out.push({ source: c, mas: [...it.mas] });
          inDigit = true;
        }
        i += 1;
        continue;
      }
    } else {
      inDigit = false;
    }
    // 英字（小文字のみ簡易対応）
    if (/[a-z]/.test(c)) {
      const it = KANA_TO_ITEM.get(c);
      if (it) {
        out.push({ source: c, mas: [...it.mas] });
        i += 1;
        continue;
      }
    }
    if (/[A-Z]/.test(c)) {
      const lower = c.toLowerCase();
      const it = KANA_TO_ITEM.get(lower);
      if (it) {
        out.push({
          source: c,
          mas: [GAIJI_MARK, CAPITAL_MARK, it.mas[1]],
        });
        i += 1;
        continue;
      }
    }
    // スペース
    if (c === ' ' || c === '　') {
      out.push({ source: c, mas: [[]] });
      i += 1;
      continue;
    }
    // 通常
    const it = KANA_TO_ITEM.get(c);
    if (it) {
      out.push({ source: c, mas: [...it.mas] });
    } else {
      out.push({ source: c, mas: null });
    }
    i += 1;
  }
  return out;
}
