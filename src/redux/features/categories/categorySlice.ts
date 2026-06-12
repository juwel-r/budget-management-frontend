import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseApi from "../../api/baseApi";

export type Category = {
  _id: string;
  name: string;
  isDefault: boolean;
  isArchived: boolean;
  createdAt?: string;
};

type CategoryState = {
  items: Category[];
  selected: Category | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: CategoryState = {
  items: [],
  selected: null,
  status: "idle",
  error: null,
};

export const fetchMyCategories = createAsyncThunk("categories/fetchMyCategories", async (_, { rejectWithValue }) => {
  try {
    const res = await baseApi.get("/categories/my-categories");
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Failed to load categories");
  }
});

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (payload: { name: string; isDefault?: boolean }, { rejectWithValue }) => {
    try {
      const res = await baseApi.post("/categories/create", payload);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create category");
    }
  },
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (payload: { id: string; data: { name?: string; isDefault?: boolean } }, { rejectWithValue }) => {
    try {
      const res = await baseApi.patch(`/categories/${payload.id}`, payload.data);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update category");
    }
  },
);

export const archiveCategory = createAsyncThunk("categories/archiveCategory", async (id: string, { rejectWithValue }) => {
  try {
    const res = await baseApi.patch(`/categories/archive/${id}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Failed to archive category");
  }
});

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryError(state) {
      state.error = null;
    },
    setSelectedCategory(state, action) {
      state.selected = action.payload;
    },
    clearSelectedCategory(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchMyCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(archiveCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { clearCategoryError, setSelectedCategory, clearSelectedCategory } = categorySlice.actions;

export default categorySlice.reducer;
