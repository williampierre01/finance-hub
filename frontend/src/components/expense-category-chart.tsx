"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface ExpenseCategoryChartData {
  category: string;
  total: number;
}

interface ExpenseCategoryChartProps {
  data: ExpenseCategoryChartData[];
  periodLabel: string;
}

const chartColors = [
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#a78bfa",
  "#60a5fa",
  "#f472b6",
  "#2dd4bf",
  "#94a3b8",
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ExpenseCategoryChart({
  data,
  periodLabel,
}: ExpenseCategoryChartProps) {
  const hasCategoryData = data.some(
    (item) => item.total > 0,
  );

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
          Distribuição de despesas
        </span>

        <h2 className="mt-3 text-xl font-bold text-slate-100">
          Despesas por categoria
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Valores gastos em:{" "}
          <strong className="text-slate-200">
            {periodLabel}
          </strong>
        </p>
      </div>

      {!hasCategoryData ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-8 text-center">
          <p className="text-sm text-slate-400">
            Não existem despesas neste período.
          </p>
        </div>
      ) : (
        <div className="mt-8 h-96 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart accessibilityLayer>
              <Pie
                data={data}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={115}
                paddingAngle={3}
              >
                {data.map((item, index) => (
                  <Cell
                    key={item.category}
                    fill={
                      chartColors[
                        index % chartColors.length
                      ]
                    }
                    stroke="#0f172a"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "0.75rem",
                  color: "#f8fafc",
                }}
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  String(name),
                ]}
              />

              <Legend
                iconType="circle"
                formatter={(value) => String(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}