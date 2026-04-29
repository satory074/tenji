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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(items: BrailleItem[]): { answer: BrailleItem; choices: BrailleItem[] } {
  const answer = items[Math.floor(Math.random() * items.length)];
  const distractors = shuffle(items.filter((it) => it.display !== answer.display)).slice(0, 3);
  const choices = shuffle([answer, ...distractors]);
  return { answer, choices };
}

export function ReadDrill() {
  const [mode, setMode] = useState<keyof typeof MODES>('五十音のみ');
  const [showNumbers, setShowNumbers] = useState(false);
  const items = MODES[mode];
  const [{ answer, choices }, setQ] = useState(() => buildQuestion(items));
  const [picked, setPicked] = useState<BrailleItem | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setQ(buildQuestion(MODES[mode]));
    setPicked(null);
  }, [mode]);

  const isCorrect = useMemo(() => picked?.display === answer.display, [picked, answer]);

  function pick(c: BrailleItem) {
    if (picked) return;
    setPicked(c);
    setScore((s) => ({
      correct: s.correct + (c.display === answer.display ? 1 : 0),
      total: s.total + 1,
    }));
  }

  function next() {
    setQ(buildQuestion(items));
    setPicked(null);
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
        <div className="text-xs uppercase tracking-wider text-slate-500 text-center mb-3">
          この点字が表す文字は？
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {answer.mas.map((m, i) => (
            <BrailleCell key={i} dots={m} size="lg" showNumbers={showNumbers} />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {choices.map((c) => {
            const isAns = c.display === answer.display;
            const isPicked = picked?.display === c.display;
            const className = !picked
              ? 'bg-white border-slate-300 hover:bg-slate-50 hover:border-amber-400'
              : isAns
                ? 'bg-emerald-50 border-emerald-400'
                : isPicked
                  ? 'bg-rose-50 border-rose-400'
                  : 'bg-white border-slate-200 opacity-60';
            return (
              <button
                key={c.display}
                onClick={() => pick(c)}
                disabled={!!picked}
                className={`px-4 py-4 border-2 rounded-lg text-2xl font-semibold text-slate-800 transition ${className}`}
              >
                {c.display}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
            <div
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isCorrect ? '✓ 正解！' : `✗ 不正解（正解: ${answer.display}）`}
            </div>
            <button
              onClick={next}
              className="px-5 py-2 bg-amber-500 text-white rounded-md text-sm font-medium hover:bg-amber-600"
            >
              次の問題
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
