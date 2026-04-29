import { useEffect, useMemo, useState } from 'react';
import {
  ALL_ITEMS,
  DAKUON,
  EIJI,
  GOJUON,
  HANDAKUON,
  KIGOU,
  SUUJI,
  YOUDAKUON,
  YOUHANDAKUON,
  YOUON,
  type BrailleItem,
  dotsEqual,
} from '../data/braille';
import { BrailleCell } from './BrailleCell';

const MODES: Record<string, BrailleItem[]> = {
  '五十音のみ': GOJUON,
  '濁音・半濁音': [...DAKUON, ...HANDAKUON],
  '拗音': [...YOUON, ...YOUDAKUON, ...YOUHANDAKUON],
  '数字': SUUJI,
  '英字': EIJI,
  '記号': KIGOU,
  'すべて': ALL_ITEMS,
};

function pickRandom<T>(arr: T[], avoid?: T): T {
  if (arr.length <= 1) return arr[0];
  let pick = arr[Math.floor(Math.random() * arr.length)];
  let safety = 10;
  while (pick === avoid && safety-- > 0) {
    pick = arr[Math.floor(Math.random() * arr.length)];
  }
  return pick;
}

export function WriteDrill() {
  const [mode, setMode] = useState<keyof typeof MODES>('五十音のみ');
  const [showNumbers, setShowNumbers] = useState(false);
  const items = MODES[mode];
  const [current, setCurrent] = useState<BrailleItem>(() => pickRandom(items));
  const [userDots, setUserDots] = useState<Set<number>[]>(() =>
    current.mas.map(() => new Set<number>()),
  );
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // モード変更時
  useEffect(() => {
    const next = pickRandom(MODES[mode]);
    setCurrent(next);
    setUserDots(next.mas.map(() => new Set<number>()));
    setChecked(false);
  }, [mode]);

  const isCorrect = useMemo(() => {
    if (userDots.length !== current.mas.length) return false;
    return current.mas.every((expected, i) => {
      const u = [...userDots[i]];
      return dotsEqual(u, expected);
    });
  }, [userDots, current]);

  function toggleDot(masIdx: number, dot: number) {
    if (checked) return;
    setUserDots((prev) => {
      const next = prev.map((s) => new Set(s));
      if (next[masIdx].has(dot)) next[masIdx].delete(dot);
      else next[masIdx].add(dot);
      return next;
    });
  }

  function check() {
    setChecked(true);
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
  }

  function next() {
    const n = pickRandom(items, current);
    setCurrent(n);
    setUserDots(n.mas.map(() => new Set<number>()));
    setChecked(false);
  }

  function clear() {
    setUserDots(current.mas.map(() => new Set<number>()));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-slate-600">モード:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as keyof typeof MODES)}
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white"
        >
          {Object.keys(MODES).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={showNumbers}
            onChange={(e) => setShowNumbers(e.target.checked)}
            className="accent-amber-600"
          />
          点番号を表示
        </label>
        <div className="ml-auto text-sm text-slate-600">
          スコア: <span className="font-semibold text-slate-900">{score.correct}</span> / {score.total}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-1 mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-500">この文字を点字で打ってください</div>
          <div className="text-7xl font-bold text-slate-900 leading-none">{current.display}</div>
          {current.mas.length > 1 && (
            <div className="text-xs text-amber-700 mt-2">{current.mas.length}マス必要です</div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {userDots.map((set, i) => {
            const expected = current.mas[i];
            const correctMas = checked && dotsEqual([...set], expected);
            const incorrectMas = checked && !correctMas;
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <BrailleCell
                  dots={set}
                  size="lg"
                  interactive={!checked}
                  onToggle={(d) => toggleDot(i, d)}
                  showNumbers={showNumbers}
                  highlight={
                    checked ? (correctMas ? 'correct' : incorrectMas ? 'incorrect' : null) : null
                  }
                />
                {checked && !correctMas && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-[10px] text-slate-500">正解</div>
                    <BrailleCell dots={expected} size="sm" showNumbers={showNumbers} />
                  </div>
                )}
                <div className="text-[10px] text-slate-400">マス {i + 1}</div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {!checked ? (
            <>
              <button
                onClick={check}
                className="px-5 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800"
              >
                答え合わせ
              </button>
              <button
                onClick={clear}
                className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm hover:bg-slate-50"
              >
                クリア
              </button>
              <button
                onClick={next}
                className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm hover:bg-slate-50"
              >
                スキップ
              </button>
            </>
          ) : (
            <>
              <div
                className={`px-4 py-2 rounded-md text-sm font-semibold ${
                  isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isCorrect ? '✓ 正解！' : '✗ 不正解'}
              </div>
              <button
                onClick={next}
                className="px-5 py-2 bg-amber-500 text-white rounded-md text-sm font-medium hover:bg-amber-600"
              >
                次の問題
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
