import { type Account } from "../../../redux/features/accounts/accountSlice";
import { AccountCard } from "./AccountCard";

export function AccountList({
  items,
  loading,
}: {
  items: Account[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-white/60">
        No accounts found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <AccountCard key={item._id} account={item} />
      ))}
    </div>
  );
}