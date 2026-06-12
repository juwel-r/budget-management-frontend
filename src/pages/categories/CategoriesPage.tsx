import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearCategoryError, fetchMyCategories } from "../../redux/features/categories/categorySlice";
import { CategoryList } from "./components/CategoryList";
import { CategoryForm } from "./components/CategoryForm";

export function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.categories);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyCategories());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearCategoryError());
    };
  }, [dispatch]);

  const totalActive = useMemo(
    () => items.filter((item) => !item.isArchived).length,
    [items]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <p className="mt-1 text-white/60">Organize your expense types.</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-medium"
        >
          <Plus className="h-4 w-4" />
          New Category
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-white/60">Active Categories</p>
        <h3 className="mt-1 text-3xl font-semibold">{totalActive}</h3>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <CategoryList items={items} loading={status === "loading"} />

      <CategoryForm open={open} onOpenChange={setOpen} />
    </div>
  );
}