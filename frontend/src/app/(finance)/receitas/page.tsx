import { IncomePageContent } from "@/components/income-page-content";
import { PageHeader } from "@/components/page-header";

export default function ReceitasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Entradas"
        title="Receitas"
        description="Cadastre e consulte todas as receitas do FinanceHub."
      />

      <IncomePageContent />
    </>
  );
}