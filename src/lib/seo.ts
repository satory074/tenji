// ページごとの見出し・紹介文・<title>・meta description・JSON-LD を 1 か所で作る。
// 事前描画 (scripts/prerender.mjs が dist-ssr 経由で headTags を呼ぶ) と、
// ブラウザでタブを切り替えたときの document.title (applyHead) が同じ関数を使う。
// 画面に出す紹介文と meta description は同じ文から作る (画面に無いことを書かないため)。

import { ALL_ITEMS, CATEGORY_LABELS, type Category } from '../data/braille';
import { isIndexable, routePath, type Route } from './routes';

/** 公開 URL (末尾 /)。canonical・og:url・サイトマップの絶対 URL はここから作る。
 *  配信パスの VITE_BASE とは別。vite.config.ts の define で SITE_URL 環境変数から入る */
export const SITE_URL: string = __SITE_URL__;
export const SITE_NAME = '点字を学ぼう';
const SITE_ALT_NAME = 'Tenji Trainer';
const SITE_DESCRIPTION =
  '点字は6つの点の組み合わせで、ひらがな・数字・英字を表します。母音と子音の点、濁音・拗音の前に置く符号、数字・英字まで、日本語点字のしくみを図で順に学べる晴眼者向けの学習アプリです。';

const AUTHOR = {
  '@type': 'Person',
  '@id': 'https://satory074.com/#person',
  name: 'satory074',
  url: 'https://satory074.com/',
} as const;

const OG_IMAGE = SITE_URL + 'og-image.png';
const OG_IMAGE_ALT = '点字を学ぼう — Tenji Trainer';

export interface PageMeta {
  /** <title> */
  title: string;
  /** 画面の見出し (ルールのページは Lesson.tsx の h1 をそのまま使う) */
  heading: string;
  /** 画面の見出しの下に出す紹介文。ルールのページには無い */
  intro?: string;
  description: string;
}

const count = (c: Category) => ALL_ITEMS.filter((it) => it.category === c).length;

const CATEGORY_COPY: Record<Category, { heading?: string; qualifier: string; intro: string }> = {
  gojuon: {
    qualifier: `あ〜ん ${count('gojuon')}文字・点番号つき`,
    intro: `あ〜ん の${count('gojuon')}文字です。母音は①②④の3点の組み合わせで、子音は行ごとに決まった点（か行は⑥、さ行は⑤⑥、た行は③⑤ など）を足して作ります。や行・わ行・ん は例外の形です。`,
  },
  dakuon: {
    qualifier: `が・ざ・だ・ば行 ${count('dakuon')}文字`,
    intro: `が・ざ・だ・ば行の${count('dakuon')}文字です。清音（か・さ・た・は行）の前に濁音符（⑤）のマスを置き、2マスで表します。後ろのマスは清音と同じ形です。`,
  },
  handakuon: {
    qualifier: `ぱ行 ${count('handakuon')}文字`,
    intro: `ぱ・ぴ・ぷ・ぺ・ぽ の${count('handakuon')}文字です。は行の前に半濁音符（⑥）のマスを置き、2マスで表します。`,
  },
  youon: {
    qualifier: `きゃ・しゅ・ちょ など${count('youon')}文字`,
    intro: `きゃ・しゅ・ちょ のように小さい「ゃ・ゅ・ょ」が付く${count('youon')}文字です。拗音符（④）のマスの後に、イ段ではなく あ段・う段・お段 の文字を続けます（きゃ = ④ ＋ か）。`,
  },
  youdakuon: {
    qualifier: `ぎゃ・じゃ・ぢゃ・びゃ行 ${count('youdakuon')}文字`,
    intro: `ぎゃ・じゃ・ぢゃ・びゃ行の${count('youdakuon')}文字です。拗濁音符（④⑤）のマスの後に、あ段・う段・お段 の文字を続けます（ぎゃ = ④⑤ ＋ か）。`,
  },
  youhandakuon: {
    qualifier: 'ぴゃ・ぴゅ・ぴょ',
    intro: `ぴゃ・ぴゅ・ぴょ の${count('youhandakuon')}文字です。拗半濁音符（④⑥）のマスの後に、は・ふ・ほ の形を続けます（ぴゃ = ④⑥ ＋ は）。`,
  },
  suuji: {
    qualifier: '0〜9・数符',
    intro: `0〜9 の${count('suuji')}文字です。数符（③④⑤⑥）のマスの後に、英字 a〜j と同じ形を続けます（1 = a、0 = j）。数字が続くときは、数符は最初に1回だけ打ちます。`,
  },
  eiji: {
    heading: '英字（アルファベット）の点字一覧',
    qualifier: 'a〜z',
    intro: `a〜z の${count('eiji')}文字です。外字符（⑤⑥）のマスの後にアルファベットの形を続けます。a〜j は上の4点（①②④⑤）の組み合わせ、k〜t は a〜j に③を、u〜z は k〜t に⑥を足した形です（w は例外）。`,
  },
  kigou: {
    qualifier: '句読点・促音・長音',
    intro: `句点「。」・読点「、」・疑問符・感嘆符と、促音「っ」・長音「ー」の${count('kigou')}つです。促音と長音は前に置く符号ではなく、それ自体が1マスの文字です。`,
  },
};

