import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  clearSelectedCategory,
  createCategory,
  updateCategory,
} from "../../../redux/features/categories/categorySlice";

const schema = z.object({
  name: z.string().min(2, "Category name is required"),
  isDefault: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export function CategoryForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.categories.selected);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (selected) {
      reset({
        name: selected.name,
        isDefault: selected.isDefault,
      });
    } else {
      reset({
        name: "",
        isDefault: false,
      });
    }
  }, [selected, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        isDefault: !!data.isDefault,
      };

      const result = selected
        ? await dispatch(updateCategory({ id: selected._id, data: payload })).unwrap()
        : await dispatch(createCategory(payload)).unwrap();

      toast.success(result?.message || (selected ? "Category updated successfully" : "Category created successfully"));
      dispatch(clearSelectedCategory());
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error || "Failed to save category");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-950 p-6">
        <h3 className="text-xl font-semibold">
          {selected ? "Edit Category" : "New Category"}
        </h3>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
              placeholder="Category name"
              {...register("name")}
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
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