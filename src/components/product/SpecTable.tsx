import type { Spec, SpecTable as SpecTableType } from '@/types/catalog';

export function SpecList({ specs }: { specs: Spec[] }) {
  return (
    <dl className="divide-y divide-white/8 border-y border-white/8">
      {specs.map((s) => (
        <div key={s.label} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
          <dt className="font-mono text-[0.6875rem] uppercase tracking-wider break-words text-steel-500">
            {s.label}
          </dt>
          <dd className="text-sm leading-relaxed break-words text-steel-200 sm:col-span-2">
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Matrix specification table (model variants), horizontally scrollable. */
export function SpecMatrix({ table }: { table: SpecTableType }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/15">
            {table.header.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-3 py-3 font-mono text-[0.625rem] uppercase tracking-wider text-amber-400 first:pl-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={`${row[0]}-${i}`} className="border-b border-white/8 last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={
                    j === 0
                      ? 'px-3 py-3 pl-0 text-[0.8125rem] font-medium text-mist'
                      : 'px-3 py-3 text-[0.8125rem] text-steel-300'
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
