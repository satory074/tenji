import { type ReactNode } from 'react';
import type { Dots } from '../data/braille';
import { BrailleCell } from './BrailleCell';

function Demo({
  label,
  dots,
  note,
  size = 'sm',
}: {
  label?: string;
  dots: Dots;
  note?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  return (
    <span className="inline-flex flex-col items-center gap-1 mx-1 my-1 align-top">
      {label !== undefined && (
        <span className="text-xl font-semibold text-slate-800 leading-none">{label}</span>
      )}
      <BrailleCell dots={dots} size={size} showNumbers />
      {note && <span className="text-[10px] text-slate-500">{note}</span>}
    </span>
  );
}

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="flex items-baseline gap-3 mb-3 mt-8 first:mt-0">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold">
          {num}
        </span>
        <span className="text-xl sm:text-2xl font-bold text-slate-900">{title}</span>
      </h2>
      <div className="space-y-3 text-slate-700 leading-relaxed">{children}</div>
    </section>
  );
}

function Box({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'tip' | 'warn' }) {
  const cls = {
    default: 'bg-white border-slate-200',
    tip: 'bg-amber-50 border-amber-200',
    warn: 'bg-rose-50 border-rose-200',
  }[tone];
  return <div className={`p-4 border rounded-lg ${cls}`}>{children}</div>;
}

const TOC = [
  { id: 'sec1', label: '6点の構造' },
  { id: 'sec2', label: '母音はたった3点で' },
  { id: 'sec3', label: '子音は「加点」' },
  { id: 'sec4', label: '例外: や行・わ行・ん' },
  { id: 'sec5', label: '濁音・半濁音' },
  { id: 'sec6', label: '拗音' },
  { id: 'sec7', label: '促音・長音' },
  { id: 'sec8', label: '数字' },
  { id: 'sec9', label: '英字' },
  { id: 'sec10', label: '組み立てる' },
];