const titleOf = (heading: string, qualifier?: string) =>
  `${heading}${qualifier ? `（${qualifier}）` : ''} | ${SITE_NAME}`;

const page = (heading: string, qualifier: string, intro: string): PageMeta => ({
  title: titleOf(heading, qualifier),
  heading,
  intro,
  description: intro,
});

export function pageMeta(r: Route): PageMeta {
  switch (r.tab) {
    case 'lesson':
      return {
        title: `${SITE_NAME} — ゼロから学ぶ日本語点字のルール`,
        heading: 'ゼロから学ぶ日本語点字のルール',
        description: SITE_DESCRIPTION,
      };
    case 'reference': {
      const { heading, qualifier, intro } = CATEGORY_COPY[r.category];
      return page(heading ?? `${CATEGORY_LABELS[r.category]}の点字一覧`, qualifier, intro);
    }
    case 'write':
      return page(
        '点字の書き取り練習',
        '文字 → 点を打つ',
        '出された文字を、6つの点をクリックして点字で打ちます。五十音・濁音・半濁音・拗音・数字・英字・記号からモードを選べます。答え合わせでは、まちがえたマスに正しい点字を表示します。',
      );
    case 'read':
      return page(
        '点字の読み取り練習',
        '点字 → 文字の4択',
        '表示された点字が表す文字を、4つの選択肢から選びます。五十音・濁音・半濁音・拗音・数字・英字・記号からモードを選べ、正解数をスコアで確かめられます。',
      );
    case 'translate':
      return page(
        '点訳（文章を点字に変換）',
        'ひらがな・カタカナ・数字・英字',
        'ひらがな・カタカナ・数字・英字・記号を入力すると、点字のマスの並びと、コピーできる点字の文字（Unicode）に変換します。漢字と分かち書き（語の間のマスあけ）には対応していません。',
      );
  }
}

/** そのページの絶対 URL (canonical = og:url) */
export function pageUrl(r: Route): string {
  return SITE_URL + routePath(r);
}

export function jsonLd(r: Route): Record<string, unknown> {
  const meta = pageMeta(r);
  if (r.tab === 'lesson') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      name: SITE_NAME,
      alternateName: SITE_ALT_NAME,
      url: SITE_URL,
      description: meta.description,
      inLanguage: 'ja',
      author: AUTHOR,
    };
  }
  const url = pageUrl(r);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    name: meta.heading,
    url,
    description: meta.description,
    inLanguage: 'ja',
    isPartOf: { '@id': `${SITE_URL}#website` },
    author: AUTHOR,
  };
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** 事前描画で index.html の <!--seo-head--> に入れる head の中身 */
export function headTags(r: Route): string {
  const meta = pageMeta(r);
  const url = pageUrl(r);
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    ...(isIndexable(r) ? [] : ['<meta name="robots" content="noindex" />']),
    `<link rel="canonical" href="${esc(url)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="ja_JP" />',
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:image" content="${esc(OG_IMAGE)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:type" content="image/png" />',
    `<meta property="og:image:alt" content="${esc(OG_IMAGE_ALT)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(OG_IMAGE)}" />`,
    // </script> で閉じられないように < をエスケープする
    `<script type="application/ld+json">${JSON.stringify(jsonLd(r)).replace(/</g, '\\u003c')}</script>`,
  ];
  return lines.join('\n    ');
}

/** ブラウザでページを切り替えたとき: タブのタイトルと、共有シートが使う canonical / og:url を合わせる */
export function applyHead(r: Route): void {
  document.title = pageMeta(r).title;
  const url = pageUrl(r);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
}
