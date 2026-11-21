import { useCallback, useEffect, useState } from 'react';
import type { Category } from './data/braille';
import { Lesson } from './components/Lesson';
import { Reference } from './components/Reference';
import { WriteDrill } from './components/WriteDrill';
import { ReadDrill } from './components/ReadDrill';
import { Translator } from './components/Translator';
import { RouteLink } from './components/RouteLink';
import {
  DEFAULT_CATEGORY,
  LESSON_ROUTE,
  routeFromPathname,
  routeHref,
  type Route,
  type Tab,
} from './lib/routes';
import { applyHead, pageMeta } from './lib/seo';

const TABS: Array<{ id: Tab; label: string; sub: string }> = [
  { id: 'lesson', label: 'ルール', sub: 'ゼロから学ぶ' },
  { id: 'reference', label: '一覧', sub: '点字を見て覚える' },
  { id: 'write', label: '書き取り', sub: '文字 → 点を打つ' },
  { id: 'read', label: '読み取り', sub: '点字 → 文字を選ぶ' },
  { id: 'translate', label: '点訳', sub: '文章 → 点字に変換' },
];

// タブと一覧の分類は URL で決まる (src/lib/routes.ts)。最初の値は URL から渡され、
// 事前描画 (src/entry-server.tsx) とブラウザで同じ HTML になる。
export default function App({
  initialTab = 'lesson',
  initialCategory = DEFAULT_CATEGORY,
}: {
  initialTab?: Tab;
  initialCategory?: Category;
}) {
  const [route, setRoute] = useState<Route>({ tab: initialTab, category: initialCategory });
  const tab = route.tab;
  const meta = pageMeta(route);

  const navigate = useCallback((next: Route) => {
    const href = routeHref(next);
    if (location.pathname !== href) history.pushState(null, '', href);
    setRoute(next);
  }, []);

  // ブラウザの戻る・進む
  useEffect(() => {
    const onPop = () => setRoute(routeFromPathname(location.pathname) ?? LESSON_ROUTE);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    applyHead(route);
  }, [route]);

  return (
    <div className="min-h-screen flex flex-col pb-[calc(48px+env(safe-area-inset-bottom))]">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-baseline gap-2">
            点字を学ぼう
            <span className="text-xs font-normal text-slate-500">Tenji Trainer</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            晴眼者向け・視覚で点字を学ぶ練習アプリ
          </p>
        </div>
      </header>

      <nav aria-label="メニュー" className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 flex overflow-x-auto">
          {TABS.map((t) => (
            <RouteLink
              key={t.id}
              to={{ tab: t.id, category: DEFAULT_CATEGORY }}
              current={tab === t.id}
              onNavigate={navigate}
              className={`flex-shrink-0 px-4 py-3 text-center text-sm font-medium border-b-2 transition ${
                tab === t.id
                  ? 'border-amber-500 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div>{t.label}</div>
              <div className="text-[10px] font-normal text-slate-400">{t.sub}</div>
            </RouteLink>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {/* ルールのページは Lesson.tsx が自分の h1 と導入文を持つ */}
        {meta.intro && (
          <div className="mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">{meta.heading}</h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600 leading-relaxed">{meta.intro}</p>
          </div>
        )}
        {tab === 'lesson' && <Lesson />}
        {tab === 'reference' && <Reference category={route.category} onNavigate={navigate} />}
        {tab === 'write' && <WriteDrill />}
        {tab === 'read' && <ReadDrill />}
        {tab === 'translate' && <Translator />}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-slate-500 space-y-1">
          <div>
            参考: 日本点字委員会『日本点字表記法 2018年版』、文部科学省『点字学習指導の手引（令和5年改訂）』
          </div>
          <div>
            このアプリは学習補助ツールです。本格的な点訳には『点訳のてびき 第4版』『点字表記辞典 第7版』を参照してください。
          </div>
        </div>
      </footer>

      {/* サイト間ナビ: 画面下端に常駐する控えめな逆リンクバー（→ satory074.com/apps） */}
      <nav
        aria-label="サイト間ナビゲーション"
        className="app-backlink-bar fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex h-9 items-center justify-center px-4">
          <a
            href="https://satory074.com/apps/"
            target="_blank"
            rel="noopener"
            aria-label="satory074 のほかのアプリ一覧を新しいタブで開く"
            className="inline-flex h-full items-center gap-1 px-3 text-xs text-slate-600 transition-colors hover:text-slate-900"
          >
            satory074 のほかのアプリ <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