export function Lesson() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          ゼロから学ぶ日本語点字のルール
        </h1>
        <p className="text-sm text-slate-600">
          点字は <strong>たった6個の点</strong>{' '}
          の組み合わせで、ひらがな・カタカナ・数字・英字すべてを表せます。最初は「あいうえお」の母音3点だけ覚えれば、あとは規則的に拡張するだけ。順に追えば全体像が見えます。
        </p>
      </div>

      <Box tone="tip">
        <div className="text-xs font-semibold text-amber-800 mb-2">このページの目次</div>
        <div className="flex flex-wrap gap-1.5">
          {TOC.map((t, i) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="text-xs px-2 py-1 bg-white border border-amber-200 rounded text-amber-900 hover:bg-amber-100"
            >
              {i + 1}. {t.label}
            </a>
          ))}
        </div>
      </Box>

      <div className="mt-8">
        <Section id="sec1" num="1" title="点字は縦3 × 横2 = 6点で1マス">
          <p>
            1文字は「<strong>1マス</strong>」と呼ばれる枠の中に並ぶ点で表します。マスは縦に3行、横に2列の <strong>合計6つの点</strong>{' '}
            の場所があり、点を「打つ／打たない」の組み合わせで文字を表現します。
          </p>
          <p>各点には番号が振られていて、これがすべてのルールの基礎になります:</p>
          <Box>
            <div className="flex justify-center my-2">
              <BrailleCell dots={[1, 2, 3, 4, 5, 6]} size="lg" showNumbers />
            </div>
            <div className="text-center text-sm text-slate-600">
              <strong>左列</strong>: 上から ① ② ③ ／ <strong>右列</strong>: 上から ④ ⑤ ⑥
            </div>
          </Box>
          <Box tone="warn">
            <div className="text-sm">
              <strong>覚え方:</strong> 「上から下へ、左から右へ」ではなく、<strong>「縦方向に番号が進む」</strong>のがポイント。①②③の次に④⑤⑥です。慣れるまでは下の表で確認しましょう。
            </div>
          </Box>
        </Section>

        <Section id="sec2" num="2" title="母音「あいうえお」は3点だけで作れる">
          <p>
            日本語の母音は5つしかなく、<strong>すべて ①②④ の3点の組み合わせ</strong>{' '}
            だけで表現します。つまり、上半分の点だけ使います。
          </p>
          <Box>
            <div className="flex flex-wrap justify-center gap-3 my-2">
              <Demo label="あ" dots={[1]} note="①" size="md" />
              <Demo label="い" dots={[1, 2]} note="①②" size="md" />
              <Demo label="う" dots={[1, 4]} note="①④" size="md" />
              <Demo label="え" dots={[1, 2, 4]} note="①②④" size="md" />
              <Demo label="お" dots={[2, 4]} note="②④" size="md" />
            </div>
          </Box>
          <p>
            ここまでが点字の<strong>絶対的な土台</strong>。あとに出てくる「か行」も「が」も「きゃ」も、すべてこの母音パターンの上に何かを足したり前に置いたりするだけです。
          </p>
        </Section>

        <Section id="sec3" num="3" title="子音は「母音 + 決まった点」を足すだけ">
          <p>
            「か行」は<strong>母音に⑥を足す</strong>と作れます。例えば「か」=「あ(①) + ⑥」=「①⑥」です。
          </p>
          <Box>
            <div className="text-xs font-semibold text-slate-500 mb-2">か行 = 母音 + ⑥</div>
            <div className="flex flex-wrap justify-center gap-3">
              <Demo label="か" dots={[1, 6]} note="①+⑥" size="md" />
              <Demo label="き" dots={[1, 2, 6]} note="①②+⑥" size="md" />
              <Demo label="く" dots={[1, 4, 6]} note="①④+⑥" size="md" />
              <Demo label="け" dots={[1, 2, 4, 6]} note="①②④+⑥" size="md" />
              <Demo label="こ" dots={[2, 4, 6]} note="②④+⑥" size="md" />
            </div>
          </Box>
          <p>
            この「足す点」を行ごとに変えるだけで、五十音のほぼすべてが機械的に作れます:
          </p>
          <Box>
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase">
                <tr>
                  <th className="text-left pb-2">行</th>
                  <th className="text-left pb-2">加える点</th>
                  <th className="text-left pb-2">代表例</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 font-semibold">あ行</td>
                  <td>なし（母音そのまま）</td>
                  <td><Demo label="あ" dots={[1]} /></td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">か行</td>
                  <td>⑥</td>
                  <td><Demo label="か" dots={[1, 6]} /></td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">さ行</td>
                  <td>⑤⑥</td>
                  <td><Demo label="さ" dots={[1, 5, 6]} /></td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">た行</td>
                  <td>③⑤</td>
                  <td><Demo label="た" dots={[1, 3, 5]} /></td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">な行</td>
                  <td>③</td>
                  <td><Demo label="な" dots={[1, 3]} /></td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">は行</td>
                  <td>③⑥</td>
                  <td><Demo label="は" dots={[1, 3, 6]} /></td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">ま行</td>
                  <td>③⑤⑥</td>
                  <td><Demo label="ま" dots={[1, 3, 5, 6]} /></td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">ら行</td>
                  <td>⑤</td>
                  <td><Demo label="ら" dots={[1, 5]} /></td>
                </tr>
              </tbody>
            </table>
          </Box>
          <Box tone="tip">
            <div className="text-sm">
              <strong>パターン:</strong>{' '}
              下半分（③⑤⑥）の点を子音用に使い、上半分（①②④）の点を母音用に使う、というのが基本構造です。「母音は上、子音は下」と覚えておくと混乱しません。
            </div>
          </Box>
        </Section>

        <Section id="sec4" num="4" title="例外: や行・わ行・ん">
          <p>
            ここまでの加点ルールに従わないのが <strong>や行・わ行・ん</strong>{' '}
            です。これらは規則性を壊す代わりに、それぞれ独自の固定パターンを持ちます。個別に暗記しましょう（数は少ないです）:
          </p>
          <Box>
            <div className="text-xs font-semibold text-slate-500 mb-2">や行</div>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <Demo label="や" dots={[3, 4]} note="③④" size="md" />
              <Demo label="ゆ" dots={[3, 4, 6]} note="③④⑥" size="md" />
              <Demo label="よ" dots={[3, 4, 5]} note="③④⑤" size="md" />
            </div>
            <div className="text-xs font-semibold text-slate-500 mb-2">わ行・ん</div>
            <div className="flex flex-wrap justify-center gap-3">
              <Demo label="わ" dots={[3]} note="③" size="md" />
              <Demo label="を" dots={[3, 5]} note="③⑤" size="md" />
              <Demo label="ん" dots={[3, 5, 6]} note="③⑤⑥" size="md" />
            </div>
          </Box>
        </Section>

        <Section id="sec5" num="5" title="濁音・半濁音は「前マスに記号」">
          <p>
            「が」「ば」「ぱ」のような濁音・半濁音は、清音（か・は等）の<strong>前にもう1マスを置く</strong>ことで表します。本体の文字は変えません。
          </p>
          <Box>
            <div className="text-sm font-semibold text-slate-700 mb-2">濁音マーク = ⑤ だけのマス</div>
            <div className="flex justify-center items-center gap-2 my-2">
              <Demo dots={[5]} note="濁音" size="md" />
              <span className="text-2xl text-slate-400">+</span>
              <Demo label="か" dots={[1, 6]} note="①⑥" size="md" />
              <span className="text-2xl text-slate-400">=</span>
              <span className="text-3xl font-bold text-slate-900 mx-1">が</span>
              <span className="inline-flex gap-1">
                <BrailleCell dots={[5]} size="sm" />
                <BrailleCell dots={[1, 6]} size="sm" />
              </span>
            </div>
          </Box>
          <Box>
            <div className="text-sm font-semibold text-slate-700 mb-2">半濁音マーク = ⑥ だけのマス（は行のみ）</div>
            <div className="flex justify-center items-center gap-2 my-2">
              <Demo dots={[6]} note="半濁音" size="md" />
              <span className="text-2xl text-slate-400">+</span>
              <Demo label="は" dots={[1, 3, 6]} note="①③⑥" size="md" />
              <span className="text-2xl text-slate-400">=</span>
              <span className="text-3xl font-bold text-slate-900 mx-1">ぱ</span>
              <span className="inline-flex gap-1">
                <BrailleCell dots={[6]} size="sm" />
                <BrailleCell dots={[1, 3, 6]} size="sm" />
              </span>
            </div>
          </Box>
          <p className="text-sm">
            濁音化できるのは <strong>か・さ・た・は</strong> 行のみ、半濁音化できるのは <strong>は</strong> 行のみです。
          </p>
        </Section>

        <Section id="sec6" num="6" title="拗音「きゃ・きゅ・きょ」は前マスに④">
          <p>
            「きゃ」「しゅ」「ちょ」のように小さい「ゃ・ゅ・ょ」が付く音は、<strong>前マスに④</strong>{' '}
            を置きます。続くマスは<strong>イ段ではなく、あ／う／お段</strong>を使うのがコツです。
          </p>
          <Box tone="warn">
            <div className="text-sm">
              <strong>注意:</strong> 「きゃ」=「き」+「ゃ」<u>ではない</u>。「き」を捨てて、代わりに「か」を使います。「拗音マーク + か」で「きゃ」になります。
            </div>
          </Box>
          <Box>
            <div className="text-sm font-semibold text-slate-700 mb-2">拗音マーク = ④ だけのマス</div>
            <div className="space-y-3">
              <div className="flex justify-center items-center gap-2">
                <Demo dots={[4]} note="拗音" size="md" />
                <span className="text-2xl text-slate-400">+</span>
                <Demo label="か" dots={[1, 6]} note="あ段" size="md" />
                <span className="text-2xl text-slate-400">=</span>
                <span className="text-2xl font-bold text-slate-900 mx-1">きゃ</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Demo dots={[4]} note="拗音" size="md" />
                <span className="text-2xl text-slate-400">+</span>
                <Demo label="く" dots={[1, 4, 6]} note="う段" size="md" />
                <span className="text-2xl text-slate-400">=</span>
                <span className="text-2xl font-bold text-slate-900 mx-1">きゅ</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Demo dots={[4]} note="拗音" size="md" />
                <span className="text-2xl text-slate-400">+</span>
                <Demo label="こ" dots={[2, 4, 6]} note="お段" size="md" />
                <span className="text-2xl text-slate-400">=</span>
                <span className="text-2xl font-bold text-slate-900 mx-1">きょ</span>
              </div>
            </div>
          </Box>
          <p>
            拗音と濁音／半濁音は組み合わせられます。前マスを「④⑤」にすれば<strong>拗濁音</strong>（ぎゃ等）、「④⑥」にすれば<strong>拗半濁音</strong>（ぴゃ等）になります:
          </p>
          <Box>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <Demo dots={[4, 5]} note="拗濁音" size="sm" />
                <span>+</span>
                <Demo label="か" dots={[1, 6]} size="sm" />
                <span>=</span>
                <span className="text-xl font-bold">ぎゃ</span>
              </div>
              <div className="flex items-center gap-2">
                <Demo dots={[4, 6]} note="拗半濁" size="sm" />
                <span>+</span>
                <Demo label="は" dots={[1, 3, 6]} size="sm" />
                <span>=</span>
                <span className="text-xl font-bold">ぴゃ</span>
              </div>
            </div>
          </Box>
        </Section>

        <Section id="sec7" num="7" title="促音「っ」と長音「ー」">
          <p>これらは前置記号ではなく、<strong>それ自体が独立した1マス</strong>です。</p>
          <Box>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <Demo label="っ" dots={[2]} note="② のみ" size="md" />
                <span className="text-xs text-slate-500">促音（小さい「つ」）</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Demo label="ー" dots={[2, 5]} note="②⑤" size="md" />
                <span className="text-xs text-slate-500">長音（伸ばし棒）</span>
              </div>
            </div>
          </Box>
          <p className="text-sm">
            例: <span className="text-base">きって</span> = <span className="inline-flex gap-1 align-middle">
              <BrailleCell dots={[1, 2, 6]} size="sm" />
              <BrailleCell dots={[2]} size="sm" />
              <BrailleCell dots={[1, 2, 3, 4, 5]} size="sm" />
            </span>{' '}
            （き + 促音 + て）
          </p>
        </Section>

        <Section id="sec8" num="8" title="数字: 数符 + a〜j パターン">
          <p>
            点字に「専用の数字」はありません。代わりに、<strong>数符 ⠼（③④⑤⑥）</strong>{' '}
            を前置することで「これ以降は数字です」と宣言し、英字の a〜j のパターンを 1〜0 として読みます。
          </p>
          <Box>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {[
                  ['1', [1], 'a'],
                  ['2', [1, 2], 'b'],
                  ['3', [1, 4], 'c'],
                  ['4', [1, 4, 5], 'd'],
                  ['5', [1, 5], 'e'],
                  ['6', [1, 2, 4], 'f'],
                  ['7', [1, 2, 4, 5], 'g'],
                  ['8', [1, 2, 5], 'h'],
                  ['9', [2, 4], 'i'],
                  ['0', [2, 4, 5], 'j'],
                ].map(([num, dots, letter]) => (
                  <tr key={num as string}>
                    <td className="py-1.5 font-bold text-lg w-12">{num}</td>
                    <td className="w-20"><BrailleCell dots={dots as Dots} size="xs" /></td>
                    <td className="text-xs text-slate-500">英字 {letter as string} と同じ形</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          <Box tone="tip">
            <div className="text-sm">
              <strong>連続する数字は数符1回だけ:</strong>{' '}
              「2026」と書くなら、数符 + 2 + 0 + 2 + 6 と打ちます。マスごとに数符を打ち直す必要はありません。
            </div>
          </Box>
          <div className="text-sm">
            例: <span className="text-base">2026</span> ={' '}
            <span className="inline-flex gap-1 align-middle">
              <BrailleCell dots={[3, 4, 5, 6]} size="sm" />
              <BrailleCell dots={[1, 2]} size="sm" />
              <BrailleCell dots={[2, 4, 5]} size="sm" />
              <BrailleCell dots={[1, 2]} size="sm" />
              <BrailleCell dots={[1, 2, 4]} size="sm" />
            </span>
          </div>
        </Section>

        <Section id="sec9" num="9" title="英字: 外字符 + a〜z">
          <p>
            英字も数字と同じ発想で、<strong>外字符 ⠰（⑤⑥）</strong>{' '}
            を前置して英字モードに切り替えます。a〜z は次の3層構造で覚えると楽です:
          </p>
          <Box>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">a〜j: 上4点（①②④⑤）の組合せ</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ['a', [1]], ['b', [1, 2]], ['c', [1, 4]], ['d', [1, 4, 5]], ['e', [1, 5]],
                    ['f', [1, 2, 4]], ['g', [1, 2, 4, 5]], ['h', [1, 2, 5]], ['i', [2, 4]], ['j', [2, 4, 5]],
                  ].map(([letter, dots]) => (
                    <Demo key={letter as string} label={letter as string} dots={dots as Dots} size="xs" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">k〜t: a〜j に「③」を追加</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ['k', [1, 3]], ['l', [1, 2, 3]], ['m', [1, 3, 4]], ['n', [1, 3, 4, 5]], ['o', [1, 3, 5]],
                    ['p', [1, 2, 3, 4]], ['q', [1, 2, 3, 4, 5]], ['r', [1, 2, 3, 5]], ['s', [2, 3, 4]], ['t', [2, 3, 4, 5]],
                  ].map(([letter, dots]) => (
                    <Demo key={letter as string} label={letter as string} dots={dots as Dots} size="xs" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">u〜z: k〜t に「⑥」を追加（w は例外）</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ['u', [1, 3, 6]], ['v', [1, 2, 3, 6]], ['w', [2, 4, 5, 6]], ['x', [1, 3, 4, 6]],
                    ['y', [1, 3, 4, 5, 6]], ['z', [1, 3, 5, 6]],
                  ].map(([letter, dots]) => (
                    <Demo key={letter as string} label={letter as string} dots={dots as Dots} size="xs" />
                  ))}
                </div>
              </div>
            </div>
          </Box>
          <p className="text-sm">
            大文字には<strong>大文字符 ⠠（⑥）</strong>を1文字ごとに前置。連続する大文字は ⑥⑥ で開始してまとめて大文字化できます。
          </p>
        </Section>

        <Section id="sec10" num="10" title="ここまでで全表記の枠組みは完成">
          <p>
            これで「すべての日本語ひらがな・濁音・拗音・数字・英字」をマスの並びとして書けるようになりました。残るは<strong>反復だけ</strong>です。
          </p>
          <Box tone="tip">
            <div className="text-sm space-y-2">
              <p>
                <strong>次のステップ:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>「一覧」タブ</strong> で全パターンを点番号付きで確認
                </li>
                <li>
                  <strong>「書き取り」タブ</strong>{' '}
                  でランダム出題を6点クリックで打つ → 五十音から始めて、慣れたら濁拗・数字英字へ
                </li>
                <li>
                  <strong>「読み取り」タブ</strong> で点字パターン → 文字の4択クイズ
                </li>
                <li>
                  <strong>「点訳」タブ</strong> で好きな文字列を入れて、マス分解を確認
                </li>
              </ul>
            </div>
          </Box>
          <Box>
            <div className="text-xs font-semibold text-slate-500 mb-2">仕上げの実例: 「がっこう」（5マス）</div>
            <div className="flex items-center gap-1.5 justify-center flex-wrap">
              <Demo dots={[5]} note="濁" size="sm" />
              <Demo label="か" dots={[1, 6]} size="sm" />
              <Demo label="っ" dots={[2]} size="sm" />
              <Demo label="こ" dots={[2, 4, 6]} size="sm" />
              <Demo label="う" dots={[1, 4]} size="sm" />
            </div>
            <div className="text-xs text-slate-500 text-center mt-2">
              濁音マーク + か + 促音 + こ + う = 「が・っ・こ・う」
              <br />
              <span className="text-slate-400">※ 実際の文章では前後の語との間に分かち書き（マスあけ）が入ります</span>
            </div>
          </Box>
          <p className="text-sm text-slate-600">
            残された大きな壁は <strong>分かち書き</strong>{' '}
            （語と語のスペース）です。これは『点訳のてびき 第4版』で学ぶ範囲で、本アプリの対象外。基本ルールが身についたら、書籍へ進んでください。
          </p>
        </Section>
      </div>
    </div>
  );
}
