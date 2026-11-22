import { useMemo, useState } from 'react';
import {
  ALL_ITEMS,
  CATEGORY_LABELS,
  masToString,
  type BrailleItem,
  type Category,
  type Mas,
} from '../data/braille';
import { CATEGORY_ORDER, type Route } from '../lib/routes';
import { BrailleCell } from './BrailleCell';
import { RouteLink } from './RouteLink';

const CIRCLED = ['', '①', '②', '③', '④', '⑤', '⑥'];

/** [[5], [1, 6]] → "⑤ ＋ ①⑥" (Lesson.tsx と同じ書き方) */
function dotsLabel(mas: Mas[]): string {
  return mas.map((m) => m.map((d) => CIRCLED[d]).join('')).join(' ＋ ');
}

// 分類は URL で決まる (/reference/ = 五十音、/reference/<分類>/)。ボタンは各分類のページへのリンク。
export function Reference({
  category: active,
  onNavigate,
}: {
  category: Category;
  onNavigate: (to: Route) => void;
}) {
  const [showNumbers, setShowNumbers] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const base = ALL_ITEMS.filter((it) => it.category === active);
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter(
      (it) =>
        it.display.includes(q) ||
        it.reading.toLowerCase().includes(q) ||
        (it.row && it.row.includes(q)),
    );
  }, [active, query]);

  // 五十音のときは行ごとに表示
  const groupedByRow: Map<string, BrailleItem[]> = useMemo(() => {
    const m = new Map<string, BrailleItem[]>();
    for (const it of filtered) {
      const key = it.row ?? '';
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(it);
    }
    return m;
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((cat) => (
          <RouteLink
            key={cat}
            to={{ tab: 'reference', category: cat }}
            current={active === cat}
            onNavigate={onNavigate}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
              active === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </RouteLink>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="検索（文字・読み・行名）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={showNumbers}
            onChange={(e) => setShowNumbers(e.target.checked)}
            className="accent-amber-600"
          />
          点番号を表示
        </label>
      </div>

      {[...groupedByRow.entries()].map(([row, items]) => (
        <section key={row}>
          {row && (
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {row}
            </h3>
          )}
          <div className="flex flex-wrap gap-3">
            {items.map((it) => (
              <ItemCard key={it.display} item={it} showNumbers={showNumbers} />
            ))}
          </div>
        </section>
      ))}

      {/* 同じ内容を文字の表でも出す: 点番号と、コピーできる点字の文字 (Unicode)。
          読み上げ環境でも使え、JS を実行しないクローラーにも読める */}
      {filtered.length > 0 && (
        <details className="bg-white border border-slate-200 rounded-lg">
          <summary className="cursor-pointer select-none px-4 py-2 text-sm font-medium text-slate-700">
            表で見る（点番号・点字の文字）
          </summary>
          <div className="overflow-x-auto px-4 pb-3">
            <table className="w-full text-sm">
              <caption className="sr-only">{CATEGORY_LABELS[active]}の点字と点番号</caption>
              <thead className="text-xs text-slate-500">
                <tr>
                  <th scope="col" className="text-left font-medium py-1.5 pr-4">文字</th>
                  <th scope="col" className="text-left font-medium py-1.5 pr-4">点字</th>
                  <th scope="col" className="text-left font-medium py-1.5">点番号</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((it) => (
                  <tr key={it.display}>
                    <th scope="row" className="text-left font-semibold text-slate-800 py-1.5 pr-4">
                      {it.display}
                    </th>
                    <td className="py-1.5 pr-4 text-xl leading-none text-slate-900">{masToString(it.mas)}</td>
                    <td className="py-1.5 text-slate-700">{dotsLabel(it.mas)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

function ItemCard({ item, showNumbers }: { item: BrailleItem; showNumbers: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="text-2xl font-semibold text-slate-800">{item.display}</div>
      <div className="flex gap-1">
        {item.mas.map((m, i) => (
          <BrailleCell key={i} dots={m} size="sm" showNumbers={showNumbers} />
        ))}
      </div>
    </div>
  );
}
