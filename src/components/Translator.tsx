import { useMemo, useState } from 'react';
import { translate, masToString } from '../data/braille';
import { BrailleCell } from './BrailleCell';

const SAMPLES = [
  'こんにちは',
  'がっこうへ いきます',
  'コーヒーを 3ぱい',
  'きょうは 4がつ 29にち',
  'Claude code',
];

export function Translator() {
  const [input, setInput] = useState('こんにちは');
  const [showNumbers, setShowNumbers] = useState(false);

  const tokens = useMemo(() => translate(input), [input]);

  const brailleString = useMemo(() => {
    return tokens
      .map((t) => {
        if (t.mas === null) return '?';
        if (t.source === ' ' || t.source === '　') return ' ';
        return masToString(t.mas);
      })
      .join('');
  }, [tokens]);

  const unsupported = tokens.filter((t) => t.mas === null).map((t) => t.source);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          点訳したい文字（ひらがな・カタカナ・数字・英字・記号）
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-base font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="例: こんにちは / 4がつ29にち / きゃべつ"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700"
            >
              {s}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-sm text-slate-600 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={showNumbers}
              onChange={(e) => setShowNumbers(e.target.checked)}
              className="accent-amber-600"
            />
            点番号を表示
          </label>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">
          点字パターン（Unicode）
        </div>
        <div className="text-3xl font-mono break-all text-slate-900 leading-relaxed select-all">
          {brailleString || <span className="text-slate-400">…</span>}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">
          文字 ↔ マス対応
        </div>
        <div className="flex flex-wrap gap-3">
          {tokens.map((t, i) => {
            if (t.source === ' ' || t.source === '　') {
              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center min-w-[36px] py-3 px-1 border border-dashed border-slate-300 rounded-md text-slate-400 text-xs"
                >
                  空白
                </div>
              );
            }
            if (t.mas === null) {
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 px-2 py-2 bg-rose-50 border border-rose-200 rounded-md"
                >
                  <span className="text-xl text-rose-700">{t.source}</span>
                  <span className="text-[10px] text-rose-500">未対応</span>
                </div>
              );
            }
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 px-2 py-2">
                <span className="text-xl font-semibold text-slate-800">{t.source}</span>
                <div className="flex gap-1">
                  {t.mas.map((m, j) => (
                    <BrailleCell key={j} dots={m} size="sm" showNumbers={showNumbers} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {unsupported.length > 0 && (
          <div className="mt-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900">
            <strong>未対応の文字:</strong> {unsupported.join(', ')}
            <br />
            このアプリはひらがな・カタカナ・数字・小文字英字・大文字英字・基本記号に対応しています。漢字は対応していません（実際の点訳でも、漢字は読みのひらがなに変換します）。
          </div>
        )}

        <div className="mt-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900">
          <strong>注意:</strong> このツールは点字パターンの確認用です。実際の点訳では「分かち書き」（語と語の間のマスあけ）が必須で、これは『点訳のてびき 第4版』に基づくルールが必要です。スペースは入力されたものをそのまま反映します。
        </div>
      </div>
    </div>
  );
}
