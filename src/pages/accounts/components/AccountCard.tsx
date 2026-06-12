import { MoreVertical, Archive } from "lucide-react";
import {  archiveAccount, type Account } from "../../../redux/features/accounts/accountSlice";
import { useAppDispatch } from "../../../redux/hooks";

export function AccountCard({ account }: { account: Account }) {
  const dispatch = useAppDispatch();

  const handleArchive = () => {
    dispatch(archiveAccount(account._id));
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{account.name}</h3>
          <p className="text-sm text-white/60">{account.type}</p>
        </div>

        <button className="rounded-lg p-2 text-white/60 hover:bg-white/10">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5">
        <p className="text-sm text-white/60">Current Balance</p>
        <h4 className="mt-1 text-2xl font-bold">৳{account.currentBalance?.toLocaleString()}</h4>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`text-xs ${account.isArchived ? "text-red-400" : "text-emerald-400"}`}>
          {account.isArchived ? "Archived" : "Active"}
        </span>

        {!account.isArchived && (
          <button
            onClick={handleArchive}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm"
          >
            <Archive className="h-4 w-4" />
            Archive
          </button>
        )}
      </div>
    </div>
  );
}