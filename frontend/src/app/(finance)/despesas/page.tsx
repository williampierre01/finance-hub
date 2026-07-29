import { ExpensePageContent } from "@/components/expense-page-content";
import { PageHeader } from "@/components/page-header";

export default function DespesasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Saídas"
        title="Despesas"
        description="Cadastre e consulte todas as despesas do FinanceHub."
      />

      <ExpensePageContent />
    </>
  );
}