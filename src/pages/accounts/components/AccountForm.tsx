import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  clearSelectedAccount,
  createAccount,
  updateAccount,
} from "../../../redux/features/accounts/accountSlice";

const schema = z.object({
  name: z.string().min(2, "Account name is required"),
  type: z.enum(["cash", "bank", "mfs", "card","other"]),
  openingBalance: z.coerce.number().min(0).optional(),
  isDefault: z.boolean().optional(),
});

type FormData = z.input<typeof schema>;
type OutputData = z.output<typeof schema>;

export function AccountForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.accounts.selected);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData, any, OutputData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "cash",
      openingBalance: 0,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (selected) {
      reset({
        name: selected.name,
        type: selected.type,
        openingBalance: selected.openingBalance,
        isDefault: selected.isDefault,
      });
    } else {
      reset({
        name: "",
        type: "cash",
        openingBalance: 0,
        isDefault: false,
      });
    }
  }, [selected, reset]);

  const onSubmit = async (data: OutputData) => {
    try {
      const payload = {
        name: data.name,
        type: data.type,
        openingBalance: data.openingBalance || 0,
        isDefault: !!data.isDefault,
      };

      const result = selected
        ? await dispatch(updateAccount({ id: selected._id, data: payload })).unwrap()
        : await dispatch(createAccount(payload)).unwrap();

      toast.success(result?.message || (selected ? "Account updated successfully" : "Account created successfully"));
      dispatch(clearSelectedAccount());
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error || "Failed to save account");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-950 p-6">
        <h3 className="text-xl font-semibold">
          {selected ? "Edit Account" : "New Account"}
        </h3>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
              placeholder="Account name"
              {...register("name")}
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <select
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
              {...register("type")}
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="mfs">Mobile Banking</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
              type="number"
              placeholder="Opening balance"
              {...register("openingBalance")}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" {...register("isDefault")} />
            Set as default
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl bg-white/10 px-4 py-3"
            >
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