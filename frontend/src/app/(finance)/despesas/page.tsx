import { FilteredTransactionList } from "@/components/filtered-transaction-list";
import { PageHeader } from "@/components/page-header";

export default function DespesasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Saídas"
        title="Despesas"
        description="Consulte todas as despesas cadastradas no FinanceHub."
      />

      <FilteredTransactionList
        type="EXPENSE"
        emptyMessage="Nenhuma despesa cadastrada."
      />
    </>
  );
}