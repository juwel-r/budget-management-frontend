import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseApi from "../../api/baseApi";

export type TransactionType = "income" | "expense" | "transfer";

export type Transaction = {
  _id: string;
  type: TransactionType;
  amount: number;
  note?: string;
  incomeSource?: string;
  transactionDate: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
  categoryId?: string;
  createdAt?: string;
};

type TransactionState = {
  items: Transaction[];
  selected: Transaction | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: TransactionState = {
  items: [],
  selected: null,
  status: "idle",
  error: null,
};

export const fetchMyTransactions = createAsyncThunk("transactions/fetchMyTransactions", async (_, { rejectWithValue }) => {
  try {
    const res = await baseApi.get("/transactions/my-transactions");
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Failed to load transactions");
  }
});

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (
    payload: {
      type: TransactionType;
      amount: number;
      sourceAccountId?: string;
      destinationAccountId?: string;
      categoryId?: string;
      note?: string;
      incomeSource?: string;
      transactionDate?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await baseApi.post("/transactions/create", payload);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create transaction");
    }
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (
    payload: {
      id: string;
      data: Partial<{
        type: TransactionType;
        amount: number;
        sourceAccountId: string;
        destinationAccountId: string;
        categoryId: string;
        note: string;
        incomeSource: string;
        transactionDate: string;
      }>;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await baseApi.patch(`/transactions/${payload.id}`, payload.data);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update transaction");
    }
  },
);

export const deleteTransaction = createAsyncThunk("transactions/deleteTransaction", async (id: string, { rejectWithValue }) => {
  try {
    await baseApi.delete(`/transactions/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Failed to delete transaction");
  }
});

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearTransactionError(state) {
      state.error = null;
    },
    setSelectedTransaction(state, action) {
      state.selected = action.payload;
    },
    clearSelectedTransaction(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchMyTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearTransactionError, setSelectedTransaction, clearSelectedTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
