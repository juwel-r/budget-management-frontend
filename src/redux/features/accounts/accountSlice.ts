import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import baseApi from "../../api/baseApi";

export type AccountType = "cash" | "bank" | "mfs" | "card"|"other";


export type Account = {
  message?:string,
  _id: string;
  userId?: string;
  name: string;
  type: AccountType;
  openingBalance: number;
  currentBalance: number;
  isArchived: boolean;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AccountCreateInput = {
  name: string;
  type: AccountType;
  openingBalance?: number;
  isDefault?: boolean;
};

export type AccountUpdateInput = {
  name?: string;
  type?: AccountType;
  openingBalance?: number;
  isDefault?: boolean;
};

type AccountState = {
  items: Account[];
  selected: Account | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: AccountState = {
  items: [],
  selected: null,
  status: "idle",
  error: null,
};

export const fetchMyAccounts = createAsyncThunk<Account[], void, { rejectValue: string }>(
  "accounts/fetchMyAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await baseApi.get("/accounts/my-accounts");
      return res.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to load accounts");
    }
  },
);

export const createAccount = createAsyncThunk<Account, AccountCreateInput, { rejectValue: string }>(
  "accounts/createAccount",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await baseApi.post("/accounts/create", payload);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create account");
    }
  },
);

export const updateAccount = createAsyncThunk<Account, { id: string; data: AccountUpdateInput }, { rejectValue: string }>(
  "accounts/updateAccount",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await baseApi.patch(`/accounts/${id}`, data);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update account");
    }
  },
);

export const archiveAccount = createAsyncThunk<Account, string, { rejectValue: string }>(
  "accounts/archiveAccount",
  async (id, { rejectWithValue }) => {
    try {
      const res = await baseApi.patch(`/accounts/archive/${id}`);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to archive account");
    }
  },
);

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    clearAccountError(state) {
      state.error = null;
    },
    setSelectedAccount(state, action: PayloadAction<Account | null>) {
      state.selected = action.payload;
    },
    clearSelectedAccount(state) {
      state.selected = null;
    },
    setAccounts(state, action: PayloadAction<Account[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAccounts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMyAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load accounts";
      })

      .addCase(createAccount.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(archiveAccount.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { clearAccountError, setSelectedAccount, clearSelectedAccount, setAccounts } = accountSlice.actions;

export default accountSlice.reducer;
