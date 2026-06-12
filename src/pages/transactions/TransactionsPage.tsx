import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearTransactionError, fetchMyTransactions } from "../../redux/features/transactions/transactionSlice";
import { TransactionList } from "./components/TransactionList";
import { TransactionForm } from "./components/TransactionForm";

export function TransactionsPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.transactions);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyTransactions());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearTransactionError());
    };
  }, [dispatch]);

  const total = useMemo(() => items.length, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transactions</h2>
          <p className="mt-1 text-white/60">Track income, expense, and transfer history.</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-medium"
        >
          <Plus className="h-4 w-4" />
          New Transaction
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-white/60">Total Transactions</p>
        <h3 className="mt-1 text-3xl font-semibold">{total}</h3>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <TransactionList items={items} loading={status === "loading"} />

      <TransactionForm open={open} onOpenChange={setOpen} />
    </div>
  );
}