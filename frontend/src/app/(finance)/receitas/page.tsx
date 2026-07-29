import { FilteredTransactionList } from "@/components/filtered-transaction-list";
import { PageHeader } from "@/components/page-header";

export default function ReceitasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Entradas"
        title="Receitas"
        description="Consulte todas as receitas cadastradas no FinanceHub."
      />

      <FilteredTransactionList
        type="INCOME"
        emptyMessage="Nenhuma receita cadastrada."
      />
    </>
  );
}