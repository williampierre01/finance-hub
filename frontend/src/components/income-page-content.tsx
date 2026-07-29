"use client";

import { useState } from "react";

import { FilteredTransactionList } from "@/components/filtered-transaction-list";
import { SpecificTransactionForm } from "@/components/specific-transaction-form";

export function IncomePageContent() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleTransactionCreated() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <>
      <SpecificTransactionForm
        type="INCOME"
        title="Cadastrar receita"
        submitLabel="Adicionar receita"
        onTransactionCreated={handleTransactionCreated}
      />

      <FilteredTransactionList
        key={refreshKey}
        type="INCOME"
        emptyMessage="Nenhuma receita cadastrada."
      />
    </>
  );
}