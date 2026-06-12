import { Archive, MoreVertical } from "lucide-react";
import { type Category, archiveCategory } from "../../../redux/features/categories/categorySlice";
import { useAppDispatch } from "../../../redux/hooks";

export function CategoryCard({ category }: { category: Category }) {
  const dispatch = useAppDispatch();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <p className="text-sm text-white/60">{category.isDefault ? "Default category" : "Custom category"}</p>
        </div>

        <button className="rounded-lg p-2 text-white/60 hover:bg-white/10">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`text-xs ${category.isArchived ? "text-red-400" : "text-emerald-400"}`}>
          {category.isArchived ? "Archived" : "Active"}
        </span>

        {!category.isArchived && (
          <button
            onClick={() => dispatch(archiveCategory(category._id))}
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