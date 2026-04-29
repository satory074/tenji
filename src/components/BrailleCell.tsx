import type { Dots } from '../data/braille';

type Size = 'xs' | 'sm' | 'md' | 'lg';

interface Props {
  dots: Dots | Set<number>;
  size?: Size;
  interactive?: boolean;
  onToggle?: (dot: number) => void;
  showNumbers?: boolean;
  highlight?: 'correct' | 'incorrect' | null;
}

const SIZES: Record<Size, { dot: string; gap: string; pad: string; text: string }> = {
  xs: { dot: 'w-2.5 h-2.5', gap: 'gap-0.5', pad: 'p-1', text: 'text-[8px]' },
  sm: { dot: 'w-4 h-4', gap: 'gap-1', pad: 'p-1.5', text: 'text-[9px]' },
  md: { dot: 'w-6 h-6', gap: 'gap-1.5', pad: 'p-2', text: 'text-[11px]' },
  lg: { dot: 'w-9 h-9', gap: 'gap-2', pad: 'p-3', text: 'text-sm' },
};

const ORDER = [1, 4, 2, 5, 3, 6] as const;

function dotsHas(dots: Dots | Set<number>, d: number): boolean {
  if (dots instanceof Set) return dots.has(d);
  return dots.includes(d);
}

export function BrailleCell({
  dots,
  size = 'md',
  interactive = false,
  onToggle,
  showNumbers = false,
  highlight = null,
}: Props) {
  const s = SIZES[size];

  const frameClass =
    highlight === 'correct'
      ? 'bg-emerald-50 border-emerald-400'
      : highlight === 'incorrect'
        ? 'bg-rose-50 border-rose-400'
        : 'bg-amber-50 border-amber-300';

  return (
    <div
      className={`inline-grid grid-cols-2 ${s.gap} ${s.pad} ${frameClass} border rounded-md`}
      role={interactive ? 'group' : 'img'}
      aria-label={`点字: ${ORDER.filter((d) => dotsHas(dots, d)).join(',')}`}
    >
      {ORDER.map((d) => {
        const on = dotsHas(dots, d);
        const dotClass = `${s.dot} rounded-full flex items-center justify-center select-none transition-colors ${
          on ? 'bg-slate-900' : 'bg-slate-200'
        }`;
        if (interactive) {
          return (
            <button
              key={d}
              type="button"
              onClick={() => onToggle?.(d)}
              className={`${dotClass} hover:ring-2 hover:ring-amber-500 cursor-pointer`}
              aria-label={`点${d}${on ? ' (オン)' : ' (オフ)'}`}
              aria-pressed={on}
            >
              {showNumbers && (
                <span className={`${s.text} ${on ? 'text-amber-100' : 'text-slate-500'}`}>{d}</span>
              )}
            </button>
          );
        }
        return (
          <span key={d} className={dotClass}>
            {showNumbers && (
              <span className={`${s.text} ${on ? 'text-amber-100' : 'text-slate-400'}`}>{d}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
