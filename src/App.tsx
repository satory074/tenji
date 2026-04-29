import { useState } from 'react';
import { Reference } from './components/Reference';
import { WriteDrill } from './components/WriteDrill';
import { ReadDrill } from './components/ReadDrill';
import { Translator } from './components/Translator';

type Tab = 'reference' | 'write' | 'read' | 'translate';

const TABS: Array<{ id: Tab; label: string; sub: string }> = [
  { id: 'reference', label: '一覧', sub: '点字を見て覚える' },
  { id: 'write', label: '書き取り', sub: '文字 → 点を打つ' },
  { id: 'read', label: '読み取り', sub: '点字 → 文字を選ぶ' },
  { id: 'translate', label: '点訳', sub: '文章 → 点字に変換' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('reference');

  return (
    <div className="min-h-screen flex flex-col">
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

      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 flex overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition ${
                tab === t.id
                  ? 'border-amber-500 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div>{t.label}</div>
              <div className="text-[10px] font-normal text-slate-400">{t.sub}</div>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {tab === 'reference' && <Reference />}
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
    </div>
  );
}
