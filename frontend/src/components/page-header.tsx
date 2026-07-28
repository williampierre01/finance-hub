interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header>
      <span className="block text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
        {eyebrow}
      </span>

      <h1 className="mt-4 text-4xl font-bold">
        {title}
      </h1>

      <p className="mt-4 max-w-2xl text-slate-400">
        {description}
      </p>
    </header>
  );
}