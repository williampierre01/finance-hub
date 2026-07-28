interface SummaryCardProps {
  title: string;
  value: string;
  valueClassName?: string;
}

export function SummaryCard({
  title,
  value,
  valueClassName = "",
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <span className="text-sm text-slate-400">{title}</span>

      <strong className={`mt-3 block text-3xl ${valueClassName}`}>
        {value}
      </strong>
    </article>
  );
}