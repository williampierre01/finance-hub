"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IncomeExpenseChartProps {
  income: number;
  expense: number;
  periodLabel: string;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 1,
  }).format(value);
}

export function IncomeExpenseChart({
  income,
  expense,
  periodLabel,
}: IncomeExpenseChartProps) {
  const chartData = [
    {
      period: periodLabel,
      receitas: income,
      despesas: expense,
    },
  ];

  const hasFinancialData =
    income > 0 || expense > 0;

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Gráfico financeiro
        </span>

        <h2 className="mt-3 text-xl font-bold text-slate-100">
          Receitas versus despesas
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Comparação dos valores para:{" "}
          <strong className="text-slate-200">
            {periodLabel}
          </strong>
        </p>
      </div>

      {!hasFinancialData ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-8 text-center">
          <p className="text-sm text-slate-400">
            Não existem dados financeiros neste período.
          </p>
        </div>
      ) : (
        <div className="mt-8 h-80 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
              }}
              accessibilityLayer
            >
              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="period"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
                width={80}
                tickFormatter={(value) =>
                  formatCompactCurrency(
                    Number(value),
                  )
                }
              />

              <Tooltip
                cursor={{
                  fill: "rgba(30, 41, 59, 0.45)",
                }}
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "0.75rem",
                  color: "#f8fafc",
                }}
                labelStyle={{
                  color: "#cbd5e1",
                  marginBottom: "0.5rem",
                }}
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "receitas"
                    ? "Receitas"
                    : "Despesas",
                ]}
              />

              <Legend
                formatter={(value) =>
                  value === "receitas"
                    ? "Receitas"
                    : "Despesas"
                }
              />

              <Bar
                dataKey="receitas"
                fill="#34d399"
                radius={[8, 8, 0, 0]}
                maxBarSize={90}
              />

              <Bar
                dataKey="despesas"
                fill="#f87171"
                radius={[8, 8, 0, 0]}
                maxBarSize={90}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}