interface Stat {
  value: string | number;
  label: string;
}

interface StatRowProps {
  stats: Stat[];
}

/*
 * Three-tile stat row on the team member profile. Big number on
 * top, small descriptive label underneath. Re-used for any set
 * of simple "count + description" metrics.
 */
export function StatRow({ stats }: StatRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-1 bg-white border border-black/10 rounded-lg shadow-card p-4">
          <p className="font-display font-medium text-xl text-black leading-none">{s.value}</p>
          <p className="text-body text-xs text-black/60 leading-snug">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
