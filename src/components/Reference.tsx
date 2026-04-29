import { useMemo, useState } from 'react';
import {
  ALL_ITEMS,
  CATEGORY_LABELS,
  type BrailleItem,
  type Category,
} from '../data/braille';
import { BrailleCell } from './BrailleCell';

const CATEGORY_ORDER: Category[] = [
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

export function Reference() {
  const [active, setActive] = useState<Category>('gojuon');
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
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
              active === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
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
