interface SummaryValues {
  income: number;
  expense: number;
  balance: number;
  month: string;
}

interface VariationValues {
  income: number;
  expense: number;
  balance: number;
}

interface MonthlyComparisonProps {
  currentSummary: SummaryValues;
  previousMonth: SummaryValues;
  variation: VariationValues;
}

interface ComparisonItemProps {
  title: string;
  currentValue: number;
  previousValue: number;
  variation: number;
  positiveIsGood: boolean;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatMonth(month: string) {
  const [year, monthNumber] = month
    .split("-")
    .map(Number);

  return new Date(
    year,
    monthNumber - 1,
    1,
  ).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function ComparisonItem({
  title,
  currentValue,
  previousValue,
  variation,
  positiveIsGood,
}: ComparisonItemProps) {
  const increased = variation > 0;
  const decreased = variation < 0;

  const favorable =
    variation === 0 ||
    (increased && positiveIsGood) ||
    (decreased && !positiveIsGood);

  const variationClassName =
    variation === 0
      ? "text-slate-400"
      : favorable
        ? "text-emerald-400"
        : "text-red-400";

  const variationSymbol = increased
    ? "↑"
    : decreased
      ? "↓"
      : "→";

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="text-sm font-medium text-slate-400">
        {title}
      </h3>

      <strong className="mt-3 block text-xl text-slate-100">
        {formatCurrency(currentValue)}
      </strong>

      <p className="mt-2 text-sm text-slate-500">
        Mês anterior:{" "}
        {formatCurrency(previousValue)}
      </p>

      <p
        className={`mt-3 text-sm font-semibold ${variationClassName}`}
      >
        {variationSymbol}{" "}
        {Math.abs(variation).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        %
      </p>
    </article>
  );
}

export function MonthlyComparison({
  currentSummary,
  previousMonth,
  variation,
}: MonthlyComparisonProps) {
  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Comparação mensal
        </span>

        <h2 className="mt-3 text-xl font-bold text-slate-100">
          {formatMonth(currentSummary.month)} comparado com{" "}
          {formatMonth(previousMonth.month)}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          A porcentagem mostra a mudança em relação ao
          mês anterior.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ComparisonItem
          title="Receitas"
          currentValue={currentSummary.income}
          previousValue={previousMonth.income}
          variation={variation.income}
          positiveIsGood
        />

        <ComparisonItem
          title="Despesas"
          currentValue={currentSummary.expense}
          previousValue={previousMonth.expense}
          variation={variation.expense}
          positiveIsGood={false}
        />

        <ComparisonItem
          title="Saldo"
          currentValue={currentSummary.balance}
          previousValue={previousMonth.balance}
          variation={variation.balance}
          positiveIsGood
        />
      </div>
    </section>
  );
}