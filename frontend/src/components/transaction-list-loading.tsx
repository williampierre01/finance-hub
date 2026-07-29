export function TransactionListLoading() {
  return (
    <section
      aria-label="Carregando transações"
      aria-busy="true"
      className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6"
    >
      <div className="h-6 w-48 animate-pulse rounded bg-slate-800" />

      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex animate-pulse items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <div className="space-y-2">
              <div className="h-4 w-36 rounded bg-slate-800" />
              <div className="h-3 w-24 rounded bg-slate-800" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-slate-800" />
              <div className="ml-auto h-3 w-16 rounded bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}