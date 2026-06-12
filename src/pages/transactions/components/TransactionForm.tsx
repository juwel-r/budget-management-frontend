import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { clearSelectedTransaction, createTransaction, updateTransaction } from "../../../redux/features/transactions/transactionSlice";
import { fetchMyAccounts } from "../../../redux/features/accounts/accountSlice";
import { fetchMyCategories } from "../../../redux/features/categories/categorySlice";
import { toast } from "sonner";

const schema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.coerce.number().min(1, "Amount is required"),
  sourceAccountId: z.string().optional(),
  destinationAccountId: z.string().optional(),
  categoryId: z.string().optional(),
  note: z.string().optional(),
  incomeSource: z.string().optional(),
  transactionDate: z.string().optional(),
});

type FormData = z.input<typeof schema>;
type OutputData = z.output<typeof schema>;

export function TransactionForm({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.transactions.selected);
  const accounts = useAppSelector((state) => state.accounts.items);
  const categories = useAppSelector((state) => state.categories.items);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData, any, OutputData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      amount: 0,
      note: "",
      transactionDate: new Date().toISOString().slice(0, 10),
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const type = watch("type");

  useEffect(() => {
    if (open) {
      dispatch(fetchMyAccounts());
      dispatch(fetchMyCategories());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (selected) {
      reset({
        type: selected.type,
        amount: selected.amount,
        note: selected.note || "",
        incomeSource: selected.incomeSource || "",
        sourceAccountId: selected.sourceAccountId || "",
        destinationAccountId: selected.destinationAccountId || "",
        categoryId: selected.categoryId || "",
        transactionDate: selected.transactionDate?.slice(0, 10),
      });
    }
  }, [selected, reset]);
  const onSubmit = async (data: OutputData) => {
    const payload =
      data.type === "expense"
        ? {
            type: data.type,
            amount: data.amount,
            sourceAccountId: data.sourceAccountId,
            categoryId: data.categoryId,
            note: data.note,
            transactionDate: data.transactionDate,
          }
        : data.type === "income"
          ? {
              type: data.type,
              amount: data.amount,
              destinationAccountId: data.destinationAccountId,
              incomeSource: data.incomeSource,
              note: data.note,
              transactionDate: data.transactionDate,
            }
          : {
              type: data.type,
              amount: data.amount,
              sourceAccountId: data.sourceAccountId,
              destinationAccountId: data.destinationAccountId,
              note: data.note,
              transactionDate: data.transactionDate,
            };

    try {
      const result = selected
        ? await dispatch(updateTransaction({ id: selected._id, data: payload })).unwrap()
        : await dispatch(createTransaction(payload)).unwrap();

      toast.success(result?.message || (selected ? "Transaction updated successfully" : "Transaction created successfully"));
      dispatch(clearSelectedTransaction());
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error || "Failed to save transaction");
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-950 p-6">
        <h3 className="text-xl font-semibold">{selected ? "Edit Transaction" : "New Transaction"}</h3>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <select className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" {...register("type")}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
              type="number"
              placeholder="Amount"
              {...register("amount")}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>}
          </div>

          {type === "expense" && (
            <>
              <div>
                <select className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" {...register("sourceAccountId")}>
                  <option value="">Select source account</option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name} ({acc.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" {...register("categoryId")}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {type === "income" && (
            <>
              <div>
                <select className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" {...register("destinationAccountId")}>
                  <option value="">Select destination account</option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name} ({acc.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                  placeholder="Income source"
                  {...register("incomeSource")}
                />
              </div>
            </>
          )}

          {type === "transfer" && (
            <>
              <div>
                <select className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" {...register("sourceAccountId")}>
                  <option value="">Select source account</option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name} ({acc.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" {...register("destinationAccountId")}>
                  <option value="">Select destination account</option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name} ({acc.type})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Note" {...register("note")} />
          </div>

          <div>
            <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" type="date" {...register("transactionDate")} />
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button type="button" onClick={() => onOpenChange(false)} className="flex-1 rounded-xl bg-white/10 px-4 py-3">
              Cancel
            </button>
            <button type="submit" className="flex-1 rounded-xl bg-indigo-500 px-4 py-3 font-medium">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
