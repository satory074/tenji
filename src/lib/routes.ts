// URL とタブ・分類の対応表。事前描画 (scripts/prerender.mjs) とブラウザ側の両方がここを使う。
// 1 つのタブ / 一覧の 1 分類 = 1 URL。パスは base (既定 /tenji/) からの相対で、ディレクトリは末尾 /。

import type { Category } from '../data/braille';

export type Tab = 'lesson' | 'reference' | 'write' | 'read' | 'translate';

export interface Route {
  tab: Tab;
  /** 一覧タブのときだけ意味がある。他のタブでは常に DEFAULT_CATEGORY */
  category: Category;
}

export const DEFAULT_CATEGORY: Category = 'gojuon';

/** 一覧タブの分類ボタンの並び順 */
export const CATEGORY_ORDER: Category[] = [
  'gojuon',
  'dakuon',
  'handakuon',
  'youon',
  'youdakuon',
  'youhandakuon',
  'suuji',
  'eiji',
  'kigou',
];

export const LESSON_ROUTE: Route = { tab: 'lesson', category: DEFAULT_CATEGORY };

const TAB_PATHS: Record<Exclude<Tab, 'reference'>, string> = {
  lesson: '',
  write: 'write/',
  read: 'read/',
  translate: 'translate/',
};

/** base からの相対パス ('' | 'reference/' | 'reference/dakuon/' | 'write/' …) */
export function routePath(r: Route): string {
  if (r.tab === 'reference') {
    // 五十音は一覧タブの入口なので /reference/ そのもの
    return r.category === DEFAULT_CATEGORY ? 'reference/' : `reference/${r.category}/`;
  }
  return TAB_PATHS[r.tab];
}

/** 事前描画するページの全部 (13) */
export const ROUTES: Route[] = [
  LESSON_ROUTE,
  ...CATEGORY_ORDER.map((category): Route => ({ tab: 'reference', category })),
  { tab: 'write', category: DEFAULT_CATEGORY },
  { tab: 'read', category: DEFAULT_CATEGORY },
  { tab: 'translate', category: DEFAULT_CATEGORY },
];

// 項目が 3〜6 個しかない分類は、単独のページとしては中身が薄いので検索に出さない
// (noindex + サイトマップから外す)。一覧タブの中では今までどおり見られる。
const NOINDEX_CATEGORIES: ReadonlySet<Category> = new Set<Category>([
  'handakuon',
  'youhandakuon',
  'kigou',
]);

export function isIndexable(r: Route): boolean {
  return !(r.tab === 'reference' && NOINDEX_CATEGORIES.has(r.category));
}

export function sameRoute(a: Route, b: Route): boolean {
  return a.tab === b.tab && (a.tab !== 'reference' || a.category === b.category);
}

/** vite の base (既定 '/tenji/')。VITE_BASE で変わる */
export const BASE = import.meta.env.BASE_URL;

/** <a href> に入れるパス */
export function routeHref(r: Route): string {
  return BASE + routePath(r);
}

/** location.pathname → Route。知らないパスなら null */
export function routeFromPathname(pathname: string): Route | null {
  if (!pathname.startsWith(BASE)) return pathname + '/' === BASE ? LESSON_ROUTE : null;
  let rel = decodeURIComponent(pathname.slice(BASE.length)).replace(/index\.html$/, '');
  if (rel !== '' && !rel.endsWith('/')) rel += '/';
  return ROUTES.find((r) => routePath(r) === rel) ?? null;
}
