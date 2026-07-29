"use client";

import { useState } from "react";

import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";

export function TransactionsSection() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleTransactionCreated() {
    setRefreshKey((currentKey) => currentKey + 1);
  }

  return (
    <>
      <TransactionForm onTransactionCreated={handleTransactionCreated} />

      <TransactionList refreshKey={refreshKey} />
    </>
  );
}