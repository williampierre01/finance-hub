"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface MonthlyEvolutionChartData {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyEvolutionChartProps {
  data: MonthlyEvolutionChartData[];
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

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month
    .split("-")
    .map(Number);

  const monthLabel = new Date(
    year,
    monthNumber - 1,
    1,
  )
    .toLocaleDateString("pt-BR", {
      month: "short",
    })
    .replace(".", "");

  return `${monthLabel}/${String(year).slice(-2)}`;
}

function formatFullMonth(month: string) {
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

export function MonthlyEvolutionChart({
  data,
}: MonthlyEvolutionChartProps) {
  const hasFinancialData = data.some(
    (item) =>
      item.income > 0 || item.expense > 0,
  );

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">
          Histórico financeiro
        </span>

        <h2 className="mt-3 text-xl font-bold text-slate-100">
          Evolução mensal
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Receitas e despesas nos últimos{" "}
          <strong className="text-slate-200">
            {data.length} meses
          </strong>
          .
        </p>
      </div>

      {!hasFinancialData ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-8 text-center">
          <p className="text-sm text-slate-400">
            Não existem dados financeiros neste período.
          </p>
        </div>
      ) : (
        <div className="mt-8 h-96 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 20,
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
                dataKey="month"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatMonthLabel}
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
                labelFormatter={(label) =>
                  formatFullMonth(String(label))
                }
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "income"
                    ? "Receitas"
                    : "Despesas",
                ]}
              />

              <Legend
                formatter={(value) =>
                  value === "income"
                    ? "Receitas"
                    : "Despesas"
                }
              />

              <Line
                type="monotone"
                dataKey="income"
                stroke="#34d399"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#34d399",
                }}
                activeDot={{
                  r: 6,
                }}
              />

              <Line
                type="monotone"
                dataKey="expense"
                stroke="#f87171"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#f87171",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}