"use client";

import { useState } from "react";

import { FilteredTransactionList } from "@/components/filtered-transaction-list";
import { SpecificTransactionForm } from "@/components/specific-transaction-form";

export function ExpensePageContent() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleTransactionCreated() {
    setRefreshKey((currentKey) => currentKey + 1);
  }

  return (
    <>
      <SpecificTransactionForm
        type="EXPENSE"
        title="Cadastrar despesa"
        submitLabel="Adicionar despesa"
        onTransactionCreated={handleTransactionCreated}
      />

      <FilteredTransactionList
        key={refreshKey}
        type="EXPENSE"
        emptyMessage="Nenhuma despesa encontrada."
        allowEditing
        allowDeleting
        enableFiltersAndPagination
      />
    </>
  );
}