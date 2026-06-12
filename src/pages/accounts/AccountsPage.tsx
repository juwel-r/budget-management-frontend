import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearAccountError, fetchMyAccounts } from "../../redux/features/accounts/accountSlice";
import { AccountForm } from "./components/AccountForm";
import { AccountList } from "./components/AccountList";

export function AccountsPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.accounts);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyAccounts());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearAccountError());
    };
  }, [dispatch]);

  const totalBalance = useMemo(
    () => items.reduce((sum, item) => sum + (item.currentBalance || 0), 0),
    [items]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Accounts</h2>
          <p className="mt-1 text-white/60">Manage your money sources and balances.</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-medium"
        >
          <Plus className="h-4 w-4" />
          New Account
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-white/60">Total Balance</p>
        <h3 className="mt-1 text-3xl font-semibold">৳{totalBalance.toLocaleString()}</h3>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <AccountList items={items} loading={status === "loading"} />

      <AccountForm open={open} onOpenChange={setOpen} />
    </div>
  );
}