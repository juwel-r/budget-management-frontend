import { format } from "date-fns";
import { Trash2, Pencil } from "lucide-react";
import { type Transaction, deleteTransaction, setSelectedTransaction } from "../../../redux/features/transactions/transactionSlice";
import { useAppDispatch } from "../../../redux/hooks";

export function TransactionList({
  items,
  loading,
}: {
  items: Transaction[];
  loading: boolean;
}) {
  const dispatch = useAppDispatch();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-white/60">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold capitalize">{item.type}</h3>
              <p className="text-sm text-white/60">
                {item.note || "No note"} • {format(new Date(item.transactionDate), "dd MMM yyyy")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">৳{item.amount.toLocaleString()}</span>
              <button
                onClick={() => dispatch(setSelectedTransaction(item))}
                className="rounded-lg bg-white/10 p-2"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => dispatch(deleteTransaction(item._id))}
                className="rounded-lg bg-white/10 p-2 text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}